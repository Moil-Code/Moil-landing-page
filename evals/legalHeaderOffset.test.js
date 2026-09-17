#!/usr/bin/env node
'use strict';

/**
 * Legal pages clear the fixed nav.
 *   node --test evals/legalHeaderOffset.test.js
 *
 * The nav is `position: fixed; top: 0`, so it is out of flow and paints over
 * whatever the page draws at y=0. `LegalPage` offset nothing, so every legal
 * page opened with its "Back" link underneath the bar — measured in headless
 * Chromium at 25px behind it at >=1024px and 17px at 390px. The top half of the
 * only way out of the page was unclickable, which is what the Aug 2026 staging
 * test reported as the Cookie Policy header "not having a great User
 * Experience".
 *
 * THIS GATE HAD ROTTED IN BOTH DIRECTIONS AND THAT IS THE FINDING WORTH
 * KEEPING. It read Tailwind `h-*` off `CandidateNavigation` and `pt-*` off
 * `LegalPage`, and by 2026-09-04 neither was true:
 *
 *   - Legal pages mount `BrandPageShell` -> `BusinessNav`, NOT
 *     `CandidateNavigation`. So its first assertion passed for the wrong
 *     reason — a real `fixed top-0` on a component these pages never render.
 *   - `LegalPage` moved to a CSS module, so its `pt-*` regex could no longer
 *     see an offset that is present and correct. It failed for a reason that
 *     is not the defect it guards, which is how a gate gets weakened by
 *     whoever has to get past it.
 *
 * HONEST LIMIT, written down rather than assumed away: `nav` has no declared
 * height. It is a flex row whose height comes from its tallest child, so a
 * source scan can only derive a FLOOR — the logo's own declared height plus
 * the nav's vertical padding and border. Clearing that floor does not prove
 * the offset clears the real painted bar; only a render does. What it does
 * catch is the defect that actually shipped: the offset going to zero, or
 * being dropped at one breakpoint while the nav keeps its height there.
 *
 * Both sides are DERIVED, never transcribed. A pinned pixel table goes stale
 * the first time the nav is resized and then reports green over the bug.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const SHELL = read('src/common/components/BrandPageShell.tsx');
const NAV = read('app/business/components/BusinessNav.tsx');
const NAV_CSS = read('app/business/business.css');
const LEGAL = read('src/common/components/LegalPage.tsx');
const LEGAL_CSS = read('src/common/components/LegalPage.module.css');

/**
 * THE NAV RULE IS FOUND BY THE ID THE COMPONENT RENDERS, never by the bare
 * element name. `business.css` used to style `nav` — a (0,0,1) element
 * selector in a stylesheet 23 layouts import — so the fixed bar leaked onto
 * every unrelated `<nav>` on those pages: both of SiteFooter's link groups,
 * and the two bare `<nav>`s inside LegalPage itself, which stacked three
 * fixed bars at the top of all eight compliance pages. Scoping it to `#nav`
 * fixes that, and it is also what this gate should have been anchored on all
 * along — `BusinessNav`'s root is `<nav id="nav">`, so the id is the thing
 * that identifies the bar, while the element name identifies every nav on the
 * page. The selector is DERIVED from the component rather than typed here, so
 * a future rename fails loudly instead of matching nothing and reporting a
 * nav with no rules.
 */
const NAV_ID = (() => {
	const m = /<nav\s+id="([A-Za-z0-9_-]+)"/.exec(NAV);
	assert.ok(m, 'BusinessNav root carries no id — the nav rule cannot be located');
	return m[1];
})();
const NAV_SELECTOR = `#${NAV_ID}`;

const LEGAL_ROUTES = [
	'cookies', 'terms', 'privacy', 'dmca',
	'dpa', 'subprocessors', 'accessibility', 'privacy-choices',
];

/**
 * Rules for one selector, as `{ maxWidth, body }`, in source order: the base
 * rule first (maxWidth Infinity) then each `@media (max-width: N)` it appears
 * in. Later entries win at widths they cover, which is how the cascade reads.
 */
function rulesFor(source, selector) {
	// Comments first: `nav {` sits directly under a banner comment, so a
	// prefix class that has not seen `*/` cannot match the base rule at all.
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	const out = [];
	const decl = new RegExp(`(^|[{},;])\\s*${selector}\\s*\\{([^}]*)\\}`, 'g');

	// Base rules: everything outside an @media block.
	let base = '';
	const media = [];
	for (let i = 0; i < css.length; i += 1) {
		if (css.startsWith('@media', i)) {
			const open = css.indexOf('{', i);
			let d = 1;
			let j = open + 1;
			for (; j < css.length && d > 0; j += 1) {
				if (css[j] === '{') d += 1;
				else if (css[j] === '}') d -= 1;
			}
			media.push({ head: css.slice(i, open), body: css.slice(open + 1, j - 1) });
			i = j - 1;
			continue;
		}
		base += css[i];
	}

	for (const m of base.matchAll(decl)) out.push({ maxWidth: Infinity, body: m[2] });
	for (const block of media) {
		const mw = block.head.match(/max-width:\s*(\d+)px/);
		if (!mw) continue;
		for (const m of block.body.matchAll(decl)) {
			out.push({ maxWidth: Number(mw[1]), body: m[2] });
		}
	}
	return out;
}

/** Every `@media (max-width: N)` in a stylesheet, as numbers. */
function maxWidthBreakpoints(css) {
	return [...css.matchAll(/@media\s*\(max-width:\s*(\d+)px\)/g)].map((m) => Number(m[1]));
}

