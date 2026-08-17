export const WAIT_LEAVE_MS: number;
export const WAIT_LONG_MS: number;
export function waitCopyKey(elapsedMs: number): 'waitCalm' | 'waitLeave' | 'waitLonger';
export function nextPollDelayMs(attempt: number): number;
