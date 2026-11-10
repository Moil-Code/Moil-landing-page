'use strict';

/**
 * Moil360 free-trial landing page: the PURE half of the funnel.
 *
 * The page has one job (Developer Brief, 2026-10-27): turn a Facebook ad click
 * into a click on the register link, in the page language, with the ad data
 * attached. Everything here is a rule about that link or about what the page
 * may claim; the DOM work lives in TrialPage.tsx.
 *
 * Rules:
 *   - Only the five utm_* keys and fbclid that ARRIVED on the landing page
 *     travel to the register link. Nothing else from the URL is kept.
 *   - Every link carries `ref` (TRIAL_REF), so the register page can tell a
 *     sign-up came from this funnel. A visitor with no ad data gets `lg` and
 *     `ref` only.
 *   - Ad data is kept for the session, so moving to the other language's
 *     page (a different URL) does not drop it.
 *   - Scarcity is never invented: `deadline` needs a real end date, otherwise
 *     the page falls back to `none`. Time comes from the server, never the
 *     visitor's clock.
 *
 * No I/O, no React. Pinned by evals/freeTrialPage.test.js.
 */

const AD_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
// Identifies this funnel on the register page: every sign-up link from the
// free-trial page carries ref=<this>, whatever the visitor arrived with.
const TRIAL_REF = 'flow_b4c2a1694d0a77ef';
const AD_STORAGE_KEY = 'moil_trial_ad_params';
const MAX_PARAM_LENGTH = 500;

/** The ad params present in a query string, trimmed and bounded. */
function adParamsFromSearch(search) {
	const raw = typeof search === 'string' ? search : '';
	const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
	const out = {};
	for (const key of AD_PARAM_KEYS) {
		const v = params.get(key);
		if (v && v.trim()) out[key] = v.trim().slice(0, MAX_PARAM_LENGTH);
	}
	return out;
}

function readAdParams(storage) {
	try {
		const raw = storage.getItem(AD_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		const out = {};
		for (const key of AD_PARAM_KEYS) if (typeof parsed?.[key] === 'string') out[key] = parsed[key];
		return out;
	} catch {
		return {};
	}
}

/**
 * Ad params for this visit: fresh ones from the URL win and are stored; a
 * URL without any (the language switch, a reload) falls back to the stored set.
 */
function rememberAdParams(storage, search) {
	const fresh = adParamsFromSearch(search);
	if (Object.keys(fresh).length > 0) {
		try { storage.setItem(AD_STORAGE_KEY, JSON.stringify(fresh)); } catch { /* private mode */ }
		return fresh;
	}
	return readAdParams(storage);
}

/** Register link for one page language: `lg`, the funnel `ref`, then the ad params that arrived. */
function trialRegisterHref(registerUrl, lang, adParams) {
	const lg = lang === 'es' ? 'es' : 'en';
	const u = new URL(registerUrl);
	u.searchParams.set('lg', lg);
	u.searchParams.set('ref', TRIAL_REF);
	const params = adParams && typeof adParams === 'object' ? adParams : {};
	for (const key of AD_PARAM_KEYS) {
		if (typeof params[key] === 'string' && params[key]) u.searchParams.set(key, params[key]);
	}
	return u.toString();
}

/**
 * What the scarcity slot shows, from config and SERVER time.
 *   { kind: 'none' }                       true urgency line, no pressure
 *   { kind: 'deadline', endsAtMs, msLeft } offer end date plus countdown
 *   { kind: 'closed' }                     deadline passed: no trial button
 *
 * `spots` is deliberately not supported: it needs a live remaining count from
 * the trial system, and a typed-in number is exactly what the brief forbids.
 */
function scarcityState(config, nowMs) {
	const mode = config && config.mode;
	if (mode !== 'deadline') return { kind: 'none' };
	const endsAtMs = Date.parse(config.endsAt || '');
	// An end date without an explicit offset would be read in whatever zone
	// the server runs in. Refuse it rather than guess.
	if (!Number.isFinite(endsAtMs) || !/(Z|[+-]\d{2}:\d{2})$/.test(String(config.endsAt).trim())) {
		return { kind: 'none' };
	}
	const msLeft = endsAtMs - nowMs;
	if (msLeft <= 0) return { kind: 'closed' };
	return { kind: 'deadline', endsAtMs, msLeft };
}

/** d / h / m / s parts of a countdown; never negative. */
function countdownParts(msLeft) {
	const total = Math.max(0, Math.floor(msLeft / 1000));
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor((total % 86400) / 3600),
		minutes: Math.floor((total % 3600) / 60),
		seconds: total % 60,
	};
}

/**
 * A flagged product claim is shown only once it is signed off, or on a
 * reviewer's explicit `?review=claims` (where it is badged as unsigned).
 */
function claimVisible(claimId, signedOff, reviewMode) {
	if (!claimId) return true;
	if (signedOff && signedOff[claimId] === true) return true;
	return reviewMode === true;
}

/** Scroll-depth thresholds (percent) newly crossed at this scroll position. */
function crossedDepths(fraction, alreadySent) {
	const out = [];
	for (const pct of [50, 90]) {
		if (fraction * 100 >= pct && !alreadySent.has(pct)) out.push(pct);
	}
	return out;
}

module.exports = {
	AD_PARAM_KEYS,
	AD_STORAGE_KEY,
	TRIAL_REF,
	adParamsFromSearch,
	readAdParams,
	rememberAdParams,
	trialRegisterHref,
	scarcityState,
	countdownParts,
	claimVisible,
	crossedDepths,
};
