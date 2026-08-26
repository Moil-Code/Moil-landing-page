#!/usr/bin/env bash
#
# Server-side deploy for the Moil landing page: fetch the branch, install if the
# lockfile moved, BUILD, reload PM2, verify the site answers, roll back if it
# does not.
#
# It runs ON THE SERVER but lives IN THE REPO: `.github/workflows/deploy.yml`
# ships it to the instance over AWS SSM and runs it there, so the deploy
# procedure is reviewed in a diff like any other code, and you can run the exact
# same thing by hand:
#
#   APP_PATH=/srv/moil-landing-page PM2_NAME=moil-landing bash .github/deploy.sh
#
# Every step is idempotent — re-running it on an up-to-date checkout rebuilds,
# reloads and exits clean.
#
# THIS IS A NEXT.JS APP, and three things follow from that which do not apply to
# the API repos running the same transport:
#
#   1. There is a BUILD. `next build` writes .next/ in place, so a failed build
#      can leave the tree in a state the running server is already serving from.
#      The rollback therefore RE-BUILDS at the previous commit; a git reset alone
#      would leave the new commit's .next/ behind the old commit's source.
#   2. Every NEXT_PUBLIC_* variable is INLINED INTO THE BUNDLE AT BUILD TIME.
#      Writing .env and reloading PM2 does not change them — only a rebuild does.
#      So .env is written BEFORE the build here, not just before the reload.
#   3. Dependencies install with YARN. `npm ci` cannot work in this repo: the
#      committed package-lock.json is out of sync with package.json (it is
#      missing caniuse-lite), and react 19 conflicts with lucide-react's declared
#      peer range, so npm additionally needs --legacy-peer-deps. yarn.lock IS in
#      sync and vercel.json already declares yarn as the install command.
#
# Environment (only APP_PATH is required):
#   APP_PATH              absolute path of the checkout on the server
#   PM2_NAME              PM2 process name                        (moil-landing)
#   DEPLOY_BRANCH         branch to deploy                         (main)
#   DEPLOY_SHA            commit CI expected to deploy; logged only
#   DEPLOY_ENV_B64        base64 .env content; when set, rewrites .env BEFORE
#                         the build. Empty = leave .env alone.
#   ENV_FILE              which file to write                      (.env.local)
#   PM2_ECOSYSTEM         PM2 config, relative to APP_PATH         (ecosystem.config.js)
#   HEALTH_URL            polled after reload                      (http://127.0.0.1:3000/)
#   HEALTH_RETRIES        polls before declaring failure           (20, ~2s apart)
#   DEPLOY_ROLLBACK       1 = restore previous commit on failure   (1)
#   FORCE_INSTALL         1 = install even if the lockfile is unchanged
#   FORCE_BUILD           1 = build even if nothing changed

set -Eeuo pipefail

PM2_NAME="${PM2_NAME:-moil-landing}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
ENV_FILE="${ENV_FILE:-.env.local}"
PM2_ECOSYSTEM="${PM2_ECOSYSTEM:-ecosystem.config.js}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/}"
HEALTH_RETRIES="${HEALTH_RETRIES:-20}"
DEPLOY_ROLLBACK="${DEPLOY_ROLLBACK:-1}"
FORCE_INSTALL="${FORCE_INSTALL:-0}"
FORCE_BUILD="${FORCE_BUILD:-0}"

# ecosystem.config.js reads this; export so `pm2 startOrReload` evaluates the
# config exactly as this script describes it.
export PM2_NAME

