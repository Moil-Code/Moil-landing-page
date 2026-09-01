'use strict';

// =============================================================================
// The pre-wall platform picker offers only what we can honour.
// =============================================================================
// The plan specifies five networks from the competitor's transcript; the
// backend publishes to two. A founder who ticks TikTok on the acquisition
// screen and never sees a TikTok post has been told something untrue at the
// moment they trusted us most.
// =============================================================================

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const {
	OFFERED,
	COMING,
	DECIDE_FOR_ME,
	DECIDE_RESOLVES_TO,
	normalizeChoice,
	isOffered,
	isComing,
} = require('../app/business/preview/platformChoice.js');

test('only publishable networks are offered', () => {
	// If this ever grows, the backend pin (evals/fixtures/landing-platformChoice.js
	// in Business-plan-Staging) fails too — the two repos cannot import each
	// other, so a two-sided change with a human in the middle is the guarantee.
	assert.deepStrictEqual(OFFERED, ['instagram', 'facebook']);
});

test('the networks we cannot publish to are NAMED, not omitted', () => {
	// An absence reads as an oversight and a founder cannot tell the two
	// apart. "Not yet" is an answer; nothing is not.
	const ids = COMING.map((c) => c.id);
	assert.ok(ids.includes('linkedin'), 'linkedin must be named');
	assert.ok(ids.includes('tiktok'), 'tiktok must be named');
	assert.ok(ids.includes('youtube'), 'youtube must be named');
	for (const c of COMING) {
		assert.ok(c.reason, `${c.id} is named with no reason`);
	}
});

test('a named-but-unavailable network can never be picked', () => {
	for (const c of COMING) {
		assert.strictEqual(isOffered(c.id), false, `${c.id} is selectable`);
		assert.strictEqual(isComing(c.id), true);
	}
});

test('the two sets never overlap', () => {
	for (const id of OFFERED) {
		assert.strictEqual(isComing(id), false, `${id} is in both sets`);
	}
});

test('a submitted unavailable network is REFUSED and REPORTED', () => {
	// Silently dropping it makes the screen and the stored answer disagree
	// with nothing to explain it.
	const out = normalizeChoice(['tiktok', 'instagram', 'youtube']);
	assert.deepStrictEqual(out.platforms, ['instagram']);
	assert.deepStrictEqual(out.refused, ['tiktok', 'youtube']);
	assert.strictEqual(out.decided, true);
});

test('"decide for me" resolves to every publishable network, never a guess', () => {
	const out = normalizeChoice(DECIDE_FOR_ME);
	assert.deepStrictEqual(out.platforms, [...DECIDE_RESOLVES_TO]);
	assert.deepStrictEqual(DECIDE_RESOLVES_TO, OFFERED);
	// `decided: false` is the receipt — the founder did not choose, we did.
	assert.strictEqual(out.decided, false);
});

test('an EMPTY choice is "decide for me", never "no networks"', () => {
	// Storing an empty set produces a month with nowhere to go, and the
	// founder finds out a week later.
	for (const empty of [[], '', null, undefined]) {
		const out = normalizeChoice(empty);
		assert.deepStrictEqual(out.platforms, [...DECIDE_RESOLVES_TO], String(empty));
		assert.strictEqual(out.decided, false);
	}
});

test('an all-refused choice still lands on decide, and still reports', () => {
	const out = normalizeChoice(['tiktok']);
	assert.deepStrictEqual(out.platforms, [...DECIDE_RESOLVES_TO]);
	assert.strictEqual(out.decided, false);
	assert.deepStrictEqual(out.refused, ['tiktok']);
});

test('input is normalized and de-duplicated', () => {
	const out = normalizeChoice([' Instagram ', 'INSTAGRAM', 'facebook', 42, null]);
	assert.deepStrictEqual(out.platforms, ['instagram', 'facebook']);
});

test('the module is pure', () => {
	const src = fs.readFileSync(
		path.join(__dirname, '../app/business/preview/platformChoice.js'),
		'utf8',
	);
	const body = src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '');
	assert.ok(!/Date\.now\(|new Date\(/.test(body), 'reads a clock');
	assert.ok(!/fetch\(|require\('fs'\)|document\./.test(body), 'does I/O');
	assert.ok(!/react/i.test(body), 'imports React');
});

// ── The choice travels, and only the honourable half of it ──────────────────
//
// A picker whose answer nothing reads is decoration — this repo's own rule.
// The answer's carrier is `?platforms=` on the register URL, because
// `business_previews` is ONE ROW PER BUSINESS (UNIQUE identity_key, replayed
// forever) and a PREFERENCE stored there is another visitor's answer. The
// consumer is `Business-plan-Staging/service/preview/previewPlatformSeed.js`.

const client = require('../app/business/preview/previewClient');

test('a real choice rides the register URL', () => {
	const url = client.buildRegisterUrl({
		previewSlug: 'taco-shop',
		platforms: ['instagram', 'facebook'],
	});
	const u = new URL(url);
	assert.strictEqual(u.searchParams.get('preview'), 'taco-shop');
	assert.strictEqual(
		u.searchParams.get('platforms'),
		'instagram,facebook',
	);
});

test('"decide for me" and an empty pick send NOTHING', () => {
	// Sending the resolved pair would report a decision the founder never
	// made and freeze today's default into their account. Absence lets the
	// product keep choosing, which is what they asked for.
	for (const platforms of [undefined, [], null, DECIDE_FOR_ME]) {
		const url = client.buildRegisterUrl({
			previewSlug: 's',
			platforms,
		});
		assert.strictEqual(
			new URL(url).searchParams.get('platforms'),
			null,
			String(platforms),
		);
	}
});

test('a network we cannot honour never reaches the URL', () => {
	// It is refused at the server too. It must also be refused HERE: a value
	// in a URL the founder can read is a promise, and the picker already
	// refuses it on screen.
	const url = client.buildRegisterUrl({
		previewSlug: 's',
		platforms: ['tiktok', 'youtube', 'linkedin'],
	});
	assert.strictEqual(
		new URL(url).searchParams.get('platforms'),
		null,
	);
});

test('a mixed list carries only what is offered', () => {
	const url = client.buildRegisterUrl({
		previewSlug: 's',
		platforms: ['tiktok', ' FACEBOOK ', 'facebook'],
	});
	assert.strictEqual(
		new URL(url).searchParams.get('platforms'),
		'facebook',
	);
});

test('the carrier is bound to OFFERED, never a second hardcoded list', () => {
	const src = fs.readFileSync(
		path.join(__dirname, '../app/business/preview/previewClient.js'),
		'utf8',
	);
	const body = src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '');
	assert.ok(
		body.includes('isOffered'),
		'previewClient must ask platformChoice, not re-enumerate the networks',
	);
	assert.ok(
		!/\[[^\]]*'instagram'[^\]]*'facebook'[^\]]*\]/.test(body),
		'a second inline platform list has appeared in previewClient',
	);
});

test('the register URL stays valid with no slug at all', () => {
	const url = client.buildRegisterUrl({
		platforms: ['facebook'],
		lang: 'es',
	});
	const u = new URL(url);
	assert.strictEqual(u.searchParams.get('platforms'), 'facebook');
	assert.strictEqual(u.searchParams.get('lg'), 'es');
	assert.strictEqual(u.searchParams.get('preview'), null);
});
