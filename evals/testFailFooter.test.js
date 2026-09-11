#!/usr/bin/env node
'use strict';

/**
 * A CI tail has to name the failure.
 *   node --test evals/testFailFooter.test.js
 *
 * GitHub Actions is not a TTY, so `node --test` defaults to TAP. TAP prints
 * `ok N - name` for every test and ends on `# fail 1` with the name hundreds
 * of lines above — Jimmy's screenshot of run 34226525018. Forcing spec and
 * reprinting leaf names after the summary is the whole of this gate.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const runner = path.join(root, 'scripts/run-evals.mjs');

describe('failed-test footer', () => {
	it('yarn test runs the wrapper, not raw node --test (which is TAP on CI)', () => {
		const pkg = JSON.parse(read('package.json'));
		assert.equal(pkg.scripts.test, 'node scripts/run-evals.mjs');
		assert.match(read('.github/workflows/tests.yml'), /yarn test/);
		const src = read('scripts/run-evals.mjs');
		assert.match(src, /evalFailFooterReporter/);
		assert.match(src, /--test-reporter=spec/);
		const reporter = read('scripts/evalFailFooterReporter.mjs');
		assert.match(reporter, /FAILED TESTS/);
		assert.match(reporter, /test:fail/);
		assert.match(reporter, /formatFailFooter/);
		// Spec is forced so a non-TTY (Actions) cannot silently fall back to TAP.
		assert.match(src, /NODE_TEST_CONTEXT/);
	});

	it('reprints the failed name and file:line AFTER the summary, and keeps the rest of the output', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moil-fail-footer-'));
		const fixture = path.join(dir, 'buried.test.js');
		fs.writeFileSync(
			fixture,
			`'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
describe('a suite whose name is not the failure', () => {
	it('buried failure name that a tail must show', () => { assert.equal(1, 2); });
	it('a passing sibling', () => { assert.equal(1, 1); });
});
`,
		);
		try {
			const env = { ...process.env };
			delete env.NODE_TEST_CONTEXT;
			const r = spawnSync(process.execPath, [runner, fixture], {
				encoding: 'utf8',
				cwd: root,
				env,
			});
			assert.notEqual(r.status, 0, 'a failing fixture must exit non-zero');
			const out = `${r.stdout || ''}${r.stderr || ''}`;
			// Live output is still there — we did not replace the run with a summary.
			assert.match(out, /buried failure name that a tail must show/);
			assert.match(out, /a passing sibling/);
			const summary = Math.max(out.lastIndexOf('ℹ fail'), out.lastIndexOf('# fail'));
			assert.ok(summary >= 0, 'expected a test-runner summary before the footer');
			const footer = out.lastIndexOf('FAILED TESTS');
			assert.ok(footer > summary, 'footer must come after the summary so a CI tail shows it');
			const tail = out.slice(footer);
			assert.match(tail, /buried failure name that a tail must show/);
			assert.match(tail, /buried\.test\.js:\d+/);
			assert.doesNotMatch(tail, /a suite whose name is not the failure/, 'parent suites are not the failure');
			assert.doesNotMatch(tail, /a passing sibling/);
		} finally {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});

	it('a green run does not print the footer', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moil-fail-footer-ok-'));
		const fixture = path.join(dir, 'ok.test.js');
		fs.writeFileSync(
			fixture,
			`'use strict';
const { it } = require('node:test');
const assert = require('node:assert/strict');
it('passes', () => { assert.equal(1, 1); });
`,
		);
		try {
			const env = { ...process.env };
			delete env.NODE_TEST_CONTEXT;
			const r = spawnSync(process.execPath, [runner, fixture], {
				encoding: 'utf8',
				cwd: root,
				env,
			});
			assert.equal(r.status, 0, r.stderr || r.stdout);
			const out = `${r.stdout || ''}${r.stderr || ''}`;
			assert.match(out, /passes/);
			assert.doesNotMatch(out, /FAILED TESTS/);
		} finally {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});
});
