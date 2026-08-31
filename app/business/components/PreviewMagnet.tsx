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
import {
	canShowReadyCard,
	progressFromBody,
	readPositioning,
	readyBrandName,
	realPosts,
	shopDescriptor,
	shopFact,
	shopProducts,
	websiteFieldDecision,
} from '../preview/previewReveal';
import { pickerRows, toggle, pickerState } from '../preview/platformPickerView';
import { nextPollDelayMs, waitCopyKey } from '../preview/previewWaitCopy';

type Phase = 'form' | 'wait' | 'ready' | 'failed' | 'down' | 'identity' | 'ceiling';

type ReadyBrand = {
	name?: string;
	colors?: string[];
	tagline?: string;
	description?: string;
	logoUrl?: string;
	logo?: string;
	category?: string;
	address?: string;
	website?: string;
	handle?: string;
	handlePlatform?: string;
	products?: string[];
	sources?: string[];
	audience?: string;
	voice?: string | string[];
	problem?: string;
	keyTerms?: string[];
	cadence?: string;
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
	content: {
		kind?: 'posts' | 'brand-only';
		posts?: { caption?: string; theme?: string; imageUrl?: string; image?: string; creativeUrl?: string }[];
	};
};

function hex(color: string) {
	const c = color.trim();
	return c.startsWith('#') ? c : `#${c}`;
}

// Copy lookups. A key this build has no string for renders NOTHING rather
// than a raw id — the picker is the first thing a stranger sees, and a bare
// `tiktok` on it reads as a bug. The vocabulary decides which rows exist;
// this only decides what they are called.
type MagnetCopy = Record<string, string | undefined>;

function platformCopy(m: MagnetCopy, id: string): string {
	const key = 'platform' + id.charAt(0).toUpperCase() + id.slice(1);
	return m[key] || '';
}

function reasonCopy(m: MagnetCopy, reason: string): string {
	const camel = reason
		.split('-')
		.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
		.join('');
	return m['platform' + camel.charAt(0).toUpperCase() + camel.slice(1)] || '';
}

function logoUrlFromBrand(brand: ReadyBrand): string {
	for (const raw of [brand.logoUrl, brand.logo]) {
		if (typeof raw === 'string' && raw.trim()) return raw.trim();
	}
	return '';
}

