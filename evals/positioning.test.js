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
		const offenders = LIVE_SOURCES.filter((p) => {
			// Magnet refuse copy ("Paste the shop homepage.") is honesty, not positioning.
			const src = read(p).replace(/socialLinkRefuse:\s*'[^']*'/g, '');
			return /(for (your|local) shops?|the shop\b|learns the shop|about your shop)/i.test(src);
		});
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
	const reviewsSrc = () => read('src/common/data/reviews.ts');

	it('keeps every published review in one place', () => {
		// Two lists is how the FAQ ended up publishing contradictory answers.
		const page = read('app/business/BusinessPageContent.tsx');
		assert.match(page, /businessReviews\(\)/);
		for (const file of ['src/common/translations/en.ts', 'src/common/translations/es.ts']) {
			const src = read(file);
			const business = src.slice(src.indexOf('\n  business: {'));
			const start = business.indexOf('    testimonials: {');
			const bl = business.slice(start, business.indexOf('\n    },', start));
			assert.doesNotMatch(bl, /text:/, `${file} still holds review text; it belongs in reviews.ts`);
		}
	});

	it('gives every published review a date and a source', () => {
		const src = reviewsSrc();
		const names = (src.match(/^  \{$/gm) || []).length;
		const dates = (src.match(/^    date: '/gm) || []).length;
		const sources = (src.match(/^    sourceLabel: /gm) || []).length;
		assert.ok(names >= 5, `expected the published reviews, found ${names}`);
		assert.equal(dates, names, 'every review needs an ISO date');
		assert.equal(sources, names, 'every review needs a source label');
		for (const [, d] of src.matchAll(/date: '(\d{4}-\d{2}-\d{2})'/g)) {
			assert.match(d, /^20\d{2}-/, `implausible review date ${d}`);
		}
	});

	it('never reinstates the authored quotes that were attributed to real customers', () => {
		// The exact strings from commit 8157cd3. These three people are real and their
		// genuine reviews are published; these particular sentences were written in-house.
		const fabricated = [
			'I told Moil the shop once',
			'We run the shop in English and Spanish',
			'I ask Moil for the plan and the month instead of paying a consultant',
		];
		for (const file of LIVE_SOURCES) {
			const src = read(file);
			for (const phrase of fabricated) {
				assert.ok(!src.includes(phrase), `fabricated quote "${phrase}" is back in ${file}`);
			}
		}
	});

	it('quotes each customer from one place only', () => {
		// Luis, Liliana and Miguel each had THREE different versions of their words in
		// this repo: /business, /marketing and the originals. reviews.ts is the only
		// file allowed to hold quote text.
		const named = ['Luis Vives', 'Liliana Cervantes', 'Miguel Bustos'];
		for (const file of LIVE_SOURCES) {
			if (file.endsWith('data/reviews.ts')) continue;
			const src = read(file);
			for (const person of named) {
				assert.ok(
					!src.includes(person),
					`${person} is quoted in ${file}; quotes belong in src/common/data/reviews.ts`,
				);
			}
		}
	});

	it('publishes no invented usage counts on any live surface', () => {
		// Every one of these was a decorative figure with nothing behind it:
		// "50,000+ job seekers", "10K+ active jobs", "94% interview success",
		// "98% ATS pass rate", "58% more bilingual reach".
		const claim =
			/(\d{1,3}(,\d{3})+|\d+\s?K)\+\s*(job|resume|worker|subscriber|compan|user|business|placement|seeker)/i;
		const rate = /\b\d{2,3}%\s*(success|accuracy|pass|rate|reach|retention|match)/i;
		for (const file of LIVE_SOURCES) {
			const src = read(file).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
			assert.ok(!claim.test(src), `unsourced usage count in ${file}`);
			assert.ok(!rate.test(src), `unsourced performance rate in ${file}`);
		}
	});

	it('publishes no star rating, because the public source has none to report', () => {
		// Facebook uses yes/no recommendations. Any average would be invented.
		for (const file of [...LIVE_SOURCES, 'public/llms.txt']) {
			const src = read(file);
			assert.doesNotMatch(src, /ratingValue|reviewRating|\b4\.\d\s*(★|stars?)/i, `rating claim in ${file}`);
		}
	});

	it('labels a review rather than trimming it when it does not fit the positioning', () => {
		const src = reviewsSrc();
		// The coaching and jobs reviews are the ones that do not sit neatly under
		// marketing; each must carry context so the quote is never left to imply
		// something it does not say.
		for (const topic of ['coaching', 'jobs', 'founder']) {
			const i = src.indexOf(`topic: '${topic}'`);
			assert.ok(i > 0, `expected a "${topic}" review to be published`);
			const entryStart = src.lastIndexOf('  {', i);
			assert.match(src.slice(entryStart, i), /context: \{/, `"${topic}" review needs a context label`);
		}
	});

		it('publishes no AggregateRating and no unsourced business count', () => {
		for (const file of LIVE_SOURCES) {
			const src = read(file);
			assert.doesNotMatch(src, /"@type":\s*"AggregateRating"/, `AggregateRating in ${file}`);
			assert.doesNotMatch(src, /500\+ (small )?businesses/i, `unsourced 500+ claim in ${file}`);
		}
	});
});

describe('hiring is available but not a pillar', () => {
	it('never denies hiring, and never promotes it as a pillar', () => {
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
			// Hiring is a real, available feature (3,000+ candidates) and a published
			// customer review mentions it, so denying it would contradict the page.
			// What must not come back is the denial, or hiring as a headline pillar.
			assert.doesNotMatch(src, /not a hiring platform/i, `hiring denial in ${file}`);
			const copy = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
			assert.doesNotMatch(copy, /Smart Hiring/i, `hiring sold as a pillar in ${file}`);
			assert.doesNotMatch(copy, /\b\d+[- ]day average to hire|95% (match )?accuracy/i, `unsourced hiring metric in ${file}`);
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

	it('keeps the live H1 as the investor lock', () => {
		const en = read('src/common/translations/en.ts');
		const hero = en.slice(en.indexOf('    hero: {'), en.indexOf('    aeoAnswer: {'));
		assert.match(hero, /headline: 'You shouldn\\'t have to be everything on top of the real job\.'/);
		assert.doesNotMatch(hero, /You\\u2019re the marketing team/);
		assert.doesNotMatch(en, /Meet the AI co-founder for your shop/);
	});

	it('points /business and llms.txt at the three A-money product guides', () => {
		const urls = [
			'https://blog.moilapp.com/article/how-to-write-a-business-plan-small-business',
			'https://blog.moilapp.com/article/best-ai-business-plan-generator-2025-compared',
			'https://blog.moilapp.com/article/30-day-social-media-content-calendar-small-business',
		];
		const page = read('app/business/BusinessPageContent.tsx');
		const llms = read('public/llms.txt');
		const en = read('src/common/translations/en.ts');
		for (const url of urls) {
			assert.ok(page.includes(url), `/business is missing ${url}`);
			assert.ok(llms.includes(url), `llms.txt is missing ${url}`);
			assert.ok(!llms.includes(`${url}.md`), `llms.txt must use the HTML canonical, not ${url}.md`);
		}
		assert.match(en, /Guides: how to write the plan/);
		assert.match(page, /id="guides"/);
		assert.doesNotMatch(page, /employer-beta/);
		assert.doesNotMatch(llms, /employer-beta/);
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
		// 87885a8 re-added /compare/moil-vs-claude as an extra page. Keep it;
		// wiping it would drop later main. bilingual-local-shop stays retired.
		assert.ok(fs.existsSync(path.join(root, 'app/compare/moil-vs-claude')));
		assert.ok(!fs.existsSync(path.join(root, 'app/compare/bilingual-local-shop')));
		const config = read('next.config.js');
		assert.match(config, /source: '\/compare\/bilingual-local-shop'/);
		assert.match(config, /source: '\/compare\/moil-vs-claude'/);
	});

	it('keeps the two tiers telling the same story everywhere', () => {
		// The page once claimed the 30-day calendar was included at $25 while the FAQ
		// said it was $75. The split is: $25 makes things on request, $75 also runs
		// the month unasked. Nothing on any surface may contradict that.
		const en = read('src/common/translations/en.ts');
		const business = en.slice(en.indexOf('\n  business: {'));

		// The $25 column must never claim Moil360 / the calendar / video.
		const tiers = business.slice(business.indexOf('    tiers: {'));
		const table = tiers.slice(tiers.indexOf('rows: ['), tiers.indexOf('      ],'));
		for (const line of table.split('\n')) {
			if (/Moil360|content calendar|AI video/i.test(line)) {
				const cells = [...line.matchAll(/'([^']*)'/g)].map((m) => m[1]);
				assert.equal(
					cells[1],
					'Not included',
					`the $25 column claims "${cells[0]}"; that is Market Pro only`,
				);
			}
		}

		// No surface may say the calendar is included at $25.
		const claim = /\$25[^.]{0,120}(30-day calendar|Moil360)[^.]{0,40}(included|includes)/i;
		for (const file of [...LIVE_SOURCES, 'public/llms.txt']) {
			assert.ok(!claim.test(read(file)), `${file} implies the calendar is in the $25 plan`);
		}

		// Both prices must appear together wherever the offer is described, so a
		// reader never sees one tier without the other.
		for (const file of ['public/llms.txt', 'app/ai-info/page.tsx']) {
			const src = read(file);
			assert.ok(src.includes('$25') && src.includes('$75'), `${file} states one tier but not the other`);
		}
	});

	it('shows the breadth of what Moil makes, not just marketing', () => {
		// Positioning as marketing-only was too narrow: the product also does plans,
		// research, brand, decks, shifts and sales follow-up. It does NOT do landing
		// pages — that item lived in this list until 20 Aug 2026 and was never real.
		const en = read('src/common/translations/en.ts');
		const business = en.slice(en.indexOf('\n  business: {'));
		const made = business.slice(business.indexOf('    made: {'), business.indexOf('    tiers: {'));
		const items = (made.match(/^        '/gm) || []).length;
		assert.ok(items >= 6, `want at least 6 concrete deliverables, found ${items}`);
		for (const word of ['plan', 'market', 'deck', 'flyer']) {
			assert.ok(made.toLowerCase().includes(word), `breadth list never mentions "${word}"`);
		}
	});

	it('does not repeat the price boilerplate across the site', () => {
		const phrase = /Professional is \$25 a month for research, plan, coaching, and documents/g;
		const total = LIVE_SOURCES.reduce((n, p) => n + (read(p).match(phrase) || []).length, 0);
		assert.ok(total <= 1, `price boilerplate repeated ${total} times; state it once per page`);
	});
});

describe('publishing is described accurately', () => {
	// August 2026: the site told buyers, and told assistants in /ai-info and
	// llms.txt, that Moil "is not a social media scheduler" and "does not post to
	// accounts". It does. service/content360/socialScheduler.service.js publishes
	// approved posts to Facebook Pages and Instagram (photo, video, carousel) on a
	// BullMQ delay, reads the permalink back, and bestTimePrior.js picks the hour
	// from the account's own post_insights. Denying a shipped feature on our own
	// site is worse than any missing feature — it talks a buyer out of the thing
	// they came for.
	const SURFACES = [...LIVE_SOURCES, 'public/llms.txt'];

	it('no surface denies that Moil publishes', () => {
		const denials = [
			/not a social media scheduler/i,
			/does not (publish|post) to (your )?accounts/i,
			/does not post to accounts/i,
			/direct publishing is not its strength/i,
		];
		for (const file of SURFACES) {
			const src = read(file);
			for (const re of denials) {
				assert.ok(!re.test(src), `${file} denies publishing, which Moil does: ${re}`);
			}
		}
	});

	it('the machine-facing surfaces name the networks Moil actually publishes to', () => {
		for (const file of ['app/ai-info/page.tsx', 'public/llms.txt']) {
			const src = read(file);
			assert.match(src, /Facebook/i, `${file} never names Facebook as a publish target`);
			assert.match(src, /Instagram/i, `${file} never names Instagram as a publish target`);
			// The honest limit has to travel with the claim, or the next correction
			// is someone expecting a LinkedIn post that never goes out.
			assert.match(src, /LinkedIn/i, `${file} claims publishing without naming what is not connected`);
		}
	});

	it('the short boilerplate carries publishing too, everywhere it is pasted', () => {
		// The one-paragraph "what is Moil" answer is the highest-leverage sentence
		// we own: it is the AEO answer block, the llms.txt summary, the G2 and
		// Capterra description, and the constitution's own definition. The August
		// correction fixed six long-form surfaces and missed this one, so the short
		// version still described a product that only makes things and never sends
		// them. It is a list of deliverables; publishing has to be the last item or
		// the arc stops one step early.
		const BOILERPLATE = [
			'src/common/translations/en.ts',
			'src/common/translations/es.ts',
			'public/llms.txt',
			'research/moil-offsite-playbook.html',
			'research/moil-brand-constitution.html',
		];
		for (const file of BOILERPLATE) {
			const src = read(file);
			assert.match(
				src,
				/(schedules and publishes|programa y publica)/i,
				`${file} describes Moil without saying it publishes`,
			);
		}
	});

	it('both languages carry the publishing answer', () => {
		assert.match(read('src/common/translations/en.ts'), /Facebook Page and Instagram/);
		assert.match(read('src/common/translations/es.ts'), /Facebook e Instagram/);
	});
});

describe('we only claim deliverables an owner can actually ask for', () => {
	// August 2026, twice in one week: a service file was read as a customer-facing
	// capability. service/landingPageGenerator.js exists in the backend, so the copy
	// said Moil makes landing pages. It does not — the co-founder can talk an owner
	// through building one, which is help, not a deliverable. The tell was already
	// on the site: the context line on Linda Horukeye's review says in plain words
	// that Moil is not a website builder, and the rest of the site contradicted it.
	//
	// The rule this pins: a filename is not a feature. If an owner cannot ask for it
	// in the chat and receive the finished thing, it does not go in a deliverable list.
	it('no live surface offers a landing page as something Moil produces', () => {
		// \\s+ and the optional '>' marker: llms.txt is a markdown blockquote and
		// wrapped "a landing\\n> page" straight through the first version of this test.
		const claims = [/landing(?:\\s|>)+pages?/i, /p[aá]gina(?:\\s|>)+web/i, /p[aá]ginas(?:\\s|>)+web/i];
		for (const file of [...LIVE_SOURCES, 'public/llms.txt']) {
			// Strip comments: this repo IS a landing page and says so in its own
			// file headers. Only shipped copy is a claim to a customer.
			const src = read(file)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/^\s*\/\/.*$/gm, '');
			for (const re of claims) {
				assert.ok(
					!re.test(src),
					`${file} offers landing pages, which Moil does not produce: ${re}`,
				);
			}
		}
	});

	it('keeps the review context line that says so out loud', () => {
		// This sentence is the counter-example that catches the next drift.
		assert.match(read('src/common/data/reviews.ts'), /not a website builder/i);
	});
});

describe('we never recommend a competitor over ourselves', () => {
	// Conceding real limits is what makes a comparison page citable; handing a
	// buyer a verdict that someone else "does it better and cheaper" is not a
	// concession, it is an endorsement written on our own domain. Name their
	// advantage as a fact — more networks, $5 a channel — never as a judgement.
	it('no live source declares a competitor better', () => {
		const verdicts = [
			/better and cheaper/i,
			/cheaper and better/i,
			/does (those|that|it|all three) better/i,
			/genuinely better/i,
			/is better at it/i,
			/m[aá]s barato y mejor/i,
		];
		for (const file of [...LIVE_SOURCES, 'public/llms.txt', 'src/common/translations/es.ts']) {
			const src = read(file);
			for (const re of verdicts) {
				assert.ok(!re.test(src), `${file} tells a buyer a competitor is better: ${re}`);
			}
		}
	});
});
