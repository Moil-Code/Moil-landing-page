#!/usr/bin/env node
'use strict';

/**
 * Getting To Know You — wzP6PJqiVxqG-shaped paint + Decide For Me.
 * node --test evals/gettingToKnowYou.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const gtk = require('../app/business/preview/gettingToKnowYou');
const reveal = require('../app/business/preview/previewReveal');
const fixture = require('./fixtures/wzP6PJqiVxqG');

const MAGNET_NEW_KEYS = [
	'knowingTitle',
	'headingName',
	'headingOverview',
	'headingAudience',
	'headingProducts',
	'headingServices',
	'headingProblem',
	'headingMessaging',
	'headingCtas',
	'headingSlogans',
	'headingVoice',
	'headingLogo',
	'headingColors',
	'headingPhotos',
	'headingSchedule',
	'platformDecideForMe',
	'platformsOr',
	'editLabel',
	'doneLabel',
	'waitBeatFraming',
	'waitBeatAudience',
	'waitBeatServices',
	'waitBeatProblem',
	'waitBeatUvp',
];

function magnetKeys(file) {
	const src = read(file);
	const start = src.indexOf('magnet: {');
	const end = src.indexOf('aeoAnswer:', start);
	assert.ok(start > 0 && end > start, file + ' magnet block not found');
	return new Set([...src.slice(start, end).matchAll(/^\s{8}(\w+):/gm)].map((m) => m[1]));
}

describe('wzP6PJqiVxqG paint — filled in, empty/banned out', () => {
	const sections = gtk.profileSections(fixture, { selected: [] });
	const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

	it('paints name, overview, products, services, messaging, ctas, slogans, voice, logo, colors, photos, schedule', () => {
		assert.deepEqual(
			sections.map((s) => s.id),
			[
				'name',
				'overview',
				'products',
				'services',
				'messaging',
				'ctas',
				'slogans',
				'voice',
				'logo',
				'colors',
				'photos',
				'schedule',
			],
		);
	});

	it('name is Moil and overview is the GET overview (one heading, not tagline)', () => {
		assert.equal(byId.name.value, 'Moil');
		assert.equal(byId.overview.value, fixture.brand.overview);
		assert.equal(gtk.overviewFromBrand(fixture.brand), fixture.brand.overview);
		assert.equal(fixture.brand.overview, fixture.brand.description);
	});

	it('products and services paint observe-only from the GET', () => {
		assert.deepEqual(byId.products.value, [
			'business plan generation',
			'document creation',
			'hiring',
			'customer communication',
		]);
		assert.equal(byId.products.observeOnly, true);
		assert.equal(byId.services.value, fixture.brand.services);
		assert.equal(byId.services.observeOnly, true);
	});

	it('messaging, ctas, slogans, logo, colors, photos match the GET', () => {
		assert.equal(byId.messaging.value, "You shouldn't have to be everything on top of the real job.");
		assert.deepEqual(byId.ctas.value, fixture.brand.ctas);
		assert.deepEqual(byId.slogans.value, fixture.brand.slogans);
		assert.equal(byId.logo.value, 'https://www.moilapp.com/moil-512.png');
		assert.deepEqual(byId.colors.value, ['#5843be', '#ff6633', '#9b8ed8', '#161c2b']);
		assert.deepEqual(byId.photos.value, [
			'https://www.moilapp.com/og-business.jpg',
			'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png',
		]);
	});

	it('voice chips are the capture; positioning.voice sentence is secondary', () => {
		assert.deepEqual(byId.voice.chips, fixture.brand.voiceChips);
		assert.equal(byId.voice.sentence, 'Direct. Practical. Empowering.');
	});

	it('omits empty audience and problem; still omits keyTerms, language, tagline, cadence, posts', () => {
		const ids = new Set(sections.map((s) => s.id));
		for (const banned of gtk.BANNED_HEADING_IDS) {
			assert.equal(ids.has(banned), false, banned);
		}
		assert.equal(ids.has('audience'), false);
		assert.equal(ids.has('problem'), false);
		assert.equal(fixture.positioning.audience, '');
		assert.equal(fixture.positioning.problem, '');
		assert.equal(fixture.positioning.keyTerms, '');
		assert.equal(fixture.brand.language, '');
		assert.match(fixture.brand.tagline, /AI co-founder/);
		assert.equal(fixture.positioning.cadence, 'A few times a week');
		assert.ok(fixture.content.posts.length > 0, 'fixture must keep posts so omission is a choice');
	});

	it('Posting Schedule is the picked platforms, never cadence prose', () => {
		assert.deepEqual(byId.schedule.value, ['instagram', 'facebook']);
		assert.doesNotMatch(JSON.stringify(byId.schedule), /A few times a week/);
		const chosen = gtk.profileSections(fixture, { selected: ['instagram'] });
		const schedule = chosen.find((s) => s.id === 'schedule');
		assert.deepEqual(schedule.value, ['instagram']);
	});

	it('photos skip data: URLs', () => {
		const withData = {
			...fixture,
			brand: {
				...fixture.brand,
				photos: [
					...fixture.brand.photos,
					'data:image/png;base64,aaaa',
					'not-a-url',
				],
			},
		};
		assert.deepEqual(gtk.httpsPhotos(withData.brand), [
			'https://www.moilapp.com/og-business.jpg',
			'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png',
		]);
	});

	it('empty fields omit their heading; nameless still refuses ready', () => {
		const empty = gtk.profileSections({ brand: { name: 'Shop' } }, { selected: [] });
		assert.deepEqual(
			empty.map((s) => s.id),
			['name', 'schedule'],
		);
		assert.equal(reveal.canShowReadyCard({ name: '' }), false);
		assert.equal(reveal.canShowReadyCard({ name: 'Moil' }), true);
	});
});

describe('audience and problem paint when GET has them', () => {
	it('paints positioning.audience and positioning.problem in capture order', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Taste On Main',
					overview: 'Scratch cooking on Main Street.',
					services: 'Dinner and catering.',
				},
				positioning: {
					audience: 'Locals who want weeknight dinner.',
					problem: 'Nowhere nearby that feels like home.',
				},
			},
			{ selected: [] },
		);
		assert.deepEqual(
			sections.map((s) => s.id),
			['name', 'overview', 'audience', 'services', 'problem', 'schedule'],
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.audience.value, 'Locals who want weeknight dinner.');
		assert.equal(byId.problem.value, 'Nowhere nearby that feels like home.');
		assert.equal(gtk.headingKeyFor('audience'), 'headingAudience');
		assert.equal(gtk.headingKeyFor('problem'), 'headingProblem');
		assert.ok(gtk.SECTION_ORDER.indexOf('audience') > gtk.SECTION_ORDER.indexOf('overview'));
		assert.ok(gtk.SECTION_ORDER.indexOf('audience') < gtk.SECTION_ORDER.indexOf('services'));
		assert.ok(gtk.SECTION_ORDER.indexOf('problem') > gtk.SECTION_ORDER.indexOf('services'));
	});

	it('admits brand-level audience and problem when positioning is empty', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Shop',
					audience: 'Owners.',
					problem: 'Too many hats.',
				},
				positioning: {
					audience: '',
					problem: '',
				},
			},
			{ selected: [] },
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.audience.value, 'Owners.');
		assert.equal(byId.problem.value, 'Too many hats.');
	});

	it('prefers positioning over brand when both are present', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Shop',
					audience: 'Brand-level audience.',
					problem: 'Brand-level problem.',
				},
				positioning: {
					audience: 'Positioning audience.',
					problem: 'Positioning problem.',
				},
			},
			{ selected: [] },
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.audience.value, 'Positioning audience.');
		assert.equal(byId.problem.value, 'Positioning problem.');
	});

	it('unwraps { value } facts and joins arrays; omits whitespace-only', () => {
		const wrapped = gtk.profileSections(
			{
				brand: { name: 'Shop' },
				positioning: {
					audience: { value: 'Trades', factClass: 'extracted', source: 'site' },
					problem: [{ value: 'Too many hats.' }, { value: 'No time to post.' }],
				},
			},
			{ selected: [] },
		);
		const byId = Object.fromEntries(wrapped.map((s) => [s.id, s]));
		assert.equal(byId.audience.value, 'Trades');
		assert.equal(byId.problem.value, 'Too many hats. No time to post.');

		const empty = gtk.profileSections(
			{
				brand: { name: 'Shop', audience: '   ', problem: { value: '' } },
				positioning: { audience: '', problem: '  ' },
			},
			{ selected: [] },
		);
		const ids = empty.map((s) => s.id);
		assert.equal(ids.includes('audience'), false);
		assert.equal(ids.includes('problem'), false);
	});

	it('does not unban keyTerms, language, tagline, cadence, narrationPov, uvp, trustSignals, posts', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Shop',
					language: 'en',
					tagline: 'The AI co-founder for small business owners.',
					keyTerms: ['co-founder'],
					narrationPov: 'We',
					uvp: 'We do the work.',
					trustSignals: ['Five stars'],
					competitors: ['A rival'],
					market: 'Local dinner',
				},
				positioning: {
					audience: 'Locals.',
					problem: 'Nowhere nearby.',
					keyTerms: ['weeknight'],
					cadence: 'A few times a week',
					narrationPov: 'We',
					uvp: 'Home cooking.',
					trustSignals: ['Since 2019'],
				},
				content: {
					kind: 'posts',
					posts: [{ caption: 'Tuesday special.' }],
				},
			},
			{ selected: [] },
		);
		const ids = sections.map((s) => s.id);
		assert.ok(ids.includes('audience'));
		assert.ok(ids.includes('problem'));
		for (const banned of gtk.BANNED_HEADING_IDS) {
			assert.equal(ids.includes(banned), false, banned);
		}
		assert.equal(ids.includes('competitors'), false);
		assert.equal(ids.includes('market'), false);
		assert.deepEqual(
			gtk.BANNED_HEADING_IDS,
			[
				'keyTerms',
				'language',
				'tagline',
				'cadence',
				'narrationPov',
				'uvp',
				'trustSignals',
				'posts',
			],
		);
		const helperBody = read('app/business/preview/gettingToKnowYou.js')
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/^\s*\/\/.*$/gm, '');
		assert.doesNotMatch(helperBody, /content\.posts/);
	});
});

describe('wait beats — admit progress array, never scrape theatre', () => {
	it('empty / missing progress → honest wait, not invented beats', () => {
		assert.deepEqual(gtk.waitBeatsFromBody({ status: 'building' }), []);
		assert.deepEqual(gtk.waitBeatsFromBody(null), []);
		assert.deepEqual(gtk.waitBeatsFromBody({ posts_composing: true }), []);
		assert.deepEqual(gtk.waitBeatsFromBody({ progress: [] }), []);
	});

	it('does not type wait beats off a ready GET body', () => {
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				status: 'ready',
				brand: {
					name: 'Taste On Main',
					description: 'Scratch cooking on Main Street',
					services: 'Dinner and catering.',
					messaging: 'Warm and local.',
				},
				positioning: {
					audience: 'Locals who want weeknight dinner.',
					problem: 'Nowhere nearby that feels like home.',
					voice: 'Warm',
				},
			}),
			[],
		);
		const helper = read('app/business/preview/gettingToKnowYou.js');
		assert.doesNotMatch(helper, /function\s+\w*(fromReady|readyBeats|typeFromReady)\w*/i);
		assert.match(helper, /admitProgress\(into, body\.progress\)/);
	});

	it('live contract: English GET headings fold in admitted order with their texts', () => {
		assert.equal(gtk.foldBeatHeading('What this business is'), 'framing');
		assert.equal(gtk.foldBeatHeading('Who it is for'), 'audience');
		assert.equal(gtk.foldBeatHeading('What it offers'), 'services');
		assert.equal(gtk.foldBeatHeading('The problem it solves'), 'problem');
		assert.equal(gtk.foldBeatHeading('Why it wins'), 'UVP');
		assert.equal(gtk.foldBeatHeading('  WHO   IT IS FOR  '), 'audience');
		assert.equal(gtk.foldBeatHeading('what this business is'), 'framing');

		const live = gtk.waitBeatsFromBody({
			status: 'building',
			progress: [
				{ heading: 'Why it wins', text: 'The co-founder on the work.' },
				{ heading: 'Who it is for', text: 'Small-business owners.' },
				{ heading: 'What this business is', text: 'Direct, practical, for owners.' },
				{ heading: 'The problem it solves', text: 'Owners should not have to be everything.' },
				{ heading: 'What it offers', text: 'Plans, documents, and a month of posts.' },
			],
		});
		assert.deepEqual(live, [
			{ heading: 'framing', text: 'Direct, practical, for owners.' },
			{ heading: 'audience', text: 'Small-business owners.' },
			{ heading: 'services', text: 'Plans, documents, and a month of posts.' },
			{ heading: 'problem', text: 'Owners should not have to be everything.' },
			{ heading: 'UVP', text: 'The co-founder on the work.' },
		]);
		assert.equal(gtk.typedText(live[0].text, 6), 'Direct');
		assert.equal(
			gtk.waitBeatsFromBody({
				progress: [
					{ heading: 'What this business is', text: 'Direct, practical, for owners.' },
					{ heading: 'Who it is for', text: 'Small-business owners.' },
				],
			}).map((b) => b.heading).join(','),
			'framing,audience',
		);
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				progress: [
					{ heading: 'What this business is', text: '' },
					{ heading: 'A heading we do not admit', text: 'No.' },
					{ heading: 'Who it is for', text: 'Owners.' },
				],
			}),
			[{ heading: 'audience', text: 'Owners.' }],
		);
		assert.equal(reveal.progressFromBody({ progress: 'What this business is' }), '');
	});

	it('binds admitted beats in framing → audience → services → problem → UVP order and types the text', () => {
		const two = gtk.waitBeatsFromBody({
			status: 'building',
			progress: [
				{ heading: 'framing', text: 'Direct, practical, for owners.' },
				{ heading: 'audience', text: 'Small-business owners.' },
			],
		});
		assert.deepEqual(
			two.map((b) => b.heading),
			['framing', 'audience'],
		);
		assert.equal(two[0].text, 'Direct, practical, for owners.');
		assert.equal(two[1].text, 'Small-business owners.');
		assert.equal(
			two.some((b) => b.heading === 'services' || b.heading === 'problem' || b.heading === 'UVP'),
			false,
			'later beats absent until present',
		);
		assert.equal(gtk.typedText(two[0].text, 0), '');
		assert.equal(gtk.typedText(two[0].text, 6), 'Direct');
		assert.equal(gtk.typedText(two[0].text, 99), two[0].text);
		assert.equal(gtk.typedText(two[0].text, 2, true), two[0].text);

		const later = gtk.waitBeatsFromBody({
			status: 'building',
			progress: [
				{ heading: 'UVP', text: 'The co-founder on the work.' },
				{ heading: 'audience', text: 'Small-business owners.' },
				{ heading: 'framing', text: 'Direct, practical, for owners.' },
				{ heading: 'problem', text: 'Owners should not have to be everything.' },
				{ heading: 'services', text: 'Plans, documents, and a month of posts.' },
			],
		});
		assert.deepEqual(
			later.map((b) => b.heading),
			['framing', 'audience', 'services', 'problem', 'UVP'],
		);
	});

	it('heading not in the admitted set is ignored; missing/empty text omits that beat', () => {
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				progress: [
					{ heading: 'trustSignals', text: 'Five stars.' },
					{ heading: 'framing', text: '' },
					{ heading: 'audience', text: '   ' },
					{ heading: 'services', text: 'Hiring and documents.' },
					{ heading: 'logo', text: 'A mark.' },
				],
			}),
			[{ heading: 'services', text: 'Hiring and documents.' }],
		);
		assert.equal(gtk.foldBeatHeading('messaging'), 'framing');
		assert.equal(gtk.foldBeatHeading('uvp'), 'UVP');
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				progress: [
					{ heading: 'messaging', text: 'How we talk.' },
					{ heading: 'uvp', text: 'We do the work.' },
				],
			}),
			[
				{ heading: 'framing', text: 'How we talk.' },
				{ heading: 'UVP', text: 'We do the work.' },
			],
		);
	});

	it('scrape_started / pages_read / tokens_ready never become wait UI', () => {
		assert.deepEqual(gtk.waitBeatsFromBody({ progress: 'scrape_started' }), []);
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				events: ['scrape_started', 'pages_read'],
				scrape_started: true,
				pages_read: true,
				tokens_ready: 1,
			}),
			[],
		);
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				progress: [
					{ heading: 'scrape_started', text: 'Started reading the site.' },
					{ heading: 'pages_read', text: 'Reading the pages.' },
					{ heading: 'tokens_ready', text: 'Finished reading.' },
				],
			}),
			[],
		);
		assert.equal(gtk.foldBeatHeading('scrape_started'), '');
		assert.equal(gtk.foldBeatHeading('pages_read'), '');
		assert.equal(gtk.foldBeatHeading('tokens_ready'), '');
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /waitStepScrapeStarted/);
		assert.doesNotMatch(magnet, /waitStepPagesRead/);
		assert.doesNotMatch(magnet, /waitStepTokensReady/);
		assert.doesNotMatch(magnet, /scrape_started/);
		assert.doesNotMatch(magnet, /pages_read/);
		assert.doesNotMatch(magnet, /tokens_ready/);
		assert.match(magnet, /waitBeatsFromBody/);
		assert.match(magnet, /typedText\(/);
		assert.match(magnet, /TYPEOUT_MS_PER_CHAR/);
	});

	it('never treats posts_composing as a wait beat or a progress string', () => {
		assert.deepEqual(
			gtk.waitBeatsFromBody({ events: ['posts_composing', 'scrape_started'] }),
			[],
		);
		assert.equal(reveal.progressFromBody({ progress: 'posts_composing' }), '');
		assert.equal(reveal.progressFromBody({ progress: 'scrape_started' }), '');
		assert.equal(reveal.progressFromBody({ progress: 'framing' }), '');
		assert.equal(
			reveal.progressFromBody({ progress: 'Pulling colours from the homepage.' }),
			'Pulling colours from the homepage.',
		);
		assert.equal(
			reveal.progressFromBody({
				progress: [
					{ heading: 'framing', text: 'Direct, practical, for owners.' },
				],
			}),
			'',
		);
	});
});

