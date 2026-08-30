#!/usr/bin/env node
'use strict';

/**
 * Pricing and tier-boundary truth pins.
 *   node --test evals/pricingTruth.test.js
 *
 * WHY THIS FILE EXISTS. On 2026-08-30 an audit found three separate false
 * claims live on the marketing site, none of which could break a build:
 *
 *   1. Market Pro annual read **$700** here while moil-codestagingbackend's
 *      planConfig.js said 720 AND the employer app's constants/plans.js said
 *      720 — so the only wrong copy of the number was the one a buyer reads
 *      immediately before Stripe charges them 720.
 *   2. Twelve copies of one sentence sold Professional as the tier you buy
 *      when you do NOT want the month. That stopped being true when the tier
 *      boundary moved from the FEATURE to the DENSITIES (Business-plan-
 *      Staging/utils/planLimits.js: 4 posts a week reviewed, vs 7 published
 *      automatically). Four of those copies are page descriptions and JSON-LD
 *      — i.e. the strings an answer engine repeats back as fact.
 *   3. "A post every day, on every network" — planLimits does grant Market Pro
 *      all four networks, and only Meta publishes today. LinkedIn OAuth is
 *      blocked on app config and TikTok is unbuilt.
 *
 * THE ASSERTIONS ARE ARITHMETIC AND PARITY, NOT PROSE. Pinning the literal
 * sentences would mean every improvement to the copy reads as a regression,
 * and copy that cannot be improved is copy that stops being maintained. What
 * is pinned instead is what a marketer cannot get right by eye: that the three
 * numbers in a price ladder agree with each other and with the discount we
 * advertise, that both languages describe the same product, and that no live
 * source re-introduces a specific claim we know the app cannot honour.
 *
 * This CANNOT reach across repos — the landing page has no access to
 * planConfig.js. The cross-repo half is pinned on the other side, by
 * moil-codestagingbackend/tests/unit/plans/planTierBoundary.test.js, which
 * asserts the $720 that this file's ladder has to agree with.
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

const LANGS = ['en', 'es'];
const TIERS = ['professional', 'marketPro'];

/**
 * Slice one object literal out of a translations file, bounded by the NEXT
 * sibling key at the same indent rather than by a fixed window — a window
 * bleeds into the following tier and reads ITS prices as this one's, which is
 * exactly how a two-tier ladder passes a check it should fail.
 *
 * Two refusals, and both are the difference between a gate and decoration:
 * a key that is MISSING throws (a renamed block must fail loudly, never make
 * every assertion under it pass vacuously), and a key that appears TWICE in
 * the slice throws too. `pricing:` really does occur twice at four-space
 * indent in en.ts — once under `business`, once under another section — so
 * taking the first match happened to be right and was right by luck. Luck is
 * not a property a gate can keep.
 */
function blockOf(src, key, indent = '      ') {
	const open = `\n${indent}${key}: {\n`;
	const hits = src.split(open).length - 1;
	assert.notEqual(hits, 0, `block ${key} not found at indent ${indent.length} — did the key get renamed?`);
	assert.equal(hits, 1, `block ${key} appears ${hits} times at indent ${indent.length}; the slice is ambiguous`);
	const start = src.indexOf(open);
	const end = src.indexOf(`\n${indent}},`, start + open.length);
	assert.notEqual(end, -1, `block ${key} is not closed at indent ${indent.length}`);
	return src.slice(start, end);
}

/**
 * The business subtree. Scoping to it is what makes the uniqueness rule above
 * satisfiable — and it is also correct on its own terms: /marketing and
 * /candidate have their own `pricing` blocks and are not what this file is
 * about.
 */
const businessOf = (lang) => {
	const src = read(`src/common/translations/${lang}.ts`);
	const at = src.indexOf('\n  business: {');
	assert.notEqual(at, -1, `${lang}: business subtree not found`);
	// END IT AT THE NEXT TOP-LEVEL KEY, not at end-of-file. `marketing` has a
	// `pricing` block of its own, so an unbounded slice is two pricing blocks
	// wearing one name — which is precisely the ambiguity blockOf refuses, and
	// which the first cut of this helper walked straight into.
	const end = src.indexOf('\n  },\n', at);
	assert.notEqual(end, -1, `${lang}: business subtree is not closed`);
	return src.slice(at, end);
};

const dollars = (block, key) => {
	const m = block.match(new RegExp(`${key}: '\\$([\\d,]+)'`));
	assert.ok(m, `${key} missing or not a $-prefixed number`);
	return Number(m[1].replace(/,/g, ''));
};

