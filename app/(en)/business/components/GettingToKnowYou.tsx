'use client';

import { useMemo, useState } from 'react';
import {
	chooseDecide,
	decideChip,
	pickerRows,
	pickerState,
	toggle,
} from '../preview/platformPickerView';
import { headingKeyFor, profileSections, revealDelays } from '../preview/gettingToKnowYou';
import { businessFacts } from '../preview/businessFacts';
import { brandCity } from '../preview/previewCity';
import { emitFunnelEvent } from '../preview/funnelEvents';

import type { BusinessFacts } from '../preview/businessFacts';

type MagnetCopy = Record<string, string | undefined>;

type Section = {
	id: string;
	kind: string;
	value?: string | string[];
	chips?: string[];
	sentence?: string;
	logo?: string;
	colors?: string[];
	photos?: string[];
};

type Draft = {
	name?: string;
	framing?: string;
	tagline?: string;
	audience?: string;
	services?: string;
	problem?: string;
	UVP?: string;
	keyTerms?: string[];
	language?: string;
	cadence?: string;
	trustSignals?: string[];
	ctas?: string[];
	slogans?: string[];
	voiceChips?: string[];
	voiceSentence?: string;
};

type Props = {
	body: { brand?: object; positioning?: object } | null;
	website: string;
	platforms: string[];
	onPlatforms: (next: string[] | ((prev: string[]) => string[])) => void;
	signupHref: string;
	onReset: () => void;
	copy: MagnetCopy;
	/** Headings the founder actually watched type out during the wait. */
	watched?: string[];
	reduceMotion?: boolean;
};

/** First-brain copy. Picker and proof sit below this, not above overview. */
const KNOWING_IDS = Object.freeze([
	'name',
	'framing',
	'tagline',
	'audience',
	'services',
	'problem',
	'UVP',
	'keyTerms',
	'language',
	'cadence',
	'trustSignals',
	'ctas',
	'slogans',
	'voice',
]);

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

function hex(color: string) {
	const c = color.trim();
	return c.startsWith('#') ? c : `#${c}`;
}

function asLines(value: string | string[] | undefined): string {
	if (Array.isArray(value)) return value.join('\n');
	return typeof value === 'string' ? value : '';
}

function parseLines(raw: string): string[] {
	return raw
		.split(/\n+/)
		.map((s) => s.trim())
		.filter(Boolean);
}

function Chips({ items }: { items: string[] }) {
	return (
		<div className="preview-chip-list flex flex-wrap gap-1.5">
			{items.map((item) => (
				<span
					key={item}
					className="preview-chip rounded-full border border-[var(--border2)] px-2.5 py-1 text-[12px] text-[var(--text)]"
				>
					{item}
				</span>
			))}
		</div>
	);
}

function Pencil({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className="preview-edit inline-flex items-center justify-center gap-1.5 text-[var(--text)]"
		>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
				<path
					d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20z"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
			</svg>
			<span>{label}</span>
		</button>
	);
}

function isEditable(kind: string, id: string) {
	if (id === 'schedule' || id === 'proof') return false;
	return kind === 'text' || kind === 'list' || kind === 'line' || kind === 'voice';
}

function draftValue(section: Section, draft: Draft): Section {
	if (section.id === 'name' && draft.name != null) return { ...section, value: draft.name };
	if (section.id === 'framing' && draft.framing != null) return { ...section, value: draft.framing };
	if (section.id === 'tagline' && draft.tagline != null) return { ...section, value: draft.tagline };
	if (section.id === 'audience' && draft.audience != null) return { ...section, value: draft.audience };
	if (section.id === 'services' && draft.services != null) return { ...section, value: draft.services };
	if (section.id === 'problem' && draft.problem != null) return { ...section, value: draft.problem };
	if (section.id === 'UVP' && draft.UVP != null) return { ...section, value: draft.UVP };
	if (section.id === 'keyTerms' && draft.keyTerms) return { ...section, value: draft.keyTerms };
	if (section.id === 'language' && draft.language != null) return { ...section, value: draft.language };
	if (section.id === 'cadence' && draft.cadence != null) return { ...section, value: draft.cadence };
	if (section.id === 'trustSignals' && draft.trustSignals) return { ...section, value: draft.trustSignals };
	if (section.id === 'ctas' && draft.ctas) return { ...section, value: draft.ctas };
	if (section.id === 'slogans' && draft.slogans) return { ...section, value: draft.slogans };
	if (section.id === 'voice') {
		return {
			...section,
			chips: draft.voiceChips || section.chips || [],
			sentence: draft.voiceSentence != null ? draft.voiceSentence : section.sentence || '',
		};
	}
	return section;
}

