'use strict';

/**
 * previewInput — client-side reading of the three doors.
 *
 * Mirrors the server's `service/preview/previewIdentity.js` closely enough to
 * tell a visitor what is wrong BEFORE a round trip, and never more loosely.
 * The server stays the authority; this only decides what we bother to send.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────
 * Two of the three doors could not succeed, for reasons that were invisible
 * from the outside.
 *
 * 1. The handle door never sent `platform`. The server refuses to guess which
 *    platform a bare handle belongs to — guessing is how you render a
 *    stranger's account under someone else's business name — so it returned
 *    `bad_handle` every single time. The message it returned, "include the
 *    platform", asked for something the form gave no way to provide. The door
 *    had a 0% success rate by construction.
 *
 * 2. The website field was `<input type="url">`, so the browser rejected
 *    `yourbusiness.com` before the request was ever made. The server has
 *    accepted bare hosts all along — it adds the scheme itself, with a comment
 *    calling that "the difference between a working field and a field everyone
 *    fails on their first try." The client was failing everyone anyway.
 *
 * Pure: no I/O, no DOM, no clock.
 */

// The server keys handles on these four and refuses the rest. Keep in step
// with HANDLE_PLATFORMS in previewIdentity.js — a platform we offer here and
// the server rejects is another dead door.
var PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin'];

// Host fragments people paste. Ordered so `facebook.com` wins before any
// shortener alias of it.
var PLATFORM_HOSTS = [
	['instagram', ['instagram.com', 'instagr.am']],
	['facebook', ['facebook.com', 'fb.com', 'fb.me', 'm.facebook.com']],
	['tiktok', ['tiktok.com', 'vm.tiktok.com']],
	['linkedin', ['linkedin.com', 'lnkd.in']],
];

var INTERNAL_SUFFIXES = ['.local', '.internal', '.localdomain', '.home', '.lan'];
var PUBLIC_HOST_RE = /^(?!-)[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,63}$/;
var PLACE_ID_RE = /^[A-Za-z0-9_-]{10,255}$/;

function str(v) {
	return typeof v === 'string' ? v.trim() : '';
}

/**
 * Read whatever someone typed into the website box.
 * @returns {{ ok: true, website: string, host: string } | { ok: false, reason: string }}
 */
function readWebsite(input) {
	var raw = str(input);
	if (!raw) return { ok: false, reason: 'empty' };

	// A profile URL in the website box is the single most common mis-fill, and
	// it deserves its own answer rather than a generic refusal — the visitor
	// has a perfectly good handle, just in the wrong field.
	var platformGuess = platformFromUrl(raw);
	if (platformGuess) return { ok: false, reason: 'is_social', platform: platformGuess };

	var withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
	var parsed;
	try {
		parsed = new URL(withScheme);
	} catch (_e) {
		return { ok: false, reason: 'unreadable' };
	}
	if (!/^https?:$/.test(parsed.protocol)) return { ok: false, reason: 'unreadable' };
	if (parsed.username || parsed.password) return { ok: false, reason: 'unreadable' };
	if (parsed.port) return { ok: false, reason: 'unreadable' };

	var host = parsed.hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '').toLowerCase();
	if (!host || host === 'localhost') return { ok: false, reason: 'unreadable' };
	if (host.indexOf(':') >= 0) return { ok: false, reason: 'unreadable' };
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return { ok: false, reason: 'unreadable' };
	for (var i = 0; i < INTERNAL_SUFFIXES.length; i++) {
		if (host.slice(-INTERNAL_SUFFIXES[i].length) === INTERNAL_SUFFIXES[i]) {
			return { ok: false, reason: 'unreadable' };
		}
	}
	if (!PUBLIC_HOST_RE.test(host)) return { ok: false, reason: 'unreadable' };

	var keyHost = host.replace(/^www\./, '');
	if (!keyHost || !PUBLIC_HOST_RE.test(keyHost)) return { ok: false, reason: 'unreadable' };

	// Send the bare origin. The server drops the path anyway ("a business is a
	// site, not the one page they happened to be on"), so sending the path
	// would only invite a mismatch between what we echo back and what it keys.
	return { ok: true, website: 'https://' + keyHost, host: keyHost };
}

/** Platform implied by a pasted profile URL, or ''. */
function platformFromUrl(input) {
	var raw = str(input).toLowerCase();
	if (!raw) return '';
	var withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
	var host;
	try {
		host = new URL(withScheme).hostname.replace(/^www\./, '');
	} catch (_e) {
		return '';
	}
	for (var i = 0; i < PLATFORM_HOSTS.length; i++) {
		var name = PLATFORM_HOSTS[i][0];
		var hosts = PLATFORM_HOSTS[i][1];
		for (var j = 0; j < hosts.length; j++) {
			if (host === hosts[j] || host.slice(-(hosts[j].length + 1)) === '.' + hosts[j]) {
				return name;
			}
		}
	}
	return '';
}

/**
 * Read the handle box plus the platform chip.
 *
 * A pasted profile URL wins over the chip: someone who pastes an Instagram
 * link has told us the platform more definitively than a chip they may not
 * have noticed. Everything else falls back to the chip, which is why the chip
 * always carries a default rather than starting empty.
 *
 * @returns {{ ok: true, handle: string, platform: string } | { ok: false, reason: string }}
 */
function readHandle(input, chosenPlatform) {
	var raw = str(input);
	if (!raw) return { ok: false, reason: 'empty' };

	var platform = platformFromUrl(raw);
	var value = raw;

	if (platform) {
		// Take the first path segment: instagram.com/moilworks/?hl=en → moilworks
		var withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
		try {
			var path = new URL(withScheme).pathname || '';
			var parts = path.split('/').filter(Boolean);
			// linkedin.com/company/moilapp — the company slug is the second part.
			if (platform === 'linkedin' && parts.length > 1 && /^(company|in|school)$/.test(parts[0])) {
				value = parts[1];
			} else {
				value = parts.length ? parts[0] : '';
			}
		} catch (_e) {
			value = '';
		}
		if (!value) return { ok: false, reason: 'unreadable' };
	} else {
		platform = str(chosenPlatform).toLowerCase();
		if (PLATFORMS.indexOf(platform) < 0) return { ok: false, reason: 'no_platform' };
		// A bare host that is not a known platform is a website, not a handle.
		if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) || /\.[a-z]{2,}(\/|$)/i.test(raw)) {
			return { ok: false, reason: 'is_website' };
		}
	}

	value = value.replace(/^@+/, '').replace(/\/+$/, '').trim();
	// Same shape the server's normalizeSocialHandle accepts. Refusing here
	// costs one inline message; sending it costs a round trip and a generic
	// server refusal that names no field.
	if (!/^[A-Za-z0-9._-]{1,60}$/.test(value)) return { ok: false, reason: 'unreadable' };

	return { ok: true, handle: value, platform: platform };
}

/** Shape-only, same as the server. An empty id means nothing was picked. */
function readPlaceId(input) {
	var placeId = str(input);
	if (!placeId) return { ok: false, reason: 'empty' };
	if (!PLACE_ID_RE.test(placeId)) return { ok: false, reason: 'unreadable' };
	return { ok: true, placeId: placeId };
}

module.exports = {
	PLATFORMS: PLATFORMS,
	readWebsite: readWebsite,
	readHandle: readHandle,
	readPlaceId: readPlaceId,
	platformFromUrl: platformFromUrl,
};
