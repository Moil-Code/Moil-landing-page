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

/** Bind only these if a building GET exposes them as progress/step ids. */
const WAIT_STEP_IDS = Object.freeze([
	'scrape_started',
	'pages_read',
	'tokens_ready',
]);

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

function foldStepId(raw) {
	return String(raw || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '_');
}

function collectStepIds(raw, into) {
	if (raw == null || raw === false) return;
	if (typeof raw === 'string' || typeof raw === 'number') {
		const id = foldStepId(raw);
		if (WAIT_STEP_IDS.includes(id) && !into.includes(id)) into.push(id);
		return;
	}
	if (Array.isArray(raw)) {
		for (let i = 0; i < raw.length; i++) collectStepIds(raw[i], into);
		return;
	}
	if (typeof raw === 'object') {
		collectStepIds(raw.id || raw.step || raw.event || raw.progress || raw.name, into);
		if (raw.events) collectStepIds(raw.events, into);
		if (raw.steps) collectStepIds(raw.steps, into);
	}
}

/**
 * Bind scrape_started / pages_read / tokens_ready when the building GET
 * exposes them. posts_composing is never a wait step. Empty → honest wait.
 * @param {object | null | undefined} body
 * @returns {string[]}
 */
function waitStepsFromBody(body) {
	if (!body || typeof body !== 'object') return [];
	const hits = [];
	collectStepIds(body.events, hits);
	collectStepIds(body.steps, hits);
	collectStepIds(body.progress, hits);
	collectStepIds(body.step, hits);
	collectStepIds(body.stage, hits);
	collectStepIds(body.progressStep, hits);
	for (let i = 0; i < WAIT_STEP_IDS.length; i++) {
		const id = WAIT_STEP_IDS[i];
		const v = body[id];
		if (v && v !== 'false' && v !== 0) {
			if (!hits.includes(id)) hits.push(id);
		}
		if (body.progress && typeof body.progress === 'object' && body.progress[id]) {
			if (!hits.includes(id)) hits.push(id);
		}
	}
	return WAIT_STEP_IDS.filter((id) => hits.includes(id));
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
	WAIT_STEP_IDS,
	SECTION_ORDER,
	HEADING_KEY,
	BANNED_HEADING_IDS,
	asText,
	asList,
	httpsUrl,
	waitStepsFromBody,
	overviewFromBrand,
	httpsPhotos,
	logoUrl,
	colorRow,
	voiceFromBody,
	scheduleFromPick,
	profileSections,
	headingKeyFor,
};
