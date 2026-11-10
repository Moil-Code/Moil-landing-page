'use strict';

/**
 * B25 wait ladder for the public magnet.
 *
 * Calm at first. After ~30s, tell the founder they can leave
 * (the envelope is up to 15 minutes). After ~2.5 minutes, say
 * it is taking longer than it should — and keep polling.
 *
 * Pure. No I/O. No progress percentage. A bar that completes
 * before the server is a lie.
 */

const WAIT_LEAVE_MS = 30 * 1000;
const WAIT_LONG_MS = 150 * 1000; // 2.5 min — inside the 2–3 min window
const WAIT_POLL_MS = 1000;

// Past this many attempts the fast cadence has already covered the whole
// window a healthy generation lives in, so it steps down. See below.
const WAIT_FAST_ATTEMPTS = 30;
const WAIT_SLOW_POLL_MS = 2500;

// A 429 is OUR OWN poll hitting the view limiter. Retrying at the same rate
// keeps it rate-limited forever, so a finished preview could never be
// collected — the wait would outlive the answer. Back off instead.
const WAIT_RATE_LIMITED_POLL_MS = 5000;

// The longest the CLIENT will wait before calling it. Deliberately LONGER
// than the server's own build bound (PREVIEW_BUILD_TIMEOUT_MS, 5 min): on a
// reachable server the founder learns `failed` FROM the server, on a row a
// re-submission can regenerate. This bound only fires when the API itself
// cannot be reached, and it exists so the wait card can never spin forever.
const WAIT_GIVE_UP_MS = 6 * 60 * 1000;

/**
 * @param {number} elapsedMs
 * @returns {'waitCalm'|'waitLeave'|'waitLonger'}
 */
function waitCopyKey(elapsedMs) {
	const ms = Number(elapsedMs);
	if (!Number.isFinite(ms) || ms < WAIT_LEAVE_MS) return 'waitCalm';
	if (ms < WAIT_LONG_MS) return 'waitLeave';
	return 'waitLonger';
}

/**
 * GET poll while phase=wait. ~1s for the first WAIT_FAST_ATTEMPTS so the door
 * still catches Onboarding's sub-second typeProgress+markReady dump after the
 * scrape — the old 2/4/8/10s backoff (polls at 0, 2, 6, 14, 24s) missed it.
 *
 * AFTER that it steps down, and the reason is the view limiter rather than
 * politeness. That cap is 60 requests a minute per IP, so a flat 1s poll sits
 * exactly on it: a second tab, a shared office NAT or a mobile carrier's CGNAT
 * pushes a real founder over, and every GET after that is a 429 — including
 * the one that would have carried their finished preview. The fast window is
 * far longer than a healthy generation, so stepping down costs nothing and
 * removes a way to be locked out of your own answer.
 *
 * Copy ladder (calm / leave / longer) is independent of this cadence.
 * @param {number} [attempt]
 * @param {{ rateLimited?: boolean }} [opts]
 */
function nextPollDelayMs(attempt, opts) {
	if (opts && opts.rateLimited) return WAIT_RATE_LIMITED_POLL_MS;
	const n = Number(attempt);
	if (Number.isFinite(n) && n >= WAIT_FAST_ATTEMPTS) return WAIT_SLOW_POLL_MS;
	return WAIT_POLL_MS;
}

/**
 * Has the client waited long enough to stop asking? A wait card that polls
 * forever is not patience — it is a dead end with an animation on it.
 * @param {number} elapsedMs
 */
function shouldGiveUpWaiting(elapsedMs) {
	const ms = Number(elapsedMs);
	if (!Number.isFinite(ms)) return false;
	return ms >= WAIT_GIVE_UP_MS;
}

module.exports = {
	WAIT_LEAVE_MS,
	WAIT_LONG_MS,
	WAIT_POLL_MS,
	WAIT_FAST_ATTEMPTS,
	WAIT_SLOW_POLL_MS,
	WAIT_RATE_LIMITED_POLL_MS,
	WAIT_GIVE_UP_MS,
	waitCopyKey,
	nextPollDelayMs,
	shouldGiveUpWaiting,
};
