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
import { PLATFORMS, readHandle, readPlaceId, readWebsite } from '../preview/previewInput';
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
	const [platform, setPlatform] = useState<string>('instagram');
	const [submitting, setSubmitting] = useState(false);
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

		// Read the field here so a bad value costs an inline message instead of
		// a round trip and a server refusal that names no field.
		let body: Record<string, string> = { locale: lang };
		if (door === 'website') {
			const read = readWebsite(website);
			if (!read.ok) {
				if (read.reason === 'is_social' && read.platform) {
					setPlatform(read.platform);
					setDoor('handle');
					setHandle(website.trim());
					setWebsite('');
					setErrorMessage(m.movedToHandle);
					return;
				}
				setErrorMessage(m.badWebsite);
				return;
			}
			body = { ...websiteSubmitBody({ website: read.website, email, locale: lang }) };
		} else if (door === 'place') {
			const read = readPlaceId(placeId);
			if (!read.ok) {
				setErrorMessage(m.pickListing);
				return;
			}
			body = { ...placeSubmitBody({ placeId: read.placeId, businessName: placeName, email, locale: lang }) };
		} else {
			const read = readHandle(handle, platform);
			if (!read.ok) {
				setErrorMessage(read.reason === 'is_website' ? m.movedToWebsite : m.badHandle);
				if (read.reason === 'is_website') {
					setDoor('website');
					setWebsite(handle.trim());
					setHandle('');
				}
				return;
			}
			// The platform is the whole reason this door used to fail: the server
			// will not guess it, and we were not sending it.
			body = { ...handleSubmitBody({ handle: read.handle, platform: read.platform, email, locale: lang }) };
		}

		emailSent.current = Boolean(email.trim());
		setSubmitting(true);
		const result = await submitPreview(origin, body);
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

	// Everything below already arrives in the payload and none of it was being
	// rendered: the reveal showed a name, a tagline and three swatches, then a
	// list of "Sample posts" that were not posts at all — the server composes
	// them from the facts it read (the name, the URL, the address, the category
	// word), because inventing captions for a stranger's brand is the one thing
	// previewCompose refuses to do. Showing a business its own URL back as a
	// "sample post" is the weakest possible version of a strong read.
	const colors = (ready?.brand.colors || []).filter(Boolean).slice(0, 6);
	const products = (ready?.brand.products || []).filter(Boolean).slice(0, 8);
	const facts: [string, string][] = ready
		? ([
				[m.factCategory, ready.brand.category || ''],
				[m.factAddress, ready.brand.address || ''],
				[
					m.factSource,
					ready.brand.website ||
						(ready.brand.handle
							? `@${ready.brand.handle}${ready.brand.handlePlatform ? ` · ${ready.brand.handlePlatform}` : ''}`
							: ''),
				],
			] as [string, string][]).filter(([, v]) => Boolean(v))
		: [];
	const readCount = colors.length + products.length + facts.length;

	const selectDoor = (id: Door) => {
		setDoor(id);
		// A refusal belongs to the field that caused it. Carrying it across
		// doors tells the visitor their website is malformed when what failed
		// was a handle they have already abandoned.
		setErrorMessage('');
		if (phase === 'identity' || phase === 'failed') setPhase('form');
	};

	const doorBtn = (id: Door, label: string) => (
		<button
			type="button"
			onClick={() => selectDoor(id)}
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
						{/* Places needs a browser key. Without one the door renders a line of
						    apology and no input, so it is a tab that can only waste a click. */}
						{PLACES_KEY ? doorBtn('place', m.doorPlace) : null}
						{doorBtn('handle', m.doorHandle)}
					</div>

					{door === 'website' && (
						// type="text", not type="url": the browser's url validator demands a
						// scheme, so `yourbusiness.com` — how nearly everyone types it — was
						// blocked before it could be sent. The server adds the scheme itself.
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
									setErrorMessage('');
								}}
							/>
						) : (
							<p className="text-[13px] text-[var(--text)]">{m.placeUnavailable}</p>
						))}

					{/* Typing a name is not choosing a listing — only a selection carries the
					    place id the server keys on. Showing the pick back is the only way the
					    visitor can tell the difference. */}
					{door === 'place' && PLACES_KEY && (
						<p className="text-[12px] leading-snug text-[var(--text)] opacity-80">
							{placeId ? `${m.listingPicked} ${placeName}` : m.listingHint}
						</p>
					)}

					{door === 'handle' && (
						<>
							<input
								type="text"
								name="handle"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck={false}
								placeholder={m.handlePlaceholder}
								value={handle}
								onChange={(e) => setHandle(e.target.value)}
								className={fieldClass}
								required
							/>
							{/* The server refuses to guess which platform a bare handle belongs
							    to — guessing points a stranger at someone else's account. It
							    therefore needs to be asked. Paste a profile URL and the parser
							    reads the platform from it, so these chips are the fallback. */}
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-[12px] text-[var(--text)] opacity-80">{m.platformLabel}</span>
								{PLATFORMS.map((p) => (
									<button
										key={p}
										type="button"
										onClick={() => setPlatform(p)}
										aria-pressed={platform === p}
										className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
											platform === p
												? 'bg-[var(--purple)] text-white'
												: 'border border-[var(--border2)] text-[var(--text)] hover:border-[var(--purple)]'
										}`}
									>
										{p}
									</button>
								))}
							</div>
						</>
					)}

					{errorMessage && (
						<p role="alert" className="text-[13px] leading-snug text-[var(--orange)]">
							{errorMessage}
						</p>
					)}

					<button
						type="submit"
						disabled={submitting || (phase === 'down' && !configured)}
						className="inline-flex items-center justify-center rounded-lg bg-[var(--purple)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--purple-light)] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting ? m.submitting : m.submit}
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
								{ready.brand.name || m.unnamedBrand}
							</h2>
							{ready.brand.tagline && (
								<p className="mt-1 text-[14px] leading-snug text-[var(--text)] opacity-90">{ready.brand.tagline}</p>
							)}
						</div>
					</div>

					{facts.length > 0 && (
						<dl className="flex flex-col gap-0 overflow-hidden rounded-lg border border-[var(--border2)]">
							{facts.map(([label, value], i) => (
								<div
									key={label}
									className={`grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-3 py-2 text-[13px] ${
										i ? 'border-t border-[var(--border2)]' : ''
									}`}
								>
									<dt className="text-[11px] uppercase tracking-[0.6px] text-[var(--text)] opacity-60">{label}</dt>
									<dd className="m-0 break-words capitalize text-[var(--text)]">{value}</dd>
								</div>
							))}
						</dl>
					)}

					{colors.length > 0 && (
						<div>
							<p className="mb-2 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-60">{m.colorsLabel}</p>
							<div className="flex flex-wrap gap-2">
								{colors.map((c) => (
									<span key={c} className="flex items-center gap-1.5 rounded-full border border-[var(--border2)] py-1 pl-1 pr-2.5">
										<span
											className="h-5 w-5 rounded-full border border-[var(--border2)]"
											style={{ background: hex(c) }}
										/>
										<span className="font-mono text-[11px] uppercase text-[var(--text)] opacity-80">{hex(c)}</span>
									</span>
								))}
							</div>
						</div>
					)}

					{products.length > 0 && (
						<div>
							<p className="mb-2 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-60">{m.productsLabel}</p>
							<div className="flex flex-wrap gap-1.5">
								{products.map((item) => (
									<span
										key={item}
										className="rounded-md border border-[var(--border2)] bg-[var(--bg)] px-2 py-1 text-[12px] text-[var(--text)]"
									>
										{item}
									</span>
								))}
							</div>
						</div>
					)}

					{/* The honest bridge. What the visitor has seen is a READ, not the
					    product — and saying so is what makes the next line credible. The
					    old copy oversold the read as "your brand" and then had nothing
					    to follow it with. */}
					<div className="rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3.5 py-3">
						<p className="text-[13px] font-semibold leading-snug text-[var(--text)]">
							{readCount > 0 ? m.readSummary : m.readThin}
						</p>
						<p className="mt-1.5 text-[13px] leading-snug text-[var(--text)] opacity-85">{m.nextUp}</p>
						<ul className="mt-2 flex flex-col gap-1 text-[13px] leading-snug text-[var(--text)] opacity-85">
							{m.nextItems.map((item: string) => (
								<li key={item} className="flex gap-2">
									<span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--orange)]" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>

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
