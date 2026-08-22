'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductShot } from './components/ProductShot';
import { BilingualSlider } from './components/BilingualSlider';
import { JourneyVisual } from './components/JourneyVisual';
import { productShots } from './productShots';
import { businessReviews } from '../../src/common/data/reviews';
import { BusinessFaqSection } from './components/BusinessFaqSection';
import { BusinessFooter } from './components/BusinessFooter';
import { BusinessMobileMenu } from './components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from './components/BusinessNav';
import { BusinessPricingSection } from './components/BusinessPricingSection';
import { DemoVideoSection } from './components/DemoVideoSection';
import { useBusinessUi } from './hooks/useBusinessUi';
import { useLanguageContext } from '../../src/common/components/I18nProvider';
import { appendLangToUrl } from './utils/appendLangToUrl';
import { IconMap, testimonialImages } from './sections/iconMap';
import { HeroSection } from './sections/HeroSection';

export function BusinessPageContent() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { t, lang: currentLang, setLang } = useLanguageContext();
  const [, setShowLanguageModal] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLang(lang);
  };

  // Show customize modal on first visit (commented out)
  // useEffect(() => {
  //   const customizeModalShown = sessionStorage.getItem('customizeModalShown');
  //   if (!customizeModalShown) {
  //     setTimeout(() => setShowCustomizeModal(true), 500);
  //   }
  // }, []);

  // Translated data arrays
  const navItems: NavItem[] = [
    { label: t.business.nav.features, href: '#capabilities' },
    { label: t.business.nav.howItWorks, href: '#journey' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  const mobileItems: NavItem[] = [
    { label: t.common.whatIsMoil, href: '#demo' },
    { label: t.business.nav.features, href: '#capabilities' },
    { label: t.business.nav.howItWorks, href: '#journey' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  const tickerItems = [
    t.business.ticker.marketResearch,
    t.business.ticker.businessPlan,
    t.business.ticker.content360,
    t.business.ticker.aiImage,
    t.business.ticker.aiVideo,
    t.business.ticker.coach,
    t.business.ticker.documents,
    t.business.ticker.brandDna,
    t.business.ticker.bilingual,
    t.business.ticker.investorReady,
  ];


  const capabilityCards = [
    {
      icon: 'chart',
      title: t.business.capabilities.marketResearch.title,
      desc: t.business.capabilities.marketResearch.description,
      tags: [
        { label: t.business.capabilities.marketResearch.tag1, className: 'tag-o' },
        { label: t.business.capabilities.marketResearch.tag2, className: 'tag-b' },
        { label: t.business.capabilities.marketResearch.tag3, className: 'tag-g' },
      ],
    },
    {
      icon: 'clipboard',
      title: t.business.capabilities.businessPlan.title,
      desc: t.business.capabilities.businessPlan.description,
      tags: [
        { label: t.business.capabilities.businessPlan.tag1, className: 'tag-o' },
        { label: t.business.capabilities.businessPlan.tag2, className: 'tag-b' },
        { label: t.business.capabilities.businessPlan.tag3, className: 'tag-g' },
      ],
    },
    {
      icon: 'palette',
      title: t.business.capabilities.aiCreation.title,
      desc: t.business.capabilities.aiCreation.description,
      tags: [
        { label: t.business.capabilities.aiCreation.tag1, className: 'tag-o' },
        { label: t.business.capabilities.aiCreation.tag2, className: 'tag-b' },
        { label: t.business.capabilities.aiCreation.tag3, className: 'tag-g' },
      ],
    },
  ];

  const journeySteps = [
    { number: '01', time: t.business.journey.steps.step1.time, title: t.business.journey.steps.step1.title, desc: t.business.journey.steps.step1.desc },
    { number: '02', time: t.business.journey.steps.step2.time, title: t.business.journey.steps.step2.title, desc: t.business.journey.steps.step2.desc },
    { number: '03', time: t.business.journey.steps.step3.time, title: t.business.journey.steps.step3.title, desc: t.business.journey.steps.step3.desc },
    { number: '04', time: t.business.journey.steps.step4.time, title: t.business.journey.steps.step4.title, desc: t.business.journey.steps.step4.desc },
    // step5 was Smart Hiring. Hiring left the business surface entirely in Aug 2026;
    // /candidate is still live as its own product. See research/seo-aeo-audit-and-plan.md.
    { number: '05', time: t.business.journey.steps.step6.time, title: t.business.journey.steps.step6.title, desc: t.business.journey.steps.step6.desc },
  ];

  const stats: { label: string; target: number; prefix?: string; suffix?: string }[] = [
    { label: t.business.statsSection.stats.professional, target: 25, prefix: '$' },
    { label: t.business.statsSection.stats.marketPro, target: 75, prefix: '$' },
    { label: t.business.statsSection.stats.languages, target: 2 },
  ];

  const bilingualHighlights = [
    { icon: 'globe', title: t.business.bilingualSection.highlights.reach.title, desc: t.business.bilingualSection.highlights.reach.desc, badge: t.business.bilingualSection.highlights.reach.badge, badgeClass: 'badge-g' },
    { icon: 'mic', title: t.business.bilingualSection.highlights.voice.title, desc: t.business.bilingualSection.highlights.voice.desc, badge: t.business.bilingualSection.highlights.voice.badge, badgeClass: 'badge-o' },
    { icon: 'edit', title: t.business.bilingualSection.highlights.content.title, desc: t.business.bilingualSection.highlights.content.desc, badge: t.business.bilingualSection.highlights.content.badge, badgeClass: 'badge-p' },
  ];

  // Reviews come from src/common/data/reviews.ts — one array feeds both this row
  // and /reviews, so the two surfaces cannot disagree about what a customer said.
  const testimonials = businessReviews().map((review, i) => ({
    testimonialImage: testimonialImages[i % testimonialImages.length],
    testimonialName: review.name,
    testimonial: review.text,
    role: review.role?.[currentLang] ?? '',
    source: review.sourceLabel[currentLang],
  }));

  return (
      <div>
        <div className="cursor" id="cur"></div>
        <div className="cursor-ring" id="curR"></div>

        <BusinessMobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onToggleTheme={toggleTheme}
          theme={theme}
          items={mobileItems}
        />
        <BusinessNav
          scrolled={scrolled}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
          onToggleTheme={toggleTheme}
          theme={theme}
          items={navItems}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        setShowLanguageModal={setShowLanguageModal}
      />

      {/* HERO — extracted to sections/HeroSection.tsx (Tailwind + GSAP) */}
      <HeroSection />

      {/* DIRECT ANSWER — the self-contained paragraph an assistant can lift whole.
          This existed in the translation bundle but was never rendered; shipping it
          is the single highest-value AEO change on the page. Kept above the ticker
          so it lands inside the first screen of extractable text. */}
      <section id="what-is-moil" className="aeo-answer">
        <div className="aeo-answer__inner">
          <h2 className="aeo-answer__label">{t.business.aeoAnswer.label}</h2>
          <p className="aeo-answer__body">{t.business.aeoAnswer.body}</p>
          <p className="aeo-answer__stamp">{t.business.aeoAnswer.lastUpdated}</p>
        </div>
      </section>

      {/* WHAT IT MADE — breadth made concrete. "Does everything" reads as nothing;
          a list of real deliverables reads as everything. Sits directly under the
          answer block so the range is established before any feature copy. */}
      <section id="what-it-made" className="made">
        <div className="made__inner">
          <div className="section-tag rv" style={{ justifyContent: 'center' }}>{t.business.made.tag}</div>
          <h2 className="section-headline rv" style={{ textAlign: 'center' }}>
            {t.business.made.headline}{' '}
            <span style={{ color: 'var(--orange)' }}>{t.business.made.headlineHighlight}</span>
          </h2>
          <ul className="made__list rv d1">
            {t.business.made.items.map((item) => (
              <li key={item} className="made__item">{item}</li>
            ))}
          </ul>
          <p className="made__footnote rv d2">{t.business.made.footnote}</p>
        </div>
      </section>

      <div className="divider"></div>

      {/* TICKER */}
      <div className="capabilities-bar">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((item, index) => (
            <div className="ticker-item" key={`${item}-${index}`}>
              <span className="ti-dot">·</span> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* PRODUCT DEMO — scroll-triggered video showcase */}
      <DemoVideoSection copy={t.business.demoVideo} />

      <div className="divider"></div>

      {/* PROBLEM / VS — moved above IDENTITY: it's the page's strongest hook ($5K consultant vs $25 Moil) and was previously buried below an abstract section */}
      <section id="problem" className="has-footer-1">
        <div className="problem-inner">
          <div className="section-tag rv" style={{ justifyContent: 'center' }}>
            {t.business.problem.tag}
          </div>
          <h2 className="section-headline rv" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 12px' }}>
            {t.business.problem.headline}
            <br /><span style={{ color: 'var(--orange)' }}>{t.business.problem.headlineHighlight}</span>{t.business.problem.headlineEnd}
          </h2>
          <p
            className="rv"
            style={{
              textAlign: 'center',
              fontSize: '16px',
              color: 'var(--text2)',
              maxWidth: '580px',
              margin: '0 auto 60px',
              fontWeight: 300,
            }}
          >
            {t.business.problem.subheadline}
          </p>

          <div className="vs-grid-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', alignItems: 'stretch' }}>
            <div className="cost-card old wave-old rv" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="cost-badge old-b">{t.business.problem.oldMethod}</div>
              <div className="cost-title">{t.business.problem.oldTitle}</div>
              <div className="cost-price strike">{t.business.problem.oldPrice}</div>
              <div className="cost-period">{t.business.problem.oldPeriod}</div>
              <ul className="cost-list" style={{ flex: 1 }}>
                {t.business.problem.oldList.map((item, idx) => (
                  <li key={`old-list-${idx}`}>
                    <span className="x">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rv" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '0 8px' }}>
              <div style={{ width: '1px', flex: 1, background: 'linear-gradient(180deg,transparent,var(--border2),transparent)', minHeight: '60px' }}></div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))',
                  border: '1px solid var(--border2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--display)',
                  fontSize: '20px',
                  color: 'var(--orange)',
                  flexShrink: 0,
                }}
              >
                VS
              </div>
              <div style={{ width: '1px', flex: 1, background: 'linear-gradient(180deg,transparent,var(--border2),transparent)', minHeight: '60px' }}></div>
            </div>

            <div className="cost-card new wave-new rv d2" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="cost-badge new-b" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{IconMap.star} {t.business.problem.moilBadge}</div>
              <div className="cost-title">{t.business.problem.moilTitle}</div>
              <div className="cost-price moil-price">{t.business.problem.moilPrice}</div>
              <div className="cost-period">{t.business.problem.moilPeriod}</div>
              <ul className="cost-list" style={{ flex: 1 }}>
                {t.business.problem.moilList.map((item, idx) => (
                  <li key={`moil-list-${idx}`}>
                    <span className="ok">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '28px' }}>
                <a
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  href={appendLangToUrl("https://business.moilapp.com/register", currentLang)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.business.problem.moilCta}
                </a>
                <p
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '9px',
                    color: 'var(--text3)',
                    textAlign: 'center',
                    marginTop: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}>{IconMap.lock}</span> {t.business.problem.moilTrust}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* IDENTITY — demoted from above-the-fold to mid-page proof, since the VS pricing reveal is the stronger hook */}
      <section id="identity">
        <div className="identity-linear">
          <div className="identity-head">
            <div className="section-tag rv" style={{ justifyContent: 'center' }}>{t.business.identity.tag}</div>
            <h2 className="section-headline rv" style={{ textAlign: 'center' }}>
              {t.business.identity.headline}{' '}
              <span style={{ color: 'var(--orange)' }}>{t.business.identity.headlineHighlight1}</span>{' '}
              <span style={{ color: 'var(--purple-light)' }}>{t.business.identity.headlineHighlight2}</span>
            </h2>
            <p className="identity-quote rv" style={{ textAlign: 'center', maxWidth: '760px', margin: '24px auto 24px' }}>
              &ldquo;{t.business.identity.quote}
              <em>{t.business.identity.quoteEmphasis}</em>&rdquo;
            </p>
            <p className="rv" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>
              {t.business.identity.footnote}
            </p>
          </div>

          <div className="identity-shots rv d2">
            <ProductShot
              source={productShots.identityResearch}
              alt={`Moil — ${t.business.identity.cofounder.marketResearch}`}
              theme={theme}
              placeholderLabel="Market research"
            />
            <ProductShot
              source={productShots.identityPlan}
              alt={`Moil — ${t.business.identity.cofounder.businessPlan}`}
              theme={theme}
              placeholderLabel="Business plan"
            />
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* CAPABILITIES */}
      <section id="capabilities" className="has-footer-2 has-footer-blend">
        <div className="section-tag rv">{t.business.capabilities.tag}</div>
        <h2 className="section-headline rv">
          {t.business.capabilities.headline}
          <br />{t.business.capabilities.headlineEnd} <span style={{ color: 'var(--orange)' }}>{t.business.capabilities.headlineHighlight}</span>
        </h2>
        <p className="section-sub rv">{t.business.capabilities.subheadline}</p>

        <div className="cap-row-1">
          {capabilityCards.map((card, index) => (
            <div key={`cap-card-${index}`} className={`cap-card cap-card--wave cap-card--w${index + 1} rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`}>
              <div className="cap-card__body">
                <h3 className="cap-title">{card.title}</h3>
                <p className="cap-desc">{card.desc}</p>
                <div className="cap-tags">
                  {card.tags.map((tag, tagIdx) => (
                    <span key={`tag-${index}-${tagIdx}`} className={`tag ${tag.className}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cap-row-2">
          <div className="cap-card rv" style={{ background: 'linear-gradient(135deg,rgba(255,92,26,0.06),var(--purple-dim),var(--surface))', borderColor: 'rgba(255,92,26,0.22)' }}>
            <div className="featured-inner">
              <div>
                <span className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap.calendar}</span>
                <h3 className="cap-title">{t.business.capabilities.content360.title}</h3>
                <p className="cap-desc">
                  {t.business.capabilities.content360.description}
                </p>
                <div className="cap-tags" style={{ marginBottom: '20px' }}>
                  <span className="tag tag-o">{t.business.capabilities.content360.tag1}</span>
                  <span className="tag tag-p">{t.business.capabilities.content360.tag2}</span>
                  <span className="tag tag-b">{t.business.capabilities.content360.tag3}</span>
                  <span className="tag tag-g">{t.business.capabilities.content360.tag4}</span>
                </div>
              </div>
              <div>
                <ProductShot
                  source={productShots.content360}
                  alt={`Moil — ${t.business.capabilities.content360.title}`}
                  theme={theme}
                  placeholderLabel="Moil360 — content calendar"
                >
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', textAlign: 'center' }}>
                    {t.business.capabilities.content360.previewTitle}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px' }}>
                    {['01','02','03','04','05','06','07','08','09','10'].map((day, index) => (
                      <div className="cal-mini" key={day}>
                        <div className="cm-num">{day}</div>
                        <div className={`cm-type ${['cm-edu','cm-promo','cm-eng','cm-bts','cm-edu','cm-promo','cm-eng','cm-edu','cm-bts','cm-promo'][index]}`}>
                          {['Edu','Promo','Engage','BTS','Edu','Promo','Engage','Edu','BTS','Promo'][index]}
                        </div>
                        <div className="cm-img">
                          {['IMG','VID','IMG','IMG','IMG','VID','IMG','IMG','IMG','VID'][index]}
                          {(index === 1 || index === 5 || index === 9) && <div className="cm-vid">{IconMap.play}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--text3)', textAlign: 'center', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t.business.capabilities.content360.previewFootnote}
                  </p>
                </div>
                </ProductShot>
                <a className="btn-secondary btn-wave" style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }} href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
                  {t.business.capabilities.content360.exploreCta}
                </a>
              </div>
            </div>
          </div>

          <div className="cap-card cap-card--document rv d1">
            <div className="cap-card__body">
              <h3 className="cap-title">{t.business.capabilities.documents.title}</h3>
              <p className="cap-desc">
                {t.business.capabilities.documents.description}
              </p>
              <div className="cap-tags">
                <span className="tag tag-p">{t.business.capabilities.documents.tag1}</span>
                <span className="tag tag-o">{t.business.capabilities.documents.tag2}</span>
                <span className="tag tag-b">{t.business.capabilities.documents.tag3}</span>
                <span className="tag tag-g">{t.business.capabilities.documents.tag4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider divider-seamless"></div>

      {/* JOURNEY */}
      <section id="journey" className="has-head has-head-blend">
        <div className="journey-inner">
          <div className="section-tag rv">{t.business.journey.tag}</div>
          <h2 className="section-headline rv">
            {t.business.journey.headline}
            <br />
            <span style={{ color: 'var(--orange)' }}>{t.business.journey.headlineHighlight1}</span>{' '}
            <span style={{ color: 'var(--purple-light)' }}>{t.business.journey.headlineHighlight2}</span>
          </h2>
          <p className="section-sub rv">{t.business.journey.subheadline}</p>

          <div className="journey-inner-grid">
            <div className="journey-steps">
              {journeySteps.map((step, index) => {
                const delayClass = index === 1 || index === 2 ? 'd1' : index === 3 || index === 4 ? 'd2' : index === 5 ? 'd3' : '';
                return (
                <div key={`jstep-${index}`} className={`jstep rv ${delayClass}`}>
                  <div className="jnum">{step.number}</div>
                  <div className="jstep-body">
                    <div className="jstep-time">{step.time}</div>
                    <div className="jstep-title">{step.title}</div>
                    <p className="jstep-desc">{step.desc}</p>
                  </div>
                </div>
              );
              })}
            </div>

            <JourneyVisual
              startAlt={`Moil — ${t.business.journey.convoTitle}`}
              chatAlt={`Moil — ${t.business.journey.convoTitle}`}
              theme={theme}
            />
          </div>

          <div className="rv journey-cta">
            <div className="journey-arrow" aria-hidden="true">
              {/* Curly arrow that sweeps from under the second coach screen (upper
                  right) down to the CTA button, drawn on scroll via .rv.in. */}
              <svg className="ja-svg" viewBox="0 0 300 300" fill="none">
                <path
                  className="ja-path"
                  pathLength={1}
                  d="M288 20 C 205 6, 150 24, 150 78 C 150 108, 186 114, 180 84 C 175 60, 142 66, 128 102 C 106 156, 78 226, 48 286"
                  stroke="url(#jArrow)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className="ja-head"
                  pathLength={1}
                  d="M48 286 L 34 262 M48 286 L 72 274"
                  stroke="url(#jArrow)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="jArrow" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#FF5C1A" />
                    <stop offset="1" stopColor="#9D6EF8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <a className="btn-primary" href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
              {t.business.journey.journeyCta}
            </a>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t.business.journey.journeyCtaSub}
            </p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* STATS */}
      <div id="stats">
        <div className="stats-inner">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div className="section-tag rv" style={{ justifyContent: 'center' }}>
              {t.business.statsSection.tag}
            </div>
            <h2 className="section-headline rv" style={{ fontSize: 'clamp(32px,5vw,60px)' }}>
              {t.business.statsSection.headline}
            </h2>
          </div>
          <div className="stats-grid-inner">
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className={`stat-box rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''} ${index === 3 ? 'd3' : ''} ${index === 4 ? 'd4' : ''}`}>
                {/* Server-render the final value so crawlers without JS see the real number
                    (previously rendered as "0", indexing each stat as zero). The JS counter
                    in useBusinessUi will overwrite this with the animated count from 0. */}
                <div className="stat-val" data-target={stat.target} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                  {stat.prefix}{stat.target.toLocaleString()}{stat.suffix}
                </div>
                <div className="stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* BILINGUAL — linear layout: centered heading, full-width EN/ES slider, highlights below */}
      <section className="section-wrap">
        <div className="bilingual-linear">
          <div className="bilingual-head">
            <div className="section-tag rv" style={{ justifyContent: 'center' }}>{t.business.bilingualSection.tag}</div>
            <h2 className="section-headline rv" style={{ textAlign: 'center' }}>
              {t.business.bilingualSection.headline} <span style={{ color: 'var(--orange)' }}>{t.business.bilingualSection.headlineHighlight1}</span>
              <br />{t.business.bilingualSection.headlineMiddle} <span style={{ color: 'var(--purple-light)' }}>{t.business.bilingualSection.headlineHighlight2}</span>
            </h2>
            <p className="rv" style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, margin: '20px auto 0', maxWidth: '640px', fontWeight: 300, textAlign: 'center' }}>
              {t.business.bilingualSection.description}
            </p>
          </div>

          <div className="rv d2 bilingual-slider-slot">
            <BilingualSlider
              beforeSrc={theme === 'dark'
                ? 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1200/v1783980034/english_dark_j6vrg6.png'
                : 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1200/v1783980033/english_ligh_xd6o99.png'}
              afterSrc={theme === 'dark'
                ? 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1200/v1783980036/spanish_dark_edbhhv.png'
                : 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1200/v1783980038/spanish_ligh_uytrn5.png'}
              beforeAlt={`Moil — ${t.business.bilingualSection.enLabel}`}
              afterAlt={`Moil — ${t.business.bilingualSection.esLabel}`}
              beforeLabel="EN"
              afterLabel="ES"
              width={3020}
              height={1510}
              hint="EN ←→ ES"
            />
          </div>

          <div className="bilingual-highlights rv d1">
            {bilingualHighlights.map((item, idx) => (
              <div className="bilingual-card" key={`bilingual-${idx}`}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '40px', height: '40px', borderRadius: '10px', background: 'var(--purple-dim)', color: 'var(--purple)' }}>{IconMap[item.icon]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{item.desc}</div>
                </div>
                <span className={`cf-cap-badge ${item.badgeClass}`}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* TIERS — the split stated once, plainly. $25 makes things when asked;
          $75 also runs the month unasked. Every other pricing mention on the site
          is reconciled to this table. */}
      <section id="tiers" className="tiers">
        <div className="tiers__inner">
          <div className="section-tag rv" style={{ justifyContent: 'center' }}>{t.business.tiers.tag}</div>
          <h2 className="section-headline rv" style={{ textAlign: 'center' }}>
            {t.business.tiers.headline}{' '}
            <span style={{ color: 'var(--orange)' }}>{t.business.tiers.headlineHighlight}</span>
          </h2>
          <p className="section-sub rv" style={{ textAlign: 'center' }}>{t.business.tiers.subheadline}</p>

          <div className="tiers__table rv d1">
            <div className="tiers__row tiers__row--head">
              <span>{t.business.tiers.featureCol}</span>
              <span>
                <strong>{t.business.tiers.proName}</strong>
                <em>{t.business.tiers.proPrice} {t.business.tiers.proPeriod}</em>
                <small>{t.business.tiers.proLine}</small>
              </span>
              <span>
                <strong>{t.business.tiers.maxName}</strong>
                <em>{t.business.tiers.maxPrice} {t.business.tiers.maxPeriod}</em>
                <small>{t.business.tiers.maxLine}</small>
              </span>
            </div>
            {t.business.tiers.rows.map((row) => (
              <div className="tiers__row" key={row[0]}>
                <span>{row[0]}</span>
                <span data-label={t.business.tiers.proName}>{row[1]}</span>
                <span data-label={t.business.tiers.maxName}>{row[2]}</span>
              </div>
            ))}
          </div>
          <p className="tiers__note rv d2">{t.business.tiers.note}</p>
        </div>
      </section>

      <div className="divider"></div>

      <div className="has-footer-4 has-footer-blend"><BusinessPricingSection /></div>

      <div className="divider divider-seamless"></div>

      {/* TESTIMONIALS — renders only when sourced quotes exist, so the section
          disappears rather than showing placeholders if they are ever pulled.
          The quotes are transcribed verbatim and carry a dated source; do not edit
          them for length or positioning. See CLAUDE.md -> Testimonials. */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="has-head has-head-blend" style={{ textAlign: 'center' }}>
          <div className="section-tag rv" style={{ justifyContent: 'center' }}>
            {t.business.testimonials.tag}
          </div>
          <h2 className="section-headline rv">
            {t.business.testimonials.headline}
            <br />
            <span style={{ color: 'var(--orange)' }}>{t.business.testimonials.headlineHighlight}</span>
          </h2>
          {t.business.testimonials.originalNote && (
            <p className="testi-original-note rv">{t.business.testimonials.originalNote}</p>
          )}
          <div className="testi-marquee rv">
            <div className="testi-track">
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                <div className="testi-card2" key={`testimonial-${index}`}>
                  <div className="testi-card2__body">
                    <div className="t-stars">★★★★★</div>
                    <p className="testi-card2__text">{item.testimonial}</p>
                    <div className="t-author">
                      <Image
                        src={item.testimonialImage}
                        alt={item.testimonialName}
                        width={44}
                        height={44}
                        loading="lazy"
                        className="t-av-img"
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border2)' }}
                      />
                      <div>
                        <div className="t-name">{item.testimonialName}</div>
                        <div className="t-role">{item.role}</div>
                        <div className="t-source">{item.source}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <a className="testi-readall" href="/reviews">
            {t.business.testimonials.readAll} <span aria-hidden="true">→</span>
          </a>
        </section>
      )}

      <div className="divider"></div>

      <BusinessFaqSection />

      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} onLanguageChange={handleLanguageChange} currentLang={currentLang} />

      {/* Customize Modal (commented out) */}
      {/* <BusinessCustomizeModal isOpen={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} /> */}
      </div>
  );
}

// Default export wires this component for /es/business by re-import. The
// I18nProvider wrapper lives in the page.tsx routes (English at
// app/business/page.tsx, Spanish at app/es/business/page.tsx). Keeping
// the locale wiring out of this file means /es/business reuses the same
// tree without forking it.