log()  { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
info() { printf '  %s\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ── Toolchain ───────────────────────────────────────────────────────────────
# A non-login shell does not read ~/.bashrc, so nvm-installed node, yarn and pm2
# are absent from PATH even though they work fine when you log in by hand. That
# single difference is the most common way a working server fails its first
# automated deploy, so source nvm explicitly before giving up. (The deploy
# arrives via SSM as root and drops to this user with `runuser … env -i`, so the
# environment is deliberately bare — HOME is set, and nvm is found from it.)
if ! command -v pm2 >/dev/null 2>&1 || ! command -v yarn >/dev/null 2>&1; then
	for nvm_sh in "$HOME/.nvm/nvm.sh" /usr/local/nvm/nvm.sh; do
		# shellcheck disable=SC1090
		[ -s "$nvm_sh" ] && . "$nvm_sh" >/dev/null 2>&1 && break
	done
fi
command -v node >/dev/null 2>&1 || die "node is not on PATH in a non-login shell. See DEPLOYMENT.md."
command -v yarn >/dev/null 2>&1 || die "yarn is not on PATH in a non-login shell (try: npm i -g yarn, or corepack enable). See DEPLOYMENT.md."
command -v curl >/dev/null 2>&1 || die "curl is not installed — the post-deploy health check needs it (apt-get install curl)."
command -v pm2  >/dev/null 2>&1 || die "pm2 is not on PATH in a non-login shell (try: npm i -g pm2). See DEPLOYMENT.md."

[ -n "${APP_PATH:-}" ] || die "APP_PATH is not set."
cd "$APP_PATH" 2>/dev/null || die "APP_PATH does not exist: $APP_PATH"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "$APP_PATH is not a git checkout. Do the one-time setup in DEPLOYMENT.md first."

log "Deploying $DEPLOY_BRANCH to $APP_PATH as PM2 app '$PM2_NAME'"
info "node $(node -v)  ·  yarn $(yarn -v)  ·  pm2 $(pm2 -v)"

# ── .env from the ENV secret (opt-in) ───────────────────────────────────────
# OFF unless DEPLOY_ENV_B64 arrives non-empty. The workflow only populates it
# when DEPLOY_WRITE_ENV is exactly "true", so the opt-in is enforced on BOTH
# sides of the wire.
#
# This runs BEFORE the build on purpose. Every variable this app reads is
# NEXT_PUBLIC_*, which Next INLINES INTO THE CLIENT BUNDLE at build time — so a
# .env written after the build changes nothing at all, and a .env written
# without a rebuild is a silent no-op that looks like a successful deploy.
#
# The decoded bytes go to a FILE, never through "$(...)" — command substitution
# strips trailing newlines, so a .env ending in one would compare unequal to a
# byte-identical secret and be rewritten on a deploy that changed nothing.
DEPLOY_ENV_TMP=""
ENV_CHANGED=0
# The explicit `return 0` is load-bearing under `set -e`. When no ENV secret was
# sent, DEPLOY_ENV_TMP is empty, so `[ -n "" ]` fails, the && short-circuits, and
# that failure becomes the FUNCTION's status. bash runs this on EXIT, and under
# `set -e` a trap whose last command fails overrides the status the script asked
# for — so `exit 0` after a perfect deploy left the shell returning 1. SSM then
# reported Failed, and the workflow printed "the deploy ran and failed … it has
# already rolled back", none of which happened: the build, reload and health
# check had all passed and the new commit was live. A green deploy that reports
# red is worse than a red one, because the next real failure looks identical.
cleanup_env_tmp() { [ -n "$DEPLOY_ENV_TMP" ] && rm -f "$DEPLOY_ENV_TMP"; return 0; }
trap cleanup_env_tmp EXIT

if [ -n "${DEPLOY_ENV_B64:-}" ]; then
	# 077 so the decoded secret is never briefly world-readable in /tmp.
	DEPLOY_ENV_TMP="$(umask 077; mktemp "${TMPDIR:-/tmp}/deploy-env.XXXXXXXX")" \
		|| die "could not create a temp file for the ENV secret."
	printf '%s' "$DEPLOY_ENV_B64" | base64 -d > "$DEPLOY_ENV_TMP" \
		|| die "DEPLOY_ENV_B64 did not decode — refusing to touch $ENV_FILE."
	# A decode yielding nothing would truncate a working env file to zero bytes.
	[ -s "$DEPLOY_ENV_TMP" ] || die "ENV secret decoded to nothing — refusing to overwrite $ENV_FILE."

	if [ ! -f "$ENV_FILE" ]; then
		info "no existing $ENV_FILE — writing one from the ENV secret"
		ENV_CHANGED=1
	elif cmp -s "$DEPLOY_ENV_TMP" "$ENV_FILE"; then
		info "$ENV_FILE already matches the ENV secret — left alone"
	else
		cp -p "$ENV_FILE" "$ENV_FILE.bak.$(date +%Y%m%d%H%M%S)"
		info "existing $ENV_FILE backed up before rewrite"
		ENV_CHANGED=1
	fi
	# `>` on an existing file keeps its old mode, so chmod is what makes 0600 a
	# guarantee rather than something that happens to hold on a fresh box.
	cat "$DEPLOY_ENV_TMP" > "$ENV_FILE"
	chmod 600 "$ENV_FILE"
	info "$ENV_FILE written from the ENV secret ($(wc -l < "$ENV_FILE") lines, mode $(stat -c '%a' "$ENV_FILE"))"
fi

PREV_SHA="$(git rev-parse HEAD)"
info "current: $PREV_SHA"

# ── Fetch and move the working tree ─────────────────────────────────────────
log "Fetching origin/$DEPLOY_BRANCH"
git fetch --prune origin "$DEPLOY_BRANCH"

# `reset --hard` rather than `pull`: a merge/rebase can stop on a conflict and
# leave the server mid-merge, and a server is not a place to resolve conflicts.
# Deliberately no `git clean` — .env.local, .next/ and any operator-uploaded
# files are untracked, and deleting them is not something a deploy should do.
git checkout -q "$DEPLOY_BRANCH" 2>/dev/null || git checkout -q -B "$DEPLOY_BRANCH" "origin/$DEPLOY_BRANCH"
git reset --hard "origin/$DEPLOY_BRANCH"

NEW_SHA="$(git rev-parse HEAD)"
info "deployed: $NEW_SHA"
if [ -n "${DEPLOY_SHA:-}" ] && [ "$DEPLOY_SHA" != "$NEW_SHA" ]; then
	# Not an error: another commit landed while this run was queued. That commit
	# has its own deploy run, which will overwrite this one.
	info "note: CI expected $DEPLOY_SHA — a newer commit is already on the branch."
fi

# ── Dependencies ────────────────────────────────────────────────────────────
# `yarn install --frozen-lockfile` — NOT `npm ci`. See the header: the committed
# package-lock.json is out of sync with package.json, and react 19 conflicts
# with lucide-react's peer range, so npm fails twice over. --frozen-lockfile is
# the point: it REFUSES rather than silently resolving a different tree when
# yarn.lock does not match package.json, which is what makes a deploy reproduce
# the build that was tested.
NEEDS_INSTALL=0
[ -d node_modules ] || NEEDS_INSTALL=1
[ "$FORCE_INSTALL" = "1" ] && NEEDS_INSTALL=1
if [ "$PREV_SHA" != "$NEW_SHA" ] && ! git diff --quiet "$PREV_SHA" "$NEW_SHA" -- yarn.lock package.json; then
	NEEDS_INSTALL=1
fi

if [ "$NEEDS_INSTALL" = "1" ]; then
	log "Installing dependencies (yarn install --frozen-lockfile)"
	yarn install --frozen-lockfile
else
	log "Dependencies unchanged — skipping install"
fi

# ── Build ───────────────────────────────────────────────────────────────────
# Build when the code moved, when dependencies were reinstalled, when the env
# file changed (NEXT_PUBLIC_* is compiled in), or when there is no build to
# serve. Anything else is a no-op deploy and rebuilding would only add risk.
NEEDS_BUILD=0
[ -d .next ] || NEEDS_BUILD=1
[ "$PREV_SHA" != "$NEW_SHA" ] && NEEDS_BUILD=1
[ "$NEEDS_INSTALL" = "1" ] && NEEDS_BUILD=1
[ "$ENV_CHANGED" = "1" ] && NEEDS_BUILD=1
[ "$FORCE_BUILD" = "1" ] && NEEDS_BUILD=1

if [ "$NEEDS_BUILD" = "1" ]; then
	log "Building (yarn build)"
	# A failed build must not reach the reload: PM2 would restart onto a tree
	# whose .next/ is half-written. Failing here leaves the OLD build running and
	# still serving, which is the best available outcome.
	yarn build || die "next build failed. The previous build is still running and still serving — nothing was reloaded."
else
	log "Nothing changed — skipping build"
fi

# ── Reload ──────────────────────────────────────────────────────────────────
[ -f "$PM2_ECOSYSTEM" ] || die "PM2 config not found: $APP_PATH/$PM2_ECOSYSTEM"

log "Reloading PM2"
# startOrReload starts the app if this is the first deploy and reloads it
# otherwise; --update-env re-reads the environment instead of carrying the one
# the process was originally started with.
pm2 startOrReload "$PM2_ECOSYSTEM" --update-env

# Persist the process list so `pm2 resurrect` (the systemd unit from
# `pm2 startup`) brings the same app back after a server reboot.
pm2 save --force >/dev/null
pm2 list

# ── Verify ──────────────────────────────────────────────────────────────────
# Two independent checks, each catching something the other cannot: the HTTP
# port actually answers, and PM2 is not silently restarting the app behind that
# answer. Scoped to the app THIS script manages — failing a deploy because some
# unrelated app on the box is down would make the check useless noise.
managed_state() {
	pm2 jlist 2>/dev/null | MANAGED="$PM2_NAME" node -e '
		let raw = "";
		process.stdin.on("data", (c) => (raw += c));
		process.stdin.on("end", () => {
			const want = String(process.env.MANAGED || "");
			let apps = [];
			try { apps = JSON.parse(raw); } catch (_) { process.exit(0); }
			const a = apps.find((x) => x.name === want);
			if (!a) { console.log(want + "=missing:0"); return; }
			console.log(want + "=" + a.pm2_env?.status + ":" + (a.pm2_env?.restart_time ?? 0));
		});
	' 2>/dev/null || true
}

# Sampled AFTER the reload, so the reload's own restart is already counted and
# any further increase during the health window is a crash loop rather than the
# deploy itself.
STATE_BEFORE="$(managed_state)"
info "pm2: ${STATE_BEFORE:-unreadable}"

log "Health check: $HEALTH_URL"
healthy=0
for i in $(seq 1 "$HEALTH_RETRIES"); do
	sleep 2
	# curl writes the status via -w AND exits non-zero when it never connected,
	# so the failure value is ASSIGNED to the variable rather than appended to
	# what -w already printed. Appending produced "000000", which is neither
	# equal to "000" nor >= 500 — an unreachable app passing as healthy.
	code="$(curl -s -o /tmp/deploy-health.$$ -w '%{http_code}' --max-time 10 "$HEALTH_URL")" || code="000"
	case "$code" in
		[0-9][0-9][0-9]) ;;
		*) code="000" ;;
	esac
	if [ "$code" -ge 200 ] && [ "$code" -lt 500 ]; then
		info "HTTP $code after ${i} attempt(s)"
		healthy=1
		break
	fi
	info "attempt $i/$HEALTH_RETRIES → ${code}"
