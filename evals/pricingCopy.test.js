#!/usr/bin/env node
'use strict';

/**
 * One source for prose price claims — the gate.
 *   node --test evals/pricingCopy.test.js
 *
 * F1 (2026-09-05): seven surfaces said Professional was "$25 … without the
 * month" and twelve said the "30-day calendar" came "from $25". Both were
 * hand-typed drift; `offers.ts` had pulled the schema.org Offer bodies into one
 * file and the prose never followed. This file makes that drift a build failure:
 *
 *   (a) EXHAUSTIVE over app/ and src/ (comments stripped, legacy/ excluded): a
 *       $25 or $75 within 120 characters of a month-as-deliverable phrase fails
 *       unless the file is offers.ts or pricingCopy.ts. "a month" / "al mes" /
 *       "/month" are billing periods and are deliberately NOT in the phrase list.
 *   (b) pricingCopy.ts types no number: prices come from offers.ts, quantities
 *       from tierLimits.ts.
 *   (c) tierLimits.ts equals the committed backend pin (always) and the live
 *       sibling checkout (when present — skipping LOUDLY when it is not, because
 *       CI has no sibling and a silent skip reads as coverage).
 *   (d) The FE planAccess pin says content360 is true for professional_* — the
 *       landing must not describe a tier the app does not ship.
 *   (e) Meta descriptions built from the copy fit in 155 characters.
 *   (f) The old phrasings are gone from every live surface, including the one
 *       static text file (public/llms.txt) that the source scan cannot see.
 *
 * Red-verified: restoring app/layout.tsx's original description verbatim fails
 * (a) and (f); deleting the professional block from tierLimits.ts fails (c);
 * typing "$25" into pricingCopy.ts fails (b).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const walk = (dir, out = []) => {
	for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
		const rel = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(rel, out);
		else if (/\.(ts|tsx)$/.test(entry.name)) out.push(rel);
	}
	return out;
};
const stripComments = (src) => src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

const LIVE_SOURCES = [...walk('app'), ...walk('src')].filter((p) => !p.includes('legacy'));
const ALLOWED = new Set(['src/common/seo/offers.ts', 'src/common/seo/pricingCopy.ts']);

// Month-as-DELIVERABLE phrases. A price near one of these is a tier claim.
const MONTH_DELIVERABLE =
	/(30-day|thirty days|treinta d[ií]as|calendar|calendario|Moil360|month of content|mes de contenido|the month\b|el mes\b|whole month|mes completo|writes the month|escribe el mes|without the month|sin el mes|refreshes every month|every month|se renueva cada mes|cada mes)/i;
// 120, not 80: the root layout's original description put "30-day content
// calendar" 100 characters before "From $25" (a full sentence in between), and
// the first cut of this file at 80 stayed GREEN with that sentence restored
// verbatim — the exact red-verification the plan names. An injection that stays
// green is a claim about the eval before it is a claim about the code.
const WINDOW = 120;

function priceClaims(src) {
	const hits = [];
	const re = /\$(25|75)\b/g;
	let m;
	while ((m = re.exec(src))) {
		const from = Math.max(0, m.index - WINDOW);
		const to = Math.min(src.length, m.index + m[0].length + WINDOW);
		const window = src.slice(from, to);
		if (MONTH_DELIVERABLE.test(window)) hits.push(window.replace(/\s+/g, ' '));
	}
	return hits;
}

const pinBe = require('./fixtures/be-planLimits.js');
const tierSrc = read('src/common/seo/tierLimits.ts');
const copySrc = read('src/common/seo/pricingCopy.ts');

// Read a tier block's numbers out of tierLimits.ts without a TS loader.
function tierFromSource(id) {
	const start = tierSrc.indexOf(`  ${id}: {`);
	assert.ok(start > -1, `tierLimits.ts has no ${id} block`);
	const block = tierSrc.slice(start, tierSrc.indexOf('\n  }', start));
	const num = (k) => {
		const mm = block.match(new RegExp(`${k}: (\\d+)`));
		assert.ok(mm, `tierLimits.${id}.${k} missing`);
		return Number(mm[1]);
	};
	const bool = (k) => {
		const mm = block.match(new RegExp(`${k}: (true|false)`));
		assert.ok(mm, `tierLimits.${id}.${k} missing`);
		return mm[1] === 'true';
	};
	const platforms = [...block.match(/platforms: \[([^\]]*)\]/)[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]);
	return {
		postsPerWeek: num('postsPerWeek'),
		generatedPhotosPerWeek: num('generatedPhotosPerWeek'),
		brollReelsPerWeek: num('brollReelsPerWeek'),
		generativeVideosPerMonth: num('generativeVideosPerMonth'),
		autoPromote: bool('autoPromote'),
		platforms,
	};
}

describe('the scan can see what it is looking for', () => {
	it('walks a real number of live sources and finds real price literals', () => {
		assert.ok(LIVE_SOURCES.length > 50, `only ${LIVE_SOURCES.length} live sources walked`);
		const total = LIVE_SOURCES.reduce((n, f) => n + (stripComments(read(f)).match(/\$(25|75)\b/g) || []).length, 0);
		assert.ok(total >= 10, `only ${total} price literals seen; the scan is not reaching the surfaces`);
	});
	it('flags a known tier claim (canary)', () => {
		assert.equal(priceClaims('Professional is $25 if you want the plan without the month.').length, 1);
		assert.equal(priceClaims('a 30-day content calendar that refreshes every month. From $25 a month.').length, 1);
		assert.equal(priceClaims('Professional, $25 a month: research and a plan.').length, 0, 'a billing period is not a tier claim');
	});
});

describe('(a) no surface outside the two sources ties a price to the month', () => {
	for (const file of LIVE_SOURCES) {
		if (ALLOWED.has(file)) continue;
		it(file, () => {
			const hits = priceClaims(stripComments(read(file)));
			assert.deepEqual(hits, [], `${file} types a tier claim: ${hits.join(' | ')}`);
		});
	}
});

describe('(b) pricingCopy types no number', () => {
	const body = stripComments(copySrc);
	it('carries no dollar literal', () => {
		assert.doesNotMatch(body, /\$\d/, 'a price is typed in pricingCopy.ts; read it from offers.ts');
	});
	it('carries no post count literal', () => {
		assert.doesNotMatch(body, /\b\d+ (posts|publicaciones)\b/, 'a quantity is typed in pricingCopy.ts; read it from tierLimits.ts');
	});
	it('imports both sources', () => {
		assert.match(body, /from '\.\/offers'/);
		assert.match(body, /from '\.\/tierLimits'/);
	});
	it('omits the extra-network clause rather than rendering it blank', () => {
		assert.match(body, /if \(extra\.length === 0\) return ''/);
	});
});

describe('(c) tierLimits.ts is the backend pin', () => {
	it('professional matches the pin', () => {
		assert.deepEqual(tierFromSource('professional'), pinBe.professional);
	});
	it('marketPro matches the pin', () => {
		assert.deepEqual(tierFromSource('marketPro'), pinBe.marketing_pro);
	});
	it('the automatic month reaches the pinned networks and no others', () => {
		const auto = [...tierSrc.match(/AUTOPILOT_PLATFORMS: readonly string\[\] = \[([^\]]*)\]/)[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]);
		assert.deepEqual(auto, pinBe.autopilotPlatforms);
	});
	it('the pin matches the live backend when the sibling is checked out', () => {
		if (!BE_REPO) {
			console.log('  skip  backend sibling not checked out — be-planLimits pin NOT verified against live source (this is not a pass)');
			return;
		}
		const live = path.join(BE_REPO, 'utils', 'planLimits.js');
		assert.ok(fs.existsSync(live), `${BE_REPO} has no utils/planLimits.js`);
		const p = require(live);
		// The drop's OWN target set, never socialPlatforms.FAN_OUT_ALIASES.both.
		// That alias is the frozen stored meaning of the legacy `platform: 'both'`
		// string; it answers "what did a past choice mean", not "where does the
		// automatic month go". Pinning it made this check unable to see the drift
		// it exists for — Autopilot gained LinkedIn on 2026-09-05 and this stayed
		// green, so Market Pro's copy silently lost a $75-only differentiator.
		const d = require(path.join(BE_REPO, 'service', 'content360', 'dropTargets.js'));
		const pick = (t) => ({
			postsPerWeek: t.postsPerWeek,
			generatedPhotosPerWeek: t.generatedPhotosPerWeek,
			brollReelsPerWeek: t.brollReelsPerWeek,
			generativeVideosPerMonth: t.generativeVideosPerMonth,
			autoPromote: t.autoPromote,
			platforms: [...t.platforms],
		});
		assert.deepEqual(pick(p.TIER_LIMITS.professional), pinBe.professional, 'be-planLimits.js is stale: professional');
		assert.deepEqual(pick(p.TIER_LIMITS.marketing_pro), pinBe.marketing_pro, 'be-planLimits.js is stale: marketing_pro');
		assert.deepEqual([...d.PROMOTABLE_PLATFORMS], pinBe.autopilotPlatforms, 'be-planLimits.js is stale: autopilot networks');
	});
});

/**
 * THE SIBLING IS RESOLVED, NEVER TYPED.
 *
 * Both cross-checks below named one literal directory (`Business-plan-Staging`,
 * `Moil-Employer-FE-Staging`) and took their loud-skip branch on any checkout
 * that spells it differently — which is every checkout that clones the repo
 * under its GitHub name. So the gate that exists to catch tier drift had never
 * run on a machine holding both repos, and the drift it exists for shipped: the
 * backend's 2026-09-14 cut moved TikTok and YouTube into PUBLISHABLE and left
 * LinkedIn locked, while this site kept claiming the opposite of both.
 *
 * A hardcoded path is wrong the day the host changes AND IT CANNOT SAY SO — it
 * is indistinguishable from "no sibling here", which is the one reading that
 * looks like coverage. Candidates are an env override first, then every name
 * the repo is known by; an older checkout still gets the stronger check.
 */
