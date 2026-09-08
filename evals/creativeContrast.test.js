#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const contrast = require('../app/business/preview/creativeContrast');
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

describe('preview creative contrast', () => {
	it('repairs dark brand text on saturated blue to WCAG AA', () => {
		const background = '#1268C4';
		const unsafe = '#111827';
		assert.ok(contrast.contrastRatio(background, unsafe) < 4.5);
		const repaired = contrast.accessibleTextColor(background, unsafe);
		assert.ok(contrast.contrastRatio(background, repaired) >= 4.5);
		assert.notEqual(repaired, unsafe);
	});

	it('repairs white text on a white surface', () => {
		const repaired = contrast.accessibleTextColor('#FFFFFF', '#FFFFFF');
		assert.ok(contrast.contrastRatio('#FFFFFF', repaired) >= 4.5);
	});

	it('keeps a brand colour that already passes', () => {
		assert.equal(contrast.accessibleTextColor('#FFFFFF', '#3A1A78'), '#3A1A78');
	});

	it('normalizes short hex and gives malformed colours a safe surface', () => {
		assert.equal(contrast.normalizeHex('#abc'), '#AABBCC');
		const repaired = contrast.accessibleTextColor('not-a-colour', 'also-bad');
		assert.ok(contrast.contrastRatio(contrast.DEFAULT_SURFACE, repaired) >= 4.5);
	});

	it('the preview renderer uses the contrast result for every text layer', () => {
		const source = read('app/business/components/GettingToKnowYou.tsx');
		assert.match(source, /accessibleTextColor\(surface, card\.primary\)/);
		assert.match(source, /accessibleTextColor\(surface, card\.accent/);
		assert.match(source, /backgroundColor: surface/);
	});

	it('preview action orange uses white ink and active chips keep their fill', () => {
		const css = read('app/business/business.css');
		assert.ok(contrast.contrastRatio('#CC3D00', '#FFFFFF') >= 4.5);
		assert.match(css, /\.preview-platform-chip--active\s*\{[^}]*background:\s*var\(--orange-action\)[^}]*color:\s*#FFFFFF/s);
		assert.match(css, /\.preview-primary-cta\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*var\(--orange-action\)/s);
	});
});
