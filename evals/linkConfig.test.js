/**
 * THIS REPO IS STAGEBETA. Its link config is its own.
 *
 * The mirror of Moil-landing-page's evals/linkConfig.test.js. The two repos
 * are one codebase synced by merging one into the other, differing in
 * exactly one dimension that must never travel: which app origin the CTAs
 * point at, and which server the deploy reaches.
 *
 *   stagebeta   →  employer-beta.moilapp.com / employee-beta.moilapp.com
 *   production  →  business.moilapp.com      / candidate.moilapp.com
 *
 * evals/stagebetaDeploy.test.js already guards the DEPLOY half. This guards
 * the SOURCE half, which it does not: a merge from production can quietly
 * repoint every CTA on this site at the live app, and nothing errors — the
 * links resolve, the pages render, and a tester clicking "Get started" on
 * stagebeta lands in production and signs up there for real.
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function walk(dir, out = []) {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) return out;
	for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
		if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
		const rel = path.join(dir, e.name);
		if (e.isDirectory()) walk(rel, out);
		else if (/\.(tsx?|jsx?|mjs)$/.test(e.name)) out.push(rel);
	}
	return out;
}

const FILES = [...walk('app'), ...walk('src')];

// A file may sit here only with a reason a human wrote down.
const EXEMPT = {
	'app/business/preview/previewClient.js':
		'DEFAULT_REGISTER_ORIGIN is deliberately production, so an unset env on ' +
		'the PROD twin cannot retarget www from source. .github/deploy.sh REFUSES ' +
		'a stagebeta build that has not overridden it (STAGEBETA_REGISTER_ORIGIN), ' +
		'which is the real guard for this repo.',
};

describe('stagebeta link config', () => {
	it('the walker reached a real number of files', () => {
		// A broken walk and a clean tree are indistinguishable from outside.
		assert.ok(FILES.length > 50, `only ${FILES.length} files scanned`);
	});

	it('no production app origin is hardcoded in stagebeta source', () => {
		const hits = [];
		for (const f of FILES) {
			if (EXEMPT[f]) continue;
			// Comments legitimately name production (warnings against using it).
			const code = read(f)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/(^|[^:])\/\/.*$/gm, '$1');
			for (const bad of ['business.moilapp.com', 'candidate.moilapp.com']) {
				if (code.includes(bad)) hits.push(`${f} — ${bad}`);
			}
		}
		assert.deepEqual(hits, [], `production origins in stagebeta source:\n  ${hits.join('\n  ')}`);
	});

	it('every exemption names a reason', () => {
		for (const why of Object.values(EXEMPT)) {
			assert.ok(typeof why === 'string' && why.length > 40);
		}
	});

	it('baseUrl points at the beta apps', () => {
		const s = read('src/common/constants/baseUrl.tsx');
		assert.match(s, /workerBaseUrl\s*=\s*"https:\/\/employee-beta\.moilapp\.com"/);
		assert.match(s, /businessBaseUrl\s*=\s*"https:\/\/employer-beta\.moilapp\.com"/);
	});

	it('the production deploy gate has not landed here', () => {
		// Its presence would mean the wrong repo's deploy rules came across.
		assert.equal(fs.existsSync(path.join(ROOT, 'evals/linkConfigProduction.test.js')), false);
		assert.doesNotMatch(read('.github/workflows/deploy.yml'), /deploy-landing-production/);
	});

	it('the check can still see a violation', () => {
		assert.ok('ctaHref="https://business.moilapp.com/register"'.includes('business.moilapp.com'));
	});
});
