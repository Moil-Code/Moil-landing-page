'use strict';
/**
 * Security hardening pins (2026-09-01 audit).
 *
 * Each check here guards a fix whose regression produces no runtime error:
 * a tracker that loads before consent, a JSON-LD block that stops escaping
 * `<`, a cookie that loses its Secure flag, a framework header that comes
 * back. Nothing errors when these rot — they are silent compliance and
 * hardening losses, which is exactly what an offline scan is for.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const stripComments = (s) =>
	s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

function walk(dir, out = []) {
	for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
		if (e.name === 'node_modules' || e.name === '.next') continue;
		const rel = path.join(dir, e.name);
		if (e.isDirectory()) walk(rel, out);
		else if (/\.(tsx?|jsx?|mjs)$/.test(e.name)) out.push(rel);
	}
	return out;
}

test('every tracker lives inside <Analytics /> and is gated on consent', () => {
	const analytics = stripComments(read('src/common/components/analytics.tsx'));
	assert.match(analytics, /useConsent\(\)/, 'analytics.tsx must read consent');
	assert.match(
		analytics,
		/if \(consent !== 'accepted'\) return null;/,
		'analytics.tsx must render nothing until consent is accepted',
	);
	for (const host of [
		'googletagmanager.com',
		'clarity.ms',
		'connect.facebook.net',
		'assets.apollo.io',
	]) {
		assert.ok(analytics.includes(host), `${host} should be inside analytics.tsx`);
	}
	// No tracker may be mounted anywhere else — that would bypass the gate.
	const files = [...walk('app'), ...walk('src')].filter(
		(f) => f !== path.join('src', 'common', 'components', 'analytics.tsx'),
	);
	for (const f of files) {
		const src = stripComments(read(f));
		for (const host of ['googletagmanager.com/gtag', 'clarity.ms/tag', 'fbevents.js', 'assets.apollo.io']) {
			assert.ok(!src.includes(host), `${f} mounts a tracker outside the consent gate (${host})`);
		}
	}
});

test('consent module honours Global Privacy Control and never defaults to accepted', () => {
	const consent = stripComments(read('src/common/consent.ts'));
	assert.match(consent, /globalPrivacyControl/);
	assert.match(consent, /if \(hasGlobalPrivacyControl\(\)\) return 'rejected';/);
	assert.doesNotMatch(consent, /return 'accepted'/, 'nothing may synthesise an acceptance');
});

test('the cookie banner is the only writer and goes through the consent module', () => {
	const banner = stripComments(read('src/common/components/CookieConsent.tsx'));
	assert.match(banner, /writeConsent\(value\)/);
	assert.doesNotMatch(banner, /localStorage\.setItem/, 'banner must not write storage directly');
});

test('every JSON-LD block is serialised through jsonLd(), which escapes </script>', () => {
	const helper = read('src/common/seo/jsonLd.ts');
	assert.match(helper, /replace\(\/<\/g, '\\\\u003c'\)/);
	const files = [...walk('app'), ...walk('src')];
	let sites = 0;
	for (const f of files) {
		const src = stripComments(read(f));
		assert.ok(
			!/__html:\s*JSON\.stringify\(/.test(src),
			`${f} emits JSON-LD via JSON.stringify — use jsonLd()`,
		);
		const n = (src.match(/__html:\s*jsonLd\(/g) || []).length;
		if (n) {
			sites += n;
			assert.ok(/seo\/jsonLd['"]/.test(src), `${f} calls jsonLd() without importing it`);
		}
	}
	assert.ok(sites >= 20, `expected the walk to see the JSON-LD sites (saw ${sites})`);
	// Behavioural: the escape is real.
	const { execFileSync } = require('node:child_process');
	const out = execFileSync(process.execPath, ['-e', `
		const src = require('fs').readFileSync(${JSON.stringify(path.join(ROOT, 'src/common/seo/jsonLd.ts'))}, 'utf8')
			.replace(/export function jsonLd\\(value: unknown\\): string/, 'function jsonLd(value)');
		const fn = new Function(src + '; return jsonLd;')();
		const s = fn({ a: '</script><script>alert(1)</script>' });
		if (s.includes('</script>')) throw new Error('unescaped');
		if (JSON.parse(s).a !== '</script><script>alert(1)</script>') throw new Error('not round-trippable');
		console.log('ok');
	`]).toString();
	assert.equal(out.trim(), 'ok');
});

test('cookies carry Secure: middleware lang cookie and the preview slug cookie', () => {
	const mw = stripComments(read('middleware.ts'));
	assert.match(mw, /secure:\s*process\.env\.NODE_ENV === 'production'/);
	const cookie = require(path.join(ROOT, 'app/business/preview/previewCookie.js'));
	const doc = { cookie: '', location: { protocol: 'https:' } };
	cookie.setPreviewSlugCookie('abc_123', doc);
	assert.match(doc.cookie, /; Secure$/);
	const httpDoc = { cookie: '', location: { protocol: 'http:' } };
	cookie.setPreviewSlugCookie('abc_123', httpDoc);
	assert.doesNotMatch(httpDoc.cookie, /Secure/, 'a Secure cookie written from http is silently dropped by browsers');
	assert.equal(cookie.previewCookieOptions().secure, true);
});

test('security headers: no framework fingerprint, CSP frame-ancestors, Permissions-Policy', () => {
	const cfg = stripComments(read('next.config.js'));
	assert.match(cfg, /poweredByHeader:\s*false/);
	assert.match(cfg, /key:\s*'Content-Security-Policy',\s*value:\s*"frame-ancestors 'self'; object-src 'none'; base-uri 'self'"/);
	assert.match(cfg, /Content-Security-Policy-Report-Only/);
	assert.match(cfg, /Permissions-Policy/);
	assert.match(cfg, /Strict-Transport-Security/);
});

test('employer-authored job data is encoded before it becomes a URL path segment', () => {
	const b = stripComments(read('src/candidate/utils/urlBuilder.ts'));
	assert.match(b, /\/jobs\/\$\{encodeURIComponent\(/);
	const card = stripComments(read('src/candidate/components/dashboard_query_item.tsx'));
	assert.doesNotMatch(card, /split\('\/'\)\[2\]/, 'the old host-as-slug read must stay gone');
	assert.match(card, /encodeURIComponent\(slug\)/);
	const search = stripComments(read('src/candidate/components/search.tsx'));
	assert.match(search, /new URLSearchParams\(/);
});

test('no protocol-relative third-party script URLs', () => {
	for (const f of [...walk('app'), ...walk('src')]) {
		const src = stripComments(read(f));
		assert.ok(!/src\s*=\s*['"]\/\/translate\.google\.com/.test(src), `${f} loads a script over a protocol-relative URL`);
	}
});

test('no unsubstantiated advertising claim survives anywhere in the tree', () => {
	// The first cut of this check named TWO files (en.ts, es.ts). Seventeen
	// violations survived in eleven others — including two FAQPage JSON-LD
	// blocks on live routes, which answer engines quote verbatim. A scan with a
	// hand-maintained file list reports clean about the files it was told to
	// read, which is not the same fact as the one it claims. It is exhaustive
	// now; a new file is covered the day it is written.
	//
	// Every rule here guards a claim we cannot substantiate on request:
	// a compliance certification with no report, a refund the Terms disclaim,
	// a customer count with no source, an efficacy or comparative figure with
	// no study. None of these produce a runtime error — they are pure
	// liability, and the FTC's substantiation standard applies whether or not
	// anyone here remembers the number's origin.
	const RULES = [
		[/SOC ?2\b/i, 'claims SOC 2 — there is no report behind it'],
		[/ISO ?27001/i, 'claims ISO 27001 certification'],
		[/PCI[- ]?DSS/i, 'claims PCI-DSS compliance'],
		[/money[- ]back guarantee/i, 'advertises a refund the Terms disclaim'],
		[/\b30[- ]?day guarantee/i, 'advertises a refund the Terms disclaim'],
		[/Garantía de (devolución|30)/i, 'advertises a refund the Terms disclaim'],
		[/trusted by\s+\d/i, 'unsourced customer count'],
		[/\b\d[\d,]*\+\s*(businesses|customers|users|companies|jobs|hires)\b/i, 'unsourced volume claim'],
		[/\b\d{1,3}\s*%\s*(interview|success|accuracy|retention|match)/i, 'efficacy claim with no study'],
		[/\b\d+x\s+faster\b/i, 'comparative speed claim with no study'],
		[/\b\d{1,3}\s*%\s*more\b[^.]{0,40}\bcompetitor/i, 'comparative claim against competitors'],
		[/AggregateRating/, 'publishes a rating with no linkable source'],
	];

	// A file+rule may sit here only with a reason a human wrote down.
	const EXEMPT = {
		'src/legacy/sections/detailed_pricing_section.tsx::unsourced volume claim':
			'"supporting 50+ businesses" describes WHO the EDC plan is for, not a claim about Moil',
		'src/legacy/sections/FAQ_section.tsx::efficacy claim with no study':
			'"(75-95% match confidence)" describes the score range the UI displays, not an outcome',
	};

	const files = [...walk('app'), ...walk('src')];
	// A clean result and a broken walker look identical from the outside.
	assert.ok(files.length > 100, `walker only reached ${files.length} files — it is broken, not clean`);

	const found = [];
	for (const f of files) {
		const src = stripComments(read(f));
		for (const [re, why] of RULES) {
			if (!re.test(src)) continue;
			if (EXEMPT[`${f}::${why}`]) continue;
			found.push(`${f} — ${why}`);
		}
	}
	assert.deepEqual(found, [], `unsubstantiated claims:\n  ${found.join('\n  ')}`);

	// ...and prove the rules can actually SEE one, or an empty result above is
	// a statement about the regexes rather than about the tree.
	const canary = 'We are SOC 2 compliant, trusted by 500+ businesses, 94% success rate.';
	assert.ok(
		RULES.filter(([re]) => re.test(canary)).length >= 3,
		'the rules no longer detect a violation they are written for',
	);
});
