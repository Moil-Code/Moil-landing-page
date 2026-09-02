/**
 * THIS REPO IS PRODUCTION. Its link config is its own.
 *
 * Moil-landing-page and Moil-Landing-Page-Staging share a codebase and are
 * synced by merging one into the other. They differ in exactly one dimension
 * that must never travel: which app origin the CTAs point at, and which
 * server the deploy reaches.
 *
 *   production  →  business.moilapp.com   / candidate.moilapp.com  / SSM to www
 *   stagebeta   →  employer-beta.moilapp.com / employee-beta...    / SSH to stagebeta
 *
 * On the 2026-09-02 sync a plain merge carried EIGHT hardcoded
 * `employer-beta.moilapp.com` CTA hrefs into this repo — every "Get started"
 * on /about, /compare/* and the Content360 nav would have sent a real
 * prospect to the beta app. Nothing errors: the links resolve, the pages
 * render, and the only symptom is signups landing in the wrong environment.
 *
 * A restore step performed by hand is a step that gets skipped. This is the
 * gate instead.
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

// Deliberately NOT scanned: evals/ own fixtures and assertions legitimately
// name the other environment (a recorded stagebeta response, and the
// doesNotMatch checks that exist to keep beta hosts OUT of the copy).
const FILES = [...walk('app'), ...walk('src'), 'next.config.js'];

describe('production link config', () => {
	it('the walker reached a real number of files', () => {
		// A broken walk and a clean tree are indistinguishable from outside.
		assert.ok(FILES.length > 50, `only ${FILES.length} files scanned`);
	});

	it('no stagebeta origin appears in production source', () => {
		const hits = [];
		for (const f of FILES) {
			const src = read(f);
			for (const bad of ['employer-beta', 'employee-beta', 'stagebeta']) {
				if (src.includes(bad)) hits.push(`${f} — ${bad}`);
			}
		}
		assert.deepEqual(hits, [], `stagebeta origins in production source:\n  ${hits.join('\n  ')}`);
	});

	it('baseUrl points at the production apps', () => {
		const s = read('src/common/constants/baseUrl.tsx');
		assert.match(s, /workerBaseUrl\s*=\s*"https:\/\/candidate\.moilapp\.com"/);
		assert.match(s, /businessBaseUrl\s*=\s*"https:\/\/business\.moilapp\.com"/);
	});

	it('the deploy is the production transport, not stagebeta SSH', () => {
		const d = read('.github/workflows/deploy.yml');
		assert.match(d, /branches:\s*\[main\]/);
		assert.match(d, /deploy-landing-production/);
		assert.doesNotMatch(d, /deploy-landing-stagebeta/);
		// The stagebeta repo's own gate asserts the inverse; if that file is
		// here, the wrong repo's deploy rules came across with it.
		assert.equal(fs.existsSync(path.join(ROOT, 'evals/stagebetaDeploy.test.js')), false);
	});

	it('the check can still see a violation', () => {
		assert.ok(['employer-beta', 'stagebeta'].every((b) =>
			`ctaHref="https://${b}.moilapp.com/register"`.includes(b)));
	});
});
