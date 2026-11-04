// The contact / partner-inquiry limit cannot be dodged by a forged header,
// and its memory is bounded. (wave 1 security, 2026-11-04)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { clientIp, createLimiter, trustedHops } = require('../app/api/partner-inquiry/rateLimit');

const headers = (h) => ({ get: (n) => (n in h ? h[n] : null) });

test('a forged leftmost X-Forwarded-For entry does not change the key', () => {
	const a = clientIp(headers({ 'x-forwarded-for': '1.1.1.1, 203.0.113.9' }), {});
	const b = clientIp(headers({ 'x-forwarded-for': '9.9.9.9, 203.0.113.9' }), {});
	assert.strictEqual(a, '203.0.113.9');
	assert.strictEqual(b, '203.0.113.9');
});

test('X-Real-IP (set by our nginx) wins; hops pick from the right', () => {
	assert.strictEqual(clientIp(headers({ 'x-real-ip': '198.51.100.7', 'x-forwarded-for': '1.1.1.1' }), {}), '198.51.100.7');
	assert.strictEqual(clientIp(headers({ 'x-forwarded-for': 'a, b, c' }), { LANDING_TRUSTED_PROXY_HOPS: '2' }), 'b');
	assert.strictEqual(clientIp(headers({}), {}), 'unknown');
	assert.strictEqual(trustedHops({ LANDING_TRUSTED_PROXY_HOPS: 'x' }), 1);
	assert.strictEqual(trustedHops({ LANDING_TRUSTED_PROXY_HOPS: '99' }), 1);
});

test('4 per window per visitor, then refused, then free again after the window', () => {
	const l = createLimiter({ windowMs: 1000, max: 4 });
	for (let i = 0; i < 4; i++) assert.strictEqual(l.isRateLimited('v', 0), false);
	assert.strictEqual(l.isRateLimited('v', 10), true);
	assert.strictEqual(l.isRateLimited('v', 1001), false);
});

test('memory is bounded: expired entries are swept and the map is capped', () => {
	const l = createLimiter({ windowMs: 1000, max: 4, maxKeys: 50 });
	for (let i = 0; i < 500; i++) l.isRateLimited(`ip${i}`, 0);
	assert.ok(l.size() <= 50, `size ${l.size()}`);
	l.isRateLimited('late', 5000);
	assert.strictEqual(l.size(), 1);
});

test('the route uses the shared limiter and no longer reads the first XFF entry', () => {
	const src = fs.readFileSync(path.join(__dirname, '../app/api/partner-inquiry/route.ts'), 'utf8');
	assert.match(src, /clientIp\(request\.headers\)/);
	assert.match(src, /limiter\.isRateLimited\(ip\)/);
	assert.doesNotMatch(src, /x-forwarded-for'\)\?\.split\(','\)\[0\]/);
	assert.doesNotMatch(src, /new Map</);
	assert.match(src, /MAX_BODY_BYTES/);
});
