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
const reveal = require('../app/business/preview/previewReveal');
const input = require('../app/business/preview/previewInput');

const MAGNET_KEYS = [
	'websitePlaceholder',
	'submit',
	'submitting',
	'waitCalm',
	'waitLeave',
	'waitLonger',
	'waitReturn',
	'down',
	'identityFail',
	'ceiling',
	'failed',
	'startFree',
	'tryAgain',
	'badWebsite',
	'socialLinkRefuse',
	'platformsLabel',
	'platformsDecide',
	'platformsChosen',
	'platformDecideForMe',
	'platformsOr',
	'knowingTitle',
	'headingName',
	'headingOverview',
	'headingProducts',
	'headingServices',
	'headingMessaging',
	'headingCtas',
	'headingSlogans',
	'headingVoice',
	'headingLogo',
	'headingColors',
	'headingPhotos',
	'headingSchedule',
	'editLabel',
	'doneLabel',
	'waitBeatFraming',
	'waitBeatAudience',
	'waitBeatServices',
	'waitBeatProblem',
	'waitBeatUvp',
];

const KILLED_PROMISE_EN = [
	'This is what Moil picked up in one pass, without you filling in a form.',
	'Inside, it asks you a few questions and turns this into the work:',
	'A study of your local market and who you are competing with',
	'A business plan built from your numbers, not a template',
	'A month of posts in your voice, with the images made for you',
	'Flyers, documents and decks whenever you ask for them',
];

const KILLED_PROMISE_ES = [
	'Esto es lo que Moil captó de una sola pasada, sin que llenaras un formulario.',
	'Adentro te hace unas preguntas y convierte esto en el trabajo:',
	'Un estudio de tu mercado local y de con quién compites',
	'Un plan de negocios hecho con tus números, no una plantilla',
	'Un mes de publicaciones con tu voz, con las imágenes ya hechas',
	'Volantes, documentos y presentaciones cuando los pidas',
];

const HONEST_MISS = 'We found that profile, but we do not have the shop name yet. Paste the website.';

