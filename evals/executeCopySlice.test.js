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
const DESCRIPTION =
	'Moil writes a plan you can take to a lender and a month of on-brand posts. Market Pro is $75. Professional is $25 if you only want the plan, not the month.';
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

	it('description equals the draft', () => {
		assert.equal(quoted(meta, 'description'), DESCRIPTION);
		assert.equal(quoted(og, 'description'), DESCRIPTION);
		assert.equal(quoted(twitter, 'description'), DESCRIPTION);
		assert.ok(DESCRIPTION.includes('$25'), '$25 belongs in meta description only');
	});

	it('H1 string in translations/en.ts is still the hats line', () => {
		const en = read('src/common/translations/en.ts');
		const hero = namedBlock(en.slice(en.indexOf('\n  business: {')), 'hero');
		assert.equal(quoted(hero, 'headline'), HATS_H1);
	});
});
