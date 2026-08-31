'use client';

import { useMemo, useState } from 'react';
import {
	chooseDecide,
	decideChip,
	pickerRows,
	pickerState,
	toggle,
} from '../preview/platformPickerView';
import { headingKeyFor, profileSections } from '../preview/gettingToKnowYou';

type MagnetCopy = Record<string, string | undefined>;

type Section = {
	id: string;
	kind: string;
	value?: string | string[];
	chips?: string[];
	sentence?: string;
};

type Draft = {
	name?: string;
	overview?: string;
	products?: string[];
	services?: string;
	messaging?: string;
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
};

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
					className="rounded-full border border-[var(--border2)] px-2.5 py-1 text-[12px] text-[var(--text)]"
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
			className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--text)] opacity-55 hover:opacity-100"
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
	if (id === 'schedule' || id === 'logo' || id === 'colors' || id === 'photos') return false;
	return kind === 'text' || kind === 'list' || kind === 'voice';
}

export function GettingToKnowYou({
	body,
	website,
	platforms,
	onPlatforms,
	signupHref,
	onReset,
	copy: m,
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

	const painted = sections.map((section) => {
		if (section.id === 'name' && draft.name != null) return { ...section, value: draft.name };
		if (section.id === 'overview' && draft.overview != null) return { ...section, value: draft.overview };
		if (section.id === 'products' && draft.products) return { ...section, value: draft.products };
		if (section.id === 'services' && draft.services != null) return { ...section, value: draft.services };
		if (section.id === 'messaging' && draft.messaging != null) return { ...section, value: draft.messaging };
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
	});

	const beginEdit = (section: Section) => {
		setEditing(section.id);
		if (section.kind === 'voice') {
			setEditText((section.chips || []).join('\n'));
			setEditSentence(section.sentence || '');
			return;
		}
		setEditText(asLines(section.value));
		setEditSentence('');
	};

	// leftover-4 dest HOLD: local state only. Hydrate persist is Onboarding.
	const commitEdit = (id: string) => {
		setDraft((prev) => {
			const next: Draft = { ...prev };
			if (id === 'voice') {
				next.voiceChips = parseLines(editText);
				next.voiceSentence = editSentence;
			} else if (id === 'products') {
				next.products = parseLines(editText);
			} else if (id === 'ctas') {
				next.ctas = parseLines(editText);
			} else if (id === 'slogans') {
				next.slogans = parseLines(editText);
			} else if (id === 'name') {
				next.name = editText.trim();
			} else if (id === 'overview') {
				next.overview = editText.trim();
			} else if (id === 'services') {
				next.services = editText.trim();
			} else if (id === 'messaging') {
				next.messaging = editText.trim();
			}
			return next;
		});
		setEditing(null);
	};

	const chipClass = (on: boolean) =>
		'rounded-full border px-3 py-1.5 text-[13px] font-bold transition-colors ' +
		(on
			? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
			: 'border-[var(--border2)] text-[var(--text)] hover:border-[var(--text)]');

	return (
		<div className="flex max-h-[min(72vh,840px)] flex-col gap-0">
			<p className="shrink-0 text-[17px] font-bold tracking-[-0.02em] text-[var(--text)]">
				{m.knowingTitle}
			</p>
			<div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
				{website.trim() ? (
					<p className="mb-4 ml-auto w-fit max-w-[90%] rounded-full bg-[var(--border2)] px-3 py-1.5 text-[13px] text-[var(--text)]">
						{website.trim()}
					</p>
				) : null}

				<fieldset className="m-0 mb-6 border-0 p-0">
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
									className="cursor-default rounded-full border border-dashed border-[var(--border2)] px-3 py-1.5 text-[13px] text-[var(--text)] opacity-45"
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

				<div className="flex flex-col gap-5 pb-2">
					{painted.map((section) => {
						const heading = m[headingKeyFor(section.id)] || '';
						const editingThis = editing === section.id;
						return (
							<section key={section.id} className="min-w-0">
								<div className="mb-1.5 flex items-center">
									<p className="text-[14px] font-semibold text-[var(--text)]">{heading}</p>
									{isEditable(section.kind, section.id) && !editingThis ? (
										<Pencil label={m.editLabel || ''} onClick={() => beginEdit(section)} />
									) : null}
								</div>

								{editingThis ? (
									<div className="flex flex-col gap-2">
										<textarea
											value={editText}
											onChange={(e) => setEditText(e.target.value)}
											rows={section.kind === 'text' ? 4 : 5}
											className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]"
										/>
										{section.kind === 'voice' ? (
											<textarea
												value={editSentence}
												onChange={(e) => setEditSentence(e.target.value)}
												rows={2}
												className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--text)] outline-none focus:border-[var(--orange)]"
											/>
										) : null}
										<button
											type="button"
											onClick={() => commitEdit(section.id)}
											className="self-start rounded-full border border-[var(--border2)] px-3 py-1 text-[12px] font-semibold text-[var(--text)]"
										>
											{m.doneLabel}
										</button>
									</div>
								) : (
									<SectionView section={section} copy={m} />
								)}
							</section>
						);
					})}
				</div>
			</div>

			<div className="shrink-0 pt-4">
				<a
					href={signupHref}
					className="inline-flex w-full items-center justify-center rounded-full bg-[var(--text)] px-4 py-3 text-[15px] font-bold text-[var(--bg)] hover:opacity-90"
				>
					{m.startFree}
				</a>
				<button
					type="button"
					onClick={onReset}
					className="mt-2 w-full text-[12px] text-[var(--text)] underline-offset-2 hover:underline"
				>
					{m.tryAgain}
				</button>
			</div>
		</div>
	);
}

function SectionView({ section, copy }: { section: Section; copy: MagnetCopy }) {
	if (section.kind === 'text') {
		return <p className="text-[14px] leading-snug text-[var(--text)]">{section.value as string}</p>;
	}
	if (section.kind === 'list') {
		return <Chips items={(section.value as string[]) || []} />;
	}
	if (section.kind === 'voice') {
		return (
			<div className="flex flex-col gap-2">
				{section.chips && section.chips.length > 0 ? <Chips items={section.chips} /> : null}
				{section.sentence ? (
					<p className="text-[13px] leading-snug text-[var(--text)] opacity-75">{section.sentence}</p>
				) : null}
			</div>
		);
	}
	if (section.kind === 'logo' && typeof section.value === 'string') {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={section.value}
				alt=""
				className="h-16 w-16 rounded-lg border border-[var(--border2)] bg-white object-contain p-1"
				onError={(e) => {
					(e.currentTarget as HTMLImageElement).style.display = 'none';
				}}
			/>
		);
	}
	if (section.kind === 'colors') {
		const colors = (section.value as string[]) || [];
		return (
			<div className="flex flex-wrap gap-2" aria-hidden>
				{colors.map((c) => (
					<span
						key={c}
						className="h-8 w-8 rounded-full border border-[var(--border2)]"
						style={{ background: hex(c) }}
					/>
				))}
			</div>
		);
	}
	if (section.kind === 'photos') {
		const photos = (section.value as string[]) || [];
		return (
			<div className="flex flex-wrap gap-2">
				{photos.map((src) => (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						key={src}
						src={src}
						alt=""
						className="h-20 w-20 rounded-lg border border-[var(--border2)] object-cover"
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = 'none';
						}}
					/>
				))}
			</div>
		);
	}
	if (section.kind === 'platforms') {
		const ids = (section.value as string[]) || [];
		return <Chips items={ids.map((id) => platformCopy(copy, id)).filter(Boolean)} />;
	}
	return null;
}
