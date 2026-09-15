#!/usr/bin/env node
'use strict';

/**
 * Investor-derived EN door — /business, /business/pricing, /about, llms.txt.
 *   node --test evals/investorDoor.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function namedBlock(src, name) {
	const start = src.indexOf(`    ${name}: {`);
	assert.ok(start > 0, `missing ${name} block`);
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

function quoted(src, key) {
	const m = src.match(new RegExp(`${key}:\\s*'((?:\\\\'|[^'])*)'`));
	assert.ok(m, `missing quoted ${key}`);
	return m[1].replace(/\\'/g, "'");
}

// The H1 ships as three keys so the hero can colour one word. The LOCK is the
// sentence they compose — what a crawler and the accessibility tree read off
// the <h1> — not how it is split. Join on the single space the JSX emits.
function composedH1(hero) {
	return ['headline', 'headlineHighlight', 'headlineLine2']
		.map((key) => quoted(hero, key))
		.filter(Boolean)
		.join(' ');
}

const HATS_H1 = "You shouldn't have to be everything on top of the real job.";

describe('EN door lock', () => {
	const en = read('src/common/translations/en.ts');
	const hero = namedBlock(en.slice(en.indexOf('\n  business: {')), 'hero');
	const layout = read('app/business/layout.tsx');

	it('pins the locked title, H1, sub, and CTAs', () => {
		assert.match(layout, /AI co-founder that writes the plan and the month \| Moil/);
		assert.match(hero, /eyebrow: 'The AI co-founder for small business owners'/);
		assert.equal(composedH1(hero), HATS_H1);
		assert.match(
			hero,
			/Moil learns the business once, builds a brain that compounds, thinks with you, and does the work/,
		);
		assert.match(hero, /cta: 'Start free \\u2014 no card'/);
		assert.match(hero, /ctaSecondary: 'See Market Pro'/);
		assert.doesNotMatch(hero, /From \$25 a month/);
		assert.doesNotMatch(hero, /You\\u2019re the marketing team/);
	});

	it('AEO is the first two investor grafs only', () => {
		const aeo = namedBlock(en.slice(en.indexOf('\n  business: {')), 'aeoAnswer');
		assert.match(aeo, /Moil is the AI co-founder for small business owners/);
		assert.match(aeo, /builds a brain that compounds/);
		assert.doesNotMatch(aeo, /B2G|EDCs and chambers/);
	});

	it('HeroSection renders the H1 as ONE SPACED sentence and secondary CTA is #pricing', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		const h1 = hero.slice(hero.indexOf('<h1 '), hero.indexOf('</h1>'));
		assert.ok(h1.length > 0, 'found no <h1> in HeroSection');
		// The three keys are three elements and the tail span is display:block —
		// so the sentence LOOKS right on screen whether or not the JSX emits a
		// space between them. It does not read right to anything that takes
		// textContent: without these {' '} the H1 is "…be everythingon top…",
		// which is the string Googlebot, the SEO audit and a screen reader get.
		assert.match(h1, /hero\.headline\}<\/span>\{' '\}/);
		assert.match(h1, /hero\.headlineHighlight\}<\/strong>\{' '\}/);
		assert.match(h1, /hero\.headlineLine2\}/);
		assert.match(hero, /href="#pricing"/);
		assert.doesNotMatch(hero, /getElementById\('preview-magnet'\)/);
	});

	it('C0 first fold is URL magnet + Start free; no Moil is $25 above the fold', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		const page = read('app/business/BusinessPageContent.tsx');
		const en = read('src/common/translations/en.ts');
		const business = en.slice(en.indexOf('\n  business: {'));
		const problem = namedBlock(business, 'problem');
		const heroCopy = namedBlock(business, 'hero');

		// Keep the preview inside the first-fold hero, independent of whether
		// the visual composition is stacked or uses columns.
		const shell = hero.slice(hero.indexOf('<section className="business-hero"'), hero.lastIndexOf('</section>'));
		assert.ok(
			shell.indexOf('<PreviewMagnet') > 0,
			'URL magnet is the first-fold invite, inside the hero shell',
		);
		assert.doesNotMatch(page, /<PreviewMagnet/);
		assert.match(hero, /t\.business\.hero\.cta/);
		assert.doesNotMatch(heroCopy, /\$25/);
		assert.doesNotMatch(heroCopy, /Moil is \$25/);
		assert.doesNotMatch(problem, /Moil is \$25/);
		assert.match(problem, /Market Pro is \$75/);
		assert.match(problem, /moilPrice: '\$75'/);
		assert.doesNotMatch(problem, /Starts at just \$25/);
		assert.ok(
			page.indexOf('id="identity"') < page.indexOf('id="problem"'),
			'Traditional Consultants is demoted below identity',
		);
		assert.ok(
			page.indexOf('id="problem"') < page.indexOf('id="tiers"'),
			'compare sits with pricing, not the first body',
		);
		assert.ok(
			page.indexOf('<HeroSection') < page.indexOf('<BusinessPricingSection'),
			'Professional $25 card is not the first-fold invite',
		);
		assert.doesNotMatch(hero, /BusinessPricingSection/);
		assert.match(read('app/business/layout.tsx'), /AI co-founder that writes the plan and the month \| Moil/);
		assert.equal(composedH1(heroCopy), HATS_H1);
	});
});

describe('EN pricing lock', () => {
	it('leads with thirty days / Market Pro, not hats or job postings', () => {
		const en = read('src/common/translations/en.ts');
		const business = en.slice(en.indexOf('\n  business: {'));
		const pricing = namedBlock(business, 'pricing');
		const pricingPage = namedBlock(business, 'pricingPage');
		const layout = read('app/business/pricing/layout.tsx');
		const firstScreen = pricing + '\n' + pricingPage + '\n' + layout;

		assert.match(pricingPage, /heroHeadline: 'Thirty days of content on brand\. Research, plans, documents\.'/);
		assert.match(pricing, /headline: 'Thirty days of content on brand\. Research, plans, documents\.'/);
		assert.match(read('src/common/seo/pricingCopy.ts'), /heroSub: `Market Pro is the AI co-founder/);
		// The Professional sentence is the one source now (pricingCopy.en.heroSub);
		// the first screen must reference it and the source must still lead with
		// the research/plan/documents work.
		assert.match(firstScreen, /pricingCopy\.en\.heroSub/);
		assert.match(read('src/common/seo/pricingCopy.ts'), /Professional is \$\{pro\} a month for the research, plan and documents/);
		assert.match(layout, /Thirty days of content on brand\. Research, plans, documents\./);
		assert.doesNotMatch(firstScreen, /Stop Wearing/);
		assert.doesNotMatch(firstScreen, /10 job postings/);
		assert.doesNotMatch(firstScreen, /Recruiter & Coach/);
		assert.doesNotMatch(firstScreen, /SOC 2/);
		assert.doesNotMatch(pricingPage, /From \$25/);
	});
});

describe('about lock', () => {
	it('kills AI marketing platform and keeps the three investor grafs', () => {
		const src = read('app/about/page.tsx');
		assert.match(src, /H1 = 'Moil is the AI co-founder for small business owners\.'/);
		assert.match(src, /We sell to owners directly, and we distribute B2G through EDCs and chambers/);
		assert.match(src, /Moil is the AI co-founder for small business owners \| Moil Enterprise Inc\./);
		assert.match(src, /answer: pricingCopy\.en\.faqCost,/);
		assert.match(read('src/common/seo/pricingCopy.ts'), /faqCost: `Market Pro is \$\{mp\} a month: the whole month written for you, plus the work/);
		assert.match(src, /Moil Enterprise Inc\./);
		assert.match(src, /Buda, Texas/);
		assert.match(src, /Founded 2023/);
		assert.match(src, /Is Moil the same as MOIL Limited/);
		assert.doesNotMatch(src, /AI marketing platform/i);
		assert.doesNotMatch(src, /AI marketing for small business/i);
	});
});

describe('llms first graf', () => {
	it('opens with the locked investor paragraph and keeps start-here URLs', () => {
		const src = read('public/llms.txt');
		const first = src.slice(0, src.indexOf('\n\nProfessional'));
		assert.match(
			first,
			/Moil is the AI co-founder for small business owners\. It learns the business once, builds a brain that compounds/,
		);
		assert.match(first, /Market Pro is the product/);
		// The investor lock is the POSITIVE lead, not the negation. This line used
		// to pin /Not a hiring platform/, which collided head-on with
		// positioning.test.js ("never denies hiring") — and the two never fired
		// together only because that file could not see public/. The audit marks the
		// denial CRITICAL (research/seo-aeo-audit-and-plan.md §1.2, Phase 0.4): an
		// entity that denies its own shipping product is the worst possible input to
		// a retrieval system, because the sentence it earns in an answer becomes the
		// denial. This file also contradicted itself — line 3 denied the marketplace
		// that line 39 calls real. "Market Pro is the product" already establishes
		// the lead without teaching the association.
		assert.doesNotMatch(first, /Not a hiring platform/i);
		assert.doesNotMatch(first, /bank-plan|SBA or the lease|se arma la cabeza/i);
		assert.match(src, /https:\/\/www\.moilapp\.com\/ai-info/);
		assert.match(src, /https:\/\/www\.moilapp\.com\/business/);
		assert.match(src, /https:\/\/www\.moilapp\.com\/es\/business/);
	});
});

describe('scope', () => {
	it('magnet stays website-only', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /doorBtn\('handle'/);
		assert.doesNotMatch(magnet, /doorBtn\('place'/);
		assert.doesNotMatch(magnet, /type="email"/);
	});
});
