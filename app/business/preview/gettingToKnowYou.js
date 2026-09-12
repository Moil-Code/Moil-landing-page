'use strict';

/**
 * Getting To Know You — paint plan from a ready GET body.
 *
 * Ready card is a COMPOSED research card, markdown-safe, not a tag dump
 * and not a replay of wait-beat headings. Overview is brand.overview
 * (then description), never messaging-as-framing. Audience omits empty,
 * tag dumps, and trades/roofing bleed that the rest of the brand does
 * not support. Problem and UVP are distinct; a duplicate UVP omits.
 * Lifted when present: keyTerms, language, tagline, cadence,
 * trustSignals. Cadence is positioning.cadence, never the picker.
 *
 * POSTS WALLED on the free ready card (Jimmy lock). `posts` stays in
 * BANNED_HEADING_IDS so a GET key cannot become a heading — AND this
 * module never emits a posts section. The heading ban alone was not
 * enough: PostStrip painted content.posts beside it. The free card
 * does not call that path.
 *
 * leftover-4 dest HOLD: this module does not persist. Hydrate lives on
 * Onboarding. Local edits in the card die with the session.
 * leftover-6, remaining OFF: no second scrape, no website builder.
 * Posts walled on the free card.
 *
 * Pure: no I/O, no clock, no React.
 */

const { normalizeChoice } = require('./platformChoice');

/**
 * Building GET wait beats. Only these headings, in this order.
 * scrape_started / pages_read / tokens_ready are dead for this door.
 */
const WAIT_BEAT_HEADINGS = Object.freeze([
	'framing',
	'audience',
	'services',
	'problem',
	'UVP',
]);

const WAIT_BEAT_HEADING_KEY = Object.freeze({
	framing: 'waitBeatFraming',
	audience: 'waitBeatAudience',
	services: 'waitBeatServices',
	problem: 'waitBeatProblem',
	UVP: 'waitBeatUvp',
});

/** Character type-out pace once a beat has landed on poll. */
const TYPEOUT_MS_PER_CHAR = 24;

/**
 * Pace once the ready payload is in hand and the card is waiting on
 * the sentence in flight. Faster, because the answer is already here
 * and the founder should not be made to watch a countdown.
 */
const TYPEOUT_FLUSH_MS_PER_CHAR = 8;

/** Stagger between one revealed card section and the next. */
const REVEAL_STEP_MS = 90;

/**
 * Longest the ready card may be held back for a beat still being
 * written. A backstop, not the mechanism: beats are emitted during the
 * scrape now, so by the time a job finishes the typing has usually been
 * done for a while and this never binds. It exists so a pathological
 * beat cannot park the card indefinitely.
 */
const READY_HOLD_MAX_MS = 2500;

const SECTION_ORDER = Object.freeze([
	'name',
	'framing',
	'tagline',
	'audience',
	'services',
	'problem',
	'UVP',
	'keyTerms',
	'language',
	'cadence',
	'trustSignals',
	'ctas',
	'slogans',
	'voice',
	'proof',
	'schedule',
]);

const HEADING_KEY = Object.freeze({
	name: 'headingName',
	framing: 'headingOverview',
	tagline: 'headingTagline',
	audience: 'headingAudience',
	services: 'headingServices',
	problem: 'headingProblem',
	UVP: 'waitBeatUvp',
	keyTerms: 'posKeyTerms',
	language: 'headingLanguage',
	cadence: 'posCadence',
	trustSignals: 'headingTrust',
	ctas: 'headingCtas',
	slogans: 'headingSlogans',
	voice: 'headingVoice',
	proof: '',
	schedule: 'headingSchedule',
});

/**
 * Never become section ids, even when the GET has values.
 * Lifted: keyTerms, language, tagline, cadence, trustSignals.
 * posts STAY banned — walled on the free card (Jimmy lock).
 */
const BANNED_HEADING_IDS = Object.freeze([
	'narrationPov',
	'posts',
]);

/** Longest composed prose on the ready card. Sentence-boundary cut. */
const COMPOSE_MAX = 720;

