#!/usr/bin/env node
'use strict';

/**
 * S1 Spanish door — /es, /es/business, /es/business/pricing.
 *   node --test evals/spanishDoor.test.js
 *
 * Pins the ES first screen (title, eyebrow, H1, sub).
 * EN hats, bank-lead, the two void H1s, and "se arma la cabeza" must not come back.
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
	return m[1]
		.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
		.replace(/\\'/g, "'");
}

// The H1 ships as three keys (headline + headlineHighlight + headlineLine2) so
// the hero can colour one word. The LOCK is the sentence they compose — what a
// crawler and the accessibility tree read off the <h1> — not how it is split.
// Join on the single space the JSX emits between the three spans, and decode
// the \uXXXX escapes so the lock below is written as a reader sees it.
function composedH1(hero) {
	return ['headline', 'headlineHighlight', 'headlineLine2']
		.map((key) => quoted(hero, key))
		.filter(Boolean)
		.join(' ');
}

const EN_H1 = "You shouldn't have to be everything on top of the real job.";
const ES_H1 = 'No deberías tener que encargarte de todo, además de hacer el trabajo que realmente importa.';

describe('ES door copy', () => {
	const es = read('src/common/translations/es.ts');
	const esLayout = read('app/es/business/layout.tsx');
	const esHero = namedBlock(es.slice(es.indexOf('\n  business: {')), 'hero');

	it('pins the ES first screen: title, eyebrow, H1, sub', () => {
		assert.match(esLayout, /El socio que trabaja el negocio contigo \| Moil/);
		assert.match(esHero, /eyebrow: 'El socio de los dueños de negocio'/);
		assert.equal(composedH1(esHero), ES_H1);
		assert.match(esHero, /Moil aprende el negocio una vez y no empieza de cero/);
	});

	it('fails if the two void H1s or se-arma-la-cabeza return', () => {
		const firstScreen = esHero + '\n' + esLayout;
		assert.doesNotMatch(firstScreen, /se arma la cabeza/);
		assert.doesNotMatch(firstScreen, /Sacar el negocio ya es el trabajo/);
		assert.doesNotMatch(firstScreen, /No te toca serlo todo/);
		assert.doesNotMatch(firstScreen, /No te toca serlo todo adem\\u00e1s de atender el negocio/);
		assert.doesNotMatch(firstScreen, /No deberías tener que serlo todo además del trabajo de verdad/);
		assert.doesNotMatch(firstScreen, /El banco quiere un plan/);
		assert.doesNotMatch(firstScreen, /Marketing con IA/);
		assert.doesNotMatch(firstScreen, /Eres el equipo de marketing/);
		assert.doesNotMatch(firstScreen, /You shouldn\\'t have to be everything on top of the real job/);
		assert.doesNotMatch(esLayout, /\bpyme\b/i);
		assert.doesNotMatch(esHero, /Desde \$25/);
		const esProblem = namedBlock(es.slice(es.indexOf('\n  business: {')), 'problem');
		assert.doesNotMatch(esProblem, /Moil cuesta \$25/);
		assert.doesNotMatch(esProblem, /Qué te da \$25 al mes/);
		assert.match(esProblem, /Market Pro es \$75/);
		assert.match(esProblem, /moilPrice: '\$75'/);
	});
});

describe('ES pricing first screen', () => {
	it('leads with Market Pro and the locked fence, not job postings', () => {
		const es = read('src/common/translations/es.ts');
		const business = es.slice(es.indexOf('\n  business: {'));
		const pricing = namedBlock(business, 'pricing');
		const pricingPage = namedBlock(business, 'pricingPage');
		const firstScreen = pricing + '\n' + pricingPage + '\n' + read('app/es/business/pricing/layout.tsx');

		assert.match(pricing, /headline: 'Treinta d\\u00edas de contenido con tu marca\. Investigaci\\u00f3n, planes, documentos\.'/);
		assert.match(pricingPage, /heroHeadline: 'Treinta d\\u00edas de contenido con tu marca\. Investigaci\\u00f3n, planes, documentos\.'/);
		assert.match(firstScreen, /Treinta d[ií]as de contenido con tu marca \| Moil/);
		assert.match(read('src/common/seo/pricingCopy.ts'), /heroSub: `Market Pro es el socio/);
		// Routed through the one price-copy source (2026-09-05); pin the reference
		// and the source's Spanish sentences.
		assert.match(firstScreen, /pricingCopy\.es\.marketProTagline/);
		assert.match(firstScreen, /pricingCopy\.es\.professionalTagline/);
		const copy = read('src/common/seo/pricingCopy.ts');
		assert.match(copy, /marketProTagline: `Market Pro \$\{mp\}: el mes completo escrito para ti/);
		assert.match(copy, /professionalTagline: `Professional \$\{pro\}: la investigaci/);
		assert.doesNotMatch(firstScreen, /10 publicaciones de empleo/);
		assert.doesNotMatch(firstScreen, /Reclutador y Coach/);
		assert.doesNotMatch(firstScreen, /SOC 2/);
		assert.doesNotMatch(firstScreen, /se arma la cabeza/);
		assert.doesNotMatch(firstScreen, /Desde \$25/);
	});
});

describe('this PR stays inside S1', () => {
	it('pricing page files only default-export a page', () => {
		for (const file of ['app/business/pricing/page.tsx', 'app/es/business/pricing/page.tsx']) {
			const src = read(file);
			assert.match(src, /export default function/, file);
			assert.doesNotMatch(src, /^export function /m, `${file} must not export extra components`);
		}
		assert.ok(
			fs.existsSync(path.join(root, 'app/business/pricing/BusinessPricingPageContent.tsx')),
			'pricing content must live outside the page file',
		);
	});

	it('magnet stays website-only', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /doorBtn\('handle'/);
		assert.doesNotMatch(magnet, /doorBtn\('place'/);
		assert.doesNotMatch(magnet, /type="email"/);
	});

	it('does not add S2 routes; the door does not hardcode the twin host', () => {
		// This repo IS the staging landing. Stagebeta dest belongs in env /
		// deploy docs (tests.yml Build, DEPLOYMENT.md), not in the magnet.
		// Scan the door, not the git diff — a full-tree bring-up from
		// staging@0f7f5ae0 is supposed to touch magnet files.
		// /es/compare exists now (plan 3.5) behind the review gate in
		// src/common/es/esPages.ts — evals/spanishPages.test.js owns that rule.
		assert.equal(fs.existsSync(path.join(root, 'app/es/ai-info')), false, 'do not add /es/ai-info');
		const door = [
			'app/business/components/PreviewMagnet.tsx',
			'app/business/components/GettingToKnowYou.tsx',
			'app/business/sections/HeroSection.tsx',
			'app/business/preview/previewClient.js',
			'app/business/BusinessPageContent.tsx',
		];
		for (const file of door) {
			assert.doesNotMatch(read(file), /employer-beta/, file);
		}
	});
});
