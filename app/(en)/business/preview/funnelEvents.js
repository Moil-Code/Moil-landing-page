'use strict';

/**
 * The landing half of the pre-signup funnel.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────
 * The magnet emitted NOTHING. Not a view, not a submit, not a ready-seen,
 * not a CTA click, not a reset. So every conversion claim about this
 * funnel — including the ones used to decide what to build next — was a
 * guess, and the step that was actually leaking could not be named.
 *
 * ── THIS IS PRODUCT TELEMETRY, NOT A TRACKER ────────────────────────
 * `analytics.tsx` states the rule for this repo: every non-essential
 * tracker is gated on cookie consent there, and adding one anywhere else
 * bypasses that gate. This is deliberately not one of those. It sets no
 * cookie, reads no device id, contacts no third party and carries no
 * cross-site identity — a slug the visitor already has, the name of a
 * step, and counts. The eval asserts every one of those absences.
 *
 * ── THE VOCABULARY IS A COMMITTED PIN ───────────────────────────────
 * `EVENTS` mirrors `supabase/functions/_shared/preview-funnel-events.json`
 * in the backend, and `evals/previewFunnelEmit.test.js` compares them
 * whenever both repos are checked out. CI has neither sibling, so the pin
 * is what runs there. A name that exists on one side only is silently
 * DROPPED by the other and the step it measures reads zero — which is
 * indistinguishable from nobody taking it, which is the exact confusion
 * this whole file exists to remove.
 *
 * ── THE ALLOW-LIST IS ENFORCED HERE TOO, AND THAT IS NOT REDUNDANT ──
 * The server refuses an unlisted prop, so a duplicate check cannot make
 * the TABLE safer. What it makes safer is the WIRE: a website, a business
 * name or a founder's own words never leave the browser in the first
 * place. The cheapest place to not send something is before it is sent.
 *
 * ── IT MAY NEVER COST A VISITOR THE PAGE ────────────────────────────
 * Every call is fire-and-forget, wrapped, and returns nothing a caller
 * can await. A telemetry failure must be invisible to the founder whose
 * preview it is describing.
 */

/**
 * The pin. Mirrors the backend catalog; the eval fails on drift in either
 * direction whenever both repos are present.
 */
const EVENTS = Object.freeze({
	magnet_view: ['door'],
	magnet_submit: ['door', 'hasPlatforms'],
	magnet_reset: ['phase'],
	ready_seen: [
		'msSinceSubmit',
		'postsShown',
		'factsShown',
		'door',
	],
	ready_edit: ['section'],
	cta_signup: ['platformsPicked', 'door'],
	// Backend-emitted. Listed so the pin can be compared whole against the
	// shared catalog — a one-sided list would make the lockstep check
	// unable to see a backend-only name disappearing.
	preview_accepted: ['door', 'decision'],
	preview_ready: [
		'door',
		'beats',
		'hasLogo',
		'hasUvp',
		'postsComposed',
		'msToReady',
	],
	return_visit: ['daysSinceCreated'],
	claimed: ['firstClaim', 'msSinceReady'],
	kit_week_ready: ['msSinceClaim', 'staged'],
	week_approved: [
		'msSinceClaim',
		'inFirstSession',
		'approved',
	],
});

/** Only the landing may emit these; the rest are the server's to report. */
const LANDING_EVENTS = Object.freeze([
	'magnet_view',
	'magnet_submit',
	'magnet_reset',
	'ready_seen',
	'ready_edit',
	'cta_signup',
]);

const EVENTS_URL = '/plan/preview/events';
const MAX_STR = 40;

/**
 * A prop value is a bounded string, a finite number, or a boolean.
 *
 * An object or an array is refused rather than serialized: the allow-list
 * checks KEY NAMES, so a nested payload under an allowed key would carry
 * exactly the website / name / founder text this module promises never to
 * send. Same rule, same reason, as the server's `safeValue`.
 */
function safeValue(v) {
	if (typeof v === 'boolean') return v;
	if (typeof v === 'number') {
		return Number.isFinite(v) ? v : undefined;
	}
	if (typeof v === 'string') {
		const s = v.trim();
		return s ? s.slice(0, MAX_STR) : undefined;
	}
	return undefined;
}

/**
 * What may actually be sent for one event, or null if the event itself is
 * not ours to emit.
 *
 * Pure, so the refusals are provable without a network. A prop we were not
 * given is ABSENT, never 0 — `msSinceSubmit: 0` for "we did not measure"
 * fabricates a value in the one table whose job is to be trustworthy about
 * how long things take.
 */
function buildEvent(name, props) {
	const n = typeof name === 'string' ? name.trim() : '';
	if (!n || !LANDING_EVENTS.includes(n)) return null;
	const allowed = EVENTS[n] || [];
	const src =
		props && typeof props === 'object' ? props : {};
	const out = {};
	for (const key of allowed) {
		if (!Object.prototype.hasOwnProperty.call(src, key))
			continue;
		const val = safeValue(src[key]);
		if (val === undefined) continue;
		out[key] = val;
	}
	return { event: n, props: out };
}

/**
 * Send one step. Never throws, never returns anything to await.
 *
 * `keepalive` is load-bearing rather than defensive: `cta_signup` fires as
 * the browser is navigating to the register page, and an ordinary fetch is
 * cancelled on unload — so without it the single most important step in
 * this funnel would be the one that never arrives.
 *
 * The URL is same-origin (`next.config.js` rewrites `/plan/preview/:slug`
 * to the API), so there is no preflight and no third party involved.
 */
function emitFunnelEvent(name, props, slug, fetchFn) {
	try {
		const payload = buildEvent(name, props);
		if (!payload) return;
		const f =
			fetchFn ||
			(typeof fetch === 'function' ? fetch : null);
		if (!f) return;
		const body = { ...payload };
		const s = typeof slug === 'string' ? slug.trim() : '';
		if (s) body.slug = s;
		const p = f(EVENTS_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
			keepalive: true,
		});
		if (p && typeof p.catch === 'function') {
			p.catch(() => {});
		}
	} catch (_) {
		/* a measurement may never break the page it measures */
	}
}

module.exports = {
	EVENTS,
	EVENTS_URL,
	LANDING_EVENTS,
	MAX_STR,
	buildEvent,
	emitFunnelEvent,
	safeValue,
};