function FactChips({ items }: { items: string[] }) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{items.map((item) => (
				<span
					key={item}
					className="rounded-full border border-[var(--border2)] px-2.5 py-1 text-[12px] text-[var(--text)]"
				>
					{item}
				</span>
			))}
		</div>
	);
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
	// into their account.
	const [platforms, setPlatforms] = useState<string[]>([]);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [waitProgress, setWaitProgress] = useState('');
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
		(nextSlug: string, body: { brand?: ReadyBrand; content?: ReadyPayload['content']; positioning?: ReadyPayload['positioning'] }) => {
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
				content: (body && body.content) || { kind: 'brand-only', posts: [] },
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
	};

	const waitKey = waitCopyKey(elapsedMs);
	const waitText = waitKey === 'waitLeave' ? m.waitLeave : waitKey === 'waitLonger' ? m.waitLonger : m.waitCalm;

	const brandName = readyBrandName(ready?.brand);
	const descriptor = shopDescriptor(ready?.brand);
	const colors = (ready?.brand.colors || []).filter(Boolean).slice(0, 6);
	const products = shopProducts(ready?.brand);
	const category = shopFact(ready?.brand, 'category');
	const address = shopFact(ready?.brand, 'address');
	const logoUrl = ready ? logoUrlFromBrand(ready.brand) : '';
	const positioning = readPositioning(ready);
	const posts = ready ? realPosts(ready.content, ready.brand) : [];
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
					<p className="text-[15px] font-medium text-[var(--text)]">{waitProgress || waitText}</p>
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
						{logoUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={logoUrl}
								alt=""
								className="h-12 w-12 shrink-0 rounded-lg border border-[var(--border2)] bg-white object-contain p-1"
								onError={(e) => {
									(e.currentTarget as HTMLImageElement).style.display = 'none';
								}}
							/>
						) : null}
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

					{category ? (
						<p className="text-[13px] leading-snug text-[var(--text)]">
							<span className="opacity-60">{m.factCategory}</span> {category}
						</p>
					) : null}

					{address ? (
						<p className="text-[13px] leading-snug text-[var(--text)]">
							<span className="opacity-60">{m.factAddress}</span> {address}
						</p>
					) : null}

					{products.length > 0 ? (
						<div>
							<p className="mb-1.5 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
								{m.productsLabel}
							</p>
							<FactChips items={products} />
						</div>
					) : null}

					{positioning.present ? (
						<div className="flex flex-col gap-3">
							{positioning.audience ? (
								<div>
									<p className="mb-1 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
										{m.posAudience}
									</p>
									<p className="text-[14px] leading-snug text-[var(--text)]">{positioning.audience}</p>
								</div>
							) : null}
							{positioning.problem ? (
								<div>
									<p className="mb-1 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
										{m.posProblem}
									</p>
									<p className="text-[14px] leading-snug text-[var(--text)]">{positioning.problem}</p>
								</div>
							) : null}
							{positioning.voice.length > 0 ? (
								<div>
									<p className="mb-1.5 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
										{m.posVoice}
									</p>
									{positioning.voice.length === 1 ? (
										<p className="text-[14px] leading-snug text-[var(--text)]">{positioning.voice[0]}</p>
									) : (
										<FactChips items={positioning.voice} />
									)}
								</div>
							) : null}
							{positioning.keyTerms.length > 0 ? (
								<div>
									<p className="mb-1.5 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
										{m.posKeyTerms}
									</p>
									<FactChips items={positioning.keyTerms} />
								</div>
							) : null}
							{positioning.cadence ? (
								<div>
									<p className="mb-1 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
										{m.posCadence}
									</p>
									<p className="text-[14px] leading-snug text-[var(--text)]">{positioning.cadence}</p>
								</div>
							) : null}
						</div>
					) : null}

					{posts.length > 0 ? (
						<div className="flex flex-col gap-3">
							{posts.map((post, i) => (
								<article
									key={i}
									className="overflow-hidden rounded-2xl border border-[var(--border2)] bg-[var(--bg)]"
								>
									<div className="relative aspect-[4/5] bg-gradient-to-br from-[var(--orange)] to-[var(--purple)]">
										{post.imageUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={post.imageUrl}
												alt=""
												className="absolute inset-0 h-full w-full object-cover"
												onError={(e) => {
													(e.currentTarget as HTMLImageElement).style.display = 'none';
												}}
											/>
										) : null}
									</div>
									<p className="px-3.5 py-3 text-[14px] leading-snug text-[var(--text)]">{post.caption}</p>
								</article>
							))}
						</div>
					) : null}

					{/* THE PICKER SITS ABOVE THE WALL, not behind it — this is the
					    moment a founder is deciding whether to hand over an email,
					    and it is cheaper to answer one question than to fill a
					    form later. It offers only what the scheduler can serve
					    and NAMES the rest, unselectable: an omission reads as an
					    oversight and a founder cannot tell that from a decision.
					    Ticking nothing is how you say "decide for me" — there is
					    deliberately no chip for it, or it would be a peer of the
					    networks and the two answers would look the same. */}
					<fieldset className="m-0 border-0 p-0">
						<legend className="mb-2 p-0 text-[11px] uppercase tracking-[1px] text-[var(--text)] opacity-70">
							{m.platformsLabel}
						</legend>
						<div className="flex flex-wrap gap-1.5">
							{pickerRows({ selected: platforms }).map((row) =>
								row.selectable ? (
									<button
										key={row.id}
										type="button"
										aria-pressed={row.checked}
										onClick={() => setPlatforms((p) => toggle(p, row.id))}
										className={
											'rounded-full border px-3 py-1.5 text-[13px] font-bold transition-colors ' +
											(row.checked
												? 'border-[var(--orange)] bg-[var(--orange)] text-white'
												: 'border-[var(--border2)] text-[var(--text)] hover:border-[var(--orange)]')
										}
									>
										{platformCopy(magnetCopy, row.id)}
									</button>
								) : (
									<span
										key={row.id}
										className="cursor-default rounded-full border border-dashed border-[var(--border2)] px-3 py-1.5 text-[13px] text-[var(--text)] opacity-45"
										title={reasonCopy(magnetCopy, row.reason)}
									>
										{platformCopy(magnetCopy, row.id)}
										<span className="ml-1.5 text-[11px] font-normal">
											{reasonCopy(magnetCopy, row.reason)}
										</span>
									</span>
								),
							)}
						</div>
						<p className="mt-2 text-[12px] leading-snug text-[var(--text)] opacity-70">
							{pickerState(platforms) === 'decide'
								? m.platformsDecide
								: m.platformsChosen}
						</p>
					</fieldset>

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
