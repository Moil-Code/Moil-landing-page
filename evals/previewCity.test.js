#!/usr/bin/env node
'use strict';

/**
 * Location on the ready card, never invented.
 *   node --test evals/previewCity.test.js
 *
 * The GET already carries `brand.city` and `brand.address`. The magnet
 * never declared either, so convert was the first time a founder saw
 * their own location. Fill/display only: a city we were given, or a
 * city the address line already names as "Austin, TX". Same field
 * hydrate reads (`brand.city`). A tagline that names Austin is not a
 * city — previewCompose refuses that lift and so do we.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const strip = (src) =>
	String(src || '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
		.replace(/^\s*\/\/.*$/gm, '');

const {
	brandCity,
	cityFromAddress,
	fillBrandCity,
} = require('../app/business/preview/previewCity');
const gtk = require('../app/business/preview/gettingToKnowYou');
const fixture = require('./fixtures/wzP6PJqiVxqG');

describe('given city, or a parseable address — never invented', () => {
	it('a given city is carried verbatim', () => {
		assert.equal(brandCity({ city: 'Austin' }), 'Austin');
		assert.equal(brandCity({ city: 'Buda', address: 'Austin, TX' }), 'Buda');
	});

	it('extract-blank + "Austin, TX" parses for display', () => {
		assert.equal(cityFromAddress('Austin, TX'), 'Austin');
		assert.equal(brandCity({ city: '', address: 'Austin, TX' }), 'Austin');
		assert.equal(
			brandCity({
				city: '',
				address: '2114 E Cesar Chavez St, Austin, TX 78702',
			}),
			'Austin',
		);
	});

	it('a street with no city is not a city', () => {
		assert.equal(cityFromAddress('100 Main St'), '');
		assert.equal(cityFromAddress('Oak St, TX'), '');
		assert.equal(brandCity({ city: '', address: '100 Main St' }), '');
	});

	it('a tagline that names Austin does not become brand.city', () => {
		assert.equal(
			brandCity({
				city: '',
				address: '',
				tagline: 'The best loaf in Austin',
				overview: 'Fresh bread daily in Austin',
				website: 'https://bakery.example/?city=Austin',
			}),
			'',
		);
	});

	it('global geography is not a city', () => {
		assert.equal(brandCity({ city: 'Worldwide' }), '');
		assert.equal(brandCity({ city: 'Global' }), '');
		assert.equal(brandCity({ city: 'international' }), '');
	});

	it('empty is a real answer', () => {
		assert.equal(brandCity(null), '');
		assert.equal(brandCity({}), '');
		assert.equal(brandCity(fixture.brand), '');
		assert.equal(cityFromAddress(''), '');
		assert.equal(cityFromAddress(null), '');
	});

	it('whitespace-only city is omitted, not painted as a blank line', () => {
		assert.equal(brandCity({ city: '   ' }), '');
	});
});

describe('payload city is the same field hydrate reads', () => {
	it('fillBrandCity sets brand.city from a parseable address', () => {
		const out = fillBrandCity({
			brand: { name: 'Rye', city: '', address: 'Austin, TX' },
			positioning: { audience: 'Neighbours' },
		});
		assert.equal(out.brand.city, 'Austin');
		assert.equal(out.brand.address, 'Austin, TX');
		assert.equal(out.brand.name, 'Rye');
		assert.equal(out.positioning.audience, 'Neighbours');
	});

	it('a given city is not overwritten by the address', () => {
		const out = fillBrandCity({
			brand: { city: 'Buda', address: 'Austin, TX' },
		});
		assert.equal(out.brand.city, 'Buda');
	});

	it('nothing parseable leaves the payload alone', () => {
		const body = { brand: { name: 'Rye', city: '', address: '' } };
		assert.equal(fillBrandCity(body), body);
		assert.equal(fillBrandCity(null), null);
		assert.equal(fillBrandCity(undefined), undefined);
	});
});

describe('the card surfaces city; leftover-6 stays OFF', () => {
	const citySrc = read('app/business/preview/previewCity.js');
	const gtkSrc = read('app/business/components/GettingToKnowYou.tsx');
	const magnet = read('app/business/components/PreviewMagnet.tsx');
	const cityBody = strip(citySrc);
	const gtkBody = strip(gtkSrc);

	it('ReadyBrand declares the fields the GET already sends', () => {
		assert.match(magnet, /city\?: string/);
		assert.match(magnet, /address\?: string/);
	});

	it('onReady fills brand.city before the card stores the payload', () => {
		assert.match(magnet, /fillBrandCity/);
		const start = magnet.indexOf('const onReady');
		const end = magnet.indexOf('const poll = useCallback', start);
		const onReady = magnet.slice(start, end);
		assert.ok(onReady.length > 200, 'the onReady slice was FOUND');
		assert.ok(
			onReady.indexOf('fillBrandCity') < onReady.indexOf('setReady'),
			'fill before store, or hydrate never sees the parsed city',
		);
	});

	it('the card paints city under the name, not as a walked heading', () => {
		assert.match(gtkSrc, /brandCity\(body && body.brand\)/);
		assert.match(gtkBody, /section.id === 'name' && city/);
		const sections = gtk.profileSections(
			{ brand: { name: 'Rye', city: 'Austin', address: 'Austin, TX' } },
			{ selected: [] },
		);
		assert.equal(
			sections.some((s) => s.id === 'city'),
			false,
			'city is not a SECTION_ORDER dump',
		);
		assert.equal(sections[0].id, 'name');
	});

	it('the empty fixture still paints no city', () => {
		assert.equal(brandCity(fixture.brand), '');
		assert.equal(fillBrandCity(fixture), fixture);
	});

	it('leftover-6 remaining OFF — no geocoder, no second scrape', () => {
		assert.match(citySrc, /leftover-6, remaining OFF/);
		assert.match(citySrc, /leftover-4 dest HOLD/);
		assert.doesNotMatch(cityBody, /\bfetch\(/);
		assert.doesNotMatch(cityBody, /geocode/i);
		assert.doesNotMatch(cityBody, /places\.googleapis/i);
	});
});
