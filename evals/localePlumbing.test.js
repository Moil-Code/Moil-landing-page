#!/usr/bin/env node
'use strict';

/**
 * S0 locale plumbing — `/es` is a Spanish document.
 *   node --test evals/localePlumbing.test.js
 *
 * Live /es/business shipped `<html lang="en">` and `Set-Cookie: lang=en`
 * because the root layout hardcoded English and middleware inferred the
 * cookie from Accept-Language. Google treated the Spanish door as English.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function normalizePathname(pathname) {
	const raw = String(pathname || '/').split('?')[0];
	if (raw.length > 1 && raw.endsWith('/')) return raw.slice(0, -1);
	return raw || '/';
}

function isSpanishPath(pathname) {
	const p = normalizePathname(pathname);
	return p === '/es' || p.startsWith('/es/');
}

function documentLocaleFromPathname(pathname) {
	return isSpanishPath(pathname) ? 'es' : 'en';
}

function langCookieValue(pathname, lgParam) {
	if (isSpanishPath(pathname)) return 'es';
	if (lgParam === 'en' || lgParam === 'es') return lgParam;
	return 'en';
}

describe('path locale contract', () => {
	it('Spanish paths are es, English paths are en', () => {
		for (const p of ['/es', '/es/', '/es/business', '/es/business/', '/es/business?lg=en']) {
			assert.equal(documentLocaleFromPathname(p), 'es', p);
			assert.equal(langCookieValue(p, 'en'), 'es', `${p} path must beat ?lg=en`);
			assert.equal(langCookieValue(p, null), 'es', p);
		}
		for (const p of ['/', '/business', '/business/', '/business/pricing', '/candidate', '/reviews']) {
			assert.equal(documentLocaleFromPathname(p), 'en', p);
			assert.equal(langCookieValue(p, null), 'en', p);
			assert.equal(langCookieValue(p, 'es'), 'es', `${p} honors explicit ?lg=es`);
		}
	});

	it('never infers Spanish for /business from a missing cookie', () => {
		assert.equal(langCookieValue('/business', null), 'en');
		assert.equal(langCookieValue('/business', ''), 'en');
		assert.equal(documentLocaleFromPathname('/business'), 'en');
	});

	it('the shared helper in source matches this contract', () => {
		const src = read('src/common/i18n/pathLocale.ts');
		const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		assert.match(src, /path === '\/es' \|\| path\.startsWith\('\/es\/'\)/);
		assert.match(src, /function documentLocaleFromPathname/);
		assert.match(src, /function langCookieValue/);
		assert.match(src, /HTML_LANG_HEADER = 'x-html-lang'/);
		assert.doesNotMatch(code, /accept-language|acceptLang/i);
	});
});

describe('first-paint document language', () => {
	it('root html lang is not hardcoded en', () => {
		const src = read('app/layout.tsx');
		assert.doesNotMatch(src, /<html lang="en"/);
		assert.match(src, /<html lang=\{lang\}/);
		assert.match(src, /headers\(\)/);
		assert.match(src, /HTML_LANG_HEADER/);
		assert.match(src, /=== 'es' \? 'es' : 'en'/);
	});

	it('middleware sets html-lang, Content-Language, and cookie from the path', () => {
		const src = read('middleware.ts');
		assert.match(src, /from '\.\/src\/common\/i18n\/pathLocale'/);
		assert.match(src, /documentLocaleFromPathname/);
		assert.match(src, /langCookieValue/);
		assert.match(src, /Content-Language/);
		assert.match(src, /cookies\.set\('lang', cookieLang/);
		assert.match(src, /HTML_LANG_HEADER/);
		const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		assert.doesNotMatch(code, /accept-language|acceptLang/i);
	});

	it('next.config also sends Content-Language: es on /es and /es/*', () => {
		const src = read('next.config.js');
		assert.match(src, /source: '\/es'/);
		assert.match(src, /source: '\/es\/:path\*'/);
		assert.match(src, /Content-Language/);
		assert.match(src, /value: 'es'/);
	});

	it('I18nProvider reads /es before localStorage and does not flip /business', () => {
		const src = read('src/common/components/I18nProvider.tsx');
		assert.match(src, /isSpanishPath/);
		assert.match(src, /isEnglishBusinessPath/);
		const detect = src.slice(src.indexOf('function detectInitialLang'), src.indexOf('export function I18nProvider'));
		assert.ok(detect.indexOf('isSpanishPath') < detect.indexOf('localStorage'), 'path must beat localStorage');
		assert.match(src, /isEnglishBusinessPath\(pathname\)\) return 'en'/);
		assert.match(src, /searchParams\.delete\('lg'\)/);
	});
});

describe('English quotes stay English and are labelled on ES', () => {
	const VERBATIM = [
		'Been using it for about 3 months with my landscaping crew',
		'I’m not super techy so I was skeptical',
		'Honestly didn’t expect much when I signed up',
		'The MoilApp is an amazing tool for entrepreneurs',
		'I just finished a 8-week coaching program with Moil',
	];

	it('does not rewrite Luis, Liliana, Miguel, Dennys, or Luxxe', () => {
		const reviews = read('src/common/data/reviews.ts');
		for (const phrase of VERBATIM) {
			assert.ok(reviews.includes(phrase), `missing verbatim quote: ${phrase}`);
		}
		assert.doesNotMatch(reviews, /He estado usándolo|No soy muy tecnológica|Sinceramente no esperaba/);
	});

	it('ES review cards render the escrito en inglés label', () => {
		const page = read('app/business/BusinessPageContent.tsx');
		assert.match(page, /writtenInEnglishLabel/);
		assert.match(page, /t\.business\.testimonials\.writtenInEnglish/);
		assert.match(page, /currentLang === 'es'/);
		assert.match(page, /className="t-lang"/);
		assert.match(page, /lang: 'en'/);
		assert.match(read('src/common/translations/es.ts'), /writtenInEnglish: 'escrito en inglés'/);
		assert.match(read('src/common/translations/en.ts'), /writtenInEnglish: 'in English'/);
	});
});

describe('this PR does not rewrite the English door', () => {
	const EN_DOOR_FILES = [
		'src/common/translations/en.ts',
		'app/business/layout.tsx',
	];

	it('EN H1, eyebrow, pricing title, and metadata keys stay on the live hats copy', () => {
		let diff = '';
		try {
			diff = execSync(`git diff origin/main -- ${EN_DOOR_FILES.join(' ')}`, {
				cwd: root,
				encoding: 'utf8',
			});
		} catch {
			diff = execSync(`git diff main -- ${EN_DOOR_FILES.join(' ')}`, {
				cwd: root,
				encoding: 'utf8',
			});
		}

		assert.doesNotMatch(diff, /^diff --git .*app\/business\/layout\.tsx/m, 'EN business layout must not change');

		const touchedCopy = diff
			.split('\n')
			.filter((line) => (line.startsWith('+') || line.startsWith('-')) && !line.startsWith('+++') && !line.startsWith('---'))
			.filter((line) => /eyebrow:|headline:|headlineLine2:|headlineHighlight:|heroHeadline:|heroHighlight1:|\btitle:/.test(line));
		assert.deepEqual(touchedCopy, [], `EN door copy drifted:\n${touchedCopy.join('\n')}`);
	});

	it('pins the live EN H1 and title strings so a quiet rewrite fails', () => {
		const en = read('src/common/translations/en.ts');
		const enHero = en.slice(en.indexOf('    hero: {'), en.indexOf('    aeoAnswer: {'));
		assert.match(enHero, /headline: 'You\\u2019re the marketing team\.'/);
		assert.match(enHero, /headlineLine2: 'And the finance team\.'/);
		assert.match(enHero, /headlineHighlight: 'And the one who answers the phone\.'/);
		assert.match(enHero, /eyebrow: 'The co-founder who handles what you never get to'/);
		assert.match(en, /heroHeadline: 'Stop Wearing'/);
		assert.match(en, /heroHighlight1: 'Every Hat\.'/);
		assert.match(
			read('app/business/layout.tsx'),
			/title: 'AI Marketing for Small Business — Content Calendar in English \& Spanish'/,
		);
	});
});

const origin = process.env.LOCALE_TEST_ORIGIN;

describe('HTTP responses (optional, set LOCALE_TEST_ORIGIN)', { skip: !origin }, () => {
	async function get(pathname) {
		const res = await fetch(`${origin}${pathname}`, { redirect: 'manual' });
		const html = await res.text();
		return { res, html };
	}

	function cookieLang(res) {
		const raw = res.headers.getSetCookie?.() || [];
		const list = raw.length ? raw : [res.headers.get('set-cookie') || ''];
		const match = list.join('\n').match(/(?:^|,\s*)lang=([^;]+)/);
		return match ? match[1] : '';
	}

	it('/es/business is a Spanish document', async () => {
		const { res, html } = await get('/es/business');
		assert.ok(res.ok, `status ${res.status}`);
		assert.match(html, /<html[^>]*\slang="es"/i);
		assert.doesNotMatch(html, /<html[^>]*\slang="en"/i);
		assert.equal(res.headers.get('content-language'), 'es');
		assert.equal(cookieLang(res), 'es');
		assert.match(html, /escrito en inglés/);
	});

	it('/business stays an English document', async () => {
		const { res, html } = await get('/business');
		assert.ok(res.ok, `status ${res.status}`);
		assert.match(html, /<html[^>]*\slang="en"/i);
		assert.doesNotMatch(html, /<html[^>]*\slang="es"/i);
		assert.equal(res.headers.get('content-language'), 'en');
		assert.equal(cookieLang(res), 'en');
		assert.doesNotMatch(html, /escrito en inglés/);
	});
});