describe('preview client — origin and URLs', () => {
	it('submit/view URLs are same-origin /plan/preview', () => {
		assert.equal(client.previewSubmitUrl(), '/plan/preview');
		assert.equal(client.previewViewUrl('my-slug'), '/plan/preview/my-slug');
		assert.equal(client.previewViewUrl(''), null);
		assert.equal(client.previewViewUrl('   '), null);
	});

	it('register URL is valid without a preview slug', () => {
		const url = client.buildRegisterUrl({ lang: 'en' });
		assert.match(url, /^https:\/\/business\.moilapp\.com\/register/);
		assert.doesNotMatch(url, /preview=/);
		assert.match(url, /[?&]lg=en/);
	});

	it('unset register env still produces production register/login', () => {
		assert.equal(client.getRegisterOrigin({}), 'https://business.moilapp.com');
		assert.equal(client.getRegisterUrl({}), 'https://business.moilapp.com/register');
		assert.equal(client.getLoginUrl({}), 'https://business.moilapp.com/login');
		assert.equal(
			client.getRegisterOrigin({ NEXT_PUBLIC_REGISTER_ORIGIN: '' }),
			'https://business.moilapp.com',
		);
	});

	it('register origin comes from env, not a hardcoded twin host', () => {
		const env = { NEXT_PUBLIC_REGISTER_ORIGIN: 'https://example-app.test' };
		assert.equal(client.getRegisterOrigin(env), 'https://example-app.test');
		assert.equal(client.getRegisterUrl(env), 'https://example-app.test/register');
		assert.match(
			client.buildRegisterUrl({ lang: 'en', env }),
			/^https:\/\/example-app\.test\/register/,
		);
	});

	it('omitted-env path is a static process.env.NEXT_PUBLIC_REGISTER_ORIGIN member', () => {
		const src = read('app/business/preview/previewClient.js');
		const fn = src.slice(
			src.indexOf('function getRegisterOrigin'),
			src.indexOf('function getRegisterUrl'),
		);
		assert.match(fn, /process\.env\.NEXT_PUBLIC_REGISTER_ORIGIN/);
		assert.doesNotMatch(fn, /src\.NEXT_PUBLIC_REGISTER_ORIGIN/);
		const omitted = fn.replace(/^[\s\S]*\?[\s\S]*?:\s*/, '');
		assert.match(omitted, /process\.env\.NEXT_PUBLIC_REGISTER_ORIGIN/);
		assert.doesNotMatch(omitted, /(?<!process\.)env\.NEXT_PUBLIC_REGISTER_ORIGIN/);
	});

	it('register URL includes ?preview= when a slug exists', () => {
		const url = client.buildRegisterUrl({ lang: 'es', previewSlug: 'taco-shop' });
		assert.match(url, /[?&]preview=taco-shop/);
		assert.match(url, /[?&]lg=es/);
	});

	it('fetch failure is the down-state; register still works', async () => {
		const result = await client.submitPreview({ website: 'https://x.com' }, async () => {
			throw new Error('network');
		});
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
		const result = await client.viewPreview('slug-1', fakeFetch);
		assert.equal(result.kind, 'building');
		assert.equal(calls.length, 1);
		assert.equal(calls[0].method, 'GET');
		assert.equal(calls[0].url, '/plan/preview/slug-1');
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

	it('polls GET about every 1s while wait — no 2/4/8/10 backoff', () => {
		assert.equal(wait.WAIT_LEAVE_MS, 30_000);
		assert.equal(wait.WAIT_LONG_MS, 150_000);
		assert.equal(wait.WAIT_POLL_MS, 1000);
		assert.equal(wait.nextPollDelayMs(0), 1000);
		assert.equal(wait.nextPollDelayMs(1), 1000);
		assert.equal(wait.nextPollDelayMs(2), 1000);
		assert.equal(wait.nextPollDelayMs(3), 1000);
		assert.equal(wait.nextPollDelayMs(9), 1000);
		for (const n of [0, 1, 2, 3, 9]) {
			const ms = wait.nextPollDelayMs(n);
			assert.ok(ms >= 800 && ms <= 1200, 'wait poll is ~1s, got ' + ms);
			assert.notEqual(ms, 2000);
			assert.notEqual(ms, 4000);
			assert.notEqual(ms, 8000);
			assert.notEqual(ms, 10000);
		}
	});

	it('ready GET goes to the ready card — does not type beats off the ready body', () => {
		const src = read('app/business/components/PreviewMagnet.tsx');
		const pollFn = src.slice(src.indexOf('const poll ='), src.indexOf('const beginWait'));
		const readyIdx = pollFn.indexOf("result.kind === 'ready'");
		const failedIdx = pollFn.indexOf("result.kind === 'failed'");
		assert.ok(readyIdx >= 0 && failedIdx > readyIdx, 'ready arm in poll');
		const readyArm = pollFn.slice(readyIdx, failedIdx);
		assert.match(readyArm, /onReady\(/);
		assert.doesNotMatch(readyArm, /waitBeatsFromBody/);
		assert.doesNotMatch(readyArm, /typedText/);
		assert.doesNotMatch(readyArm, /setWaitBeats/);
		assert.doesNotMatch(src, /waitBeatsFromReady/);
		assert.doesNotMatch(src, /beatsFromBrand/);
		assert.doesNotMatch(src, /typeFromReady/);
		const buildingArm = pollFn.slice(pollFn.indexOf("result.kind === 'building'"));
		assert.match(buildingArm, /waitBeatsFromBody/);
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
		'app/business/preview/previewReveal.js',
		'app/business/preview/gettingToKnowYou.js',
		'app/business/components/PreviewMagnet.tsx',
		'app/business/components/GettingToKnowYou.tsx',
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
		assert.match(env, /NEXT_PUBLIC_REGISTER_ORIGIN=/);
		assert.match(env, /PLAN_API_ORIGIN/);
		assert.doesNotMatch(env, /staging\.ai/);
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
		assert.match(src, /buildRegisterUrl\(/);
		assert.doesNotMatch(src, /employer-beta/);
		assert.doesNotMatch(src, /href="#journey"/);
		assert.match(src, /PreviewMagnet/);
		const url = client.buildRegisterUrl({ lang: 'en' });
		assert.match(url, /^https:\/\/business\.moilapp\.com\/register/);
		assert.doesNotMatch(url, /preview=/);
	});

	it('client magnet uses relative /plan/preview and env-gated register', () => {
		const gated = [
			'app/business/preview/previewClient.js',
			'app/business/components/PreviewMagnet.tsx',
			'app/business/sections/HeroSection.tsx',
			'app/business/components/BusinessNav.tsx',
			'app/business/components/BusinessMobileMenu.tsx',
			'app/business/components/BusinessFooter.tsx',
			'app/business/components/BusinessPricingSection.tsx',
			'next.config.js',
			'.env.example',
		];
		for (const f of gated) {
			const src = read(f);
			assert.doesNotMatch(src, /employer-beta/, f);
			assert.doesNotMatch(src, /staging\.ai/, f);
			assert.doesNotMatch(src, /stagebeta\.moilapp\.com/, f);
			if (f !== 'next.config.js' && f !== '.env.example') {
				assert.doesNotMatch(src, /ai\.moilapp\.com/, f);
			}
		}
		const clientSrc = read('app/business/preview/previewClient.js');
		assert.match(clientSrc, /['"]\/plan\/preview['"]/);
		assert.doesNotMatch(clientSrc, /process\.env\.NEXT_PUBLIC_PLAN_API_ORIGIN/);
		assert.doesNotMatch(clientSrc, /src\.NEXT_PUBLIC_PLAN_API_ORIGIN/);
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /getPlanApiOrigin/);
		assert.doesNotMatch(magnet, /isPlanApiConfigured/);
		assert.doesNotMatch(magnet, /NEXT_PUBLIC_PLAN_API_ORIGIN/);
		const cfg = read('next.config.js');
		assert.match(cfg, /getRegisterUrl\(/);
		assert.match(cfg, /getLoginUrl\(/);
		assert.doesNotMatch(cfg, /destination: 'https:\/\/business\.moilapp\.com\/register'/);
		assert.doesNotMatch(cfg, /destination: 'https:\/\/business\.moilapp\.com\/login'/);
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

	it('Places stays hidden and the rewrite is not a model route', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /doorBtn\('place'/);
		assert.doesNotMatch(magnet, /react-google-autocomplete/);
		assert.doesNotMatch(magnet, /GOOGLE_API_KEY_2/);
		const cfg = read('next.config.js');
		assert.match(cfg, /source: "\/plan\/preview"/);
		assert.doesNotMatch(cfg, /gemini/i);
		assert.doesNotMatch(cfg, /generative/i);
	});
});

describe('tagline sanitizer', () => {
	it('omits interstitial and bot-check copy, including Taste On Main', () => {
		assert.equal(reveal.sanitizeTagline('Verifying your access.'), '');
		assert.equal(reveal.sanitizeTagline('Verifying your access'), '');
		assert.equal(reveal.sanitizeTagline('Just a moment…'), '');
		assert.equal(reveal.sanitizeTagline('Checking your browser'), '');
		assert.equal(reveal.sanitizeTagline('Attention Required'), '');
		assert.equal(reveal.sanitizeTagline('Enable JavaScript to continue'), '');
		assert.equal(reveal.sanitizeTagline('Cloudflare'), '');
		assert.equal(reveal.sanitizeTagline('DDoS protection by Cloudflare'), '');
		assert.equal(reveal.sanitizeTagline('Please wait'), '');
		assert.equal(reveal.sanitizeTagline('Performing security verification'), '');
		assert.equal(reveal.sanitizeTagline('performing security verification'), '');
		assert.equal(reveal.sanitizeTagline('(needs review)'), '');
		assert.equal(reveal.sanitizeTagline('Needs review'), '');
	});

	it('omits our SEO junk, empty/whitespace, and a single raw URL', () => {
		assert.equal(reveal.sanitizeTagline('AI Marketing for Small Business'), '');
		assert.equal(reveal.sanitizeTagline('AI co-founder'), '');
		assert.equal(reveal.sanitizeTagline('Moil360'), '');
		assert.equal(reveal.sanitizeTagline('Stop Wearing Every Hat'), '');
		assert.equal(reveal.sanitizeTagline("You're the marketing team"), '');
		assert.equal(reveal.sanitizeTagline('  '), '');
		assert.equal(reveal.sanitizeTagline(''), '');
		assert.equal(reveal.sanitizeTagline('https://tasteonmain.com'), '');
		assert.equal(reveal.sanitizeTagline('www.tasteonmain.com'), '');
	});

	it('keeps a real shop descriptor', () => {
		assert.equal(reveal.sanitizeTagline('Scratch cooking on Main Street'), 'Scratch cooking on Main Street');
	});
});

describe('website-only door — no handle generate', () => {
	it('does not render the Social handle chip or Places chip', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /doorBtn\('handle'/);
		assert.doesNotMatch(magnet, /m\.doorHandle/);
		assert.doesNotMatch(magnet, /name="handle"/);
		assert.doesNotMatch(magnet, /doorBtn\('place'/);
		assert.doesNotMatch(magnet, /PLATFORMS\.map/);
	});

	it('a social URL in the website field stops; it does not start a handle generate', () => {
		const urls = [
			'https://instagram.com/tasteonmain',
			'https://www.facebook.com/tasteonmain',
			'https://tiktok.com/@tasteonmain',
			'https://www.linkedin.com/company/tasteonmain',
		];
		for (const url of urls) {
			const readResult = input.readWebsite(url);
			const decision = reveal.websiteFieldDecision(readResult);
			assert.equal(decision.kind, 'refuse_social', url);
			assert.notEqual(decision.kind, 'submit', url);
		}

		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.match(magnet, /websiteFieldDecision/);
		assert.match(magnet, /socialLinkRefuse/);
		assert.doesNotMatch(magnet, /setDoor\('handle'\)/);
		assert.doesNotMatch(magnet, /handleSubmitBody/);
		assert.doesNotMatch(magnet, /readHandle\(/);
		assert.doesNotMatch(magnet, /movedToHandle/);
		assert.doesNotMatch(magnet, /placeSubmitBody/);
		const onSubmit = magnet.slice(magnet.indexOf('const onSubmit'), magnet.indexOf('const reset'));
		assert.ok(
			onSubmit.indexOf('refuse_social') > 0 &&
				onSubmit.indexOf('refuse_social') < onSubmit.indexOf('submitPreview'),
			'social refuse must stop before any generate / submit',
		);
	});

	it('does not show the handle honest-miss copy', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		const en = read('src/common/translations/en.ts');
		const es = read('src/common/translations/es.ts');
		assert.doesNotMatch(magnet, /handleNoName/);
		assert.equal(magnet.includes(HONEST_MISS), false);
		assert.equal(en.includes(HONEST_MISS), false);
		assert.doesNotMatch(es, /todavía no tenemos el nombre del negocio/);
	});
});

describe('ready card v1 locks', () => {
	it('empty brand name does not ready-card, and never titles as Your business', () => {
		assert.equal(reveal.canShowReadyCard({ name: '' }), false);
		assert.equal(reveal.canShowReadyCard({ name: '   ' }), false);
		assert.equal(reveal.canShowReadyCard({ name: 'Taste On Main' }), true);
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /unnamedBrand/);
		assert.doesNotMatch(magnet, /Your business/);
		assert.match(magnet, /canShowReadyCard/);
	});

	it('promise list strings are gone from the card and magnet i18n', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		const en = read('src/common/translations/en.ts');
		const es = read('src/common/translations/es.ts');
		const enMagnet = en.slice(en.indexOf('magnet: {'), en.indexOf('aeoAnswer:'));
		const esMagnet = es.slice(es.indexOf('magnet: {'), es.indexOf('aeoAnswer:'));
		for (const phrase of KILLED_PROMISE_EN) {
			assert.equal(magnet.includes(phrase), false, phrase);
			assert.equal(enMagnet.includes(phrase), false, phrase);
		}
		for (const phrase of KILLED_PROMISE_ES) {
			assert.equal(magnet.includes(phrase), false, phrase);
			assert.equal(esMagnet.includes(phrase), false, phrase);
		}
		assert.doesNotMatch(magnet, /nextItems/);
		assert.doesNotMatch(magnet, /readSummary/);
		assert.doesNotMatch(magnet, /brandOnly/);
		assert.doesNotMatch(enMagnet, /nextItems/);
		assert.doesNotMatch(esMagnet, /nextItems/);
	});

	it('hex is used for swatch colour only — not rendered as text', () => {
		const src = read('app/business/components/GettingToKnowYou.tsx');
		assert.match(src, /style=\{\{ background: hex\(c\) \}\}/);
		assert.doesNotMatch(src, />\{hex\(c\)\}</);
		assert.doesNotMatch(src, /font-mono[^>]*>\{hex/);
	});

	it('no email field on ready or wait', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /type="email"/);
		assert.doesNotMatch(magnet, /waitEmailLabel/);
		assert.doesNotMatch(magnet, /emailLabel/);
		assert.doesNotMatch(magnet, /sendOptionalEmail/);
		const waitStart = magnet.indexOf("{phase === 'wait'");
		const waitEnd = magnet.indexOf('{showReadyCard && ready');
		assert.ok(waitStart > 0 && waitEnd > waitStart, 'wait block not found');
		const waitBlock = magnet.slice(waitStart, waitEnd);
		assert.doesNotMatch(waitBlock, /email/i);
		const gtk = read('app/business/components/GettingToKnowYou.tsx');
		assert.doesNotMatch(gtk, /type="email"/);
	});

	it('does not claim visitor mail or ship a confirm helper', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		const revealSrc = read('app/business/preview/previewReveal.js');
		const enMagnet = read('src/common/translations/en.ts').slice(
			read('src/common/translations/en.ts').indexOf('magnet: {'),
			read('src/common/translations/en.ts').indexOf('aeoAnswer:'),
		);
		for (const src of [magnet, revealSrc, enMagnet]) {
			assert.doesNotMatch(src, /We'll send this preview to that address/i);
			assert.doesNotMatch(src, /we will send this preview/i);
			assert.doesNotMatch(src, /confirm helper/i);
			assert.doesNotMatch(src, /honest-optional/i);
			assert.doesNotMatch(src, /abandon notify/i);
		}
		assert.equal(fs.existsSync(path.join(root, 'app/business/preview/previewConfirm.js')), false);
		assert.equal(fs.existsSync(path.join(root, 'app/business/preview/confirmEmail.js')), false);
	});
});

describe('frozen GET contract on the ready card', () => {
	const magnet = () => read('app/business/components/PreviewMagnet.tsx');

	it('readThin is gone from ready JSX and magnet i18n', () => {
		const src = magnet();
		const enMagnet = read('src/common/translations/en.ts').slice(
			read('src/common/translations/en.ts').indexOf('magnet: {'),
			read('src/common/translations/en.ts').indexOf('aeoAnswer:'),
		);
		const esMagnet = read('src/common/translations/es.ts').slice(
			read('src/common/translations/es.ts').indexOf('magnet: {'),
			read('src/common/translations/es.ts').indexOf('aeoAnswer:'),
		);
		assert.doesNotMatch(src, /readThin/);
		assert.doesNotMatch(src, /That is all a customer can see from the outside/);
		assert.doesNotMatch(enMagnet, /readThin/);
		assert.doesNotMatch(esMagnet, /readThin/);
		assert.doesNotMatch(enMagnet, /That is all a customer can see from the outside/);
		assert.doesNotMatch(esMagnet, /Eso es todo lo que un cliente puede ver desde afuera/);
	});

	it('products helper still omits empty; the magnet paints via Getting To Know You', () => {
		assert.deepEqual(reveal.shopProducts({ products: ['Tacos', ' Horchata '] }), ['Tacos', 'Horchata']);
		assert.deepEqual(reveal.shopProducts({ products: [] }), []);
		assert.deepEqual(reveal.shopProducts({}), []);
		assert.deepEqual(reveal.shopProducts(null), []);
		const src = magnet();
		assert.doesNotMatch(src, /shopProducts\(/);
		assert.match(src, /GettingToKnowYou/);
	});

	it('positioning fields render when present and omit the block when absent', () => {
		const empty = reveal.readPositioning({ brand: { name: 'Moil' } });
		assert.equal(empty.present, false);
		assert.equal(empty.audience, '');
		assert.deepEqual(empty.voice, []);

		const fromObject = reveal.readPositioning({
			brand: { name: 'Moil' },
			positioning: {
				audience: 'Trades',
				voice: ['Direct', 'Friendly'],
				problem: 'Too many hats',
				keyTerms: ['co-founder'],
				cadence: 'Four posts a week',
			},
		});
		assert.equal(fromObject.present, true);
		assert.equal(fromObject.audience, 'Trades');
		assert.deepEqual(fromObject.voice, ['Direct', 'Friendly']);
		assert.equal(fromObject.problem, 'Too many hats');
		assert.deepEqual(fromObject.keyTerms, ['co-founder']);
		assert.equal(fromObject.cadence, 'Four posts a week');

		const folded = reveal.readPositioning({
			brand: { name: 'Moil', audience: 'Owners', voice: 'Calm and direct' },
		});
		assert.equal(folded.present, true);
		assert.equal(folded.audience, 'Owners');
		assert.deepEqual(folded.voice, ['Calm and direct']);

		const src = magnet();
		assert.doesNotMatch(src, /readPositioning\(/);
		assert.doesNotMatch(src, /m\.posCadence/);
		assert.doesNotMatch(src, /m\.posAudience/);
	});

	it('GET lockstep: flat strings and {value} / creative.imageUrl both paint', () => {
		const fact = (value) => ({ value, factClass: 'extracted', source: 'site' });

		const wrapped = reveal.readPositioning({
			brand: { name: 'Moil' },
			positioning: {
				audience: fact('Trades'),
				voice: [fact('Direct'), fact('Friendly')],
				problem: fact('Too many hats'),
				keyTerms: [fact('co-founder')],
				cadence: fact('Four posts a week'),
			},
		});
		assert.equal(wrapped.present, true);
		assert.equal(wrapped.audience, 'Trades');
		assert.deepEqual(wrapped.voice, ['Direct', 'Friendly']);
		assert.equal(wrapped.problem, 'Too many hats');
		assert.deepEqual(wrapped.keyTerms, ['co-founder']);
		assert.equal(wrapped.cadence, 'Four posts a week');

		const emptyWrapped = reveal.readPositioning({
			brand: { name: 'Moil' },
			positioning: {
				audience: fact(''),
				voice: fact(''),
				problem: fact(''),
				keyTerms: [],
				cadence: fact(''),
			},
		});
		assert.equal(emptyWrapped.present, false);

		const foldedWrapped = reveal.readPositioning({
			brand: {
				name: 'Moil',
				audience: fact('Owners'),
				voice: [fact('Calm')],
			},
		});
		assert.equal(foldedWrapped.present, true);
		assert.equal(foldedWrapped.audience, 'Owners');
		assert.deepEqual(foldedWrapped.voice, ['Calm']);

		assert.equal(
			reveal.creativeUrlFromPost({
				caption: 'Tuesday special.',
				imageUrl: 'https://cdn.example/flat.jpg',
			}),
			'https://cdn.example/flat.jpg',
		);
		assert.equal(
			reveal.creativeUrlFromPost({
				caption: 'Tuesday special.',
				creative: { imageUrl: 'https://cdn.example/nested.jpg' },
			}),
			'https://cdn.example/nested.jpg',
		);
		assert.equal(
			reveal.creativeUrlFromPost({
				caption: 'Tuesday special.',
				creative: { imageUrl: 'http://cdn.example/insecure.jpg' },
			}),
			'http://cdn.example/insecure.jpg',
		);
		assert.equal(
			reveal.creativeUrlFromPost({
				caption: 'Tuesday special.',
				creative: {
					imageUrl:
						'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=',
				},
			}),
			'',
			'data:svg is not a real creative',
		);
		assert.equal(
			reveal.creativeUrlFromPost({
				caption: 'Tuesday special.',
				imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>',
			}),
			'',
		);

		const dataPost = reveal.realPosts({
			kind: 'posts',
			posts: [
				{
					caption: 'Tuesday special.',
					creative: { imageUrl: 'data:image/svg+xml;utf8,<svg></svg>' },
				},
			],
		});
		assert.equal(dataPost.length, 1);
		assert.equal(dataPost[0].caption, 'Tuesday special.');
		assert.equal(dataPost[0].imageUrl, '');
	});

	it('post cards keep non-URL captions and skip website-URL captions', () => {
		const brand = { website: 'https://www.moilapp.com', handle: '@moilapp' };
		const kept = reveal.realPosts(
			{
				kind: 'posts',
				posts: [
					{ caption: 'Tuesday on Main Street.', imageUrl: 'https://cdn.example/p.jpg' },
					{ caption: 'https://www.moilapp.com' },
					{ caption: 'www.moilapp.com' },
					{ caption: '@moilapp' },
					{ caption: 'moilapp.com' },
					{ caption: 'Scratch cooking tonight.', creativeUrl: 'https://cdn.example/q.jpg' },
					{ caption: 'A third real line.', image: 'https://cdn.example/r.jpg' },
					{ caption: 'A fourth that must not paint.' },
				],
			},
			brand,
		);
		assert.equal(kept.length, 3);
		assert.equal(kept[0].caption, 'Tuesday on Main Street.');
		assert.equal(kept[0].imageUrl, 'https://cdn.example/p.jpg');
		assert.equal(kept[1].caption, 'Scratch cooking tonight.');
		assert.equal(kept[1].imageUrl, 'https://cdn.example/q.jpg');
		assert.equal(kept[2].imageUrl, 'https://cdn.example/r.jpg');

		const allUrls = reveal.realPosts(
			{
				kind: 'posts',
				posts: [
					{ caption: 'https://tasteonmain.com', imageUrl: 'https://cdn.example/x.jpg' },
					{ caption: 'www.tasteonmain.com' },
					{ caption: 'tasteonmain.com' },
				],
			},
			{ website: 'https://tasteonmain.com' },
		);
		assert.deepEqual(allUrls, []);

		const none = reveal.realPosts({ kind: 'brand-only', posts: [] }, brand);
		assert.deepEqual(none, []);

		const ruiz = {
			website: 'https://ruizsalon.com',
			tagline: 'Performing security verification',
		};
		assert.equal(reveal.shopDescriptor(ruiz), '');
		assert.deepEqual(
			reveal.realPosts(
				{
					kind: 'posts',
					posts: [
						{ caption: 'ruizsalon.com — Performing security verification' },
						{ caption: 'https://ruizsalon.com' },
						{ caption: '(needs review)' },
					],
				},
				ruiz,
			),
			[],
			'Ruiz GET fact-echo captions must paint zero post cards',
		);

		const src = magnet();
		assert.doesNotMatch(src, /realPosts\(/);
		assert.doesNotMatch(src, /<article/);
		assert.doesNotMatch(src, /I'm learning/);
		assert.doesNotMatch(src, /Reveal My First Posts/);
		assert.match(read('app/business/components/GettingToKnowYou.tsx'), /platformDecideForMe/);
		assert.match(read('src/common/translations/en.ts'), /Decide For Me/);
	});

	it('CTA still uses buildRegisterUrl with the preview slug', () => {
		const src = magnet();
		const at = src.indexOf('const signupHref = useMemo(');
		assert.ok(at > -1, 'signupHref was renamed');
		const block = src.slice(at, at + 500);
		assert.match(block, /buildRegisterUrl\(/);
		assert.match(block, /previewSlug: slug/);
		assert.match(block, /platforms,/);
		assert.match(read('app/business/components/GettingToKnowYou.tsx'), /\{m\.startFree\}/);
		assert.doesNotMatch(src, /colorsLabel/);
		const url = client.buildRegisterUrl({ lang: 'en', previewSlug: 'taco-shop' });
		assert.match(url, /[?&]preview=taco-shop/);
		assert.match(url, /[?&]lg=en/);
		const gated = client.buildRegisterUrl({
			lang: 'en',
			previewSlug: 'ruiz-salon',
			env: { NEXT_PUBLIC_REGISTER_ORIGIN: 'https://example-app.test' },
		});
		assert.match(gated, /^https:\/\/example-app\.test\/register/);
		assert.match(gated, /[?&]preview=ruiz-salon/);
		assert.match(gated, /[?&]lg=en/);
		assert.doesNotMatch(src, /employer-beta/);
	});

	it('wait copy is a real scrape, not Munch theatre, and binds progress if GET sends it', () => {
		const enMagnet = read('src/common/translations/en.ts').slice(
			read('src/common/translations/en.ts').indexOf('magnet: {'),
			read('src/common/translations/en.ts').indexOf('aeoAnswer:'),
		);
		assert.doesNotMatch(enMagnet, /I'm learning/);
		assert.doesNotMatch(enMagnet, /what you do/);
		assert.doesNotMatch(enMagnet, /look and feel/);
		assert.match(enMagnet, /Reading your website/);
		assert.equal(reveal.progressFromBody({ status: 'building' }), '');
		assert.equal(reveal.progressFromBody({ progress: 'Pulling colours from the homepage.' }), 'Pulling colours from the homepage.');
		const src = magnet();
		assert.match(src, /progressFromBody/);
		assert.match(src, /waitBeatsFromBody/);
		assert.match(src, /typedText\(/);
		assert.match(src, /waitProgress \|\| waitText/);
		assert.doesNotMatch(src, /waitStepsFromBody/);
		assert.doesNotMatch(src, /waitStepScrapeStarted/);
		assert.doesNotMatch(src, /scrape_started/);
	});
});
