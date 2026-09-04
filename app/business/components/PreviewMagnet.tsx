'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import {
	buildRegisterUrl,
	submitPreview,
	viewPreview,
	websiteSubmitBody,
} from '../preview/previewClient';
import { clearPreviewSlugCookie, readPreviewSlugCookie, setPreviewSlugCookie } from '../preview/previewCookie';
import { readWebsite } from '../preview/previewInput';
import { canShowReadyCard, progressFromBody, websiteFieldDecision } from '../preview/previewReveal';
import {
	waitBeatsFromBody,
	waitBeatHeadingKey,
	typedText,
	visibleBeatCount,
	beatsSettled,
	TYPEOUT_MS_PER_CHAR,
	TYPEOUT_FLUSH_MS_PER_CHAR,
	READY_HOLD_MAX_MS,
} from '../preview/gettingToKnowYou';
import { nextPollDelayMs, shouldGiveUpWaiting, waitCopyKey } from '../preview/previewWaitCopy';
import { GettingToKnowYou } from './GettingToKnowYou';

type Phase = 'form' | 'wait' | 'ready' | 'failed' | 'down' | 'identity' | 'ceiling';

type ReadyBrand = {
	name?: string;
	colors?: string[];
	tagline?: string;
	description?: string;
	overview?: string;
	logoUrl?: string;
	logo?: string;
	website?: string;
	products?: string[];
	services?: string;
	messaging?: string;
	ctas?: string[];
	slogans?: string[];
	voiceChips?: string[];
	photos?: string[];
	language?: string;
};

type ReadyPost = {
	caption?: string;
	imageUrl?: string;
	creative?: {
		headline?: string;
		subhead?: string;
		image?: string;
	};
};

type ReadyPayload = {
	slug: string;
	brand: ReadyBrand;
	// THE SERVER HAS ALWAYS SENT THIS AND THE CARD NEVER DECLARED IT.
	// `shapeReadyPayload` ships finished posts in `content.posts`;
	// with no key here they were composed, sent, and dropped on the
	// floor — the founder saw what we READ about them and nothing we
	// would MAKE for them.
	content?: { kind?: string; posts?: ReadyPost[] };
	positioning?: {
		audience?: string;
		voice?: string | string[];
		problem?: string;
		uvp?: string;
		keyTerms?: string[];
		cadence?: string;
	};
};

type WaitBeat = { heading: string; text: string };

type MagnetCopy = Record<string, string | undefined>;

function waitBeatHeadingCopy(m: MagnetCopy, heading: string): string {
	const key = waitBeatHeadingKey(heading);
	return (key && m[key]) || '';
}

