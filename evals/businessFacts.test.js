#!/usr/bin/env node
'use strict';

/**
 * The listing facts are verbatim, or absent.
 *   node --test evals/businessFacts.test.js
 *
 * `parseBusinessSignals` reads a local business's own JSON-LD — phone,
 * hours, price range, founding year, rating. This file pins the half a
 * stranger reads: nothing derived, nothing rounded, nothing filled, and
 * NO ROW AT ALL when the page published none of it.
 *
 * A field the server sends and nothing renders is not a feature, so the
 * wiring is asserted too: the card must import this module, compute it,
 * and paint it.
 */

const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const {
	HOURS_MAX,
	DAY_ORDER,
	orderDays,
	scheduleLines,
	businessFacts,
} = require('../app/business/preview/businessFacts');

let checks = 0;
let failed = 0;
const DECLARED = 21;

// Registered at the TOP: a check that never runs produces no output
// whose absence anyone would notice.
process.on('exit', () => {
	if (process.exitCode) return;
	if (checks !== DECLARED) {
		console.log(
			`FAIL reachability: ${checks} of ${DECLARED} declared checks ran`,
		);
		process.exitCode = 1;
	}
});

function ok(label, cond) {
	checks += 1;
	if (cond) {
		console.log('ok  ', label);
		return;
	}
	failed += 1;
	console.log('FAIL', label);
}

const body = (signals) => ({ brand: { businessSignals: signals } });

const full = {
	telephone: '(512) 555-0147',
	priceRange: '$$',
	foundedYear: '2011',
	hours: [{ days: ['Wed', 'Tue'], opens: '07:00', closes: '14:00' }],
	rating: { value: 4.9, count: 212 },
};

/* ------------------------------------------------------------------ *
 * 1. Verbatim
 * ------------------------------------------------------------------ */
{
	const f = businessFacts(body(full));
	const byId = Object.fromEntries(
		(f ? f.chips : []).map((c) => [c.id, c.value]),
	);

	ok(
		'the phone is printed exactly as the page wrote it',
		byId.phone === '(512) 555-0147',
	);
	ok('the price range is carried verbatim', byId.price === '$$');
	ok('the founding year is carried verbatim', byId.since === '2011');
	ok(
		'the rating keeps both halves, unrounded',
		!!f && !!f.rating && f.rating.value === 4.9 && f.rating.count === 212,
	);
	ok(
		'hours keep the page’s own times',
		!!f &&
			f.hours.length === 1 &&
			f.hours[0].opens === '07:00' &&
			f.hours[0].closes === '14:00',
	);
	// The page may declare them in any order; handing "Wed, Tue" back
	// reads as a bug about US, not about their markup.
	ok(
		'days come back in the week’s own order',
		!!f && f.hours[0].days.join(',') === 'Tue,Wed',
	);
}

/* ------------------------------------------------------------------ *
 * 2. Refusals — each one a different way to be confidently wrong
 * ------------------------------------------------------------------ */
{
	// The server already refuses this; the card refuses it again rather
	// than trusting the wire, because an unfalsifiable star is the one
	// line here worth fabricating.
	const noCount = businessFacts(
		body({ ...full, rating: { value: 4.9 } }),
	);
	ok(
		'a rating with no review count is refused at the card too',
		!!noCount && noCount.rating === null,
	);

	ok(
		'a zero-count rating is refused',
		(() => {
			const f = businessFacts(
				body({ ...full, rating: { value: 4.9, count: 0 } }),
			);
			return !!f && f.rating === null;
		})(),
	);

	// "Mon 7am–" reads as broken and inventing the other end states
	// when a founder's shop shuts.
	ok(
		'a half-declared range is dropped, never half-printed',
		scheduleLines([{ days: ['Mon'], opens: '08:00' }]).length === 0,
	);

	ok(
		'a schedule line with no days is dropped',
		scheduleLines([{ days: [], opens: '08:00', closes: '17:00' }])
			.length === 0,
	);

	ok(
		`no more than ${HOURS_MAX} schedule lines are shown`,
		scheduleLines(
			Array.from({ length: 9 }, () => ({
				days: ['Mon'],
				opens: '08:00',
				closes: '17:00',
			})),
		).length === HOURS_MAX,
	);

	// A row under a heading with nothing in it reads as a thing that
	// failed rather than a thing we did not claim.
	ok(
		'a page publishing none of this renders NO row',
		businessFacts(body({ telephone: '', hours: [], rating: null })) ===
			null,
	);
	ok('a body with no brand renders no row', businessFacts({}) === null);
	ok('a malformed body renders no row', businessFacts(null) === null);

	// The server maps days through its own closed three-letter set and
	// drops what it cannot map, so a longer value means the contract
	// broke. Printing it anyway would put a string the schedule reader
	// never sanctioned onto a stranger's card.
	ok(
		'a day the server could never send is dropped, not printed',
		orderDays(['Mon', 'Festivo']).join(',') === 'Mon',
	);
	ok(
		'the day vocabulary is the seven-day week',
		DAY_ORDER.length === 7 && DAY_ORDER[0] === 'Mon',
	);
}

/* ------------------------------------------------------------------ *
 * 3. Wiring — a field nothing renders is not a feature
 * ------------------------------------------------------------------ */
{
	const card = fs.readFileSync(
		path.join(
			__dirname,
			'../app/business/components/GettingToKnowYou.tsx',
		),
		'utf8',
	);

	ok(
		'the card imports the rules rather than re-deriving them',
		/from '\.\.\/preview\/businessFacts'/.test(card),
	);
	ok(
		'the card computes the facts from the body it was given',
		/businessFacts\(body\)/.test(card),
	);
	ok(
		'the card paints the strip',
		/<FactStrip\s/.test(card) && /function FactStrip\(/.test(card),
	);
	// No row when there is nothing to say — the same refusal the rules
	// make, kept at the render site.
	ok(
		'the strip is rendered only when there are facts',
		/\{facts \? <FactStrip/.test(card),
	);

	const en = fs.readFileSync(
		path.join(__dirname, '../src/common/translations/en.ts'),
		'utf8',
	);
	const es = fs.readFileSync(
		path.join(__dirname, '../src/common/translations/es.ts'),
		'utf8',
	);
	const keys = ['factsTitle', 'factPhone', 'factPrice', 'factSince'];
	ok(
		'every label ships in EN and ES',
		keys.every((k) => en.includes(`${k}:`) && es.includes(`${k}:`)),
	);
}

if (failed) {
	console.log(`\n${failed} of ${checks} checks failed`);
	process.exitCode = 1;
} else {
	console.log(`\n${checks}/${checks} checks passed`);
}
