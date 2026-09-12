#!/usr/bin/env node
'use strict';

/**
 * PROOF OF WORK, NOT PROOF OF READING.
 * node --test evals/previewPosts.test.js
 *
 * Every section of the ready card hands the founder their own words
 * back — what we READ about them. `composePreview` has been shipping
 * finished posts in `content.posts` the whole time, and the card
 * dropped them twice over: `PreviewMagnet`'s ReadyPayload declared no
 * `content` key, and the heading helper banned `posts`. Measured on the
 * screenshot's own business, the server produced three finished posts
 * and the card showed none of them.
 *
 * The rules below are all asymmetric in the same direction. This strip
 * is shown to a stranger, before an account, about a real business:
 *   • a card we decline to paint costs one empty slot;
 *   • a card that invents a sentence publishes a claim under their name.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const posts = require('../app/business/preview/previewPosts');
const fixture = require('./fixtures/wzP6PJqiVxqG');

const BRAND = {
	colors: ['#7ED8D0', '#8B3FD9', '#2A6BB0'],
	logoUrl: 'https://evermendsolutions.com/logo.png',
};

const body = (postList, brand) => ({
	brand: brand || BRAND,
	content: { kind: 'posts', posts: postList },
});

describe('a card needs words and something to look at', () => {
	it('a caption plus a headline is the type-led treatment', () => {
		const cards = posts.postCards(
			body([
				{
					caption: 'A closer look at Tabletop Lab Installation',
					creative: { headline: 'Tabletop Lab Installation' },
				},
			]),
		);
		assert.equal(cards.length, 1);
		assert.equal(cards[0].caption, 'A closer look at Tabletop Lab Installation');
		assert.equal(cards[0].headline, 'Tabletop Lab Installation');
	});

	it('a caption plus a photo is still a real post — rows predate the creative', () => {
		// The committed fixture IS such a row: real captions, real
		// https images, no `creative` at all. Requiring a headline
		// would blank the strip for every preview built before the
		// creative shipped.
		const cards = posts.postCards(fixture);
		assert.equal(cards.length, 3, 'the pre-creative fixture still paints');
		for (const card of cards) {
			assert.equal(card.headline, '', 'no headline was invented for it');
			assert.match(card.photo, /^https:\/\//);
		}
	});

	it('uses a relevant image from the queried site when a post has no image of its own', () => {
		const cards = posts.postCards(
			body(
				[{ caption: 'A closer look at automation', creative: { headline: 'Automate engineering workflows' } }],
				{ ...BRAND, photos: ['https://evermendsolutions.com/workflow.jpg'] },
			),
		);
		assert.equal(cards.length, 1);
		assert.equal(cards[0].photo, 'https://evermendsolutions.com/workflow.jpg');
	});

	it('a caption with neither is dropped, never padded', () => {
		const cards = posts.postCards(
			body([{ caption: 'nothing to look at' }]),
		);
		assert.deepEqual(cards, []);
	});

	it('a headline with no caption is dropped — the caption IS the work', () => {
		const cards = posts.postCards(
			body([{ creative: { headline: 'HYVE Rx' }, imageUrl: 'https://x.com/a.jpg' }]),
		);
		assert.deepEqual(cards, []);
	});

	it('zero is a real answer — no posts, no strip', () => {
		assert.deepEqual(posts.postCards(null), []);
		assert.deepEqual(posts.postCards({}), []);
		assert.deepEqual(posts.postCards({ brand: BRAND }), []);
		assert.deepEqual(posts.postCards(body([])), []);
	});
});

describe('nothing about their business is composed here', () => {
	it('the module writes no prose — no template literal builds a sentence', () => {
		const src = read('app/business/preview/previewPosts.js');
		const body = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		// A backtick with an interpolation in it is how a sentence gets
		// built. The one legitimate use is the '#' colour prefix, which
		// is string concatenation, not a template.
		assert.doesNotMatch(body, /`[^`]*\$\{/, 'no composed prose');
	});

	it('a caption is never promoted into a headline to fill the frame', () => {
		const cards = posts.postCards(
			body([{ caption: 'How we make HYVE Rx', imageUrl: 'https://x.com/a.jpg' }]),
		);
		assert.equal(cards.length, 1);
		assert.equal(cards[0].headline, '');
		assert.equal(cards[0].last, '', 'nothing to paint as type');
	});

	it('duplicate captions collapse rather than repeating a post', () => {
		const cards = posts.postCards(
			body([
				{ caption: 'Same words', creative: { headline: 'A' } },
				{ caption: 'same words', creative: { headline: 'B' } },
			]),
		);
		assert.equal(cards.length, 1);
	});

	it('never more than POST_CARD_MAX, whatever the server sends', () => {
		const many = [];
		for (let i = 0; i < 12; i++) {
			many.push({ caption: 'Caption ' + i, creative: { headline: 'H' + i } });
		}
		assert.equal(posts.postCards(body(many)).length, posts.POST_CARD_MAX);
	});
});

describe('the design matches what the product composes after the wall', () => {
	it('the last word carries the accent, exactly as buildCreativeSvg does', () => {
		assert.deepEqual(posts.splitHeadline('Tabletop Lab Installation'), {
			lead: 'Tabletop Lab',
			last: 'Installation',
		});
	});

	it('a one-word headline is ALL accent, never an empty lead', () => {
		assert.deepEqual(posts.splitHeadline('Peptides'), { lead: '', last: 'Peptides' });
		assert.deepEqual(posts.splitHeadline('   '), { lead: '', last: '' });
	});

	it('colours come from the BRAND, so the card and the fallback cannot disagree', () => {
		const palette = posts.creativePalette(BRAND);
		assert.equal(palette.primary, '#7ED8D0');
		assert.equal(palette.accent, '#8B3FD9');
		assert.equal(palette.surface, '#2A6BB0');
		// A post carrying its own colours must not override the brand.
		const cards = posts.postCards(
			body([
				{
					caption: 'c',
					creative: { headline: 'H', colors: ['#FF0000'] },
				},
			]),
		);
		assert.equal(cards[0].primary, '#7ED8D0');
	});

	it('a repeated colour never becomes the accent — the last word would vanish', () => {
		// A palette that lists its primary twice is ordinary. Without a
		// dedup the accent resolves to the SAME hex as the body text,
		// so the word carrying the accent is painted invisible against
		// its own colour. Found by red-verification: the first cut of
		// this file removed the dedup and stayed green.
		const palette = posts.creativePalette({
			colors: ['#111111', '#111111', '#222222'],
		});
		assert.equal(palette.primary, '#111111');
		assert.notEqual(palette.accent, palette.primary);
		assert.equal(palette.accent, '#222222');
	});

	it('one colour still yields an accent rather than an unpainted word', () => {
		const palette = posts.creativePalette({ colors: ['#123456'] });
		assert.equal(palette.primary, '#123456');
		assert.equal(palette.accent, '#123456');
		assert.equal(palette.surface, '');
	});

	it('junk colours and non-https media are refused', () => {
		assert.deepEqual(posts.creativePalette({ colors: ['nope', '', 42] }), {
			primary: '',
			accent: '',
			surface: '',
		});
		const cards = posts.postCards(
			body(
				[
					{
						caption: 'c',
						imageUrl: 'http://insecure.example/a.jpg',
						creative: { headline: 'H', image: 'data:image/png;base64,AAA' },
					},
				],
				{ colors: [], logoUrl: 'http://insecure.example/l.png' },
			),
		);
		assert.equal(cards.length, 1, 'the headline still carries it');
		assert.equal(cards[0].photo, '', 'no http, no data: URI');
		assert.equal(cards[0].logo, '', 'an insecure logo is not painted');
	});
});

describe('the free ready card does not paint posts', () => {
	const gtk = read('app/business/components/GettingToKnowYou.tsx');
	const gtkBody = gtk
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
		.replace(/^\s*\/\/.*$/gm, '');

	it('PostStrip is unwired — BANNED_HEADING_IDS was not enough', () => {
		assert.doesNotMatch(gtk, /postCards\(/);
		assert.doesNotMatch(gtk, /<PostStrip/);
		assert.doesNotMatch(gtk, /reveal\('posts'\)/);
		assert.doesNotMatch(gtk, /postsBeforeCta/);
		assert.doesNotMatch(gtk, /previewPosts/);
		assert.doesNotMatch(gtkBody, /function PostCreative/);
		assert.doesNotMatch(gtkBody, /preview-posts-section/);
		assert.doesNotMatch(gtkBody, /data:image\/svg/);
		assert.doesNotMatch(gtkBody, /dangerouslySetInnerHTML/);
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.doesNotMatch(magnet, /postsBeforeCta/);
		assert.doesNotMatch(magnet, /previewPosts/);
	});
});

describe('the copy exists in both languages', () => {
	for (const lang of ['en', 'es']) {
		it(lang + ' names the strip and says where the words came from', () => {
			const src = read('src/common/translations/' + lang + '.ts');
			assert.match(src, /postsTitle:/);
			assert.match(src, /postsNote:/);
		});
	}

	it('the note claims nothing we did not do', () => {
		const en = read('src/common/translations/en.ts');
		const line = (en.match(/postsNote: '([^']*)'/) || [])[1] || '';
		assert.ok(line, 'postsNote was FOUND');
		// The captions are the founder's own product names under an
		// angle from our closed set. Saying so is the strongest claim
		// available and it is true; a performance promise would not be.
		assert.doesNotMatch(line, /\d/, 'no invented figure');
		assert.doesNotMatch(line, /guarantee|proven|best|#1/i);
	});
});

describe('the magnet actually forwards what the server sent', () => {
	const magnet = read('app/business/components/PreviewMagnet.tsx');

	it('ReadyPayload may still hold what the server sent, and the card is not handed it', () => {
		assert.match(magnet, /content\?: \{ kind\?: string; posts\?: ReadyPost\[\] \}/);
		assert.match(magnet, /content: filled\.content/);
		const cardCall = magnet.slice(magnet.indexOf('<GettingToKnowYou'), magnet.indexOf('</GettingToKnowYou>'));
		assert.doesNotMatch(cardCall, /content:/);
		assert.match(magnet, /postsShown: 0/);
	});
});
