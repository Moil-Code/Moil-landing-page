#!/usr/bin/env node
'use strict';

/**
 * The app lives at ONE origin, resolved in ONE place.
 *   node --test evals/appOrigin.test.js
 *
 * Why this exists (2026-09-06). The nav and footer resolved their register and
 * sign-in links through `getRegisterOrigin()`, which reads
 * NEXT_PUBLIC_REGISTER_ORIGIN and falls back to production — while seven other
 * surfaces hard-coded `https://employer-beta.moilapp.com`, the STAGING app. So
 * one rendered page carried both: "Get Started" in the nav went to production
 * and the in-body CTA went to staging. Measured on the built Spanish guide,
 * which showed four links to one host and three to the other.
 *
 * Two consequences, and the second is the one that decides the rule. Splitting
 * the funnel across two hosts makes `sign_up_start` unreadable. And the landing
 * work has to be PORTED to the production landing repo — at which point every
 * hard-coded literal would send real prospects into a staging environment,
 * silently, because a link that resolves is a link that looks fine.
 *
 * So: a literal app origin is a defect wherever it is not the resolver itself.
 * The resolver is the one place that may name a default, because that default
 * is what an unset environment variable means.
 *
 * The scan is EXHAUSTIVE over app/ and src/ rather than a hand-kept file list —
 * a list covers the instances someone already knows about, which is exactly how
 * five of these survived. An exemption needs a file AND a reason.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

/** The one module allowed to name a default app origin. */
const RESOLVER = 'app/business/preview/previewClient.js';

/**
 * A file may sit here only with a reason a human wrote down.
 * `src/legacy/` is the unmaintained legacy page (robots.txt Disallows /legacy);
 * it has its own `businessBaseUrl` constant and rewriting it is a change to a
 * surface this work does not touch. It is still ONE constant, not a literal
 * per call site, so it cannot produce the two-hosts-on-one-page failure above.
 */
const EXEMPT = {
	'src/common/constants/baseUrl.tsx': 'legacy-only constant; consumed solely by src/legacy/*',
};

// Hosts that serve the signed-in product app, in any environment.
const APP_ORIGIN = /https?:\/\/(?:employer-beta|business|employer)\.moilapp\.com/;

const SCAN_EXT = /\.(ts|tsx|js|jsx|mjs)$/;
const SKIP_DIR = /^(node_modules|\.next|out|dist)$/;

function walk(dir, out = []) {
	for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (!SKIP_DIR.test(entry.name)) walk(path.join(dir, entry.name), out);
		} else if (SCAN_EXT.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
			out.push(path.join(dir, entry.name));
		}
	}
	return out;
}

// Comments are stripped first: the notes above and beside these call sites quote
// the removed literal verbatim, so a raw match reports the explanation as the
// defect — the trap this repo has already recorded twice.
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const FILES = [...walk('app'), ...walk('src')];

describe('the app origin is resolved in one place', () => {
	it('the scan reached a real number of files', () => {
		assert.ok(FILES.length > 150, `only ${FILES.length} files walked — the walker is broken`);
	});

	it('it can SEE a violation (canary)', () => {
		const canary = "const x = 'https://employer-beta.moilapp.com/register';";
		assert.match(stripComments(canary), APP_ORIGIN);
	});

	it('the resolver names a default, and reads the environment variable', () => {
		const src = fs.readFileSync(path.join(root, RESOLVER), 'utf8');
		assert.match(src, /DEFAULT_REGISTER_ORIGIN\s*=\s*'https:\/\/[^']+'/);
		assert.match(src, /NEXT_PUBLIC_REGISTER_ORIGIN/);
	});

	it('no other source hard-codes an app origin', () => {
		const offenders = [];
		for (const file of FILES) {
			if (file === RESOLVER) continue;
			if (EXEMPT[file]) continue;
			const body = stripComments(fs.readFileSync(path.join(root, file), 'utf8'));
			const hit = body.match(APP_ORIGIN);
			if (hit) offenders.push(`${file} → ${hit[0]} (use getRegisterUrl()/buildRegisterUrl())`);
		}
		assert.deepEqual(offenders, [], `hard-coded app origin:\n  ${offenders.join('\n  ')}`);
	});

	it('every exemption still exists and still needs its reason', () => {
		for (const [file, reason] of Object.entries(EXEMPT)) {
			assert.ok(fs.existsSync(path.join(root, file)), `EXEMPT names a missing file: ${file}`);
			assert.ok(reason && reason.length > 20, `EXEMPT ${file} has no real reason`);
			const body = stripComments(fs.readFileSync(path.join(root, file), 'utf8'));
			assert.match(body, APP_ORIGIN, `${file} no longer hard-codes an origin — drop its exemption`);
		}
	});
});
