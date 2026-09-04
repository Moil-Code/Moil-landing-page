'use strict';

/**
 * Getting To Know You — paint plan from a ready GET body.
 *
 * Ready lead is the five wait sentences as composed prose (omit empty):
 * What this business is / Who it is for / What it offers / The problem it
 * solves / Why it wins. Unban uvp when GET has it. Unique CTAs and slogans
 * fold to one line from 1–2 real shop lines that are not Moil nav, or omit.
 * Voice: sentence first. Logo / colors / photos are a proof strip under
 * the knowing, not the story. Does not paint content.posts. Cadence is
 * never Posting Schedule.
 *
 * The posts magnet is ON and lives in `previewPosts.js` — a typed
 * strip, not a heading section, which is why `posts` stays in
 * BANNED_HEADING_IDS: that list stops a GET key becoming a text
 * heading, and the strip is a deliberate render rather than a walked
 * key.
 *
 * leftover-4 dest HOLD: this module does not persist. Hydrate lives on
 * Onboarding. Local edits in the card die with the session.
 * leftover-6, remaining OFF: no second scrape, no website builder. The
 * posts magnet is ON — see `previewPosts.js`.
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
	'audience',
	'services',
	'problem',
	'UVP',
	'ctas',
	'slogans',
	'voice',
	'proof',
	'schedule',
]);

const HEADING_KEY = Object.freeze({
	name: 'headingName',
	framing: 'waitBeatFraming',
	audience: 'waitBeatAudience',
	services: 'waitBeatServices',
	problem: 'waitBeatProblem',
	UVP: 'waitBeatUvp',
	ctas: 'headingCtas',
	slogans: 'headingSlogans',
	voice: 'headingVoice',
	proof: '',
	schedule: 'headingSchedule',
});

/** Never become section ids, even when the GET has values. */
const BANNED_HEADING_IDS = Object.freeze([
	'keyTerms',
	'language',
	'tagline',
	'cadence',
	'narrationPov',
	'trustSignals',
	'posts',
]);

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
	if (typeof raw === 'string' || typeof raw === 'number') return asText(raw);
	if (Array.isArray(raw)) return '';
	if (typeof raw === 'object') {
		return asText(raw.text || raw.value || raw.body || raw.message || raw.copy);
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
	const overview = asText(brand && brand.overview);
	const description = asText(brand && brand.description);
	return overview || description;
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
	const chips = asList(brand.voiceChips);
	let sentence = asText(positioning.voice);
	if (Array.isArray(positioning.voice)) {
		sentence = asList(positioning.voice).join(' ');
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
	return asList(pickFolded(positioning, brand, key)).join(' ');
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
 * The five wait sentences, as ready prose. Empty omitted. No type-out:
 * this is the ready payload, not a fake replay of wait.
 * @param {{ brand?: object, positioning?: object } | null | undefined} body
 * @returns {{ heading: string, text: string }[]}
 */
function knowingLeadFromBody(body) {
	const brand = (body && body.brand) || {};
	const out = [];
	const framing = overviewFromBrand(brand) || asText(brand.messaging);
	if (framing) out.push({ heading: 'framing', text: framing });
	const audience = foldedFact(body, 'audience');
	if (audience) out.push({ heading: 'audience', text: audience });
	const services = asText(brand.services);
	if (services) out.push({ heading: 'services', text: services });
	const problem = foldedFact(body, 'problem');
	if (problem) out.push({ heading: 'problem', text: problem });
	const uvp = foldedFact(body, 'uvp') || foldedFact(body, 'UVP');
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
	const selected = opts && Array.isArray(opts.selected) ? opts.selected : [];
	const sections = [];

	const name = asText(brand.name);
	if (name) sections.push({ id: 'name', kind: 'text', value: name });

	const lead = knowingLeadFromBody(body);
	for (let i = 0; i < lead.length; i++) {
		sections.push({ id: lead[i].heading, kind: 'text', value: lead[i].text });
	}

	const ctas = foldShopCtas(brand.ctas);
	if (ctas.length) sections.push({ id: 'ctas', kind: 'line', value: ctas });

	const slogans = foldShopSlogans(brand.slogans);
	if (slogans.length) sections.push({ id: 'slogans', kind: 'line', value: slogans });

	const voice = voiceFromBody(body);
	if (voice.chips.length || voice.sentence) {
		sections.push({
			id: 'voice',
			kind: 'voice',
			chips: voice.chips,
			sentence: voice.sentence,
		});
	}

	const proof = proofFromBrand(brand);
	if (proof) sections.push(proof);

	const schedule = scheduleFromPick(selected);
	if (schedule.length) {
		sections.push({ id: 'schedule', kind: 'platforms', value: schedule });
	}

	return sections;
}

function headingKeyFor(id) {
	if (WAIT_BEAT_HEADING_KEY[id]) return WAIT_BEAT_HEADING_KEY[id];
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
	asText,
	asList,
	httpsUrl,
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
