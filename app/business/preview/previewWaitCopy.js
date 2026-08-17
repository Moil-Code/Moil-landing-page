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
 * Backoff for GET polls: 2s, 4s, 8s, then cap at 10s.
 * @param {number} attempt zero-based completed poll count
 */
function nextPollDelayMs(attempt) {
	const n = Number.isFinite(attempt) && attempt > 0 ? attempt : 0;
	const step = 2000 * Math.pow(2, n);
	return Math.min(step, 10000);
}

module.exports = {
	WAIT_LEAVE_MS,
	WAIT_LONG_MS,
	waitCopyKey,
	nextPollDelayMs,
};
