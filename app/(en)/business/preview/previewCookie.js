'use strict';

/**
 * First-party preview slug cookie.
 *
 * Name is load-bearing: Phase 3 claimForSession will read
 * `preview_slug`. Lax, 7 days, path `/`. No Domain attribute —
 * this is first-party on the landing host. Cross-subdomain
 * handoff is `?preview=` on the register URL, not this cookie.
 */

const PREVIEW_SLUG_COOKIE = 'preview_slug';
const PREVIEW_SLUG_MAX_AGE = 7 * 24 * 60 * 60;

function previewCookieOptions() {
	return {
		maxAge: PREVIEW_SLUG_MAX_AGE,
		sameSite: 'lax',
		path: '/',
		secure: true,
	};
}

/**
 * `Secure` is appended only on an https page: a browser silently DROPS a
 * Secure cookie written from an http origin (localhost dev), which would make
 * the resume-a-finished-preview path fail exactly where it is tested by hand.
 * Production is https-only (HSTS), so the attribute is always present there.
 */
function secureSuffix(doc) {
	const loc =
		(doc && doc.location) ||
		(typeof location !== 'undefined' ? location : null);
	return loc && loc.protocol === 'https:' ? '; Secure' : '';
}

/**
 * @param {string} slug
 * @param {{ cookie?: string }} [doc]
 */
function setPreviewSlugCookie(slug, doc) {
	const value = typeof slug === 'string' ? slug.trim() : '';
	if (!value) return;
	const target = doc || (typeof document !== 'undefined' ? document : null);
	if (!target || typeof target.cookie !== 'string') return;
	target.cookie =
		PREVIEW_SLUG_COOKIE +
		'=' +
		encodeURIComponent(value) +
		'; Max-Age=' +
		PREVIEW_SLUG_MAX_AGE +
		'; Path=/; SameSite=Lax' +
		secureSuffix(target);
}

/**
 * The slug this browser last asked for, or ''.
 *
 * Without this the cookie was write-only. The generate envelope runs to
 * fifteen minutes and the copy tells people to leave the page — so the
 * common path was: submit, leave, come back, and find an empty form with a
 * finished preview sitting on the server that nothing could reach.
 *
 * @param {{ cookie?: string }} [doc]
 * @returns {string}
 */
function readPreviewSlugCookie(doc) {
	const target = doc || (typeof document !== 'undefined' ? document : null);
	if (!target || typeof target.cookie !== 'string') return '';
	const parts = target.cookie.split(';');
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();
		if (part.indexOf(PREVIEW_SLUG_COOKIE + '=') !== 0) continue;
		const raw = part.slice(PREVIEW_SLUG_COOKIE.length + 1);
		let value = '';
		try {
			value = decodeURIComponent(raw);
		} catch (_e) {
			value = raw;
		}
		value = value.trim();
		// Same shape the slug is minted in. A cookie someone hand-edited must
		// not become a path segment on the API origin.
		return /^[A-Za-z0-9_-]{1,128}$/.test(value) ? value : '';
	}
	return '';
}

/**
 * @param {{ cookie?: string }} [doc]
 */
function clearPreviewSlugCookie(doc) {
	const target = doc || (typeof document !== 'undefined' ? document : null);
	if (!target || typeof target.cookie !== 'string') return;
	target.cookie =
		PREVIEW_SLUG_COOKIE +
		'=; Max-Age=0; Path=/; SameSite=Lax' +
		secureSuffix(target);
}

module.exports = {
	PREVIEW_SLUG_COOKIE,
	PREVIEW_SLUG_MAX_AGE,
	previewCookieOptions,
	setPreviewSlugCookie,
	readPreviewSlugCookie,
	clearPreviewSlugCookie,
};
