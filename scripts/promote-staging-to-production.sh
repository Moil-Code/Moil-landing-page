#!/usr/bin/env bash

# Promote the staging main branch into the production repository.
#
# This same file works from either local checkout:
#   - from Moil-Landing-Page-Staging, it updates the sibling production checkout;
#   - from Moil-landing-page, it fetches and merges staging into that checkout.
#
# It promotes Git history only. The production repository's own deployment
# workflow is responsible for deploying the resulting production main branch.

set -Eeuo pipefail

STAGING_REMOTE_URL="git@github-andres:Moil-Code/Moil-Landing-Page-Staging.git"
PRODUCTION_REMOTE_URL="git@github-andres:Moil-Code/Moil-landing-page.git"
STAGING_REMOTE_NAME="staging"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_andres}"
AUTO_CONFIRM=0
DRY_RUN=0
PROMOTION_STARTED=0
PRODUCTION_DIR="${PRODUCTION_DIR:-}"

# These files describe the environment, not the shared application. Production
# keeps its own copy across every staging merge. Staging-only guards are removed
# from the production result before validation.
PRODUCTION_ONLY_PATHS=(
  ".github/deploy.sh"
  ".github/workflows/deploy.yml"
  ".github/workflows/tests.yml"
  "DEPLOYMENT.md"
  "src/common/constants/baseUrl.tsx"
  "evals/productionDeploy.test.js"
  "evals/linkConfigProduction.test.js"
)
STAGING_ONLY_PATHS=(
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
Usage: npm run promote:production -- [--yes] [--dry-run]

Options:
  --yes      Skip the final y/N confirmation before pushing production.
  --dry-run  Merge and validate locally, but do not push production.
  --help     Show this help.

Optional environment variables:
  STAGING_DIR     Absolute path to the staging checkout.
  PRODUCTION_DIR  Absolute path to the production checkout.
  SSH_KEY_PATH    GitHub SSH private key (default: ~/.ssh/id_ed25519_andres).
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes) AUTO_CONFIRM=1 ;;
    --dry-run) DRY_RUN=1 ;;
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

repo_root() {
  git -C "$1" rev-parse --show-toplevel 2>/dev/null
}

require_clean() {
  local directory="$1"
  local label="$2"
  if [[ -n "$(git -C "$directory" status --porcelain)" ]]; then
    git -C "$directory" status --short >&2
    die "$label has uncommitted changes. Commit or stash them before promoting."
  fi
}

require_origin() {
  local directory="$1"
  local expected="$2"
  local label="$3"
  local actual
  actual="$(git -C "$directory" remote get-url origin 2>/dev/null || true)"
  [[ "$actual" == "$expected" ]] \
    || die "$label origin is '$actual'; expected '$expected'. Nothing was changed."
}

resolve_checkout() {
  local configured="$1"
  local fallback="$2"
  local label="$3"
  local resolved=""

  if [[ -n "$configured" ]]; then
    resolved="$(repo_root "$configured" || true)"
  elif [[ -d "$fallback/.git" ]]; then
    resolved="$(repo_root "$fallback" || true)"
  fi

  [[ -n "$resolved" ]] \
    || die "$label checkout was not found. Set ${label}_DIR to its absolute path."
  printf '%s' "$resolved"
}

restore_generated_types() {
  if [[ "$PROMOTION_STARTED" == "1" && -n "$PRODUCTION_DIR" ]] \
    && git -C "$PRODUCTION_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    && ! git -C "$PRODUCTION_DIR" diff --quiet -- next-env.d.ts; then
    git -C "$PRODUCTION_DIR" restore --worktree -- next-env.d.ts || true
  fi
}
trap restore_generated_types EXIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_ROOT="$(repo_root "$SCRIPT_DIR" || true)"
[[ -n "$CURRENT_ROOT" ]] || die "Run this script from one of the Moil Git checkouts."

CURRENT_ORIGIN="$(git -C "$CURRENT_ROOT" remote get-url origin 2>/dev/null || true)"
PARENT_DIR="$(dirname "$CURRENT_ROOT")"

