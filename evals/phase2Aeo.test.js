#!/usr/bin/env node
'use strict';

/**
 * Phase 2 AEO pins.
 * node --test evals/phase2Aeo.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

describe('Phase 2 AEO locks', () => {
	it('puts a real space in the business H1 lock', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		assert.match(hero, /AI co-founder<\/span>\s*\{\s*['"] ['"]\s*\}/);
		assert.match(hero, /for your shop\./);
		assert.doesNotMatch(hero, /co-founder<\/span>\s*<br \/>\s*for your shop/);
	});

	it('does not render Smart Hiring as a /business pillar', () => {
		const business = read('app/business/BusinessPageContent.tsx');
		const footer = read('app/business/components/BusinessFooter.tsx');
		assert.match(business, /step5 was Smart Hiring/);
		assert.doesNotMatch(business, /steps\.step5/);
		assert.doesNotMatch(footer, /platformLinks\.smartHiring/);
		assert.doesNotMatch(footer, /postAJob/);
		assert.match(footer, /forJobSeekers/);
	});

	it('does not put hiring back in the business H1, FAQ, or schema', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		const faq = read('app/business/components/BusinessFaqSection.tsx');
		const schema = read('app/business/layout.tsx');
		assert.doesNotMatch(hero, /Smart Hiring/);
		assert.doesNotMatch(faq, /Smart Hiring/);
		assert.doesNotMatch(schema, /"@type":\s*"AggregateRating"/);
		assert.doesNotMatch(schema, /Smart Hiring/);
	});

	it('keeps About on public company facts with no person line', () => {
		const about = read('app/about/page.tsx');
		assert.match(about, /Moil Enterprise Inc\./);
		assert.match(about, /Buda, Texas/);
		assert.match(about, /Founded 2023/);
		assert.match(about, /Not a hiring platform/);
		assert.match(about, /MOIL Limited/);
		assert.doesNotMatch(about, /Andres|Jimmy|founder name|bio/i);
	});

	it('keeps first answers in the 40–60 word lock', () => {
		const files = [
			'app/about/page.tsx',
			'app/compare/moil-vs-chatgpt/page.tsx',
			'app/compare/moil-vs-agency/page.tsx',
			'app/compare/alternative-to-consultant/page.tsx',
			'app/compare/bilingual-local-shop/page.tsx',
		];
		for (const file of files) {
			const src = read(file);
			const match = src.match(/const ANSWER =\s*'([^']+)'/);
			assert.ok(match, `${file} must export ANSWER`);
			const count = wordCount(match[1]);
			assert.ok(count >= 40 && count <= 60, `${file} ANSWER is ${count} words`);
			assert.doesNotMatch(match[1], /\$15(?!,\d)/);
			assert.doesNotMatch(src, /AggregateRating/);
		}
	});

	it('adds About and the new compare URLs to the sitemap and keeps /candidate at 0.3', () => {
		const sitemap = read('app/sitemap.ts');
		for (const url of [
			'/about',
			'/compare/moil-vs-chatgpt',
			'/compare/moil-vs-agency',
			'/compare/alternative-to-consultant',
			'/compare/bilingual-local-shop',
		]) {
			assert.match(sitemap, new RegExp(url.replace(/\//g, '\\/')));
		}
		assert.match(sitemap, /url: `\$\{baseUrl\}\/candidate`[\s\S]*priority: 0\.3/);
	});

	it('redirects /es to /es/business', () => {
		const config = read('next.config.js');
		assert.match(config, /source: '\/es'/);
		assert.match(config, /destination: '\/es\/business'/);
	});

	it('does not put $15 back or add unverified metrics on new pages', () => {
		const files = [
			'app/about/page.tsx',
			'app/compare/moil-vs-chatgpt/page.tsx',
			'app/compare/moil-vs-agency/page.tsx',
			'app/compare/alternative-to-consultant/page.tsx',
			'app/compare/bilingual-local-shop/page.tsx',
			'app/compare/AeoCitePage.tsx',
			'app/compare/aeoLocks.ts',
		];
		for (const file of files) {
			const src = read(file);
			assert.doesNotMatch(src, /\$15(?!,\d)/);
			assert.doesNotMatch(src, /500\+|4\.8|SOC 2|11-day hire|11 days/);
		}
		assert.match(read('app/compare/alternative-to-consultant/page.tsx'), /\$5,000–\$15,000/);
	});
});