/** Wait type-out cap — a markdown dump must not park the card. */
const WAIT_COMPOSE_MAX = 320;

const LANGUAGE_LABEL = Object.freeze({
	en: 'English',
	eng: 'English',
	english: 'English',
	'en-us': 'English',
	'en-gb': 'English',
	es: 'Spanish',
	spa: 'Spanish',
	spanish: 'Spanish',
	'es-mx': 'Spanish',
	'es-es': 'Spanish',
	'es-us': 'Spanish',
	bilingual: 'English and Spanish',
	'en, es': 'English and Spanish',
	'en/es': 'English and Spanish',
	'en + es': 'English and Spanish',
	'en and es': 'English and Spanish',
	'english and spanish': 'English and Spanish',
});

/** Audience bleed that is not this business. */
const TRADE_BLEED =
	/\b(roofing|roofers?|hvac|plumbers?|plumbing|electricians?|welding|tradesmen|tradespeople|trades?|contractors?|construction crew)\b/i;

/** Max real shop CTAs / slogans on the ready card. The rest omit. */
const FOLDED_LINE_MAX = 2;

function asText(value) {
	if (typeof value === 'string') return value.trim();
	if (value && typeof value === 'object' && !Array.isArray(value) && typeof value.value === 'string') {
		return value.value.trim();
	}
	return '';
}

function asList(value) {
	if (Array.isArray(value)) {
		return value.map(asText).filter(Boolean);
	}
	const single = asText(value);
	return single ? [single] : [];
}

