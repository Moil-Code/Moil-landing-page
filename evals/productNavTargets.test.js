#!/usr/bin/env node
'use strict';

/**
 * A PRODUCT LINK IS A CLAIM ABOUT WHERE THAT PRODUCT IS.
 *   node --test evals/productNavTargets.test.js
 *
 * QA 2026-09-11: the product menu sent people to the wrong place, and
 * both wrong entries were wrong SILENTLY — a link that scrolls somewhere
 * plausible does not look broken, it looks like the product is thin.
 *
 *   Business Plan  -> /business          the page you are already on
 *   Moil360        -> /business#pricing  the price list, not the product
 *
 * The same three entries were also written out twice, so the same wrong
 * href had to be fixed in two files and the next edit would have fixed
 * one of them.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const {
	PRODUCT_ANCHORS,
	PRODUCT_LINKS,
	productHref,
} = require('../app/business/productLinks');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const stripComments = (s) =>
	s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');

const PAGE = read('app/business/BusinessPageContent.tsx');
const NAV = read('app/business/components/BusinessNav.tsx');

/** Every id the /business page renders, literal or from the vocabulary. */
function renderedIds() {
	const sources = [
		PAGE,
		...fs
			.readdirSync(path.join(ROOT, 'app/business/components'))
			.filter((f) => f.endsWith('.tsx'))
			.map((f) => read(`app/business/components/${f}`)),
		...fs
			.readdirSync(path.join(ROOT, 'app/business/sections'))
			.filter((f) => f.endsWith('.tsx'))
			.map((f) => read(`app/business/sections/${f}`)),
	];
	const ids = new Set();
	for (const src of sources) {
		for (const m of src.matchAll(/\bid="([A-Za-z0-9_-]+)"/g)) ids.add(m[1]);
		// `id={PRODUCT_ANCHORS.moil360}` / `id={card.anchorId}` — an anchor
		// rendered through the vocabulary is still an anchor, and a scan that
		// could only see string literals would report the fix as missing.
		for (const m of src.matchAll(/\bid=\{PRODUCT_ANCHORS\.(\w+)\}/g)) {
			if (PRODUCT_ANCHORS[m[1]]) ids.add(PRODUCT_ANCHORS[m[1]]);
		}
		if (/\bid=\{card\.anchorId\}/.test(src)) {
			for (const m of src.matchAll(/anchorId:\s*PRODUCT_ANCHORS\.(\w+)/g)) {
				if (PRODUCT_ANCHORS[m[1]]) ids.add(PRODUCT_ANCHORS[m[1]]);
			}
		}
	}
	return ids;
}

test('every in-page product link lands on an id that exists', async (t) => {
	const ids = renderedIds();

	await t.test('the scan found a real page, not an empty one', () => {
		// A clean result and a broken walk look identical from here.
		assert.ok(
			ids.size > 8,
			`only ${ids.size} ids found — the walk is broken, not the page`,
		);
	});

	for (const link of PRODUCT_LINKS) {
		await t.test(`${link.label} -> ${link.href}`, () => {
			const [, hash] = link.href.split('#');
			if (!hash) {
				// A different page is a route, not an anchor, and is the one
				// entry that was already right.
				assert.match(link.href, /^\/[a-z0-9-]+$/);
				return;
			}
			assert.ok(
				ids.has(hash),
				`#${hash} is not rendered anywhere on /business — this link ` +
					`scrolls nowhere, which is exactly what a visitor cannot see`,
			);
		});
	}
});

test('a product link points at the PRODUCT', async (t) => {
	await t.test('never at the price list', () => {
		// The reported href verbatim. Pricing is a section about what things
		// cost, reached from its own control; sending somebody there to find
		// out what Moil360 IS answers a question they have not asked yet.
		for (const link of PRODUCT_LINKS) {
			assert.ok(
				!link.href.includes('#pricing'),
				`${link.label} points at the pricing table`,
			);
		}
	});

	await t.test('never at the bare page the visitor is already on', () => {
		for (const link of PRODUCT_LINKS) {
			assert.notEqual(
				link.href,
				'/business',
				`${link.label} goes nowhere from /business`,
			);
		}
	});

	await t.test('each product has its OWN target', () => {
		// Two products sharing an anchor is the pricing bug one step milder:
		// both land on the same block and neither is answered.
		const hrefs = PRODUCT_LINKS.map((p) => p.href);
		assert.equal(new Set(hrefs).size, hrefs.length);
	});

	await t.test('an unknown id falls back rather than throwing', () => {
		// This runs inside a nav render; a throw here takes the page down.
		assert.equal(productHref('nope'), '/business');
	});
});

test('ONE vocabulary — the two menus cannot drift', async (t) => {
	await t.test('the desktop dropdown reads it', () => {
		const code = stripComments(NAV);
		assert.match(code, /from '\.\.\/productLinks'/);
		for (const id of ['businessPlan', 'moil360', 'hiring']) {
			assert.ok(
				code.includes(`productHref('${id}')`),
				`${id} is still a hand-written href in the dropdown`,
			);
		}
	});

	await t.test('the mobile menu reads it', () => {
		const code = stripComments(PAGE);
		const i = code.indexOf('const mobileItems');
		assert.ok(i > -1);
		const block = code.slice(i, code.indexOf('];', i));
		assert.match(block, /PRODUCT_LINKS\.map/);
	});

	await t.test('neither file re-types a product href', () => {
		// Comments stripped first: both files EXPLAIN the old hrefs by
		// quoting them, and a raw scan would match the explanation and
		// report the opposite of the truth. That trap has fired in this
		// repo before.
		for (const [name, src] of [
			['BusinessNav.tsx', stripComments(NAV)],
			['BusinessPageContent.tsx', stripComments(PAGE)],
		]) {
			assert.ok(
				!/href:\s*'\/business#pricing'/.test(src),
				`${name} still hand-writes the pricing href`,
			);
		}
	});
});
