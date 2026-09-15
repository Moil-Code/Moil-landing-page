#!/usr/bin/env node
'use strict';

/**
 * Execute copy slice — English /business metadata only.
 *   node --test evals/executeCopySlice.test.js
 *
 * Title and description must equal the draft exactly. H1 stays the live
 * hats line. $25 is in the description, never in the title.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const TITLE = 'AI co-founder that writes the plan and the month | Moil';
// 2026-09-05: the description is no longer a literal in the layout. Every
// prose price claim reads from src/common/seo/pricingCopy.ts (evals/
// pricingCopy.test.js is the gate), so this pins the layout to that import and
// the import to the approved sentence — prices come from offers.ts, hence the
// template placeholders.
const DESCRIPTION_TEMPLATE =
	'Moil, the AI co-founder for small business owners: research, a real plan, and a taste of the studio. ${pro}/mo. The whole month written for you: ${mp}.';
const HATS_H1 = "You shouldn't have to be everything on top of the real job.";

function metadataExport(src) {
	const start = src.indexOf('export const metadata');
	assert.ok(start >= 0, 'missing metadata export');
	const brace = src.indexOf('{', start);
	let depth = 0;
	for (let i = brace; i < src.length; i++) {
		if (src[i] === '{') depth++;
		if (src[i] === '}') {
			depth--;
			if (depth === 0) return src.slice(start, i + 1);
		}
	}
	assert.fail('unclosed metadata export');
}

function quoted(src, key) {
	const re = new RegExp(`${key}:\\s*'((?:\\\\'|[^'])*)'`);
	const m = src.match(re);
	assert.ok(m, `missing quoted ${key}`);
	return m[1].replace(/\\'/g, "'");
}

// The H1 ships as three keys (headline + headlineHighlight + headlineLine2) so
// the hero can colour one word. The LOCK is the sentence they compose — what a
// crawler and the accessibility tree read off the <h1> — not how it is split,
// so read all three and join on the single space the JSX emits between them.
function composedH1(hero) {
	return ['headline', 'headlineHighlight', 'headlineLine2']
		.map((key) => quoted(hero, key))
		.filter(Boolean)
		.join(' ');
}

function namedBlock(src, name) {
	const start = src.search(new RegExp(`(?:^|\\n)\\s*${name}: \\{`));
	assert.ok(start >= 0, `missing ${name} block`);
	const open = src.indexOf('{', start);
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		if (src[i] === '{') depth++;
		if (src[i] === '}') {
			depth--;
			if (depth === 0) return src.slice(start, i + 1);
		}
	}
	return src.slice(start);
}

describe('execute copy slice — /business metadata', () => {
	const layout = read('app/business/layout.tsx');
	const meta = metadataExport(layout);
	const og = namedBlock(meta, 'openGraph');
	const twitter = namedBlock(meta, 'twitter');

	it('title absolute string equals the draft', () => {
		const absolute = quoted(meta, 'absolute');
		assert.equal(absolute, TITLE);
		assert.equal(quoted(og, 'title'), TITLE);
		assert.equal(quoted(twitter, 'title'), TITLE);
		assert.ok(!absolute.includes('$25'), '$25 must never go in the title');
	});

	it('description is the one price-copy source, and that source equals the draft', () => {
		assert.match(meta, /\n  description: META_EN,/);
		assert.match(og, /description: META_EN,/);
		assert.match(twitter, /description: META_EN,/);
		const copy = read('src/common/seo/pricingCopy.ts');
		assert.ok(copy.includes('export const META_EN = pricingCopy.en.meta;'));
		assert.ok(copy.includes(`    meta: \`${DESCRIPTION_TEMPLATE}\`,`), 'en.meta template drifted from the draft');
		assert.ok(DESCRIPTION_TEMPLATE.includes('${pro}'), 'the price belongs in the meta description, read from offers.ts');
	});

	it('H1 string in translations/en.ts is still the hats line', () => {
		const en = read('src/common/translations/en.ts');
		const hero = namedBlock(en.slice(en.indexOf('\n  business: {')), 'hero');
		assert.equal(composedH1(hero), HATS_H1);
	});
});
