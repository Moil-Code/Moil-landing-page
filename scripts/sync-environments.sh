#!/usr/bin/env bash

# Sync staging and production main branches.
#
# The same file lives in both repositories and always pulls INTO the checkout
# it is run from:
#   - run in Moil-landing-page (production): merges staging main into production;
#   - run in Moil-Landing-Page-Staging:      merges production main into staging.
#
# Environment-owned files (deploy workflow, link origins, their safety tests)
# never cross over: the checkout keeps its own copy, and files that only exist
# on the other side are dropped. The result is tested and built before the
# script asks to push. It never force-pushes.

set -Eeuo pipefail

STAGING_REMOTE_URL="git@github-andres:Moil-Code/Moil-Landing-Page-Staging.git"
PRODUCTION_REMOTE_URL="git@github-andres:Moil-Code/Moil-landing-page.git"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_andres}"
AUTO_CONFIRM=0
DRY_RUN=0
SKIP_CHECKS=0
SYNC_STARTED=0

# Each environment keeps its own version of these. A path the receiving side
# does not have (e.g. evals/productionDeploy.test.js when syncing into staging)
# is removed from the merge result instead.
ENVIRONMENT_OWNED_PATHS=(
  ".github/deploy.sh"
  ".github/workflows/deploy.yml"
  ".github/workflows/tests.yml"
  "DEPLOYMENT.md"
  "src/common/constants/baseUrl.tsx"
  "evals/productionDeploy.test.js"
  "evals/linkConfigProduction.test.js"
  "evals/stagebetaDeploy.test.js"
  "evals/linkConfig.test.js"
)

bold=""
green=""
yellow=""
red=""
reset=""
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  bold="$(tput bold 2>/dev/null || true)"
  green="$(tput setaf 2 2>/dev/null || true)"
  yellow="$(tput setaf 3 2>/dev/null || true)"
  red="$(tput setaf 1 2>/dev/null || true)"
  reset="$(tput sgr0 2>/dev/null || true)"
fi

log() { printf '\n%s▸ %s%s\n' "$bold" "$*" "$reset"; }
ok() { printf '  %s✓%s %s\n' "$green" "$reset" "$*"; }
warn() { printf '  %s⚠%s %s\n' "$yellow" "$reset" "$*"; }
die() { printf '\n%s✗ %s%s\n' "$red" "$*" "$reset" >&2; exit 1; }

usage() {
  cat <<'USAGE'
Usage: npm run sync -- [--yes] [--dry-run] [--skip-checks]

Run in production  -> pulls staging changes into production.
Run in staging     -> pulls production changes into staging.

Options:
  --yes          Skip the final y/N confirmation before pushing.
  --dry-run      Merge and validate locally, but do not push.
  --skip-checks  Skip `npm test` and `npm run build` (not recommended).
  --help         Show this help.

Optional environment variables:
  SSH_KEY_PATH   GitHub SSH private key (default: ~/.ssh/id_ed25519_andres).
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes) AUTO_CONFIRM=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --skip-checks) SKIP_CHECKS=1 ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; die "Unknown option: $1" ;;
  esac
  shift
done

confirm() {
  local answer=""
  [[ "$AUTO_CONFIRM" == "1" ]] && return 0
  printf '\n%s? %s [y/N] %s' "$yellow" "$1" "$reset"
  read -r answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
[[ -n "$REPO" ]] || die "Run this script from one of the Moil landing page checkouts."
g() { git -C "$REPO" "$@"; }

restore_generated_types() {
  if [[ "$SYNC_STARTED" == "1" ]] && ! g diff --quiet -- next-env.d.ts 2>/dev/null; then
    g restore --worktree -- next-env.d.ts || true
  fi
}
trap restore_generated_types EXIT

CURRENT_ORIGIN="$(g remote get-url origin 2>/dev/null || true)"
case "$CURRENT_ORIGIN" in
  "$PRODUCTION_REMOTE_URL")
    TARGET="production"; SOURCE="staging"; SOURCE_URL="$STAGING_REMOTE_URL" ;;
  "$STAGING_REMOTE_URL")
    TARGET="staging"; SOURCE="production"; SOURCE_URL="$PRODUCTION_REMOTE_URL" ;;
  *)
    die "This checkout has an unexpected origin: '$CURRENT_ORIGIN'. Nothing was changed." ;;
