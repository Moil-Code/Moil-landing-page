'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguageContext } from '../../../../src/common/components/I18nProvider';
import { BusinessFooter } from '../components/BusinessFooter';
import { BusinessMobileMenu } from '../components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../components/BusinessNav';
import { useBusinessUi } from '../hooks/useBusinessUi';
import { businessBaseUrl } from '../../../../src/common/constants/baseUrl';
import { IconMap } from '../sections/iconMap';
import {
  claimVisible,
  countdownParts,
  crossedDepths,
  rememberAdParams,
  scarcityState,
  trialRegisterHref,
  type AdParams,
} from './trialFunnel';
import {
  CLAIMS_SIGNED_OFF,
  TRIAL_CONFIG,
  type TrialCopy,
} from './trialContent';
import { onceWhenPixelReady, trackTrialEvent } from './trialTracking';
import './trial.css';

/**
 * The Moil360 free-trial page, a /business sub-route built on the /business
 * design system (app/business/business.css): the same header, mobile menu and
 * footer as /business/pricing, the shader hero with its glass panel, numbered
 * section headers with rails, registry cards with accent icon tiles, the
 * journey step list, the dark CTA panel, the FAQ items and the #final block.
 * Page-only overrides live in trial.css under `.trial-page`.
 *
 * Language switching is the header's and footer's job: the pair is registered
 * in src/common/i18n/localeRoutes.ts, and they keep the query string (the ad's
 * UTMs and fbclid) when they move to the twin.
 */

// The /business/pricing light hero wash, flipped in CSS so its colour sits at
// the bottom; public/hero_bg.jpg is its dark-mode counterpart.
const WASH_LIGHT =
  'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1920/v1783442089/hero_bg_light_eeeazi.png';
const WASH_LIGHT_SM =
  'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_900/v1783442089/hero_bg_light_eeeazi.png';

type CtaLocation = 'hero' | 'solution' | 'offer' | 'final' | 'sticky';

// One icon per flagged feature row, from the icon set /business uses.
const FEATURE_ICONS: Record<string, string> = {
  imagesAutoPosting: 'palette',
  brandedContent: 'target',
  multiPlatformCaptions: 'message',
  trendResearch: 'chart',
  noPrompting: 'bot',
};

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function SectionHeader({
  index,
  total,
  tag,
  title,
  accent,
  sub,
  id,
}: {
  index: number;
  total: number;
  tag: string;
  title: string;
  accent?: string;
  sub?: string;
  id: string;
}) {
  return (
    <header className="business-section-header trial-section-header">
      <div className="business-section-header__rail rv" aria-hidden="true">
        <span>{pad(index)}</span>
        <i />
        <span>{pad(total)}</span>
      </div>
      <div>
        <div className="section-tag rv">{tag}</div>
        <h2 id={id} className="section-headline rv">
          {title}
          {accent && (
            <>
              {' '}
              <span className="business-accent-text">{accent}</span>
            </>
          )}
        </h2>
      </div>
      {sub ? <p className="section-sub rv d1">{sub}</p> : <span aria-hidden="true" />}
    </header>
  );
}

/** Splits "Posting every day is a second job." into a lead and an accented tail. */
function splitAccent(text: string, words: number): [string, string] {
  const parts = text.split(' ');
  if (parts.length <= words) return ['', text];
  return [parts.slice(0, -words).join(' '), parts.slice(-words).join(' ')];
}

// The page wraps this in its language's provider (EnglishI18nProvider on
// /business/free-trial, SpanishI18nProvider on /es/business/prueba-gratis),
// so each page ships one translation table.
export function TrialPage({ copy, serverNow }: { copy: TrialCopy; serverNow: number }) {
  return <TrialPageBody copy={copy} serverNow={serverNow} />;
}