export function PreviewMagnet() {
	const { t, lang } = useLanguageContext();
	const m = t.business.hero.magnet;
	const magnetCopy = m as unknown as MagnetCopy;

	const [submitting, setSubmitting] = useState(false);
	const [website, setWebsite] = useState('');
	const [phase, setPhase] = useState<Phase>('form');
	const [errorMessage, setErrorMessage] = useState('');
	const [slug, setSlug] = useState('');
	const [ready, setReady] = useState<ReadyPayload | null>(null);
	// The pre-wall platform choice. EMPTY IS THE DEFAULT and it means "decide
	// for me" — `buildRegisterUrl` sends nothing for an empty pick, so a
	// founder who does not touch this is byte-identical to one who never saw
	// it, and the product keeps choosing rather than freezing today's default
	// into their account. Decide For Me is a visible chip on the ready card.
	const [platforms, setPlatforms] = useState<string[]>([]);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [waitProgress, setWaitProgress] = useState('');
	const [waitBeats, setWaitBeats] = useState<WaitBeat[]>([]);
	const [typedChars, setTypedChars] = useState<Record<string, number>>({});
	const [reduceMotion, setReduceMotion] = useState(false);
	// The ready payload, held back while a sentence is still being
	// written. Swapping the card in the instant the GET returns used to
	// cut the type-out off mid-word.
	const [pendingReady, setPendingReady] = useState<{ slug: string; body: ReadyPayload } | null>(null);
	// Headings the founder actually watched. The card leaves these
	// settled and cascades only what sits below them.
	const [watchedHeadings, setWatchedHeadings] = useState<string[]>([]);

	const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
	const startedAt = useRef(0);
	const cancelled = useRef(false);
	const committed = useRef(false);
	// A RESET MUST OUTRANK A POLL ALREADY IN FLIGHT. `stopWaitClock`
	// clears the timer and cannot cancel a `viewPreview` fetch that has
	// already left, and `cancelled` is only ever set on unmount — so a
	// response landing a beat after "try another business" would call
	// onReady, re-write the cookie and put the old card back, after the
	// founder explicitly asked for it to be gone. Every poll carries the
	// run it belongs to; a stale run writes nothing.
	const runId = useRef(0);
	// commitReady reads the typing state through refs on purpose. Taking
	// waitBeats/typedChars as deps would change its identity on every
	// tick, and the backstop effect below clears and re-arms its timeout
	// whenever that happens — so the bound would never fire.
	const waitBeatsRef = useRef<WaitBeat[]>([]);
	const typedCharsRef = useRef<Record<string, number>>({});

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const apply = () => setReduceMotion(mq.matches);
		apply();
		mq.addEventListener('change', apply);
		return () => mq.removeEventListener('change', apply);
	}, []);

	useEffect(() => {
		return () => {
			cancelled.current = true;
			if (pollTimer.current) clearTimeout(pollTimer.current);
			if (tickTimer.current) clearInterval(tickTimer.current);
		};
	}, []);

	const signupHref = useMemo(
		() =>
			buildRegisterUrl({
				lang,
				previewSlug: slug,
				platforms,
				appendLang: appendLangToUrl,
			}),
		[lang, slug, platforms],
	);

	const stopWaitClock = () => {
		if (tickTimer.current) {
			clearInterval(tickTimer.current);
			tickTimer.current = null;
		}
		if (pollTimer.current) {
			clearTimeout(pollTimer.current);
			pollTimer.current = null;
		}
	};

	const startWaitClock = () => {
		startedAt.current = Date.now();
		setElapsedMs(0);
		if (tickTimer.current) clearInterval(tickTimer.current);
		tickTimer.current = setInterval(() => {
			setElapsedMs(Date.now() - startedAt.current);
		}, reduceMotion ? 1000 : 500);
	};

	const refuseNamelessReady = useCallback(() => {
		stopWaitClock();
		clearPreviewSlugCookie();
		setReady(null);
		setSlug('');
		setPhase('failed');
		setErrorMessage(m.failed);
	}, [m.failed]);

	const onReady = useCallback(
		(
			nextSlug: string,
			body: {
				brand?: ReadyBrand;
				content?: ReadyPayload['content'];
				positioning?: ReadyPayload['positioning'];
			},
		) => {
			const brand = (body && body.brand) || {};
			if (!canShowReadyCard(brand)) {
				refuseNamelessReady();
				return;
			}
			stopWaitClock();
			setSlug(nextSlug);
			setPreviewSlugCookie(nextSlug);
			setReady({
				slug: nextSlug,
				brand,
				content: body && body.content,
				positioning: body && body.positioning,
			});
			setPhase('ready');
		},
		[refuseNamelessReady],
	);

	const poll = useCallback(
		async (nextSlug: string, attempt: number, rid: number) => {
			if (cancelled.current || runId.current !== rid) return;
			const result = await viewPreview(nextSlug);
			if (cancelled.current || runId.current !== rid) return;
			if (result.kind === 'ready' && result.body) {
				// Stop polling — the payload is in hand. The swap itself
				// waits on the type-out (see the two effects below), so a
				// founder is never cut off mid-sentence by an answer that
				// has already arrived.
				stopWaitClock();
				setPendingReady({ slug: nextSlug, body: result.body as ReadyPayload });
				return;
			}
			if (result.kind === 'failed') {
				stopWaitClock();
				setPhase('failed');
				setErrorMessage(m.failed);
				return;
			}
			if (result.kind === 'building' || result.kind === 'accepted') {
				const beats = waitBeatsFromBody(result.body);
				if (beats.length) setWaitBeats(beats);
				const msg = progressFromBody(result.body);
				if (msg) setWaitProgress(msg);
			}
			if (result.kind === 'missing' || result.kind === 'down') {
				if (result.kind === 'missing' && attempt > 8) {
					stopWaitClock();
					setPhase('failed');
					setErrorMessage(m.failed);
					return;
				}
			}
			// A WAIT THAT CANNOT END IS A DEAD END WITH AN ANIMATION ON IT.
			// Nothing here ever stopped for `building`, so a row the server
			// had abandoned polled at 1s forever: five sentences typed out,
			// a pulsing bar, and no card behind it — no logo, no colours,
			// nothing to press. The server closes an abandoned build out on
			// its own bound, which is SHORTER than this one, so on a
			// reachable API the founder gets the server's honest `failed`
			// (and a row a re-submission can regenerate); this only fires
			// when the API itself cannot be reached.
			if (shouldGiveUpWaiting(Date.now() - startedAt.current)) {
				stopWaitClock();
				setPhase('failed');
				setErrorMessage(m.failed);
				return;
			}
			// A 429 here is OUR OWN poll against the view limiter. Retrying
			// at the same rate keeps it limited for as long as we ask, so the
			// GET carrying the finished preview would never get through.
			const rateLimited = result.kind === 'ceiling';
			pollTimer.current = setTimeout(() => {
				void poll(nextSlug, attempt + 1, rid);
			}, nextPollDelayMs(attempt, { rateLimited })); // ~1s early, then slower
		},
		[onReady, m.failed],
	);

	useEffect(() => {
		if (phase !== 'wait' || reduceMotion || waitBeats.length === 0) return;
		// ONE line at a time. Advancing every incomplete beat on the same
		// tick grew three lines at once, which reads as a block filling in
		// rather than as something being written.
		const pace = pendingReady ? TYPEOUT_FLUSH_MS_PER_CHAR : TYPEOUT_MS_PER_CHAR;
		const id = window.setInterval(() => {
			setTypedChars((prev) => {
				for (let i = 0; i < waitBeats.length; i++) {
					const beat = waitBeats[i];
					const cur = prev[beat.heading] || 0;
					if (cur < beat.text.length) {
						return { ...prev, [beat.heading]: cur + 1 };
					}
				}
				return prev;
			});
		}, pace);
		return () => window.clearInterval(id);
	}, [phase, reduceMotion, waitBeats, pendingReady]);

	useEffect(() => {
		waitBeatsRef.current = waitBeats;
	}, [waitBeats]);
	useEffect(() => {
		typedCharsRef.current = typedChars;
	}, [typedChars]);

	const commitReady = useCallback(
		(next: { slug: string; body: ReadyPayload }) => {
			if (committed.current) return;
			committed.current = true;
			// Only beats actually painted count as watched — a backstop
			// commit can land before the last one was ever shown, and
			// claiming a founder saw a sentence they did not is how a
			// section ends up silently skipping its reveal.
			const beats = waitBeatsRef.current;
			const shown = visibleBeatCount(beats, typedCharsRef.current, reduceMotion);
			setWatchedHeadings(beats.slice(0, shown).map((beat) => beat.heading));
			onReady(next.slug, next.body);
		},
		[onReady, reduceMotion],
	);

	// Commit the moment nothing is mid-word. typedChars advances every
	// tick, so this re-runs until the sentence lands.
	useEffect(() => {
		if (!pendingReady) return;
		if (beatsSettled(waitBeats, typedChars, reduceMotion)) {
			commitReady(pendingReady);
		}
	}, [pendingReady, waitBeats, typedChars, reduceMotion, commitReady]);

	// Backstop, armed once. A held card is a courtesy, not a queue —
	// nothing may park the answer indefinitely.
	useEffect(() => {
		if (!pendingReady) return;
		const id = window.setTimeout(() => commitReady(pendingReady), READY_HOLD_MAX_MS);
		return () => window.clearTimeout(id);
	}, [pendingReady, commitReady]);

	useEffect(() => {
		const saved = readPreviewSlugCookie();
		if (!saved) return;
		let live = true;
		const rid = ++runId.current;
		void (async () => {
			const result = await viewPreview(saved);
			if (!live || cancelled.current || runId.current !== rid) return;
			if (result.kind === 'ready' && result.body) {
				onReady(saved, result.body);
				return;
			}
			if (result.kind === 'building') {
				setSlug(saved);
				setPhase('wait');
				startWaitClock();
				void poll(saved, 0, rid);
				return;
			}
			if (result.kind === 'failed' || result.kind === 'missing') {
				clearPreviewSlugCookie();
				return;
			}
			// `down` is a server we could not read, NOT a preview that is
			// gone — the slug stays and we resume waiting rather than
			// dropping the founder back on the form. Bounded by the
			// give-up above, so an API that never returns still ends.
			if (result.kind === 'down') {
				setSlug(saved);
				setPhase('wait');
				startWaitClock();
				void poll(saved, 0, rid);
			}
		})();
		return () => {
			live = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const beginWait = (nextSlug: string, status?: string) => {
		const rid = ++runId.current;
		setSlug(nextSlug);
		setPreviewSlugCookie(nextSlug);
		setWaitProgress('');
		setWaitBeats([]);
		setTypedChars({});
		setPendingReady(null);
		setWatchedHeadings([]);
		committed.current = false;
		if (status === 'ready') {
			setPhase('wait');
			startWaitClock();
			void poll(nextSlug, 0, rid);
			return;
		}
		if (status === 'failed') {
			setPhase('failed');
			setErrorMessage(m.failed);
			return;
		}
		setPhase('wait');
		startWaitClock();
		void poll(nextSlug, 0, rid);
	};

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const read = readWebsite(website);
		const decision = websiteFieldDecision(read);
		if (decision.kind === 'refuse_social') {
			setErrorMessage(m.socialLinkRefuse);
			return;
		}
		if (decision.kind === 'refuse_website') {
			setErrorMessage(m.badWebsite);
			return;
		}

		setErrorMessage('');
		setSubmitting(true);
		const result = await submitPreview(websiteSubmitBody({ website: decision.website, locale: lang }));
		setSubmitting(false);
		if (result.ok && result.body && result.body.slug) {
			beginWait(result.body.slug, result.body.status);
			return;
		}
		if (result.kind === 'identity') {
			setPhase('identity');
			setErrorMessage((result.body && result.body.message) || m.identityFail);
			return;
		}
		if (result.kind === 'ceiling') {
			setPhase('ceiling');
			setErrorMessage((result.body && result.body.message) || m.ceiling);
			return;
		}
		setPhase('down');
		setErrorMessage((result.body && result.body.message) || m.down);
	};

	// THE ONLY THING THAT WIPES A PREVIEW, and it is EXPLICIT.
	// Everything else about the magnet is built to RESUME: the cookie
	// survives a reload, a `down` server keeps the slug, and a founder
	// who simply comes back finds their business waiting. So the founder
	// who wants a different one needs an action that genuinely forgets —
	// and without the cookie clear this control was a dead one across a
	// refresh: the form came back, the old business came back with it.
	const reset = () => {
		// Retire the in-flight run FIRST. A poll resolving after this
		// point must not re-set the cookie we are about to clear.
		runId.current += 1;
		stopWaitClock();
		clearPreviewSlugCookie();
		setPhase('form');
		setErrorMessage('');
		setReady(null);
		setSlug('');
		// The field is the thing they are replacing. Leaving the old
		// address in it makes "try another business" a form that
		// re-submits the one they just left.
		setWebsite('');
		setElapsedMs(0);
		setWaitProgress('');
		setWaitBeats([]);
		setTypedChars({});
		setPendingReady(null);
		setWatchedHeadings([]);
		committed.current = false;
		setPlatforms([]);
	};

	const revealCount = visibleBeatCount(waitBeats, typedChars, reduceMotion);
	const waitKey = waitCopyKey(elapsedMs);
	const waitText = waitKey === 'waitLeave' ? m.waitLeave : waitKey === 'waitLonger' ? m.waitLonger : m.waitCalm;
	const showReadyCard = phase === 'ready' && ready && canShowReadyCard(ready.brand);

	const fieldClass =
		'w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]';

	return (
		<div
			id="preview-magnet"
			className="relative z-[2] mx-auto mb-12 w-full max-w-[640px] rounded-2xl border border-[var(--border2)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-md"
		>
			{phase !== 'ready' && phase !== 'wait' && (
				<form onSubmit={onSubmit} className="flex flex-col gap-3">
					<input
						type="text"
						inputMode="url"
						name="website"
						autoComplete="url"
						placeholder={m.websitePlaceholder}
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
						className={fieldClass}
						required
					/>

					{errorMessage && (
						<p role="alert" className="text-[13px] leading-snug text-[var(--orange)]">
							{errorMessage}
						</p>
					)}

					<button
						type="submit"
						disabled={submitting}
						className="inline-flex items-center justify-center rounded-lg bg-[var(--purple)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--purple-light)] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting ? m.submitting : m.submit}
					</button>
				</form>
			)}

			{phase === 'wait' && (
				<div className="flex flex-col gap-3 py-2" aria-live="polite">
					{website.trim() ? (
						<p className="ml-auto w-fit max-w-[90%] rounded-full bg-[var(--border2)] px-3 py-1.5 text-[13px] text-[var(--text)]">
							{website.trim()}
						</p>
					) : null}
					{revealCount > 0 ? (
						<div className="flex flex-col gap-2.5">
							{waitBeats.slice(0, revealCount).map((beat) => {
								const label = waitBeatHeadingCopy(magnetCopy, beat.heading);
								const typed = typedText(
									beat.text,
									reduceMotion ? beat.text.length : typedChars[beat.heading] || 0,
									reduceMotion,
								);
								const typing = !reduceMotion && typed.length < beat.text.length;
								return (
									<div key={beat.heading} className="flex flex-col gap-0.5">
										{label ? (
											<p className="text-[12px] leading-snug text-[var(--text)] opacity-70">{label}</p>
										) : null}
										<p
											className="text-[15px] font-medium text-[var(--text)]"
											aria-hidden={typing}
										>
											{typed}
										</p>
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-[15px] font-medium text-[var(--text)]">{waitProgress || waitText}</p>
					)}
					{!reduceMotion && (
						<div aria-hidden className="h-1 w-full overflow-hidden rounded-full bg-[var(--border2)]">
							<div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--orange)]" />
						</div>
					)}
					<p className="text-[12px] leading-snug text-[var(--text)] opacity-70">{m.waitReturn}</p>
					{/* THE WAIT IS THE SCREEN A STUCK FOUNDER IS LOOKING AT, and
					    until now the only way out of it was on the READY card they
					    could not reach. The line above promises their preview will
					    be here when they come back, which is exactly what makes a
					    dead wait unescapable: the cookie brings them straight back
					    to it. */}
					<button
						type="button"
						onClick={reset}
						className="w-fit text-[12px] text-[var(--text)] opacity-70 underline-offset-2 hover:underline"
					>
						{m.tryAgain}
					</button>
				</div>
			)}

			{showReadyCard && ready && (
				<GettingToKnowYou
					key={ready.slug}
					body={{
						brand: ready.brand,
						content: ready.content,
						positioning: ready.positioning,
					}}
					website={website.trim() || ready.brand.website || ''}
					platforms={platforms}
					onPlatforms={setPlatforms}
					signupHref={signupHref}
					onReset={reset}
					copy={magnetCopy}
					watched={watchedHeadings}
					reduceMotion={reduceMotion}
				/>
			)}
		</div>
	);
}
