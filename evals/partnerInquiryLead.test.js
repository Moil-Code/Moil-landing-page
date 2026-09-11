#!/usr/bin/env node
'use strict';

/**
 * A PARTNER INQUIRY WE COULD NOT SEND IS NOT A PARTNER INQUIRY WE MAY
 * LOSE.
 *   node --test evals/partnerInquiryLead.test.js
 *
 * QA 2026-09-11: the form answered 502 "We could not send your message.
 * Please try again." Three defects behind one sentence — the lead was
 * gone (the catch logged `error.message` and nothing else), the
 * instruction could not work when the cause was our own credentials,
 * and there was no way on.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const {
	PUBLIC_FALLBACK_EMAIL,
	classifyMailFailure,
	undeliveredRecord,
	failureResponse,
} = require('../app/api/partner-inquiry/deliveryOutcome');

const ROUTE = fs.readFileSync(
	path.join(__dirname, '../app/api/partner-inquiry/route.ts'),
	'utf8',
);
const stripComments = (s) =>
	s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '');

test('our configuration and their network are told apart', async (t) => {
	await t.test('a rejected credential is OURS', () => {
		for (const e of [
			{ code: 'EAUTH' },
			{ responseCode: 535 },
			{ code: 'EAUTH', responseCode: 535 },
		]) {
			assert.equal(classifyMailFailure(e).kind, 'config');
			assert.equal(classifyMailFailure(e).retryable, false);
		}
	});

	await t.test('a timeout or a reset is worth another try', () => {
		for (const e of [
			{ code: 'ETIMEDOUT' },
			{ code: 'ECONNRESET' },
			{ responseCode: 421 },
		]) {
			assert.equal(classifyMailFailure(e).kind, 'transient');
		}
	});

	await t.test('UNKNOWN counts as transient, never as ours', () => {
		// The asymmetry is deliberate. Calling a real outage "a
		// configuration problem" tells a visitor to give up on something a
		// retry would have fixed; the other way costs one wasted retry,
		// and the copy hands them the address either way.
		for (const e of [null, undefined, {}, new Error('boom'), 'nope']) {
			assert.equal(classifyMailFailure(e).kind, 'transient');
		}
	});
});

test('the copy never asks for the one thing that cannot work', async (t) => {
	await t.test('a config failure does not say "try again"', () => {
		const { error, status } = failureResponse('config');
		assert.equal(status, 503);
		assert.ok(
			!/try again/i.test(error),
			'a rejected credential fails identically every time — asking for a ' +
				'retry is an instruction that cannot work',
		);
		assert.ok(error.includes(PUBLIC_FALLBACK_EMAIL));
	});

	await t.test('a transient failure keeps the retry AND adds a way on', () => {
		const { error, status } = failureResponse('transient');
		assert.equal(status, 502);
		assert.match(error, /try again/i);
		assert.ok(
			error.includes(PUBLIC_FALLBACK_EMAIL),
			'a second failure must not be a dead end',
		);
	});

	await t.test('the address is a literal, never whatever EMAIL_TO holds', () => {
		// EMAIL_TO is whatever an operator set — plausibly an internal
		// alias — and echoing it to an anonymous POST publishes an address
		// nobody chose to publish.
		const src = fs.readFileSync(
			path.join(__dirname, '../app/api/partner-inquiry/deliveryOutcome.js'),
			'utf8',
		);
		assert.ok(!/process\.env/.test(stripComments(src)));
		assert.match(PUBLIC_FALLBACK_EMAIL, /^[^\s@]+@moilapp\.com$/);
	});
});

test('the lead survives a failure', async (t) => {
	const lead = {
		destination: 'partners',
		email: 'ana@velabakehouse.com',
		subject: 'Partnering on Texas SMB outreach',
		message: 'We run a chamber of 400 businesses and would like to talk.',
	};

	await t.test('every word is in the record', () => {
		const line = undeliveredRecord({ ...lead, reason: 'config' });
		assert.match(line, /^\[partner-inquiry\]\[UNDELIVERED\] /);
		const body = JSON.parse(line.replace(/^[^{]*/, ''));
		assert.equal(body.replyTo, lead.email);
		assert.equal(body.subject, lead.subject);
		// THE WHOLE MESSAGE. A truncated record is a lead we can only
		// half-answer, which is most of the way to not having it — and
		// this is the only copy that survives.
		assert.equal(body.message, lead.message);
		assert.equal(body.reason, 'config');
	});

	await t.test('it is one greppable line, so a log can be searched', () => {
		const line = undeliveredRecord({
			...lead,
			message: 'first line\nsecond line',
		});
		assert.equal(line.split('\n').length, 1);
	});

	await t.test('a missing field is empty, never the string "undefined"', () => {
		const body = JSON.parse(undeliveredRecord({}).replace(/^[^{]*/, ''));
		for (const v of Object.values(body)) {
			assert.notEqual(v, 'undefined');
		}
		assert.equal(body.reason, 'unknown');
	});
});

test('the route actually keeps it — both failure branches', async (t) => {
	const code = stripComments(ROUTE);

	await t.test('the send catch records the lead before it answers', () => {
		const i = code.indexOf('} catch (error) {');
		assert.ok(i > -1);
		const block = code.slice(i, code.indexOf('\n}', i));
		const rec = block.indexOf('undeliveredRecord(');
		assert.ok(rec > -1, 'the lead is recorded');
		// NO RETURN MAY PRECEDE IT. "Before the response" was the first
		// phrasing and it could not discriminate: an injection moving the
		// record one line up from the return still satisfied it, because
		// both still sit in the same straight-line tail. What actually
		// loses a lead is a path that LEAVES first — an early return, a
		// guard, a branch added later that answers before recording.
		const firstReturn = block.indexOf('return ');
		assert.ok(
			firstReturn === -1 || rec < firstReturn,
			'no failure path may return before the lead is recorded',
		);
		assert.match(block, /classifyMailFailure\(error\)/);
		assert.match(block, /failureResponse\(kind\)/);
	});

	await t.test('the UNCONFIGURED branch keeps it too', () => {
		// The likelier of the two: a host missing EMAIL_TO drops every
		// inquiry it ever receives, silently, until somebody sets it.
		const i = code.indexOf('if (!sender || !password || !recipient)');
		assert.ok(i > -1);
		const block = code.slice(i, code.indexOf('\n  }', i));
		assert.match(block, /undeliveredRecord\(/);
		assert.match(block, /not_configured/);
		assert.match(block, /failureResponse\('config'\)/);
	});

	await t.test('no failure path still carries the old dead-end sentence', () => {
		assert.ok(
			!/We could not send your message\. Please try again\.'/.test(code),
			'the literal the founder was shown, restored verbatim',
		);
		assert.ok(!/Messaging is temporarily unavailable/.test(code));
	});

	await t.test('a SUCCESSFUL send records nothing', () => {
		// An undelivered marker on a delivered lead would make the one
		// thing this log exists for unsearchable.
		const ok = code.indexOf('return NextResponse.json({ ok: true });');
		assert.ok(ok > -1);
		const before = code.slice(code.indexOf('await transporter.sendMail'), ok);
		assert.ok(!before.includes('undeliveredRecord('));
	});
});