function TrialPageBody({ copy, serverNow }: { copy: TrialCopy; serverNow: number }) {
  const lang = copy.lang;
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { t } = useLanguageContext();

  // The /business/pricing menu: back to the main page's sections, plus the blog.
  const navItems: NavItem[] = [
    { label: t.business.nav.features, href: '/business#capabilities' },
    { label: t.business.nav.howItWorks, href: '/business#journey' },
    { label: t.business.nav.pricing, href: '/business/pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];
  const mobileItems: NavItem[] = [{ label: t.common.whatIsMoil, href: '/business#identity' }, ...navItems];

  const [adParams, setAdParams] = useState<AdParams>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Server time at render, advanced by the client's elapsed time. The
  // countdown never reads the visitor's wall clock as the truth.
  const [nowMs, setNowMs] = useState(serverNow);
  const mountedAt = useRef<number | null>(null);
  const heroCtaRef = useRef<HTMLAnchorElement | null>(null);
  const offerCtaRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    try {
      setAdParams(rememberAdParams(window.sessionStorage, window.location.search));
    } catch {
      /* storage unavailable: links carry only lg */
    }
    try {
      setReviewMode(new URLSearchParams(window.location.search).get('review') === 'claims');
    } catch {
      /* ignore */
    }
  }, []);

  // The /business scroll reveal: `.rv` blocks fade up once, as they enter.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('.trial-page .rv'));
    if (!targets.length) return;
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reviewMode]);

  // ViewContent once per page load, whenever the consent-gated Pixel appears.
  useEffect(
    () => onceWhenPixelReady(() => trackTrialEvent('ViewContent', { content_name: 'moil360_free_trial', language: lang })),
    [lang],
  );

  // scroll_depth at 50% and 90%, once each.
  useEffect(() => {
    const sent = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? (window.scrollY + window.innerHeight) / doc.scrollHeight : 1;
      for (const pct of crossedDepths(fraction, sent)) {
        sent.add(pct);
        trackTrialEvent('scroll_depth', { percent: pct, language: lang });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lang]);

  // Sticky bar once the hero button has scrolled up out of view.
  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scarcity = scarcityState(TRIAL_CONFIG.scarcity, nowMs);
  const ticking = scarcity.kind === 'deadline';
  useEffect(() => {
    if (!ticking) return;
    if (mountedAt.current === null) mountedAt.current = Date.now();
    const id = setInterval(() => {
      setNowMs(serverNow + (Date.now() - (mountedAt.current ?? Date.now())));
    }, 1000);
    return () => clearInterval(id);
  }, [ticking, serverNow]);

  // The register page of THIS environment: businessBaseUrl is environment-owned
  // (employer-beta in staging, business.moilapp.com in production), and the
  // sync script keeps each repo's copy, so a sync never crosses them.
  const registerHref = useMemo(
    () => trialRegisterHref(`${businessBaseUrl}/register`, lang, adParams),
    [lang, adParams],
  );
  const closed = scarcity.kind === 'closed';

  const onCtaClick = useCallback(
    (location: CtaLocation) => () => {
      // Fire and let the link navigate. Never preventDefault, never await.
      trackTrialEvent('cta_click', { location, language: lang });
    },
    [lang],
  );

  /** The one primary action, in the /business orange pill (shimmer and arrow). */
  const cta = (location: CtaLocation, className = '', ref?: React.Ref<HTMLAnchorElement>) =>
    closed ? null : (
      <a
        ref={ref}
        href={registerHref}
        className={`trial-cta ${className}`}
        data-signup-cta={`free-trial-${location}`}
        onClick={onCtaClick(location)}
      >
        <span aria-hidden="true" className="trial-cta__shine" />
        <span className="trial-cta__label">
          {copy.cta}
          <span aria-hidden="true" className="trial-cta__arrow">
            {IconMap.arrowRight}
          </span>
        </span>
      </a>
    );

  const scarcityLine = (className: string) => {
    if (scarcity.kind === 'closed') return <p className={className}>{copy.scarcity.closed}</p>;
    if (scarcity.kind === 'deadline') {
      const date = new Intl.DateTimeFormat(lang === 'es' ? 'es-US' : 'en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: TRIAL_CONFIG.scarcity.timeZone,
      }).format(new Date(scarcity.endsAtMs));
      const p = countdownParts(scarcity.msLeft);
      const u = copy.scarcity.units;
      return (
        <p className={className}>
          {copy.scarcity.deadline.replace('{date}', date)}{' '}
          <span className="trial-countdown" aria-label={copy.scarcity.countdownLabel}>
            {p.days}
            {u.days} {pad(p.hours)}
            {u.hours} {pad(p.minutes)}
            {u.minutes} {pad(p.seconds)}
            {u.seconds}
          </span>
        </p>
      );
    }
    return <p className={className}>{copy.scarcity.trueUrgency}</p>;
  };

  const reviewBadge = <span className="trial-review-badge">{copy.review.badge}</span>;
  const features = copy.features.rows.filter((r) => claimVisible(r.claim, CLAIMS_SIGNED_OFF, reviewMode));
  const faqs = copy.faq.items.filter((f) => claimVisible(f.claim, CLAIMS_SIGNED_OFF, reviewMode));
  const unsigned = (claim?: string) => Boolean(claim) && CLAIMS_SIGNED_OFF[claim as string] !== true;
  // Numbered sections, as /business numbers its own: pain, solution, (features), steps, peek.
  const totalSections = features.length > 0 ? 5 : 4;
  let sectionNo = 0;
  const next = () => (sectionNo += 1);

  const onLockedDay = (day: number) => {
    trackTrialEvent('peek_day_click', { day, language: lang });
    const target = offerCtaRef.current;
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
  };

  const [painLead, painAccent] = splitAccent(copy.pain.h2, lang === 'es' ? 3 : 3);
  const [solutionLead, solutionAccent] = splitAccent(copy.solution.h2, lang === 'es' ? 3 : 3);
  const [h1Lead, h1Accent] = splitAccent(copy.hero.h1, 1);
  const [finalLead, finalAccent] = splitAccent(copy.final.h2, 1);

  return (
    <div className="trial-page">
      {/* 1. The /business header and mobile menu. Their buttons carry the
          same register link (lg, UTMs, fbclid) and stay in the same tab. */}
      <div className="cursor" id="cur" aria-hidden="true" />
      <div className="cursor-ring" id="curR" aria-hidden="true" />
      <BusinessMobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={mobileItems}
        ctaLabel={copy.cta}
        ctaHref={registerHref}
        ctaNewTab={false}
        currentLang={lang}
      />
      <BusinessNav
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        theme={theme}
        items={navItems}
        ctaHref={registerHref}
        ctaNewTab={false}
        currentLang={lang}
      />

      <main>
        {/* 2. Hero. Composition after the "Mindly" concept (Dribbble 26895790):
            a pastel wash with a faint grid, a centred headline and two pills,
            floating icon orbs, and three fanned cards cut by the bottom edge:
            Day 1, the month, Day 2. Every
            visual is an existing Moil asset; nothing here autoplays. */}
        <section className="trial-stage" aria-labelledby="trial-h1">
          <div className="trial-stage__art" aria-hidden="true">
            <img
              className="trial-stage__wash trial-stage__wash--light"
              src={WASH_LIGHT}
              srcSet={`${WASH_LIGHT_SM} 900w, ${WASH_LIGHT} 1920w`}
              sizes="100vw"
              alt=""
              decoding="async"
            />
            <img className="trial-stage__wash trial-stage__wash--dark" src="/hero_bg.jpg" alt="" decoding="async" loading="lazy" />
            <div className="trial-stage__grid" />
          </div>

          <span className="trial-orb trial-orb--left" aria-hidden="true">
            {IconMap.palette}
          </span>
          <span className="trial-orb trial-orb--right" aria-hidden="true">
            {IconMap.calendar}
          </span>

          <div className="trial-stage__copy">
            <p className="trial-stage__label">
              <span>{copy.hero.eyebrow}</span>
              <i aria-hidden="true" />
              <span className="trial-stage__label-offer">{copy.trust[0]}</span>
            </p>
            <h1 id="trial-h1">
              <span>{h1Lead}</span> <strong>{h1Accent}</strong>
            </h1>
            <p className="trial-stage__sub">{copy.hero.sub}</p>
            <div className="trial-stage__actions">
              {cta('hero', 'trial-cta--pill', heroCtaRef)}
              <a href="#trial-peek" className="trial-stage__secondary">
                {copy.tags.peek}
              </a>
            </div>
            <div className="trial-stage__terms">
              <p className="trial-stage__note">{copy.trialNote}</p>
              {scarcityLine('trial-stage__urgency')}
            </div>
          </div>

          <div className="trial-fan">
            {[copy.peek.examples[0], copy.peek.examples[1]].map((ex, i) => (
              <article key={ex.day} className={`trial-fan__card trial-fan__side trial-fan__side--${i === 0 ? 'left' : 'right'}`} aria-hidden="true">
                <div className="trial-peek__top">
                  <span>
                    {copy.phone.dayLabel} {pad(ex.day)}
                  </span>
                  <span className="trial-peek__label">{copy.peek.exampleLabel}</span>
                </div>
                <span className={`cm-type cm-${ex.tone} trial-peek__kind`}>{ex.kind}</span>
                <p className="trial-fan__headline">{ex.headline}</p>
                {ex.image ? (
                  <img className="trial-fan__image" src={ex.image} alt="" width={640} height={800} loading="lazy" decoding="async" />
                ) : (
                  <div className="trial-fan__image" />
                )}
              </article>
            ))}

            <div className="trial-fan__card trial-fan__center">
              <div className="trial-fan__hook">
                <span className="trial-fan__hook-mark" aria-hidden="true">
                  {IconMap.calendar}
                </span>
                <p>{copy.hero.hook}</p>
              </div>
              <div className="trial-phone" role="img" aria-label={`${copy.phone.title}: ${copy.peek.unlock}`}>
                <div className="trial-phone__bar" aria-hidden="true">
                  <strong>{copy.phone.title}</strong>
                  <span>30</span>
                </div>
                <div className="trial-phone__grid" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const ex = copy.peek.examples.find((e) => e.day === day);
                    return ex ? (
                      <div key={day} className="cal-mini trial-cal--open">
                        <div className="cm-num">{pad(day)}</div>
                        <div className={`cm-type cm-${ex.tone}`}>{ex.chip}</div>
                        <div className="cm-img" />
                      </div>
                    ) : (
                      <div key={day} className="cal-mini trial-cal--locked">
                        <div className="cm-num">{pad(day)}</div>
                        <span className="trial-cal__lock">{IconMap.lock}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Pain */}
        <section className="business-system-section trial-section" aria-labelledby="trial-pain">
          <div className="trial-shell">
            <SectionHeader
              id="trial-pain"
              index={next()}
              total={totalSections}
              tag={copy.tags.pain}
              title={painLead}
              accent={painAccent}
              sub={copy.pain.body}
            />
          </div>
        </section>

        <div className="divider" />

        {/* 4. Solution, right after the pain it answers. */}
        <section className="business-system-section trial-section trial-section--tint" aria-labelledby="trial-solution">
          <div className="trial-shell">
            <SectionHeader
              id="trial-solution"
              index={next()}
              total={totalSections}
              tag={copy.tags.solution}
              title={solutionLead}
              accent={solutionAccent}
              sub={copy.solution.body}
            />
            <div className="trial-solution__actions rv d1">
              {cta('solution')}
              <p className="trial-note">{copy.trialNote}</p>
            </div>
          </div>
        </section>

        {/* 5. What you get: every row is a flagged claim, hidden until signed off. */}
        {features.length > 0 && (
          <>
            <div className="divider" />
            <section className="business-system-section trial-section" aria-labelledby="trial-features">
              <div className="trial-shell">
                <SectionHeader id="trial-features" index={next()} total={totalSections} tag={copy.tags.features} title={copy.features.h2} />
                <ul className="trial-registry capability-registry">
                  {features.map((row, i) => (
                    <li key={row.title} className={`capability-registry__row trial-registry__row rv ${i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : ''}`}>
                      <span className="capability-registry__number">{pad(i + 1)}</span>
                      <span className="capability-registry__icon" aria-hidden="true">
                        {IconMap[FEATURE_ICONS[row.claim ?? ''] ?? 'star']}
                      </span>
                      <div className="capability-registry__copy">
                        <h3 className="cap-title">{row.title.replace(/\.$/, '')}</h3>
                        <p className="cap-desc">
                          {row.body}
                          {reviewMode && unsigned(row.claim) && reviewBadge}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        <div className="divider" />

        {/* 6. How it works, in the /business journey step list. */}
        <section className="business-system-section journey-v2 trial-section trial-section--surface" aria-labelledby="trial-how">
          <div className="trial-shell">
            <SectionHeader id="trial-how" index={next()} total={totalSections} tag={copy.tags.how} title={copy.how.h2} />
            <ol className="journey-steps trial-steps">
              {copy.how.steps.map((step, i) => (
                <li key={step.title} className={`jstep rv ${i === 1 ? 'd1' : i === 2 ? 'd2' : ''}`}>
                  <div className="jnum">{pad(i + 1)}</div>
                  <div className="jstep-body">
                    <div className="jstep-title">{step.title.replace(/\.$/, '')}</div>
                    <p className="jstep-desc">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="divider" />

        {/* 7. Peek inside: days 1 to 3 are labelled examples, 4 to 30 are
            placeholders. Nothing is blurred to imply hidden content. */}
        <section className="business-system-section trial-section" aria-labelledby="trial-peek">
          <div className="trial-shell">
            <SectionHeader
              id="trial-peek"
              index={next()}
              total={totalSections}
              tag={copy.tags.peek}
              title={copy.peek.h2}
              sub={copy.peek.unlock}
            />
            <ul className="trial-peek rv d1">
              {copy.peek.examples.map((ex) => (
                <li key={ex.day} className="trial-peek__example">
                  <div className="trial-peek__top">
                    <span>
                      {copy.phone.dayLabel} {pad(ex.day)}
                    </span>
                    <span className="trial-peek__label">{copy.peek.exampleLabel}</span>
                  </div>
                  <span className={`cm-type cm-${ex.tone} trial-peek__kind`}>{ex.kind}</span>
                  <p className="trial-peek__headline">{ex.headline}</p>
                </li>
              ))}
              {Array.from({ length: 27 }, (_, i) => i + 4).map((day) => (
                <li key={day}>
                  <button
                    type="button"
                    className="trial-peek__locked"
                    aria-label={copy.peek.lockedAria.replace('{n}', String(day))}
                    onClick={() => onLockedDay(day)}
                  >
                    <span>{pad(day)}</span>
                    <span className="trial-peek__lock" aria-hidden="true">
                      {IconMap.lock}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Proof block: hidden until a real customer quote has written
            permission and sign-off. Never filled with placeholders. */}

        {/* 8. Offer band, in the /business dark CTA panel. */}
        <section id="offer" className="business-system-section trial-section trial-offer" aria-labelledby="trial-offer">
          <div className="capabilities-v2__cta trial-offer__panel rv">
            <div className="capabilities-v2__cta-index" aria-hidden="true">
              <span>01</span>
              <i />
              <span>30</span>
            </div>
            <div className="capabilities-v2__cta-copy">
              <span>{copy.tags.offer}</span>
              <h2 id="trial-offer" className="trial-offer__title">
                {copy.offer.h2}
              </h2>
              <p>{copy.offer.body}</p>
              {scarcityLine('trial-offer__urgency')}
            </div>
            <div className="capabilities-v2__cta-actions">{cta('offer', 'trial-cta--panel', offerCtaRef)}</div>
          </div>
        </section>

        {/* 9. FAQ: the /business FAQ items; all open on desktop, accordion on mobile. */}
        <section id="faq" className="business-system-section faq-v2 trial-faq" aria-labelledby="trial-faq">
          <div className="section-tag rv">{copy.tags.faq}</div>
          <h2 id="trial-faq" className="section-headline rv">
            {copy.faq.h2}
          </h2>
          <div className="faq-list rv">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className={`faq-item ${open ? 'open' : ''}`}>
                  <h3 className="trial-faq__q">
                    <button
                      type="button"
                      className="faq-q"
                      aria-expanded={open}
                      aria-controls={`trial-faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      {item.q}
                      <span className="faq-icon" aria-hidden="true">
                        +
                      </span>
                    </button>
                  </h3>
                  <div className="faq-a" id={`trial-faq-${i}`}>
                    <div className="faq-a-inner">
                      {item.a}
                      {reviewMode && unsigned(item.claim) && reviewBadge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. Final call to action, the /business #final block. */}
        <section id="final" className="trial-final" aria-labelledby="trial-final">
          <div className="final-bg" />
          <div className="final-grid-lines" />
          <p className="final-tag rv">{copy.hero.eyebrow}</p>
          <h2 id="trial-final" className="final-headline rv">
            {finalLead} <span className="fl-p">{finalAccent}</span>
          </h2>
          <p className="final-sub rv">{copy.final.sub}</p>
          <div className="rv">{cta('final', 'trial-cta--final')}</div>
          <div className="final-trust rv">
            {copy.trust.map((item) => (
              <div className="ft-item" key={item}>
                <span className="gc">
                  <Check size={14} aria-hidden="true" />
                </span>{' '}
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 11. The /business footer (Terms, Privacy, contact and the rest). */}
      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} currentLang={lang} ctaHref={registerHref} ctaNewTab={false} />

      {/* Mobile sticky bar, once the hero button is out of view. */}
      {!closed && (
        <div className={`trial-sticky ${stickyVisible ? 'is-visible' : ''}`} aria-hidden={!stickyVisible}>
          <a
            href={registerHref}
            className="trial-cta trial-cta--sticky"
            data-signup-cta="free-trial-sticky"
            onClick={onCtaClick('sticky')}
            tabIndex={stickyVisible ? 0 : -1}
          >
            <span className="trial-cta__label">
              {copy.cta}
              <span aria-hidden="true" className="trial-cta__arrow">
                {IconMap.arrowRight}
              </span>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
