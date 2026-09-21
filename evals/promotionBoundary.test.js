#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(
	path.join(root, 'scripts/promote-staging-to-production.sh'),
	'utf8',
);

describe('staging-to-production promotion boundary', () => {
	it('preserves every production-owned deployment and origin file', () => {
		for (const file of [
			'.github/deploy.sh',
			'.github/workflows/deploy.yml',
			'.github/workflows/tests.yml',
			'DEPLOYMENT.md',
			'src/common/constants/baseUrl.tsx',
			'evals/productionDeploy.test.js',
			'evals/linkConfigProduction.test.js',
		]) {
			assert.match(script, new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
		}
		assert.match(script, /restore[\s\S]*--source="\$PRODUCTION_SHA"/);
	});

	it('removes stagebeta-only assertions from the production result', () => {
		assert.match(script, /evals\/stagebetaDeploy\.test\.js/);
		assert.match(script, /evals\/linkConfig\.test\.js/);
		assert.match(script, /git -C "\$PRODUCTION_DIR" rm --ignore-unmatch/);
	});

	it('never force-pushes production', () => {
		assert.doesNotMatch(script, /push[^\n]*(--force|-f\b)/);
		assert.match(script, /push origin "\$PROMOTION_BRANCH:main"/);
	});
});
