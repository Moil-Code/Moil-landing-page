# Automated deployment (GitHub Actions → SSH → PM2) — STAGEBETA ONLY

This repository is **Moil-Landing-Page-Staging**. It deploys the landing
page to **stagebeta**, not to www.moilapp.com / moilapp.com.

- leftover-4 dest HOLD. leftover-6 OFF.
- Do **not** fire Moil-Code/Moil-landing-page (production landing) GHA/SSM.
- Do **not** point SSM at www. The production SSM workflow that was copied
  onto this repo (`environment: production`, `deploy-landing-production`,
  `SSM_INSTANCE_ID`) is gone.

Push or merge to `main` does **not** deploy. Tests still run on every PR.
A human (CoS) merges; a human then **Actions → Deploy to stagebeta → Run
workflow** once the SSH secrets exist.

The runner pipes `.github/deploy.sh` over SSH — the same transport
Business-plan-Staging / Users-API already use to reach the stagebeta host
(`SERVER_SSH_KEY`). The script pulls the commit, installs if the lockfile
moved, **builds** with stagebeta origins, reloads PM2, and health-checks.
A failed health check rolls back (rebuilds the previous commit).

| File | Role |
|---|---|
| `.github/workflows/deploy.yml` | `workflow_dispatch` only, SSH, `environment: staging` |
| `.github/workflows/tests.yml` | The gate (`workflow_call`ed by deploy; also on every PR) |
| `.github/deploy.sh` | Everything that happens **on the server** |
| `ecosystem.config.js` | The PM2 process definition |

## Gap: SERVER_SSH_KEY is not proven on this repo

This repo's last deploy workflow was a copy of production landing SSM
(OIDC + `SSM_INSTANCE_ID` + `environment: production`). There is no proof
that instance is stagebeta, so SSM is not wired.

Stagebeta SSH secrets (`SERVER_SSH_KEY`, `SERVER_HOST`, `SERVER_USER`,
`APP_PATH`, `PM2_NAME`) are **not** assumed to exist here yet. Until they
are added (Settings → Secrets and variables → Actions), a dispatch fails
at "Check deploy configuration" and **nothing on any host is touched**.
Do not guess instance IDs. Copy the names from Business-plan-Staging and
point them at the stagebeta host that already serves Next behind nginx
(`/` → `/business`).

## Stagebeta Next build env

Next inlines `NEXT_PUBLIC_*` at **build** time. Unset
`NEXT_PUBLIC_REGISTER_ORIGIN` falls back to production
`https://business.moilapp.com`. `deploy.sh` **refuses** a build that is
not exactly:

```
PLAN_API_ORIGIN=https://stagebeta.moilapp.com
NEXT_PUBLIC_REGISTER_ORIGIN=https://employer-beta.moilapp.com
```

Put those in `.env.local` on the host (gitignored). CI's Build step
exports the same pair so the PR compile matches what stagebeta will
serve. `/api` `/plan` `/mail` stay on Node (nginx); Next only rewrites
`/plan/preview` and `/plan/preview/:slug`.

Do not bake `www.moilapp.com`, `business.moilapp.com`, or `ai.moilapp.com`
into the stagebeta bundle.

## Secrets and variables

**Settings → Secrets and variables → Actions.** Secrets:

| Name | Value |
|---|---|
| `SERVER_HOST` | stagebeta hostname or IP — **not** www |
| `SERVER_USER` | SSH user that owns the checkout |
| `SERVER_SSH_KEY` | the **private** key, entire file including the BEGIN/END lines |
| `APP_PATH` | absolute path of the checkout on stagebeta |
| `PM2_NAME` | the PM2 process name |
| `SERVER_KNOWN_HOSTS` | *optional but recommended* — `ssh-keyscan -p 22 <host>` output |

Variables:

| Name | Default | Meaning |
|---|---|---|
| `SERVER_SSH_PORT` | `22` | SSH port |
| `DEPLOY_BRANCH` | `main` | branch the server checks out |
| `DEPLOY_HEALTH_URL` | `http://127.0.0.1:3000/business` | polled on the host after reload |
| `DEPLOY_ROLLBACK` | `1` | `0` disables the automatic rollback |

Also create the **`staging`** environment (Settings → Environments) and
restrict Deployment branches to `main`. Do **not** create or use a
`production` environment on this repo.

## Server prep (once)

```bash
sudo -iu <deploy user>

git clone git@github.com:Moil-Code/Moil-Landing-Page-Staging.git /srv/moil-landing-page
cd /srv/moil-landing-page && git checkout main

# .env.local — gitignored. Required before the first yarn build:
#   PLAN_API_ORIGIN=https://stagebeta.moilapp.com
#   NEXT_PUBLIC_REGISTER_ORIGIN=https://employer-beta.moilapp.com
vim .env.local

corepack enable    # or: npm i -g yarn

yarn install --frozen-lockfile
yarn build
PM2_NAME=<your PM2_NAME> pm2 startOrReload ecosystem.config.js --update-env
pm2 save
pm2 startup
```

Give the server a read-only deploy key on this repo so `git fetch` works.
The public half of `SERVER_SSH_KEY` goes in the deploy user's
`~/.ssh/authorized_keys` on stagebeta.

## Day-to-day

```bash
# Deploy by hand — identical to what CI does:
APP_PATH=$PWD PM2_NAME=<name> \
  PLAN_API_ORIGIN=https://stagebeta.moilapp.com \
  NEXT_PUBLIC_REGISTER_ORIGIN=https://employer-beta.moilapp.com \
  bash .github/deploy.sh
```

A red deploy run means one of three things: the eval suite failed
(nothing reached the server), SSH failed (the server is untouched), or
the health check failed (the server rolled itself back).