esac

log "Stage 1/5 · Verify the $TARGET checkout"
if [[ -n "$(g status --porcelain)" ]]; then
  g status --short >&2
  die "The $TARGET checkout has uncommitted changes. Commit or stash them before syncing."
fi
ok "pulling $SOURCE → $TARGET"
ok "checkout: $REPO"

log "Stage 2/5 · Verify GitHub SSH access"
if ! git ls-remote "$CURRENT_ORIGIN" HEAD >/dev/null 2>&1 \
  || ! git ls-remote "$SOURCE_URL" HEAD >/dev/null 2>&1; then
  warn "GitHub could not use the configured SSH identity."
  [[ -f "$SSH_KEY_PATH" ]] || die "SSH key not found: $SSH_KEY_PATH"
  printf '  Unlocking %s. Enter its passphrase locally if prompted.\n' "$SSH_KEY_PATH"
  ssh-add "$SSH_KEY_PATH"
  git ls-remote "$CURRENT_ORIGIN" HEAD >/dev/null 2>&1 \
    || die "SSH still cannot read the $TARGET repository."
  git ls-remote "$SOURCE_URL" HEAD >/dev/null 2>&1 \
    || die "SSH still cannot read the $SOURCE repository."
fi
ok "both GitHub repositories are reachable over SSH"

log "Stage 3/5 · Merge $SOURCE main into $TARGET"
g fetch --prune origin main
g switch --quiet main
g merge --ff-only --quiet origin/main \
  || die "Local $TARGET main has diverged from origin/main. Reconcile it before syncing."
[[ "$(g rev-parse main)" == "$(g rev-parse origin/main)" ]] \
  || die "Local $TARGET main has commits not pushed to origin/main. Push them first, then re-run."

EXISTING_SOURCE_URL="$(g remote get-url "$SOURCE" 2>/dev/null || true)"
if [[ -z "$EXISTING_SOURCE_URL" ]]; then
  g remote add "$SOURCE" "$SOURCE_URL"
elif [[ "$EXISTING_SOURCE_URL" != "$SOURCE_URL" ]]; then
  die "Remote '$SOURCE' points to '$EXISTING_SOURCE_URL', not '$SOURCE_URL'."
fi
g fetch --prune "$SOURCE" main

SOURCE_SHA="$(g rev-parse "$SOURCE/main")"
TARGET_SHA="$(g rev-parse main)"

if g merge-base --is-ancestor "$SOURCE_SHA" "$TARGET_SHA"; then
  ok "$TARGET already contains $SOURCE main ($SOURCE_SHA). Nothing to sync."
  exit 0
fi
g merge-base "$TARGET_SHA" "$SOURCE_SHA" >/dev/null \
  || die "Staging and production have unrelated histories. Refusing to combine them."

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="backup/$TARGET-before-$TIMESTAMP"
SYNC_BRANCH="sync/$SOURCE-into-$TARGET-$TIMESTAMP"
g branch "$BACKUP_BRANCH" "$TARGET_SHA"
g switch --quiet -c "$SYNC_BRANCH" "$TARGET_SHA"
SYNC_STARTED=1

# Merge without committing so environment-owned paths can be put back first.
# Conflicts confined to those paths are resolved by that same step.
g merge --no-ff --no-commit "$SOURCE/main" >/dev/null 2>&1 || true
g rev-parse -q --verify MERGE_HEAD >/dev/null \
  || die "git could not start the merge. Run 'git -C \"$REPO\" merge $SOURCE/main' to see why."

for path in "${ENVIRONMENT_OWNED_PATHS[@]}"; do
  if g cat-file -e "$TARGET_SHA:$path" 2>/dev/null; then
    g checkout "$TARGET_SHA" -- "$path"
  else
    g rm -q --force --ignore-unmatch -- "$path"
  fi
done

