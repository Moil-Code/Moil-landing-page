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
 * GET poll while phase=wait. Fixed ~1s so the door can catch
 * Onboarding's sub-second typeProgress+markReady dump after scrape.
 * The old 2/4/8/10s backoff (polls at 0, 2, 6, 14, 24s) missed it.
 * Copy ladder (calm / leave / longer) is independent of this cadence.
 * @param {number} [_attempt] unused — kept so callers do not change
 */
function nextPollDelayMs(_attempt) {
	return WAIT_POLL_MS;
}

module.exports = {
	WAIT_LEAVE_MS,
	WAIT_LONG_MS,
	WAIT_POLL_MS,
	waitCopyKey,
	nextPollDelayMs,
};
