#!/usr/bin/env node
'use strict';

/**
 * /es/aliados is the Spanish twin of /partners, and it is a DRAFT.
 *   node --test evals/esPartnersPage.test.js
 *
 *   1. The two pages are one component fed two copies, so they cannot drift.
 *   2. The Spanish copy carries the same claims: the same forbidden things are
 *      absent (no partner discount, revenue share, dashboard, guarantee,
 *      result figure, typed plan price) and the same real partners are named.
 *   3. Indexing is ONE flag. While `reviewed` is false the page is noindex,
 *      out of the sitemap and out of hreflang; flipping it turns all three on.
 *   4. The language toggle reaches the twin from either side.
 *   5. The Spanish FAQ is liftable (question-shaped, 35-95 words) and is the
 *      array the schema is built from.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');

const ES = strip(read('app/es/aliados/partnerContentEs.ts'));
const PAGE = strip(read('app/es/aliados/page.tsx'));
const EN_PAGE = strip(read('app/partners/page.tsx'));
const BODY = strip(read('app/partners/PartnersBody.tsx'));
const TWINS = strip(read('src/common/es/esTwinPages.ts'));
const SITEMAP = strip(read('app/sitemap.ts'));
const ROUTES = strip(read('src/common/i18n/localeRoutes.ts'));

let ran = 0;
const check = (name, fn) =>
	test(name, () => {
		fn();
		ran += 1;
	});

check('one component renders both languages', () => {
	assert.match(PAGE, /<PartnersBody copy=\{PARTNER_ES\}/);
	assert.match(EN_PAGE, /<PartnersBody copy=\{PARTNER_EN\}/);
	assert.match(ES, /export const PARTNER_ES: PartnerCopy/, 'the Spanish copy must satisfy the shared type');
	assert.match(read('app/es/aliados/layout.tsx'), /initialLang="es"/);
});

check('Spanish FAQ: question-shaped, 35-95 words, and the array the schema uses', () => {
	const start = ES.indexOf('const FAQS');
	const block = ES.slice(start, ES.indexOf('\n];', start));
	const re = /question:\s*'([^']+)',\s*answer:\s*(?:\n\s*)?(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g;
	let m;
	let n = 0;
	while ((m = re.exec(block))) {
		n += 1;
		const answer = (m[2] ?? m[3]).replace(/\$\{[^}]+\}/g, 'x x x x x x x x x x x x x x x');
		assert.match(m[1], /^¿.*\?$/, `"${m[1]}" is not a Spanish question`);
		const words = answer.trim().split(/\s+/).length;
		assert.ok(words >= 35 && words <= 95, `"${m[1]}" answer is ${words} words`);
	}
	assert.equal(n, 10, `expected 10 FAQ entries, parsed ${n}`);
	assert.match(ES, /items:\s*FAQS/);
	assert.match(BODY, /faqPageJsonLd\(copy\.faq\.items\)/);
});

check('same claims as the English page: nothing the product does not document', () => {
	const forbidden = [
		[/marca blanca|white[- ]?label/i, 'no white-label portal'],
		[/reparto de ingresos|comisi[oó]n|revenue/i, 'no revenue share'],
		[/descuento/i, 'no partner discount is documented'],
		[/panel de (control|reportes)|dashboard/i, 'no reporting dashboard'],
		[/trimestral/i, 'no quarterly reporting'],
		[/garant[ií]/i, 'nothing is guaranteed'],
		[/\b\d{1,3}\s?%/, 'no result percentage'],
		[/\b\d+\s?x\b/i, 'no multiplier'],
		[/500\+|\d{1,3}(,\d{3})+\+/, 'no unsourced usage count'],
		[/\$(25|75)\b/, 'no typed plan price'],
	];
	for (const [re, why] of forbidden) {
		const hit = ES.match(re);
		assert.ok(!hit, `${why}: found "${hit && hit[0]}"`);
	}
	assert.match(ES, /from '\.\.\/\.\.\/\.\.\/src\/common\/seo\/offers'/);
	assert.match(ES, /pricingCopy\.es\.split/);
	assert.match(ES, /AGENCY_RANGE = '\$3,000 a \$8,000'/);
});

check('Spanish page names both real partners through the shared facts', () => {
	assert.match(ES, /Cámara de Comercio de Queen Creek/);
	assert.match(ES, /Buda/);
	assert.match(BODY, /PARTNER_ORGS/);
});

check('every internal link resolves to a real route', () => {
	const hrefs = [...ES.matchAll(/(?:href|pricingHref|compareHref):\s*'(\/[^']*)'/g)].map((m) => m[1]);
	assert.ok(hrefs.length >= 6, `only ${hrefs.length} links`);
	for (const h of hrefs) assert.ok(fs.existsSync(path.join(root, 'app', h, 'page.tsx')), `${h} does not resolve`);
});

check('metadata: self-canonical, description and title in range', () => {
	const desc = ES.match(/meta:\s*\{\s*title:\s*'[^']+',\s*description:\s*'([^']+)'/)[1];
	assert.ok(desc.length >= 120 && desc.length <= 170, `description is ${desc.length} chars`);
	const title = ES.match(/meta:\s*\{\s*title:\s*'([^']+)'/)[1];
	assert.ok(title.length <= 60, `title is ${title.length} chars`);
	assert.match(PAGE, /canonical:\s*PAGE_URL/);
	assert.match(ES, /path:\s*'\/es\/aliados'/);
});

check('indexing is one flag: noindex, sitemap and hreflang cannot disagree', () => {
	const flag = TWINS.match(/path:\s*'\/es\/aliados',\s*en:\s*'\/partners',\s*reviewed:\s*(true|false)/);
	assert.ok(flag, 'the twin is not registered');
	assert.match(TWINS, /reviewed \? undefined : \{ index: false, follow: true,/, 'noindex must follow the flag');
	assert.match(TWINS, /!t\.reviewed\) return undefined/, 'hreflang must follow the flag');
	assert.match(PAGE, /robots:\s*esTwinRobots\(/);
	assert.match(EN_PAGE, /esTwinAlternates\(/);
	assert.match(SITEMAP, /ES_TWIN_PAGES\.filter\(\(t\) => t\.reviewed\)/, 'the sitemap must filter on the same flag');
	assert.match(SITEMAP, /esTwinAlternatesFor\('\/partners'\)/);
});

check('while a draft: the Spanish page is not advertised to crawlers or assistants', () => {
	const reviewed = /reviewed:\s*true/.test(TWINS);
	if (reviewed) return;
	assert.doesNotMatch(read('public/llms.txt'), /es\/aliados/, 'a draft must not be in llms.txt');
	assert.doesNotMatch(read('app/ai-info/page.tsx'), /es\/aliados/, 'a draft must not be in /ai-info');
});

check('the language toggle reaches the twin from either side', () => {
	assert.match(ROUTES, /\{ en: '\/partners', es: '\/es\/aliados' \}/);
});

check('the inquiry form has a Spanish voice and the same fallback address', () => {
	const btn = strip(read('app/partners/PartnershipInquiryButton.tsx'));
	assert.match(btn, /lang = 'en'.*lang\?: Lang/);
	assert.match(btn, /type Lang = 'en' \| 'es'/);
	assert.match(btn, /es:\s*\{/);
	assert.match(btn, /PUBLIC_FALLBACK_EMAIL/);
	assert.match(BODY, /lang=\{lang\}/);
});

check('a Spanish visit does not turn the English page Spanish', () => {
	// The shell remembers the last language. Without an explicit initialLang the
	// English page rendered with <html lang="es"> and a Spanish footer after a
	// visit to /es/aliados (measured in Chromium).
	assert.match(read('app/partners/layout.tsx'), /<BrandPageShell initialLang="en">/);
});

check('a non-JSON error response never reaches the visitor as a parse error', () => {
	// A proxy 502 page is HTML; parsing it as JSON put "Unexpected token '<'"
	// in the form's error line in both languages (measured in Chromium).
	const btn = strip(read('app/partners/PartnershipInquiryButton.tsx'));
	assert.match(btn, /await response\.json\(\)\.catch\(\(\) => \(\{\}\)\)/);
});

check('no network claim beyond what the site states elsewhere', () => {
	// TikTok and YouTube are built but held for platform approval, and LinkedIn
	// is publishable on the backend, so naming networks here goes stale.
	const en = strip(read('app/partners/partnerContent.ts'));
	for (const src of [en, ES]) {
		assert.doesNotMatch(src, /TikTok|YouTube|LinkedIn|\bX\b\./, 'the limits name no network beyond Facebook Pages and Instagram');
	}
});

check('reachability: every check above ran', () => {
	const declared = (fs.readFileSync(__filename, 'utf8').match(/^check\('/gm) || []).length - 1;
	assert.ok(declared >= 9, `only ${declared} checks declared`);
	assert.equal(ran, declared, `ran ${ran} of ${declared} checks before this one`);
});
