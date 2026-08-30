'use strict';

/**
 * Public magnet client. Talks only to /plan/preview.
 *
 * POST is a SUBMIT. GET is a VIEW. Views never generate —
 * there is no generate-named function in this file, and
 * viewPreview / pollPreviewView only issue GET.
 *
 * If the origin is unset the form takes the down-state.
 * This module never throws; callers always get a result object.
 */

const REGISTER_ORIGIN = 'https://business.moilapp.com/register';

// The picker's own offer list — the ONE authority on what may be named here.
const { isOffered } = require('./platformChoice');

function normalizeOrigin(raw) {
	if (typeof raw !== 'string') return '';
	return raw.trim().replace(/\/+$/, '');
}

function getPlanApiOrigin(env) {
	const raw = env
		? (env.NEXT_PUBLIC_PLAN_API_ORIGIN || '')
		: (process.env.NEXT_PUBLIC_PLAN_API_ORIGIN || '');
	return normalizeOrigin(raw);
}

function isPlanApiConfigured(origin) {
	if (origin === undefined) return Boolean(getPlanApiOrigin());
	return Boolean(normalizeOrigin(origin));
}

function previewSubmitUrl(origin) {
	const o = normalizeOrigin(origin);
	return o ? o + '/plan/preview' : null;
}

function previewViewUrl(origin, slug) {
	const o = normalizeOrigin(origin);
	const s = typeof slug === 'string' ? slug.trim() : '';
	if (!o || !s) return null;
	return o + '/plan/preview/' + encodeURIComponent(s);
}

/**
 * Register URL. Always valid. Adds ?preview= only when a slug exists, and
 * ?platforms= only when the founder actually CHOSE.
 *
 * ── WHY THE PLATFORM CHOICE RIDES THE URL ──────────────────────────────────
 *
 * The picker is anonymous and pre-wall, so there is no identity to store it
 * against, and the obvious server-side home is wrong: `business_previews` is
 * ONE ROW PER BUSINESS (`identity_key` is UNIQUE precisely so a preview is
 * generated once and replayed forever). A preference stored there is another
 * visitor's answer — two people previewing the same restaurant would inherit
 * each other's picks, and whoever signed up would be seeded with a stranger's
 * choice, silently.
 *
 * So it crosses the origin the same way the slug does, on the same hop, and
 * is captured into the same app-origin store. It is a preference for the
 * founder's own account and carries no privilege; the backend refuses
 * anything its scheduler cannot publish to
 * (`service/preview/previewPlatformSeed.js`).
 *
 * "Decide for me" and an empty tick-list DELIBERATELY send nothing. Sending
 * the resolved pair would report a decision the founder never made and freeze
 * today's default into their account; absence lets the product keep choosing.
 *
 * Language is applied via appendLang (the existing helper) when provided.
 *
 * @param {{ lang?: 'en'|'es', previewSlug?: string, platforms?: string[], appendLang?: function }} [opts]
 */
function buildRegisterUrl(opts) {
	const o = opts && typeof opts === 'object' ? opts : {};
	const slug = typeof o.previewSlug === 'string' ? o.previewSlug.trim() : '';
	// Only ids this screen may OFFER travel. Anything else is dropped here as
	// well as at the server: a value the picker refuses must not reach a URL
	// a founder can see and read as a promise.
	const platforms = (Array.isArray(o.platforms) ? o.platforms : [])
		.map((p) => (typeof p === 'string' ? p.trim().toLowerCase() : ''))
		.filter((p, i, a) => p && isOffered(p) && a.indexOf(p) === i);
	let url = REGISTER_ORIGIN;
	if (slug) {
		try {
			const u = new URL(url);
			u.searchParams.set('preview', slug);
			url = u.toString();
		} catch {
			url = url + '?preview=' + encodeURIComponent(slug);
		}
	}
	if (platforms.length) {
		const value = platforms.join(',');
		try {
			const u = new URL(url);
			u.searchParams.set('platforms', value);
			url = u.toString();
		} catch {
			const sep = url.indexOf('?') >= 0 ? '&' : '?';
			url = url + sep + 'platforms=' + encodeURIComponent(value);
		}
	}
	const lang = o.lang === 'es' || o.lang === 'en' ? o.lang : 'en';
	if (typeof o.appendLang === 'function') {
		try {
			return o.appendLang(url, lang);
		} catch {
			// fall through — never break signup
		}
	}
	try {
		const u = new URL(url);
		u.searchParams.set('lg', lang);
		return u.toString();
	} catch {
		const sep = url.indexOf('?') >= 0 ? '&' : '?';
		return url + sep + 'lg=' + lang;
	}
}

