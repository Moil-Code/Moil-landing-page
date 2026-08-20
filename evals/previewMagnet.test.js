#!/usr/bin/env node
'use strict';

/**
 * Pins for the public preview magnet.
 * node --test evals/previewMagnet.test.js
 *
 * Behaviour pins import the pure helpers. Structural pins
 * fail when a generate-named function, Gemini, KEY_2, or
 * sales_leads is reintroduced.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const client = require('../app/business/preview/previewClient');
const wait = require('../app/business/preview/previewWaitCopy');
const cookie = require('../app/business/preview/previewCookie');

const MAGNET_KEYS = [
	'doorsLabel',
	'doorWebsite',
	'doorPlace',
	'doorHandle',
	'websitePlaceholder',
	'placePlaceholder',
	'placeUnavailable',
	'handlePlaceholder',
	'submit',
	'waitCalm',
	'waitLeave',
	'waitLonger',
	'down',
	'identityFail',
	'ceiling',
	'failed',
	'emailLabel',
	'emailPlaceholder',
	'emailHint',
	'startFree',
	'tryAgain',
	'colorsLabel',
	'productsLabel',
	'platformLabel',
	'badWebsite',
	'badHandle',
	'pickListing',
	'submitting',
	'waitEmailLabel',
	'waitReturn',
	'revealEyebrow',
	'unnamedBrand',
];

describe('preview client — origin and URLs', () => {
	it('unset origin is not configured and submit/view URLs are null', () => {
		assert.equal(client.isPlanApiConfigured(''), false);
		assert.equal(client.isPlanApiConfigured('   '), false);
		assert.equal(client.getPlanApiOrigin({}), '');
		assert.equal(client.previewSubmitUrl(''), null);
		assert.equal(client.previewViewUrl('', 'abc'), null);
	});

	it('configured origin builds /plan/preview and /plan/preview/:slug', () => {
		assert.equal(
			client.previewSubmitUrl('https://ai.moilapp.com'),
			'https://ai.moilapp.com/plan/preview',
		);
		assert.equal(
			client.previewViewUrl('https://ai.moilapp.com/', 'my-slug'),
			'https://ai.moilapp.com/plan/preview/my-slug',
		);
	});

	it('register URL is valid without a preview slug', () => {
		const url = client.buildRegisterUrl({ lang: 'en' });
		assert.match(url, /^https:\/\/business\.moilapp\.com\/register/);
		assert.doesNotMatch(url, /preview=/);
		assert.match(url, /[?&]lg=en/);
	});

	it('register URL includes ?preview= when a slug exists', () => {
		const url = client.buildRegisterUrl({ lang: 'es', previewSlug: 'taco-shop' });
		assert.match(url, /[?&]preview=taco-shop/);
		assert.match(url, /[?&]lg=es/);
	});

	it('down/unset origin: submitPreview returns the form error path, register still works', async () => {
		const result = await client.submitPreview('', { website: 'https://x.com' });
		assert.equal(result.ok, false);
		assert.equal(result.kind, 'down');
		const register = client.buildRegisterUrl({ lang: 'en' });
		assert.match(register, /^https:\/\/business\.moilapp\.com\/register/);
		assert.doesNotMatch(register, /preview=/);
	});
});

describe('preview client — GET is a view', () => {
	it('viewPreview issues GET and never POST', async () => {
		const calls = [];
		const fakeFetch = async (url, init) => {
			calls.push({ url, method: (init && init.method) || 'GET' });
			return {
				status: 200,
				json: async () => ({ status: 'building' }),
			};
		};
		const result = await client.viewPreview(
			'https://ai.moilapp.com',
			'slug-1',
			fakeFetch,
		);
		assert.equal(result.kind, 'building');
		assert.equal(calls.length, 1);
		assert.equal(calls[0].method, 'GET');
		assert.equal(
			calls[0].url,
			'https://ai.moilapp.com/plan/preview/slug-1',
		);
	});

	it('there is no generate-named export or function on the client', () => {
		const names = Object.keys(client);
		assert.equal(
			names.some((n) => /generate/i.test(n)),
			false,
			names.join(','),
		);
		const src = read('app/business/preview/previewClient.js');
		assert.equal(
			/function\s+\w*generate\w*/i.test(src),
			false,
		);
		const viewFn = src.slice(src.indexOf('async function viewPreview'));
		assert.match(viewFn, /method:\s*'GET'/);
		assert.equal(/method:\s*'POST'/.test(viewFn), false);
	});
});

describe('wait copy B25 ladder', () => {
	it('is calm before 30s, leave at 30s, longer at 2.5 min', () => {
		assert.equal(wait.waitCopyKey(0), 'waitCalm');
		assert.equal(wait.waitCopyKey(29_999), 'waitCalm');
		assert.equal(wait.waitCopyKey(30_000), 'waitLeave');
		assert.equal(wait.waitCopyKey(149_999), 'waitLeave');
		assert.equal(wait.waitCopyKey(150_000), 'waitLonger');
		assert.equal(wait.waitCopyKey(10 * 60 * 1000), 'waitLonger');
	});

	it('poll backoff is 2s, 4s, 8s, then cap 10s', () => {
		assert.equal(wait.nextPollDelayMs(0), 2000);
		assert.equal(wait.nextPollDelayMs(1), 4000);
		assert.equal(wait.nextPollDelayMs(2), 8000);
		assert.equal(wait.nextPollDelayMs(3), 10000);
		assert.equal(wait.nextPollDelayMs(9), 10000);
	});
});

