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

	it('the free ready card has no post text layers that need the contrast helper', () => {
		const source = read('app/business/components/GettingToKnowYou.tsx');
		assert.doesNotMatch(source, /accessibleTextColor\(/);
		assert.doesNotMatch(source, /backgroundColor: surface/);
		assert.equal(typeof contrast.accessibleTextColor, 'function');
	});

	it('preview action orange uses white ink and active chips keep their fill', () => {
		const css = read('app/business/business.css');
		assert.match(css, /--preview-orange:\s*#FF6633/);
		assert.match(css, /\.preview-platform-chip--active\s*\{[^}]*background:\s*var\(--preview-orange\)[^}]*color:\s*#FFFFFF/s);
		assert.match(css, /\.preview-primary-cta\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*var\(--preview-orange\)/s);
	});
});
