'use strict';

/**
 * "Where should your business show up?" — the pre-wall platform choice.
 *
 * ── THE PLAN NAMES FIVE NETWORKS AND WE PUBLISH TO TWO ─────────────────────
 *
 * `MARKETING_FIRST_REBUILD_PLAN` step 3 specifies this picker from the
 * competitor's own pre-wall transcript: *TikTok · Instagram · YouTube ·
 * Facebook · LinkedIn · or Decide For Me*. Built verbatim that is a promise we
 * cannot keep. The backend's `utils/socialPlatforms.js` is explicit:
 *
 *   PUBLISHABLE_PLATFORMS = instagram, facebook
 *   KNOWN_PLATFORMS       = instagram, facebook, linkedin
 *
 * and its own comment says "the gap between the two lists is the honest
 * description of what we ship". LinkedIn has a caption variant, a voice and a
 * handle slot and NO scheduler branch; TikTok and YouTube are not even known.
 *
 * A founder who ticks TikTok on the acquisition screen, hands over an email,
 * and never sees a TikTok post has been told something untrue at the moment
 * they trusted us most. That is the dead-control failure this product has
 * removed three times — the decorative `requires_video` toggle, the Autopilot
 * video switches, the frames panel that composited nothing — and it would be
 * worse here, because a competitor's version of this screen presumably works.
 *
 * ── SO THE PICKER OFFERS WHAT IT CAN HONOUR, AND NAMES THE REST ────────────
 *
 * `OFFERED` is what a founder may CHOOSE. `COMING` is named on the same
 * screen, unselectable, so the answer to "do you do TikTok?" is a visible
 * "not yet" rather than a silent absence — an omission reads as an oversight,
 * and a founder cannot tell the two apart.
 *
 * `OFFERED` MUST NEVER EXCEED THE BACKEND'S `PUBLISHABLE_PLATFORMS`. That is
 * not a convention: the two repos cannot import each other, so the backend
 * carries a committed pin of this file's list and fails if it ever grows past
 * what the scheduler can serve. Moving a platform from COMING to OFFERED is a
 * two-repo change with a human in the middle, by construction.
 *
 * Pure: no I/O, no clock, no React.
 */

/** A founder may pick these. Lockstep with the backend's PUBLISHABLE set. */
const OFFERED = Object.freeze(['instagram', 'facebook']);

/**
 * Named on the screen, never selectable. `reason` is what the founder is
 * told — each is TRUE today and each is checkable in the backend:
 *   linkedin — vocabulary exists (caption variant, voice), no OAuth, no
 *              scheduler branch.
 *   tiktok / youtube — no vocabulary at all.
 */
const COMING = Object.freeze([
	Object.freeze({ id: 'linkedin', reason: 'not-connected-yet' }),
	Object.freeze({ id: 'tiktok', reason: 'not-supported-yet' }),
	Object.freeze({ id: 'youtube', reason: 'not-supported-yet' }),
]);

/**
 * The honest form of "Decide For Me". It is the DEFAULT, not a sixth option:
 * a founder who skips the question has not chosen nothing, they have asked us
 * to choose — which for a two-network product means both.
 */
const DECIDE_FOR_ME = 'decide';

/** What `DECIDE_FOR_ME` resolves to. Never a guess — with two publishable
 *  networks, "decide for me" is both, and saying so beats picking one. */
const DECIDE_RESOLVES_TO = OFFERED;

const OFFERED_SET = new Set(OFFERED);
const COMING_SET = new Set(COMING.map((c) => c.id));

/**
 * @param {unknown} raw  what the picker collected
 * @returns {{ platforms: string[], decided: boolean, refused: string[] }}
 *
 * `refused` is REPORTED rather than silently dropped: a client that somehow
 * submits `tiktok` must not have it vanish, or the screen and the stored
 * answer disagree with nothing to explain it.
 */
function normalizeChoice(raw) {
	if (raw === DECIDE_FOR_ME) {
		return { platforms: [...DECIDE_RESOLVES_TO], decided: false, refused: [] };
	}
	const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
	const platforms = [];
	const refused = [];
	for (const item of list) {
		const id = typeof item === 'string' ? item.trim().toLowerCase() : '';
		if (!id) continue;
		if (OFFERED_SET.has(id)) {
			if (!platforms.includes(id)) platforms.push(id);
		} else if (!refused.includes(id)) {
			refused.push(id);
		}
	}
	// AN EMPTY CHOICE IS "DECIDE FOR ME", NOT "NO NETWORKS". A founder who
	// ticked nothing and pressed continue wants to get on with it; storing an
	// empty set would produce a month with nowhere to go, and they would find
	// out a week later.
	if (!platforms.length) {
		return { platforms: [...DECIDE_RESOLVES_TO], decided: false, refused };
	}
	return { platforms, decided: true, refused };
}

/** Is this something the screen may render as pickable? */
function isOffered(id) {
	return OFFERED_SET.has(String(id || '').trim().toLowerCase());
}

/** Is this named-but-unavailable? Anything in neither set is unknown, and the
 *  screen must not invent a row for it. */
function isComing(id) {
	return COMING_SET.has(String(id || '').trim().toLowerCase());
}

module.exports = {
	OFFERED,
	COMING,
	DECIDE_FOR_ME,
	DECIDE_RESOLVES_TO,
	normalizeChoice,
	isOffered,
	isComing,
};
