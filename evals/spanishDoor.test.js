#!/usr/bin/env node
'use strict';

/**
 * S1 Spanish door — /es, /es/business, /es/business/pricing.
 *   node --test evals/spanishDoor.test.js
 *
 * Pins the shop + month-of-posts door on ES only. The English hats door,
 * EN pricing title/meta, and magnet files must stay out of this diff.
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

describe('ES door copy', () => {
	const es = read('src/common/translations/es.ts');
	const esLayout = read('app/es/business/layout.tsx');
	const esHero = namedBlock(es.slice(es.indexOf('\n  business: {')), 'hero');

	it('es.ts and the ES layout carry the shop + posts H1 and title', () => {
		assert.match(esHero, /eyebrow: 'Aprende tu negocio\. Luego escribe el mes\.'/);
		assert.match(esHero, /headline: 'Moil aprende tu negocio desde el primer d\\u00eda\.'/);
		assert.match(esHero, /headlineLine2: 'Luego escribe el trabajo que nunca te da tiempo\.'/);
		assert.match(esHero, /headlineHighlight: 'Un mes de posts para que la p\\u00e1gina no se vea muerta\.'/);
		assert.match(esHero, /Contestas una vez\. Eso no es un PDF para el banco/);
		assert.match(esHero, /cta: 'Empieza gratis \\u2014 sin tarjeta'/);
		assert.match(esHero, /ctaSecondary: 'Ver los dos planes'/);
		assert.doesNotMatch(esHero, /El banco quiere un plan/);
		assert.doesNotMatch(esHero, /El co-fundador que se encarga/);
		assert.match(
			esLayout,
			/Moil aprende tu negocio\. Un mes de posts que se publica\. \| Moil/,
		);
		assert.match(esLayout, /Moil aprende tu negocio\. Luego escribe el trabajo/);
		assert.doesNotMatch(esLayout, /Plan para el banco, un mes de posts/);
	});

	it('first-scroll job cards are the three specified jobs, not a bank-lead dump', () => {
		const made = namedBlock(es.slice(es.indexOf('\n  business: {')), 'made');
		const items = [...made.matchAll(/^        '([^']+)'/gm)].map((m) => m[1]);
		assert.equal(items.length, 3);
		assert.match(items[0], /^Desde el primer d\\u00eda se arma la cabeza de tu negocio\./);
		assert.doesNotMatch(items[0], /^Un plan que el banco/);
		assert.match(items[0], /banco, el SBA o el lease/);
		assert.match(items[1], /^Un mes de posts para que la p\\u00e1gina no se vea muerta\./);
		assert.match(items[2], /^\$25 \/ \$75 en vez de \$500 a una agencia\./);
		assert.match(made, /Canva \+ ChatGPT a ojo/);
	});
});

describe('EN door stays the live hats page', () => {
	const en = read('src/common/translations/en.ts');
	const enHero = namedBlock(en.slice(en.indexOf('\n  business: {')), 'hero');

	it('keeps the live EN H1, hats pricing title, and AI Marketing title', () => {
		assert.match(enHero, /headline: 'You\\u2019re the marketing team\.'/);
		assert.match(enHero, /headlineLine2: 'And the finance team\.'/);
		assert.match(enHero, /headlineHighlight: 'And the one who answers the phone\.'/);
		assert.match(en, /heroHeadline: 'Stop Wearing'/);
		assert.match(en, /heroHighlight1: 'Every Hat\.'/);
		assert.match(
			read('app/business/layout.tsx'),
			/title: 'AI Marketing for Small Business — Content Calendar in English \& Spanish'/,
		);
		assert.match(read('app/page.tsx'), /Stop Wearing Every Hat/);
	});

	it('does not rewrite EN door \/ H1 \/ pricing \/ title \/ meta in this diff', () => {
		const diff = gitDiff('src/common/translations/en.ts app/business/layout.tsx app/business/pricing/layout.tsx');
		assert.equal(diff.trim(), '', `EN door files changed:\n${diff}`);
	});
});

describe('ES pricing first screen', () => {
	it('no longer leads with job postings, Recruiter & Coach, or SOC 2', () => {
		const es = read('src/common/translations/es.ts');
		const business = es.slice(es.indexOf('\n  business: {'));
		const pricing = namedBlock(business, 'pricing');
		const pricingPage = namedBlock(business, 'pricingPage');
		const firstScreen = pricing + '\n' + pricingPage + '\n' + read('app/es/business/pricing/layout.tsx');

		assert.match(pricing, /headline: '\$25 para que aprenda el negocio\.'/);
		assert.match(pricingPage, /heroHeadline: '\$25 para que aprenda el negocio\.'/);
		assert.match(pricingPage, /que se publica/);
		assert.match(firstScreen, /as\\u00ed se arma la cabeza|as[ií] se arma la cabeza/);
		assert.match(firstScreen, /Professional \$25: investigaci/);
		assert.match(firstScreen, /Market Pro \$75: el mes de posts/);
		assert.doesNotMatch(firstScreen, /\$25 para el plan\./);

		assert.doesNotMatch(firstScreen, /10 publicaciones de empleo/);
		assert.doesNotMatch(firstScreen, /Publicaciones de empleo ilimitadas/);
		assert.doesNotMatch(firstScreen, /Reclutador y Coach/);
		assert.doesNotMatch(firstScreen, /Recruiter & Coach/);
		assert.doesNotMatch(firstScreen, /SOC 2/);
		assert.doesNotMatch(firstScreen, /revoluci[oó]n/i);
		assert.doesNotMatch(firstScreen, /3,000|4\.8|95%|500\+/);
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

	it('magnet files are not in the diff', () => {
		const names = gitDiff('--name-only')
			.split('\n')
			.map((n) => n.trim())
			.filter(Boolean);
		const magnet = names.filter((n) => /magnet|PreviewMagnet/i.test(n));
		assert.deepEqual(magnet, [], `magnet files in the diff: ${magnet.join(', ')}`);
	});

	it('does not add S2 routes or point at employer-beta', () => {
		const names = gitDiff('--name-only')
			.split('\n')
			.map((n) => n.trim())
			.filter(Boolean);
		assert.ok(!names.some((n) => n.startsWith('app/es/compare')), 'do not add /es/compare');
		assert.ok(!names.some((n) => n.startsWith('app/es/ai-info')), 'do not add /es/ai-info');
		assert.ok(!names.includes('public/llms.txt'), 'do not edit llms.txt');
		const sources = names.filter((n) => !n.startsWith('evals/'));
		for (const file of sources) {
			if (!fs.existsSync(path.join(root, file))) continue;
			assert.doesNotMatch(read(file), /employer-beta/, file);
		}
	});
});