describe('the price ladder is arithmetic, not three numbers typed by hand', () => {
	for (const lang of LANGS) {
		const pricing = blockOf(businessOf(lang), 'pricing', '    ');

		// The advertised discount is a promise about the two numbers beside it.
		// "Save up to 25%" was a hedge AND wrong (the real figure is exactly
		// 20% on both tiers); a definite number is both true and stronger, and
		// only a definite number can be checked.
		const saving = pricing.match(/annualSaving: '[^']*?(\d+)%/);
		it(`${lang}: the saving is stated as a definite percentage`, () => {
			assert.ok(saving, 'annualSaving names no percentage — a hedge cannot be verified');
		});
		const pct = saving ? Number(saving[1]) : null;

		for (const tier of TIERS) {
			const block = blockOf(pricing, tier);

			it(`${lang}/${tier}: the struck-through annual is twelve months`, () => {
				assert.equal(
					dollars(block, 'annualOriginalPrice'),
					dollars(block, 'monthlyPrice') * 12,
					'annualOriginalPrice is the price we claim the buyer would otherwise pay',
				);
			});

			it(`${lang}/${tier}: the annual price is the advertised discount off it`, () => {
				const original = dollars(block, 'annualOriginalPrice');
				const annual = dollars(block, 'annualPrice');
				assert.equal(
					annual,
					Math.round(original * (1 - pct / 100)),
					`${annual} is not ${pct}% off ${original} — this is the check the $700 typo walked past`,
				);
			});
		}
	}

	it('both languages sell the same numbers', () => {
		// A price corrected in one language and not the other is the same
		// defect the $700 was, restricted to half the audience.
		const en = blockOf(businessOf('en'), 'pricing', '    ');
		const es = blockOf(businessOf('es'), 'pricing', '    ');
		for (const tier of TIERS) {
			const a = blockOf(en, tier);
			const b = blockOf(es, tier);
			for (const key of ['monthlyPrice', 'annualPrice', 'annualOriginalPrice']) {
				assert.equal(dollars(a, key), dollars(b, key), `${tier}.${key} differs by language`);
			}
		}
	});

	it('the JSON-LD offers charge what the pricing page shows', () => {
		// offers.ts is the machine-readable copy of the same price, on ~65
		// pages. It is the fourth place the number lived before it was
		// centralised, and it is the one nobody looks at.
		const offers = read('src/common/seo/offers.ts');
		const pricing = blockOf(businessOf('en'), 'pricing', '    ');
		for (const [tier, key] of [['professional', 'professional'], ['marketPro', 'marketPro']]) {
			const monthly = dollars(blockOf(pricing, tier), 'monthlyPrice');
			const offerBlock = blockOf(offers, key, '  ');
			assert.match(
				offerBlock,
				new RegExp(`price: '${monthly}'`),
				`offers.ts ${key} price disagrees with the pricing page`,
			);
		}
	});
});

describe('the comparison table describes one product', () => {
	const rowsOf = (lang) => {
		const src = businessOf(lang);
		const start = src.indexOf('      rows: [');
		assert.notEqual(start, -1, `${lang}: tiers.rows not found`);
		const end = src.indexOf('\n      ],', start);
		assert.notEqual(end, -1, `${lang}: tiers.rows is not closed`);
		return src
			.slice(start, end)
			.split('\n')
			.filter((l) => /^\s*\[/.test(l));
	};

	it('both languages have the same number of rows', () => {
		// The table renders one cell per column per row. A row added to one
		// language only does not throw — it renders a shorter table to half
		// the audience, silently.
		assert.equal(rowsOf('en').length, rowsOf('es').length);
		assert.ok(rowsOf('en').length > 0, 'the scan found no rows — did the shape change?');
	});

	it('every row has exactly three cells', () => {
		for (const lang of LANGS) {
			for (const row of rowsOf(lang)) {
				const cells = row.match(/'(?:[^'\\]|\\.)*'/g) || [];
				assert.equal(cells.length, 3, `${lang}: wrong cell count in ${row.trim()}`);
			}
		}
	});

	it('no row still sells Professional as lacking Moil360', () => {
		// The boundary is a set of DENSITIES now. A "Not included" cell against
		// the Moil360 row is the exact stale claim this file exists to catch,
		// and it undersells the tier rather than overselling it — which is why
		// nobody would report it.
		for (const lang of LANGS) {
			const offenders = rowsOf(lang).filter(
				(r) => /Moil360/.test(r) && /'(Not included|No incluido)'/.test(r),
			);
			assert.deepEqual(offenders, [], `${lang}: ${offenders.join(' ')}`);
		}
	});
});

