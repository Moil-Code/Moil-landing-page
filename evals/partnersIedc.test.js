#!/usr/bin/env node
'use strict';

/**
 * The IEDC conference door and the new /partners sections.
 *   node --test evals/partnersIedc.test.js
 *
 * /partners/iedc is where a QR code at the IEDC Annual Conference lands. It is
 * a campaign door, so it must stay out of the index and the sitemap, canonical
 * to /partners, and carry a lead subject that tells conference leads apart.
 * The new flow and jobs sections must render for both languages.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');

const PAGE = strip(read('app/partners/iedc/page.tsx'));
const COPY = strip(read('app/partners/iedc/iedcCopy.ts'));
const BODY = strip(read('app/partners/PartnersBody.tsx'));
const BUTTON = strip(read('app/partners/PartnershipInquiryButton.tsx'));
const EN = strip(read('app/partners/partnerContent.ts'));
const ES = strip(read('app/es/aliados/partnerContentEs.ts'));

let ran = 0;
const check = (name, fn) => test(name, () => { fn(); ran += 1; });

check('the conference door is noindex, canonical to /partners, and not in the sitemap', () => {
	assert.match(PAGE, /robots:\s*\{\s*index:\s*false/);
	assert.match(PAGE, /canonical:\s*`\$\{baseURL1\}\$\{PARTNER_EN\.path\}`/);
	assert.doesNotMatch(read('app/sitemap.ts'), /partners\/iedc/);
});

check('conference leads carry their own subject', () => {
	assert.match(COPY, /IEDC_SUBJECT = 'IEDC 2026 conversation'/);
	assert.match(COPY, /inquirySubject:\s*IEDC_SUBJECT/);
});

check('the prefilled message clears the form minimum and claims no booth, session or offer', () => {
	const msg = COPY.match(/message:\s*'([^']+)'/)[1];
	assert.ok(msg.length >= 20, 'prefill must satisfy the 20-character minimum');
	const all = COPY;
	for (const re of [/\bbooth\b/i, /\bsession\b/i, /\bdiscount/i, /free (pilot|trial)/i, /founding/i, /\bkeynote\b/i, /\bpanel\b/i]) {
		assert.doesNotMatch(all, re, `unsourced conference claim: ${re}`);
	}
});

check('the inquiry form prefills the message only when the visitor has typed nothing', () => {
	assert.match(BUTTON, /defaultMessage\s*=\s*''/);
	assert.match(BUTTON, /message:\s*current\.message\s*\|\|\s*defaultMessage/);
	assert.match(BUTTON, /subject:\s*current\.subject\s*\|\|\s*defaultSubject/);
});

check('every inquiry button passes the conference message through', () => {
	const buttons = BODY.match(/<PartnershipInquiryButton[^>]*\/>/g) || [];
	assert.ok(buttons.length >= 5, `found ${buttons.length}`);
	for (const b of buttons) assert.match(b, /defaultMessage=\{copy\.conference/, b);
});

check('the evergreen /partners page has no conference banner', () => {
	assert.doesNotMatch(EN, /conference:/);
	assert.doesNotMatch(ES, /conference:/);
});

check('flow and jobs sections exist in both languages and render from the copy', () => {
	for (const key of ['flow', 'jobs']) {
		assert.match(EN, new RegExp(`\\n  ${key}: \\{`), `EN ${key}`);
		assert.match(ES, new RegExp(`\\n  ${key}: \\{`), `ES ${key}`);
	}
	assert.match(BODY, /copy\.flow\.items\.map/);
	assert.match(BODY, /copy\.jobs\.items\.map/);
	assert.match(EN, /FLOW = \[/);
	const flowSteps = (EN.match(/label: '0\d · /g) || []).length;
	assert.equal(flowSteps, 5, 'five stages from conversation to content');
});

check('the new headings are question-led and there is still exactly one h1', () => {
	for (const q of ['What happens for one owner, start to finish?', 'Which of your programs does Moil change?']) {
		assert.ok(EN.includes(q), `missing ${q}`);
	}
	assert.equal((BODY.match(/<h1[\s>]/g) || []).length, 1);
});

check('the per-business figure is computed from the plan price, never typed', () => {
	assert.match(EN, /perBusiness:\s*`\$\$\{LIST_PRICE_HIGH\}`/);
	assert.match(ES, /perValue:\s*`\$\$\{LIST_PRICE_HIGH\}`/);
});

check('"how it works" and the partners come before the cost case', () => {
	const at = (id) => BODY.indexOf(`id="${id}"`);
	assert.ok(at('how-moil-works') < at('program-jobs'));
	assert.ok(at('current-partners') < at('cost'));
	assert.ok(at('how-it-works') < at('cost'));
});

check('reachability: every check above ran', () => {
	const declared = (fs.readFileSync(__filename, 'utf8').match(/^check\('/gm) || []).length - 1;
	assert.equal(ran, declared);
});
