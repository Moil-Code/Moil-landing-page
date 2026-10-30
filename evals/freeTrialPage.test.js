#!/usr/bin/env node
'use strict';

/**
 * Moil360 free-trial landing page (/business/free-trial, /es/business/prueba-gratis).
 *   node --test evals/freeTrialPage.test.js
 *
 * The page turns a paid Facebook click into a click on the register link, so
 * the link rules are the product: the right `lg`, only the ad data that
 * arrived, nothing that delays or reroutes the click. The brief's trust rules
 * (no invented urgency, flagged claims hidden until signed off, no em dashes)
 * are pinned here too, because each one is a single line away from breaking.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const funnel = require('../app/business/free-trial/trialFunnel.js');

const REGISTER = 'https://business.moilapp.com/register';

function memoryStorage(seed = {}) {
	const data = { ...seed };
	return {
		getItem: (k) => (k in data ? data[k] : null),
		setItem: (k, v) => { data[k] = String(v); },
		data,
	};
}

describe('register link', () => {
	it('a visitor with no ad data gets only lg', () => {
		assert.equal(funnel.trialRegisterHref(REGISTER, 'en', {}), `${REGISTER}?lg=en`);
		assert.equal(funnel.trialRegisterHref(REGISTER, 'es', undefined), `${REGISTER}?lg=es`);
	});

	it('carries the brief\'s example UTMs and fbclid, lg first', () => {
		const ad = funnel.adParamsFromSearch(
			'?utm_source=facebook&utm_medium=paid_social&utm_campaign=moil360_30day_free&utm_content=v1-en-4x5&fbclid=IwAR123',
		);
		const href = funnel.trialRegisterHref(REGISTER, 'en', ad);
		assert.equal(
			href,
			`${REGISTER}?lg=en&utm_source=facebook&utm_medium=paid_social&utm_campaign=moil360_30day_free&utm_content=v1-en-4x5&fbclid=IwAR123`,
		);
	});

	it('only utm_* and fbclid travel; anything else in the URL is dropped', () => {
		const ad = funnel.adParamsFromSearch('?utm_source=facebook&gclid=x&email=a%40b.com&review=claims&lg=es');
		assert.deepEqual(ad, { utm_source: 'facebook' });
		assert.doesNotMatch(funnel.trialRegisterHref(REGISTER, 'en', ad), /gclid|email|review/);
	});

	it('an unknown language falls back to English rather than a broken lg', () => {
		assert.match(funnel.trialRegisterHref(REGISTER, 'fr', {}), /\?lg=en$/);
	});
});

describe('ad data survives the language switch', () => {
	it('fresh params are stored; a bare URL reads them back', () => {
		const storage = memoryStorage();
		funnel.rememberAdParams(storage, '?utm_campaign=moil360_30day_free&fbclid=abc');
		assert.deepEqual(funnel.rememberAdParams(storage, ''), { utm_campaign: 'moil360_30day_free', fbclid: 'abc' });
	});

	it('an empty arrival never overwrites a stored set', () => {
		const storage = memoryStorage();
		funnel.rememberAdParams(storage, '?utm_source=facebook');
		funnel.rememberAdParams(storage, '?unrelated=1');
		assert.deepEqual(funnel.readAdParams(storage), { utm_source: 'facebook' });
	});

	it('the two pages are registered twins, so the /business header and footer switch between them', () => {
		assert.match(
			read('src/common/i18n/localeRoutes.ts'),
			/\{ en: '\/business\/free-trial', es: '\/es\/business\/prueba-gratis' \}/,
		);
	});
});

describe('scarcity is never invented', () => {
	const now = Date.parse('2026-11-01T12:00:00Z');

	it('defaults to none', () => {
		assert.deepEqual(funnel.scarcityState({ mode: 'none', endsAt: null }, now), { kind: 'none' });
		assert.deepEqual(funnel.scarcityState({ mode: 'spots', endsAt: null }, now), { kind: 'none' });
	});

	it('deadline without a real end date, or without a time zone, falls back to none', () => {
		assert.deepEqual(funnel.scarcityState({ mode: 'deadline', endsAt: null }, now), { kind: 'none' });
		assert.deepEqual(funnel.scarcityState({ mode: 'deadline', endsAt: '2026-12-01T23:59:00' }, now), { kind: 'none' });
	});

	it('a future deadline counts down from server time; a past one closes the offer', () => {
		const open = funnel.scarcityState({ mode: 'deadline', endsAt: '2026-11-02T12:00:00Z' }, now);
		assert.equal(open.kind, 'deadline');
		assert.deepEqual(funnel.countdownParts(open.msLeft), { days: 1, hours: 0, minutes: 0, seconds: 0 });
		assert.deepEqual(funnel.scarcityState({ mode: 'deadline', endsAt: '2026-11-01T11:59:59Z' }, now), { kind: 'closed' });
	});
});

describe('flagged claims and events', () => {
	it('an unsigned claim is hidden unless a reviewer asks for it', () => {
		assert.equal(funnel.claimVisible('noPrompting', { noPrompting: false }, false), false);
		assert.equal(funnel.claimVisible('noPrompting', { noPrompting: false }, true), true);
		assert.equal(funnel.claimVisible('noPrompting', { noPrompting: true }, false), true);
		assert.equal(funnel.claimVisible(undefined, {}, false), true);
	});

	it('scroll depth fires 50 and 90 once each', () => {
		const sent = new Set();
		assert.deepEqual(funnel.crossedDepths(0.3, sent), []);
		assert.deepEqual(funnel.crossedDepths(0.95, sent), [50, 90]);
		sent.add(50);
		sent.add(90);
		assert.deepEqual(funnel.crossedDepths(1, sent), []);
	});
});

describe('content follows the brief', () => {
	const content = read('app/business/free-trial/trialContent.ts');

	it('no em dashes anywhere in the copy file', () => {
		assert.doesNotMatch(content, /—/);
	});

	it('every feature row is a flagged claim, and every claim id is in the sign-off list', () => {
		const signOff = content.match(/CLAIMS_SIGNED_OFF[^=]*=\s*\{([\s\S]*?)\};/);
		assert.ok(signOff, 'CLAIMS_SIGNED_OFF block not found');
		const known = new Set([...signOff[1].matchAll(/^\s*(\w+):\s*(true|false)/gm)].map((m) => m[1]));
		const used = [...content.matchAll(/claim: '(\w+)'/g)].map((m) => m[1]);
		assert.ok(used.length >= 12, `only ${used.length} claim references found`);
		for (const id of used) assert.ok(known.has(id), `claim '${id}' is not in CLAIMS_SIGNED_OFF`);
		const rows = content.match(/rows: \[([\s\S]*?)\n {4}\]/g) || [];
		assert.equal(rows.length, 2, 'expected one feature list per language');
		for (const block of rows) {
			for (const line of block.split('\n').filter((l) => /title:/.test(l))) {
				assert.match(line, /claim: '/, `feature row without a claim id: ${line.trim()}`);
			}
		}
	});

	it('the same button label is used everywhere, in each language', () => {
		assert.match(content, /cta: 'Claim my 30 free days'/);
		assert.match(content, /cta: 'Reclamar mis 30 días gratis'/);
	});

	it('scarcity ships off unless a dated deadline is configured', () => {
		const m = content.match(/scarcity: \{ mode: '(\w+)', endsAt: ([^,]+),/);
		assert.ok(m, 'scarcity config not found');
		if (m[1] === 'deadline') assert.match(m[2], /'\d{4}-\d{2}-\d{2}T[\d:]+(Z|[+-]\d{2}:\d{2})'/);
		else assert.equal(m[1], 'none');
	});

	it('the pages stay out of the sitemap while they are noindex', () => {
		if (/indexable: false/.test(content)) {
			assert.doesNotMatch(read('app/sitemap.ts'), /free-trial|prueba-gratis/);
		}
	});
});

describe('page wiring', () => {
	const page = read('app/business/free-trial/TrialPage.tsx');

	it('every register link carries data-signup-cta and opens in the same tab', () => {
		const anchors = page.match(/<a\b[^>]*href=\{registerHref\}[^>]*>/g) || [];
		assert.ok(anchors.length >= 2, `only ${anchors.length} register anchors found`);
		for (const a of anchors) assert.match(a, /data-signup-cta=/);
		assert.doesNotMatch(page, /target="_blank"|window\.open\(/);
	});

	it('the /business header, menu and footer get the trial link and stay in the same tab', () => {
		for (const component of ['BusinessNav', 'BusinessMobileMenu', 'BusinessFooter']) {
			const tag = page.match(new RegExp(`<${component}\\b[\\s\\S]*?/>`));
			assert.ok(tag, `${component} is not rendered`);
			assert.match(tag[0], /ctaHref=\{registerHref\}/, `${component} does not carry the trial link`);
			assert.match(tag[0], /ctaNewTab=\{false\}/, `${component} would open the register page in a new tab`);
		}
	});

	it('tracking never delays or blocks the click', () => {
		const handler = page.match(/const onCtaClick = useCallback\(([\s\S]*?)\n {2}\);/);
		assert.ok(handler, 'onCtaClick not found');
		// Comment-stripped: the handler's own comment names what it must not do.
		const code = handler[1].replace(/\/\/.*$/gm, '');
		assert.match(code, /trackTrialEvent\('cta_click'/);
		assert.doesNotMatch(code, /preventDefault|await|setTimeout|location\.href/);
	});

	it('both languages render the same component from the same content file', () => {
		assert.match(read('app/business/free-trial/page.tsx'), /<TrialPage copy=\{TRIAL_EN\}/);
		assert.match(read('app/es/business/prueba-gratis/page.tsx'), /<TrialPage copy=\{TRIAL_ES\}/);
	});
});
