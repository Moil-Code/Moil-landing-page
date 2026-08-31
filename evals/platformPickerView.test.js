'use strict';

/**
 * THE PICKER'S SCREEN — what a founder can put a finger on.
 *
 * `platformChoice.js` owns the vocabulary and the refusals; this covers the
 * one question a screen adds. These go RED if:
 *   - a network we cannot honour becomes selectable
 *   - a "not yet" row is dropped, turning an answer back into silence
 *   - Decide For Me is missing from the screen, or becomes a sixth network
 *     in pickerRows
 *   - a click handler trusts its own markup and admits an unofferable id
 *   - a row exists with no copy in EN or ES
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {
	pickerRows,
	toggle,
	pickerState,
	decideChip,
	chooseDecide,
} = require('../app/business/preview/platformPickerView');
const {
	OFFERED,
	COMING,
} = require('../app/business/preview/platformChoice');

test('every offered network is selectable, and only those', () => {
	const rows = pickerRows();
	const selectable = rows.filter((r) => r.selectable).map((r) => r.id);
	assert.deepStrictEqual(selectable, [...OFFERED]);
});

test('every COMING network is rendered, named, and unselectable', () => {
	// An omission reads as an oversight and a founder cannot tell that from a
	// decision. "Not yet" is an answer; nothing is not.
	const rows = pickerRows();
	for (const c of COMING) {
		const row = rows.find((r) => r.id === c.id);
		assert.ok(row, `${c.id} is missing from the picker`);
		assert.strictEqual(row.selectable, false, c.id);
		assert.strictEqual(row.reason, c.reason, c.id);
	}
});

test('Decide For Me is a visible chip, not a network row', () => {
	const ids = pickerRows().map((r) => r.id);
	assert.ok(!ids.includes('decide'), ids.join(','));
	const empty = decideChip({ selected: [] });
	assert.strictEqual(empty.id, 'decide');
	assert.strictEqual(empty.checked, true);
	assert.strictEqual(empty.selectable, true);
	assert.strictEqual(decideChip({ selected: ['instagram'] }).checked, false);
	assert.deepStrictEqual(chooseDecide(), []);
});

test('checked state reflects the selection', () => {
	const rows = pickerRows({ selected: ['facebook'] });
	assert.strictEqual(rows.find((r) => r.id === 'facebook').checked, true);
	assert.strictEqual(rows.find((r) => r.id === 'instagram').checked, false);
});

test('toggle REFUSES anything not offered', () => {
	// A handler that trusted its own markup would be one DOM edit away from
	// putting TikTok in the payload.
	for (const bad of ['tiktok', 'youtube', 'linkedin', 'decide', '', null, 42]) {
		assert.deepStrictEqual(toggle(['instagram'], bad), ['instagram'], String(bad));
	}
});

test('toggle adds, removes, and normalizes', () => {
	assert.deepStrictEqual(toggle([], 'instagram'), ['instagram']);
	assert.deepStrictEqual(toggle([], ' FACEBOOK '), ['facebook']);
	assert.deepStrictEqual(toggle(['facebook'], 'facebook'), []);
	assert.deepStrictEqual(toggle(['facebook'], 'instagram'), [
		'facebook',
		'instagram',
	]);
});

test('an untouched picker is in the decide state', () => {
	assert.strictEqual(pickerState([]), 'decide');
	assert.strictEqual(pickerState(undefined), 'decide');
	// A list holding only refused ids cannot occur through `toggle`, and if it
	// somehow did it is still not a choice.
	assert.strictEqual(pickerState(['tiktok']), 'decide');
	assert.strictEqual(pickerState(['instagram']), 'chosen');
});

test('the module is pure', () => {
	const src = fs.readFileSync(
		path.join(__dirname, '../app/business/preview/platformPickerView.js'),
		'utf8',
	);
	const body = src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '');
	assert.ok(!/Date\.now\(|new Date\(/.test(body), 'reads a clock');
	assert.ok(!/fetch\(|document\.|window\./.test(body), 'does I/O');
	assert.ok(!/react/i.test(body), 'imports React');
	// Copy lives in the translations, not here — otherwise the picker is
	// English-only and nothing would say so.
	assert.ok(!/'Instagram'|'Not yet'/.test(body), 'holds copy');
});

test('every row has copy in BOTH languages', () => {
	// A row with no string renders blank, which reads as a broken chip. The
	// component derives its key from the id, so a new network needs its copy
	// in the same change or it arrives invisible.
	const keyFor = (id) =>
		'platform' + id.charAt(0).toUpperCase() + id.slice(1);
	const reasonKeyFor = (reason) => {
		const camel = reason
			.split('-')
			.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
			.join('');
		return 'platform' + camel.charAt(0).toUpperCase() + camel.slice(1);
	};
	const needed = new Set(['platformsLabel', 'platformsDecide', 'platformsChosen', 'platformDecideForMe', 'platformsOr']);
	for (const row of pickerRows()) {
		needed.add(keyFor(row.id));
		if (row.reason) needed.add(reasonKeyFor(row.reason));
	}
	for (const lang of ['en', 'es']) {
		const src = fs.readFileSync(
			path.join(__dirname, `../src/common/translations/${lang}.ts`),
			'utf8',
		);
		for (const key of needed) {
			assert.ok(
				new RegExp(`\\b${key}:\\s*['"\`]`).test(src),
				`${lang}.ts is missing ${key}`,
			);
		}
	}
});

test('the screen renders the rows it is given, and refuses through toggle', () => {
	const src = fs.readFileSync(
		path.join(__dirname, '../app/business/components/GettingToKnowYou.tsx'),
		'utf8',
	);
	assert.ok(/pickerRows\(\{ selected: platforms \}\)/.test(src));
	assert.ok(/toggle\(p, row\.id\)/.test(src));
	assert.ok(/chooseDecide\(/.test(src));
	assert.ok(/platformDecideForMe/.test(src));
	const coming = src.slice(src.indexOf('cursor-default'), src.indexOf('platformsOr'));
	assert.ok(coming.length > 20, 'coming rows missing');
	assert.ok(!/onClick/.test(coming), 'a "not yet" row is clickable');
});

test('the choice reaches the register URL', () => {
	// A picker whose answer nothing carries is decoration — the rule this
	// whole feature exists under.
	const src = fs.readFileSync(
		path.join(__dirname, '../app/business/components/PreviewMagnet.tsx'),
		'utf8',
	);
	const at = src.indexOf('const signupHref = useMemo(');
	assert.ok(at > -1, 'signupHref was renamed');
	const block = src.slice(at, at + 400);
	assert.ok(/platforms,/.test(block), 'the href drops the choice');
	assert.ok(/\[lang, slug, platforms\]/.test(block), 'stale memo deps');
});
