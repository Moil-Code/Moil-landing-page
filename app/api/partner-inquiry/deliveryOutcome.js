'use strict';

/**
 * What happens to a partner inquiry we could not deliver.
 *
 * ── THE DEFECT ──────────────────────────────────────────────────────
 * QA 2026-09-11: the partner form answered 502 "We could not send your
 * message. Please try again."
 *
 * Three things were wrong with that, and the first is the one that
 * costs real money:
 *
 * 1. THE LEAD WAS GONE. The catch logged `error.message` and nothing
 *    else — not the address, not the subject, not a word the person
 *    wrote. Somebody who wanted to partner with Moil typed their case
 *    out, pressed send, and it existed nowhere afterwards. A failed
 *    send is recoverable; a lost lead is not.
 *
 * 2. "PLEASE TRY AGAIN" CANNOT WORK WHEN THE CAUSE IS OUR CONFIG. A
 *    rejected app password fails identically on every attempt, so that
 *    sentence asks a visitor to do the one thing that is guaranteed not
 *    to help — the class of instruction this product removes wherever
 *    it finds it. A transient SMTP blip genuinely can be retried, and
 *    the two must not read alike.
 *
 * 3. THERE WAS NO WAY ON. Told only to retry, a person who has already
 *    retried has nothing left to do but leave.
 *
 * ── THE LOG IS THE STORE, AND THAT IS STATED RATHER THAN IMPLIED ────
 * This app has no datastore and no queue, so the honest recovery is a
 * STRUCTURED, GREPPABLE record on the error stream. It is a weaker
 * guarantee than a durable outbox and it is written down as one: logs
 * rotate, and a record nobody greps is a record nobody has. What it
 * buys is that the words survive at all, which is the difference
 * between "we lost a partner inquiry" and "we can answer it late".
 *
 * The marker is `[partner-inquiry][UNDELIVERED]`.
 *
 * Pure: no I/O, no clock, no env. The route calls these; nothing here
 * sends anything or decides a status code on its own.
 */

/**
 * The address a visitor may write to directly when we cannot deliver.
 *
 * A LITERAL, deliberately NOT `process.env.EMAIL_TO`. That variable is
 * whatever an operator set — plausibly an internal alias — and echoing
 * it to an anonymous POST would publish an address nobody chose to
 * publish. This one is already a public fallback in this same route.
 */
const PUBLIC_FALLBACK_EMAIL = 'cs@moilapp.com';

/**
 * Nodemailer/SMTP signals that mean OUR configuration is wrong rather
 * than the network being unhappy.
 *
 * 535 is the SMTP code for "authentication credentials invalid"; EAUTH
 * is nodemailer's own name for the same thing. Both are permanent for
 * every visitor until somebody changes a secret.
 */
const CONFIG_ERROR_CODES = new Set(['EAUTH', 'EENVELOPE']);
const CONFIG_RESPONSE_CODES = new Set([535, 534, 530, 501]);

/**
 * Was this failure ours to fix, or worth another try?
 *
 * UNKNOWN COUNTS AS TRANSIENT, and the asymmetry is deliberate: calling
 * a real outage "a configuration problem" tells a visitor to give up on
 * something a retry would have fixed, while calling a config problem
 * transient costs one wasted retry before they see the address to write
 * to — which the copy gives them either way.
 *
 * @param {unknown} error
 * @returns {{ kind: 'config' | 'transient', retryable: boolean }}
 */
function classifyMailFailure(error) {
	const e = /** @type {Record<string, unknown>} */ (error || {});
	const code = typeof e.code === 'string' ? e.code : '';
	const responseCode =
		typeof e.responseCode === 'number' ? e.responseCode : 0;

	if (
		CONFIG_ERROR_CODES.has(code) ||
		CONFIG_RESPONSE_CODES.has(responseCode)
	) {
		return { kind: 'config', retryable: false };
	}
	return { kind: 'transient', retryable: true };
}

/**
 * The record that keeps the lead.
 *
 * It carries the WHOLE message. A truncated record is a lead we can
 * half-answer, which is most of the way to not having it — and this is
 * the only copy that survives.
 *
 * @param {{ destination?: string, email?: string, subject?: string,
 *           message?: string, reason?: string }} lead
 * @returns {string}
 */
function undeliveredRecord(lead) {
	const l = lead || {};
	return (
		'[partner-inquiry][UNDELIVERED] ' +
		JSON.stringify({
			destination: String(l.destination || ''),
			replyTo: String(l.email || ''),
			subject: String(l.subject || ''),
			message: String(l.message || ''),
			reason: String(l.reason || 'unknown'),
		})
	);
}

/**
 * What the visitor reads, and the status that carries it.
 *
 * BOTH SENTENCES NAME AN ACTION THAT CAN ACTUALLY BE TAKEN. The config
 * one never says "try again", because trying again is precisely what
 * cannot work; it says the problem is ours and gives the address. The
 * transient one keeps the retry AND adds the address, so a second
 * failure is not a dead end.
 *
 * The status follows the same split: 503 for a door that is shut on our
 * side (and matches the unconfigured branch this route already has),
 * 502 for an upstream that misbehaved this time.
 *
 * @param {'config' | 'transient'} kind
 * @returns {{ error: string, status: number }}
 */
function failureResponse(kind) {
	if (kind === 'config') {
		return {
			error:
				'We could not deliver your message — that is a problem on our ' +
				`side, not yours. Please email us directly at ${PUBLIC_FALLBACK_EMAIL} ` +
				'and we will pick it up from there.',
			status: 503,
		};
	}
	return {
		error:
			'We could not send your message just now. Please try again in a ' +
			`moment — or email us directly at ${PUBLIC_FALLBACK_EMAIL}.`,
		status: 502,
	};
}

module.exports = {
	PUBLIC_FALLBACK_EMAIL,
	classifyMailFailure,
	undeliveredRecord,
	failureResponse,
};
