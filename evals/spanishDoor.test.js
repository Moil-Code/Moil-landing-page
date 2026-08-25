#!/usr/bin/env node
'use strict';

/**
 * S1 Spanish door — /es, /es/business, /es/business/pricing.
 *   node --test evals/spanishDoor.test.js
 *
 * Pins the investor-derived Spanish door (socio + Market Pro).
 * EN hats, bank-lead, and "se arma la cabeza" must not come back.
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

	it('es.ts and the ES layout carry the socio + Market Pro door', () => {
		assert.match(esHero, /eyebrow: 'El socio de los dueños de negocio'/);
		assert.match(esHero, /headline: 'No te toca serlo todo adem\\u00e1s de atender el negocio\.'/);
		assert.match(esHero, /headlineLine2: ''/);
		assert.match(esHero, /headlineHighlight: ''/);
		assert.match(esHero, /Moil aprende el negocio una vez y no empieza de cero/);
		assert.match(esHero, /cta: 'Empieza gratis \\u2014 sin tarjeta'/);
		assert.match(esHero, /ctaSecondary: 'Ver Market Pro'/);
		assert.match(esLayout, /El socio que trabaja el negocio contigo \| Moil/);
		assert.match(esLayout, /Market Pro es \$75\. Professional es \$25 si no quieres el mes/);
	});

	it('fails if banned bank-lead, hats, or se-arma-la-cabeza copy returns', () => {
		const door = esHero + '\n' + esLayout + '\n' + namedBlock(es.slice(es.indexOf('\n  business: {')), 'aeoAnswer');
		assert.doesNotMatch(door, /se arma la cabeza/);
		assert.doesNotMatch(door, /No deberías tener que serlo todo además del trabajo de verdad/);
		assert.doesNotMatch(door, /El banco quiere un plan/);
		assert.doesNotMatch(door, /Marketing con IA/);
		assert.doesNotMatch(door, /Eres el equipo de marketing/);
		assert.doesNotMatch(door, /You shouldn\\'t have to be everything on top of the real job/);
		assert.doesNotMatch(esLayout, /\bpyme\b/i);
		assert.doesNotMatch(esHero, /Desde \$25/);
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
		assert.match(firstScreen, /Market Pro es el socio/);
		assert.match(firstScreen, /Market Pro \$75: el mes de contenido con tu marca/);
		assert.match(firstScreen, /Professional \$25: la investigaci/);
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
		const sources = names.filter((n) => !n.startsWith('evals/'));
		for (const file of sources) {
			if (!fs.existsSync(path.join(root, file))) continue;
			assert.doesNotMatch(read(file), /employer-beta/, file);
		}
	});
});
