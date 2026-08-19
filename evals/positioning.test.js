#!/usr/bin/env node
'use strict';

/**
 * Positioning + trust regression pins.
 *   node --test evals/positioning.test.js
 *
 * This file replaces evals/phase2Aeo.test.js, which pinned the copy this change set
 * removed ("AI co-founder for your shop", hiring denials, the hand-maintained FAQ).
 * Each test here guards a specific failure the audit found, so re-introducing one
 * breaks the build rather than shipping quietly. See research/seo-aeo-audit-and-plan.md.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const walk = (dir, out = []) => {
	for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
		const rel = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(rel, out);
		else if (/\.(ts|tsx)$/.test(entry.name)) out.push(rel);
	}
	return out;
};

// /legacy is unmaintained and disallowed in robots.txt; it is not a live surface.
const LIVE_SOURCES = [...walk('app'), ...walk('src')].filter((p) => !p.includes('legacy'));

const COMPARE_PAGES = [
	'app/compare/moil-vs-buffer/page.tsx',
	'app/compare/moil-vs-later/page.tsx',
	'app/compare/moil-vs-hootsuite/page.tsx',
	'app/compare/moil-vs-chatgpt/page.tsx',
	'app/compare/moil-vs-agency/page.tsx',
	'app/compare/alternative-to-consultant/page.tsx',
];

describe('the "shop" lock stays retired', () => {
	it('no live source describes Moil as being for shops', () => {
		const offenders = LIVE_SOURCES.filter((p) =>
			/(for (your|local) shops?|the shop\b|learns the shop|about your shop)/i.test(read(p)),
		);
		assert.deepEqual(offenders, [], `"shop" positioning came back in: ${offenders.join(', ')}`);
	});

	it('the H1 is driven by translations, not hardcoded English', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		assert.match(hero, /t\.business\.hero\.headline/);
		assert.match(hero, /t\.business\.hero\.headlineHighlight/);
		assert.match(hero, /t\.business\.hero\.subheadline/);
		assert.match(hero, /t\.business\.hero\.eyebrow/);
		// A hardcoded English trust pill is how /es/business shipped in English before.
		assert.doesNotMatch(hero, /Bilingual English & Spanish/);
	});
});

describe('no fabricated or unsourced social proof', () => {
	it('ships no testimonials until real ones are collected', () => {
		for (const file of ['src/common/translations/en.ts', 'src/common/translations/es.ts']) {
			const src = read(file);
			const business = src.slice(src.indexOf('\n  business: {'));
			const block = business.slice(business.indexOf('    testimonials: {'));
			assert.match(
				block.slice(0, block.indexOf('    },')),
				/items: \[\]/,
				`${file} business testimonials must stay empty`,
			);
		}
	});

	it('does not reattribute the previously fabricated quotes', () => {
		for (const file of ['src/common/translations/en.ts', 'src/common/translations/es.ts']) {
			const src = read(file);
			assert.doesNotMatch(src, /Luis Vives|Liliana Cervantes|Miguel Bustos/);
		}
	});

	it('hides the testimonial section while the array is empty', () => {
		const page = read('app/business/BusinessPageContent.tsx');
		assert.match(page, /t\.business\.testimonials\.items\.length > 0 &&/);
	});

	it('publishes no AggregateRating and no unsourced business count', () => {
		for (const file of LIVE_SOURCES) {
			const src = read(file);
			assert.doesNotMatch(src, /"@type":\s*"AggregateRating"/, `AggregateRating in ${file}`);
			assert.doesNotMatch(src, /500\+ (small )?businesses/i, `unsourced 500+ claim in ${file}`);
		}
	});
});

describe('hiring is de-linked from the business surface', () => {
	it('no business-surface copy sells or denies hiring', () => {
		const surfaces = [
			'app/business/BusinessPageContent.tsx',
			'app/business/sections/HeroSection.tsx',
			'app/business/components/BusinessFaqSection.tsx',
			'app/business/components/BusinessFooter.tsx',
			'app/business/components/BusinessNav.tsx',
			'app/business/layout.tsx',
			'app/layout.tsx',
			'app/about/page.tsx',
		];
		for (const file of surfaces) {
			const src = read(file);
			assert.doesNotMatch(src, /not a hiring platform/i, `hiring denial in ${file}`);
			// The one allowed mention is the comment recording why step5 was removed.
			const selling = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
			assert.doesNotMatch(selling, /Smart Hiring|time to hire|job post/i, `hiring copy in ${file}`);
		}
	});

	it('states the MOIL Limited clarification once per surface, not as a refrain', () => {
		// The audit found this denial repeated ~10 times, which teaches the association
		// rather than breaking it. One statement per file is a clarification; more is a tic.
		for (const file of LIVE_SOURCES) {
			const hits = (read(file).match(/MOIL Limited/g) || []).length;
			assert.ok(hits <= 2, `MOIL Limited repeated ${hits} times in ${file}`);
		}
	});
});

describe('bilingual parity', () => {
	const en = read('src/common/translations/en.ts');
	const es = read('src/common/translations/es.ts');
	const faqCount = (src) => {
		// Scope to the business section — `candidate` and `marketing` have their own
		// faq blocks, and an unscoped indexOf silently measures the wrong one.
		const business = src.slice(src.indexOf('\n  business: {'));
		const start = business.indexOf('    faq: {');
		const block = business.slice(start, business.indexOf('      ],', business.indexOf('items: [', start)));
		return (block.match(/question:/g) || []).length;
	};

	it('en and es ship the same number of FAQ entries', () => {
		assert.equal(faqCount(en), faqCount(es));
		assert.ok(faqCount(en) >= 6, 'want at least 6 FAQ entries per locale');
	});

	it('renders the FAQ from translations rather than a hardcoded array', () => {
		const faq = read('app/business/components/BusinessFaqSection.tsx');
		assert.match(faq, /t\.business\.faq\.items\.map/);
		assert.doesNotMatch(faq, /const BUSINESS_FAQ_ITEMS/);
	});

	it('generates FAQ structured data from the same source the page renders', () => {
		const layout = read('app/business/layout.tsx');
		assert.match(layout, /faqJsonLd\(en\.business\.faq\.items\)/);
		// A hand-written mainEntity array is what drifted from the component before.
		assert.doesNotMatch(layout, /"@type":\s*"FAQPage"/);
	});

	it('serves stat labels from translations', () => {
		const page = read('app/business/BusinessPageContent.tsx');
		assert.match(page, /t\.business\.statsSection\.stats\.professional/);
		assert.doesNotMatch(page, /label: 'Professional \/ month'/);
	});
});

describe('answer-engine surfaces', () => {
	it('renders the direct-answer block', () => {
		const page = read('app/business/BusinessPageContent.tsx');
		assert.match(page, /t\.business\.aeoAnswer\.body/);
		assert.match(page, /id="what-is-moil"/);
	});

	it('ships an /ai-info page with limitations and assistant guidelines', () => {
		const src = read('app/ai-info/page.tsx');
		assert.match(src, /Guidelines for AI assistants/);
		assert.match(src, /Who it is not for/);
		assert.match(src, /NOT_FOR/);
	});

	it('gives every comparison page a verdict and honest limitations', () => {
		for (const file of COMPARE_PAGES) {
			const src = read(file);
			assert.match(src, /verdict=\{\{/, `${file} is missing "best for" labels`);
			assert.match(src, /limitations=\{\[/, `${file} is missing a limitations list`);
		}
	});

	it('gives every comparison page its own FAQ questions', () => {
		const seen = new Map();
		for (const file of COMPARE_PAGES) {
			for (const [, q] of read(file).matchAll(/question:\s*\n?\s*'([^']+)'/g)) {
				assert.ok(!seen.has(q), `duplicate FAQ "${q}" in ${file} and ${seen.get(q)}`);
				seen.set(q, file);
			}
		}
		assert.ok(seen.size >= 30, `want 6+ unique FAQs per page, found ${seen.size} total`);
	});

	it('retires the duplicate and shop-named comparison pages', () => {
		assert.ok(!fs.existsSync(path.join(root, 'app/compare/moil-vs-claude')));
		assert.ok(!fs.existsSync(path.join(root, 'app/compare/bilingual-local-shop')));
		const config = read('next.config.js');
		assert.match(config, /source: '\/compare\/bilingual-local-shop'/);
		assert.match(config, /source: '\/compare\/moil-vs-claude'/);
	});

	it('does not repeat the price boilerplate across the site', () => {
		const phrase = /Professional is \$25 a month for research, plan, coaching, and documents/g;
		const total = LIVE_SOURCES.reduce((n, p) => n + (read(p).match(phrase) || []).length, 0);
		assert.ok(total <= 1, `price boilerplate repeated ${total} times; state it once per page`);
	});
});
