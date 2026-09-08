'use strict';

/** WCAG contrast helpers for brand-supplied social creative colours. */
const WCAG_AA_NORMAL_TEXT = 4.5;
const DARK_INK = '#0D091C';
const LIGHT_INK = '#FFFFFF';
const DEFAULT_SURFACE = '#F3F0FC';

function parseHex(value) {
	if (typeof value !== 'string') return null;
	let raw = value.trim().replace(/^#/, '');
	if (/^[0-9a-f]{3}$/i.test(raw)) raw = raw.split('').map((c) => c + c).join('');
	if (!/^[0-9a-f]{6}$/i.test(raw)) return null;
	return [0, 2, 4].map((i) => Number.parseInt(raw.slice(i, i + 2), 16));
}

function toHex(rgb) {
	return '#' + rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function normalizeHex(value, fallback = '') {
	const rgb = parseHex(value);
	return rgb ? toHex(rgb) : fallback;
}

function luminance(value) {
	const rgb = parseHex(value);
	if (!rgb) return null;
	const channels = rgb.map((n) => {
		const c = n / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
	const one = luminance(a);
	const two = luminance(b);
	if (one == null || two == null) return 0;
	const lighter = Math.max(one, two);
	const darker = Math.min(one, two);
	return (lighter + 0.05) / (darker + 0.05);
}

function mix(from, to, amount) {
	const a = parseHex(from);
	const b = parseHex(to);
	if (!a || !b) return '';
	return toHex(a.map((channel, i) => channel + (b[i] - channel) * amount));
}

/**
 * Keep the requested brand colour when it passes. Otherwise move it toward
 * whichever neutral has the stronger contrast, stopping at the first AA-safe
 * shade so the creative retains as much of the brand hue as possible.
 */
function accessibleTextColor(background, preferred, minimum = WCAG_AA_NORMAL_TEXT) {
	const surface = normalizeHex(background, DEFAULT_SURFACE);
	const wanted = normalizeHex(preferred, DARK_INK);
	if (contrastRatio(surface, wanted) >= minimum) return wanted;

	const target = contrastRatio(surface, LIGHT_INK) >= contrastRatio(surface, DARK_INK)
		? LIGHT_INK
		: DARK_INK;
	for (let step = 1; step <= 20; step += 1) {
		const candidate = mix(wanted, target, step / 20);
		if (contrastRatio(surface, candidate) >= minimum) return candidate;
	}
	return target;
}

module.exports = {
	WCAG_AA_NORMAL_TEXT,
	DARK_INK,
	LIGHT_INK,
	DEFAULT_SURFACE,
	normalizeHex,
	contrastRatio,
	accessibleTextColor,
};