case "$CURRENT_ORIGIN" in
  "$STAGING_REMOTE_URL")
    STAGING_DIR="$(resolve_checkout "${STAGING_DIR:-$CURRENT_ROOT}" "$PARENT_DIR/Moil-Landing-Page-Staging" "STAGING")"
    PRODUCTION_DIR="$(resolve_checkout "${PRODUCTION_DIR:-}" "$PARENT_DIR/Moil-landing-page" "PRODUCTION")"
    RUN_LOCATION="staging"
    ;;
  "$PRODUCTION_REMOTE_URL")
    PRODUCTION_DIR="$(resolve_checkout "${PRODUCTION_DIR:-$CURRENT_ROOT}" "$PARENT_DIR/Moil-landing-page" "PRODUCTION")"
    STAGING_DIR="$(resolve_checkout "${STAGING_DIR:-}" "$PARENT_DIR/Moil-Landing-Page-Staging" "STAGING")"
    RUN_LOCATION="production"
    ;;
  *)
    die "This checkout has an unexpected origin: '$CURRENT_ORIGIN'. Nothing was changed."
    ;;
esac

log "Stage 1/5 · Verify both repositories"
require_origin "$STAGING_DIR" "$STAGING_REMOTE_URL" "Staging"
require_origin "$PRODUCTION_DIR" "$PRODUCTION_REMOTE_URL" "Production"
require_clean "$STAGING_DIR" "Staging"
require_clean "$PRODUCTION_DIR" "Production"
ok "running from the $RUN_LOCATION checkout"
ok "staging: $STAGING_DIR"
ok "production: $PRODUCTION_DIR"

log "Stage 2/5 · Verify GitHub SSH access"
if ! git ls-remote "$STAGING_REMOTE_URL" HEAD >/dev/null 2>&1 \
  || ! git ls-remote "$PRODUCTION_REMOTE_URL" HEAD >/dev/null 2>&1; then
  warn "GitHub could not use the configured SSH identity."
  [[ -f "$SSH_KEY_PATH" ]] || die "SSH key not found: $SSH_KEY_PATH"
  printf '  Unlocking %s. Enter its passphrase locally if prompted.\n' "$SSH_KEY_PATH"
  ssh-add "$SSH_KEY_PATH"
  git ls-remote "$STAGING_REMOTE_URL" HEAD >/dev/null 2>&1 \
    || die "SSH still cannot read the staging repository."
  git ls-remote "$PRODUCTION_REMOTE_URL" HEAD >/dev/null 2>&1 \
    || die "SSH still cannot read the production repository."
fi
ok "both GitHub repositories are reachable over SSH"

log "Stage 3/5 · Update main and prepare the promotion"
git -C "$STAGING_DIR" fetch --prune origin main
git -C "$STAGING_DIR" switch main
git -C "$STAGING_DIR" merge --ff-only origin/main
[[ "$(git -C "$STAGING_DIR" rev-parse main)" == "$(git -C "$STAGING_DIR" rev-parse origin/main)" ]] \
  || die "Staging main has commits that have not been pushed to staging origin/main. Push staging first, then re-run."

git -C "$PRODUCTION_DIR" fetch --prune origin main
git -C "$PRODUCTION_DIR" switch main
git -C "$PRODUCTION_DIR" merge --ff-only origin/main
[[ "$(git -C "$PRODUCTION_DIR" rev-parse main)" == "$(git -C "$PRODUCTION_DIR" rev-parse origin/main)" ]] \
  || die "Production main has local commits that are not on production origin/main. Push or reconcile them before promoting."

EXISTING_STAGING_URL="$(git -C "$PRODUCTION_DIR" remote get-url "$STAGING_REMOTE_NAME" 2>/dev/null || true)"
if [[ -z "$EXISTING_STAGING_URL" ]]; then
  git -C "$PRODUCTION_DIR" remote add "$STAGING_REMOTE_NAME" "$STAGING_REMOTE_URL"
elif [[ "$EXISTING_STAGING_URL" != "$STAGING_REMOTE_URL" ]]; then
  die "Production remote '$STAGING_REMOTE_NAME' points to '$EXISTING_STAGING_URL', not '$STAGING_REMOTE_URL'."
fi
git -C "$PRODUCTION_DIR" fetch --prune "$STAGING_REMOTE_NAME" main

STAGING_SHA="$(git -C "$PRODUCTION_DIR" rev-parse "$STAGING_REMOTE_NAME/main")"
PRODUCTION_SHA="$(git -C "$PRODUCTION_DIR" rev-parse main)"

if git -C "$PRODUCTION_DIR" merge-base --is-ancestor "$STAGING_SHA" "$PRODUCTION_SHA"; then
  ok "production already contains staging commit $STAGING_SHA"
  exit 0
fi

