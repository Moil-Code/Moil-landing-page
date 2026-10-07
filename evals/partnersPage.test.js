#!/usr/bin/env node
'use strict';

/**
 * /partners says what a partnership is, and says only what is true.
 *   node --test evals/partnersPage.test.js
 *
 * The page used to be three generic paragraphs and two logos: a program
 * leader could not tell what they would get, what it would cost, how it fits
 * a grant or member program, or why it avoids new hires. It now answers those
 * questions. These checks pin the properties that make that safe to keep:
 *
 *   1. The visible FAQ and the FAQPage JSON-LD are built from ONE array.
 *   2. Every answer is the length an answer engine lifts whole (40-80 words,
 *      with slack for the sentence that interpolates the plan line).
 *   3. The page makes no claim the product does not document. Partner
 *      discounts, revenue share, reporting dashboards, white-label portals,
 *      guaranteed outcomes and result percentages are NOT published today;
 *      the legacy pricing page that listed some of them is unmaintained and
 *      its numbers contradict the current plan limits. Add one of these words
 *      only after the thing exists, and update this list in the same change.
 *   4. Plan prices are read from the one pricing source, never typed.
 *   5. Every internal link resolves to a real route.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const stripComments = (s) =>
	s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');

// The page is a thin wrapper now: PartnersBody holds the layout and schema for
// both languages, page.tsx holds the English metadata.
const WRAPPER = stripComments(read('app/partners/page.tsx'));
const BODY = stripComments(read('app/partners/PartnersBody.tsx'));
const PAGE = BODY;
const CONTENT_RAW = read('app/partners/partnerContent.ts');
const CONTENT = stripComments(CONTENT_RAW);

let ran = 0;
const check = (name, fn) =>
	test(name, () => {
		fn();
		ran += 1;
	});

// Extract the FAQS array's answers from the source. Template interpolations
// are replaced with a 15-word stand-in so the count is realistic.
function faqEntries() {
	const start = CONTENT.indexOf('export const FAQS');
	assert.ok(start > 0, 'FAQS not found in partnerContent.ts');
	const block = CONTENT.slice(start, CONTENT.indexOf('\n];', start));
	const entries = [];
	const re = /question:\s*'([^']+)',\s*answer:\s*(?:\n\s*)?(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g;
	let m;
	while ((m = re.exec(block))) {
		const answer = (m[2] ?? m[3]).replace(/\$\{[^}]+\}/g, 'x x x x x x x x x x x x x x x');
		entries.push({ question: m[1], answer });
	}
	return entries;
}

check('the page reaches the content it is built from', () => {
	const faqs = faqEntries();
	assert.ok(faqs.length >= 8, `expected 8+ FAQ entries, parsed ${faqs.length}`);
});

check('the visible FAQ and the FAQPage schema are one array', () => {
	assert.match(PAGE, /faqPageJsonLd\(copy\.faq\.items\)/, 'schema must be generated from the copy FAQ array');
	assert.match(PAGE, /copy\.faq\.items\.map\(/, 'the visible list must be rendered from the same array');
	assert.match(CONTENT, /faq:\s*\{[^}]*items:\s*FAQS/, 'the English copy must point its FAQ at FAQS');
	assert.doesNotMatch(PAGE, /acceptedAnswer/, 'no hand-written FAQ schema on the page');
});

check('every FAQ answer is liftable: question-shaped, 35-95 words', () => {
	for (const { question, answer } of faqEntries()) {
		assert.match(question, /\?$/, `"${question}" is not question-shaped`);
		const words = answer.trim().split(/\s+/).length;
		assert.ok(words >= 35 && words <= 95, `"${question}" answer is ${words} words`);
	}
});

check('the page has exactly one h1 and question-led section headings', () => {
	assert.equal((PAGE.match(/<h1[\s>]/g) || []).length, 1);
	const h2s = (PAGE.match(/<h2[\s>]/g) || []).length;
	assert.ok(h2s >= 7, `expected 7+ h2 sections, found ${h2s}`);
	for (const q of [
		'What does each business in your program get?',
		'How can Moil fit the programs you already run?',
		'What does getting started look like?',
		'How does the cost compare with doing it by hand?',
		'What does Moil not do?',
	]) {
		assert.ok(CONTENT.includes(q), `missing question heading: ${q}`);
	}
});

check('structured data: WebPage, BreadcrumbList, Service and FAQPage', () => {
	for (const t of ["'WebPage'", "'BreadcrumbList'", "'Service'"]) {
		assert.ok(PAGE.includes(`'@type': ${t}`), `missing ${t}`);
	}
	assert.match(PAGE, /jsonLd\(/, 'JSON-LD must go through the escaping serialiser');
	assert.doesNotMatch(PAGE, /JSON\.stringify/, 'never stringify JSON-LD directly');
	assert.doesNotMatch(PAGE, /AggregateRating|ratingValue|reviewRating/);
});

check('metadata: self-canonical, distinct title, description in range', () => {
	assert.match(WRAPPER, /canonical:\s*PAGE_URL/);
	assert.match(WRAPPER, /PAGE_URL = `\$\{baseURL1\}\$\{PARTNER_EN\.path\}`/);
	assert.match(CONTENT, /path:\s*'\/partners'/);
	const desc = CONTENT.match(/meta:\s*\{\s*title:\s*'[^']+',\s*description:\s*'([^']+)'/)[1];
	assert.ok(desc.length >= 120 && desc.length <= 165, `description is ${desc.length} chars`);
	const title = CONTENT.match(/meta:\s*\{\s*title:\s*'([^']+)'/)[1];
	assert.ok(title.length <= 60, `title is ${title.length} chars before the " | Moil" suffix`);
	assert.match(title, /EDC|chamber/i, 'the title must name the audience');
});

check('no claim the product does not document', () => {
	const copy = CONTENT + PAGE;
	const forbidden = [
		[/white[- ]?label/i, 'a white-label portal is not documented'],
		[/revenue[- ]?share|rev[- ]?share|commission/i, 'no revenue share exists'],
		[/\bdiscount/i, 'no partner discount is documented'],
		[/dashboard/i, 'no partner reporting dashboard is documented'],
		[/quarterly/i, 'no quarterly reporting is documented'],
		[/guarantee/i, 'nothing is guaranteed'],
		[/\b\d{1,3}\s?%/, 'no result percentage is sourced'],
		[/\b\d+\s?x\b/i, 'no multiplier is sourced'],
		[/\bsave[sd]? \d/i, 'no hours-saved figure is sourced'],
		[/500\+|\d{1,3}(,\d{3})+\+|\bK\+/i, 'no unsourced usage count'],
		[/\bthe shop\b|for (your|local) shops?/i, 'the "shop" positioning lock stays retired'],
		[/ratingValue|4\.\d\s*(★|stars?)/i, 'no star rating'],
	];
	for (const [re, why] of forbidden) {
		const hit = copy.match(re);
		assert.ok(!hit, `${why}: found "${hit && hit[0]}"`);
	}
});

check('no plan price is typed on the page; all come from the pricing source', () => {
	assert.doesNotMatch(CONTENT + PAGE, /\$(25|75)\b/, 'type no plan price here; read it from offers.ts / pricingCopy.ts');
	assert.match(CONTENT, /from '\.\.\/\.\.\/src\/common\/seo\/offers'/);
	assert.match(CONTENT, /from '\.\.\/\.\.\/src\/common\/seo\/pricingCopy'/);
});

check('the agency range is the one /compare/moil-vs-agency publishes', () => {
	const agency = read('app/compare/moil-vs-agency/page.tsx');
	assert.match(agency, /\$3,000 and \$8,000|\$3,000 to \$8,000/);
	assert.match(CONTENT, /agencyRange:\s*'\$3,000 to \$8,000'/);
});

check('both real partners are named, and links to them open safely', () => {
	const orgs = stripComments(read('app/partners/partnerCopy.ts'));
	for (const name of ['Queen Creek Chamber of Commerce', 'Buda Economic Development Corporation']) {
		assert.ok(orgs.includes(name), `${name} missing`);
	}
	assert.match(PAGE, /rel="noopener noreferrer"/);
	assert.doesNotMatch(PAGE, /rel="noreferrer"/);
});

check('every inquiry button carries the partnership subject', () => {
	const buttons = PAGE.match(/<PartnershipInquiryButton[^>]*\/>/g) || [];
	assert.ok(buttons.length >= 3, `expected 3+ inquiry entry points, found ${buttons.length}`);
	for (const b of buttons) assert.match(b, /defaultSubject=\{copy\.inquirySubject\}/, b);
	assert.match(CONTENT, /inquirySubject:\s*PARTNER_SUBJECT/);
});

check('every internal link on the page resolves to a real route', () => {
	const hrefs = [
		...[...CONTENT.matchAll(/href:\s*'(\/[^']*)'/g)].map((m) => m[1]),
		...[...CONTENT.matchAll(/(?:pricingHref|compareHref):\s*'(\/[^']*)'/g)].map((m) => m[1]),
	].filter((h) => h !== '/');
	assert.ok(hrefs.length >= 6, `only ${hrefs.length} internal links found`);
	for (const h of hrefs) {
		const file = path.join(root, 'app', h, 'page.tsx');
		assert.ok(fs.existsSync(file), `${h} does not resolve to app${h}/page.tsx`);
	}
});

check('the surfaces assistants read all point at /partners', () => {
	assert.match(read('public/llms.txt'), /moilapp\.com\/partners/);
	assert.match(read('app/ai-info/page.tsx'), /href="\/partners"/);
	assert.match(read('app/sitemap.ts'), /\/partners/);
});

check('reachability: every check above ran', () => {
	// Counted from this file's own source so adding a check cannot leave the
	// guard asserting a stale number.
	const declared = (fs.readFileSync(__filename, 'utf8').match(/^check\('/gm) || []).length - 1;
	assert.ok(declared >= 12, `only ${declared} checks declared`);
	assert.equal(ran, declared, `ran ${ran} of ${declared} checks before this one`);
});