done

if [ "$healthy" = "0" ] && [ -s /tmp/deploy-health.$$ ]; then
	info "last response body:"
	head -c 500 /tmp/deploy-health.$$ >&2 || true
	printf '\n' >&2
fi

if [ "$healthy" = "1" ]; then
	STATE_AFTER="$(managed_state)"
	info "pm2: ${STATE_AFTER:-unreadable}"
	if [ -n "$STATE_AFTER" ]; then
		# A crash loop can answer one request between restarts, so "it replied
		# once" is not proof it is up. An app that restarted again while we were
		# polling is not deployed, whatever that one reply said.
		status="${STATE_AFTER#*=}"; status="${status%%:*}"
		[ "$status" = "online" ] || { info "$PM2_NAME is $status"; healthy=0; }
		if [ -n "$STATE_BEFORE" ] && [ "$STATE_BEFORE" != "$STATE_AFTER" ]; then
			info "restart count changed during the health window — $STATE_BEFORE → $STATE_AFTER"
			healthy=0
		fi
	fi
fi

rm -f /tmp/deploy-health.$$

if [ "$healthy" = "1" ]; then
	log "Deployed $NEW_SHA"
	exit 0
fi

# ── Rollback ────────────────────────────────────────────────────────────────
printf '\n\033[31m✗ health check failed after reload\033[0m\n' >&2
pm2 logs "$PM2_NAME" --nostream --lines 40 >&2 || true

