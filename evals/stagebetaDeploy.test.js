#!/usr/bin/env node
'use strict';

/**
 * This repo deploys STAGEBETA only.
 *   node --test evals/stagebetaDeploy.test.js
 *
 * Pins: the 0f7f5ae0 door title, CI build env, and that deploy.yml cannot
 * hit www / production landing SSM.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

describe('stagebeta-only deploy', () => {
	const deploy = read('.github/workflows/deploy.yml');
	const tests = read('.github/workflows/tests.yml');
	const script = read('.github/deploy.sh');
	const docs = read('DEPLOYMENT.md');

	it('auto-deploys main and nothing else, and stays on staging', () => {
		// This was `doesNotMatch(/push:\s*\n\s*branches:/)` — the deploy was
		// dispatch-only while SERVER_SSH_KEY was unproven on this repo. The
		// secret exists now, so main auto-deploys. What made the trigger unsafe
		// was never the trigger: it was a missing secret silently falling back
		// to leftover production SSM. The preflight below is what rules that
		// out, so the guard moved there rather than being deleted.
		assert.match(deploy, /workflow_dispatch:/);
		assert.match(deploy, /push:\s*\n\s*branches:\s*\[main\]/);
		// main ONLY. A second branch here would deploy an unreviewed head to
		// the stagebeta host on every push to it.
		const pushBlock = deploy.match(/push:\s*\n\s*branches:[^\n]*\n/);
		assert.ok(pushBlock, 'expected a push.branches block to read');
		assert.doesNotMatch(pushBlock[0], /,/);
		assert.match(deploy, /environment:\s*staging/);
		assert.match(deploy, /deploy-landing-stagebeta/);
		assert.doesNotMatch(deploy, /environment:\s*production/);
		assert.doesNotMatch(deploy, /deploy-landing-production/);
	});

	it('refuses to touch a host when the stagebeta secrets are absent', () => {
		// The load-bearing half of allowing push-to-main. Every push now runs
		// this job, so the run must hard-fail BEFORE any transport when a
		// secret is missing — never proceed on an empty value.
		assert.match(deploy, /Check deploy configuration/);
		for (const secret of ['SERVER_HOST', 'SERVER_USER', 'SERVER_SSH_KEY', 'APP_PATH']) {
			assert.match(deploy, new RegExp(`\\[ -n "\\$${secret}" \\]`));
		}
		assert.match(deploy, /Stagebeta SSH deploy is not configured/);
		assert.match(deploy, /exit 1/);
	});

	it('uses SSH (SERVER_SSH_KEY), not production landing SSM', () => {
		assert.match(deploy, /SERVER_SSH_KEY/);
		assert.match(deploy, /ssh -i ~\/\.ssh\/deploy_key/);
		assert.match(deploy, /Do NOT use the production landing SSM/);
		assert.doesNotMatch(deploy, /SSM_INSTANCE_ID/);
		assert.doesNotMatch(deploy, /aws ssm send-command/);
		assert.doesNotMatch(deploy, /configure-aws-credentials/);
		assert.doesNotMatch(deploy, /AWS_ROLE_ARN/);
		assert.match(docs, /SERVER_SSH_KEY is present on this repo/);
	});

	it('refuses www and bakes stagebeta origins into the Next build', () => {
		assert.match(deploy, /SERVER_HOST looks like production/);
		assert.match(deploy, /stagebeta-only/);
		assert.match(
			tests,
			/PLAN_API_ORIGIN:\s*https:\/\/stagebeta\.moilapp\.com/,
		);
		assert.match(
			tests,
			/NEXT_PUBLIC_REGISTER_ORIGIN:\s*https:\/\/employer-beta\.moilapp\.com/,
		);
		assert.match(script, /STAGEBETA_PLAN_ORIGIN='https:\/\/stagebeta\.moilapp\.com'/);
		assert.match(
			script,
			/STAGEBETA_REGISTER_ORIGIN='https:\/\/employer-beta\.moilapp\.com'/,
		);
		assert.match(docs, /PLAN_API_ORIGIN=https:\/\/stagebeta\.moilapp\.com/);
		assert.match(
			docs,
			/NEXT_PUBLIC_REGISTER_ORIGIN=https:\/\/employer-beta\.moilapp\.com/,
		);
	});
});

describe('0f7f5ae0 door + title', () => {
	it('pins the execute-copy title and the type-out door', () => {
		const layout = read('app/business/layout.tsx');
		assert.match(
			layout,
			/AI co-founder that writes the plan and the month \| Moil/,
		);
		assert.match(
			read('app/business/components/PreviewMagnet.tsx'),
			/GettingToKnowYou/,
		);
		assert.match(
			read('app/business/components/GettingToKnowYou.tsx'),
			/leftover-4 dest HOLD/,
		);
		assert.equal(fs.existsSync(path.join(root, 'evals/gettingToKnowYou.test.js')), true);
		assert.equal(fs.existsSync(path.join(root, 'evals/executeCopySlice.test.js')), true);
	});
});
