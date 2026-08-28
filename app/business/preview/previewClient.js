'use strict';

/**
 * Public magnet client. Talks only to same-origin /plan/preview.
 *
 * POST is a SUBMIT. GET is a VIEW. Views never generate —
 * there is no generate-named function in this file, and
 * viewPreview only issues GET.
 *
 * The browser never fetches NEXT_PUBLIC_PLAN_API_ORIGIN. The
 * next.config.js rewrite sends /plan/preview to PLAN_API_ORIGIN
 * (server-only). Fetch failure is the down-state.
 *
 * Register / login come from NEXT_PUBLIC_REGISTER_ORIGIN.
 * Unset, that origin is production https://business.moilapp.com
 * so www stays safe if the env is missing.
 *
 * This module never throws; callers always get a result object.
 */

const DEFAULT_REGISTER_ORIGIN = 'https://business.moilapp.com';

function normalizeOrigin(raw) {
	if (typeof raw !== 'string') return '';
	return raw.trim().replace(/\/+$/, '');
}

function getRegisterOrigin(env) {
	// Next only inlines a static process.env.NEXT_PUBLIC_* member.
	// A dynamic lookup leaves the client bundle empty and every CTA
	// falls back to production.
	const raw = env
		? (env.NEXT_PUBLIC_REGISTER_ORIGIN || '')
		: (process.env.NEXT_PUBLIC_REGISTER_ORIGIN || '');
	return normalizeOrigin(raw) || DEFAULT_REGISTER_ORIGIN;
}

function getRegisterUrl(env) {
	return getRegisterOrigin(env) + '/register';
}

function getLoginUrl(env) {
	return getRegisterOrigin(env) + '/login';
}

const REGISTER_ORIGIN = getRegisterUrl();

function previewSubmitUrl() {
	return '/plan/preview';
}

function previewViewUrl(slug) {
	const s = typeof slug === 'string' ? slug.trim() : '';
	if (!s) return null;
	return '/plan/preview/' + encodeURIComponent(s);
}

/**
 * Register URL. Always valid. Adds ?preview= only when a slug exists.
 * Language is applied via appendLang (the existing helper) when provided.
 *
 * @param {{ lang?: 'en'|'es', previewSlug?: string, appendLang?: function, env?: Record<string, string|undefined> }} [opts]
 */
function buildRegisterUrl(opts) {
	const o = opts && typeof opts === 'object' ? opts : {};
	const slug = typeof o.previewSlug === 'string' ? o.previewSlug.trim() : '';
	let url = getRegisterUrl(o.env);
	if (slug) {
		try {
			const u = new URL(url);
			u.searchParams.set('preview', slug);
			url = u.toString();
		} catch {
			url = url + '?preview=' + encodeURIComponent(slug);
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
async function submitPreview(body, fetchFn) {
	const url = previewSubmitUrl();
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
async function viewPreview(slug, fetchFn) {
	const url = previewViewUrl(slug);
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
	DEFAULT_REGISTER_ORIGIN,
	REGISTER_ORIGIN,
	normalizeOrigin,
	getRegisterOrigin,
	getRegisterUrl,
	getLoginUrl,
	previewSubmitUrl,
	previewViewUrl,
	buildRegisterUrl,
	websiteSubmitBody,
	placeSubmitBody,
	handleSubmitBody,
	submitPreview,
	viewPreview,
};