describe('no live source re-introduces a claim the app cannot honour', () => {
	it('Professional is never sold as the tier without the month', () => {
		const offenders = LIVE_SOURCES.filter((p) =>
			/(documents without the month|si no quieres el mes|without the month\.)/i.test(read(p)),
		);
		assert.deepEqual(offenders, [], `stale "no month" positioning came back in: ${offenders.join(', ')}`);
	});

	it('nothing promises publishing to every network', () => {
		// planLimits grants Market Pro all four networks; only Meta publishes.
		// Promising LinkedIn or TikTok is a claim the product fails AFTER the
		// card is charged, which is the worst moment to discover it.
		const offenders = LIVE_SOURCES.filter((p) => {
			// The notes recording this fix quote the phrase; a comment must not
			// be able to satisfy — or trip — a scan about shipped copy.
			const src = read(p)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/^\s*\/\/.*$/gm, '');
			return /(on every network|en cada red|todas las redes|en todas las plataformas)/i.test(src);
		});
		assert.deepEqual(offenders, [], `unpublishable network claim in: ${offenders.join(', ')}`);
	});

	it('$700 does not come back', () => {
		const offenders = LIVE_SOURCES.filter((p) => {
			const src = read(p)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/^\s*\/\/.*$/gm, '');
			return /\$700\b/.test(src);
		});
		assert.deepEqual(offenders, [], `the stale annual price came back in: ${offenders.join(', ')}`);
	});
});

// ── THE INTAKE IS FOUR DOORS, NOT TWENTY-ONE QUESTIONS ─────────────────────
//
// The product's onboarding is a website URL, a PDF, typed text, or spoken
// answers — `runIntake` in Business-plan-Staging, whose CLAUDE.md calls them
// "the four intake doors" throughout. Nothing anywhere defines a 21-question
// flow, so every sentence promising one described a product we do not ship.
//
// It was in NINE places per language, including the JSON-LD FAQ answers in
// `app/marketing/layout.tsx` — structured data, which is what an answer
// engine quotes VERBATIM. That is the most expensive place on this site for a
// false sentence, and it is the same class this file already guards for
// price: a claim nobody can source.
//
// A SCAN, not a corpus check. A hand-written corpus cannot tell you whether
// it covers the strings actually shipped.
describe('the intake we describe is the intake we have', () => {
	// The bare number is far too common (years, sizes, ids), so the pattern
	// binds it to a question word, in either language.
	const CLAIM = /\b21\s+(strategic\s+)?(questions?|preguntas?)/i;
	const SKIP_DIRS = new Set([
		'node_modules', '.git', '.next', 'out', 'build', 'coverage',
	]);
	const EXTS = new Set([
		'.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.txt', '.json',
	]);

	const scanAll = (dir, out = []) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (SKIP_DIRS.has(entry.name)) continue;
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				scanAll(full, out);
			} else if (EXTS.has(path.extname(entry.name))) {
				out.push(full);
			}
		}
		return out;
	};

	it('no surface claims a 21-question intake', () => {
		const hits = [];
		for (const full of scanAll(root)) {
			// This file names the claim in order to forbid it.
			if (full === __filename) continue;
			let src;
			try {
				src = fs.readFileSync(full, 'utf8');
			} catch (_e) {
				continue;
			}
			if (CLAIM.test(src)) hits.push(path.relative(root, full));
		}
		assert.deepEqual(
			hits,
			[],
			'these files claim an intake the product does not have: ' +
				hits.join(', '),
		);
	});

	it('the scan can actually see a violation', () => {
		// Without this the check above passes for a repo it never read — the
		// pattern could be wrong, the walker could be returning nothing, and
		// a clean result would look identical either way.
		assert.ok(CLAIM.test('Answer 21 strategic questions by voice'));
		assert.ok(CLAIM.test('Responde 21 preguntas estratégicas'));
		assert.ok(CLAIM.test('21 questions'));
		// And it must not fire on an ordinary number.
		assert.ok(!CLAIM.test('21 templates'));
		assert.ok(!CLAIM.test('shipped in 2021'));
		assert.ok(scanAll(root).length > 50, 'the walker found almost nothing');
	});
});

