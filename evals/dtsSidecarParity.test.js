#!/usr/bin/env node
'use strict';

/**
 * A .d.ts SIDECAR SHADOWS ITS MODULE, so drift breaks the BUILD and
 * nothing else.
 *   node --test evals/dtsSidecarParity.test.js
 *
 * `app/business/preview/*.js` are CommonJS modules with hand-written
 * `.d.ts` sidecars beside them. TypeScript resolves an import to the
 * DECLARATION file and never looks at the JavaScript, so a sidecar that
 * has stopped listing what its module exports is not a stale comment —
 * it is the only thing the compiler believes.
 *
 * That is invisible to this suite by construction: `node --test` loads
 * the `.js`, so every eval stays green while `next build` fails. It
 * happened. The wait-termination work added `shouldGiveUpWaiting`, a
 * second `opts` argument to `nextPollDelayMs` and four constants to
 * `previewWaitCopy.js`, and left the sidecar declaring the original
 * five. 276/276 passed; the build reported
 *
 *   TS2305: Module '"../preview/previewWaitCopy"' has no exported
 *           member 'shouldGiveUpWaiting'.
 *   TS2554: Expected 0-1 arguments, but got 2.
 *
 * VALUE exports must match; TYPE exports may not. `export type ReadFail`
 * in `previewInput.d.ts` is a legitimate declaration-only name — a type
 * has no runtime existence to mirror, so demanding one in
 * `module.exports` would fail for a reason that is not the defect this
 * file guards, which is how a gate gets weakened by whoever has to get
 * past it.
 *
 * HONEST LIMIT: this checks NAMES, not signatures. The TS2554 half above
 * — a changed parameter list — is beyond what a text scan can see, and
 * saying so is better than a guard read as stronger than it is.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out']);

function walk(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(p, out);
		else if (entry.name.endsWith('.d.ts') && entry.name !== 'next-env.d.ts')
			out.push(p);
	}
	return out;
}

/**
 * Brace-match from `module.exports = {` to its own closing brace, then
 * split on TOP-LEVEL commas.
 *
 * Two traps, both of which made the first cut of this scan under-report,
 * and a sweep that under-reports looks exactly like a clean repo: a
 * regex ending at `\n};` skips a one-line export block, and a per-LINE
 * key match reads only the first of `{ a, b }`. `platformPickerView.js`
 * is one line carrying five exports and hit both.
 */
function exportedValueNames(src) {
	const start = src.search(/module\.exports\s*=\s*\{/);
	if (start === -1) return null;
	const open = src.indexOf('{', start);
	let depth = 0;
	let end = -1;
	for (let i = open; i < src.length; i += 1) {
		if (src[i] === '{') depth += 1;
		else if (src[i] === '}') {
			depth -= 1;
			if (depth === 0) {
				end = i;
				break;
			}
		}
	}
	if (end === -1) return null;

	const names = [];
	let nest = 0;
	let token = '';
	const take = () => {
		const m = token.match(/^\s*([A-Za-z_$][\w$]*)\s*(?::|$)/);
		if (m) names.push(m[1]);
		token = '';
	};
	for (const ch of src.slice(open + 1, end)) {
		if (ch === '{' || ch === '[' || ch === '(') nest += 1;
		else if (ch === '}' || ch === ']' || ch === ')') nest -= 1;
		if (ch === ',' && nest === 0) {
			take();
			continue;
		}
		token += ch;
	}
	take();
	return [...new Set(names)].sort();
}

function declaredValueNames(src) {
	const found = [
		...src.matchAll(
			/export\s+(?:declare\s+)?(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g,
		),
	].map((m) => m[1]);
	return [...new Set(found)].sort();
}

test('a .d.ts sidecar declares exactly what its module exports', () => {
	const sidecars = walk(ROOT);

	// A clean result and a broken walker look identical.
	assert.ok(
		sidecars.length >= 5,
		`walker reached only ${sidecars.length} sidecars — it is broken, not the repo`,
	);

	const drift = [];
	let compared = 0;
	let unreadable = 0;

	for (const dts of sidecars) {
		const js = dts.replace(/\.d\.ts$/, '.js');
		// A standalone declaration file shadows nothing.
		if (!fs.existsSync(js)) continue;

		const exported = exportedValueNames(fs.readFileSync(js, 'utf8'));
		if (exported === null) {
			// REPORTED, never silently passed.
			unreadable += 1;
			drift.push(
				`${path.relative(ROOT, js)} — no readable module.exports block, so its sidecar was NOT checked`,
			);
			continue;
		}
		compared += 1;

		const declared = declaredValueNames(fs.readFileSync(dts, 'utf8'));
		const missing = exported.filter((n) => !declared.includes(n));
		const phantom = declared.filter((n) => !exported.includes(n));

		if (missing.length)
			drift.push(
				`${path.relative(ROOT, dts)} — the module exports these and the sidecar does not declare them, so TypeScript cannot see them and the build fails: ${missing.join(', ')}`,
			);
		if (phantom.length)
			drift.push(
				`${path.relative(ROOT, dts)} — the sidecar declares these and the module does not export them, so an import typechecks and is undefined at runtime: ${phantom.join(', ')}`,
			);
	}

	assert.ok(
		compared >= 4,
		`only ${compared} sidecar/module pairs compared (${unreadable} unreadable) — the scan is not seeing this repo`,
	);
	assert.deepStrictEqual(drift, [], `\n${drift.join('\n')}\n`);
});

test('the scan can actually SEE drift', () => {
	// A guard that cannot fail is decoration.
	assert.deepStrictEqual(exportedValueNames('module.exports = { alpha, beta };'), [
		'alpha',
		'beta',
	]);
	assert.deepStrictEqual(
		declaredValueNames('export const alpha: number;\nexport type Gamma = string;\n'),
		['alpha'],
	);

	// A one-line block with several keys is read in full — the trap that
	// made this scan's own first cut report a real module as exporting one
	// name out of five.
	assert.deepStrictEqual(
		exportedValueNames(
			'module.exports = { pickerRows, toggle, pickerState, decideChip, chooseDecide };',
		),
		['chooseDecide', 'decideChip', 'pickerRows', 'pickerState', 'toggle'],
	);

	// A nested object's keys are not exports.
	assert.deepStrictEqual(
		exportedValueNames('module.exports = {\n\ta,\n\tb: { hidden: 1 },\n};'),
		['a', 'b'],
	);

	// A type-only declaration is never demanded of the module.
	assert.ok(
		!declaredValueNames('export type ReadFail = { ok: false };').includes(
			'ReadFail',
		),
	);

	// No export block at all is reported, not read as "exports nothing".
	assert.strictEqual(exportedValueNames('const a = 1;\n'), null);
});
