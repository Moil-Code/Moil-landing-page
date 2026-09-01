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

	it('is workflow_dispatch-only and never push-to-main', () => {
		assert.match(deploy, /workflow_dispatch:/);
		assert.doesNotMatch(deploy, /push:\s*\n\s*branches:/);
		assert.match(deploy, /environment:\s*staging/);
		assert.match(deploy, /deploy-landing-stagebeta/);
		assert.doesNotMatch(deploy, /environment:\s*production/);
		assert.doesNotMatch(deploy, /deploy-landing-production/);
	});

	it('uses SSH (SERVER_SSH_KEY), not production landing SSM', () => {
		assert.match(deploy, /SERVER_SSH_KEY/);
		assert.match(deploy, /ssh -i ~\/\.ssh\/deploy_key/);
		assert.match(deploy, /Do NOT use the production landing SSM/);
		assert.doesNotMatch(deploy, /SSM_INSTANCE_ID/);
		assert.doesNotMatch(deploy, /aws ssm send-command/);
		assert.doesNotMatch(deploy, /configure-aws-credentials/);
		assert.doesNotMatch(deploy, /AWS_ROLE_ARN/);
		assert.match(docs, /SERVER_SSH_KEY is not proven/);
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
