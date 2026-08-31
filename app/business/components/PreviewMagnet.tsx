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
import { waitStepsFromBody } from '../preview/gettingToKnowYou';
import { nextPollDelayMs, waitCopyKey } from '../preview/previewWaitCopy';
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

type ReadyPayload = {
	slug: string;
	brand: ReadyBrand;
	positioning?: {
		audience?: string;
		voice?: string | string[];
		problem?: string;
		keyTerms?: string[];
		cadence?: string;
	};
};

type MagnetCopy = Record<string, string | undefined>;

function waitStepCopy(m: MagnetCopy, id: string): string {
	if (id === 'scrape_started') return m.waitStepScrapeStarted || '';
	if (id === 'pages_read') return m.waitStepPagesRead || '';
	if (id === 'tokens_ready') return m.waitStepTokensReady || '';
	return '';
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
	const [waitSteps, setWaitSteps] = useState<string[]>([]);
	const [reduceMotion, setReduceMotion] = useState(false);

	const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
	const startedAt = useRef(0);
	const cancelled = useRef(false);

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
		(nextSlug: string, body: { brand?: ReadyBrand; positioning?: ReadyPayload['positioning'] }) => {
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
				positioning: body && body.positioning,
			});
			setPhase('ready');
		},
		[refuseNamelessReady],
	);

	const poll = useCallback(
		async (nextSlug: string, attempt: number) => {
			if (cancelled.current) return;
			const result = await viewPreview(nextSlug);
			if (cancelled.current) return;
			if (result.kind === 'ready' && result.body) {
				onReady(nextSlug, result.body);
				return;
			}
			if (result.kind === 'failed') {
				stopWaitClock();
				setPhase('failed');
				setErrorMessage(m.failed);
				return;
			}
			if (result.kind === 'building' || result.kind === 'accepted') {
				const steps = waitStepsFromBody(result.body);
				if (steps.length) setWaitSteps(steps);
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
			pollTimer.current = setTimeout(() => {
				void poll(nextSlug, attempt + 1);
			}, nextPollDelayMs(attempt));
		},
		[onReady, m.failed],
	);

	useEffect(() => {
		const saved = readPreviewSlugCookie();
		if (!saved) return;
		let live = true;
		void (async () => {
			const result = await viewPreview(saved);
			if (!live || cancelled.current) return;
			if (result.kind === 'ready' && result.body) {
				onReady(saved, result.body);
				return;
			}
			if (result.kind === 'building') {
				setSlug(saved);
				setPhase('wait');
				startWaitClock();
				void poll(saved, 0);
				return;
			}
			if (result.kind === 'failed' || result.kind === 'missing') {
				clearPreviewSlugCookie();
			}
		})();
		return () => {
			live = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const beginWait = (nextSlug: string, status?: string) => {
		setSlug(nextSlug);
		setPreviewSlugCookie(nextSlug);
		setWaitProgress('');
		setWaitSteps([]);
		if (status === 'ready') {
			setPhase('wait');
			startWaitClock();
			void poll(nextSlug, 0);
			return;
		}
		if (status === 'failed') {
			setPhase('failed');
			setErrorMessage(m.failed);
			return;
		}
		setPhase('wait');
		startWaitClock();
		void poll(nextSlug, 0);
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

	const reset = () => {
		stopWaitClock();
		setPhase('form');
		setErrorMessage('');
		setReady(null);
		setSlug('');
		setElapsedMs(0);
		setWaitProgress('');
		setWaitSteps([]);
		setPlatforms([]);
	};

	const waitKey = waitCopyKey(elapsedMs);
	const waitText = waitKey === 'waitLeave' ? m.waitLeave : waitKey === 'waitLonger' ? m.waitLonger : m.waitCalm;
	const showReadyCard = phase === 'ready' && ready && canShowReadyCard(ready.brand);
	const boundStepLines = waitSteps.map((id) => waitStepCopy(magnetCopy, id)).filter(Boolean);

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
					{boundStepLines.length > 0 ? (
						<div className="flex flex-col gap-1.5">
							{boundStepLines.map((line) => (
								<p key={line} className="text-[15px] font-medium text-[var(--text)]">
									{line}
								</p>
							))}
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
				</div>
			)}

			{showReadyCard && ready && (
				<GettingToKnowYou
					key={ready.slug}
					body={{ brand: ready.brand, positioning: ready.positioning }}
					website={website.trim() || ready.brand.website || ''}
					platforms={platforms}
					onPlatforms={setPlatforms}
					signupHref={signupHref}
					onReset={reset}
					copy={magnetCopy}
				/>
			)}
		</div>
	);
}
