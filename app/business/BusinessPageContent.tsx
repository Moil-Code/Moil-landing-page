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
import { getRegisterUrl } from './preview/previewClient';
import { IconMap, testimonialImages } from './sections/iconMap';
import { HeroSection } from './sections/HeroSection';

const PRODUCT_GUIDE_LINKS = [
  {
    key: 'writePlan' as const,
    href: 'https://blog.moilapp.com/article/how-to-write-a-business-plan-small-business',
  },
  {
    key: 'compareGenerators' as const,
    href: 'https://blog.moilapp.com/article/best-ai-business-plan-generator-2025-compared',
  },
  {
    key: 'calendar' as const,
    href: 'https://blog.moilapp.com/article/30-day-social-media-content-calendar-small-business',
  },
  {
    // Plan 5.3: the one blog post within reach of page one (~position 32).
    // A link from the site's strongest page is the cheapest signal it can get.
    key: 'edcGrants' as const,
    href: 'https://blog.moilapp.com/article/free-capital-how-to-unlock-edc-grants-in-texas',
  },
];

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
    { label: 'Work', href: '/work' },
    { label: 'Partners', href: '/partners' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const mobileItems: NavItem[] = [
    { label: 'Business Plan', href: '/business' },
    { label: 'Moil360', href: '/business#pricing' },
    { label: 'Hiring', href: '/candidate' },
    { label: 'Work', href: '/work' },
    { label: 'Partners', href: '/partners' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
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
        { label: t.business.capabilities.marketResearch.tag1 },
        { label: t.business.capabilities.marketResearch.tag2 },
        { label: t.business.capabilities.marketResearch.tag3 },
      ],
    },
    {
      icon: 'clipboard',
      title: t.business.capabilities.businessPlan.title,
      desc: t.business.capabilities.businessPlan.description,
      tags: [
        { label: t.business.capabilities.businessPlan.tag1 },
        { label: t.business.capabilities.businessPlan.tag2 },
        { label: t.business.capabilities.businessPlan.tag3 },
      ],
    },
    {
      icon: 'palette',
      title: t.business.capabilities.aiCreation.title,
      desc: t.business.capabilities.aiCreation.description,
      tags: [
        { label: t.business.capabilities.aiCreation.tag1 },
        { label: t.business.capabilities.aiCreation.tag2 },
        { label: t.business.capabilities.aiCreation.tag3 },
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
    { icon: 'globe', title: t.business.bilingualSection.highlights.reach.title, desc: t.business.bilingualSection.highlights.reach.desc, badge: t.business.bilingualSection.highlights.reach.badge },
    { icon: 'mic', title: t.business.bilingualSection.highlights.voice.title, desc: t.business.bilingualSection.highlights.voice.desc, badge: t.business.bilingualSection.highlights.voice.badge },
    { icon: 'edit', title: t.business.bilingualSection.highlights.content.title, desc: t.business.bilingualSection.highlights.content.desc, badge: t.business.bilingualSection.highlights.content.badge },
  ];

  // Reviews come from src/common/data/reviews.ts — one array feeds both this row
  // and /reviews, so the two surfaces cannot disagree about what a customer said.
  const testimonials = businessReviews().map((review, i) => ({
    testimonialImage: testimonialImages[i % testimonialImages.length],
    testimonialName: review.name,
    testimonial: review.text,
    role: review.role?.[currentLang] ?? '',
    source: review.sourceLabel[currentLang],
    // Quotes stay verbatim English. On Spanish surfaces, label that — never rewrite.
    writtenInEnglishLabel:
      currentLang === 'es' ? t.business.testimonials.writtenInEnglish : '',
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
          <p className="aeo-answer__body" style={{ whiteSpace: 'pre-line' }}>{t.business.aeoAnswer.body}</p>
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
          <ul className={`made__list rv d1${currentLang === 'es' ? ' made__list--jobs' : ''}`}>
            {t.business.made.items.map((item) => {
              const split = currentLang === 'es' ? item.indexOf('. ') : -1;
              if (split > 0) {
                return (
                  <li key={item} className="made__item made__item--job">
                    <div>
                      <strong>{item.slice(0, split + 1)}</strong>
                      <p>{item.slice(split + 2)}</p>
                    </div>
                  </li>
                );
              }
              return <li key={item} className="made__item">{item}</li>;
            })}
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

      {/* IDENTITY — first-body proof. Traditional Consultants / $25 compare is
          demoted to sit with pricing: Market Pro $75 is the sell; $25 is a way in. */}
      <section id="identity" className="business-system-section identity-v2">
        <div className="identity-v2__shell">
          <header className="business-section-header identity-v2__header">
            <div className="business-section-header__rail rv" aria-hidden="true">
              <span>01</span><i /><span>04</span>
            </div>
            <div className="identity-v2__intro">
              <div className="section-tag rv">{t.business.identity.tag}</div>
              <h2 className="section-headline rv">
                {t.business.identity.headline}{' '}
                <span className="business-accent-text">{t.business.identity.headlineHighlight1}</span>{' '}
                <span>{t.business.identity.headlineHighlight2}</span>
              </h2>
            </div>
            <div className="identity-v2__manifesto rv d1">
              <span className="identity-v2__quote-mark" aria-hidden="true">“</span>
              <p className="identity-quote">
                {t.business.identity.quote} <em>{t.business.identity.quoteEmphasis}</em>
              </p>
              <p className="identity-v2__footnote">{t.business.identity.footnote}</p>
            </div>
          </header>

          <div className="identity-v2__workbench rv d2">
            <article className="identity-v2__shot">
              <div className="identity-v2__shot-label">
                <span>01</span>
                <strong>{t.business.identity.cofounder.marketResearch}</strong>
                <i aria-hidden="true" />
              </div>
              <ProductShot
                source={productShots.identityResearch}
                alt={`Moil — ${t.business.identity.cofounder.marketResearch}`}
                theme={theme}
                placeholderLabel="Market research"
              />
            </article>
            <article className="identity-v2__shot identity-v2__shot--offset">
              <div className="identity-v2__shot-label">
                <span>02</span>
                <strong>{t.business.identity.cofounder.businessPlan}</strong>
                <i aria-hidden="true" />
              </div>
              <ProductShot
                source={productShots.identityPlan}
                alt={`Moil — ${t.business.identity.cofounder.businessPlan}`}
                theme={theme}
                placeholderLabel="Business plan"
              />
            </article>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* CAPABILITIES */}
      <section id="capabilities" className="business-system-section capabilities-v2 has-footer-2 has-footer-blend">
        <header className="business-section-header capabilities-v2__header">
          <div className="business-section-header__rail rv" aria-hidden="true">
            <span>02</span><i /><span>04</span>
          </div>
          <div>
            <div className="section-tag rv">{t.business.capabilities.tag}</div>
            <h2 className="section-headline rv">
              {t.business.capabilities.headline}
              <br />{t.business.capabilities.headlineEnd} <span className="business-accent-text">{t.business.capabilities.headlineHighlight}</span>
            </h2>
          </div>
          <p className="section-sub rv d1">{t.business.capabilities.subheadline}</p>
        </header>

        <div className="capability-registry">
          <div className="capability-registry__index">
            {capabilityCards.map((card, index) => (
              <article key={`cap-card-${index}`} className={`capability-registry__row rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`}>
                <span className="capability-registry__number">0{index + 1}</span>
                <span className="capability-registry__icon" aria-hidden="true">{IconMap[card.icon]}</span>
                <div className="capability-registry__copy">
                  <h3 className="cap-title">{card.title}</h3>
                  <p className="cap-desc">{card.desc}</p>
                </div>
                <div className="cap-tags">
                  {card.tags.map((tag, tagIdx) => (
                    <span key={`tag-${index}-${tagIdx}`} className="tag">
                      {tag.label}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="capability-registry__feature-stack">
            <article className="capability-registry__feature rv d1">
              <div className="capability-registry__feature-copy">
                <div className="capability-registry__feature-topline">
                  <span>04</span>
                  <span className="capability-registry__icon" aria-hidden="true">{IconMap.calendar}</span>
                </div>
                <h3 className="cap-title">{t.business.capabilities.content360.title}</h3>
                <p className="cap-desc">{t.business.capabilities.content360.description}</p>
                <div className="cap-tags">
                  <span className="tag">{t.business.capabilities.content360.tag1}</span>
                  <span className="tag">{t.business.capabilities.content360.tag2}</span>
                  <span className="tag">{t.business.capabilities.content360.tag3}</span>
                  <span className="tag">{t.business.capabilities.content360.tag4}</span>
                </div>
              </div>
              <div className="capability-registry__feature-visual">
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
                <a className="capability-registry__cta" data-signup-cta="content360" href={appendLangToUrl(getRegisterUrl(), currentLang)} target="_blank" rel="noreferrer">
                  <span>{t.business.capabilities.content360.exploreCta}</span>
                  <span aria-hidden="true">{IconMap.arrowRight}</span>
                </a>
              </div>
            </article>

            <article className="capability-registry__document rv d2">
              <div className="capability-registry__document-topline">
                <span>05</span>
                <span className="capability-registry__icon" aria-hidden="true">{IconMap.document}</span>
              </div>
              <div className="capability-registry__document-copy">
                <h3 className="cap-title">{t.business.capabilities.documents.title}</h3>
                <p className="cap-desc">{t.business.capabilities.documents.description}</p>
              </div>
              <div className="cap-tags">
                <span className="tag">{t.business.capabilities.documents.tag1}</span>
                <span className="tag">{t.business.capabilities.documents.tag2}</span>
                <span className="tag">{t.business.capabilities.documents.tag3}</span>
                <span className="tag">{t.business.capabilities.documents.tag4}</span>
              </div>
            </article>
          </div>
        </div>

        <div className="capabilities-v2__cta rv d2">
          <div className="capabilities-v2__cta-index" aria-hidden="true">
            <span>01</span>
            <i />
            <span>05</span>
          </div>
          <div className="capabilities-v2__cta-copy">
            <span>{t.business.capabilities.ctaEyebrow}</span>
            <h3>{t.business.capabilities.ctaTitle}</h3>
            <p>{t.business.capabilities.ctaDescription}</p>
          </div>
          <div className="capabilities-v2__cta-actions">
            <a
              className="capabilities-v2__cta-primary"
              data-signup-cta="capabilities"
              href={appendLangToUrl(getRegisterUrl(), currentLang)}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t.business.capabilities.ctaPrimary}</span>
              <span aria-hidden="true">{IconMap.arrowRight}</span>
            </a>
            <a className="capabilities-v2__cta-secondary" href="#journey">
              {t.business.capabilities.ctaSecondary}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <div className="divider divider-seamless"></div>

      {/* JOURNEY */}
      <section id="journey" className="business-system-section journey-v2 has-head has-head-blend">
        <div className="journey-inner">
          <header className="business-section-header journey-v2__header">
            <div className="business-section-header__rail rv" aria-hidden="true">
              <span>03</span><i /><span>04</span>
            </div>
            <div>
              <div className="section-tag rv">{t.business.journey.tag}</div>
              <h2 className="section-headline rv">
                {t.business.journey.headline}
                <br />
                <span className="business-accent-text">{t.business.journey.headlineHighlight1}</span>{' '}
                <span>{t.business.journey.headlineHighlight2}</span>
              </h2>
            </div>
            <p className="section-sub rv d1">{t.business.journey.subheadline}</p>
          </header>

          <div className="journey-v2__progress" aria-hidden="true">
            {journeySteps.map((step) => (
              <div key={`journey-progress-${step.number}`}>
                <span>{step.number}</span>
                <i />
                <strong>{step.time}</strong>
              </div>
            ))}
          </div>

          <div className="journey-v2__workspace">
            <div className="journey-inner-grid">
              <ol className="journey-steps">
                {journeySteps.map((step, index) => {
                  const delayClass = index === 1 || index === 2 ? 'd1' : index === 3 || index === 4 ? 'd2' : index === 5 ? 'd3' : '';
                  return (
                    <li key={`jstep-${index}`} className={`jstep rv ${delayClass}`}>
                      <div className="jnum">{step.number}</div>
                      <div className="jstep-body">
                        <div className="jstep-time">{step.time}</div>
                        <div className="jstep-title">{step.title}</div>
                        <p className="jstep-desc">{step.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <aside className="journey-v2__visual rv d2">
                <div className="journey-v2__visual-bar">
                  <span><i aria-hidden="true" />{t.business.journey.convoTitle}</span>
                  <strong>{t.business.journey.convoActive}</strong>
                </div>
                <JourneyVisual
                  startAlt={`Moil — ${t.business.journey.convoTitle}`}
                  chatAlt={`Moil — ${t.business.journey.convoTitle}`}
                  theme={theme}
                />
              </aside>
            </div>

            <div className="rv journey-cta">
              <p>{t.business.journey.journeyCtaSub}</p>
              <a className="journey-v2__cta" href={appendLangToUrl(getRegisterUrl(), currentLang)} target="_blank" rel="noreferrer" data-signup-cta="journey">
                <span>{t.business.journey.journeyCta}</span>
                <span aria-hidden="true">{IconMap.arrowRight}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* PRICING AT A GLANCE */}
      <div id="stats" className="pricing-glance">
        <div className="stats-inner pricing-glance__inner">
          <header className="pricing-glance__intro">
            <div className="section-tag rv">
              {t.business.statsSection.tag}
            </div>
            <h2 className="section-headline rv">
              {t.business.statsSection.headline}
            </h2>
            <a className="pricing-glance__link rv" href="#pricing">
              {t.business.pricing.seeDetailed}
              <span aria-hidden="true">↘</span>
            </a>
          </header>
          <div className="stats-grid-inner pricing-glance__metrics">
            {stats.map((stat, index) => (
              <article key={`stat-${index}`} className={`stat-box pricing-glance__metric rv ${index === 1 ? 'is-featured d1' : ''} ${index === 2 ? 'd2' : ''}`}>
                <div className="pricing-glance__metric-top">
                  <span>0{index + 1}</span>
                  <i aria-hidden="true" />
                </div>
                {/* Server-render the final value so crawlers without JS see the real number
                    (previously rendered as "0", indexing each stat as zero). The JS counter
                    in useBusinessUi will overwrite this with the animated count from 0. */}
                <div className="stat-val" data-target={stat.target} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                  {stat.prefix}{stat.target.toLocaleString()}{stat.suffix}
                </div>
                <div className="stat-lbl">{stat.label}</div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* BILINGUAL — an EN/ES comparison lab framed by proof, not a generic card row. */}
      <section id="bilingual" className="section-wrap business-system-section bilingual-v2">
        <div className="bilingual-v2__shell">
          <header className="business-section-header bilingual-v2__header">
            <div className="business-section-header__rail rv" aria-hidden="true">
              <span>04</span><i /><span>04</span>
            </div>
            <div>
              <div className="section-tag rv">{t.business.bilingualSection.tag}</div>
              <h2 className="section-headline rv">
                {t.business.bilingualSection.headline} <span className="business-accent-text">{t.business.bilingualSection.headlineHighlight1}</span>
                <br />{t.business.bilingualSection.headlineMiddle} <span>{t.business.bilingualSection.headlineHighlight2}</span>
              </h2>
            </div>
            <div className="bilingual-v2__summary rv d1">
              <p>{t.business.bilingualSection.description}</p>
              <div className="bilingual-v2__language-lockup" aria-hidden="true">
                <span>EN</span><i>↔</i><span>ES</span>
              </div>
            </div>
          </header>

          <div className="bilingual-v2__lab">
            <div className="bilingual-v2__lab-rail" aria-hidden="true">
              <span>EN</span><i /><span>ES</span>
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
                width={600}
                height={450}
                hint="EN ←→ ES"
              />
            </div>
          </div>

          <div className="bilingual-highlights rv d1">
            {bilingualHighlights.map((item, idx) => (
              <article className="bilingual-card" key={`bilingual-${idx}`}>
                <div className="bilingual-card__topline">
                  <span>0{idx + 1}</span>
                  <span className="bilingual-card__icon" aria-hidden="true">{IconMap[item.icon]}</span>
                </div>
                <div className="bilingual-card__copy">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <span className="bilingual-card__badge">{item.badge}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* PROBLEM / VS — demoted out of the first body. Market Pro $75 is the
          sell; Professional $25 is a way in, stated later with pricing. */}
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
                  href={appendLangToUrl(getRegisterUrl(), currentLang)}
                  target="_blank"
                  rel="noreferrer"
                  data-signup-cta="problem"
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
                    <p className="testi-card2__text" {...(item.writtenInEnglishLabel ? { lang: 'en' } : {})}>{item.testimonial}</p>
                    {item.writtenInEnglishLabel && (
                      <p className="t-lang">{item.writtenInEnglishLabel}</p>
                    )}
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

      {/* GUIDES — one sentence + three text links to the A-money product posts.
          Footer-adjacent so /business stays a product page, not a blog dump. */}
      <section id="guides" className="guides">
        <div className="guides__inner">
          <p className="guides__sentence">{t.business.guides.sentence}</p>
          <ul className="guides__links">
            {PRODUCT_GUIDE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {t.business.guides[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
