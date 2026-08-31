'use strict';

/**
 * Landing magnet reveal helpers. Pure. No I/O.
 *
 * Website is the only door. A social URL in that field is a
 * stop — never a handle generate, never a door switch.
 */

const INTERSTITIAL = [
	'verifying your access',
	'just a moment',
	'checking your browser',
	'attention required',
	'enable javascript',
	'cloudflare',
	'ddos protection',
	'please wait',
	// Ruiz GET 0a44dfcf painted these as the shop tagline / captions.
	'performing security verification',
	'security verification',
	'needs review',
	'verify you are human',
	'unusual traffic',
];

const SEO_JUNK = [
	'ai marketing for small business',
	'ai co-founder',
	'moil360',
	'stop wearing every hat',
	"you're the marketing team",
];

function fold(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/[\u2018\u2019]/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function isSingleRawUrl(value) {
	const text = String(value || '').trim();
	if (!text || /\s/.test(text)) return false;
	if (/^https?:\/\/\S+$/i.test(text)) return true;
	if (/^www\.\S+$/i.test(text)) return true;
	return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}$/i.test(text);
}

function isInterstitial(raw) {
	const folded = fold(raw);
	if (!folded) return false;
	for (let i = 0; i < INTERSTITIAL.length; i++) {
		if (folded.includes(INTERSTITIAL[i])) return true;
	}
	return false;
}

