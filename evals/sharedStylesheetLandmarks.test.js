#!/usr/bin/env node
'use strict';

/**
 * A SHARED STYLESHEET MAY NOT STYLE A LANDMARK BY ITS ELEMENT NAME.
 *   node --test evals/sharedStylesheetLandmarks.test.js
 *
 * Reported from staging as the footer links overlapping each other on mobile.
 * The cause was one selector: `business.css` styled `nav { position: fixed;
 * top: 0 }`, and that stylesheet is imported by 23 layouts. `nav` is a (0,0,1)
 * ELEMENT selector, so it did not describe "the site's top bar" — it described
 * EVERY `<nav>` on every one of those pages:
 *
 *   - `SiteFooter` renders two (`Footer navigation`, `Legal`). Both were
 *     lifted out of flow and pinned to y=0, on top of each other and on top of
 *     the real bar. That is the reported overlap.
 *   - `LegalPage` renders TWO MORE with no className at all, so the eight
 *     compliance pages stacked three fixed bars at the viewport top. Nobody
 *     had reported that one.
 *
 * The same stylesheet styled `footer` the same way, and that leak was live and
 * unreported too: `app/reviews/page.tsx` gives each review card's byline a
 * `<footer className="review__author">`, and `.review__author` declares no
 * padding or background of its own — so every byline on `/reviews` was painted
 * with the PAGE FOOTER's chrome (72px/52px padding, a surface fill and a top
 * border). `LegalPage`'s inner `<footer className={styles.related}>` escaped
 * only by accident, because its class happens to override all three.
 *
 * NOTHING ERRORS IN EITHER CASE, and that is why both survived: the markup is
 * correct, the stylesheet is valid, and the damage is only visible on a page
 * nobody was looking at while editing a page they were.
 *
 * THE RULE IS ABOUT LANDMARKS, NOT ABOUT ELEMENT SELECTORS IN GENERAL.
 * `html`, `body` and a keyframe's `from`/`to` are genuinely one-per-document
 * and are deliberately not covered — failing on those would make this a
 * nuisance gate, and a nuisance gate gets weakened. What is covered is the set
 * of elements a component legitimately renders MANY of on one page, which is
 * exactly the set that cannot be addressed by name from a shared sheet.
 *
 * SCOPING RAISES SPECIFICITY AND THAT COSTS NOTHING HERE: `#nav` is (1,0,0)
 * against `nav`'s (0,0,1), but it targets exactly one element, so it cannot
 * restyle anything it was not already styling. Both ids are asserted to be on
 * the components that own them, so a rename cannot leave a rule pointing at
 * nothing.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

/**
 * Elements a page may legitimately hold several of, so a shared stylesheet can
 * never mean one particular one by naming it. `header`/`main` are here for the
 * same reason even though none leaks today: the cost of listing them is zero
 * and the cost of discovering the next instance is a founder's screenshot.
 */
const LANDMARKS = [
	'nav', 'footer', 'header', 'main', 'aside', 'section', 'article', 'form',
];

/** Every stylesheet imported by more than one route's layout/page. */
function sharedStylesheets() {
	const out = new Map();
	const walk = (dir) => {
		for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
			if (e.name === 'node_modules' || e.name === '.next') continue;
			const p = path.join(dir, e.name);
			if (e.isDirectory()) { walk(p); continue; }
			if (!/\.(tsx|ts|jsx|js)$/.test(e.name)) continue;
			const src = fs.readFileSync(p, 'utf8');
			for (const m of src.matchAll(/^\s*import\s+['"]([^'"]+\.css)['"]/gm)) {
				if (/\.module\.css$/.test(m[1])) continue;
				const target = path.resolve(path.dirname(p), m[1]);
				if (!fs.existsSync(target)) continue;
				if (!out.has(target)) out.set(target, new Set());
				out.get(target).add(path.relative(root, p));
			}
		}
	};
	walk(path.join(root, 'app'));
	walk(path.join(root, 'src'));
	return [...out.entries()].filter(([, importers]) => importers.size > 1);
}

/** Selectors that start a rule, comments stripped so a banner cannot match. */
function ruleSelectors(css) {
	const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
	const out = [];
	for (const m of bare.matchAll(/(?:^|[};])\s*([^{};@]+?)\s*\{/g)) {
		for (const part of m[1].split(',')) out.push(part.trim());
	}
	return out;
}

describe('a shared stylesheet never styles a landmark by element name', () => {
	const shared = sharedStylesheets();

	it('the walk found real shared stylesheets', () => {
		// A clean result and a broken walker look identical from here.
		assert.ok(
			shared.length >= 1,
			'found no stylesheet imported by more than one file — the walk is broken',
		);
		const biggest = Math.max(...shared.map(([, imp]) => imp.size));
		assert.ok(biggest >= 5, `widest shared stylesheet has only ${biggest} importers`);
	});

	it('no landmark is addressed by its element name', () => {
		const offenders = [];
		for (const [file, importers] of shared) {
			const rel = path.relative(root, file);
			for (const sel of ruleSelectors(fs.readFileSync(file, 'utf8'))) {
				// Only a BARE landmark: `nav`, `nav.scrolled`, `nav:hover`,
				// `nav > a`. A rule rooted at a class (`.x nav`) is already
				// scoped by whatever holds it, and so is one PINNED TO AN
				// IDENTITY — `section[id="identity"]` and `#nav` both name
				// exactly one element, which is the whole fix, so flagging
				// them would fail for a reason that is not the defect. A
				// CLASS qualifier does not count: `nav.scrolled` is still
				// every scrolled nav on the page.
				const m = /^([a-z]+)(?=$|[\s.:>+~[])/.exec(sel);
				if (!m || !LANDMARKS.includes(m[1])) continue;
				const rest = sel.slice(m[1].length);
				if (/^(#|\[\s*id\s*[=~|^$*]?=)/.test(rest)) continue;
				offenders.push(`${rel} :: "${sel}" (imported by ${importers.size} files)`);
			}
		}
		assert.deepEqual(
			offenders,
			[],
			`a shared stylesheet styles a landmark by element name, so it hits every ` +
				`one of those on every importing page:\n  ${offenders.join('\n  ')}`,
		);
	});

	it('each scoped rule still names an element that exists', () => {
		// Scoping is only a fix if the id is really on the component. A rule
		// pointing at nothing is the same bug with the bar missing instead.
		const css = read('app/business/business.css');
		for (const [selector, component, tag] of [
			['#nav', 'app/business/components/BusinessNav.tsx', 'nav'],
			['#site-footer', 'app/business/components/BusinessFooter.tsx', 'footer'],
		]) {
			const id = selector.slice(1);
			assert.match(
				css,
				new RegExp(`(^|[};])\\s*${selector}\\s*\\{`, 'm'),
				`${selector} has no rule in business.css`,
			);
			assert.match(
				read(component),
				new RegExp(`<${tag}\\s[^>]*id="${id}"`),
				`${component} does not render <${tag} id="${id}"> — ${selector} styles nothing`,
			);
		}
	});
});
