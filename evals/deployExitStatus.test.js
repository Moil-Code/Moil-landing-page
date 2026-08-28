#!/usr/bin/env node
'use strict';

/**
 * The deploy must not report failure after succeeding.
 *   node --test evals/deployExitStatus.test.js
 *
 * `.github/deploy.sh` runs under `set -Eeuo pipefail` and installs an EXIT trap
 * to remove the temp file the ENV secret is decoded into. Under `set -e`, a trap
 * whose LAST command fails overrides the status the script asked for — so a
 * cleanup function ending in a false test turns `exit 0` into `exit 1`.
 *
 * That is exactly what shipped: with no ENV secret sent (DEPLOY_WRITE_ENV unset,
 * which is the default), DEPLOY_ENV_TMP is empty, `[ -n "" ]` fails, the &&
 * short-circuits, and a deploy that had built, reloaded and passed its health
 * check exited 1. SSM reported Failed and CI printed "the deploy ran and failed
 * … it has already rolled back" — none of which happened. A green deploy that
 * reports red is worse than a red one: the next genuine failure looks identical,
 * and the reflex is to stop reading the log.
 *
 * The function is EXTRACTED FROM THE REAL SCRIPT rather than restated here, so
 * this cannot pass against a source that has drifted.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, '.github/deploy.sh'), 'utf8');

// Every `trap <fn> EXIT` in the script, paired with that function's definition.
function trappedFunctions(src) {
	const names = [...src.matchAll(/^\s*trap\s+([A-Za-z_][A-Za-z0-9_]*)\s+EXIT\s*$/gm)].map((m) => m[1]);
	return names.map((name) => {
		const def = src.match(new RegExp(`^${name}\\(\\)\\s*\\{.*\\}\\s*$`, 'm'));
		assert.ok(def, `could not find the definition of trapped function ${name}()`);
		return { name, def: def[0] };
	});
}

// Runs the real function as a real EXIT trap, under the real shell options, and
// reports what the shell actually exited with. `exit 0` is the success the
// deploy asks for after "▸ Deployed <sha>".
function exitStatusWith(fn, tmpValue) {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-trap-'));
	const script = path.join(dir, 'harness.sh');
	fs.writeFileSync(
		script,
		[
			// The same options line the deploy script sets.
			source.match(/^set -Eeuo pipefail$/m)[0],
			`DEPLOY_ENV_TMP=${JSON.stringify(tmpValue)}`,
			fn.def,
			`trap ${fn.name} EXIT`,
			'exit 0',
			'',
		].join('\n'),
	);
	try {
		return spawnSync('bash', [script], { encoding: 'utf8' }).status;
	} finally {
		fs.rmSync(dir, { recursive: true, force: true });
	}
}

describe('deploy.sh EXIT traps cannot turn success into failure', () => {
	const fns = trappedFunctions(source);

	it('the script installs at least one EXIT trap (or this file is testing nothing)', () => {
		assert.ok(fns.length > 0, 'no `trap <fn> EXIT` found — did the trap move or get renamed?');
	});

	// The regression. No ENV secret is the DEFAULT configuration, so this is the
	// path nearly every deploy takes.
	for (const fn of fns) {
		it(`${fn.name}: exit 0 stays 0 when there is nothing to clean up`, () => {
			assert.equal(
				exitStatusWith(fn, ''),
				0,
				`${fn.name}() ends in a command that fails when DEPLOY_ENV_TMP is empty, and under ` +
					'set -e that becomes the script\'s exit status. End it with `return 0`.',
			);
		});

		it(`${fn.name}: exit 0 stays 0 when there IS something to clean up`, () => {
			const f = path.join(os.tmpdir(), `deploy-env-fixture-${process.pid}`);
			fs.writeFileSync(f, 'NEXT_PUBLIC_A=1\n');
			try {
				assert.equal(exitStatusWith(fn, f), 0);
				assert.equal(fs.existsSync(f), false, `${fn.name}() must still delete the temp file`);
			} finally {
				fs.rmSync(f, { force: true });
			}
		});
	}
});
