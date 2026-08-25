#!/usr/bin/env node
'use strict';

/**
 * Investor-derived EN door — /business, /business/pricing, /about, llms.txt.
 *   node --test evals/investorDoor.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
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

function gitDiff(args) {
	try {
		return execSync(`git diff origin/main -- ${args}`, { cwd: root, encoding: 'utf8' });
	} catch {
		return execSync(`git diff main -- ${args}`, { cwd: root, encoding: 'utf8' });
	}
}

describe('EN door lock', () => {
	const en = read('src/common/translations/en.ts');
	const hero = namedBlock(en.slice(en.indexOf('\n  business: {')), 'hero');
	const layout = read('app/business/layout.tsx');

	it('pins the locked title, H1, sub, and CTAs', () => {
		assert.match(layout, /AI co-founder for small business owners \| Moil/);
		assert.match(hero, /eyebrow: 'The AI co-founder for small business owners'/);
		assert.match(hero, /headline: 'You shouldn\\'t have to be everything on top of the real job\.'/);
		assert.match(hero, /headlineLine2: ''/);
		assert.match(hero, /headlineHighlight: ''/);
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

	it('HeroSection is one sentence and secondary CTA is #pricing', () => {
		const hero = read('app/business/sections/HeroSection.tsx');
		assert.match(hero, /headlineLine2 \?/);
		assert.match(hero, /href="#pricing"/);
		assert.doesNotMatch(hero, /getElementById\('preview-magnet'\)/);
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
		assert.match(firstScreen, /Market Pro is the AI co-founder/);
		assert.match(firstScreen, /Professional is \$25 if you want the research/);
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
		assert.match(src, /Market Pro is \$75 a month: the month of content plus the work/);
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
		assert.match(first, /Not a hiring platform/);
		assert.doesNotMatch(first, /bank-plan|SBA or the lease|se arma la cabeza/i);
		assert.match(src, /https:\/\/www\.moilapp\.com\/ai-info/);
		assert.match(src, /https:\/\/www\.moilapp\.com\/business/);
		assert.match(src, /https:\/\/www\.moilapp\.com\/es\/business/);
	});
});

describe('scope', () => {
	it('magnet files are not in the diff', () => {
		const names = gitDiff('--name-only')
			.split('\n')
			.map((n) => n.trim())
			.filter(Boolean);
		const magnet = names.filter((n) => /magnet|PreviewMagnet/i.test(n));
		assert.deepEqual(magnet, [], `magnet files in the diff: ${magnet.join(', ')}`);
	});
});
