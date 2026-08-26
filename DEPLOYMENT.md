# Automated deployment (GitHub Actions → AWS SSM → PM2)

Push or merge to `main` → the eval suite and a real `next build` run → if both
pass, GitHub hands `.github/deploy.sh` to the instance over AWS Systems Manager,
which pulls the commit, installs if the lockfile moved, **builds**, reloads PM2
and health-checks the result. A failed health check rolls back to the previous
commit — rebuilding it — and fails the run.

| File | Role |
|---|---|
| `.github/workflows/deploy.yml` | Trigger, secrets, the SSM transport |
| `.github/workflows/tests.yml` | The gate (`workflow_call`ed by deploy) |
| `.github/deploy.sh` | Everything that happens **on the server** |
| `ecosystem.config.js` | The PM2 process definition |

## This app shares a server with the employer API, and inherits most of its setup

The gateway (`Moil-codeProdbackend`) already deploys to this instance over SSM,
and that works. So the instance profile, the SSM agent registration, the region
and the IAM permissions policy are **already in place and already proven** — the
permissions policy is scoped to this instance's id, and this is that instance.

No inbound port is opened for any of this. The SSM agent holds an outbound
connection to AWS and the deploy arrives over it, so port 22 can stay shut.

### The one thing that is NOT inherited: the OIDC trust policy

GitHub signs each deploy token with a subject naming **the repository it came
from**. The deploy role currently trusts the employer API's subject only, so
until this repo's is added, every run here fails at assume-role with:

```
Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity
```

That message is the same one AWS returns for a missing role, a wrong audience
and a policy mismatch — it will not tell you which. So make this change first
rather than debugging it later.

Add this repo's subject to the existing deploy role's trust policy, alongside
the one already there. `StringEquals` accepts a list:

```bash
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
ROLE=<the role the employer API's AWS_ROLE_ARN names>

cat > /tmp/trust.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::${ACCOUNT}:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": [
          "repo:Moil-Code/Moil-codeProdbackend:environment:production",
          "repo:Moil-Code/Moil-landing-page:environment:production"
        ]
      }
    }
  }]
}
EOF

aws iam update-assume-role-policy --role-name "$ROLE" --policy-document file:///tmp/trust.json
aws iam get-role --role-name "$ROLE" --query 'Role.AssumeRolePolicyDocument'   # confirm it took
```

Note the `environment:` form rather than `ref:refs/heads/main`. The deploy job
declares `environment: production`, and when a job references an environment
GitHub **replaces** the branch component of the subject with the environment
name. The branch form fails every run.

Sharing one role across both repos means either pipeline can reach this
instance. If you would rather they could not, create a second role with only
this repo's subject and give it the same `ssm:SendCommand` permissions — the
workflow reads whatever `AWS_ROLE_ARN` names.

## Server prep (once)

```bash
sudo -iu <deploy user>

git clone https://github.com/Moil-Code/Moil-landing-page /srv/moil-landing-page
cd /srv/moil-landing-page && git checkout main

# .env.local — gitignored, and not touched by a deploy unless you opt in to
# DEPLOY_WRITE_ENV (below). See .env.example for what goes in it.
vim .env.local

# yarn is required — see "Why yarn" below. Either is fine:
corepack enable    # or: npm i -g yarn

yarn install --frozen-lockfile
yarn build
PM2_NAME=<your PM2_NAME> pm2 startOrReload ecosystem.config.js --update-env
pm2 save
pm2 startup        # so it comes back after a reboot; run the line it prints
```

**Pick a port that the gateway is not already using.** `ecosystem.config.js`
defaults to 3000 and passes `PORT` to Next explicitly, so the port the app
listens on and the port the health check polls cannot drift apart. Point nginx
at that port for the landing page's hostname.

### Why yarn, and not `npm ci`

`npm ci` cannot work in this repo, for two independent reasons:

- The committed `package-lock.json` is **out of sync** with `package.json` — it
  is missing `caniuse-lite`, and `npm ci` refuses outright on that.
- React 19 conflicts with `lucide-react`'s declared peer range, so npm also
  needs `--legacy-peer-deps`.

`yarn.lock` is in sync, and `vercel.json` already declares `yarn install` as this
project's install command. `--frozen-lockfile` is the part that matters: it
**refuses** rather than quietly resolving a different tree, which is what makes
the server build the same thing CI tested.

(The `.npmrc` here sets `strict-peer-dependencies`, which is a pnpm/yarn key.
npm ignores it, so it does not help npm.)

## Secrets and variables

**Settings → Secrets and variables → Actions.** Secrets:

| Name | Value |
|---|---|
| `AWS_ROLE_ARN` | the deploy role's ARN (see trust policy above) |
| `SSM_INSTANCE_ID` | the shared instance's id — the same one the employer API uses |
| `SERVER_USER` | OS user that owns the checkout |
| `APP_PATH` | absolute path of the checkout, e.g. `/srv/moil-landing-page` |
| `PM2_NAME` | the PM2 process name, e.g. `moil-landing` |
| `ENV` | *optional* — the whole `.env.local`; only read when `DEPLOY_WRITE_ENV=true` |

