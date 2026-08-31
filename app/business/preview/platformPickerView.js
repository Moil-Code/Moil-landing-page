'use strict';

/**
 * The pre-wall picker, as ROWS a screen can render.
 *
 * `platformChoice.js` owns the vocabulary and the refusals. This owns the one
 * question a screen adds: what goes on the page, in what order, and which
 * rows a finger may land on.
 *
 * ── "DECIDE FOR ME" IS THE ABSENCE OF A CHOICE, NOT A SIXTH CHIP ───────────
 *
 * `normalizeChoice` already resolves an empty pick to every publishable
 * network with `decided: false` — the receipt that WE chose. Rendering a
 * "Decide for me" chip beside the networks would make it a peer of them, so a
 * founder who ticked it and a founder who ticked both would look the same on
 * screen and different in the payload. The screen says what happens when
 * nothing is ticked, and ticking nothing is how you say it.
 *
 * That is also why this module emits no such row and the eval asserts it.
 *
 * ── A "NOT YET" ROW IS AN ANSWER; AN ABSENT ROW IS NOT ─────────────────────
 *
 * `COMING` networks are rendered, named, and unselectable. An omission reads
 * as an oversight and a founder cannot tell that from a decision — so the
 * answer to "do you do TikTok?" is a visible "not yet" rather than silence.
 * `selectable: false` is the whole contract; a screen that lets a finger land
 * on one has re-created the dead control this picker exists to refuse.
 *
 * Pure: no I/O, no clock, no React, no copy. Labels are passed in, because
 * the landing's translations are the one place copy lives.
 */

const {
	OFFERED,
	COMING,
	isOffered,
} = require('./platformChoice');

/**
 * @param {{ selected?: string[] }} [state]
 * @returns {Array<{id:string, selectable:boolean, checked:boolean, reason:string}>}
 */
function pickerRows(state) {
	const selected = Array.isArray(state && state.selected)
		? state.selected
		: [];
	const rows = OFFERED.map((id) => ({
		id,
		selectable: true,
		checked: selected.includes(id),
		reason: '',
	}));
	for (const c of COMING) {
		rows.push({
			id: c.id,
			selectable: false,
			checked: false,
			reason: c.reason,
		});
	}
	return rows;
}

/**
 * Toggle one id. REFUSES anything not offered rather than adding it — the
 * screen renders unselectable rows, and a click handler that trusted its own
 * markup would be one DOM edit away from putting TikTok in the payload.
 */
function toggle(selected, id) {
	const list = Array.isArray(selected) ? selected : [];
	const key =
		typeof id === 'string' ? id.trim().toLowerCase() : '';
	if (!isOffered(key)) return list.slice();
	return list.includes(key)
		? list.filter((p) => p !== key)
		: [...list, key];
}

/**
 * What the screen says under the rows.
 *
 * `'decide'` when nothing is ticked — the honest description of what will
 * happen, which is that we choose. `'chosen'` otherwise. Never a third state:
 * an "invalid" pick cannot exist, because `toggle` refuses one.
 */
function pickerState(selected) {
	const list = Array.isArray(selected) ? selected : [];
	return list.some((p) => isOffered(p)) ? 'chosen' : 'decide';
}

module.exports = { pickerRows, toggle, pickerState };