const HOST_LEAD =
	/^(?:https?:\/\/)?(?:www\.)?[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(?:\/[^\s]*)?/i;

/** Strip a leading URL/host and an optional dash/colon so "ruizsalon.com — junk" can be judged. */
function remainderAfterLeadingHost(text) {
	const t = asText(text);
	const m = t.match(HOST_LEAD);
	if (!m) return t;
	return t.slice(m[0].length).replace(/^\s*[—–\-|:]\s*/, '').trim();
}

/**
 * Empty string means omit the descriptor. Interstitials, our
 * own SEO lines, whitespace, and a lone URL all count as empty.
 * @param {unknown} raw
 * @returns {string}
 */
function sanitizeTagline(raw) {
	if (typeof raw !== 'string') return '';
	const text = raw.trim();
	if (!text) return '';
	if (isSingleRawUrl(text)) return '';
	if (isInterstitial(text)) return '';
	const folded = fold(text);
	for (let j = 0; j < SEO_JUNK.length; j++) {
		if (folded.includes(SEO_JUNK[j])) return '';
	}
	return text;
}

function readyBrandName(brand) {
	const name = brand && typeof brand.name === 'string' ? brand.name.trim() : '';
	return name;
}

function canShowReadyCard(brand) {
	return Boolean(readyBrandName(brand));
}

/**
 * What the website field should do with a readWebsite() result.
 * Social is always a stop. Never returns a handle generate.
 * @param {{ ok?: boolean, reason?: string, website?: string } | null | undefined} read
 */
function websiteFieldDecision(read) {
	if (read && read.ok && read.website) {
		return { kind: 'submit', website: read.website };
	}
	if (read && read.reason === 'is_social') {
		return { kind: 'refuse_social' };
	}
	return { kind: 'refuse_website' };
}

function asText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function asList(value) {
	if (Array.isArray(value)) {
		return value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
	}
	const single = asText(value);
	return single ? [single] : [];
}

function pickFolded(positioning, brand, key) {
	const fromPos = positioning && positioning[key];
	if (fromPos != null && fromPos !== '') return fromPos;
	return brand && brand[key];
}

/**
 * Positioning lives on the ready body OR folded onto brand. Omit the
 * whole block when every field is missing. Voice / keyTerms tolerate
 * string or string[].
 * @param {{ positioning?: object, brand?: object } | null | undefined} body
 */
function readPositioning(body) {
	const positioning = (body && body.positioning) || {};
	const brand = (body && body.brand) || {};
	const audience = asText(pickFolded(positioning, brand, 'audience'));
	const problem = asText(pickFolded(positioning, brand, 'problem'));
	const cadence = asText(pickFolded(positioning, brand, 'cadence'));
	const voice = asList(pickFolded(positioning, brand, 'voice'));
	const keyTerms = asList(pickFolded(positioning, brand, 'keyTerms'));
	return {
		audience,
		problem,
		cadence,
		voice,
		keyTerms,
		present: Boolean(audience || problem || cadence || voice.length || keyTerms.length),
	};
}

function shopProducts(brand) {
	return asList(brand && brand.products);
}

function shopDescriptor(brand) {
	if (!brand) return '';
	return sanitizeTagline(brand.tagline) || sanitizeTagline(brand.description);
}

function shopFact(brand, key) {
	return asText(brand && brand[key]);
}

function hostOf(raw) {
	const s = asText(raw);
	if (!s) return '';
	try {
		const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
		return u.hostname.replace(/^www\./i, '').toLowerCase();
	} catch {
		return '';
	}
}

/**
 * A caption that is a URL, a host, a handle-echo, or bot-check /
 * interstitial copy is not a post. Real captions with real words stay.
 * @param {unknown} caption
 * @param {{ website?: string, handle?: string } | null | undefined} brand
 */
function captionIsUrlOrEcho(caption, brand) {
	const text = asText(caption);
	if (!text) return false;
	if (isInterstitial(text)) return true;
	if (isSingleRawUrl(text)) return true;
	const rest = remainderAfterLeadingHost(text);
	if (rest !== text && (!rest || isInterstitial(rest))) return true;
	if (!/\s/.test(text)) {
		if (/^@[\w.]+$/.test(text)) return true;
		if (
			/^(https?:\/\/)?(www\.)?[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(?:\/\S*)?$/i.test(
				text,
			)
		) {
			return true;
		}
	}
	const handle = asText(brand && brand.handle).replace(/^@/, '');
	if (handle && fold(text).replace(/^@/, '') === fold(handle)) return true;
	const siteHost = hostOf(brand && brand.website);
	if (siteHost && !/\s/.test(text) && fold(text).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') === siteHost) {
		return true;
	}
	return false;
}

const CREATIVE_KEYS = ['imageUrl', 'image', 'creativeUrl'];

/**
 * Accept common creative URL keys. Do not invent a URL.
 * @param {object | null | undefined} post
 * @returns {string}
 */
function creativeUrlFromPost(post) {
	if (!post || typeof post !== 'object') return '';
	for (let i = 0; i < CREATIVE_KEYS.length; i++) {
		const raw = post[CREATIVE_KEYS[i]];
		if (typeof raw === 'string' && /^https?:\/\//i.test(raw.trim())) return raw.trim();
		if (raw && typeof raw === 'object' && typeof raw.url === 'string' && /^https?:\/\//i.test(raw.url.trim())) {
			return raw.url.trim();
		}
	}
	return '';
}

/**
 * 0–3 real posts. URL / host / interstitial / "(needs review)"
 * captions are skipped. Never invents a caption. Empty after the
 * filter → no stack. Image URL is optional.
 * @param {{ posts?: unknown[] } | null | undefined} content
 * @param {object | null | undefined} brand
 */
function realPosts(content, brand) {
	const posts = content && Array.isArray(content.posts) ? content.posts : [];
	const out = [];
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		if (!post || typeof post !== 'object') continue;
		const caption = asText(post.caption);
		if (!caption || captionIsUrlOrEcho(caption, brand)) continue;
		out.push({
			caption,
			imageUrl: creativeUrlFromPost(post),
		});
		if (out.length >= 3) break;
	}
	return out;
}

/**
 * Bind a real scrape progress string when GET starts sending one.
 * Status enums are not progress. Do not invent theatre lines.
 * @param {object | null | undefined} body
 * @returns {string}
 */
function progressFromBody(body) {
	if (!body || typeof body !== 'object') return '';
	const known = /^(building|ready|failed|accepted|missing|down|identity|ceiling|ok)$/i;
	const keys = ['progress', 'progressMessage', 'statusMessage', 'message', 'status'];
	for (let i = 0; i < keys.length; i++) {
		const s = asText(body[keys[i]]);
		if (!s || known.test(s)) continue;
		return s;
	}
	return '';
}

module.exports = {
	sanitizeTagline,
	readyBrandName,
	canShowReadyCard,
	websiteFieldDecision,
	readPositioning,
	shopProducts,
	shopDescriptor,
	shopFact,
	captionIsUrlOrEcho,
	creativeUrlFromPost,
	realPosts,
	progressFromBody,
	isInterstitial,
	INTERSTITIAL,
	SEO_JUNK,
};
