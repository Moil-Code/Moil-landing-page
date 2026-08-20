#!/usr/bin/env node
'use strict';

/**
 * The three doors of the pre-signup preview.
 *   node --test evals/previewInput.test.js
 *
 * Two of the three could not succeed before this file existed, and neither
 * failure was visible from outside:
 *
 *   handle  — the form never sent `platform`, and the server refuses to guess
 *             one. Every submission came back `bad_handle`, with a message
 *             telling the visitor to include something the form did not ask
 *             for. A 0% door that looked like a working door.
 *   website — `<input type="url">` made the browser reject `yourbusiness.com`
 *             before the request left the page, while the server had accepted
 *             bare hosts all along.
 *
 * These tests pin the shapes the server accepts, so a future edit to the
 * parser cannot quietly re-break a door.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
	PLATFORMS,
	readWebsite,
	readHandle,
	readPlaceId,
	platformFromUrl,
} = require('../app/business/preview/previewInput');

describe('website door', () => {
	it('accepts a bare domain, which is how people type it', () => {
		const r = readWebsite('yourbusiness.com');
		assert.equal(r.ok, true);
		assert.equal(r.website, 'https://yourbusiness.com');
	});

	it('collapses the variants the server keys as one business', () => {
		const want = 'https://example.com';
		for (const input of [
			'example.com',
			'www.example.com',
			'HTTPS://WWW.Example.com',
			'https://example.com/about?utm=x#top',
			'  example.com/  ',
		]) {
			assert.equal(readWebsite(input).website, want, input);
		}
	});

	it('refuses what the server refuses', () => {
		for (const input of [
			'',
			'localhost',
			'notadomain',
			'http://192.168.1.1',
			'https://example.com:8080',
			'javascript:alert(1)',
			'https://user:pw@example.com',
			'printer.local',
		]) {
			assert.equal(readWebsite(input).ok, false, input);
		}
	});

	it('recognises a social link in the website box and names the platform', () => {
		const r = readWebsite('https://www.instagram.com/moilworks');
		assert.equal(r.ok, false);
		assert.equal(r.reason, 'is_social');
		assert.equal(r.platform, 'instagram');
	});
});

describe('handle door', () => {
	it('sends a platform — the field the form used to omit entirely', () => {
		const r = readHandle('@moilworks', 'instagram');
		assert.equal(r.ok, true);
		assert.equal(r.platform, 'instagram');
		assert.equal(r.handle, 'moilworks');
	});

	it('reads the platform out of a pasted profile link', () => {
		const cases = [
			['https://instagram.com/moilworks', 'instagram', 'moilworks'],
			['https://www.facebook.com/MoilWorks/', 'facebook', 'MoilWorks'],
			['tiktok.com/@moilapp', 'tiktok', 'moilapp'],
			['https://www.linkedin.com/company/moilapp', 'linkedin', 'moilapp'],
		];
		for (const [input, platform, handle] of cases) {
			const r = readHandle(input, 'instagram');
			assert.equal(r.ok, true, input);
			assert.equal(r.platform, platform, input);
			assert.equal(r.handle, handle, input);
		}
	});

	it('a pasted link beats the chip, because it is the stronger statement', () => {
		const r = readHandle('https://tiktok.com/@moilapp', 'linkedin');
		assert.equal(r.platform, 'tiktok');
	});

	it('refuses a bare handle with no platform rather than guessing', () => {
		// Guessing is how a stranger's account gets rendered under someone
		// else's business name. The server refuses; so do we.
		const r = readHandle('moilworks', '');
		assert.equal(r.ok, false);
		assert.equal(r.reason, 'no_platform');
	});

	it('refuses a platform the server does not key on', () => {
		assert.equal(readHandle('moilworks', 'twitter').ok, false);
		assert.equal(readHandle('moilworks', 'youtube').ok, false);
	});

	it('spots a website in the handle box', () => {
		const r = readHandle('moilapp.com', 'instagram');
		assert.equal(r.ok, false);
		assert.equal(r.reason, 'is_website');
	});

	it('only offers platforms the server accepts', () => {
		// HANDLE_PLATFORMS in service/preview/previewIdentity.js. A platform we
		// offer and the server rejects is another door with a 0% success rate.
		assert.deepEqual([...PLATFORMS], ['instagram', 'facebook', 'tiktok', 'linkedin']);
	});
});

describe('listing door', () => {
	it('requires a real place id, not a typed name', () => {
		// Typing into the autocomplete without picking leaves placeId empty,
		// which the server reads as "no signal at all".
		assert.equal(readPlaceId('').ok, false);
		assert.equal(readPlaceId('Joe’s Pizza').ok, false);
		assert.equal(readPlaceId('ChIJN1t_tDeuEmsRUsoyG83frY4').ok, true);
	});
});

describe('platformFromUrl', () => {
	it('ignores hosts that are not platforms', () => {
		assert.equal(platformFromUrl('moilapp.com'), '');
		assert.equal(platformFromUrl(''), '');
		assert.equal(platformFromUrl('not a url at all'), '');
	});
});
