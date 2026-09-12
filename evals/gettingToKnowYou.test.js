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
	'headingTagline',
	'headingLanguage',
	'headingTrust',
	'platformDecideForMe',
	'platformsOr',
	'readyEyebrow',
	'readyStatus',
	'sourceLabel',
	'identityLabel',
	'publishingEyebrow',
	'publishingHint',
	'availabilityLabel',
	'cadenceLabel',
	'actionTrust',
	'continueWithProfile',
	'editLabel',
	'doneLabel',
	'waitBeatFraming',
	'waitBeatAudience',
	'waitBeatServices',
	'waitBeatProblem',
	'waitBeatUvp',
];

function magnetBlock(file) {
	const src = read(file);
	const start = src.indexOf('magnet: {');
	const end = src.indexOf('aeoAnswer:', start);
	assert.ok(start > 0 && end > start, file + ' magnet block not found');
	return src.slice(start, end);
}

function magnetKeys(file) {
	return new Set([...magnetBlock(file).matchAll(/^\s{8}(\w+):/gm)].map((m) => m[1]));
}

function magnetQuoted(file, key) {
	const re = new RegExp(`^\\s{8}${key}:\\s*'((?:\\\\'|[^'])*)'`, 'm');
	const m = magnetBlock(file).match(re);
	assert.ok(m, file + ' missing quoted ' + key);
	return m[1].replace(/\\'/g, "'");
}

describe('wzP6PJqiVxqG paint — filled in, empty/banned out', () => {
	const sections = gtk.profileSections(fixture, { selected: [] });
	const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

	it('paints name, composed overview, lifted tagline/cadence, folded slogans, voice, proof, schedule — not a SECTION_ORDER chip dump', () => {
		assert.deepEqual(
			sections.map((s) => s.id),
			[
				'name',
				'framing',
				'tagline',
				'services',
				'cadence',
				'slogans',
				'voice',
				'proof',
				'schedule',
			],
		);
		assert.equal(idsHas('overview'), false);
		assert.equal(idsHas('products'), false);
		assert.equal(idsHas('messaging'), false);
		assert.equal(idsHas('logo'), false);
		assert.equal(idsHas('colors'), false);
		assert.equal(idsHas('photos'), false);
		assert.equal(idsHas('posts'), false);
		function idsHas(id) {
			return sections.some((s) => s.id === id);
		}
	});

	it('name is Moil and framing is the GET overview (the wait sentence, not a tag dump)', () => {
		assert.equal(byId.name.value, 'Moil');
		assert.equal(byId.framing.value, fixture.brand.overview);
		assert.equal(gtk.overviewFromBrand(fixture.brand), fixture.brand.overview);
		assert.equal(fixture.brand.overview, fixture.brand.description);
		assert.equal(byId.messaging, undefined);
	});

	it('services paint in the lead; products are not a chip row', () => {
		assert.equal(byId.products, undefined);
		assert.equal(byId.services.value, fixture.brand.services);
		assert.equal(byId.services.observeOnly, undefined);
	});

	it('nav CTAs omit; slogans fold to one line of real lines; proof is logo/colors/photos', () => {
		assert.equal(byId.ctas, undefined);
		assert.deepEqual(gtk.foldShopCtas(fixture.brand.ctas), []);
		assert.deepEqual(byId.slogans.value, [
			"You shouldn't have to be everything on top of the real job.",
			'Stop paying $5,000 for advice you can’t act on.',
		]);
		assert.equal(byId.slogans.kind, 'line');
		assert.equal(byId.proof.kind, 'proof');
		assert.equal(byId.proof.logo, 'https://www.moilapp.com/moil-512.png');
		assert.deepEqual(byId.proof.colors, ['#5843be', '#ff6633', '#9b8ed8', '#161c2b']);
		assert.deepEqual(byId.proof.photos, [
			'https://www.moilapp.com/og-business.jpg',
			'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png',
		]);
	});

	it('voice sentence is the lead; chips are optional under, not the hero', () => {
		assert.equal(byId.voice.sentence, 'Direct. Practical. Empowering.');
		assert.deepEqual(byId.voice.chips, fixture.brand.voiceChips);
		const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
		const voiceView = gtkSrc.slice(gtkSrc.indexOf("section.kind === 'voice'"), gtkSrc.indexOf("section.kind === 'platforms'"));
		assert.ok(voiceView.indexOf('section.sentence') < voiceView.indexOf('section.chips'), 'sentence before chips');
	});

	it('omits empty audience and problem; paints tagline and cadence; still walls posts', () => {
		const ids = new Set(sections.map((s) => s.id));
		for (const banned of gtk.BANNED_HEADING_IDS) {
			assert.equal(ids.has(banned), false, banned);
		}
		assert.equal(ids.has('audience'), false);
		assert.equal(ids.has('problem'), false);
		assert.equal(ids.has('keyTerms'), false);
		assert.equal(ids.has('language'), false);
		assert.equal(ids.has('tagline'), true);
		assert.equal(byId.tagline.value, fixture.brand.tagline);
		assert.equal(ids.has('cadence'), true);
		assert.equal(byId.cadence.value, 'A few times a week');
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
			['name', 'framing', 'audience', 'services', 'problem', 'schedule'],
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.framing.value, 'Scratch cooking on Main Street.');
		assert.equal(byId.audience.value, 'Locals who want weeknight dinner.');
		assert.equal(byId.problem.value, 'Nowhere nearby that feels like home.');
		assert.equal(gtk.headingKeyFor('framing'), 'headingOverview');
		assert.equal(gtk.headingKeyFor('audience'), 'headingAudience');
		assert.equal(gtk.headingKeyFor('services'), 'headingServices');
		assert.equal(gtk.headingKeyFor('problem'), 'headingProblem');
		assert.equal(gtk.headingKeyFor('UVP'), 'waitBeatUvp');
		assert.equal(gtk.HEADING_KEY.framing, 'headingOverview');
		assert.equal(gtk.HEADING_KEY.audience, 'headingAudience');
		assert.equal(gtk.HEADING_KEY.services, 'headingServices');
		assert.equal(gtk.HEADING_KEY.problem, 'headingProblem');
		assert.equal(gtk.HEADING_KEY.UVP, 'waitBeatUvp');
		assert.notEqual(gtk.HEADING_KEY.framing, 'waitBeatFraming');
		assert.notEqual(gtk.HEADING_KEY.audience, 'waitBeatAudience');
		assert.notEqual(gtk.HEADING_KEY.services, 'waitBeatServices');
		assert.notEqual(gtk.HEADING_KEY.problem, 'waitBeatProblem');
		assert.ok(gtk.SECTION_ORDER.indexOf('audience') > gtk.SECTION_ORDER.indexOf('framing'));
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

	it('unbans uvp when GET has it; lifts keyTerms, language, tagline, cadence, trustSignals; still walls posts and narrationPov', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Shop',
					overview: 'Scratch cooking.',
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
		assert.ok(ids.includes('UVP'));
		assert.equal(sections.find((s) => s.id === 'UVP').value, 'Home cooking.');
		assert.ok(ids.includes('keyTerms'));
		assert.deepEqual(sections.find((s) => s.id === 'keyTerms').value, ['weeknight']);
		assert.ok(ids.includes('language'));
		assert.equal(sections.find((s) => s.id === 'language').value, 'English');
		assert.ok(ids.includes('tagline'));
		assert.ok(ids.includes('cadence'));
		assert.equal(sections.find((s) => s.id === 'cadence').value, 'A few times a week');
		assert.ok(ids.includes('trustSignals'));
		assert.equal(sections.find((s) => s.id === 'trustSignals').value, 'Since 2019');
		for (const banned of gtk.BANNED_HEADING_IDS) {
			assert.equal(ids.includes(banned), false, banned);
		}
		assert.equal(ids.includes('uvp'), false, 'section id is UVP, matching wait');
		assert.equal(ids.includes('competitors'), false);
		assert.equal(ids.includes('market'), false);
		assert.equal(ids.includes('narrationPov'), false);
		assert.equal(ids.includes('posts'), false);
		assert.deepEqual(gtk.BANNED_HEADING_IDS, ['narrationPov', 'posts']);
		assert.equal(gtk.BANNED_HEADING_IDS.includes('uvp'), false);
		assert.equal(gtk.BANNED_HEADING_IDS.includes('cadence'), false);
		assert.equal(gtk.BANNED_HEADING_IDS.includes('trustSignals'), false);
		assert.equal(gtk.headingKeyFor('cadence'), 'posCadence');
		assert.equal(gtk.headingKeyFor('keyTerms'), 'posKeyTerms');
		assert.equal(gtk.headingKeyFor('tagline'), 'headingTagline');
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

describe('the free card walls posts, and none of the Munch theatre', () => {
	const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
	const magnet = read('app/business/components/PreviewMagnet.tsx');
	const helper = read('app/business/preview/gettingToKnowYou.js');

	it('Decide For Me is present; posts are walled off the free ready card', () => {
		assert.match(gtkSrc, /platformDecideForMe/);
		assert.match(gtkSrc, /chooseDecide\(/);
		assert.match(gtkSrc, /decideChip\(/);
		// Jimmy lock: BANNED_HEADING_IDS was not enough — PostStrip
		// painted content.posts beside the heading helper. The free
		// card must not call that path.
		assert.doesNotMatch(gtkSrc, /postCards\(/);
		assert.doesNotMatch(gtkSrc, /<PostStrip/);
		assert.doesNotMatch(gtkSrc, /function PostCreative/);
		assert.doesNotMatch(gtkSrc, /preview-posts-section/);
		assert.doesNotMatch(gtkSrc, /previewPosts/);
		assert.doesNotMatch(gtkSrc, /postsBeforeCta/);
		assert.doesNotMatch(magnet, /postsBeforeCta/);
		assert.doesNotMatch(magnet, /previewPosts/);
		const gtkCall = magnet.slice(magnet.indexOf('<GettingToKnowYou'), magnet.indexOf('signupHref='));
		assert.doesNotMatch(gtkCall, /content:/);
		assert.match(magnet, /fillBrandCity/);
		const helperBody = helper.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		assert.doesNotMatch(helperBody, /content\.posts/);
		assert.match(helper, /BANNED_HEADING_IDS/);
		assert.match(helper, /Posts walled on the free card/);
		assert.deepEqual(gtk.BANNED_HEADING_IDS, ['narrationPov', 'posts']);
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

	it('wall is Start free via buildRegisterUrl; leftover-4 dest HOLD (no persist); the REST of leftover-6 stays OFF', () => {
		assert.match(magnet, /buildRegisterUrl\(/);
		assert.match(magnet, /GettingToKnowYou/);
		assert.match(gtkSrc, /\{m\.startFree\}/);
		assert.match(gtkSrc, /leftover-4 dest HOLD/);
		assert.match(helper, /leftover-4 dest HOLD/);
		// leftover-6 remaining OFF: no second scrape, no website builder.
		// Posts are walled on the free card (Jimmy lock).
		assert.match(gtkSrc, /leftover-6, remaining OFF/);
		assert.match(helper, /leftover-6, remaining OFF/);
		assert.match(helper, /no second scrape, no website builder/);
		assert.match(helper, /Posts walled on the free card/);
		assert.match(gtkSrc, /Posts walled on the free card/);
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

	it('the reading canvas precedes the decision rail; LinkedIn stays an unavailable note', () => {
		assert.ok(gtkSrc.indexOf('KNOWING_IDS') > 0);
		const knowingRender = gtkSrc.indexOf('{canvasSections.map(renderSection)}');
		const pickerRender = gtkSrc.indexOf('<aside className="preview-action-rail">');
		const proofRender = gtkSrc.indexOf('{proof ? <ProofStrip');
		assert.ok(knowingRender > 0 && pickerRender > knowingRender, 'decision rail after reading canvas');
		assert.ok(proofRender > knowingRender && proofRender < pickerRender, 'proof remains with the reading canvas');
		assert.match(gtkSrc, /preview-platform-unavailable/);
		assert.match(gtkSrc, /First-brain copy/);
		assert.match(gtkSrc, /platformDecideForMe/);
	});

	it('uses the exact Moil orange for ready-card actions with the standard white foreground', () => {
		const css = read('app/business/business.css');
		const readyV2 = css.slice(css.indexOf('Preview ready v2: Focus canvas'));
		assert.match(css, /--preview-orange:\s*#FF6633/);
		assert.match(readyV2, /\.preview-magnet-shell--ready/);
		assert.match(readyV2, /\.preview-magnet-shell--ready \.preview-primary-cta\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*#FF6633/s);
		assert.match(gtkSrc, /preview-primary-cta/);
		assert.match(gtkSrc, /continueWithProfile/);
	});
});

describe('ready lead is the five wait sentences; Unique CTAs fold or omit', () => {
	it('knowingLeadFromBody is framing → audience → services → problem → UVP, omit empty', () => {
		assert.deepEqual(
			gtk.knowingLeadFromBody({
				brand: {
					name: 'Kyle & Buda',
					overview: 'Free 60-second tool for Kyle and Buda shop owners.',
					services: 'AI visibility scan, Hat score, Local pages, and Listings',
				},
				positioning: {
					audience: 'Shop owners in Kyle and Buda.',
					problem: 'AI answers name someone else.',
					uvp: 'Ask ChatGPT who the best plumber in Buda is. Are you the answer?',
				},
			}),
			[
				{ heading: 'framing', text: 'Free 60-second tool for Kyle and Buda shop owners.' },
				{ heading: 'audience', text: 'Shop owners in Kyle and Buda.' },
				{ heading: 'services', text: 'AI visibility scan, Hat score, Local pages, and Listings' },
				{ heading: 'problem', text: 'AI answers name someone else.' },
				{ heading: 'UVP', text: 'Ask ChatGPT who the best plumber in Buda is. Are you the answer?' },
			],
		);
		assert.deepEqual(gtk.WAIT_BEAT_HEADINGS, ['framing', 'audience', 'services', 'problem', 'UVP']);
		assert.deepEqual(
			gtk.knowingLeadFromBody({ brand: { name: 'Shop' } }),
			[],
		);
	});

	it('does not fake-type the ready payload', () => {
		const helper = read('app/business/preview/gettingToKnowYou.js');
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(helper, /function\s+\w*(fromReady|readyBeats|typeFromReady)\w*/i);
		assert.doesNotMatch(magnet, /waitBeatsFromReady/);
		assert.doesNotMatch(magnet, /typeFromReady/);
		assert.match(magnet, /onReady\(/);
	});

	it("Kyle's eight Unique CTA pills omit; 1–2 real shop CTAs fold to one line", () => {
		const kyleCtas = [
			'Kyle & Buda Local shops',
			'Claim listing',
			'Scan my shop — free',
			'See a sample report',
			'Scan your shop to be in the first batch',
			'Moil buda · verified · national + local',
			'Plumbing Open Buda page →',
			'HVAC Open Buda page →',
		];
		assert.deepEqual(gtk.foldShopCtas(kyleCtas), []);
		assert.equal(
			gtk.profileSections({ brand: { name: 'Kyle & Buda', ctas: kyleCtas } }, { selected: [] }).some(
				(s) => s.id === 'ctas',
			),
			false,
		);
		assert.deepEqual(gtk.foldShopCtas(['Book a job', 'Get a quote', 'How It Works', 'Pricing', 'Blog']), [
			'Book a job',
			'Get a quote',
		]);
		const folded = gtk.profileSections(
			{ brand: { name: 'Shop', ctas: ['Book a job', 'Get a quote'] } },
			{ selected: [] },
		);
		const ctas = folded.find((s) => s.id === 'ctas');
		assert.equal(ctas.kind, 'line');
		assert.deepEqual(ctas.value, ['Book a job', 'Get a quote']);
	});

	it('slogans keep a real line and drop nav chips', () => {
		assert.deepEqual(
			gtk.foldShopSlogans([
				'Ask ChatGPT who the best plumber in Buda is. Are you the answer?',
				'How it works',
				'Find a shop',
				'The visibility board',
				'Claimed & verified',
				'AI visibility scan',
			]),
			['Ask ChatGPT who the best plumber in Buda is. Are you the answer?'],
		);
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
		assert.match(esMagnet, /Tu estrategia, resumida/);
		assert.match(esMagnet, /Cómo se habla del negocio/);
		assert.match(esMagnet, /Dónde se publica/);
		assert.doesNotMatch(esMagnet, /Llegando a conocerte/);
		assert.doesNotMatch(esMagnet, /Decide por m[ií]/);
		assert.doesNotMatch(esMagnet, /Mensajer[ií]a y encuadre/i);
		assert.doesNotMatch(esMagnet, /Horario de publicaci[oó]n/);
		assert.doesNotMatch(esMagnet, /I'm learning/);
		assert.match(esMagnet, /Por qué gana/);
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

describe('ready-card headings are the wait GET headings', () => {
	const EN = {
		waitBeatFraming: 'What this business is',
		waitBeatAudience: 'Who it is for',
		waitBeatServices: 'What it offers',
		waitBeatProblem: 'The problem it solves',
		waitBeatUvp: 'Why it wins',
	};
	const ES = {
		waitBeatFraming: 'Qué es el negocio',
		waitBeatAudience: 'Para quién es',
		waitBeatServices: 'Qué ofrece',
		waitBeatProblem: 'El problema que resuelve',
		waitBeatUvp: 'Por qué gana',
	};
	const ES_DUMP_CALQUES = {
		waitBeatFraming: 'Cómo se habla del negocio',
		waitBeatAudience: 'A quién sirves',
		waitBeatServices: 'Servicios',
		waitBeatProblem: 'Qué resuelves',
		waitBeatUvp: 'Lo que te distingue',
	};

	it('EN waitBeat* is the five GET progress headings; headingName does not paint Business Name', () => {
		for (const [key, want] of Object.entries(EN)) {
			assert.equal(magnetQuoted('src/common/translations/en.ts', key), want, key);
		}
		const headingName = magnetQuoted('src/common/translations/en.ts', 'headingName');
		assert.notEqual(headingName, 'Business Name');
		assert.doesNotMatch(headingName, /Business Name/);
		assert.equal(gtk.foldBeatHeading(EN.waitBeatFraming), 'framing');
		assert.equal(gtk.foldBeatHeading(EN.waitBeatAudience), 'audience');
		assert.equal(gtk.foldBeatHeading(EN.waitBeatServices), 'services');
		assert.equal(gtk.foldBeatHeading(EN.waitBeatProblem), 'problem');
		assert.equal(gtk.foldBeatHeading(EN.waitBeatUvp), 'UVP');
		assert.equal(gtk.headingKeyFor('name'), 'headingName');
		assert.equal(gtk.headingKeyFor('framing'), 'headingOverview');
		assert.equal(magnetQuoted('src/common/translations/en.ts', 'headingOverview'), 'Overview');
		const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
		assert.match(gtkSrc, /headingKeyFor\(section\.id\)/);
		assert.match(gtkSrc, /\{heading \? \(/);
	});

	it('ES waitBeat* is shop Spanish for those five meanings, not dump-label calques; headingName is not Nombre del negocio', () => {
		for (const [key, want] of Object.entries(ES)) {
			assert.equal(magnetQuoted('src/common/translations/es.ts', key), want, key);
			assert.notEqual(magnetQuoted('src/common/translations/es.ts', key), ES_DUMP_CALQUES[key], key);
		}
		const waitBeats = Object.keys(ES)
			.map((key) => magnetQuoted('src/common/translations/es.ts', key))
			.join('\n');
		assert.doesNotMatch(waitBeats, /A quién sirves/);
		assert.doesNotMatch(waitBeats, /Qué resuelves/);
		assert.doesNotMatch(waitBeats, /Cómo se habla del negocio/);
		assert.doesNotMatch(waitBeats, /Lo que te distingue/);
		assert.notEqual(magnetQuoted('src/common/translations/es.ts', 'waitBeatServices'), 'Servicios');
		const headingName = magnetQuoted('src/common/translations/es.ts', 'headingName');
		assert.notEqual(headingName, 'Nombre del negocio');
		assert.doesNotMatch(headingName, /Nombre del negocio/);
	});
});

describe('wait type-out pacing', () => {
	const beats = [
		{ heading: 'framing', text: 'abcde' },
		{ heading: 'audience', text: 'xy' },
	];

	it('paints finished beats plus the one being written, and nothing after it', () => {
		// Nothing started yet: an empty line under a heading is a gap,
		// not a beat arriving.
		assert.equal(gtk.visibleBeatCount(beats, {}, false), 0);
		assert.equal(gtk.visibleBeatCount(beats, { framing: 1 }, false), 1);
		assert.equal(gtk.visibleBeatCount(beats, { framing: 5 }, false), 1);
		assert.equal(gtk.visibleBeatCount(beats, { framing: 5, audience: 1 }, false), 2);
		assert.equal(gtk.visibleBeatCount(beats, { framing: 5, audience: 2 }, false), 2);
	});

	it('never paints a later beat over an unfinished earlier one', () => {
		// A poll can deliver every beat in one write, so the client must
		// be the thing that sequences them. Beat 2 typed while beat 1 is
		// mid-word is the parallel growth this replaces.
		assert.equal(gtk.visibleBeatCount(beats, { framing: 2, audience: 2 }, false), 1);
	});

	it('reduceMotion shows everything, settled', () => {
		assert.equal(gtk.visibleBeatCount(beats, {}, true), 2);
		assert.equal(gtk.beatsSettled(beats, {}, true), true);
	});

	it('settled is false while any beat is mid-word', () => {
		assert.equal(gtk.beatsSettled(beats, { framing: 3 }, false), false);
		assert.equal(gtk.beatsSettled(beats, { framing: 5 }, false), false);
		assert.equal(gtk.beatsSettled(beats, { framing: 5, audience: 2 }, false), true);
	});

	it('a founder with no beats never waits for a type-out', () => {
		// Ready must not be held back for a show that is not happening.
		assert.equal(gtk.beatsSettled([], {}, false), true);
		assert.equal(gtk.beatsSettled(null, {}, false), true);
		assert.equal(gtk.visibleBeatCount([], {}, false), 0);
		assert.equal(gtk.visibleBeatCount(null, {}, false), 0);
	});

	it('junk typed counts are read as not-started, never as done', () => {
		// A missing or malformed count must never let the card swap over
		// a sentence nobody has read.
		for (const junk of [undefined, null, NaN, -3, 'seven', {}]) {
			assert.equal(gtk.beatsSettled(beats, { framing: junk }, false), false, String(junk));
			assert.equal(gtk.visibleBeatCount(beats, { framing: junk }, false), 0, String(junk));
		}
	});

	it('the flush pace is faster than the reading pace, and the backstop is real', () => {
		assert.ok(gtk.TYPEOUT_FLUSH_MS_PER_CHAR < gtk.TYPEOUT_MS_PER_CHAR);
		assert.ok(gtk.TYPEOUT_FLUSH_MS_PER_CHAR > 0);
		assert.ok(gtk.READY_HOLD_MAX_MS > 0 && gtk.READY_HOLD_MAX_MS <= 5000);
	});
});

describe('ready card reveal', () => {
	const IDS = ['name', 'framing', 'audience', 'services', 'problem', 'UVP', 'ctas', 'slogans', 'voice', 'proof', 'picker'];
	const FIVE = ['framing', 'audience', 'services', 'problem', 'UVP'];

	it('never moves a sentence the founder is already reading', () => {
		// Everything at or above the last watched section is instant, so
		// the card opens looking like the wait card and grows downward.
		const d = gtk.revealDelays(IDS, FIVE, false);
		for (const id of ['name', ...FIVE]) assert.equal(d[id], 0, id);
		assert.ok(d.ctas > 0 && d.slogans > d.ctas && d.voice > d.slogans);
	});

	it('leaves a gap between what was there and what is new', () => {
		// The first unseen section does NOT land on the same frame as the
		// settled ones, or the cascade reads as a late repaint.
		const d = gtk.revealDelays(IDS, FIVE, false);
		assert.equal(d.ctas, gtk.REVEAL_STEP_MS);
	});

	it('a partly-watched wait only settles what was actually watched', () => {
		const d = gtk.revealDelays(IDS, ['framing'], false);
		assert.equal(d.name, 0);
		assert.equal(d.framing, 0);
		assert.ok(d.audience > 0, 'a beat never shown still gets its reveal');
	});

	it('nothing watched means the whole card is new and cascades from the top', () => {
		const d = gtk.revealDelays(IDS, [], false);
		assert.equal(d.name, 0);
		assert.equal(d.framing, gtk.REVEAL_STEP_MS);
		assert.equal(d.audience, gtk.REVEAL_STEP_MS * 2);
	});

	it('reduceMotion lands everything at once', () => {
		const d = gtk.revealDelays(IDS, FIVE, true);
		for (const id of IDS) assert.equal(d[id], 0, id);
	});

	it('junk in, no delay out — never an undefined animation-delay', () => {
		for (const junk of [null, undefined, 'nope', [1, 2], [{}]]) {
			const d = gtk.revealDelays(IDS, junk, false);
			for (const id of IDS) assert.equal(typeof d[id], 'number', id);
		}
		assert.deepEqual(gtk.revealDelays(null, FIVE, false), {});
		assert.deepEqual(gtk.revealDelays([], FIVE, false), {});
	});

	it('the signup CTA is never delayed behind the cascade', () => {
		// An action must not wait on an animation. The CTA is deliberately
		// absent from the id list the card builds.
		const src = read('app/business/components/GettingToKnowYou.tsx');
		const list = src.slice(src.indexOf('revealDelays('), src.indexOf('const reveal ='));
		assert.doesNotMatch(list, /signupHref|startFree/);
		const cta = src.slice(src.indexOf('href={signupHref}'), src.indexOf('{m.tryAgain}'));
		// `reveal(` too, not just the strings it expands to: spreading the
		// helper is how anyone would actually add this, and an assertion
		// that only sees the literals passes straight over it.
		assert.doesNotMatch(cta, /preview-reveal|animationDelay|reveal\(/);
	});

	it('the delay rides a CSS property, never a Tailwind class', () => {
		// Tailwind compiles arbitrary values by scanning source, so a
		// delay class built at runtime does not exist in the stylesheet
		// and the section would never animate — or never appear.
		const src = read('app/business/components/GettingToKnowYou.tsx');
		assert.match(src, /animationDelay: `\$\{delays\[id\] \|\| 0\}ms`/);
		assert.doesNotMatch(src, /\[animation-delay:/);
		assert.doesNotMatch(src, /delay-\[/);
	});

	it('a section is visible by default — the animation only fades IN', () => {
		// Content parked at opacity 0 waiting on a script is the failure
		// this avoids: if animations are unavailable the section renders.
		const css = read('app/business/business.css');
		const rule = css.slice(css.indexOf('@keyframes previewReveal'), css.indexOf('@keyframes previewReveal') + 600);
		assert.match(rule, /from \{\s*opacity: 0;/);
		assert.match(rule, /to \{\s*opacity: 1;/);
		assert.match(rule, /animation: previewReveal [^;]*backwards;/);
		assert.match(css, /preview-ready-actions--sticky/);
		assert.match(rule, /prefers-reduced-motion: reduce/);
	});
});

describe('composed research card — markdown-safe, identity, problem ≠ UVP', () => {
	it('strips markdown so type-out never leaks raw markers', () => {
		assert.equal(gtk.stripMarkdown('**Moil** learns the business.'), 'Moil learns the business.');
		assert.equal(
			gtk.composeProse('## Overview\n\n**Moil** learns the business once.'),
			'Overview Moil learns the business once.',
		);
		assert.deepEqual(
			gtk.waitBeatsFromBody({
				progress: [
					{
						heading: 'What this business is',
						text: '## What we are\n\n**Moil** learns the business.',
					},
				],
			}),
			[{ heading: 'framing', text: 'What we are Moil learns the business.' }],
		);
	});

	it('overview is composed overview, not messaging-as-framing', () => {
		const sections = gtk.profileSections(
			{
				brand: {
					name: 'Shop',
					overview: 'Scratch cooking on Main Street.',
					messaging: 'Warm and local.',
				},
			},
			{ selected: [] },
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.framing.value, 'Scratch cooking on Main Street.');
		assert.notEqual(byId.framing.value, 'Warm and local.');
		assert.equal(gtk.headingKeyFor('framing'), 'headingOverview');
	});

	it('omits trades/roofing audience when the brand is not that business', () => {
		const moil = gtk.profileSections(
			{
				brand: {
					name: 'Moil',
					overview: 'The AI co-founder for small business owners.',
				},
				positioning: {
					audience: 'Trades and roofing crews in Kyle.',
				},
			},
			{ selected: [] },
		);
		assert.equal(moil.some((s) => s.id === 'audience'), false);

		const roofer = gtk.profileSections(
			{
				brand: {
					name: 'Buda Roofing',
					overview: 'Roofing and HVAC for Kyle and Buda.',
				},
				positioning: {
					audience: 'Homeowners who need a roofer.',
				},
			},
			{ selected: [] },
		);
		const audience = roofer.find((s) => s.id === 'audience');
		assert.equal(audience.value, 'Homeowners who need a roofer.');
	});

	it('omits a tag-dump audience rather than painting chips as composed who-for', () => {
		const sections = gtk.profileSections(
			{
				brand: { name: 'Taste On Main', overview: 'Scratch cooking on Main Street.' },
				positioning: { audience: 'tacos, burritos, salsa, catering' },
			},
			{ selected: [] },
		);
		assert.equal(sections.some((s) => s.id === 'audience'), false);
	});

	it('drops UVP when it is the same line as problem', () => {
		const sections = gtk.profileSections(
			{
				brand: { name: 'Shop', overview: 'Dinner.' },
				positioning: {
					problem: 'Too many hats.',
					uvp: 'Too many hats.',
				},
			},
			{ selected: [] },
		);
		const ids = sections.map((s) => s.id);
		assert.equal(ids.includes('problem'), true);
		assert.equal(ids.includes('UVP'), false);
	});

	it('maps language codes; paints cadence from positioning, not the picker', () => {
		assert.equal(gtk.languageLabel('en'), 'English');
		assert.equal(gtk.languageLabel('es-MX'), 'Spanish');
		assert.equal(gtk.languageLabel('zz'), '');
		const sections = gtk.profileSections(
			{
				brand: { name: 'Shop', language: 'en' },
				positioning: { cadence: 'Four posts a week' },
			},
			{ selected: ['instagram'] },
		);
		const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
		assert.equal(byId.language.value, 'English');
		assert.equal(byId.cadence.value, 'Four posts a week');
		assert.deepEqual(byId.schedule.value, ['instagram']);
		assert.doesNotMatch(JSON.stringify(byId.schedule), /Four posts a week/);
	});

	it('the convert CTA is sticky on the ready card', () => {
		const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
		const css = read('app/business/business.css');
		assert.match(gtkSrc, /preview-ready-actions--sticky/);
		assert.match(css, /preview-ready-actions--sticky/);
		assert.match(css, /position:\s*sticky/);
	});
});
