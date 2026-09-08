#!/usr/bin/env node
'use strict';

/**
 * Freshness is derived, and Bing is told (plan 8.3 / 8.4, F11 / F12).
 *   node --test evals/pageDatesAndIndexNow.test.js
 *
 * F12: app/sitemap.ts stamped `lastModified: today` on every URL — the shape
 * the blog's own audit fails the build for — and the Article schema hand-typed
 * a stale dateModified. Both read scripts/page-dates.mjs's output now.
 * F11: no host had an IndexNow key or call. The key file, the script, the
 * deploy hook and the dry run are pinned here.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const dates = JSON.parse(read('src/common/seo/pageDates.json'));
const sitemap = read('app/sitemap.ts');

describe('page dates (8.4)', () => {
	// Literal routes only. The reviewed Spanish pages (src/common/es/esPages.ts)
	// enter as ONE mapped entry whose url is `${baseUrl}${p.path}`; that entry
	// is asserted separately below rather than parsed as a route named "${p.path}".
	const allUrls = [...sitemap.matchAll(/url: `\$\{baseUrl\}([^`]*)`/g)].map((m) => m[1]);
	const sitemapRoutes = allUrls.filter((r) => !r.includes('${'));
	const dynamicEntries = allUrls.length - sitemapRoutes.length;

	it('the sitemap declares a real number of routes and every one has a derived date', () => {
		assert.ok(sitemapRoutes.length >= 25, `only ${sitemapRoutes.length} sitemap routes parsed`);
		for (const r of sitemapRoutes) assert.ok(dates[r], `${r} is in the sitemap and has no entry in pageDates.json`);
	});
	it('every sitemap entry reads its date from pageDates, never the clock', () => {
		// Comments stripped first: the explanation beside the code quotes the
		// removed idiom verbatim, and a raw match would report the opposite of
		// the truth.
		const code = sitemap.replace(/\/\/.*$/gm, '');
		assert.doesNotMatch(code, /lastModified: today/);
		assert.doesNotMatch(code, /new Date\(\)/);
		assert.equal((sitemap.match(/lastModified: dateFor\('/g) || []).length, sitemapRoutes.length);
		// The mapped Spanish entry reads its date the same way, keyed on the page path.
		assert.equal(dynamicEntries, 1, 'exactly one mapped sitemap entry (the reviewed Spanish pages)');
		assert.match(code, /lastModified: dateFor\(p\.path\)/);
	});
	it('the dates are not all one date (the blog\'s own rule, ported)', () => {
		assert.ok(new Set(Object.values(dates)).size > 1, 'every route shares one lastmod — dates are not being derived');
		for (const d of Object.values(dates)) assert.match(d, /^\d{4}-\d{2}-\d{2}$/);
	});
	it('both Article blocks read dateModified from the same source', () => {
		const en = read('app/business/layout.tsx');
		const es = read('app/es/business/layout.tsx');
		assert.match(en, /"dateModified": pageDates\["\/business"\]/);
		assert.doesNotMatch(en, /"dateModified": "20\d\d-/, 'a hand-typed dateModified is back');
		assert.match(es, /'@type': 'Article'/);
		assert.match(es, /dateModified: pageDates\['\/es\/business'\]/);
	});
	it('the script runs before every build and refuses a shallow checkout', () => {
		assert.match(read('package.json'), /"prebuild": "node scripts\/page-dates\.mjs"/);
		const script = read('scripts/page-dates.mjs');
		assert.match(script, /is-shallow-repository/);
		assert.match(script, /Keeping the committed pageDates\.json/);
	});
	it('does not count its generated output as a page change', () => {
		const script = read('scripts/page-dates.mjs');
		assert.match(
			script,
			/:\(exclude\)src\/common\/seo\/pageDates\.json/,
			'committing pageDates.json must not make pageDates.json stale again',
		);
	});
	it('the committed file is what git says now (only checked with full history)', () => {
		const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8' }).trim() === 'true';
		if (shallow) {
			console.log('  skip  shallow checkout — pageDates.json freshness NOT checked (this is not a pass)');
			return;
		}
		try {
			execFileSync('node', ['scripts/page-dates.mjs', '--check', '--quiet'], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
		} catch (err) {
			assert.fail(`pageDates.json is stale — run \`npm run page-dates\`: ${String(err.stderr || err.message).trim()}`);
		}
	});
});

describe('IndexNow (8.3)', () => {
	const script = read('scripts/indexnow.mjs');
	const key = script.match(/INDEXNOW_KEY = '([0-9a-f]+)'/)[1];

	it('the key is 32 lowercase hex and served from public/', () => {
		assert.match(key, /^[0-9a-f]{32}$/);
		assert.equal(read(`public/${key}.txt`).trim(), key);
	});
	it('submits only what the served sitemap lists, and only on the submitted host', () => {
		assert.match(script, /<loc>\(\[\^<\]\+\)<\\\/loc>/);
		assert.match(script, /new URL\(u\)\.host === host/);
		assert.match(script, /refusing to post an empty list/);
		assert.match(script, /--dry-run/);
		assert.match(script, /process\.exit\(1\)/, 'a refused submission must exit non-zero');
	});
	it('is reachable from package.json and runs after a healthy deploy, opt-in per host', () => {
		assert.match(read('package.json'), /"indexnow": "node scripts\/indexnow\.mjs"/);
		const deploy = read('.github/deploy.sh');
		assert.match(deploy, /INDEXNOW_SUBMIT/);
		assert.ok(deploy.indexOf('node scripts/indexnow.mjs') > deploy.indexOf('log "Deployed $NEW_SHA"'), 'IndexNow must run only after the health check passed');
		assert.match(deploy, /IndexNow submission FAILED/);
		assert.match(read('DEPLOYMENT.md'), /INDEXNOW_SUBMIT=1/);
	});
});
