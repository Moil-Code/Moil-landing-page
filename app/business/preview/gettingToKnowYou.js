'use strict';

/**
 * Getting To Know You — paint plan from a ready GET body.
 *
 * Capture order, one heading per filled field. Empty omitted.
 * Does not invent narrationPov / uvp / trustSignals headings.
 * Does not paint content.posts. Cadence is never Posting Schedule.
 *
 * leftover-4 dest HOLD: this module does not persist. Hydrate lives on
 * Onboarding. Local edits in the card die with the session.
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

const SECTION_ORDER = Object.freeze([
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
]);

const HEADING_KEY = Object.freeze({
	name: 'headingName',
	overview: 'headingOverview',
	products: 'headingProducts',
	services: 'headingServices',
	messaging: 'headingMessaging',
	ctas: 'headingCtas',
	slogans: 'headingSlogans',
	voice: 'headingVoice',
	logo: 'headingLogo',
	colors: 'headingColors',
	photos: 'headingPhotos',
	schedule: 'headingSchedule',
});

/** Never become section ids, even when the GET has values. */
const BANNED_HEADING_IDS = Object.freeze([
	'audience',
	'problem',
	'keyTerms',
	'language',
	'tagline',
	'cadence',
	'narrationPov',
	'uvp',
	'trustSignals',
	'posts',
]);

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
 * Admit a wait-beat heading. messaging → framing, uvp → UVP.
 * Unknown ids (including scrape_started / pages_read / tokens_ready) → ''.
 * @param {unknown} raw
 * @returns {string}
 */
function foldBeatHeading(raw) {
	const s = String(raw || '')
		.trim()
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9]+/g, '_');
	if (s === 'framing' || s === 'messaging') return 'framing';
	if (s === 'audience') return 'audience';
	if (s === 'services') return 'services';
	if (s === 'problem') return 'problem';
	if (s === 'uvp') return 'UVP';
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
 * Chips are the capture. positioning.voice as a sentence is secondary.
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

/**
 * Posting Schedule = the platforms they picked (or Decide = both offered).
 * Never cadence prose.
 * @param {unknown} selected
 * @returns {string[]}
 */
function scheduleFromPick(selected) {
	return normalizeChoice(selected).platforms;
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

	const overview = overviewFromBrand(brand);
	if (overview) sections.push({ id: 'overview', kind: 'text', value: overview });

	const products = asList(brand.products);
	if (products.length) {
		sections.push({ id: 'products', kind: 'list', value: products, observeOnly: true });
	}

	const services = asText(brand.services);
	if (services) {
		sections.push({ id: 'services', kind: 'text', value: services, observeOnly: true });
	}

	const messaging = asText(brand.messaging);
	if (messaging) sections.push({ id: 'messaging', kind: 'text', value: messaging });

	const ctas = asList(brand.ctas);
	if (ctas.length) sections.push({ id: 'ctas', kind: 'list', value: ctas });

	const slogans = asList(brand.slogans);
	if (slogans.length) sections.push({ id: 'slogans', kind: 'list', value: slogans });

	const voice = voiceFromBody(body);
	if (voice.chips.length || voice.sentence) {
		sections.push({
			id: 'voice',
			kind: 'voice',
			chips: voice.chips,
			sentence: voice.sentence,
		});
	}

	const logo = logoUrl(brand);
	if (logo) sections.push({ id: 'logo', kind: 'logo', value: logo });

	const colors = colorRow(brand);
	if (colors.length) sections.push({ id: 'colors', kind: 'colors', value: colors });

	const photos = httpsPhotos(brand);
	if (photos.length) sections.push({ id: 'photos', kind: 'photos', value: photos });

	const schedule = scheduleFromPick(selected);
	if (schedule.length) {
		sections.push({ id: 'schedule', kind: 'platforms', value: schedule });
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
	SECTION_ORDER,
	HEADING_KEY,
	BANNED_HEADING_IDS,
	asText,
	asList,
	httpsUrl,
	foldBeatHeading,
	waitBeatsFromBody,
	waitBeatHeadingKey,
	typedText,
	overviewFromBrand,
	httpsPhotos,
	logoUrl,
	colorRow,
	voiceFromBody,
	scheduleFromPick,
	profileSections,
	headingKeyFor,
};