Variables:

| Name | Default | Meaning |
|---|---|---|
| `AWS_REGION` | *(required)* | the instance's region |
| `DEPLOY_BRANCH` | `main` | branch the server checks out |
| `DEPLOY_HEALTH_URL` | `http://127.0.0.1:3000/` | polled on the instance after reload |
| `DEPLOY_ENV_FILE` | `.env.local` | which env file the `ENV` secret writes |
| `DEPLOY_TIMEOUT_SECONDS` | `2400` | how long CI waits for the script |
| `DEPLOY_ROLLBACK` | `1` | `0` disables the automatic rollback |
| `DEPLOY_WRITE_ENV` | *(unset)* | `true` rewrites the env file from the `ENV` secret every deploy |

Also create the **`production` environment** (Settings → Environments) and set
its Deployment branches to `main`. Because the environment name replaces the
branch in the OIDC subject, that rule — not the trust policy — is what pins the
deploy to `main`.

`SERVER_USER` matters more than it looks: `AWS-RunShellScript` runs as **root**,
and the wrapper drops to this user before touching anything. Deploying as root
would leave `node_modules`, `.next` and the checkout root-owned, and the next
by-hand deploy as the real user would fail on permissions.

## Updating `.env.local` without logging in

Set the `ENV` secret to the entire file and `DEPLOY_WRITE_ENV` to `true`.

**This app is different from the API repos here, and getting it wrong is a
silent no-op.** Every variable this app reads is `NEXT_PUBLIC_*`, which Next
**inlines into the client bundle at build time**. Writing the file and reloading
PM2 changes nothing at all — only a rebuild does. So `deploy.sh` writes the file
*before* the build, and a **changed** env file forces a rebuild even when no
code moved. An unchanged one does not, so an unrelated deploy stays cheap.

Refusals before writes: a decode that fails or yields nothing aborts before
touching the file; the previous file is copied to `.env.local.bak.<timestamp>`;
mode is forced to `0600`.

**Worth knowing before turning it on.** Everything handed to `ssm:SendCommand`
is retained as **SSM command history for 30 days**, readable by any principal
with `ssm:GetCommandInvocation` in this account, and SSM exposes no delete for
command invocations. The values here are `NEXT_PUBLIC_*` — they ship to every
browser that loads the site, so this is a much smaller deal than it is for the
API repos. Do not put a real secret in this file expecting it to stay one: the
build compiles it into JavaScript anyone can read.

## When a deploy fails, read the failing step

It tells you whether the server changed at all.

| Step that failed | Was the server touched? | What it means |
|---|---|---|
| Offline eval suite / Build | No | The commit fails tests or does not compile |
| Check deploy configuration | No | A secret or variable is missing; the error names it |
| Assume the deploy role | No | The trust policy is missing this repo's subject — see above |
| Check the instance is registered | No | The SSM agent is not `Online`, or `AWS_REGION` is wrong |
| Deploy, `send-command` rejected | No | IAM permissions on the role |
| Deploy, script failed | **Yes** | It ran. A failed build leaves the OLD build serving; a failed health check has already rolled back |
| Poll timed out | **Maybe** | Not a safe no-op. Read `/var/log/moil-landing-deploy.log` on the instance |

The full transcript lives on the instance at
`/var/log/moil-landing-deploy.log` — deliberately a different file from the
employer API's, which shares this box. SSM truncates its own output at 24,000
characters and a build comfortably exceeds that.

## Day-to-day

```bash
# Shell in without an open port:
aws ssm start-session --target <instance id> --region <region>

# Deploy by hand — identical to what CI does:
sudo -iu <deploy user>
cd /srv/moil-landing-page
APP_PATH=$PWD PM2_NAME=<name> bash .github/deploy.sh

# Roll back to a known-good commit (rebuild is required — see below):
git reset --hard <sha>
yarn install --frozen-lockfile && yarn build
pm2 reload <PM2_NAME> --update-env
```

**A rollback on this app always rebuilds.** `.next/` holds the output of
whatever was built last, so resetting the source alone leaves the old code being
served from the new build. `deploy.sh` does this for you; by hand, do not skip
the `yarn build`.

## Things that will bite you

- **`next build` writes `.next/` in place.** There is a window during a deploy
  where the running server and the build on disk disagree. It is short and Next
  tolerates it, but it is why a failed build stops before the reload rather than
  after.
- **A build needs memory.** If deploys start dying with no useful error, check
  for the OOM killer (`dmesg | tail`) before suspecting the code — this box also
  runs the employer API.
- **`pm2 reload` keeps the script path an app was ORIGINALLY started with.** An
  app first started as `pm2 start yarn --name x -- start` will reload yarn
  forever and silently ignore `ecosystem.config.js`. If a deploy reports success
  but nothing changes, `pm2 delete <name>` once and let the next deploy recreate
  it from the config.
- **Two apps, one box.** Deploy logs, PM2 names and ports are all deliberately
  distinct. Keep them that way.