function siblingRepo(names, envVar, requiredFiles) {
	const fromEnv = process.env[envVar];
	const candidates = fromEnv ? [fromEnv, ...names] : names;
	for (const name of candidates) {
		const dir = path.isAbsolute(name) ? name : path.join(root, '..', name);
		if (!fs.existsSync(dir)) continue;
		if (requiredFiles.every((file) => fs.existsSync(path.join(dir, file)))) return dir;
		if (fromEnv && name === fromEnv) {
			throw new Error(`${envVar} points to ${dir}, but it lacks: ${requiredFiles.join(', ')}`);
		}
	}
	return null;
}

// THIS repo's own sibling is listed FIRST, in every spelling a clone produces
// — `git clone` of the GitHub name gives `Business-plan-Staging`, while the
// session tooling clones lower-case. Case matters on Linux, so omitting the
// lower-case spelling sent this gate past its own sibling and onto the
// PRODUCTION backend sitting beside it, which grades staging against a
// different deployment: measured, that reported marketing_pro as
// IG+FB+TikTok+YouTube and failed three checks about code that is correct
// here. A cross-environment fallback is kept only as the LAST resort, where
// it is better than no check at all.
const BE_REPO = siblingRepo(
	[
		'Business-plan-Staging',
		'business-plan-staging',
		'Business-Plan-Backend-End-Prod',
	],
	'MOIL_BE_REPO',
	['utils/planLimits.js', 'service/content360/dropTargets.js'],
);
const FE_REPO = siblingRepo(
	[
		'Moil-Employer-FE-Staging',
		'moil-employer-fe-staging',
		'Moil-codeEmployer-beta',
		'Moilapp_business',
	],
	'MOIL_FE_REPO',
	['src/utils/subscriptionHelper/planAccess.js'],
);

