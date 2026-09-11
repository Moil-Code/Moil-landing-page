#!/usr/bin/env node
'use strict';

/**
 * THE WAIT CARD MUST BE ABLE TO END.
 * node --test evals/previewWaitTermination.test.js
 *
 * Reported: five wait sentences typed out, a pulsing bar, "come back
 * any time", and nothing behind it — no logo, no colours, no CTA. That
 * IS the wait phase, and the ready card is the only surface carrying
 * the brand, so a poll that can never stop renders exactly that.
 *
 * `poll` handled `ready`, `failed`, and `missing` past attempt 8. Every
 * other outcome — `building`, `accepted`, `down`, and `ceiling` — fell
 * through to an unconditional re-arm at a flat 1s, forever.
 *
 * Two of those are worse than merely endless:
 *
 *   • the view limiter is 60/min per IP, so a flat 1s poll sits exactly
 *     on it. A second tab, an office NAT or carrier CGNAT pushes a real
 *     founder over and every GET after that is a 429 — including the one
 *     carrying their finished preview. Retrying a 429 at the same rate
 *     is what makes that permanent.
 *   • `classifyHttp` tested `json.slug` BEFORE `json.status === 'ready'`,
 *     so the day a ready GET carries a slug (POST already answers with
 *     one) every finished preview classifies as `accepted` — the arm
 *     that keeps polling. The bug one field away from itself.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const wait = require('../app/business/preview/previewWaitCopy');
const client = require('../app/business/preview/previewClient');

describe('the poll cadence cannot rate-limit the founder out of their own answer', () => {
	it('stays ~1s across the window a healthy generation lives in', () => {
		for (const n of [0, 1, 2, 3, 9, 20, 29]) {
			assert.equal(
				wait.nextPollDelayMs(n),
				1000,
				'attempt ' + n + ' must still catch the sub-second ready dump',
			);
		}
	});

	it('steps down past the fast window rather than sitting on the 60/min cap', () => {
		assert.ok(wait.WAIT_FAST_ATTEMPTS >= 20, 'fast window covers a real generation');
		assert.ok(
			wait.nextPollDelayMs(wait.WAIT_FAST_ATTEMPTS) > 1000,
			'a long wait must not keep asking 60 times a minute',
		);
		// 60/min is the server's view limiter. Anything at or above one
		// request a second leaves no headroom for a second tab.
		assert.ok(wait.WAIT_SLOW_POLL_MS >= 2000);
	});

	it('BACKS OFF on a 429 instead of holding itself rate-limited', () => {
		const limited = wait.nextPollDelayMs(0, { rateLimited: true });
		assert.ok(
			limited > wait.nextPollDelayMs(0),
			'retrying a 429 at the same rate is how a finished preview never gets collected',
		);
	});

	it('gives up eventually, and LATER than the server closes a build out', () => {
		assert.equal(wait.shouldGiveUpWaiting(0), false);
		assert.equal(wait.shouldGiveUpWaiting(wait.WAIT_GIVE_UP_MS - 1), false);
		assert.equal(wait.shouldGiveUpWaiting(wait.WAIT_GIVE_UP_MS), true);
		// The server's PREVIEW_BUILD_TIMEOUT_MS default is 5 min. The client
		// bound sits above it ON PURPOSE: on a reachable API the founder
		// learns `failed` from the SERVER, on a row a re-submission can
		// regenerate. This one only fires when the API cannot be reached.
		assert.ok(
			wait.WAIT_GIVE_UP_MS > 5 * 60 * 1000,
			'a client-invented failure must not pre-empt the server’s honest one',
		);
		assert.equal(wait.shouldGiveUpWaiting('nonsense'), false, 'unreadable is not expired');
	});
});

describe('a ready body is READY', () => {
	it('classifies as ready even when it also carries a slug', () => {
		const r = client.previewViewUrl && require('../app/business/preview/previewClient');
		assert.ok(r);
		const src = read('app/business/preview/previewClient.js');
		const readyIdx = src.indexOf("json.status === 'ready'");
		const slugIdx = src.indexOf('json && json.slug');
		assert.ok(readyIdx > 0 && slugIdx > readyIdx,
			'the slug test must not shadow ready — `accepted` is the arm that keeps polling');
	});

	it('submit still reads slug/status off the body, so the reorder cannot break it', () => {
		const magnet = read('app/business/components/PreviewMagnet.tsx');
		assert.match(magnet, /result\.body\.slug/);
		assert.match(magnet, /beginWait\(result\.body\.slug, result\.body\.status\)/);
	});
});

describe('the magnet honours both bounds', () => {
	const magnet = read('app/business/components/PreviewMagnet.tsx');
	const pollFn = magnet.slice(
		magnet.indexOf('const poll ='),
		magnet.indexOf('const beginWait'),
	);

	it('the poll slice was FOUND', () => {
		assert.ok(pollFn.length > 400);
	});

	it('stops on the give-up bound before re-arming', () => {
		const giveUpIdx = pollFn.indexOf('shouldGiveUpWaiting(');
		const rearmIdx = pollFn.indexOf('pollTimer.current = setTimeout');
		assert.ok(giveUpIdx > 0, 'the wait must be able to end');
		assert.ok(giveUpIdx < rearmIdx, 'checked BEFORE scheduling the next poll');
		assert.match(pollFn.slice(giveUpIdx, rearmIdx), /setPhase\('failed'\)/);
	});

	it('tells the delay it was rate-limited', () => {
		assert.match(pollFn, /result\.kind === 'ceiling'/);
		assert.match(pollFn, /nextPollDelayMs\(attempt,\s*\{\s*rateLimited\s*\}\)/);
	});

	it('a `down` resume keeps the slug and waits rather than dropping to the form', () => {
		const resume = magnet.slice(
			magnet.indexOf('const saved = readPreviewSlugCookie();'),
			magnet.indexOf('const beginWait'),
		);
		assert.ok(resume.length > 200, 'resume slice was FOUND');
		const clearIdx = resume.indexOf('clearPreviewSlugCookie()');
		const downIdx = resume.indexOf("result.kind === 'down'");
		assert.ok(downIdx > clearIdx,
			'`down` is a server we could not read, not a preview that is gone');
		assert.doesNotMatch(
			resume.slice(clearIdx, downIdx),
			/'down'/,
			'a transient outage must never clear the saved slug',
		);
	});
});
