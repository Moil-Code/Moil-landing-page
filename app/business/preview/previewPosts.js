'use strict';

/**
 * previewPosts — the paint plan for the finished posts on the ready card.
 *
 * THE CARD SHOWED WHAT WE READ AND NEVER WHAT WE WOULD MAKE. Every
 * section above this one is proof-of-reading: a founder sees their own
 * words, their own colours, their own logo handed back. That is a good
 * first minute and it is not the product. `composePreview` has been
 * shipping finished posts in `content.posts` the whole time — a caption
 * and a gradient-ground creative per post — and the card carried
 * `'posts'` in its banned-heading list, so they were composed, sent over
 * the wire, and dropped on the floor.
 *
 * ── WE NEVER WRITE A SENTENCE ABOUT THEIR BUSINESS ──────────────────
 * The server composes a caption as one ANGLE from its own closed set
 * ("A closer look at") plus a SUBJECT taken verbatim from the founder's
 * own site. That is the same discipline `topicCandidates` states, and it
 * is why these captions are safe to show a stranger before they have an
 * account: nothing here is a claim we invented about them. This module
 * renders what it was given and composes no prose of its own — the eval
 * fails on any template literal that would build a sentence.
 *
 * ── A CARD NEEDS WORDS AND SOMETHING TO LOOK AT ─────────────────────
 * The caption is the work and is always required — a creative with no
 * caption is a poster with nothing to say. What it sits on is either
 * the server's headline (the type-led treatment, word-level colour and
 * all) or the founder's own photograph. Rows stored before the creative
 * existed carry a caption and an image and nothing else, and they are
 * still real posts: dropping them would blank the strip for every
 * preview built before this shipped. What we never do is manufacture
 * the missing half — a caption is not promoted into a headline to fill
 * a frame, because then the same sentence would be painted twice and
 * read as a bug.
 *
 * A body that yields no card renders NO section — never an empty frame
 * under a heading, which reads as a thing that failed rather than a
 * thing we did not claim.
 *
 * ── THE CREATIVE IS PAINTED IN THE DOM, NOT LOADED AS AN IMAGE ──────
 * The server also ships `creative.imageUrl`, a `data:image/svg+xml`
 * fallback. We deliberately do not use it. A data-URI document has an
 * opaque origin, so every external reference inside it is blocked —
 * measured in headless Chromium, where the blocked reference renders as
 * a BROKEN-IMAGE ICON rather than simply not painting. Painting the same
 * design in the DOM loads the founder's real logo and real photograph,
 * which is the whole difference between a mock-up and their post.
 *
 * Pure: no I/O, no clock, no React.
 */

/** Never more than this many, whatever the server sends. */
const POST_CARD_MAX = 3;

/** Longest headline we will letter-space across a card. */
const HEADLINE_MAX = 64;

/** Longest supporting line under a headline. */
const SUBHEAD_MAX = 90;

/** Longest caption we render under a creative. */
const CAPTION_MAX = 280;

function str(value, max) {
	return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function httpsUrl(value) {
	const v = str(value, 500);
	return /^https:\/\//i.test(v) ? v : '';
}

function hexList(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	const seen = new Set();
	for (const item of raw) {
		const t = str(item, 16);
		if (!t) continue;
		const hex = t.startsWith('#') ? t : '#' + t;
		if (!/^#[0-9a-f]{3,8}$/i.test(hex)) continue;
		const key = hex.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(hex);
	}
	return out;
}

/**
 * The last word carries the accent, exactly as `buildCreativeSvg` does.
 *
 * That match is the point rather than a coincidence: the card a visitor
 * sees before the wall and the creative the product composes afterwards
 * have to be the same design, or the preview is a mock-up of something
 * we do not build. A single-word headline is ALL accent — splitting it
 * would leave an empty lead and a card that looks half-painted.
 *
 * @param {string} headline
 * @returns {{ lead: string, last: string }}
 */
function splitHeadline(headline) {
	const words = str(headline, HEADLINE_MAX).split(/\s+/).filter(Boolean);
	if (!words.length) return { lead: '', last: '' };
	const last = words.pop();
	return { lead: words.join(' '), last };
}

/**
 * Brand-level paint, shared by every card.
 *
 * Colours come from the BRAND and never from a post, because the
 * server's own fallback creative reads them from the brand — two
 * sources would let the card and the fallback disagree about the
 * founder's palette with nothing erroring.
 *
 * @param {object} brand
 */
function creativePalette(brand) {
	const colors = hexList(brand && brand.colors);
	return {
		primary: colors[0] || '',
		accent: colors[1] || colors[0] || '',
		surface: colors[2] || '',
	};
}

/**
 * @param {{ brand?: object, content?: { kind?: string, posts?: unknown } } | null | undefined} body
 * @returns {Array<{caption: string, headline: string, lead: string, last: string,
 *                  subhead: string, photo: string, logo: string,
 *                  primary: string, accent: string, surface: string}>}
 */
function postCards(body) {
	const b = body && typeof body === 'object' ? body : {};
	const brand = (b.brand && typeof b.brand === 'object' && b.brand) || {};
	const content = (b.content && typeof b.content === 'object' && b.content) || {};
	const raw = Array.isArray(content.posts) ? content.posts : [];
	const palette = creativePalette(brand);
	const logo = httpsUrl(brand.logoUrl) || httpsUrl(brand.logo);

	const cards = [];
	const seen = new Set();
	for (const item of raw) {
		if (cards.length >= POST_CARD_MAX) break;
		const post = item && typeof item === 'object' ? item : {};
		const creative =
			post.creative && typeof post.creative === 'object' ? post.creative : {};
		const caption = str(post.caption, CAPTION_MAX);
		if (!caption) continue;
		const headline = str(creative.headline, HEADLINE_MAX);
		// Their own photograph when the site gave us one. Absent is not
		// a failure — the treatment is type-led either way, which is why
		// nothing here substitutes a stock image.
		const photo = httpsUrl(creative.image) || httpsUrl(post.imageUrl);
		// SOMETHING TO LOOK AT. A headline gives the type-led treatment;
		// a photo alone gives their picture under our wash. Neither is
		// an empty frame, so it is dropped rather than padded.
		if (!headline && !photo) continue;
		const key = caption.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		const { lead, last } = splitHeadline(headline);
		cards.push({
			caption,
			headline,
			lead,
			last,
			subhead: str(creative.subhead, SUBHEAD_MAX),
			photo,
			logo,
			primary: palette.primary,
			accent: palette.accent,
			surface: palette.surface,
		});
	}
	return cards;
}

module.exports = {
	POST_CARD_MAX,
	HEADLINE_MAX,
	SUBHEAD_MAX,
	CAPTION_MAX,
	splitHeadline,
	creativePalette,
	postCards,
};