export function GettingToKnowYou({
	body,
	website,
	platforms,
	onPlatforms,
	signupHref,
	onReset,
	copy: m,
	watched,
	reduceMotion,
}: Props) {
	const [draft, setDraft] = useState<Draft>({});
	const [editing, setEditing] = useState<string | null>(null);
	const [editText, setEditText] = useState('');
	const [editSentence, setEditSentence] = useState('');

	const sections = useMemo(
		() => profileSections(body, { selected: platforms }) as Section[],
		[body, platforms],
	);

	const decide = decideChip({ selected: platforms });
	const painted = sections.map((section) => draftValue(section, draft));
	const knowing = painted.filter((section) => KNOWING_IDS.includes(section.id));
	const canvasSections = knowing.filter((section) => section.id !== 'cadence');
	const cadence = knowing.find((section) => section.id === 'cadence');
	const proof = painted.find((section) => section.id === 'proof');
	const platformRows = pickerRows({ selected: platforms });
	const offeredRows = platformRows.filter((row) => row.selectable);
	const comingRows = platformRows.filter((row) => !row.selectable);

	// The hard facts the founder's own JSON-LD publishes — phone,
	// hours, price range, the year they started, the rating their
	// customers left. Verbatim or absent; rules in businessFacts.js.
	const facts = useMemo(() => businessFacts(body), [body]);

	// Location the GET already carried (or a parseable "Austin, TX"
	// address when extract left city blank). Convert must not be the
	// first time it appears. Fill/display only — never invented.
	const city = brandCity(body && body.brand);

	// The sentences the founder already watched are instant; only what
	// sits below them cascades. The signup CTA is deliberately absent
	// from this list — an action must never be delayed behind an
	// animation. Posts are walled: they never join this list.
	const delays = useMemo(
		() =>
			revealDelays(
				[
					...knowing.map((section) => section.id),
					...(proof ? ['proof'] : []),
					...(facts ? ['facts'] : []),
					'picker',
				],
				watched,
				reduceMotion,
			),
		[knowing, proof, facts, watched, reduceMotion],
	);
	const reveal = (id: string) => ({
		className: 'preview-reveal',
		style: { animationDelay: `${delays[id] || 0}ms` },
	});

	const beginEdit = (section: Section) => {
		setEditing(section.id);
		if (section.kind === 'voice') {
			setEditSentence(section.sentence || '');
			setEditText((section.chips || []).join('\n'));
			return;
		}
		setEditText(asLines(section.value));
		setEditSentence('');
	};

	// leftover-4 dest HOLD: local state only. Hydrate persist is Onboarding.
	// leftover-6, remaining OFF: no second scrape, no website builder.
	// Posts walled on the free card (Jimmy lock) — no PostStrip.
	const commitEdit = (id: string) => {
		setDraft((prev) => {
			const next: Draft = { ...prev };
			if (id === 'voice') {
				next.voiceChips = parseLines(editText);
				next.voiceSentence = editSentence;
			} else if (id === 'ctas') {
				next.ctas = parseLines(editText);
			} else if (id === 'slogans') {
				next.slogans = parseLines(editText);
			} else if (id === 'keyTerms') {
				next.keyTerms = parseLines(editText);
			} else if (id === 'trustSignals') {
				next.trustSignals = parseLines(editText);
			} else if (id === 'name') {
				next.name = editText.trim();
			} else if (id === 'framing') {
				next.framing = editText.trim();
			} else if (id === 'tagline') {
				next.tagline = editText.trim();
			} else if (id === 'audience') {
				next.audience = editText.trim();
			} else if (id === 'services') {
				next.services = editText.trim();
			} else if (id === 'problem') {
				next.problem = editText.trim();
			} else if (id === 'UVP') {
				next.UVP = editText.trim();
			} else if (id === 'language') {
				next.language = editText.trim();
			} else if (id === 'cadence') {
				next.cadence = editText.trim();
			}
			return next;
		});
		setEditing(null);
		// WHICH section they corrected, never WHAT they typed. The ids are
		// our own vocabulary, so this can say "the overview is the thing we
		// get wrong" without carrying a word of the founder's business.
		emitFunnelEvent('ready_edit', { section: id });
	};

	const chipClass = (on: boolean) =>
		'preview-platform-chip inline-flex w-full items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[12px] font-semibold transition-all ' +
		(on
			? 'preview-platform-chip--active border-[var(--preview-orange)] bg-[var(--preview-orange)]'
			: 'border-[var(--border2)] text-[var(--text)]');

	const renderSection = (section: Section, index: number) => {
		const heading = m[headingKeyFor(section.id)] || '';
		const editingThis = editing === section.id;
		const anim = reveal(section.id);
		const isIdentity = section.id === 'name';
		const isOverview = section.id === 'framing';
		return (
			<section
				key={section.id}
				className={`preview-profile-section preview-profile-section--${section.id} min-w-0 ${anim.className}`}
				style={anim.style}
			>
				<div className="preview-section-heading-row">
					<div className="flex items-center gap-2">
						{!isIdentity && !isOverview ? (
							<span className="preview-section-index" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
						) : null}
						{isIdentity ? <p className="preview-section-kicker">{m.identityLabel}</p> : null}
						{heading ? (
							<p className="preview-section-heading text-[12px] font-semibold text-[var(--text)]">{heading}</p>
						) : null}
					</div>
					{isEditable(section.kind, section.id) && !editingThis ? (
						<Pencil label={m.editLabel || ''} onClick={() => beginEdit(section)} />
					) : null}
				</div>

				{editingThis ? (
					<div className="preview-inline-editor flex flex-col gap-2">
						{section.kind === 'voice' ? (
							<textarea
								value={editSentence}
								onChange={(e) => setEditSentence(e.target.value)}
								rows={2}
								className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--preview-orange)]"
							/>
						) : null}
						<textarea
							value={editText}
							onChange={(e) => setEditText(e.target.value)}
							rows={section.kind === 'text' ? 4 : 3}
							className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--preview-orange)]"
						/>
						<button
							type="button"
							onClick={() => commitEdit(section.id)}
							className="preview-edit-done self-start rounded-lg px-3 py-1.5 text-[12px] font-semibold"
						>
							{m.doneLabel}
						</button>
					</div>
				) : (
					<>
						<SectionView section={section} copy={m} />
						{section.id === 'name' && city ? (
							<p className="preview-profile-location">
								<svg viewBox="0 0 24 24" fill="none" aria-hidden>
									<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.7" />
									<circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
								</svg>
								{city}
							</p>
						) : null}
					</>
				)}
			</section>
		);
	};

	return (
		<div className="preview-ready flex max-h-[min(82vh,940px)] flex-col gap-0">
			<div className="preview-ready-titlebar shrink-0">
				<div className="preview-ready-title-group">
					<span className="preview-ready-mark" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none">
							<path d="M5 15.5 8.7 7l3.4 6.3L15.5 7l3.5 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M6 18h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
						</svg>
					</span>
					<div>
						<p className="preview-ready-eyebrow">{m.readyEyebrow}</p>
						<p className="preview-ready-title text-[var(--text)]">{m.knowingTitle}</p>
					</div>
				</div>
				<span className="preview-ready-status" role="status">
					<svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="m6.5 12.5 3.3 3.2 7.7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
					{m.readyStatus}
				</span>
			</div>

			<div className="preview-ready-workspace min-h-0 flex-1">
				<main className="preview-ready-scroll min-h-0 overflow-y-auto">
					{website.trim() ? (
						<div className="preview-source">
							<svg viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M3.5 12h17M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3C9.8 5.5 8.7 8.5 8.7 12s1.1 6.5 3.3 9" stroke="currentColor" strokeWidth="1.4" /></svg>
							<span>{m.sourceLabel}</span>
							<strong>{website.trim()}</strong>
						</div>
					) : null}

					<div className="preview-profile-stack">
						{!canvasSections.some((section) => section.id === 'name') && city ? (
							<p className="preview-profile-location">{city}</p>
						) : null}
						{canvasSections.map(renderSection)}
						{proof ? <ProofStrip section={proof} reveal={reveal('proof')} /> : null}
						{facts ? <FactStrip facts={facts} copy={m} reveal={reveal('facts')} /> : null}
					</div>
				</main>

				<aside className="preview-action-rail">
					<fieldset
						className={`preview-platform-card m-0 border-0 ${reveal('picker').className}`}
						style={reveal('picker').style}
					>
						<legend>
							<span className="preview-section-kicker">{m.publishingEyebrow}</span>
							<span className="preview-platform-title">{m.platformsLabel}</span>
						</legend>
						<p className="preview-platform-hint">{m.publishingHint}</p>
						<div className="preview-platform-options">
							{offeredRows.map((row) => (
								<button
									key={row.id}
									type="button"
									aria-pressed={row.checked}
									onClick={() => onPlatforms((p) => toggle(p, row.id))}
									className={chipClass(row.checked)}
								>
									<span className="preview-platform-glyph" aria-hidden>
										{row.id === 'facebook' ? 'f' : (
											<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.8" r="1" fill="currentColor" /></svg>
										)}
									</span>
									{platformCopy(m, row.id)}
									<span className="preview-platform-check" aria-hidden>{row.checked ? '✓' : ''}</span>
								</button>
							))}
							<button
								type="button"
								aria-pressed={decide.checked}
								onClick={() => onPlatforms(chooseDecide())}
								className={chipClass(decide.checked)}
							>
								<span className="preview-platform-glyph" aria-hidden>✦</span>
								{m.platformDecideForMe}
								<span className="preview-platform-check" aria-hidden>{decide.checked ? '✓' : ''}</span>
							</button>
						</div>
						<p className="preview-platform-state">
							{pickerState(platforms) === 'decide' ? m.platformsDecide : m.platformsChosen}
						</p>
						{comingRows.length ? (
							<div className="preview-platform-unavailable">
								<span>{m.availabilityLabel}</span>
								<p>{comingRows.map((row) => `${platformCopy(m, row.id)} — ${reasonCopy(m, row.reason)}`).join(' · ')}</p>
							</div>
						) : null}
					</fieldset>

					{cadence ? (
						<div className={`preview-rail-meta ${reveal('cadence').className}`} style={reveal('cadence').style}>
							<svg viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
							<div><span>{m.cadenceLabel}</span><strong>{asLines(cadence.value)}</strong></div>
						</div>
					) : null}
				</aside>
			</div>

			<div className="preview-ready-actions preview-ready-actions--sticky shrink-0">
				<p className="preview-action-trust">{m.actionTrust}</p>
				<div className="preview-action-controls">
					<a
						href={signupHref}
						data-signup-cta="preview-ready"
						onClick={() =>
							emitFunnelEvent('cta_signup', {
								platformsPicked: platforms.length,
							})
						}
						className="preview-primary-cta"
					>
						<span>{m.continueWithProfile}</span>
						<svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</a>
					<div className="preview-action-meta">
						<span>{m.startFree}</span>
						<button type="button" onClick={onReset} className="preview-reset">{m.tryAgain}</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FactStrip({
	facts,
	copy: m,
	reveal,
}: {
	facts: BusinessFacts;
	copy: MagnetCopy;
	reveal?: { className: string; style: { animationDelay: string } };
}) {
	// Every value here is the founder's own markup, printed as written.
	// The label beside it is OURS, so a build with no copy for a chip
	// omits that chip rather than rendering a bare id.
	const label: Record<string, string | undefined> = {
		phone: m.factPhone,
		price: m.factPrice,
		since: m.factSince,
	};
	const chips = facts.chips.filter((chip) => !!label[chip.id]);
	if (!chips.length && !facts.hours.length && !facts.rating) return null;
	return (
		<div
			className={`preview-fact-strip flex flex-col gap-2 pt-1 ${reveal ? reveal.className : ''}`}
			style={reveal ? reveal.style : undefined}
		>
			<p className="text-[14px] font-semibold text-[var(--text)]">{m.factsTitle}</p>
			<div className="flex flex-wrap items-center gap-1.5">
				{chips.map((chip) => (
					<span
						key={chip.id}
						className="rounded-full border border-[var(--border2)] px-2.5 py-1 text-[12px] text-[var(--text)]"
					>
						<span className="opacity-60">{label[chip.id]} </span>
						{chip.value}
					</span>
				))}
				{facts.rating ? (
					<span className="rounded-full border border-[var(--border2)] px-2.5 py-1 text-[12px] text-[var(--text)]">
						{/* Both halves, always: a star with no denominator
						    is the one line here worth fabricating. */}
						{facts.rating.value} ({facts.rating.count})
					</span>
				) : null}
			</div>
			{facts.hours.length ? (
				<ul className="m-0 flex list-none flex-col gap-0.5 p-0">
					{facts.hours.map((line) => (
						<li
							key={`${line.days.join('')}${line.opens}${line.closes}`}
							className="text-[12px] leading-snug text-[var(--text)] opacity-70"
						>
							{line.days.join(', ')} {line.opens}–{line.closes}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

function ProofStrip({
	section,
	reveal,
}: {
	section: Section;
	reveal?: { className: string; style: { animationDelay: string } };
}) {
	const colors = section.colors || [];
	const photos = section.photos || [];
	return (
		<div
			className={`preview-proof-strip flex flex-wrap items-center gap-3 pt-1 ${reveal ? reveal.className : ''}`}
			style={reveal ? reveal.style : undefined}
			aria-hidden
		>
			{section.logo ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={section.logo}
					alt=""
					className="h-12 w-12 rounded-lg border border-[var(--border2)] bg-white object-contain p-1"
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = 'none';
					}}
				/>
			) : null}
			{colors.length ? (
				<div className="flex flex-wrap gap-1.5">
					{colors.map((c) => (
						<span
							key={c}
							className="h-6 w-6 rounded-full border border-[var(--border2)]"
							style={{ background: hex(c) }}
						/>
					))}
				</div>
			) : null}
			{photos.length ? (
				<div className="flex flex-wrap gap-1.5">
					{photos.slice(0, 3).map((src) => (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							key={src}
							src={src}
							alt=""
							className="h-12 w-12 rounded-lg border border-[var(--border2)] object-cover"
							onError={(e) => {
								(e.currentTarget as HTMLImageElement).style.display = 'none';
							}}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

function SectionView({ section, copy }: { section: Section; copy: MagnetCopy }) {
	if (section.kind === 'text') {
		return <p className="preview-section-value text-[14px] text-[var(--text)]">{section.value as string}</p>;
	}
	if (section.kind === 'line') {
		const items = (section.value as string[]) || [];
		return <p className="preview-section-value text-[14px] text-[var(--text)]">{items.join(' · ')}</p>;
	}
	if (section.kind === 'list') {
		return <div className="preview-section-value"><Chips items={(section.value as string[]) || []} /></div>;
	}
	if (section.kind === 'voice') {
		return (
			<div className="preview-section-value flex flex-col gap-2">
				{section.sentence ? (
					<p className="text-[14px] leading-snug text-[var(--text)]">{section.sentence}</p>
				) : null}
				{section.chips && section.chips.length > 0 ? <Chips items={section.chips} /> : null}
			</div>
		);
	}
	if (section.kind === 'platforms') {
		const ids = (section.value as string[]) || [];
		return <div className="preview-section-value"><Chips items={ids.map((id) => platformCopy(copy, id)).filter(Boolean)} /></div>;
	}
	return null;
}