if [ "$DEPLOY_ROLLBACK" != "1" ] || [ "$PREV_SHA" = "$NEW_SHA" ]; then
	die "Server is serving $NEW_SHA and is not healthy. Rollback disabled or nothing to roll back to."
fi

log "Rolling back to $PREV_SHA"
git reset --hard "$PREV_SHA"
# The rollback REBUILDS, and that is the whole point of it on a Next app: .next/
# currently holds the broken commit's output, so resetting the source alone
# would leave the old code serving the new build. If this rebuild itself fails
# there is nothing further to try automatically — say so rather than reloading
# onto a tree we know is inconsistent.
if [ "$NEEDS_INSTALL" = "1" ]; then
	yarn install --frozen-lockfile
fi
yarn build || die "Rolled back the source to $PREV_SHA but the REBUILD failed, so .next/ still holds $NEW_SHA's output. The site is serving a broken build — fix it on the box: cd $APP_PATH && yarn install --frozen-lockfile && yarn build && pm2 reload $PM2_NAME"
pm2 startOrReload "$PM2_ECOSYSTEM" --update-env
pm2 save --force >/dev/null

# The rollback restores the previous COMMIT. If the failure was environmental —
# a missing env var, a port already taken, a full disk — the old code fails the
# same way, so this exits non-zero either way and the run stays red.
sleep 3
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$HEALTH_URL" || echo 000)"
if [ "$code" != "000" ] && [ "$code" -lt 500 ]; then
	die "Rolled back to $PREV_SHA (healthy). The deployed commit $NEW_SHA is broken."
fi
die "Rolled back to $PREV_SHA but the site is STILL unhealthy (HTTP $code) — the cause is the server/environment, not the commit."
