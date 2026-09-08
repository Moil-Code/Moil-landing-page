'use strict';

/**
 * previewCity — city on the ready card, only when we were given one.
 *
 * `shapeReadyPayload` already puts `brand.city` and `brand.address` on
 * the GET. The magnet never declared either, so convert was the first
 * time a founder saw their own location. This module is fill / display
 * only: a city we were given, or a city the address line already names
 * in a parseable "Austin, TX" shape. Same field hydrate reads
 * (`brand.city`). Empty stays empty.
 *
 * NEVER from a tagline, overview, query string, or nearby prose —
 * "the best loaf in Austin" is not a locality (previewCompose refuses
 * the same lift). Geography of Global / worldwide is rejected.
 *
 * leftover-4 dest HOLD: this module does not persist. Hydrate lives on
 * Onboarding. leftover-6, remaining OFF: no second scrape, no website
 * builder, no geocoder.
 *
 * Pure: no I/O, no clock, no React.
 */

function asText(value) {
	if (typeof value !== 'string') return '';
	return value.trim().replace(/\s+/g, ' ');
}

const GLOBAL_GEO_RE =
	/^(global|worldwide|world[\s-]?wide|international|everywhere)$/i;

/**
 * US states + DC, and CA provinces. The "City, ST" parse is only
 * admitted when ST is one of these — a trailing ", XX" that is not a
 * region is not a city.
 */
const US_CA_REGION = new Set(
	(
		'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA ' +
		'MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX ' +
		'UT VT VA WA WV WI WY ON QC BC AB MB SK NS NB PE NL NT YT NU'
	).split(' '),
);

function isGlobalGeography(raw) {
	const v = asText(raw);
	return !v ? false : GLOBAL_GEO_RE.test(v);
}

/** A locality we were given. Global geography is not a city. */
function admitCity(raw) {
	const v = asText(raw).slice(0, 80);
	if (!v || isGlobalGeography(v)) return '';
	return v;
}

/**
 * The captured token must look like a place name, not a street.
 * "St. Paul" is a city; "Oak St" is not.
 */
function cleanCityToken(raw) {
	const city = asText(raw).replace(/\.$/, '');
	if (city.length < 2) return '';
	if (/\d/.test(city)) return '';
	if (
		/\b(street|avenue|road|boulevard|lane|drive|highway|suite|apartment|unit)\b/i.test(
			city,
		)
	) {
		return '';
	}
	if (/\s(st|ave|rd|blvd|ln|dr|hwy|ste|apt|fl)\.?$/i.test(city)) {
		return '';
	}
	return city;
}

/**
 * City, ST at the end of a postal line. "Austin, TX" and
 * "2114 E Cesar Chavez St, Austin, TX 78702" both yield Austin.
 * "100 Main St" yields nothing — that is a street, not a city.
 *
 * @param {unknown} address
 * @returns {string}
 */
function cityFromAddress(address) {
	const line = asText(address);
	if (!line) return '';
	if (/^https?:\/\//i.test(line)) return '';
	const m = line.match(
		/(?:^|,\s*)([A-Za-z][A-Za-z .'-]{0,39}),\s*([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/,
	);
	if (!m) return '';
	const region = m[2].toUpperCase();
	if (!US_CA_REGION.has(region)) return '';
	return admitCity(cleanCityToken(m[1]));
}

/**
 * Prefer the given locality. Parse the address only when extract left
 * city blank. Never reads tagline / overview / website.
 *
 * @param {object | null | undefined} brand
 * @returns {string}
 */
function brandCity(brand) {
	if (!brand || typeof brand !== 'object') return '';
	const given = admitCity(brand.city);
	if (given) return given;
	return cityFromAddress(brand.address);
}

/**
 * Shallow-fill `brand.city` when extract left it blank but the address
 * names a city. Same field hydrate already reads. Does not persist.
 * Does not invent.
 *
 * @param {object | null | undefined} body
 * @returns {object | null | undefined}
 */
function fillBrandCity(body) {
	if (!body || typeof body !== 'object') return body;
	const brand =
		body.brand && typeof body.brand === 'object' ? body.brand : null;
	if (!brand) return body;
	const city = brandCity(brand);
	if (!city) return body;
	if (admitCity(brand.city) === city) return body;
	return { ...body, brand: { ...brand, city } };
}

module.exports = {
	brandCity,
	cityFromAddress,
	fillBrandCity,
};
