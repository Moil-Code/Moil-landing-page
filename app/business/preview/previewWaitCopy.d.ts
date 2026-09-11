export const WAIT_LEAVE_MS: number;
export const WAIT_LONG_MS: number;
export const WAIT_POLL_MS: number;
export const WAIT_FAST_ATTEMPTS: number;
export const WAIT_SLOW_POLL_MS: number;
export const WAIT_RATE_LIMITED_POLL_MS: number;
export const WAIT_GIVE_UP_MS: number;
export function waitCopyKey(elapsedMs: number): 'waitCalm' | 'waitLeave' | 'waitLonger';
export function nextPollDelayMs(
	attempt?: number,
	opts?: { rateLimited?: boolean },
): number;
export function shouldGiveUpWaiting(elapsedMs: number): boolean;
