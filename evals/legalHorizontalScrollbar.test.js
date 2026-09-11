#!/usr/bin/env node
'use strict';

const { it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const businessCss = fs.readFileSync(
	path.join(__dirname, '..', 'app', 'business', 'business.css'),
	'utf8',
);

it('keeps horizontal scrollbars as thin as vertical scrollbars', () => {
	const scrollbarRule = businessCss.match(/::\-webkit-scrollbar\s*\{([^}]*)\}/);
	assert.ok(scrollbarRule, 'expected the shared WebKit scrollbar rule');
	assert.match(scrollbarRule[1], /\bwidth:\s*3px\s*;/, 'vertical scrollbar should stay thin');
	assert.match(
		scrollbarRule[1],
		/\bheight:\s*3px\s*;/,
		'horizontal scrollbar should not fall back to the browser default height',
	);
});
