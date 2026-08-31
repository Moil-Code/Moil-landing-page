'use strict';

/**
 * The pre-wall picker, as ROWS a screen can render.
 *
 * `platformChoice.js` owns the vocabulary and the refusals. This owns the one
 * question a screen adds: what goes on the page, in what order, and which
 * rows a finger may land on.
 *
 * ── "DECIDE FOR ME" IS A VISIBLE CHIP, NOT A SIXTH NETWORK ─────────────────
 *
 * Jimmy lock: the control is on the screen, named, pressable. It is still
 * not a row in `pickerRows` — those are networks, and Decide is not one.
 * Clicking it CLEARS the pick (`chooseDecide` → `[]`). Empty and Decide are
 * the same payload: `normalizeChoice` resolves both to every publishable
 * network with `decided: false`, and `buildRegisterUrl` sends nothing so
 * today's default is not frozen into the account.
 *
 * Ticking both Instagram and Facebook is a real choice (`decided: true`)
 * and unchecks the Decide chip. The two answers look different on screen
 * and different in the URL, which is the point of showing the chip.
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
	DECIDE_FOR_ME,
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

/**
 * The Decide For Me chip. Not a network. `checked` when nothing offered
 * is ticked — the same state as an untouched picker.
 * @param {{ selected?: string[] }} [state]
 */
function decideChip(state) {
	const selected = Array.isArray(state && state.selected)
		? state.selected
		: [];
	return {
		id: DECIDE_FOR_ME,
		selectable: true,
		checked: pickerState(selected) === 'decide',
		reason: '',
	};
}

/** Clicking Decide For Me. Empty pick ≡ decide. */
function chooseDecide() {
	return [];
}

module.exports = { pickerRows, toggle, pickerState, decideChip, chooseDecide };
