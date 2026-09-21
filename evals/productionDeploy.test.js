#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('production-only deploy', () => {
	const deploy = read('.github/workflows/deploy.yml');
	const tests = read('.github/workflows/tests.yml');
	const script = read('.github/deploy.sh');
	const docs = read('DEPLOYMENT.md');

	it('deploys main through the production environment', () => {
		assert.match(deploy, /push:\s*\n\s*branches:\s*\[main\]/);
		assert.match(deploy, /workflow_dispatch:/);
		assert.match(deploy, /environment:\s*production/);
		assert.match(deploy, /deploy-landing-production/);
		assert.doesNotMatch(deploy, /environment:\s*staging/);
	});

	it('uses the production SSM transport', () => {
		assert.match(deploy, /SSM_INSTANCE_ID/);
		assert.match(deploy, /aws ssm send-command/);
		assert.match(deploy, /configure-aws-credentials/);
		assert.match(deploy, /AWS_ROLE_ARN/);
		assert.match(docs, /AWS SSM/);
	});

	it('never bakes stagebeta origins into a production build', () => {
		for (const content of [tests, script]) {
			assert.doesNotMatch(content, /employer-beta\.moilapp\.com/);
			assert.doesNotMatch(content, /stagebeta\.moilapp\.com/);
			assert.doesNotMatch(content, /STAGEBETA_/);
		}
	});
});
