'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import {
	buildRegisterUrl,
	getPlanApiOrigin,
	handleSubmitBody,
	isPlanApiConfigured,
	placeSubmitBody,
	submitPreview,
	viewPreview,
	websiteSubmitBody,
} from '../preview/previewClient';
import { setPreviewSlugCookie } from '../preview/previewCookie';
import { nextPollDelayMs, waitCopyKey } from '../preview/previewWaitCopy';

type Door = 'website' | 'place' | 'handle';
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
	};
	content: {
		kind?: 'posts' | 'brand-only';
		posts?: { caption?: string; theme?: string }[];
	};
};

const PLACES_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY_1 || '';

function hex(color: string) {
	const c = color.trim();
	return c.startsWith('#') ? c : `#${c}`;
}

export function PreviewMagnet() {
	const { t, lang } = useLanguageContext();
	const m = t.business.hero.magnet;
	const origin = useMemo(() => getPlanApiOrigin(), []);
	const configured = isPlanApiConfigured(origin);

	const [door, setDoor] = useState<Door>('website');
	const [website, setWebsite] = useState('');
	const [handle, setHandle] = useState('');
	const [placeId, setPlaceId] = useState('');
	const [placeName, setPlaceName] = useState('');
	const [email, setEmail] = useState('');
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
	const emailSent = useRef(false);

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

	const onReady = useCallback(
		(nextSlug: string, body: ReadyPayload['brand'] extends infer B ? { brand?: B; content?: ReadyPayload['content'] } : never) => {
			stopWaitClock();
			setSlug(nextSlug);
			setPreviewSlugCookie(nextSlug);
			setReady({
				slug: nextSlug,
				brand: (body && body.brand) || {},
				content: (body && body.content) || { kind: 'brand-only', posts: [] },
			});
			setPhase('ready');
		},
		[],
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
				// Keep polling through a brief blip; after the long ladder we still poll.
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

	const beginWait = (nextSlug: string, status?: string) => {
		setSlug(nextSlug);
		setPreviewSlugCookie(nextSlug);
		if (status === 'ready') {
			// POST replay of an already-ready row: still GET to load brand/content.
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
		if (!isPlanApiConfigured(origin)) {
			setPhase('down');
			setErrorMessage(m.down);
			return;
		}
		setErrorMessage('');
		emailSent.current = Boolean(email.trim());
		let body: Record<string, string> = { locale: lang };
		if (door === 'website') {
			body = { ...websiteSubmitBody({ website, email, locale: lang }) };
		} else if (door === 'place') {
			body = { ...placeSubmitBody({ placeId, businessName: placeName, email, locale: lang }) };
		} else {
			body = { ...handleSubmitBody({ handle, email, locale: lang }) };
		}
		const result = await submitPreview(origin, body);
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

	const sendOptionalEmail = async () => {
		if (!slug || !email.trim() || emailSent.current) return;
		emailSent.current = true;
		// Replay POST — does not block the reveal. Server will not generate again.
		void submitPreview(origin, { email: email.trim(), locale: lang, website, placeId, handle, businessName: placeName });
	};

	const reset = () => {
		stopWaitClock();
		setPhase(configured ? 'form' : 'down');
		setErrorMessage(configured ? '' : m.down);
		setReady(null);
		setSlug('');
		setElapsedMs(0);
		emailSent.current = false;
	};

	const waitKey = waitCopyKey(elapsedMs);
	const waitText = waitKey === 'waitLeave' ? m.waitLeave : waitKey === 'waitLonger' ? m.waitLonger : m.waitCalm;

	const colors = (ready?.brand.colors || []).filter(Boolean).slice(0, 3);
	const posts = (ready?.content.posts || []).filter((p) => p && p.caption).slice(0, 3);
	const brandOnly = !posts.length;

	const doorBtn = (id: Door, label: string) => (
		<button
			type="button"
			onClick={() => setDoor(id)}
			aria-pressed={door === id}
			className={`rounded-full px-3 py-1.5 text-[12px] font-medium tracking-[0.2px] transition-colors ${
				door === id
					? 'bg-[var(--orange)] text-white'
					: 'border border-[var(--border2)] bg-transparent text-[var(--text)] hover:border-[var(--purple)]'
			}`}
		>
			{label}
		</button>
	);

	const fieldClass =
		'w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]';

	return (
		<div
			id="preview-magnet"
			className="relative z-[2] mx-auto mb-12 w-full max-w-[640px] rounded-2xl border border-[var(--border2)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-md"
		>
			{phase !== 'ready' && phase !== 'wait' && (
				<form onSubmit={onSubmit} className="flex flex-col gap-3">
					<div className="flex flex-wrap gap-2" role="tablist" aria-label={m.doorsLabel}>
						{doorBtn('website', m.doorWebsite)}
						{doorBtn('place', m.doorPlace)}
						{doorBtn('handle', m.doorHandle)}
					</div>

					{door === 'website' && (
						<input
							type="url"
							name="website"
							autoComplete="url"
							placeholder={m.websitePlaceholder}
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							className={fieldClass}
							required
						/>
					)}

					{door === 'place' &&
						(PLACES_KEY ? (
							<Autocomplete
								apiKey={PLACES_KEY}
								className={fieldClass}
								placeholder={m.placePlaceholder}
								options={{ types: ['establishment'] }}
								onPlaceSelected={(place) => {
									setPlaceId(place?.place_id || '');
									setPlaceName(place?.name || place?.formatted_address || '');
								}}
							/>
						) : (
							<p className="text-[13px] text-[var(--text)]">{m.placeUnavailable}</p>
						))}

					{door === 'handle' && (
						<input
							type="text"
							name="handle"
							placeholder={m.handlePlaceholder}
							value={handle}
							onChange={(e) => setHandle(e.target.value)}
							className={fieldClass}
							required
						/>
					)}

					{(phase === 'down' || phase === 'identity' || phase === 'ceiling' || phase === 'failed') && errorMessage && (
						<p role="alert" className="text-[13px] leading-snug text-[var(--orange)]">
							{errorMessage}
						</p>
					)}

					<button
						type="submit"
						disabled={phase === 'down' && !configured}
						className="inline-flex items-center justify-center rounded-lg bg-[var(--purple)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--purple-light)] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{m.submit}
					</button>
				</form>
			)}

			{phase === 'wait' && (
				<div className="flex flex-col gap-2 py-2" aria-live="polite">
					<p className="text-[15px] font-medium text-[var(--text)]">{waitText}</p>
					{!reduceMotion && (
						<div
							aria-hidden
							className="h-1 w-full overflow-hidden rounded-full bg-[var(--border2)]"
						>
							<div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--orange)]" />
						</div>
					)}
				</div>
			)}

			{phase === 'ready' && ready && (
				<div className="flex flex-col gap-4">
					<div>
						<p className="text-[11px] uppercase tracking-[1px] text-[var(--orange)]">{m.revealEyebrow}</p>
						<h2 className="mt-1 text-[22px] font-bold tracking-[-0.03em] text-[var(--text)]">
							{ready.brand.name || m.unnamedBrand}
						</h2>
						{ready.brand.tagline && (
							<p className="mt-1 text-[14px] text-[var(--text)]">{ready.brand.tagline}</p>
						)}
					</div>

					{colors.length > 0 && (
						<div>
							<p className="mb-2 text-[11px] uppercase tracking-[1px] text-[var(--text)]">{m.colorsLabel}</p>
							<div className="flex gap-2">
								{colors.map((c) => (
									<span
										key={c}
										title={hex(c)}
										className="h-8 w-8 rounded-full border border-[var(--border2)]"
										style={{ background: hex(c) }}
									/>
								))}
							</div>
						</div>
					)}

					{brandOnly ? (
						<p className="text-[14px] leading-snug text-[var(--text)]">{m.brandOnly}</p>
					) : (
						<div>
							<p className="mb-2 text-[11px] uppercase tracking-[1px] text-[var(--text)]">{m.postsLabel}</p>
							<ul className="flex flex-col gap-2">
								{posts.map((post, i) => (
									<li
										key={i}
										className="rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[13px] leading-snug text-[var(--text)]"
									>
										{post.caption}
									</li>
								))}
							</ul>
						</div>
					)}

					<label className="flex flex-col gap-1 text-[13px] text-[var(--text)]">
						<span>{m.emailLabel}</span>
						<input
							type="email"
							name="email"
							autoComplete="email"
							placeholder={m.emailPlaceholder}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onBlur={() => void sendOptionalEmail()}
							className={fieldClass}
						/>
						<span className="text-[12px] opacity-80">{m.emailHint}</span>
					</label>

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
