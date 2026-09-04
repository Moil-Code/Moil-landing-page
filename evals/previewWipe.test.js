#!/usr/bin/env node
'use strict';

/**
 * "TRY ANOTHER BUSINESS" HAS TO ACTUALLY FORGET THE OLD ONE.
 * node --test evals/previewWipe.test.js
 *
 * Everything else about the magnet is built to RESUME. The `preview_slug`
 * cookie survives a reload for seven days, a server we cannot read keeps
 * the slug rather than dropping the founder on the form, and the wait card
 * promises in as many words that the preview will be here when they come
 * back. That is the right default and it is exactly what makes the escape
 * hatch load-bearing: the ONE founder who wants a different business needs
 * an action that genuinely wipes, or the cookie hands them the old one
 * again on the next page load.
 *
 * Three defects, and the third is the one reading the label never finds:
 *
 *   1. `reset()` cleared every piece of React state and NOT the cookie. So
 *      the control worked until the next refresh and then silently undid
 *      itself — a dead control with a delay on it.
 *   2. It was rendered on the READY card only. The screen a stuck founder
 *      is looking at is the WAIT card, which is precisely the one with no
 *      way out — and the cookie brings them straight back to it.
 *   3. `stopWaitClock()` clears a timer; it cannot cancel a `viewPreview`
 *      fetch already in flight, and `cancelled.current` is only ever set on
 *      unmount. A poll resolving a beat after the reset called `onReady`,
 *      which RE-SETS the cookie and flips back to the ready card — after
 *      the founder explicitly asked for it to be gone.
 *
 * The asymmetry that decides every rule here: a wipe that under-clears
 * leaves a founder stuck with a business they asked to leave and no way
 * to say so twice, while a wipe that over-clears costs them one re-typed
 * URL. So the wipe is total — and it is EXPLICIT-ONLY, because a resume
 * that stops resuming is the far more common founder losing their preview.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const magnet = read('app/business/components/PreviewMagnet.tsx');
const cookie = require('../app/business/preview/previewCookie');

// Bound a claim to the function it is about. A whole-file grep for
// `clearPreviewSlugCookie()` passes on the THREE call sites that already
// existed and says nothing whatever about `reset`.
function fnBlock(src, header) {
	const start = src.indexOf(header);
	if (start < 0) return '';
	// End at the next top-level declaration, never a fixed window — a
	// window bleeds into the following function and reads ITS wiring as
	// this one's.
	const rest = src.slice(start + header.length);
	const end = rest.search(/\n\tconst \w+ = |\n\tuseEffect\(|\n\treturn \(/);
	return end < 0 ? rest : rest.slice(0, end);
}

describe('the wipe is total', () => {
	const reset = fnBlock(magnet, 'const reset = () => {');

	it('the reset slice was FOUND', () => {
		assert.ok(reset.length > 100, 'a renamed reset must fail loudly, not vacuously pass');
	});

	it('clears the cookie, which is the only thing that survives a reload', () => {
		assert.match(
			reset,
			/clearPreviewSlugCookie\(\)/,
			'without this the old business returns on the next page load',
		);
	});

	it('clears the website field it is asking them to replace', () => {
		assert.match(
			reset,
			/setWebsite\(''\)/,
			'leaving the old address makes "try another" re-submit the one they left',
		);
	});

	it('drops the rendered preview and the slug it was keyed on', () => {
		assert.match(reset, /setReady\(null\)/);
		assert.match(reset, /setSlug\(''\)/);
		assert.match(reset, /setPhase\('form'\)/);
	});

	it('stops the clock and discards a held-back ready payload', () => {
		// `pendingReady` is a finished answer parked behind the type-out.
		// Left set, its own backstop timeout commits it seconds later.
		assert.match(reset, /stopWaitClock\(\)/);
		assert.match(reset, /setPendingReady\(null\)/);
	});
});

describe('a reset outranks a poll already in flight', () => {
	const reset = fnBlock(magnet, 'const reset = () => {');
	const pollFn = fnBlock(magnet, 'const poll = useCallback(');

	it('the poll slice was FOUND', () => {
		assert.ok(pollFn.length > 300, 'a renamed poll must fail loudly');
	});

	it('retires the in-flight run BEFORE clearing the cookie', () => {
		const bump = reset.indexOf('runId.current += 1');
		const clear = reset.indexOf('clearPreviewSlugCookie()');
		assert.ok(bump >= 0, 'the reset must mint a new run');
		assert.ok(clear >= 0);
		assert.ok(
			bump < clear,
			'a poll resolving between the two would re-set the cookie we just cleared',
		);
	});

	it('every poll carries the run it belongs to', () => {
		assert.match(
			pollFn,
			/async \(nextSlug: string, attempt: number, rid: number\)/,
			'a poll that cannot name its run cannot be retired',
		);
	});

	it('checks the run AFTER the await, not only before it', () => {
		// Checking only on entry is the same as not checking: the whole
		// window this guards is the one the fetch is open in.
		const awaitIdx = pollFn.indexOf('await viewPreview(');
		assert.ok(awaitIdx > 0);
		const after = pollFn.slice(awaitIdx);
		assert.match(
			after.slice(0, 200),
			/runId\.current !== rid/,
			'a stale run must write nothing once its response lands',
		);
	});

	it('the recursion stays inside its own run', () => {
		assert.match(
			pollFn,
			/void poll\(nextSlug, attempt \+ 1, rid\)/,
			'a re-arm that mints a fresh run would escape the reset it should obey',
		);
	});

	it('every entry point mints a run — none may poll unowned', () => {
		const calls = magnet.match(/void poll\([^)]*\)/g) || [];
		assert.ok(calls.length >= 4, 'poll entry points were FOUND: ' + calls.length);
		for (const call of calls) {
			assert.match(call, /,\s*rid\)/, 'unowned poll call: ' + call);
		}
		// Two independent starters: the resume effect and beginWait. A run
		// minted in one place only means the other cannot be retired.
		const mints = magnet.match(/\+\+runId\.current/g) || [];
		assert.ok(mints.length >= 2, 'both poll starters mint a run, got ' + mints.length);
	});

	it('the resume effect refuses to hydrate for a retired run', () => {
		const resume = magnet.slice(
			magnet.indexOf('const saved = readPreviewSlugCookie();'),
			magnet.indexOf('const beginWait'),
		);
		assert.ok(resume.length > 200, 'resume slice was FOUND');
		assert.match(
			resume,
			/cancelled\.current \|\| runId\.current !== rid/,
			'onReady from a stale resume would resurrect the wiped preview',
		);
	});
});

describe('the founder can reach the wipe from the screen they are stuck on', () => {
	it('the WAIT card carries it, not only the ready card', () => {
		// The reported screenshot IS this card. Before this the only
		// control lived on GettingToKnowYou, which a stuck founder never
		// reaches — and the resume cookie returns them here every time.
		const waitCard = magnet.slice(
			magnet.indexOf('{m.waitReturn}'),
			magnet.indexOf('{showReadyCard && ready &&'),
		);
		assert.ok(waitCard.length > 50, 'wait card slice was FOUND');
		assert.match(waitCard, /onClick=\{reset\}/, 'the wait must offer a way out');
		assert.match(waitCard, /\{m\.tryAgain\}/, 'and say so in the founder\'s language');
	});

	it('the ready card keeps its own', () => {
		const ready = read('app/business/components/GettingToKnowYou.tsx');
		assert.match(ready, /onClick=\{onReset\}/);
		assert.match(ready, /\{m\.tryAgain\}/);
	});

	it('the copy exists in both languages', () => {
		for (const lang of ['en', 'es']) {
			const src = read('src/common/translations/' + lang + '.ts');
			assert.match(src, /tryAgain:/, lang + ' must name the control');
		}
	});
});

describe('resuming is untouched — the wipe is explicit-only', () => {
	it('clearing really clears, and reading really reads', () => {
		// A behavioural check on the module the wipe depends on: a
		// clear that does not clear is the whole defect one layer down.
		const doc = { cookie: '' };
		const jar = [];
		Object.defineProperty(doc, 'cookie', {
			get: () => jar.join('; '),
			set: (v) => {
				const [pair] = v.split(';');
				const [k, val] = pair.split('=');
				const idx = jar.findIndex((e) => e.startsWith(k + '='));
				const expired = /max-age=0/i.test(v);
				if (expired) {
					if (idx >= 0) jar.splice(idx, 1);
					return;
				}
				if (idx >= 0) jar[idx] = k + '=' + val;
				else jar.push(k + '=' + val);
			},
		});
		cookie.setPreviewSlugCookie('abc123', doc);
		assert.equal(cookie.readPreviewSlugCookie(doc), 'abc123');
		cookie.clearPreviewSlugCookie(doc);
		assert.equal(
			cookie.readPreviewSlugCookie(doc),
			'',
			'a cleared slug must not come back on the next read',
		);
	});

	it('nothing but an explicit reset and a settled failure clears the slug', () => {
		// A resume that stops resuming loses a preview for every founder
		// who simply came back — far commoner than the one who wants a
		// different business. So the clear sites stay countable.
		const sites = magnet.match(/clearPreviewSlugCookie\(\)/g) || [];
		assert.ok(sites.length >= 2, 'clear sites were FOUND: ' + sites.length);
		assert.ok(
			sites.length <= 4,
			'a new clear site needs a human: ' + sites.length + ' found',
		);
	});

	it('the submit path re-seeds a slug rather than being wiped by the reset', () => {
		const begin = fnBlock(magnet, 'const beginWait = (nextSlug: string, status?: string) => {');
		assert.ok(begin.length > 100, 'beginWait slice was FOUND');
		assert.match(begin, /setPreviewSlugCookie\(nextSlug\)/,
			'the NEXT business must be remembered exactly as the last one was');
	});
});
