'use strict';

/**
 * Landing-page presence beacon — the pure half.
 *
 * The admin "Active users" page shows who is on the site right now. Signed-in
 * founders are seen by the app's heartbeat; a visitor on a landing page has no
 * account, so the gateway's `POST /api/presence/visit` records them under a
 * browser-minted visitor id (`vid`). When the browser also carries the app's
 * jwt cookie (it is set on `.moilapp.com`), the gateway records the visit as
 * that signed-in user instead.
 *
 * Rules:
 * - CONSENT DECIDES HOW LONG THE ID LIVES, never whether a visit is counted.
 *   An "accepted" visitor gets a persistent `moil_vid` cookie on
 *   `.moilapp.com`, which the app reads after sign-up so the landing visits
 *   can be tied to the account. Anyone else gets a per-tab id in
 *   sessionStorage: an anonymous count of people on a page, with nothing that
 *   follows them between visits or across sites.
 * - NO ORIGIN, NO BEACON. The gateway host is configuration
 *   (`NEXT_PUBLIC_MOIL_GATEWAY_ORIGIN`). A guessed host would send every
 *   visit to the wrong place, so unset means off.
 * - The body is text/plain, so the request needs no CORS preflight.
 * - The referrer is sent as its host only (`https://<host>`): the gateway
 *   keeps the host and drops the rest, and we drop it first.
 */

const VISITOR_COOKIE = 'moil_vid';
const VISITOR_STORAGE_KEY = 'moil_vid';
const VISIT_PATH = '/api/presence/visit';
const BEAT_MS = 60 * 1000;
const COOKIE_MAX_AGE_SEC = 365 * 24 * 60 * 60;
const VID_RE = /^[A-Za-z0-9_-]{16,64}$/;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function isVisitorId(v) {
	return typeof v === 'string' && VID_RE.test(v);
}

/** 22 url-safe characters. `random(n)` returns n bytes (crypto in the browser). */
function mintVisitorId(random) {
	const bytes = random(22);
	let out = '';
	for (let i = 0; i < 22; i += 1) out += ALPHABET[bytes[i] & 63];
	return out;
}

function readCookie(name, cookieString) {
	const parts = String(cookieString || '').split(';');
	for (const part of parts) {
		const i = part.indexOf('=');
		if (i < 0) continue;
		if (part.slice(0, i).trim() === name) {
			try {
				return decodeURIComponent(part.slice(i + 1).trim());
			} catch {
				return '';
			}
		}
	}
	return '';
}

/**
 * Cookie domain for a host: `.moilapp.com` on moilapp.com and its subdomains,
 * nothing elsewhere (localhost, preview hosts), where a host-only cookie is
 * the honest scope.
 */
function cookieDomainFor(hostname) {
	const h = String(hostname || '').toLowerCase();
	if (h === 'moilapp.com' || h.endsWith('.moilapp.com')) return '.moilapp.com';
	return '';
}

function visitorCookie(vid, hostname, secure) {
	const domain = cookieDomainFor(hostname);
	return [
		`${VISITOR_COOKIE}=${vid}`,
		'Path=/',
		`Max-Age=${COOKIE_MAX_AGE_SEC}`,
		'SameSite=Lax',
		domain ? `Domain=${domain}` : '',
		secure ? 'Secure' : '',
	].filter(Boolean).join('; ');
}

/**
 * The visitor id for this page view.
 * accepted: the `moil_vid` cookie, else this tab's id (or a new one), written
 * to the cookie.
 * otherwise: a per-tab id in sessionStorage (never the cookie, even if one
 * exists from an earlier consent that has since been withdrawn).
 * Returns '' when nothing can be read or minted.
 */
function resolveVisitorId({ consent, cookieString, setCookie, session, random, hostname, secure }) {
	if (consent === 'accepted') {
		const existing = readCookie(VISITOR_COOKIE, cookieString);
		if (isVisitorId(existing)) return existing;
		// Accepting mid-visit keeps the tab's id, so one person is not counted
		// twice for the two minutes the old id stays live.
		let carried = '';
		try {
			carried = (session && session.getItem(VISITOR_STORAGE_KEY)) || '';
		} catch {
			carried = '';
		}
		const vid = isVisitorId(carried) ? carried : mintVisitorId(random);
		try {
			setCookie(visitorCookie(vid, hostname, secure));
		} catch {
			/* a cookie we could not write still counts this visit */
		}
		return vid;
	}
	try {
		const stored = session && session.getItem(VISITOR_STORAGE_KEY);
		if (isVisitorId(stored)) return stored;
		const vid = mintVisitorId(random);
		if (session) session.setItem(VISITOR_STORAGE_KEY, vid);
		return vid;
	} catch {
		return mintVisitorId(random);
	}
}

/** The gateway endpoint, or '' when no origin is configured. */
function visitUrl(origin) {
	const o = String(origin || '').trim().replace(/\/+$/, '');
	if (!/^https?:\/\/[^/\s]+$/i.test(o)) return '';
	return `${o}${VISIT_PATH}`;
}

function referrerHost(referrer, ownHost) {
	try {
		const host = new URL(String(referrer)).hostname.toLowerCase();
		if (!host || host === String(ownHost || '').toLowerCase()) return '';
		return host;
	} catch {
		return '';
	}
}

function visitBody({ vid, pathname, referrer, ownHost }) {
	const route = String(pathname || '/').slice(0, 200) || '/';
	const ref = referrerHost(referrer, ownHost);
	// The gateway parses `ref` as a URL, so the host travels as an origin.
	return JSON.stringify({ vid, route, site: 'landing', ...(ref ? { ref: `https://${ref}` } : {}) });
}

module.exports = {
	VISITOR_COOKIE,
	VISITOR_STORAGE_KEY,
	VISIT_PATH,
	BEAT_MS,
	isVisitorId,
	mintVisitorId,
	readCookie,
	cookieDomainFor,
	visitorCookie,
	resolveVisitorId,
	visitUrl,
	referrerHost,
	visitBody,
};