function websiteSubmitBody(input) {
	const src = input && typeof input === 'object' ? input : {};
	const body = { website: String(src.website || '').trim() };
	if (src.email) body.email = String(src.email).trim();
	if (src.locale) body.locale = String(src.locale).trim();
	return body;
}

function placeSubmitBody(input) {
	const src = input && typeof input === 'object' ? input : {};
	const body = {
		placeId: String(src.placeId || '').trim(),
		businessName: String(src.businessName || '').trim(),
	};
	if (src.email) body.email = String(src.email).trim();
	if (src.locale) body.locale = String(src.locale).trim();
	return body;
}

function handleSubmitBody(input) {
	const src = input && typeof input === 'object' ? input : {};
	const body = { handle: String(src.handle || '').trim() };
	if (src.platform) body.platform = String(src.platform).trim();
	if (src.email) body.email = String(src.email).trim();
	if (src.locale) body.locale = String(src.locale).trim();
	return body;
}

function classifyHttp(status, json) {
	if (status === 200 && json && json.slug) {
		return { ok: true, kind: 'accepted', status, body: json };
	}
	if (status === 200 && json && json.status === 'ready') {
		return { ok: true, kind: 'ready', status, body: json };
	}
	if (status === 200 && json && (json.status === 'building' || json.status === 'failed')) {
		return { ok: true, kind: json.status, status, body: json };
	}
	if (status === 400) return { ok: false, kind: 'identity', status, body: json };
	if (status === 429) return { ok: false, kind: 'ceiling', status, body: json };
	if (status === 404) return { ok: false, kind: 'missing', status, body: json };
	return { ok: false, kind: 'down', status, body: json };
}

/**
 * POST /plan/preview. Never throws.
 */
async function submitPreview(origin, body, fetchFn) {
	const url = previewSubmitUrl(origin);
	if (!url) return { ok: false, kind: 'down', status: 0, body: null };
	const doFetch = fetchFn || (typeof fetch === 'function' ? fetch : null);
	if (!doFetch) return { ok: false, kind: 'down', status: 0, body: null };
	try {
		const res = await doFetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body || {}),
		});
		const json = await res.json().catch(() => null);
		return classifyHttp(res.status, json);
	} catch {
		return { ok: false, kind: 'down', status: 0, body: null };
	}
}

/**
 * GET /plan/preview/:slug. A VIEW. Never POSTs. Never generates.
 */
async function viewPreview(origin, slug, fetchFn) {
	const url = previewViewUrl(origin, slug);
	if (!url) return { ok: false, kind: 'down', status: 0, body: null };
	const doFetch = fetchFn || (typeof fetch === 'function' ? fetch : null);
	if (!doFetch) return { ok: false, kind: 'down', status: 0, body: null };
	try {
		const res = await doFetch(url, { method: 'GET' });
		const json = await res.json().catch(() => null);
		return classifyHttp(res.status, json);
	} catch {
		return { ok: false, kind: 'down', status: 0, body: null };
	}
}

module.exports = {
	REGISTER_ORIGIN,
	normalizeOrigin,
	getPlanApiOrigin,
	isPlanApiConfigured,
	previewSubmitUrl,
	previewViewUrl,
	buildRegisterUrl,
	websiteSubmitBody,
	placeSubmitBody,
	handleSubmitBody,
	submitPreview,
	viewPreview,
};