git -C "$PRODUCTION_DIR" merge-base "$PRODUCTION_SHA" "$STAGING_SHA" >/dev/null \
  || die "Staging and production have unrelated histories. Refusing to combine them."

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="backup/production-before-$TIMESTAMP"
PROMOTION_BRANCH="promotion/staging-$TIMESTAMP"
git -C "$PRODUCTION_DIR" branch "$BACKUP_BRANCH" "$PRODUCTION_SHA"
git -C "$PRODUCTION_DIR" switch -c "$PROMOTION_BRANCH" "$PRODUCTION_SHA"
PROMOTION_STARTED=1

if ! git -C "$PRODUCTION_DIR" merge --no-ff "$STAGING_REMOTE_NAME/main" \
  -m "chore: promote staging to production"; then
  warn "The repositories have a merge conflict. No production push occurred."
  warn "Resolve it in $PRODUCTION_DIR, or run: git -C '$PRODUCTION_DIR' merge --abort"
  exit 1
fi

# A normal merge cannot know that deployment transport, build origins, link
# origins, and their safety tests intentionally differ between repositories.
# Reapply the production side of that boundary before tests or push.
for path in "${PRODUCTION_ONLY_PATHS[@]}"; do
  if git -C "$PRODUCTION_DIR" cat-file -e "$PRODUCTION_SHA:$path" 2>/dev/null; then
    git -C "$PRODUCTION_DIR" restore \
      --source="$PRODUCTION_SHA" --staged --worktree -- "$path"
  fi
done
for path in "${STAGING_ONLY_PATHS[@]}"; do
  git -C "$PRODUCTION_DIR" rm --ignore-unmatch --quiet -- "$path"
done

if ! git -C "$PRODUCTION_DIR" diff --cached --quiet; then
  git -C "$PRODUCTION_DIR" commit --amend --no-edit
fi
ok "merged staging $STAGING_SHA into $PROMOTION_BRANCH"
ok "recovery branch: $BACKUP_BRANCH"

log "Stage 4/5 · Test the production result"
if [[ ! -d "$PRODUCTION_DIR/node_modules" ]]; then
  command -v yarn >/dev/null 2>&1 \
    || die "node_modules is missing and yarn is unavailable. Install Yarn and re-run."
  (cd "$PRODUCTION_DIR" && yarn install --frozen-lockfile)
fi

(cd "$PRODUCTION_DIR" && npm test)
(cd "$PRODUCTION_DIR" && npm run build)

# Next rewrites these generated type references between dev and production
# builds. They are not part of the promotion and should not dirty the checkout.
if ! git -C "$PRODUCTION_DIR" diff --quiet -- next-env.d.ts; then
  git -C "$PRODUCTION_DIR" restore --worktree -- next-env.d.ts
fi

require_clean "$PRODUCTION_DIR" "Validated production promotion"
ok "tests and production build passed"

printf '\n  Commits entering production:\n'
git -C "$PRODUCTION_DIR" log --oneline --no-decorate "$PRODUCTION_SHA..$PROMOTION_BRANCH" \
  | sed 's/^/    /'

if grep -Eqi 'stagebeta[ -]only|Deploy to stagebeta' \
  "$PRODUCTION_DIR/.github/workflows/deploy.yml" 2>/dev/null; then
  warn "Production still contains a stagebeta-only workflow. This script promotes Git code; it does not claim that www.moilapp.com was deployed."
fi

log "Stage 5/5 · Push the production main branch"
if [[ "$DRY_RUN" == "1" ]]; then
  warn "dry run selected: production was not pushed"
  printf '  Validated branch: %s\n' "$PROMOTION_BRANCH"
  exit 0
fi

if ! confirm "Push this validated merge to the production repository now?"; then
  warn "cancelled: production was not pushed"
  printf '  Validated branch remains available: %s\n' "$PROMOTION_BRANCH"
  exit 0
fi

# A normal push is deliberate: it fails safely if somebody updated production
# after the fetch. The script never force-pushes production.
git -C "$PRODUCTION_DIR" push origin "$PROMOTION_BRANCH:main"
git -C "$PRODUCTION_DIR" switch main
git -C "$PRODUCTION_DIR" merge --ff-only "$PROMOTION_BRANCH"

ok "production main now contains staging commit $STAGING_SHA"
printf '\n  Recovery branch: %s\n' "$BACKUP_BRANCH"
printf '  Production commit: %s\n\n' "$(git -C "$PRODUCTION_DIR" rev-parse HEAD)"