/** Top value of a `padding` shorthand or a `padding-top` longhand, or null. */
function topPadding(body) {
	const long = [...body.matchAll(/padding-top:\s*(\d+)px/g)].pop();
	const short = [...body.matchAll(/(?:^|;)\s*padding:\s*([^;}]+)/g)].pop();
	// The longhand wins only if it comes after the shorthand in the same body.
	if (long && (!short || body.lastIndexOf(long[0]) > body.lastIndexOf(short[0]))) {
		return Number(long[1]);
	}
	if (short) {
		const first = short[1].trim().split(/\s+(?![^(]*\))/)[0];
		const px = first.match(/^(\d+)px$/);
		if (px) return Number(px[1]);
	}
	if (long) return Number(long[1]);
	return null;
}

/** The declared value of a property that applies at `width`. */
function valueAt(rules, width, pick) {
	let value = null;
	for (const rule of rules) {
		if (width > rule.maxWidth) continue;
		const v = pick(rule.body);
		if (v !== null && v !== undefined) value = v;
	}
	return value;
}

/**
 * A FLOOR on the painted nav height at `width`: the logo's own declared height
 * plus the nav's vertical padding and bottom border. The real bar can only be
 * taller (a button with more padding, a text logo with line-height), which is
 * the safe direction for a clearance floor.
 */
function navHeightFloor(width) {
	const logo = NAV.match(/height:\s*'(\d+)px'/);
	assert.ok(logo, 'nav logo declares no explicit height — the floor cannot be derived');

	const rules = rulesFor(NAV_CSS, NAV_SELECTOR);
	assert.ok(
		rules.length >= 2,
		`expected \`${NAV_SELECTOR}\` to declare a responsive padding`,
	);

	const pad = valueAt(rules, width, topPadding);
	assert.ok(pad !== null, `${NAV_SELECTOR} declares no padding at ${width}px`);

	const border = /border-bottom:\s*(\d+)px/.exec(rules[0].body);
	return Number(logo[1]) + pad * 2 + (border ? Number(border[1]) : 0);
}

/** The top offset the legal shell puts between y=0 and its first painted row. */
function legalTopOffset(width) {
	const rules = rulesFor(LEGAL_CSS, '\\.hero');
	assert.ok(rules.length, '.hero not found in LegalPage.module.css');
	const pad = valueAt(rules, width, topPadding);
	assert.ok(
		pad !== null,
		`LegalPage .hero declares no top offset at ${width}px — the fixed nav will cover the Back link`,
	);
	return pad;
}

/** Every width worth sampling, derived from BOTH sides' own breakpoints. */
function sampleWidths() {
	const bps = new Set([...maxWidthBreakpoints(NAV_CSS), ...maxWidthBreakpoints(LEGAL_CSS)]);
	const widths = new Set([320, 390, 768, 1024, 1440]);
	for (const b of bps) {
		widths.add(b);
		widths.add(b + 1);
	}
	return [...widths].sort((a, b) => a - b);
}

describe('legal pages clear the fixed nav', () => {
	it('legal pages mount the shell whose nav is fixed to the top', () => {
		// The rotted version asserted this about CandidateNavigation, which
		// these pages do not render. Pin the nav they DO get.
		for (const route of LEGAL_ROUTES) {
			assert.match(
				read(path.join('app', route, 'layout.tsx')),
				/BrandPageShell/,
				`app/${route}/layout.tsx must render through BrandPageShell`,
			);
		}
		assert.match(SHELL, /<BusinessNav/, 'BrandPageShell no longer mounts BusinessNav');
		assert.match(NAV, /<nav id="nav"/, 'BusinessNav root is no longer the #nav element');

		const base = rulesFor(NAV_CSS, NAV_SELECTOR)[0];
		assert.ok(base, `\`${NAV_SELECTOR}\` has no base rule in business.css`);
		assert.match(base.body, /position:\s*fixed/, 'nav is not fixed — this whole gate assumes it is');
		assert.match(base.body, /top:\s*0/, 'nav is not pinned to the top');
	});

	it('the legal shell clears the nav at every breakpoint either side declares', () => {
		const widths = sampleWidths();
		const seenNav = new Set();
		const seenOffset = new Set();

		for (const w of widths) {
			const floor = navHeightFloor(w);
			const offset = legalTopOffset(w);
			seenNav.add(floor);
			seenOffset.add(offset);
			assert.ok(
				offset >= floor,
				`at ${w}px the legal content starts at ${offset}px but the nav is at least ${floor}px tall`,
			);
		}

		// Reachability: a sample set that never changes on either side proves
		// nothing about breakpoints, and a clean result would look identical.
		assert.ok(widths.length >= 4, 'sampled too few widths to say anything about breakpoints');
		assert.ok(seenNav.size >= 2, 'no sampled width changed the nav height — the sample missed its breakpoints');
		assert.ok(seenOffset.size >= 2, 'no sampled width changed the legal offset — the sample missed its breakpoints');
	});

	it('every legal route goes through the one shell, so the offset cannot be missed', () => {
		// /terms used to hand-roll a byte-for-byte copy of this shell, which is
		// why the same overlap existed twice and fixing one left the other.
		for (const p of LEGAL_ROUTES) {
			const src = read(path.join('app', p, 'page.tsx'));
			assert.match(src, /LegalPage/, `app/${p}/page.tsx must render the shared LegalPage`);
			assert.doesNotMatch(
				src,
				/<(CandidateNavigation|BusinessNav)\b/,
				`app/${p}/page.tsx mounts its own nav — that is the duplicate shell this test exists to stop`,
			);
		}
		assert.match(LEGAL, /className=\{styles\.hero\}/, 'LegalPage no longer renders the .hero row this gate measures');
	});
});