describe('(d) the app ships the tier the landing describes', () => {
	const pinFe = read('evals/fixtures/fe-planAccess.js');
	const planKeys = [
		'basic_monthly',
		'basic_yearly',
		'standard_monthly',
		'standard_yearly',
		'professional_monthly',
		'professional_yearly',
		'marketing_pro_monthly',
		'marketing_pro_yearly',
	];
	const featureKeys = ['businessPlan', 'keywordResearch', 'businessCoach', 'content360', 'marketPro'];
	const planFeatureMatrix = (src) => Object.fromEntries(planKeys.map((plan) => {
		const match = src.match(new RegExp(`\\b${plan}\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
		assert.ok(match, `${plan} block missing`);
		return [plan, Object.fromEntries(featureKeys.map((feature) => {
			const flag = match[1].match(new RegExp(`\\b${feature}\\s*:\\s*(true|false)`));
			assert.ok(flag, `${plan}.${feature} missing`);
			return [feature, flag[1] === 'true'];
		}))];
	}));
	const pinMatrix = planFeatureMatrix(pinFe);
	const professionalHas = (key, flag) => {
		return pinMatrix[key][flag];
	};
	it('content360 is true for professional_* in the pin', () => {
		assert.ok(professionalHas('professional_monthly', 'content360'));
		assert.ok(professionalHas('professional_yearly', 'content360'));
	});
	it('marketPro is false for professional_* in the pin — the month is not the $25 tier', () => {
		assert.ok(!professionalHas('professional_monthly', 'marketPro'));
		assert.ok(!professionalHas('professional_yearly', 'marketPro'));
	});
	it('the pin matches the live frontend when the sibling is checked out', () => {
		if (!FE_REPO) {
			console.log('  skip  employer frontend sibling not checked out — fe-planAccess pin NOT verified against live source (this is not a pass)');
			return;
		}
		const live = path.join(FE_REPO, 'src', 'utils', 'subscriptionHelper', 'planAccess.js');
		assert.deepEqual(
			planFeatureMatrix(fs.readFileSync(live, 'utf8')),
			pinMatrix,
			'evals/fixtures/fe-planAccess.js has a stale PLAN_FEATURES contract',
		);
	});
});

describe('(e) meta descriptions fit', () => {
	const offers = read('src/common/seo/offers.ts');
	const price = (k) => offers.match(new RegExp(`${k}: \\{[\\s\\S]*?price: '(\\d+)'`))[1];
	const render = (tpl) => tpl.replace(/\$\{pro\}/g, `$${price('professional')}`).replace(/\$\{mp\}/g, `$${price('marketPro')}`);
	for (const key of ['meta', 'metaPricing']) {
		const found = [...copySrc.matchAll(new RegExp(`\\n    ${key}: \`([^\`]+)\``, 'g'))].map((m) => render(m[1]));
		it(`${key} exists in both languages and is ≤155 chars`, () => {
			assert.equal(found.length, 2, `${key} defined ${found.length} times, want en + es`);
			for (const text of found) assert.ok(text.length <= 155, `${text.length} chars: ${text}`);
		});
	}
});

describe('(f) the old phrasings are gone', () => {
	const OLD = [
		/without the month/i,
		/not the month/i,
		/sin el mes\b/i,
		/si no quieres el mes/i,
		/30-day (content )?calendar[\s\S]{0,120}from \$25/i,
		/from \$25[\s\S]{0,120}30-day/i,
		/automates content creation thirty days/i,
	];
	for (const file of [...LIVE_SOURCES.filter((f) => !ALLOWED.has(f)), 'public/llms.txt']) {
		it(file, () => {
			const src = /\.(ts|tsx)$/.test(file) ? stripComments(read(file)) : read(file);
			for (const re of OLD) assert.doesNotMatch(src, re, `${file} still carries the drifted phrasing`);
		});
	}
	it('llms.txt states the split the way the source does', () => {
		assert.match(read('public/llms.txt'), /Professional is \$25 a month; the whole month written for you is Market Pro at \$75\./);
	});
});
