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
		<div className="flex flex-wrap gap-1.5">
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
			className="preview-edit ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--text)]"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
				<path
					d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20z"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
			</svg>
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
	const proof = painted.find((section) => section.id === 'proof');

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
		'preview-platform-chip rounded-full border px-3 py-1.5 text-[13px] font-bold transition-all ' +
		(on
			? 'preview-platform-chip--active border-[var(--preview-orange)] bg-[var(--preview-orange)] text-white'
			: 'border-[var(--border2)] text-[var(--text)]');

	const renderSection = (section: Section) => {
		const heading = m[headingKeyFor(section.id)] || '';
		const editingThis = editing === section.id;
		const anim = reveal(section.id);
		return (
			<section
				key={section.id}
				className={`preview-profile-section preview-profile-section--${section.id} min-w-0 ${anim.className}`}
				style={anim.style}
			>
				{heading ? (
					<div className="mb-1.5 flex items-center">
						<p className="preview-section-heading text-[14px] font-semibold text-[var(--text)]">{heading}</p>
						{isEditable(section.kind, section.id) && !editingThis ? (
							<Pencil label={m.editLabel || ''} onClick={() => beginEdit(section)} />
						) : null}
					</div>
				) : null}

				{editingThis ? (
					<div className="flex flex-col gap-2">
						{section.kind === 'voice' ? (
							<textarea
								value={editSentence}
								onChange={(e) => setEditSentence(e.target.value)}
								rows={2}
								className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]"
							/>
						) : null}
						<textarea
							value={editText}
							onChange={(e) => setEditText(e.target.value)}
							rows={section.kind === 'text' ? 4 : 3}
							className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]"
						/>
						<button
							type="button"
							onClick={() => commitEdit(section.id)}
							className="self-start rounded-full border border-[var(--border2)] px-3 py-1 text-[12px] font-semibold text-[var(--text)]"
						>
							{m.doneLabel}
						</button>
					</div>
				) : (
					<>
						<SectionView section={section} copy={m} />
						{section.id === 'name' && city ? (
							<p className="mt-0.5 text-[12px] leading-snug text-[var(--text)] opacity-70">
								{city}
							</p>
						) : null}
					</>
				)}
			</section>
		);
	};

	return (
		<div className="preview-ready flex max-h-[min(78vh,900px)] flex-col gap-0">
			<div className="preview-ready-titlebar shrink-0">
				<span className="preview-ready-mark" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M5 15.5 8.7 7l3.4 6.3L15.5 7l3.5 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M6 18h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
					</svg>
				</span>
				<p className="preview-ready-title text-[17px] font-bold tracking-[-0.02em] text-[var(--text)]">
					{m.knowingTitle}
				</p>
				<span className="preview-ready-status" aria-hidden="true"><i /></span>
			</div>
			<div className="preview-ready-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
				{website.trim() ? (
					<p className="preview-website mb-4 ml-auto w-fit max-w-[90%] rounded-full px-3 py-1.5 text-[13px] text-[var(--text)]">
						{website.trim()}
					</p>
				) : null}

				<div className="preview-profile-stack flex flex-col gap-3 pb-2">
					{!knowing.some((section) => section.id === 'name') && city ? (
						<p className="text-[12px] leading-snug text-[var(--text)] opacity-70">
							{city}
						</p>
					) : null}
					{knowing.map(renderSection)}
					{proof ? <ProofStrip section={proof} reveal={reveal('proof')} /> : null}
					{facts ? <FactStrip facts={facts} copy={m} reveal={reveal('facts')} /> : null}
				</div>

				<fieldset
					className={`preview-platform-card m-0 mb-2 mt-5 border-0 ${reveal('picker').className}`}
					style={reveal('picker').style}
				>
					<legend className="mb-2 p-0 text-[14px] font-semibold text-[var(--text)]">
						{m.platformsLabel}
					</legend>
					<div className="flex flex-wrap items-center gap-1.5">
						{pickerRows({ selected: platforms }).map((row) =>
							row.selectable ? (
								<button
									key={row.id}
									type="button"
									aria-pressed={row.checked}
									onClick={() => onPlatforms((p) => toggle(p, row.id))}
									className={chipClass(row.checked)}
								>
									{platformCopy(m, row.id)}
								</button>
							) : (
								<span
									key={row.id}
									className="preview-platform-chip preview-platform-chip--disabled cursor-default rounded-full border border-dashed border-[var(--border2)] px-3 py-1.5 text-[13px] text-[var(--text)]"
									title={reasonCopy(m, row.reason)}
								>
									{platformCopy(m, row.id)}
									<span className="ml-1.5 text-[11px] font-normal">
										{reasonCopy(m, row.reason)}
									</span>
								</span>
							),
						)}
						<span className="px-1 text-[12px] text-[var(--text)] opacity-60">{m.platformsOr}</span>
						<button
							type="button"
							aria-pressed={decide.checked}
							onClick={() => onPlatforms(chooseDecide())}
							className={chipClass(decide.checked)}
						>
							{m.platformDecideForMe}
						</button>
					</div>
					<p className="mt-2 text-[12px] leading-snug text-[var(--text)] opacity-70">
						{pickerState(platforms) === 'decide' ? m.platformsDecide : m.platformsChosen}
					</p>
				</fieldset>
			</div>

			<div className="preview-ready-actions preview-ready-actions--sticky shrink-0 pt-4">
				<a
					href={signupHref}
					data-signup-cta="preview-ready"
					// The navigation is NOT delayed on this. `emitFunnelEvent`
					// sends with `keepalive`, which is exactly what survives an
					// unload — awaiting it instead would put a network round
					// trip between a founder and the button they just pressed.
					onClick={() =>
						emitFunnelEvent('cta_signup', {
							platformsPicked: platforms.length,
						})
					}
				className="preview-primary-cta inline-flex w-full items-center justify-center rounded-full bg-[var(--preview-orange)] px-4 py-3 text-[15px] font-bold text-white"
				>
					{m.startFree}
				</a>
				<button
					type="button"
					onClick={onReset}
					className="preview-reset mt-2 w-full text-[12px] text-[var(--text)] underline-offset-2 hover:underline"
				>
					{m.tryAgain}
				</button>
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
		return <p className="text-[14px] leading-snug text-[var(--text)]">{section.value as string}</p>;
	}
	if (section.kind === 'line') {
		const items = (section.value as string[]) || [];
		return <p className="text-[14px] leading-snug text-[var(--text)]">{items.join(' · ')}</p>;
	}
	if (section.kind === 'list') {
		return <Chips items={(section.value as string[]) || []} />;
	}
	if (section.kind === 'voice') {
		return (
			<div className="flex flex-col gap-2">
				{section.sentence ? (
					<p className="text-[14px] leading-snug text-[var(--text)]">{section.sentence}</p>
				) : null}
				{section.chips && section.chips.length > 0 ? <Chips items={section.chips} /> : null}
			</div>
		);
	}
	if (section.kind === 'platforms') {
		const ids = (section.value as string[]) || [];
		return <Chips items={ids.map((id) => platformCopy(copy, id)).filter(Boolean)} />;
	}
	return null;
}