CONFLICTS="$(g diff --name-only --diff-filter=U)"
if [[ -n "$CONFLICTS" ]]; then
  printf '%s\n' "$CONFLICTS" | sed 's/^/    /' >&2
  warn "These files conflict between $SOURCE and $TARGET. Nothing was pushed."
  warn "Resolve them in $REPO and run 'git commit', or abandon with:"
  warn "  git -C '$REPO' merge --abort && git -C '$REPO' switch main"
  exit 1
fi

g commit --quiet --no-edit -m "chore: sync $SOURCE into $TARGET"

# Page dates are generated from git history, which the merge just changed.
# Fold the refresh into the sync commit; the test suite rejects a stale file.
(cd "$REPO" && node scripts/page-dates.mjs >/dev/null)
if ! g diff --quiet -- src/common/seo/pageDates.json; then
  g add -- src/common/seo/pageDates.json
  g commit --quiet --amend --no-edit
  ok "refreshed src/common/seo/pageDates.json"
fi
ok "merged $SOURCE $SOURCE_SHA into $SYNC_BRANCH"
ok "recovery branch: $BACKUP_BRANCH"

log "Stage 4/5 · Test the $TARGET result"
if [[ "$SKIP_CHECKS" == "1" ]]; then
  warn "--skip-checks selected: tests and build were not run"
else
  if [[ ! -d "$REPO/node_modules" ]]; then
    command -v yarn >/dev/null 2>&1 \
      || die "node_modules is missing and yarn is unavailable. Install Yarn and re-run."
    (cd "$REPO" && yarn install --frozen-lockfile)
  fi
  (cd "$REPO" && npm test)
  (cd "$REPO" && npm run build)

  # Next rewrites these type references between dev and production builds.
  if ! g diff --quiet -- next-env.d.ts; then
    g restore --worktree -- next-env.d.ts
  fi
  if [[ -n "$(g status --porcelain)" ]]; then
    g status --short >&2
    die "The build left unexpected changes in $REPO. Nothing was pushed."
  fi
  ok "tests and build passed"
fi

printf '\n  Commits entering %s:\n' "$TARGET"
g log --oneline --no-decorate --no-merges "$TARGET_SHA..$SYNC_BRANCH" | sed 's/^/    /'
printf '\n  Files changed:\n'
g diff --stat "$TARGET_SHA" "$SYNC_BRANCH" | tail -1 | sed 's/^/   /'

log "Stage 5/5 · Push $TARGET main"
if [[ "$DRY_RUN" == "1" ]]; then
  warn "dry run selected: $TARGET was not pushed"
  printf '  Validated branch: %s\n' "$SYNC_BRANCH"
  printf '  Clean up with: git switch main && git branch -D %s %s\n' "$SYNC_BRANCH" "$BACKUP_BRANCH"
  exit 0
fi

if ! confirm "Push this validated merge to $TARGET main now?"; then
  warn "cancelled: $TARGET was not pushed"
  printf '  Validated branch remains available: %s\n' "$SYNC_BRANCH"
  exit 0
fi

# A normal push fails safely if somebody updated main after the fetch, or if
# main is protected. In that case the branch is pushed for a pull request.
if g push origin "$SYNC_BRANCH:main"; then
  g switch --quiet main
  g merge --ff-only --quiet "$SYNC_BRANCH"
  g branch -q -D "$SYNC_BRANCH"
  ok "$TARGET main now contains $SOURCE commit $SOURCE_SHA"
  printf '\n  Recovery branch: %s\n' "$BACKUP_BRANCH"
  printf '  %s commit: %s\n\n' "$TARGET" "$(g rev-parse HEAD)"
else
  warn "Pushing to $TARGET main was rejected. Pushing the sync branch instead."
  g push -u origin "$SYNC_BRANCH"
  printf '\n  Open a pull request into main:\n'
  printf '    gh pr create --repo Moil-Code/%s --base main --head %s --title "chore: sync %s into %s" --fill\n\n' \
    "$(basename "${CURRENT_ORIGIN%.git}")" "$SYNC_BRANCH" "$SOURCE" "$TARGET"
fi
