#!/usr/bin/env node
'use strict';

/**
 * sign_up_start — the one conversion event the landing fires (plan 0.4, F7).
 *   node --test evals/signupEvent.test.js
 *
 * The site fired no event beyond page views, so nothing in the positioning
 * plan could be tied to a customer. Pure rules are proved behaviourally; the
 * wiring is proved by an EXHAUSTIVE scan: every anchor whose href leaves for
 * the app's register page must carry data-signup-cta, or the delegated
 * listener never sees it and the click reads as "direct".
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
		else if (/\.tsx$/.test(entry.name)) out.push(rel);
	}
	return out;
};

// The pure module is TypeScript; strip types the cheap way for node:test.
function loadSignup() {
	const src = read('src/common/analytics/signup.ts')
		.replace(/^export type .*$/gm, '')
		.replace(/ as const/g, '')
		.replace(/: Pick<Storage, [^>]+>/g, '')
		.replace(/: Record<string, string>/g, '')
		.replace(/\((input): \{[^}]+\}\)/, '($1)')
		.replace(/\(search: string\)/g, '(search)')
		.replace(/\(storage, search: string\)/g, '(storage, search)')
		.replace(/\(storage\): Utm/g, '(storage)')
		.replace(/: Utm = \{\}/g, ' = {}')
		.replace(/: Utm/g, '')
		.replace(/export /g, '');
	const mod = {};
	new Function('module', `${src}\nmodule.exports = { utmFromSearch, signupEventParams, rememberUtm, readUtm, UTM_STORAGE_KEY, SIGNUP_EVENT };`)(mod);
	return mod.exports;
}
const S = loadSignup();
const memStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) }; };

describe('pure rules', () => {
	it('reads only utm_* keys, trimmed and bounded', () => {
		const utm = S.utmFromSearch('?utm_source=moil_blog&utm_medium=nav&email=a%40b.com&utm_campaign=' + 'x'.repeat(300));
		assert.deepEqual(Object.keys(utm).sort(), ['utm_campaign', 'utm_medium', 'utm_source']);
		assert.equal(utm.utm_campaign.length, 120);
		assert.ok(!JSON.stringify(utm).includes('a@b.com'));
	});
	it('remembers arrival UTMs for the session and never overwrites them with nothing', () => {
		const st = memStorage();
		assert.deepEqual(S.rememberUtm(st, '?utm_source=moil_blog'), { utm_source: 'moil_blog' });
		assert.deepEqual(S.rememberUtm(st, ''), { utm_source: 'moil_blog' }, 'a later page with no UTMs must keep the arrival set');
		assert.deepEqual(S.readUtm(st), { utm_source: 'moil_blog' });
	});
	it('the event carries path, cta and the remembered UTMs — and nothing else', () => {
		const p = S.signupEventParams({ path: '/es/business', cta: 'hero', utm: { utm_source: 'moil_blog', utm_medium: 'nav' } });
		assert.deepEqual(p, { page_path: '/es/business', cta: 'hero', utm_source: 'moil_blog', utm_medium: 'nav' });
	});
	it('survives a broken store', () => {
		assert.deepEqual(S.readUtm({ getItem: () => '{not json' }), {});
	});
});

describe('wiring', () => {
	it('the bridge is mounted in the root layout and gated on consent', () => {
		assert.match(read('app/layout.tsx'), /<SignupEventBridge \/>/);
		const bridge = read('src/common/components/SignupEventBridge.tsx');
		assert.match(bridge, /effectiveConsent\(\) !== 'accepted'\) return/);
		assert.match(bridge, /closest\?\.\('a\[data-signup-cta\]'\)/);
		assert.match(bridge, /window\.gtag\('event', SIGNUP_EVENT/);
	});
	it('EVERY register CTA carries data-signup-cta (exhaustive over app/ and src/)', () => {
		const REGISTER = /getRegisterUrl\(\)|buildRegisterUrl\(|signupHref|ctaHref|employer-beta\.moilapp\.com\/register/;
		let seen = 0;
		for (const file of walk('app').concat(walk('src')).filter((f) => !f.includes('legacy'))) {
			const src = read(file);
			// Every <a …> or <PrimaryButton …> opening tag, multi-line.
			for (const m of src.matchAll(/<(a|PrimaryButton)\b[^>]*>/gs)) {
				const tag = m[0];
				const href = tag.match(/href=\{([^}]*)\}|href="([^"]*)"/);
				if (!href) continue;
				const target = href[1] || href[2] || '';
				if (!REGISTER.test(target)) continue;
				if (/signinHref|getLoginUrl/.test(target)) continue;
				seen += 1;
				assert.ok(
					/data-signup-cta=|signupCta=/.test(tag),
					`${file}: register CTA without data-signup-cta:\n${tag.slice(0, 200)}`,
				);
			}
		}
		assert.ok(seen >= 10, `only ${seen} register CTAs found — the scan is not reaching them`);
	});
	it('the consent gate in Analytics is untouched', () => {
		assert.match(read('src/common/components/analytics.tsx'), /if \(consent !== 'accepted'\) return null;/);
	});
});
