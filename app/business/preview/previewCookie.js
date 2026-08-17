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
	};
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
		'; Path=/; SameSite=Lax';
}

/**
 * @param {{ cookie?: string }} [doc]
 */
function clearPreviewSlugCookie(doc) {
	const target = doc || (typeof document !== 'undefined' ? document : null);
	if (!target || typeof target.cookie !== 'string') return;
	target.cookie =
		PREVIEW_SLUG_COOKIE + '=; Max-Age=0; Path=/; SameSite=Lax';
}

module.exports = {
	PREVIEW_SLUG_COOKIE,
	PREVIEW_SLUG_MAX_AGE,
	previewCookieOptions,
	setPreviewSlugCookie,
	clearPreviewSlugCookie,
};
