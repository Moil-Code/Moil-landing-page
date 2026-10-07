#!/usr/bin/env node
'use strict';

/**
 * Landing presence beacon — what the admin "Active users" page sees of a
 * visitor who is not signed in.
 *   node --test evals/presenceBeacon.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const B = require('../src/common/presence/visitorBeacon.js');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

let counter = 0;
const random = (n) => Array.from({ length: n }, (_, i) => (i * 7 + counter++) % 256);
const memSession = () => {
	const m = new Map();
	return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
};
const base = (over = {}) => {
	const cookies = [];
	return {
		cookies,
		input: {
			consent: null,
			cookieString: '',
			setCookie: (c) => cookies.push(c),
			session: memSession(),
			random,
			hostname: 'www.moilapp.com',
			secure: true,
			...over,
		},
	};
};

describe('visitor id', () => {
	it('mints an id the gateway accepts', () => {
		const vid = B.mintVisitorId(random);
		assert.ok(B.isVisitorId(vid), vid);
		assert.match(vid, /^[A-Za-z0-9_-]{16,64}$/);
	});

	it('without consent: a per-tab id, stable across calls, and no cookie', () => {
		const { cookies, input } = base();
		const a = B.resolveVisitorId(input);
		const b = B.resolveVisitorId(input);
		assert.equal(a, b);
		assert.equal(cookies.length, 0);
	});

	it('a refusal never reads an existing cookie id (consent may have been withdrawn)', () => {
		const { input } = base({ consent: 'rejected', cookieString: 'moil_vid=AAAAAAAAAAAAAAAAAAAAAA' });
		assert.notEqual(B.resolveVisitorId(input), 'AAAAAAAAAAAAAAAAAAAAAA');
	});

	it('accepted: the existing cookie wins, and nothing is rewritten', () => {
		const { cookies, input } = base({ consent: 'accepted', cookieString: 'x=1; moil_vid=BBBBBBBBBBBBBBBBBBBBBB' });
		assert.equal(B.resolveVisitorId(input), 'BBBBBBBBBBBBBBBBBBBBBB');
		assert.equal(cookies.length, 0);
	});

	it('accepting mid-visit keeps the tab id, so one person is not counted twice', () => {
		const { cookies, input } = base();
		const before = B.resolveVisitorId(input);
		const after = B.resolveVisitorId({ ...input, consent: 'accepted' });
		assert.equal(after, before);
		assert.equal(cookies.length, 1);
		assert.match(cookies[0], new RegExp(`^moil_vid=${before};`));
	});

	it('the cookie is on .moilapp.com (so the app can link it) and nowhere else', () => {
		assert.match(B.visitorCookie('C'.repeat(22), 'www.moilapp.com', true), /Domain=\.moilapp\.com/);
		assert.match(B.visitorCookie('C'.repeat(22), 'www.moilapp.com', true), /; Secure$/);
		assert.doesNotMatch(B.visitorCookie('C'.repeat(22), 'localhost', false), /Domain=/);
		assert.equal(B.cookieDomainFor('evilmoilapp.com'), '');
	});

	it('a malformed cookie is not an id', () => {
		const { input } = base({ consent: 'accepted', cookieString: 'moil_vid=<script>' });
		assert.ok(B.isVisitorId(B.resolveVisitorId(input)));
	});

	it('storage that throws still yields an id', () => {
		const bad = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
		const { input } = base({ session: bad });
		assert.ok(B.isVisitorId(B.resolveVisitorId(input)));
	});
});

describe('request', () => {
	it('no origin means no beacon (never a guessed host)', () => {
		assert.equal(B.visitUrl(undefined), '');
		assert.equal(B.visitUrl(''), '');
		assert.equal(B.visitUrl('api.moilapp.com'), '');
		assert.equal(B.visitUrl('https://gw.example.com/'), 'https://gw.example.com/api/presence/visit');
		assert.equal(B.visitUrl('https://gw.example.com/api'), '');
	});

	it('the body names the landing site and sends the referrer as a host only', () => {
		const body = JSON.parse(B.visitBody({
			vid: 'D'.repeat(22),
			pathname: '/business/pricing',
			referrer: 'https://www.google.com/search?q=moil+secret',
			ownHost: 'www.moilapp.com',
		}));
		assert.deepEqual(body, { vid: 'D'.repeat(22), route: '/business/pricing', site: 'landing', ref: 'https://www.google.com' });
	});

	it('an internal referrer is not sent', () => {
		const body = JSON.parse(B.visitBody({ vid: 'E'.repeat(22), pathname: '/', referrer: 'https://www.moilapp.com/x', ownHost: 'www.moilapp.com' }));
		assert.equal(body.ref, undefined);
	});
});

describe('wiring', () => {
	const comp = strip(read('src/common/components/PresenceBeacon.tsx'));
	const layout = strip(read('app/layout.tsx'));

	it('is mounted in the root layout', () => {
		assert.match(layout, /<PresenceBeacon \/>/);
	});

	it('reads consent at send time, not from the hook that starts at null', () => {
		assert.match(comp, /consent: effectiveConsent\(\)/);
		assert.doesNotMatch(comp, /useConsent\(/);
	});

	it('sends text/plain with credentials, so no preflight and a signed-in founder is named', () => {
		assert.match(comp, /'Content-Type': 'text\/plain'/);
		assert.match(comp, /credentials: 'include'/);
	});

	it('sends nothing from a hidden tab', () => {
		assert.match(comp, /visibilityState === 'hidden'\) return/);
	});

	it('the env var is documented', () => {
		assert.match(read('.env.example'), /^NEXT_PUBLIC_MOIL_GATEWAY_ORIGIN=/m);
	});
});
