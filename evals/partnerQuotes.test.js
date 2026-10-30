#!/usr/bin/env node
'use strict';

/**
 * Partner quotes are transcribed or omitted, and the booking link is one value.
 *   node --test evals/partnerQuotes.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');
const QUOTES = strip(read('app/partners/partnerQuotes.ts'));
const BODY = strip(read('app/partners/PartnersBody.tsx'));
const BOOKING = strip(read('app/partners/booking.ts'));

let ran = 0;
const check = (name, fn) => test(name, () => { fn(); ran += 1; });

check('every quote has a person, role, organization, source and approval date', () => {
	const body = QUOTES.slice(QUOTES.indexOf('PARTNER_QUOTES'));
	const entries = body.match(/\{[^{}]*quote:[^{}]*\}/g) || [];
	for (const e of entries) {
		for (const key of ['quote', 'name', 'role', 'organization', 'source', 'approvedOn']) {
			assert.match(e, new RegExp(`${key}:\\s*['"\`]`), `quote entry missing ${key}`);
		}
		assert.match(e, /approvedOn:\s*['"]\d{4}-\d{2}-\d{2}['"]/, 'approvedOn must be YYYY-MM-DD');
	}
});

check('the quote section hides itself while the list is empty and adds no rating schema', () => {
	assert.match(BODY, /PARTNER_QUOTES\.length > 0 &&/);
	assert.doesNotMatch(BODY + QUOTES, /AggregateRating|ratingValue|"Review"|'Review'/);
});

check('the booking link is one constant on Microsoft Bookings, opened safely', () => {
	assert.match(BOOKING, /https:\/\/bookings\.cloud\.microsoft\//);
	assert.doesNotMatch(BODY, /bookings\.cloud\.microsoft/, 'the body must import the constant, not retype the URL');
	const links = BODY.match(/<a[^>]*PARTNER_BOOKING_URL[^>]*>/g) || [];
	assert.ok(links.length >= 3, `expected booking links in hero, banner and closing section, found ${links.length}`);
	for (const l of links) assert.match(l, /rel="noopener noreferrer"/, l);
});

check('the booking copy exists in both languages and promises no meeting length', () => {
	for (const f of ['app/partners/partnerContent.ts', 'app/es/aliados/partnerContentEs.ts']) {
		const s = strip(read(f));
		assert.match(s, /\n  booking: \{/);
		assert.match(s, /\n  quotes: \{/);
		assert.doesNotMatch(s.slice(s.indexOf('booking: {'), s.indexOf('quotes: {')), /\b\d+[- ]?(min|minute|minuto)/i);
	}
});

check('reachability: every check above ran', () => {
	const declared = (fs.readFileSync(__filename, 'utf8').match(/^check\('/gm) || []).length - 1;
	assert.equal(ran, declared);
});