describe('preview cookie', () => {
	it('cookie name is preview_slug, Lax, 7 days, path /', () => {
		assert.equal(cookie.PREVIEW_SLUG_COOKIE, 'preview_slug');
		const opts = cookie.previewCookieOptions();
		assert.equal(opts.sameSite, 'lax');
		assert.equal(opts.path, '/');
		assert.equal(opts.maxAge, 7 * 24 * 60 * 60);
	});

	it('setPreviewSlugCookie writes the documented name', () => {
		const doc = { cookie: '' };
		cookie.setPreviewSlugCookie('abc-123', doc);
		assert.match(doc.cookie, /^preview_slug=abc-123/);
		assert.match(doc.cookie, /SameSite=Lax/);
		assert.match(doc.cookie, /Path=\//);
		assert.match(doc.cookie, /Max-Age=604800/);
	});
});

describe('door bodies pass through — no handle parser', () => {
	it('website door sends { website }', () => {
		assert.deepEqual(client.websiteSubmitBody({ website: ' https://x.com ' }), {
			website: 'https://x.com',
		});
	});
	it('listing door sends { placeId, businessName }', () => {
		assert.deepEqual(
			client.placeSubmitBody({
				placeId: 'ChIJabc',
				businessName: 'Taco Shop',
			}),
			{ placeId: 'ChIJabc', businessName: 'Taco Shop' },
		);
	});
	it('handle door sends { handle, platform } without parsing', () => {
		assert.deepEqual(
			client.handleSubmitBody({
				handle: '@name or https://ig.com/name',
				platform: 'instagram',
			}),
			{ handle: '@name or https://ig.com/name', platform: 'instagram' },
		);
	});
});

describe('structural refusals', () => {
	const files = [
		'app/business/preview/previewClient.js',
		'app/business/preview/previewWaitCopy.js',
		'app/business/preview/previewCookie.js',
		'app/business/components/PreviewMagnet.tsx',
		'app/business/sections/HeroSection.tsx',
		'.env.example',
		'next.config.js',
	];

	it('no sales_leads, no Gemini runtime, no KEY_2 assignment in magnet files', () => {
		for (const f of files) {
			const src = read(f);
			assert.equal(src.includes('sales_leads'), false, f + ' sales_leads');
			if (f !== '.env.example') {
				assert.equal(/gemini/i.test(src), false, f + ' gemini');
				assert.equal(
					src.includes('NEXT_PUBLIC_GOOGLE_API_KEY_2'),
					false,
					f + ' KEY_2',
				);
			}
		}
		const env = read('.env.example');
		assert.match(env, /KEY_2 stays gone|Do not re-add it/i);
		assert.match(env, /NEXT_PUBLIC_PLAN_API_ORIGIN=/);
		assert.doesNotMatch(env, /^NEXT_PUBLIC_GOOGLE_API_KEY_2=/m);
	});

	it('magnet poll path calls viewPreview, not submitPreview', () => {
		const src = read('app/business/components/PreviewMagnet.tsx');
		const pollFn = src.slice(src.indexOf('const poll ='));
		const pollBody = pollFn.slice(0, pollFn.indexOf('const beginWait'));
		assert.match(pollBody, /viewPreview\(/);
		assert.equal(/submitPreview\(/.test(pollBody), false);
	});

	it('hero primary CTA is still the register URL without requiring a slug', () => {
		const src = read('app/business/sections/HeroSection.tsx');
		assert.match(
			src,
			/appendLangToUrl\('https:\/\/business\.moilapp\.com\/register'/,
		);
		assert.doesNotMatch(src, /href="#journey"/);
		assert.match(src, /PreviewMagnet/);
	});

	it('EN and ES have the same magnet key set', () => {
		// Compares the ACTUAL key sets both ways rather than walking a hardcoded
		// list. The list version could only catch a key going missing from both
		// languages; a key added to English alone — which is how a bilingual
		// product ends up half-translated — passed it silently.
		const block = (file) => {
			const src = read(file);
			const start = src.indexOf('magnet: {');
			const end = src.indexOf('aeoAnswer:', start);
			assert.ok(start > 0 && end > start, file + ' magnet block not found');
			return new Set(
				[...src.slice(start, end).matchAll(/^\s{8}(\w+):/gm)].map((m) => m[1]),
			);
		};
		const en = block('src/common/translations/en.ts');
		const es = block('src/common/translations/es.ts');
		const enOnly = [...en].filter((k) => !es.has(k));
		const esOnly = [...es].filter((k) => !en.has(k));
		assert.deepEqual(enOnly, [], 'keys in EN with no ES: ' + enOnly.join(', '));
		assert.deepEqual(esOnly, [], 'keys in ES with no EN: ' + esOnly.join(', '));

		// The keys the component actually reads must exist in both.
		for (const key of MAGNET_KEYS) {
			assert.ok(en.has(key), 'en missing ' + key);
			assert.ok(es.has(key), 'es missing ' + key);
		}
	});

	it('Places reuses KEY_1 and the rewrite is not a model route', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.match(magnet, /NEXT_PUBLIC_GOOGLE_API_KEY_1/);
		assert.doesNotMatch(magnet, /GOOGLE_API_KEY_2/);
		const cfg = read('next.config.js');
		assert.match(cfg, /source: "\/plan\/preview"/);
		assert.doesNotMatch(cfg, /gemini/i);
		assert.doesNotMatch(cfg, /generative/i);
	});
});
