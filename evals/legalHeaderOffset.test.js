#!/usr/bin/env node
'use strict';

/**
 * Legal pages clear the fixed header.
 *   node --test evals/legalHeaderOffset.test.js
 *
 * `CandidateNavigation` is `position: fixed; top: 0`, so it is out of flow and
 * paints over whatever the page draws at y=0. `LegalPage` offset nothing, so
 * every legal page opened with its "Back" link underneath the nav bar —
 * measured in headless Chromium at 25px behind it at >=1024px and 17px at
 * 390px. The top half of the only way out of the page was unclickable, which
 * is what the Aug 2026 staging test reported as the Cookie Policy header
 * "not having a great User Experience".
 *
 * The assertions are on the RELATIONSHIP between the two files, not on a
 * transcribed pixel table: the offset has to track the header's own height at
 * the header's own breakpoints. Nothing errors when they drift — the Back link
 * just quietly slides back under the bar — so a pinned literal here would go
 * stale the first time the header is resized and report green over the bug.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const NAV = read('src/candidate/components/navigation.tsx');
const LEGAL = read('src/common/components/LegalPage.tsx');

/** Every `h-<n>` on the header's own row, keyed by breakpoint prefix. */
function headerHeights(src) {
	const row = src.match(/className="flex items-center justify-between ([^"]+)"/);
	assert.ok(row, 'header row classes not found — did the nav markup change?');
	const out = {};
	for (const cls of row[1].split(/\s+/)) {
		const m = cls.match(/^(?:([a-z]+):)?h-(\d+)$/);
		if (m) out[m[1] || 'base'] = Number(m[2]);
	}
	return out;
}

/** Every `pt-<n>` on the LegalPage content wrapper, keyed by breakpoint. */
function contentTopPadding(src) {
	const wrap = src.match(/className="([^"]*\bpt-\d+[^"]*)"/);
	assert.ok(wrap, 'LegalPage content wrapper has no pt-* — the fixed header will cover the Back link');
	const out = {};
	for (const cls of wrap[1].split(/\s+/)) {
		const m = cls.match(/^(?:([a-z]+):)?pt-(\d+)$/);
		if (m) out[m[1] || 'base'] = Number(m[2]);
	}
	return out;
}

describe('legal pages clear the fixed header', () => {
	it('the nav is fixed to the top — which is why an offset is needed at all', () => {
		assert.match(NAV, /<header className="fixed top-0/);
	});

	it('LegalPage offsets its content by the header height at every breakpoint', () => {
		const heights = headerHeights(NAV);
		const padding = contentTopPadding(LEGAL);

		assert.ok(Object.keys(heights).length >= 2, 'expected the header to declare a responsive height');

		for (const [bp, h] of Object.entries(heights)) {
			assert.equal(
				padding[bp],
				h,
				`legal content must clear the header at "${bp}": header is h-${h}, content pads pt-${padding[bp]}`,
			);
		}

		// And no offset the header does not have — an extra breakpoint here
		// leaves a gap at a width the header never grows into.
		for (const bp of Object.keys(padding)) {
			assert.ok(bp in heights, `content pads at "${bp}" but the header has no height there`);
		}
	});

	it('every legal route goes through the one shell, so the offset cannot be missed', () => {
		// /terms used to hand-roll a byte-for-byte copy of this shell, which is
		// why the same overlap existed twice and fixing one left the other.
		const pages = [
			'cookies', 'terms', 'privacy', 'dmca',
			'dpa', 'subprocessors', 'accessibility', 'privacy-choices',
		];
		for (const p of pages) {
			const src = read(path.join('app', p, 'page.tsx'));
			assert.match(src, /LegalPage/, `app/${p}/page.tsx must render the shared LegalPage`);
			assert.doesNotMatch(
				src,
				/<CandidateNavigation/,
				`app/${p}/page.tsx mounts its own nav — that is the duplicate shell this test exists to stop`,
			);
		}
	});
});
