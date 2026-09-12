'use client';

import {
	ArrowLeft,
	ArrowRight,
	Check,
	CheckCircle2,
	ChevronRight,
	HelpCircle,
	Clock3,
	Globe2,
	Instagram,
	MapPin,
	Pencil,
	RotateCcw,
	ShieldCheck,
	Sparkles,
	Zap,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from './prototype.module.css';

type VariantKey = 'A' | 'B' | 'C';
type Platform = 'Instagram' | 'Facebook';

const VARIANTS: Array<{ key: VariantKey; name: string }> = [
	{ key: 'A', name: 'Focus canvas' },
	{ key: 'B', name: 'Research dossier' },
	{ key: 'C', name: 'Guided review' },
];

const insights = [
	{ label: 'Audience', value: 'Economic development leaders, local founders, and growing businesses' },
	{ label: 'What you solve', value: 'Turning a fragmented local business network into one useful source of truth' },
	{ label: 'Why you win', value: 'A civic partner with local context, practical programs, and direct access to decision-makers' },
];

const voice = ['Credible', 'Practical', 'Community-led'];

function MoilMark() {
	return (
		<span className={styles.mark} aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none">
				<path d="M5 15.5 8.7 7l3.4 6.3L15.5 7l3.5 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M6 18h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
			</svg>
		</span>
	);
}

function Status({ dark = false }: { dark?: boolean }) {
	return (
		<span className={`${styles.status} ${dark ? styles.statusDark : ''}`}>
			<CheckCircle2 size={14} /> Ready to review
		</span>
	);
}

function EditButton({ inverse = false }: { inverse?: boolean }) {
	return (
		<button type="button" className={`${styles.editButton} ${inverse ? styles.editButtonInverse : ''}`} aria-label="Edit section">
			<Pencil size={13} /> Edit
		</button>
	);
}

function PlatformPicker({ selected, onChange, compact = false }: { selected: Platform[]; onChange: (next: Platform[]) => void; compact?: boolean }) {
	const toggle = (platform: Platform) => {
		onChange(selected.includes(platform) ? selected.filter((item) => item !== platform) : [...selected, platform]);
	};
	return (
		<div className={`${styles.platformPicker} ${compact ? styles.platformPickerCompact : ''}`}>
			{(['Instagram', 'Facebook'] as Platform[]).map((platform) => {
				const active = selected.includes(platform);
				return (
					<button key={platform} type="button" aria-pressed={active} className={active ? styles.platformActive : ''} onClick={() => toggle(platform)}>
						<span className={styles.platformIcon}>{platform === 'Instagram' ? <Instagram size={15} /> : 'f'}</span>
						{platform}
						{active ? <Check size={14} /> : null}
					</button>
				);
			})}
			<button type="button" className={!selected.length ? styles.platformActive : ''} onClick={() => onChange([])}>
				<Sparkles size={14} /> Decide for me {!selected.length ? <Check size={14} /> : null}
			</button>
		</div>
	);
}

function PrimaryAction({ label = 'Continue with this profile' }: { label?: string }) {
	return (
		<button type="button" className={styles.primaryAction}>
			<span>{label}</span><ArrowRight size={17} />
		</button>
	);
}

function VariantA({ selected, onChange }: { selected: Platform[]; onChange: (next: Platform[]) => void }) {
	return (
		<section className={`${styles.frame} ${styles.focusFrame}`} aria-label="Focus canvas design">
			<header className={styles.focusHeader}>
				<div className={styles.titleGroup}>
					<MoilMark />
					<div><span className={styles.eyebrow}>Business profile</span><h1>Your strategy, distilled</h1></div>
				</div>
				<div className={styles.headerMeta}><Status /><button type="button" className={styles.iconButton} aria-label="About this preview"><HelpCircle size={17} /></button></div>
			</header>

			<div className={styles.focusBody}>
				<main className={styles.focusMain}>
					<div className={styles.sourceLine}><Globe2 size={14} /><span>budaedc.com</span><span className={styles.sourceDivider} />Analyzed moments ago</div>
					<section className={styles.brandIntro}>
						<div><p className={styles.kicker}>01 · Identity</p><h2>Buda Economic Development Corporation</h2><p className={styles.location}><MapPin size={14} /> Buda, Texas</p></div>
						<EditButton />
					</section>
					<section className={styles.overviewBlock}>
						<div className={styles.sectionHeader}><p>Overview</p><EditButton /></div>
						<p>One source of truth for Buda’s business community—connecting founders, resources, and local opportunity so companies can start, grow, and stay.</p>
					</section>
					<div className={styles.insightList}>
						{insights.map((insight, index) => (
							<section key={insight.label} className={styles.insightRow}>
								<span className={styles.rowNumber}>0{index + 2}</span>
								<div><p>{insight.label}</p><span>{insight.value}</span></div>
								<EditButton />
							</section>
						))}
					</div>
					<section className={styles.voiceLine}>
						<div><p>Brand voice</p><div className={styles.tagRow}>{voice.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
						<EditButton />
					</section>
				</main>

				<aside className={styles.actionRail}>
					<div><p className={styles.kicker}>02 · Publishing</p><h2>Choose where Moil should start</h2><p className={styles.muted}>You can connect or change channels after creating your account.</p></div>
					<PlatformPicker selected={selected} onChange={onChange} compact />
					<div className={styles.planSummary}>
						<div><Clock3 size={15} /><span>Cadence</span><strong>A few times a week</strong></div>
						<div><Zap size={15} /><span>First draft</span><strong>After sign-up</strong></div>
					</div>
					<div className={styles.railFooter}><PrimaryAction /><button type="button" className={styles.secondaryAction}><RotateCcw size={14} /> Try another business</button><small>No card required</small></div>
				</aside>
			</div>
		</section>
	);
}

function VariantB({ selected, onChange }: { selected: Platform[]; onChange: (next: Platform[]) => void }) {
	const nav = ['Executive summary', 'Audience', 'Positioning', 'Brand voice', 'Publishing'];
	return (
		<section className={`${styles.frame} ${styles.dossierFrame}`} aria-label="Research dossier design">
			<aside className={styles.dossierRail}>
				<div><MoilMark /><p className={styles.railEyebrow}>Moil intelligence</p><h1>Business brief</h1><Status dark /></div>
				<nav aria-label="Preview sections">
					{nav.map((item, index) => <button type="button" key={item} className={index === 0 ? styles.navActive : ''}><span>0{index + 1}</span>{item}{index === 0 ? <ChevronRight size={14} /> : null}</button>)}
				</nav>
				<div className={styles.railSource}><Globe2 size={15} /><div><span>Source</span><strong>budaedc.com</strong></div></div>
			</aside>

			<div className={styles.dossierMain}>
				<header className={styles.dossierHeader}><div><p>Prepared for</p><h2>Buda Economic Development Corporation</h2><span><MapPin size={13} /> Buda, Texas · Updated just now</span></div><EditButton /></header>
				<section className={styles.executiveSummary}>
					<div className={styles.summaryLabel}><Sparkles size={16} /><span>Executive summary</span></div>
					<p>One source of truth for Buda’s business community—connecting founders, resources, and local opportunity so companies can start, grow, and stay.</p>
				</section>
				<section className={styles.findingsGrid}>
					{insights.map((insight, index) => <article key={insight.label}><span>Finding 0{index + 1}</span><h3>{insight.label}</h3><p>{insight.value}</p></article>)}
				</section>
				<section className={styles.signalBand}>
					<div><span>Voice signals</span><p>{voice.join(' · ')}</p></div>
					<div><span>Recommended cadence</span><p>A few times a week</p></div>
					<div><span>Confidence</span><p><ShieldCheck size={15} /> High</p></div>
				</section>
				<footer className={styles.dossierFooter}>
					<div><p>Publishing destination</p><PlatformPicker selected={selected} onChange={onChange} /></div>
					<div className={styles.footerAction}><PrimaryAction label="Use this brief" /><button type="button" className={styles.textAction}>Try another business</button></div>
				</footer>
			</div>
		</section>
	);
}

function VariantC({ selected, onChange }: { selected: Platform[]; onChange: (next: Platform[]) => void }) {
	const [active, setActive] = useState(0);
	const steps = ['Your business', 'Your audience', 'Your edge', 'Publishing plan'];
	const cards = [
		{ eyebrow: 'Business identity', title: 'Buda Economic Development Corporation', body: 'One source of truth for Buda’s business community—connecting founders, resources, and local opportunity.', meta: 'Buda, Texas' },
		{ eyebrow: 'Primary audience', title: 'Local leaders and growing businesses', body: insights[0].value, meta: 'Audience signal' },
		{ eyebrow: 'Positioning', title: 'Local context becomes practical momentum', body: insights[2].value, meta: 'Core differentiator' },
		{ eyebrow: 'Publishing', title: 'Where should your first posts go?', body: 'Pick your channels now, or let Moil choose the best starting point.', meta: 'A few times a week' },
	];
	const card = cards[active];
	return (
		<section className={`${styles.frame} ${styles.reviewFrame}`} aria-label="Guided review design">
			<header className={styles.reviewHeader}><div className={styles.titleGroup}><MoilMark /><div><span className={styles.eyebrow}>Profile review</span><h1>Let’s make sure we understood you</h1></div></div><Status /></header>
			<div className={styles.reviewProgress}>
				{steps.map((step, index) => <button key={step} type="button" onClick={() => setActive(index)} className={index === active ? styles.stepActive : index < active ? styles.stepComplete : ''}><span>{index < active ? <Check size={13} /> : index + 1}</span><small>{step}</small></button>)}
			</div>
			<div className={styles.reviewBody}>
				<div className={styles.reviewContext}>
					<p><Sparkles size={14} /> Moil found this on <strong>budaedc.com</strong></p>
					<h2>{card.eyebrow}</h2>
					<p>Review the extracted insight. You can refine it now; nothing is saved until you continue.</p>
					<div className={styles.contextTrust}><ShieldCheck size={17} /><span><strong>Grounded in your website</strong><small>No generic profile text was added.</small></span></div>
				</div>
				<main className={styles.reviewCard}>
					<div className={styles.reviewCardTop}><span>{String(active + 1).padStart(2, '0')} / 04</span><EditButton /></div>
					<p className={styles.reviewKicker}>{card.meta}</p>
					<h3>{card.title}</h3>
					<p className={styles.reviewCopy}>{card.body}</p>
					{active === 2 ? <div className={styles.tagRow}>{voice.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
					{active === 3 ? <PlatformPicker selected={selected} onChange={onChange} /> : null}
					<div className={styles.reviewControls}>
						<button type="button" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}><ArrowLeft size={16} /> Back</button>
						{active < 3 ? <button type="button" className={styles.nextButton} onClick={() => setActive(active + 1)}>Looks right <ArrowRight size={16} /></button> : <PrimaryAction />}
					</div>
				</main>
			</div>
			<footer className={styles.reviewFooter}><span>Prefer to review later? Your preview stays available on this device.</span><button type="button">Try another business</button></footer>
		</section>
	);
}

function PrototypeSwitcher({ current, onVariant, state }: { current: VariantKey; onVariant: (key: VariantKey) => void; state: string }) {
	const currentIndex = VARIANTS.findIndex((variant) => variant.key === current);
	const cycle = (direction: number) => onVariant(VARIANTS[(currentIndex + direction + VARIANTS.length) % VARIANTS.length].key);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (target?.matches('input, textarea, [contenteditable="true"]')) return;
			if (event.key === 'ArrowLeft') cycle(-1);
			if (event.key === 'ArrowRight') cycle(1);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	return (
		<div className={styles.switcher} role="toolbar" aria-label="Prototype variants">
			<button type="button" onClick={() => cycle(-1)} aria-label="Previous variant"><ArrowLeft size={17} /></button>
			<div><strong>{current} · {VARIANTS[currentIndex].name}</strong><span>{state}</span></div>
			<button type="button" onClick={() => cycle(1)} aria-label="Next variant"><ArrowRight size={17} /></button>
		</div>
	);
}

export function PreviewDesignPrototype() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const raw = searchParams.get('variant')?.toUpperCase();
	const variant: VariantKey = raw === 'B' || raw === 'C' ? raw : 'A';
	const [selected, setSelected] = useState<Platform[]>([]);

	const state = useMemo(() => `Publish to: ${selected.length ? selected.join(' + ') : 'Moil decides'}`, [selected]);
	const onVariant = (next: VariantKey) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('variant', next);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<main className={styles.prototypePage}>
			<div className={styles.prototypeLabel}><span>Development prototype</span><p>Ready-state preview · use ← → to compare</p></div>
			{variant === 'A' ? <VariantA selected={selected} onChange={setSelected} /> : null}
			{variant === 'B' ? <VariantB selected={selected} onChange={setSelected} /> : null}
			{variant === 'C' ? <VariantC selected={selected} onChange={setSelected} /> : null}
			<PrototypeSwitcher current={variant} onVariant={onVariant} state={state} />
		</main>
	);
}
