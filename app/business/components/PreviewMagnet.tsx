'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import {
	buildRegisterUrl,
	getPlanApiOrigin,
	isPlanApiConfigured,
	submitPreview,
	viewPreview,
	websiteSubmitBody,
} from '../preview/previewClient';
import { clearPreviewSlugCookie, readPreviewSlugCookie, setPreviewSlugCookie } from '../preview/previewCookie';
import { readWebsite } from '../preview/previewInput';
import {
	canShowReadyCard,
	readyBrandName,
	sanitizeTagline,
	websiteFieldDecision,
} from '../preview/previewReveal';
import { nextPollDelayMs, waitCopyKey } from '../preview/previewWaitCopy';

type Phase = 'form' | 'wait' | 'ready' | 'failed' | 'down' | 'identity' | 'ceiling';

type ReadyPayload = {
	slug: string;
	brand: {
		name?: string;
		colors?: string[];
		tagline?: string;
		logoUrl?: string;
		category?: string;
		address?: string;
		website?: string;
		handle?: string;
		handlePlatform?: string;
		products?: string[];
		sources?: string[];
	};
	content: {
		kind?: 'posts' | 'brand-only';
		posts?: { caption?: string; theme?: string }[];
	};
};

function hex(color: string) {
	const c = color.trim();
	return c.startsWith('#') ? c : `#${c}`;
}

export function PreviewMagnet() {
	const { t, lang } = useLanguageContext();
	const m = t.business.hero.magnet;
	const origin = useMemo(() => getPlanApiOrigin(), []);
	const configured = isPlanApiConfigured(origin);

	const [submitting, setSubmitting] = useState(false);
	const [website, setWebsite] = useState('');
	const [phase, setPhase] = useState<Phase>(configured ? 'form' : 'down');
	const [errorMessage, setErrorMessage] = useState(configured ? '' : m.down);
	const [slug, setSlug] = useState('');
	const [ready, setReady] = useState<ReadyPayload | null>(null);
	const [elapsedMs, setElapsedMs] = useState(0);
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
		() => buildRegisterUrl({ lang, previewSlug: slug, appendLang: appendLangToUrl }),
		[lang, slug],
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
		(nextSlug: string, body: ReadyPayload['brand'] extends infer B ? { brand?: B; content?: ReadyPayload['content'] } : never) => {
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
				content: (body && body.content) || { kind: 'brand-only', posts: [] },
			});
			setPhase('ready');
		},
		[refuseNamelessReady],
	);

	const poll = useCallback(
		async (nextSlug: string, attempt: number) => {
			if (cancelled.current) return;
			const result = await viewPreview(origin, nextSlug);
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
		[origin, onReady, m.failed],
	);

	useEffect(() => {
		if (!configured) return;
		const saved = readPreviewSlugCookie();
		if (!saved) return;
		let live = true;
		void (async () => {
			const result = await viewPreview(origin, saved);
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

		if (!isPlanApiConfigured(origin)) {
			setPhase('down');
			setErrorMessage(m.down);
			return;
		}

		setErrorMessage('');
		setSubmitting(true);
		const result = await submitPreview(origin, websiteSubmitBody({ website: decision.website, locale: lang }));
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
		setPhase(configured ? 'form' : 'down');
		setErrorMessage(configured ? '' : m.down);
		setReady(null);
		setSlug('');
		setElapsedMs(0);
	};

	const waitKey = waitCopyKey(elapsedMs);
	const waitText = waitKey === 'waitLeave' ? m.waitLeave : waitKey === 'waitLonger' ? m.waitLonger : m.waitCalm;

	const brandName = readyBrandName(ready?.brand);
	const descriptor = sanitizeTagline(ready?.brand.tagline);
	const colors = (ready?.brand.colors || []).filter(Boolean).slice(0, 6);
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
					<p className="text-[15px] font-medium text-[var(--text)]">{waitText}</p>
					{!reduceMotion && (
						<div aria-hidden className="h-1 w-full overflow-hidden rounded-full bg-[var(--border2)]">
							<div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--orange)]" />
						</div>
					)}
					<p className="text-[12px] leading-snug text-[var(--text)] opacity-70">{m.waitReturn}</p>
				</div>
			)}

			{showReadyCard && ready && (
				<div className="flex flex-col gap-5">
					<div className="flex items-start gap-3">
						{ready.brand.logoUrl && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={ready.brand.logoUrl}
								alt=""
								className="h-12 w-12 shrink-0 rounded-lg border border-[var(--border2)] bg-white object-contain p-1"
								onError={(e) => {
									(e.currentTarget as HTMLImageElement).style.display = 'none';
								}}
							/>
						)}
						<div className="min-w-0">
							<p className="text-[11px] uppercase tracking-[1px] text-[var(--orange)]">{m.revealEyebrow}</p>
							<h2 className="mt-1 text-[22px] font-bold leading-tight tracking-[-0.03em] text-[var(--text)]">
								{brandName}
							</h2>
							{descriptor ? (
								<p className="mt-1 text-[14px] leading-snug text-[var(--text)] opacity-90">{descriptor}</p>
							) : null}
						</div>
					</div>

					{!descriptor ? (
						<p className="text-[13px] leading-snug text-[var(--text)] opacity-80">{m.readThin}</p>
					) : null}

					{colors.length > 0 && (
						<div className="flex flex-wrap gap-1.5" aria-hidden>
							{colors.map((c) => (
								<span
									key={c}
									className="h-2.5 w-2.5 rounded-full border border-[var(--border2)]"
									style={{ background: hex(c) }}
								/>
							))}
						</div>
					)}

					<a
						href={signupHref}
						className="inline-flex items-center justify-center rounded-lg bg-[var(--orange)] px-4 py-2.5 text-[14px] font-bold text-white hover:bg-[#FF7A40]"
					>
						{m.startFree} <span className="ml-1">→</span>
					</a>
					<button type="button" onClick={reset} className="text-[12px] text-[var(--text)] underline-offset-2 hover:underline">
						{m.tryAgain}
					</button>
				</div>
			)}
		</div>
	);
}
