#!/usr/bin/env node
'use strict';

/**
 * Plan 3.4 / 3.5 — the Spanish pages built for the Spanish query.
 *   node --test evals/spanishPages.test.js
 *
 * The plan's rule is "human-reviewed Spanish". Engineering builds the route,
 * the schema, the sitemap and the hreflang scaffold; the copy is a DRAFT until
 * a Spanish speaker flips `reviewed` in src/common/es/esPages.ts. This file
 * pins that ONE flag drives all three indexing surfaces at once — noindex,
 * sitemap membership, hreflang — because a draft that is in the sitemap but
 * noindexed, or hreflang'd from its English twin but absent from the sitemap,
 * is two authorities disagreeing about one document.
 *
 * It reads the registry through a tiny TS→JS shim rather than transcribing it:
 * a local copy of the page list is exactly the drift it exists to catch.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

// ---- registry, read from the real module (types stripped) -----------------
function loadEsPages() {
	const src = read('src/common/es/esPages.ts');
	const m = src.match(/export const ES_PAGES[^=]*=\s*(\[[\s\S]*?\]);/);
	assert.ok(m, 'ES_PAGES literal not found');
	// eslint-disable-next-line no-new-func
	return new Function(`return ${m[1]}`)();
}
const ES_PAGES = loadEsPages();

function pageFile(route) {
	// app/es/<slug>/page.tsx or app/es/(group)/<slug>/page.tsx
	const rel = route.replace(/^\//, '');
	const direct = `app/${rel}/page.tsx`;
	if (exists(direct)) return direct;
	const parts = rel.split('/');
	const parent = parts.slice(0, -1).join('/');
	const leaf = parts[parts.length - 1];
	for (const e of fs.readdirSync(path.join(root, 'app', parent), { withFileTypes: true })) {
		if (e.isDirectory() && /^\(.*\)$/.test(e.name)) {
			const grouped = `app/${parent}/${e.name}/${leaf}/page.tsx`;
			if (exists(grouped)) return grouped;
		}
	}
	assert.fail(`no page.tsx for ${route}`);
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// The ANSWER literal, with pricingCopy interpolations counted as their real
// text so the word budget measures what a reader sees.
function answerText(src) {
	const m = src.match(/const ANSWER =\s*([\s\S]*?);\n/);
	assert.ok(m, 'ANSWER not found');
	const pricing = read('src/common/seo/pricingCopy.ts').match(/entityPrice: `([^`]+)`/g) || [];
	const es = pricing[1] ? pricing[1].replace(/entityPrice: `|`/g, '') : '';
	return m[1]
		.replace(/pricingCopy\.es\.entityPrice/g, `'${es}'`)
		.replace(/'\s*\+\s*'/g, '')
		.replace(/^\s*'|'\s*$/g, '')
		.replace(/\\u2014/g, '—');
}

describe('registry', () => {
	it('lists five pages, every one with a page file, every twin pointing at a real English page', () => {
		assert.equal(ES_PAGES.length, 5);
		for (const p of ES_PAGES) {
			assert.match(p.path, /^\/es\//, p.path);
			pageFile(p.path);
			if (p.en) assert.ok(exists(`app${p.en}/page.tsx`), `${p.en} must exist for ${p.path}`);
			assert.equal(typeof p.reviewed, 'boolean', `${p.path}.reviewed`);
		}
	});

	it('every registered page names its own path and gates robots on it', () => {
		for (const p of ES_PAGES) {
			const src = stripComments(read(pageFile(p.path)));
			assert.ok(src.includes(`const PATH = '${p.path}'`), `${p.path} PATH literal`);
			assert.match(src, /robots: esRobots\(PATH\)/, `${p.path} robots must come from the registry`);
			assert.match(src, /canonical: `\$\{baseURL1\}\$\{PATH\}`/, `${p.path} canonical`);
		}
	});
});

describe('the page itself', () => {
	for (const p of ES_PAGES) {
		const file = pageFile(p.path);
		const src = stripComments(read(file));
		it(`${p.path}: answer-first, 40–120 words, at least four FAQs, FAQPage JSON-LD`, () => {
			const words = wordCount(answerText(src));
			assert.ok(words >= 40 && words <= 120, `${p.path} answer is ${words} words`);
			const faqs = (src.match(/question: '/g) || []).length;
			assert.ok(faqs >= 4, `${p.path} has ${faqs} FAQs`);
			assert.match(src, /faqPageJsonLd\(FAQS\)/, `${p.path} FAQPage schema`);
		});
		it(`${p.path}: Spanish chrome, Spanish CTA, Spanish entity line, real links into the Spanish blog`, () => {
			assert.match(src, /labels=\{ES_LABELS\}/);
			assert.match(src, /ctaHref=\{ES_CTA\}/);
			assert.match(src, /entityLine=\{ENTITY_LINE_ES\}/);
			assert.match(src, /href: BLOG_ES_HUB/, 'links to the Spanish blog hub');
			assert.doesNotMatch(src, /entityLine=\{ENTITY_LINE\}/, 'English entity line on a Spanish page');
			assert.doesNotMatch(src, /register\?lg=en/, 'English register CTA on a Spanish page');
		});
		it(`${p.path}: the price is never a literal`, () => {
			// A $ figure may only enter through pricingCopy / offers (PLANS). A
			// competitor's price is a fact about them and stays literal.
			const own = src.replace(/Buffer|ChatGPT|Plus|por canal|canal/g, '');
			for (const m of own.matchAll(/\$(25|75)\b/g)) {
				assert.fail(`${p.path} hardcodes ${m[0]} — read it from pricingCopy or PLANS`);
			}
			assert.match(src, /pricingCopy\.es\.entityPrice|PLANS\.(professional|marketPro)\.price/, `${p.path} quotes no Moil price at all`);
		});
		if (p.en) {
			it(`${p.path}: twin alternates come from the registry, on BOTH halves`, () => {
				assert.match(src, /twinAlternates\(baseURL1, EN_PATH\)/);
				assert.ok(src.includes(`const EN_PATH = '${p.en}'`));
				const en = stripComments(read(`app${p.en}/page.tsx`));
				assert.ok(en.includes(`twinAlternates(baseURL1, '${p.en}')`), `${p.en} must declare its Spanish twin through the registry`);
			});
		}
	}
});

describe('one flag, three surfaces', () => {
	// Port of the registry helpers, asserted against the source they come from.
	const esSrc = stripComments(read('src/common/es/esPages.ts'));
	it('esRobots: unreviewed → noindex,follow; reviewed → undefined', () => {
		assert.match(esSrc, /return esPage\(path\)\.reviewed \? undefined : \{ index: false, follow: true \}/);
	});
	it('twinAlternates: nothing until reviewed, x-default on the English half', () => {
		assert.match(esSrc, /if \(!es \|\| !es\.reviewed\) return undefined/);
		assert.match(esSrc, /'x-default': `\$\{baseUrl\}\$\{enPath\}`/);
	});
	it('sitemap: Spanish pages enter only when reviewed, with alternates on both halves', () => {
		const sm = stripComments(read('app/sitemap.ts'));
		assert.match(sm, /import \{ ES_PAGES \} from '\.\.\/src\/common\/es\/esPages'/);
		assert.match(sm, /ES_PAGES\.filter\(\(p\) => p\.reviewed\)/, 'sitemap must filter on reviewed');
		assert.match(sm, /\.\.\.esEntries,/, 'reviewed pages are spread into the sitemap');
		for (const p of ES_PAGES) {
			assert.doesNotMatch(sm, new RegExp(`url: \`\\$\\{baseUrl\\}${p.path.replace(/[/]/g, '\\/')}\``), `${p.path} must not be hand-listed in the sitemap`);
			if (p.en) assert.ok(sm.includes(`...esAlternatesFor('${p.en}'),`), `${p.en} sitemap entry must carry the Spanish alternate once reviewed`);
		}
	});
	it('the toggle reaches the twins whether or not they are reviewed', () => {
		const twins = read('src/common/i18n/localeRoutes.ts');
		for (const p of ES_PAGES) {
			if (!p.en) continue;
			assert.ok(twins.includes(`{ en: '${p.en}', es: '${p.path}' }`), `${p.path} missing from LOCALE_TWINS`);
		}
	});
	it('the Spanish layouts force the document language', () => {
		for (const layout of ['app/es/(guias)/layout.tsx', 'app/es/compare/layout.tsx']) {
			const src = read(layout);
			assert.match(src, /<I18nProvider initialLang="es">/, layout);
			assert.match(src, /<CompareShell>/, layout);
		}
		assert.match(read('app/compare/layout.tsx'), /CompareShell/, 'English compare layout shares the shell');
	});
	it('page-dates keys a route-group page on its URL, so a reviewed page can be dated', () => {
		const dates = JSON.parse(read('src/common/seo/pageDates.json'));
		for (const p of ES_PAGES) assert.ok(dates[p.path], `${p.path} has no pageDates entry`);
		for (const k of Object.keys(dates)) assert.doesNotMatch(k, /\(/, `${k} leaks a route-group segment`);
	});
});

describe('reachability', () => {
	it('the eval saw real pages', () => {
		assert.ok(ES_PAGES.length >= 5);
		assert.ok(ES_PAGES.some((p) => p.en) && ES_PAGES.some((p) => !p.en), 'both twins and query-built originals');
	});
});
