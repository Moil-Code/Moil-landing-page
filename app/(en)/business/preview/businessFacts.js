'use strict';

/**
 * businessFacts — the "we read your listing" row on the ready card.
 *
 * The card's beats are all PROSE we lifted off the page. A local
 * business also publishes hard facts in its own JSON-LD — the phone it
 * answers, the hours it opens, the year it started, the rating its
 * customers left — and `parseBusinessSignals` now reads them. This is
 * the consumer: a field the server sends and nothing renders is not a
 * feature.
 *
 * ── EVERY LINE IS VERBATIM, AND ZERO IS A REAL ANSWER ───────────────
 * Nothing here is derived, rounded, reformatted or filled. A phone
 * number is printed exactly as the founder's own markup writes it,
 * because a "helpfully" reformatted number is a number that may not
 * dial. A business with no signals renders NO row — never a heading
 * over an empty frame, which reads as something that failed rather
 * than something we did not claim.
 *
 * ── A RATING NEEDS BOTH HALVES ──────────────────────────────────────
 * The server already refuses a star with no review count (an
 * unfalsifiable figure is the shape a fabricated rating takes). This
 * module refuses it a second time rather than trusting the wire: the
 * card is what a stranger reads, and a 4.9 with no denominator on it is
 * the one line here that would be worth fabricating.
 *
 * ── HOURS ARE A SCHEDULE, NOT AN "OPEN NOW" ─────────────────────────
 * Answering "are they open right now" needs a clock AND the shop's own
 * timezone, and we hold neither. So the row states the schedule the
 * page states and claims nothing about this minute — the same refusal
 * the server's reader makes, kept on the surface a customer sees.
 *
 * Pure: no I/O, no clock, no React.
 */

/** Most schedule lines we will show. The rest omit rather than crowd. */
const HOURS_MAX = 4;

/** Longest verbatim value we will print in a fact chip. */
const FACT_MAX = 40;

const DAY_ORDER = Object.freeze([
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
	'Sun',
]);

function text(value, max) {
	if (typeof value !== 'string') return '';
	const t = value.trim().replace(/\s+/g, ' ');
	if (!t) return '';
	return t.length > max ? '' : t;
}

/**
 * A day run, in the week's own order. The server sends whatever the
 * page declared; showing "Wed, Mon" back reads as a bug about US.
 */
function orderDays(days) {
	if (!Array.isArray(days)) return [];
	const seen = new Set();
	const kept = [];
	for (const d of days) {
		const t = text(d, 4);
		if (!t || seen.has(t)) continue;
		seen.add(t);
		kept.push(t);
	}
	// The server maps every day through its own closed three-letter
	// vocabulary and DROPS what it cannot map, so anything else here
	// means the contract broke — `text(d, 4)` refuses it rather than
	// printing a value the schedule reader never sanctioned. The sort
	// therefore only ever orders known names; an unknown one holds its
	// position instead of being shuffled to an arbitrary end.
	kept.sort((a, b) => {
		const ai = DAY_ORDER.indexOf(a);
		const bi = DAY_ORDER.indexOf(b);
		if (ai === -1 || bi === -1) return 0;
		return ai - bi;
	});
	return kept;
}

function scheduleLines(hours) {
	if (!Array.isArray(hours)) return [];
	const out = [];
	for (const h of hours) {
		if (!h || typeof h !== 'object') continue;
		const days = orderDays(h.days);
		const opens = text(h.opens, 10);
		const closes = text(h.closes, 10);
		// Half a range is not a schedule: "Mon 7am–" reads as broken,
		// and inventing the other end states when a shop shuts.
		if (!days.length || !opens || !closes) continue;
		out.push({ days, opens, closes });
		if (out.length >= HOURS_MAX) break;
	}
	return out;
}

/**
 * The chips and schedule the card should paint, or null when the page
 * published none of it.
 */
function businessFacts(body) {
	const raw =
		body &&
		typeof body === 'object' &&
		body.brand &&
		typeof body.brand === 'object'
			? body.brand.businessSignals
			: null;
	if (!raw || typeof raw !== 'object') return null;

	const chips = [];
	const phone = text(raw.telephone, FACT_MAX);
	if (phone) chips.push({ id: 'phone', value: phone });
	const price = text(raw.priceRange, 20);
	if (price) chips.push({ id: 'price', value: price });
	const year = text(raw.foundedYear, 8);
	if (year) chips.push({ id: 'since', value: year });

	const rating =
		raw.rating &&
		typeof raw.rating === 'object' &&
		Number.isFinite(raw.rating.value) &&
		Number.isFinite(raw.rating.count) &&
		raw.rating.count >= 1
			? { value: raw.rating.value, count: raw.rating.count }
			: null;

	const hours = scheduleLines(raw.hours);

	if (!chips.length && !hours.length && !rating) return null;
	return { chips, hours, rating };
}

module.exports = {
	HOURS_MAX,
	FACT_MAX,
	DAY_ORDER,
	orderDays,
	scheduleLines,
	businessFacts,
};
