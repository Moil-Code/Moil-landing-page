#!/usr/bin/env node
'use strict';

/**
 * Clicking "Partners" (or "Work") in the header goes to that page.
 *   node --test evals/navPartnersLink.test.js
 *
 * The trigger used to be a <button> that only toggled the dropdown, so a visitor
 * who clicked Partners went nowhere. It is a link now; the dropdown opens on
 * hover and focus.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, '../app/business/components/BusinessNav.tsx'), 'utf8')
	.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

test('the Work and Partners triggers are links to their pages', () => {
	const i = SRC.indexOf('className="nav-menu-trigger"\n                href={item.href}');
	assert.ok(i > -1, 'the item trigger must be <a href={item.href}>');
	const tag = SRC.slice(SRC.lastIndexOf('<', i), SRC.indexOf('>', i));
	assert.match(tag, /^<a\b/);
	assert.doesNotMatch(tag, /type="button"/);
	assert.doesNotMatch(tag, /onClick=/, 'a click must navigate, not toggle the menu');
});

test('hover and keyboard focus still open the dropdown, and Escape closes it', () => {
	assert.match(SRC, /onMouseEnter=\{\(\) => setOpenMegaMenu\(menuName\)\}/);
	assert.match(SRC, /onFocus=\{\(\) => setOpenMegaMenu\(menuName\)\}/);
	assert.match(SRC, /event\.key === 'Escape'\) setOpenMegaMenu\(null\)/);
});

test('the Partners nav item points at /partners', () => {
	const content = fs.readFileSync(path.join(__dirname, '../app/business/BusinessPageContent.tsx'), 'utf8');
	assert.match(content, /label: 'Partners', href: '\/partners'/);
});