function httpsUrl(raw) {
	if (typeof raw !== 'string') return '';
	const s = raw.trim();
	if (!s || /^data:/i.test(s)) return '';
	if (!/^https?:\/\//i.test(s)) return '';
	return s;
}

function unique(list) {
	const out = [];
	for (let i = 0; i < list.length; i++) {
		if (!out.includes(list[i])) out.push(list[i]);
	}
	return out;
}

/**
 * Markdown-safe prose. Never paints `#`, `**`, fences, or link syntax.
 * Does not interpret markdown as HTML.
 * @param {unknown} raw
 * @returns {string}
 */
function stripMarkdown(raw) {
	let s = typeof raw === 'string' ? raw : '';
	if (!s) return '';
	s = s.replace(/```[\s\S]*?```/g, ' ');
	s = s.replace(/`([^`]+)`/g, '$1');
	s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
	s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
	s = s.replace(/^#{1,6}\s+/gm, '');
	s = s.replace(/^\s*>\s?/gm, '');
	s = s.replace(/^\s*[-*+]\s+/gm, '');
	s = s.replace(/^\s*\d+\.\s+/gm, '');
	s = s.replace(/(\*\*|__)([\s\S]*?)\1/g, '$2');
	s = s.replace(/(\*|_)([\s\S]*?)\1/g, '$2');
	s = s.replace(/~~([\s\S]*?)~~/g, '$1');
	s = s.replace(/[#*_~]+/g, ' ');
	return s.replace(/\s+/g, ' ').trim();
}

/**
 * Composed prose from a GET field. Strip markdown, collapse space,
 * cut at a sentence boundary rather than mid-claim when over max.
 * @param {unknown} raw
 * @param {number} [max]
 * @returns {string}
 */
function composeProse(raw, max) {
	const limit = typeof max === 'number' && max > 0 ? max : COMPOSE_MAX;
	const source = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : asText(raw);
	const s = stripMarkdown(source);
	if (!s) return '';
	if (s.length <= limit) return s;
	const cut = s.slice(0, limit);
	const last = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
	if (last >= Math.min(80, Math.floor(limit / 4))) return cut.slice(0, last + 1).trim();
	return cut.trim();
}

function languageLabel(raw) {
	const items = asList(raw);
	const out = [];
	for (let i = 0; i < items.length; i++) {
		const folded = items[i]
			.toLowerCase()
			.replace(/_/g, '-')
			.replace(/\s+/g, ' ')
			.trim();
		const mapped = LANGUAGE_LABEL[folded];
		if (mapped) {
			if (!out.includes(mapped)) out.push(mapped);
			continue;
		}
		if (/^[a-z]{2}(?:-[a-z]{2})?$/.test(folded)) continue;
		const prose = composeProse(items[i], 80);
		if (prose && !out.includes(prose)) out.push(prose);
	}
	return out.join(', ');
}

function isTagDump(text) {
	const s = composeProse(text);
	if (!s) return true;
	const words = s.split(/\s+/).length;
	if (/[.?!]/.test(s) && words >= 5) return false;
	const parts = s.split(/[,|;/•·]+/).map((x) => x.trim()).filter(Boolean);
	if (parts.length >= 3 && parts.every((p) => p.split(/\s+/).length <= 3)) return true;
	return false;
}

function audienceLooksWrong(audience, brand) {
	if (!TRADE_BLEED.test(audience)) return false;
	const identity = [
		asText(brand && brand.overview),
		asText(brand && brand.description),
		asText(brand && brand.services),
		asText(brand && brand.category),
	].join(' ');
	if (!composeProse(identity)) return false;
	const ctx = identity + ' ' + asText(brand && brand.name);
	return !TRADE_BLEED.test(ctx);
}

function paintTagline(raw) {
	const s = composeProse(raw, 180);
	if (!s) return '';
	if (/^https?:\/\//i.test(s) || /^www\./i.test(s)) return '';
	if (/security verification|verify you are human|just a moment|cloudflare|unusual traffic/i.test(s)) {
		return '';
	}
	return s;
}

/**
 * Live building GET headings (English strings) and id aliases.
 * Order is WAIT_BEAT_HEADINGS. scrape_started / pages_read / tokens_ready → ''.
 * @param {unknown} raw
 * @returns {string}
 */
function foldBeatHeading(raw) {
	const collapsed = String(raw || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ');
	if (!collapsed) return '';

	if (collapsed === 'what this business is') return 'framing';
	if (collapsed === 'who it is for') return 'audience';
	if (collapsed === 'what it offers') return 'services';
	if (collapsed === 'the problem it solves') return 'problem';
	if (collapsed === 'why it wins') return 'UVP';

	const id = collapsed.replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
	if (id === 'framing' || id === 'messaging') return 'framing';
	if (id === 'audience') return 'audience';
	if (id === 'services') return 'services';
	if (id === 'problem') return 'problem';
	if (id === 'uvp') return 'UVP';
	return '';
}

function beatText(raw) {
	if (raw == null) return '';
	if (typeof raw === 'string' || typeof raw === 'number') {
		return composeProse(String(raw), WAIT_COMPOSE_MAX);
	}
	if (Array.isArray(raw)) return '';
	if (typeof raw === 'object') {
		return composeProse(
			raw.text || raw.value || raw.body || raw.message || raw.copy,
			WAIT_COMPOSE_MAX,
		);
	}
	return '';
}

function admitBeat(into, headingRaw, textRaw) {
	const heading = foldBeatHeading(headingRaw);
	const text = beatText(textRaw);
	if (!heading || !text) return;
	into[heading] = text;
}

function admitProgress(into, progress) {
	if (progress == null) return;
	if (typeof progress === 'string' || typeof progress === 'number') return;
	if (Array.isArray(progress)) {
		for (let i = 0; i < progress.length; i++) admitProgress(into, progress[i]);
		return;
	}
	if (typeof progress !== 'object') return;

	const ownHeading = progress.heading || progress.id || progress.key || progress.name || progress.beat;
	if (ownHeading) {
		admitBeat(
			into,
			ownHeading,
			progress.text || progress.value || progress.body || progress.message || progress.copy,
		);
	}

	const keys = Object.keys(progress);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (!foldBeatHeading(key)) continue;
		admitBeat(into, key, progress[key]);
	}
}

/**
 * Bind admitted wait beats from a building GET `progress` array.
 * Missing / empty text → omitted. Unknown headings ignored.
 * scrape_started / pages_read / tokens_ready never admit.
 * Empty → honest wait ladder, not invented theatre.
 * @param {object | null | undefined} body
 * @returns {{ heading: string, text: string }[]}
 */
function waitBeatsFromBody(body) {
	if (!body || typeof body !== 'object') return [];
	const into = Object.create(null);
	admitProgress(into, body.progress);
	const out = [];
	for (let i = 0; i < WAIT_BEAT_HEADINGS.length; i++) {
		const heading = WAIT_BEAT_HEADINGS[i];
		if (into[heading]) out.push({ heading, text: into[heading] });
	}
	return out;
}

function waitBeatHeadingKey(heading) {
	return WAIT_BEAT_HEADING_KEY[heading] || '';
}

/**
 * Entrance delay per card section, in DOM order.
 *
 * The founder has already watched some of these sentences type out. Re-
 * typing them on the card would be the fake replay the ready path
 * rightly refuses, and MOVING them would be worse than either — so
 * everything at or above the LAST watched section is instant, and only
 * what sits below it cascades in. The card opens looking like the wait
 * card and grows downward; nothing already being read is pushed around.
 *
 * With nothing watched — a thin site, a cookie replay — the whole card
 * is new to them and the cascade starts at the top.
 *
 * Returns a map rather than a list because Tailwind compiles arbitrary
 * values by scanning source: a delay class built at runtime does not
 * exist in the stylesheet, so the caller must set the CSS property.
 *
 * @param {string[]} ids section ids, in the order they are painted
 * @param {string[]} watched headings the founder saw type out
 * @param {boolean} [reduceMotion] everything lands at once
 * @returns {Record<string, number>} id -> delay in ms
 */
function revealDelays(ids, watched, reduceMotion) {
	const list = (Array.isArray(ids) ? ids : []).filter(
		(v) => typeof v === 'string' && v,
	);
	const out = {};
	if (!list.length) return out;
	const seen = new Set(
		(Array.isArray(watched) ? watched : []).filter(
			(v) => typeof v === 'string' && v,
		),
	);
	let lastWatched = -1;
	for (let i = 0; i < list.length; i++) {
		if (seen.has(list[i])) lastWatched = i;
	}
	// A gap between what was already on screen and what is new, so the
	// cascade reads as the card growing rather than as a late repaint.
	let step = lastWatched >= 0 ? 1 : 0;
	for (let i = 0; i < list.length; i++) {
		if (reduceMotion || i <= lastWatched) {
			out[list[i]] = 0;
			continue;
		}
		out[list[i]] = step * REVEAL_STEP_MS;
		step += 1;
	}
	return out;
}

function typedCountFor(typedChars, beat) {
	const map =
		typedChars && typeof typedChars === 'object'
			? typedChars
			: {};
	const n = Number(map[beat && beat.heading]);
	return Number.isFinite(n) && n > 0 ? n : 0;
}

function beatTextOf(beat) {
	return beat && typeof beat.text === 'string' ? beat.text : '';
}

/**
 * How many beats the wait card may paint: every finished beat, plus the
 * one currently being written, and nothing after it.
 *
 * The type-out used to advance EVERY incomplete beat on the same tick,
 * so three lines grew at once — which reads as a block filling in, not
 * as something being written. A typewriter writes one line at a time.
 *
 * A beat with no characters yet is not painted: an empty line under a
 * heading is not a beat arriving, it is a gap.
 *
 * @param {{heading:string,text:string}[]} beats
 * @param {Record<string, number>} typedChars
 * @param {boolean} [reduceMotion] show everything, settled
 * @returns {number}
 */
function visibleBeatCount(beats, typedChars, reduceMotion) {
	const list = Array.isArray(beats) ? beats : [];
	if (!list.length) return 0;
	if (reduceMotion) return list.length;
	let n = 0;
	for (let i = 0; i < list.length; i++) {
		const typed = typedCountFor(typedChars, list[i]);
		if (typed <= 0) break;
		n = i + 1;
		if (typed < beatTextOf(list[i]).length) break;
	}
	return n;
}

/**
 * True when nothing is mid-word. The ready card waits on this so a
 * sentence is never snatched away as it is being read — the swap used
 * to unmount the wait block the instant the payload landed, which on a
 * one-beat site meant 42 of 150 characters.
 *
 * Empty beats and reduceMotion are settled by definition, so a founder
 * who never had a type-out is never made to wait for one.
 *
 * @param {{heading:string,text:string}[]} beats
 * @param {Record<string, number>} typedChars
 * @param {boolean} [reduceMotion]
 * @returns {boolean}
 */
function beatsSettled(beats, typedChars, reduceMotion) {
	const list = Array.isArray(beats) ? beats : [];
	if (!list.length) return true;
	if (reduceMotion) return true;
	for (let i = 0; i < list.length; i++) {
		if (
			typedCountFor(typedChars, list[i]) <
			beatTextOf(list[i]).length
		) {
			return false;
		}
	}
	return true;
}

/**
 * Visible prefix while a beat types out. reduceMotion → full text.
 * @param {unknown} text
 * @param {unknown} charCount
 * @param {boolean} [reduceMotion]
 * @returns {string}
 */
function typedText(text, charCount, reduceMotion) {
	const s = typeof text === 'string' ? text : '';
	if (!s) return '';
	if (reduceMotion) return s;
	const n = Number(charCount);
	if (!Number.isFinite(n) || n <= 0) return '';
	if (n >= s.length) return s;
	return s.slice(0, Math.floor(n));
}

function overviewFromBrand(brand) {
	const overview = composeProse(asText(brand && brand.overview));
	if (overview) return overview;
	return composeProse(asText(brand && brand.description));
}

function httpsPhotos(brand) {
	return unique(asList(brand && brand.photos).map(httpsUrl).filter(Boolean));
}

function logoUrl(brand) {
	const a = httpsUrl(brand && brand.logoUrl);
	if (a) return a;
	return httpsUrl(brand && brand.logo);
}

function colorRow(brand) {
	const list = asList(brand && brand.colors)
		.map((c) => {
			const t = String(c).trim();
			if (!t) return '';
			return t.startsWith('#') ? t : '#' + t;
		})
		.filter(Boolean);
	return unique(list);
}

/**
 * Voice lead is the sentence. Chips are optional under it, not the hero.
 * @param {{ brand?: object, positioning?: object } | null | undefined} body
 */
function voiceFromBody(body) {
	const brand = (body && body.brand) || {};
	const positioning = (body && body.positioning) || {};
	const chips = asList(brand.voiceChips).map((c) => composeProse(c, 40)).filter(Boolean);
	let sentence = composeProse(asText(positioning.voice));
	if (Array.isArray(positioning.voice)) {
		sentence = composeProse(asList(positioning.voice).join(' '));
	}
	return { chips, sentence };
}

function hasFact(raw) {
	if (Array.isArray(raw)) return asList(raw).length > 0;
	return Boolean(asText(raw));
}

/** positioning[key] first; brand[key] if positioning is empty. */
function pickFolded(positioning, brand, key) {
	const fromPos = positioning && positioning[key];
	if (hasFact(fromPos)) return fromPos;
	return brand && brand[key];
}

function foldedFact(body, key) {
	const brand = (body && body.brand) || {};
	const positioning = (body && body.positioning) || {};
	return composeProse(asList(pickFolded(positioning, brand, key)).join(' '));
}

function audienceFromBody(body) {
	const brand = (body && body.brand) || {};
	const audience = foldedFact(body, 'audience');
	if (!audience) return '';
	if (isTagDump(audience)) return '';
	if (audienceLooksWrong(audience, brand)) return '';
	return audience;
}

/**
 * Posting Schedule = the platforms they picked (or Decide = both offered).
 * Never cadence prose.
 * @param {unknown} selected
 * @returns {string[]}
 */
function scheduleFromPick(selected) {
	return normalizeChoice(selected).platforms;
}

function collapsedLine(raw) {
	return String(raw || '')
		.trim()
		.toLowerCase()
		.replace(/[—–−]/g, '-')
		.replace(/\s+/g, ' ');
}

/**
 * Moil chrome, site nav, and listing-directory pills. Kyle's eight Unique
 * CTA chips (Claim listing, HVAC Open Buda page, …) are the fail this
 * refuses. A real shop CTA ("Book a job", "Get a quote") passes.
 * @param {unknown} raw
 * @returns {boolean}
 */
function isMoilNavLine(raw) {
	const s = asText(raw);
	if (!s) return true;
	const n = collapsedLine(s);
	if (/\bmoil\b/i.test(s)) return true;
	if (/what is moil/.test(n)) return true;
	if (/start free/.test(n)) return true;
	if (/no credit card/.test(n)) return true;
	if (/how it works/.test(n)) return true;
	if (/claim(ed)?/.test(n) && /(listing|verified)/.test(n)) return true;
	if (/scan (my|your|the) shop/.test(n)) return true;
	if (/sample report/.test(n)) return true;
	if (/open .+\bpage/.test(n)) return true;
	if (/visibility (board|scan)/.test(n)) return true;
	if (/find a shop/.test(n)) return true;
	if (/local shops/.test(n)) return true;
	if (/hat score/.test(n)) return true;
	if (/^fix list$/.test(n)) return true;
	if (/^take control$/.test(n)) return true;
	if (/^ai visibility scan$/.test(n)) return true;
	if (/^(home|about|blog|features?|pricing|login|log in|sign in|sign up|get started|contact|menu|faq|careers?|privacy|terms)$/.test(n)) {
		return true;
	}
	return false;
}

function foldShopLines(raw, opts) {
	const max = (opts && opts.max) || FOLDED_LINE_MAX;
	const requireSentence = Boolean(opts && opts.requireSentence);
	const out = [];
	const list = asList(raw);
	for (let i = 0; i < list.length; i++) {
		const line = list[i];
		if (isMoilNavLine(line)) continue;
		if (requireSentence && line.length < 18 && !/[.?!]/.test(line)) continue;
		if (out.includes(line)) continue;
		out.push(line);
		if (out.length >= max) break;
	}
	return out;
}

function foldShopCtas(raw) {
	return foldShopLines(raw, { max: FOLDED_LINE_MAX });
}

function foldShopSlogans(raw) {
	return foldShopLines(raw, { max: FOLDED_LINE_MAX, requireSentence: true });
}

/**
 * The five wait sentences, as ready prose. Empty omitted. Overview is
 * composed overview, not wait-beat framing / messaging. No type-out:
 * this is the ready payload, not a fake replay of wait.
 * @param {{ brand?: object, positioning?: object } | null | undefined} body
 * @returns {{ heading: string, text: string }[]}
 */
function knowingLeadFromBody(body) {
	const brand = (body && body.brand) || {};
	const out = [];
	const framing = overviewFromBrand(brand);
	if (framing) out.push({ heading: 'framing', text: framing });
	const audience = audienceFromBody(body);
	if (audience) out.push({ heading: 'audience', text: audience });
	const services = composeProse(asText(brand.services));
	if (services) out.push({ heading: 'services', text: services });
	const problem = foldedFact(body, 'problem');
	if (problem) out.push({ heading: 'problem', text: problem });
	let uvp = foldedFact(body, 'uvp') || foldedFact(body, 'UVP');
	if (uvp && problem && collapsedLine(uvp) === collapsedLine(problem)) uvp = '';
	if (uvp) out.push({ heading: 'UVP', text: uvp });
	return out;
}

function proofFromBrand(brand) {
	const logo = logoUrl(brand);
	const colors = colorRow(brand);
	const photos = httpsPhotos(brand);
	if (!logo && !colors.length && !photos.length) return null;
	return { id: 'proof', kind: 'proof', logo, colors, photos };
}

/**
 * @param {{ brand?: object, positioning?: object, content?: object } | null | undefined} body
 * @param {{ selected?: string[] }} [opts]
 */
function profileSections(body, opts) {
	const brand = (body && body.brand) || {};
	const positioning = (body && body.positioning) || {};
	const selected = opts && Array.isArray(opts.selected) ? opts.selected : [];
	const byId = Object.create(null);

	const name = asText(brand.name);
	if (name) byId.name = { id: 'name', kind: 'text', value: name };

	const lead = knowingLeadFromBody(body);
	for (let i = 0; i < lead.length; i++) {
		byId[lead[i].heading] = { id: lead[i].heading, kind: 'text', value: lead[i].text };
	}

	const tagline = paintTagline(brand.tagline);
	if (tagline) byId.tagline = { id: 'tagline', kind: 'text', value: tagline };

	const terms = unique(
		asList(pickFolded(positioning, brand, 'keyTerms'))
			.map((t) => composeProse(t, 40))
			.filter(Boolean),
	).slice(0, 8);
	if (terms.length) byId.keyTerms = { id: 'keyTerms', kind: 'list', value: terms };

	const language = languageLabel(pickFolded(positioning, brand, 'language') || brand.language);
	if (language) byId.language = { id: 'language', kind: 'text', value: language };

	const cadence = foldedFact(body, 'cadence');
	if (cadence) byId.cadence = { id: 'cadence', kind: 'text', value: cadence };

	const trust = unique(
		asList(pickFolded(positioning, brand, 'trustSignals'))
			.map((t) => composeProse(t, 180))
			.filter(Boolean),
	).slice(0, 3);
	if (trust.length) {
		byId.trustSignals =
			trust.length === 1
				? { id: 'trustSignals', kind: 'text', value: trust[0] }
				: { id: 'trustSignals', kind: 'line', value: trust };
	}

	const ctas = foldShopCtas(brand.ctas);
	if (ctas.length) byId.ctas = { id: 'ctas', kind: 'line', value: ctas };

	const slogans = foldShopSlogans(brand.slogans);
	if (slogans.length) byId.slogans = { id: 'slogans', kind: 'line', value: slogans };

	const voice = voiceFromBody(body);
	if (voice.chips.length || voice.sentence) {
		byId.voice = {
			id: 'voice',
			kind: 'voice',
			chips: voice.chips,
			sentence: voice.sentence,
		};
	}

	const proof = proofFromBrand(brand);
	if (proof) byId.proof = proof;

	const schedule = scheduleFromPick(selected);
	if (schedule.length) {
		byId.schedule = { id: 'schedule', kind: 'platforms', value: schedule };
	}

	const sections = [];
	for (let i = 0; i < SECTION_ORDER.length; i++) {
		const id = SECTION_ORDER[i];
		if (BANNED_HEADING_IDS.indexOf(id) !== -1) continue;
		if (byId[id]) sections.push(byId[id]);
	}
	return sections;
}

function headingKeyFor(id) {
	return HEADING_KEY[id] || '';
}

module.exports = {
	WAIT_BEAT_HEADINGS,
	WAIT_BEAT_HEADING_KEY,
	TYPEOUT_MS_PER_CHAR,
	TYPEOUT_FLUSH_MS_PER_CHAR,
	READY_HOLD_MAX_MS,
	REVEAL_STEP_MS,
	SECTION_ORDER,
	HEADING_KEY,
	BANNED_HEADING_IDS,
	FOLDED_LINE_MAX,
	COMPOSE_MAX,
	WAIT_COMPOSE_MAX,
	asText,
	asList,
	httpsUrl,
	stripMarkdown,
	composeProse,
	languageLabel,
	foldBeatHeading,
	waitBeatsFromBody,
	waitBeatHeadingKey,
	visibleBeatCount,
	beatsSettled,
	revealDelays,
	typedText,
	overviewFromBrand,
	httpsPhotos,
	logoUrl,
	colorRow,
	voiceFromBody,
	scheduleFromPick,
	isMoilNavLine,
	foldShopCtas,
	foldShopSlogans,
	knowingLeadFromBody,
	proofFromBrand,
	profileSections,
	headingKeyFor,
};
