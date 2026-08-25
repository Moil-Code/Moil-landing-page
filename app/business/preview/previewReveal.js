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
	const folded = fold(text);
	for (let i = 0; i < INTERSTITIAL.length; i++) {
		if (folded.includes(INTERSTITIAL[i])) return '';
	}
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

module.exports = {
	sanitizeTagline,
	readyBrandName,
	canShowReadyCard,
	websiteFieldDecision,
	INTERSTITIAL,
	SEO_JUNK,
};