describe('the card does not paint posts or Munch theatre', () => {
	const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
	const magnet = read('app/business/components/PreviewMagnet.tsx');
	const helper = read('app/business/preview/gettingToKnowYou.js');

	it('Decide For Me is present; post cards are not', () => {
		assert.match(gtkSrc, /platformDecideForMe/);
		assert.match(gtkSrc, /chooseDecide\(/);
		assert.match(gtkSrc, /decideChip\(/);
		assert.doesNotMatch(gtkSrc, /realPosts\(/);
		assert.doesNotMatch(magnet, /realPosts\(/);
		assert.doesNotMatch(gtkSrc, /bg-gradient-to-br/);
		assert.doesNotMatch(gtkSrc, /<article/);
		assert.doesNotMatch(magnet, /<article/);
		const helperBody = helper.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		assert.doesNotMatch(helperBody, /content\.posts/);
	});

	it('does not invent Munch wait lines, Reveal My First Posts, or cadence-as-schedule copy', () => {
		const enMagnet = read('src/common/translations/en.ts').slice(
			read('src/common/translations/en.ts').indexOf('magnet: {'),
			read('src/common/translations/en.ts').indexOf('aeoAnswer:'),
		);
		const esMagnet = read('src/common/translations/es.ts').slice(
			read('src/common/translations/es.ts').indexOf('magnet: {'),
			read('src/common/translations/es.ts').indexOf('aeoAnswer:'),
		);
		for (const src of [gtkSrc, magnet, enMagnet, esMagnet]) {
			assert.doesNotMatch(src, /I'm learning/);
			assert.doesNotMatch(src, /what you do/);
			assert.doesNotMatch(src, /look and feel/);
			assert.doesNotMatch(src, /Reveal My First Posts/);
			assert.doesNotMatch(src, /millions of data points/i);
			assert.doesNotMatch(src, /Unique Value Proposition/i);
			assert.doesNotMatch(src, /A few times a week/);
		}
		assert.doesNotMatch(gtkSrc, /narrationPov/);
		assert.doesNotMatch(magnet, /narrationPov/);
	});

	it('wall is Start free via buildRegisterUrl; leftover-4 dest HOLD (no persist)', () => {
		assert.match(magnet, /buildRegisterUrl\(/);
		assert.match(magnet, /GettingToKnowYou/);
		assert.match(gtkSrc, /\{m\.startFree\}/);
		assert.match(gtkSrc, /leftover-4 dest HOLD/);
		assert.doesNotMatch(gtkSrc, /type="email"/);
		assert.doesNotMatch(magnet, /type="email"/);
		assert.doesNotMatch(gtkSrc, /fetch\(/);
		assert.doesNotMatch(helper, /fetch\(/);
	});

	it('does not add a second H1 or Official FREE', () => {
		assert.doesNotMatch(gtkSrc, /<h1[\s>]/);
		assert.doesNotMatch(magnet, /<h1[\s>]/);
		assert.doesNotMatch(gtkSrc, /Official FREE/);
		assert.doesNotMatch(magnet, /Official FREE/);
	});
});

describe('EN/ES magnet key parity for Getting To Know You', () => {
	it('new keys exist in both languages and are not English calques in ES', () => {
		const en = magnetKeys('src/common/translations/en.ts');
		const es = magnetKeys('src/common/translations/es.ts');
		for (const key of MAGNET_NEW_KEYS) {
			assert.ok(en.has(key), 'en missing ' + key);
			assert.ok(es.has(key), 'es missing ' + key);
		}
		const esSrc = read('src/common/translations/es.ts');
		const esMagnet = esSrc.slice(esSrc.indexOf('magnet: {'), esSrc.indexOf('aeoAnswer:'));
		assert.match(esMagnet, /Que elija Moil/);
		assert.match(esMagnet, /Así conocemos tu negocio/);
		assert.match(esMagnet, /Cómo se habla del negocio/);
		assert.match(esMagnet, /Dónde se publica/);
		assert.doesNotMatch(esMagnet, /Llegando a conocerte/);
		assert.doesNotMatch(esMagnet, /Decide por m[ií]/);
		assert.doesNotMatch(esMagnet, /Mensajer[ií]a y encuadre/i);
		assert.doesNotMatch(esMagnet, /Horario de publicaci[oó]n/);
		assert.doesNotMatch(esMagnet, /I'm learning/);
		assert.match(esMagnet, /Lo que te distingue/);
		assert.match(esMagnet, /A quién te diriges/);
		assert.match(esMagnet, /Qué problema resuelves/);
		assert.doesNotMatch(esMagnet, /What sets you apart/);
		assert.doesNotMatch(esMagnet, /Propuesta de valor/);
		assert.doesNotMatch(esMagnet, /Target Audience/);
		assert.doesNotMatch(esMagnet, /What problem do you solve/);
		assert.doesNotMatch(esMagnet, /Audiencia objetivo/);
		assert.doesNotMatch(esMagnet, /Reveal My First Posts/);
		assert.doesNotMatch(esMagnet, /Official FREE/);
	});
});
