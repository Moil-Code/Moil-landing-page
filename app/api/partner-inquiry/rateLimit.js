'use strict';

/**
 * The contact / partner-inquiry limit: 4 messages per 15 minutes per visitor.
 *
 * Two defects in the inline version this replaces:
 *
 * 1. The visitor was the FIRST X-Forwarded-For entry. nginx APPENDS the address
 *    it saw to whatever the client sent, so the first entry is whatever the
 *    client typed: rotating a fake header got a fresh bucket every request,
 *    and the limit never applied. The trusted address is the one our own
 *    proxy added: X-Real-IP when nginx sets it, else the entry `hops` places
 *    from the RIGHT (LANDING_TRUSTED_PROXY_HOPS, default 1 = nginx).
 * 2. The Map was never pruned, so spoofed addresses grew it without bound.
 *    Expired entries are swept at most once a window, and the map is capped:
 *    past MAX_KEYS the oldest-expiring entries are dropped.
 *
 * Per process by design: production runs one `next start` process. If PM2 is
 * ever scaled, move this to Redis.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 4;
const MAX_KEYS = 10000;

function trustedHops(env = process.env) {
	const n = Number(env.LANDING_TRUSTED_PROXY_HOPS);
	return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 1;
}

/** @param {{ get(name: string): string | null }} headers */
function clientIp(headers, env = process.env) {
	const real = (headers.get('x-real-ip') || '').trim();
	if (real) return real;
	const xff = headers.get('x-forwarded-for');
	if (xff) {
		const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
		const pick = parts[parts.length - trustedHops(env)];
		if (pick) return pick;
	}
	return 'unknown';
}

function createLimiter({ windowMs = WINDOW_MS, max = MAX_REQUESTS, maxKeys = MAX_KEYS } = {}) {
	const counts = new Map();
	let nextSweep = 0;

	function sweep(now) {
		if (now >= nextSweep) {
			for (const [key, v] of counts) if (v.resetAt <= now) counts.delete(key);
			nextSweep = now + windowMs;
		}
		if (counts.size >= maxKeys) {
			const byExpiry = [...counts.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
			for (const [key] of byExpiry.slice(0, counts.size - maxKeys + 1)) counts.delete(key);
		}
	}

	function isRateLimited(key, now = Date.now()) {
		const current = counts.get(key);
		if (!current || current.resetAt <= now) {
			sweep(now);
			counts.set(key, { count: 1, resetAt: now + windowMs });
			return false;
		}
		if (current.count >= max) return true;
		current.count += 1;
		return false;
	}

	return { isRateLimited, size: () => counts.size };
}

module.exports = { WINDOW_MS, MAX_REQUESTS, MAX_KEYS, trustedHops, clientIp, createLimiter };
