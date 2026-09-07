#!/usr/bin/env node
'use strict';

/**
 * THE MAGNET REPORTS ITS OWN FUNNEL, AND CARRIES NOTHING ABOUT THE BUSINESS.
 * node --test evals/previewFunnelEmit.test.js
 *
 * The magnet emitted nothing at all: no view, no submit, no ready-seen, no
 * CTA click, no reset. So every conversion claim about this funnel was a
 * guess and the leaking step could not be named. These are the rules that
 * make the fix trustworthy rather than merely present.
 *
 *   • NO PII ON THE WIRE. The server refuses an unlisted prop, so a second
 *     allow-list here cannot make the TABLE safer — what it makes safer is
 *     the WIRE: a website, a business name or a founder's own words never
 *     leave the browser. An object or an array under an allowed key is
 *     refused for exactly that reason, because the allow-list checks key
 *     NAMES and a nested payload would sail past it.
 *   • THE VOCABULARY IS PINNED, AND CROSS-CHECKED WHEN BOTH REPOS ARE
 *     PRESENT. A name on one side only is silently dropped by the other,
 *     and the step it measures then reads zero — indistinguishable from
 *     nobody taking it. CI has no sibling, so the pin is what runs there
 *     and the cross-check SKIPS LOUDLY rather than announcing itself `ok`.
 *   • ABSENT IS NOT ZERO. `msSinceSubmit: 0` for a founder who resumed
 *     from the cookie rather than submitting would put a fabricated wait
 *     into the one number this measures.
 *   • A VIEW IS NOT A RENDER. Without the once-guard every state change in
 *     the form phase emits a view, and the denominator of every rate below
 *     it becomes the re-render count.
 *   • IT MAY NEVER COST A VISITOR THE PAGE, and `cta_signup` must survive
 *     the navigation it reports — `keepalive`, never an awaited fetch in
 *     front of the button a founder just pressed.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const funnel = require('../app/business/preview/funnelEvents');

/** Comments stripped, so an explanation cannot satisfy a check about code. */
function stripComments(src) {
	return src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

/** The enclosing block, ending at the next top-level-ish declaration. */
function fnBlock(src, header) {
	const at = src.indexOf(header);
	if (at < 0) return '';
	const rest = src.slice(at + header.length);
	const next = rest.search(
		/\n\t(?:const |function |useEffect\(|return \()/,
	);
	return next < 0 ? rest : rest.slice(0, next);
}

describe('the vocabulary is a closed, PII-free set', () => {
	it('names every landing step from first view to the CTA', () => {
		for (const n of [
			'magnet_view',
			'magnet_submit',
			'magnet_reset',
			'ready_seen',
			'ready_edit',
			'cta_signup',
		]) {
			assert.ok(
				funnel.LANDING_EVENTS.includes(n),
				`missing landing event ${n}`,
			);
			assert.ok(funnel.EVENTS[n], `missing props for ${n}`);
		}
	});

	it('refuses to emit a BACKEND event, whose facts we do not hold', () => {
		for (const n of [
			'preview_ready',
			'claimed',
			'week_approved',
			'kit_week_ready',
		]) {
			assert.ok(
				!funnel.LANDING_EVENTS.includes(n),
				`${n} is the server's to report`,
			);
			assert.equal(funnel.buildEvent(n, {}), null);
		}
	});

	it('declares no prop that could carry the business or the visitor', () => {
		const PII =
			/(website|url|domain|email|phone|handle|address|businessname|business_name|company|owner|founder|ip$|useragent)/i;
		for (const [name, props] of Object.entries(funnel.EVENTS)) {
			for (const k of props) {
				assert.ok(
					!PII.test(k),
					`${name}.${k} could carry a subject`,
				);
			}
		}
	});
});

describe('buildEvent refuses rather than coerces', () => {
	it('drops a prop the catalog does not declare', () => {
		const out = funnel.buildEvent('ready_seen', {
			postsShown: 3,
			website: 'anabakery.com',
		});
		assert.equal(out.props.postsShown, 3);
		assert.ok(!('website' in out.props));
	});

	it('refuses an OBJECT or an ARRAY under an ALLOWED key', () => {
		// This is the one that matters: the allow-list checks key names, so
		// a nested payload under `door` would carry everything the list is
		// meant to keep off the wire.
		for (const bad of [
			{ website: 'x.com' },
			['a', 'b'],
			() => {},
		]) {
			const out = funnel.buildEvent('ready_seen', { door: bad });
			assert.ok(!('door' in out.props), String(bad));
		}
	});

	it('bounds a string so a prop cannot become pasted founder text', () => {
		const out = funnel.buildEvent('ready_seen', {
			door: 'x'.repeat(400),
		});
		assert.equal(out.props.door.length, funnel.MAX_STR);
	});

	it('omits a prop we were not given, and keeps a real zero', () => {
		const absent = funnel.buildEvent('ready_seen', {
			postsShown: undefined,
			door: 'website',
		});
		assert.ok(!('postsShown' in absent.props));

		const zero = funnel.buildEvent('ready_seen', { postsShown: 0 });
		assert.equal(zero.props.postsShown, 0);

		const nan = funnel.buildEvent('ready_seen', { msSinceSubmit: NaN });
		assert.ok(!('msSinceSubmit' in nan.props));
	});

	it('refuses an unknown name and never throws on junk', () => {
		assert.equal(funnel.buildEvent('magnet_teleport', {}), null);
		for (const junk of [null, undefined, 42, [], {}]) {
			assert.equal(funnel.buildEvent(junk, {}), null);
		}
	});
});

describe('the sender is a measurement, not a tracker', () => {
	const src = stripComments(
		read('app/business/preview/funnelEvents.js'),
	);

	it('sets no cookie, reads no device id, contacts no third party', () => {
		for (const forbidden of [
			'document.cookie',
			'localStorage',
			'sessionStorage',
			'navigator.userAgent',
			'https://',
		]) {
			assert.ok(
				!src.includes(forbidden),
				`funnelEvents must not use ${forbidden}`,
			);
		}
	});

	it('posts SAME-ORIGIN, so there is no preflight and no third party', () => {
		assert.equal(funnel.EVENTS_URL, '/plan/preview/events');
		assert.ok(funnel.EVENTS_URL.startsWith('/'));
	});

	it('sends with keepalive — cta_signup fires as the page unloads', () => {
		assert.match(src, /keepalive:\s*true/);
	});

	it('never hands the caller something to await', () => {
		const calls = [];
		const fake = (url, init) => {
			calls.push({ url, init });
			return Promise.reject(new Error('network down'));
		};
		// A rejected send must be swallowed here, not at the call site:
		// every emitter is written as a bare statement.
		assert.equal(
			funnel.emitFunnelEvent(
				'magnet_view',
				{ door: 'website' },
				'',
				fake,
			),
			undefined,
		);
		assert.equal(calls.length, 1);
		assert.equal(calls[0].url, '/plan/preview/events');
		const body = JSON.parse(calls[0].init.body);
		assert.equal(body.event, 'magnet_view');
		assert.equal(body.props.door, 'website');
		assert.ok(!('slug' in body), 'an empty slug is omitted');
	});

	it('sends nothing at all for an event that is not ours', () => {
		const calls = [];
		funnel.emitFunnelEvent('week_approved', {}, '', (u, i) =>
			calls.push([u, i]),
		);
		assert.equal(calls.length, 0);
	});
});

describe('every landing emitter is wired at its own site', () => {
	const magnet = stripComments(
		read('app/business/components/PreviewMagnet.tsx'),
	);
	const card = stripComments(
		read('app/business/components/GettingToKnowYou.tsx'),
	);

	it('the magnet emits a VIEW once, guarded — a view is not a render', () => {
		assert.match(magnet, /emitFunnelEvent\('magnet_view'/);
		assert.match(magnet, /viewSent\.current/);
	});

	it('the magnet emits a SUBMIT, and starts the clock ready_seen reports', () => {
		const block = fnBlock(magnet, 'const onSubmit');
		assert.ok(block, 'onSubmit not found');
		assert.match(block, /emitFunnelEvent\('magnet_submit'/);
		assert.match(block, /submittedAt\.current = Date\.now\(\)/);
	});

	it('the READY card being rendered is its own event, with the slug', () => {
		const block = fnBlock(magnet, 'const onReady');
		assert.ok(block, 'onReady not found');
		assert.match(block, /emitFunnelEvent\(\s*'ready_seen'/);
		assert.match(block, /nextSlug/);
	});

	it('ready_seen OMITS the wait for a founder who resumed from the cookie', () => {
		const block = fnBlock(magnet, 'const onReady');
		// SCOPED TO THE `msSinceSubmit` EXPRESSION ITSELF. A block-wide
		// `/: undefined/` is satisfied by the SIBLING prop two lines down,
		// so it stays green while this one is changed to report 0 — which
		// is exactly the fabricated wait the check exists to refuse. (Found
		// by red-verification: that first cut passed the injection.)
		const from = block.indexOf('msSinceSubmit:');
		const to = block.indexOf('postsShown:');
		assert.ok(
			from > -1 && to > from,
			'the msSinceSubmit expression was not found',
		);
		const expr = block.slice(from, to);
		assert.match(
			expr,
			/:\s*undefined/,
			'the else-branch must OMIT the wait',
		);
		assert.ok(
			!/:\s*-?\d/.test(expr.replace('msSinceSubmit:', '')),
			'a wait we did not measure must never be reported as a number',
		);
	});

	it('the RESET reports the phase it was pressed FROM', () => {
		const block = fnBlock(magnet, 'const reset');
		assert.ok(block, 'reset not found');
		assert.match(block, /emitFunnelEvent\('magnet_reset', \{ phase \}\)/);
		// Read before the reset, or every reset reports `form` and the
		// event says nothing at all.
		const emitAt = block.indexOf("emitFunnelEvent('magnet_reset'");
		const setAt = block.indexOf("setPhase('form')");
		assert.ok(
			emitAt > -1 && setAt > -1 && emitAt < setAt,
			'the phase must be read before it is reset',
		);
	});

	it('the CTA is reported, and carries a COUNT rather than the picks', () => {
		assert.match(card, /emitFunnelEvent\('cta_signup'/);
		assert.match(card, /platformsPicked: platforms\.length/);
	});

	it('an EDIT reports the section id, never what the founder typed', () => {
		const block = fnBlock(card, 'const commitEdit');
		assert.ok(block, 'commitEdit not found');
		assert.match(block, /emitFunnelEvent\('ready_edit', \{ section: id \}\)/);
		assert.ok(
			!/editText/.test(
				block.slice(block.indexOf('emitFunnelEvent')),
			),
			'the founder text must not reach the emitter',
		);
	});
});

describe('the pin is still the backend catalog', () => {
	// CI has neither sibling, so the pin above is what runs there. This
	// cross-check only ever runs for somebody holding both repos — which
	// is exactly who forgets to refresh a pin.
	const candidates = [
		process.env.MOIL_BE_REPO &&
			path.join(
				process.env.MOIL_BE_REPO,
				'supabase/functions/_shared/preview-funnel-events.json',
			),
		path.join(
			root,
			'../Business-plan-Staging/supabase/functions/_shared/preview-funnel-events.json',
		),
	].filter(Boolean);
	const bePath = candidates.find((p) => fs.existsSync(p));

	it('matches the shared vocabulary in both directions', () => {
		if (!bePath) {
			// A SKIP ANNOUNCED AS `ok` IS WORSE THAN A SILENT ONE — it claims
			// coverage for not looking.
			console.log(
				`  skip  the pin was NOT compared — no backend catalog at ${candidates.join(
					' or ',
				)}. This is not a pass; it is the absence of one.`,
			);
			return;
		}
		const be = JSON.parse(fs.readFileSync(bePath, 'utf8'));
		const beNames = Object.keys(be.events).sort();
		const feNames = Object.keys(funnel.EVENTS).sort();
		assert.deepEqual(
			feNames,
			beNames,
			'event names drifted — refresh EVENTS in funnelEvents.js',
		);
		for (const n of beNames) {
			assert.deepEqual(
				[...funnel.EVENTS[n]].sort(),
				[...(be.events[n].props || [])].sort(),
				`props for ${n} drifted — refresh EVENTS in funnelEvents.js`,
			);
		}
		// The split is the server's, not ours: emit what the catalog says
		// the landing emits, and nothing else.
		const beLanding = beNames.filter(
			(n) => be.events[n].emitter === 'landing',
		);
		assert.deepEqual(
			[...funnel.LANDING_EVENTS].sort(),
			beLanding.sort(),
			'LANDING_EVENTS drifted from the catalog emitter field',
		);
	});
});
