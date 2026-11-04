#!/usr/bin/env node
'use strict';

/**
 * Media is cached, and only a versioned name is cached forever.
 *   node --test evals/mediaCaching.test.js
 *
 * The immutable rule in next.config.js covered png/jpg/svg/woff only, so the
 * hero loops (~3 MB of MP4 each) and every WebP went out `max-age=0` and were
 * fetched again on every visit. The fix has two halves and both are pinned:
 * a cache rule for mp4/webm/webp/avif, and `immutable` ONLY for a versioned
 * file name (-v1, -v3): most of these names are not versioned, and a file
 * replaced under the same name with `immutable` would never reach a returning
 * visitor.
 *
 * Header rules are matched with Next's own path-to-regexp, the way the server
 * matches them, and the last rule setting a key wins (Next's documented order).
 *
 * The candidate hero used to render BOTH theme loops with autoPlay and hide
 * one with CSS; it renders the current theme's only, and pauses off screen.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const { pathToRegexp } = require('next/dist/compiled/path-to-regexp');

async function cacheControlFor(pathname) {
	const config = require(path.join(root, 'next.config.js'));
	const rules = await config.headers();
	let value = null;
	for (const rule of rules) {
		if (rule.has || rule.missing) continue;
		if (!pathToRegexp(rule.source, [], { strict: true, sensitive: false, delimiter: '/' }).test(pathname)) continue;
		for (const h of rule.headers) if (h.key.toLowerCase() === 'cache-control') value = h.value;
	}
	return value;
}

describe('media cache headers (next.config.js)', () => {
	it('a versioned video or image is immutable for a year', async () => {
		for (const p of [
			'/candidate/shaders/hero-shader-loop-v1.mp4',
			'/business/shaders/hero-dark-loop-v1.mp4',
			'/candidate/shaders/bilingual-section-shader-v3.webp',
			'/x/clip-v12.webm',
			'/x/photo-v2.avif',
		]) {
			assert.equal(await cacheControlFor(p), 'public, max-age=31536000, immutable', p);
		}
	});

	it('an unversioned one is cached but revalidated, never immutable', async () => {
		for (const p of ['/footer_2.webp', '/card_bg_1.webp', '/business/free-trial/example-day-01.webp', '/demo.mp4']) {
			const v = await cacheControlFor(p);
			assert.ok(v, `${p} has no Cache-Control rule`);
			assert.doesNotMatch(v, /immutable/, `${p} is immutable under a name that can be replaced`);
			assert.match(v, /max-age=\d+/, p);
			assert.doesNotMatch(v, /max-age=0\b/, p);
		}
	});

	it('pages are not swept into a media rule', async () => {
		for (const p of ['/business', '/es/business', '/candidate/searchjob']) {
			assert.equal(await cacheControlFor(p), null, p);
		}
	});

	it('every shipped mp4/webp/avif under public/ is covered', async () => {
		const files = [];
		const walk = (dir) => {
			for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
				const rel = `${dir}/${e.name}`;
				if (e.isDirectory()) walk(rel);
				else if (/\.(mp4|webm|webp|avif)$/.test(e.name)) files.push(rel.slice('public'.length));
			}
		};
		walk('public');
		assert.ok(files.length >= 10, `found only ${files.length} media files`);
		for (const f of files) assert.ok(await cacheControlFor(f), `${f} has no Cache-Control rule`);
	});
});

describe('candidate hero video', () => {
	const src = read('src/candidate/sections/hero.tsx').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

	it('renders one <video>, for the current theme', () => {
		assert.equal((src.match(/<video\b/g) || []).length, 1, 'one video element, not one per theme');
		assert.match(src, /useCandidateTheme\(\)/);
		assert.match(src, /key=\{theme\}/);
		assert.doesNotMatch(src, /autoPlay/, 'autoplay starts both loops before the theme is known');
		assert.match(src, /preload="metadata"/);
	});

	it('plays only while on screen and the tab is visible, and not under reduced motion', () => {
		assert.match(src, /new IntersectionObserver/);
		assert.match(src, /visibilitychange/);
		assert.match(src, /player\.pause\(\)/);
		assert.match(src, /prefers-reduced-motion: reduce/);
		assert.match(src, /if \(!motionAllowed\) return null;/);
	});
});
