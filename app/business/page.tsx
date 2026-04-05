'use client';

import { useState, useEffect, JSX } from 'react';
import { BusinessFaqSection } from './components/BusinessFaqSection';
import { BusinessFinalCta } from './components/BusinessFinalCta';
import { BusinessFooter } from './components/BusinessFooter';
import { BusinessMobileMenu } from './components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from './components/BusinessNav';
import { BusinessPricingSection } from './components/BusinessPricingSection';
import { useBusinessUi } from './hooks/useBusinessUi';
import { BusinessCustomizeModal } from './components/BusinessCustomizeModal';
import { I18nProvider, useLanguageContext } from '../../src/common/components/I18nProvider';
import { appendLangToUrl } from './utils/appendLangToUrl';
import {
  BarChart3,
  ClipboardList,
  Calendar,
  Target,
  MessageSquare,
  Palette,
  Globe,
  Mic,
  Edit3,
  Rocket,
  Star,
  Bot,
  FileText,
  Play,
  Lock,
  ArrowRight,
} from 'lucide-react';

const IconMap: Record<string, JSX.Element> = {
  chart: <BarChart3 size={24} />,
  clipboard: <ClipboardList size={24} />,
  calendar: <Calendar size={24} />,
  target: <Target size={24} />,
  message: <MessageSquare size={24} />,
  palette: <Palette size={24} />,
  globe: <Globe size={24} />,
  mic: <Mic size={24} />,
  edit: <Edit3 size={24} />,
  rocket: <Rocket size={24} />,
  star: <Star size={24} fill="currentColor" />,
  bot: <Bot size={24} />,
  document: <FileText size={24} />,
  play: <Play size={24} fill="currentColor" />,
  lock: <Lock size={16} />,
  arrowRight: <ArrowRight size={16} />,
};

const testimonialImages = [
  "https://res.cloudinary.com/drlcisipo/image/upload/v1721818529/Website%20images/Luis_Vives_pleeyc.jpg",
  "https://res.cloudinary.com/drlcisipo/image/upload/v1721818532/Website%20images/Liliana_Cervantes_g2gb0v.jpg",
  "https://res.cloudinary.com/drlcisipo/image/upload/v1721818530/Website%20images/Miguel_Bustos_aktvri.jpg",
];

function BusinessPageContent() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { t, lang: currentLang, setLang } = useLanguageContext();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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
    { label: t.business.nav.hiring, href: '#hiring' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  const mobileItems: NavItem[] = [
    { label: t.common.whatIsMoil, href: '#identity' },
    { label: t.business.nav.features, href: '#capabilities' },
    { label: t.business.nav.howItWorks, href: '#journey' },
    { label: t.common.smartHiring, href: '#hiring' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
    { label: t.common.switchToCandidate, href: '/candidate' },
  ];

  const tickerItems = [
    t.business.ticker.marketResearch,
    t.business.ticker.businessPlan,
    t.business.ticker.content360,
    t.business.ticker.aiImage,
    t.business.ticker.aiVideo,
    t.business.ticker.smartHiring,
    t.business.ticker.candidateMatch,
    t.business.ticker.coach,
    t.business.ticker.documents,
    t.business.ticker.brandDna,
    t.business.ticker.bilingual,
    t.business.ticker.investorReady,
  ];

  const cofounderCapabilities = [
    { icon: 'chart', title: t.business.identity.cofounder.marketResearch, sub: t.business.identity.cofounder.marketResearchSub, badge: t.business.identity.cofounder.marketResearchBadge, badgeClass: 'badge-o' },
    { icon: 'clipboard', title: t.business.identity.cofounder.businessPlan, sub: t.business.identity.cofounder.businessPlanSub, badge: t.business.identity.cofounder.businessPlanBadge, badgeClass: 'badge-p' },
    { icon: 'calendar', title: t.business.identity.cofounder.content360, sub: t.business.identity.cofounder.content360Sub, badge: t.business.identity.cofounder.content360Badge, badgeClass: 'badge-o' },
    { icon: 'target', title: t.business.identity.cofounder.smartHiring, sub: t.business.identity.cofounder.smartHiringSub, badge: t.business.identity.cofounder.smartHiringBadge, badgeClass: 'badge-g' },
    { icon: 'message', title: t.business.identity.cofounder.coach, sub: t.business.identity.cofounder.coachSub, badge: t.business.identity.cofounder.coachBadge, badgeClass: 'badge-p' },
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
    { number: '05', time: t.business.journey.steps.step5.time, title: t.business.journey.steps.step5.title, desc: t.business.journey.steps.step5.desc },
    { number: '06', time: t.business.journey.steps.step6.time, title: t.business.journey.steps.step6.title, desc: t.business.journey.steps.step6.desc },
  ];

  const hiringSteps = [
    { num: '1', title: t.business.hiring.steps.step1.title, desc: t.business.hiring.steps.step1.desc },
    { num: '2', title: t.business.hiring.steps.step2.title, desc: t.business.hiring.steps.step2.desc },
    { num: '3', title: t.business.hiring.steps.step3.title, desc: t.business.hiring.steps.step3.desc },
    { num: '4', title: t.business.hiring.steps.step4.title, desc: t.business.hiring.steps.step4.desc },
  ];

  const hiringStats = [
    { label: t.business.hiring.stats.fasterThanIndeed, target: 2, suffix: ' Min' },
    { label: t.business.hiring.stats.interviewSuccess, target: 10, suffix: '+' },
    { label: t.business.hiring.stats.avgDaysToHire, target: 11 },
    { label: t.business.hiring.stats.avgCostPerHire, target: 850, prefix: '$' },
    { label: t.business.hiring.stats.retention90, target: 2400, prefix: '$' },
    { label: t.business.hiring.stats.bilingualReach, target: 58, suffix: '%' },
  ];

  const candidates = [
    { initial: 'J', name: 'Jose M.', detail: t.business.hiring.candidate1Detail, score: '95%', scoreColor: 'var(--green)', badgeGradient: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))', badgeColor: 'var(--orange)' },
    { initial: 'M', name: 'Marcus T.', detail: t.business.hiring.candidate2Detail, score: '87%', scoreColor: 'var(--orange)', badgeGradient: 'linear-gradient(135deg,var(--purple-dim),var(--blue-dim))', badgeColor: 'var(--purple-light)' },
    { initial: 'A', name: 'Ana R.', detail: t.business.hiring.candidate3Detail, score: '82%', scoreColor: 'var(--purple-light)', badgeGradient: 'linear-gradient(135deg,var(--green-dim),var(--orange-dim))', badgeColor: 'var(--green)' },
  ];

  const stats = [
    { label: t.business.statsSection.stats.businessesTrusting, target: 500, suffix: '+' },
    { label: t.business.statsSection.stats.jobsPostedMonthly, target: 5000, suffix: '+' },
    { label: t.business.statsSection.stats.interviewSuccessRate, target: 2, suffix: ' Min' },
    { label: t.business.statsSection.stats.avgCostPerHire, target: 850, prefix: '$' },
    { label: t.business.statsSection.stats.retention90, target: 11 },
    { label: t.business.statsSection.stats.startingPrice, target: 15, prefix: '$' },
  ];

  const comparisonRows = t.business.compare.rows;

  const bilingualHighlights = [
    { icon: 'globe', title: t.business.bilingualSection.highlights.reach.title, desc: t.business.bilingualSection.highlights.reach.desc, badge: t.business.bilingualSection.highlights.reach.badge, badgeClass: 'badge-g' },
    { icon: 'mic', title: t.business.bilingualSection.highlights.voice.title, desc: t.business.bilingualSection.highlights.voice.desc, badge: t.business.bilingualSection.highlights.voice.badge, badgeClass: 'badge-o' },
    { icon: 'edit', title: t.business.bilingualSection.highlights.content.title, desc: t.business.bilingualSection.highlights.content.desc, badge: t.business.bilingualSection.highlights.content.badge, badgeClass: 'badge-p' },
  ];

  const testimonials = t.business.testimonials.items.map((item, i) => ({
    testimonialImage: testimonialImages[i],
    testimonialName: item.name,
    testimonial: item.text,
    role: item.role,
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

      {/* HERO */}
      <section id="hero">
        <div className="hero-grid"></div>
        <div className="hero-orb orb1"></div>
        <div className="hero-orb orb2"></div>
        <div className="hero-orb orb3"></div>

        <div className="hero-eyebrow">
          <span className="eyebrow-pulse"></span>
          <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px' }}>{IconMap.rocket}</span> {t.business.hero.eyebrow}
        </div>

        <h1 className="hero-headline">
          {t.business.hero.headline} <span className="hl-o">{t.business.hero.headlineHighlight1}</span>
          <br />
          {t.business.hero.headlineMiddle}
          <br />
          <span className="hl-p">{t.business.hero.headlineHighlight2}</span>
        </h1>

        <p className="hero-sub">
          {t.business.hero.subheadline}
        </p>

        <div className="hero-ctas">
          <a className="btn-primary" href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px' }}>{IconMap.rocket}</span> {t.business.hero.cta} <span>→</span>
          </a>
          <a className="btn-secondary" href="https://www.youtube.com/@MoilApp" target="_blank" rel="noreferrer">
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px' }}>{IconMap.play}</span> {t.business.hero.ctaSecondary}
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-pill">
            <span className="dot dot-g"></span> {t.business.hero.trust500}
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> {t.business.hero.trust5000}
          </div>
          <div className="trust-pill">
            <span className="dot dot-p"></span> {t.business.hero.trust94}
          </div>
          <div className="trust-pill">
            <span className="dot dot-g"></span> {t.business.hero.trustBilingual}
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> {t.business.hero.trustPrice}
          </div>
        </div>
      </section>

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

      {/* IDENTITY */}
      <section id="identity">
        <div className="identity-grid">
          <div>
            <div className="section-tag rv">{t.business.identity.tag}</div>
            <h2 className="section-headline rv">
              {t.business.identity.headline}
              <br />You&apos;ll <span style={{ color: 'var(--orange)' }}>{t.business.identity.headlineHighlight1}</span>
              <br />
              <span style={{ color: 'var(--purple-light)' }}>{t.business.identity.headlineHighlight2}</span>
            </h2>
            <p className="identity-quote rv">
              &ldquo;{t.business.identity.quote}
              <em>{t.business.identity.quoteEmphasis}</em>&rdquo;
            </p>
            <p className="identity-body rv">
              {t.business.identity.description}
            </p>
            <p className="rv" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {t.business.identity.footnote}
            </p>
          </div>
          <div className="rv d2">
            <div className="cofounder-card">
              <div className="cf-header">
                <div className="cf-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap.bot}</div>
                <div>
                  <div className="cf-title">{t.business.identity.cardTitle}</div>
                  <div className="cf-sub">{t.business.identity.cardSub}</div>
                </div>
              </div>
              <div className="cf-capabilities">
                {cofounderCapabilities.map((cap, idx) => (
                  <div className="cf-cap" key={`cf-cap-${idx}`}>
                    <span className="cf-cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap[cap.icon]}</span>
                    <div className="cf-cap-text">
                      <div className="cf-cap-title">{cap.title}</div>
                      <div className="cf-cap-sub">{cap.sub}</div>
                    </div>
                    <span className={`cf-cap-badge ${cap.badgeClass}`}>{cap.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* PROBLEM / VS */}
      <section id="problem">
        <div className="problem-inner">
          <div className="section-tag rv" style={{ justifyContent: 'center' }}>
            {t.business.problem.tag}
          </div>
          <h2 className="section-headline rv" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 12px' }}>
            {t.business.problem.headline}
            <br />Prices for <span style={{ color: 'var(--orange)' }}>{t.business.problem.headlineHighlight}</span> {t.business.problem.headlineEnd}
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
            <div className="cost-card old rv" style={{ display: 'flex', flexDirection: 'column' }}>
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

            <div className="cost-card new rv d2" style={{ display: 'flex', flexDirection: 'column' }}>
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

      {/* CAPABILITIES */}
      <section id="capabilities">
        <div className="section-tag rv">{t.business.capabilities.tag}</div>
        <h2 className="section-headline rv">
          {t.business.capabilities.headline}
          <br />{t.business.capabilities.headlineEnd} <span style={{ color: 'var(--orange)' }}>{t.business.capabilities.headlineHighlight}</span>
        </h2>
        <p className="section-sub rv">{t.business.capabilities.subheadline}</p>

        <div className="cap-row-1">
          {capabilityCards.map((card, index) => (
            <div key={`cap-card-${index}`} className={`cap-card rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`}>
              <span className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap[card.icon]}</span>
              <div className="cap-title">{card.title}</div>
              <p className="cap-desc">{card.desc}</p>
              <div className="cap-tags">
                {card.tags.map((tag, tagIdx) => (
                  <span key={`tag-${index}-${tagIdx}`} className={`tag ${tag.className}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="cap-row-2">
          <div className="cap-card rv" style={{ background: 'linear-gradient(135deg,rgba(255,92,26,0.06),var(--purple-dim),var(--surface))', borderColor: 'rgba(255,92,26,0.22)' }}>
            <div className="featured-inner">
              <div>
                <span className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap.calendar}</span>
                <div className="cap-title">{t.business.capabilities.content360.title}</div>
                <p className="cap-desc">
                  {t.business.capabilities.content360.description}
                </p>
                <div className="cap-tags" style={{ marginBottom: '20px' }}>
                  <span className="tag tag-o">{t.business.capabilities.content360.tag1}</span>
                  <span className="tag tag-p">{t.business.capabilities.content360.tag2}</span>
                  <span className="tag tag-b">{t.business.capabilities.content360.tag3}</span>
                  <span className="tag tag-g">{t.business.capabilities.content360.tag4}</span>
                </div>
                <a className="btn-secondary" style={{ fontSize: '13px', padding: '10px 22px' }} href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
                  {t.business.capabilities.content360.exploreCta}
                </a>
              </div>
              <div>
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
              </div>
            </div>
          </div>

          <div className="cap-card rv d1" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconMap.document}</span>
            <div className="cap-title">{t.business.capabilities.documents.title}</div>
            <p className="cap-desc" style={{ flex: 1 }}>
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
      </section>

      <div className="divider"></div>

      {/* JOURNEY */}
      <section id="journey">
        <div className="journey-inner">
          <div className="section-tag rv">{t.business.journey.tag}</div>
          <h2 className="section-headline rv">
            {t.business.journey.headline}
            <br />
            <span style={{ color: 'var(--orange)' }}>{t.business.journey.headlineHighlight1}</span>
            <br />
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

            <div className="ai-convo rv d2">
              <div className="convo-header">
                <div className="convo-dots">
                  <div className="convo-dot" style={{ background: '#FF5F56' }}></div>
                  <div className="convo-dot" style={{ background: '#FFBD2E' }}></div>
                  <div className="convo-dot" style={{ background: '#27C93F' }}></div>
                </div>
                <span className="convo-title">{t.business.journey.convoTitle}</span>
                <div className="convo-status">
                  <div className="convo-blink"></div> {t.business.journey.convoActive}
                </div>
              </div>
              <div className="convo-body">
                <div className="msg msg-user" style={{ animationDelay: '0.2s' }}>
                  <div className="msg-bubble">
                    {t.business.journey.convoUser1}
                  </div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: '0.8s' }}>
                  <div className="msg-ai-label"><span style={{ display: 'inline-flex', marginRight: '4px', color: 'var(--orange)' }}>{IconMap.bot}</span> {t.business.journey.convoTitle}</div>
                  <div className="msg-bubble">
                    {t.business.journey.convoAi1}
                  </div>
                  <div className="msg-result">
                    <div className="mr-title">{t.business.journey.convoResult1Title}</div>
                    <div className="mr-items">
                      {t.business.journey.convoResult1Items.map((item, idx) => (
                        <div className="mr-item" key={`convo1-${idx}`}>
                          <span className="mr-dot"></span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="msg msg-user" style={{ animationDelay: '1.6s' }}>
                  <div className="msg-bubble">{t.business.journey.convoUser2}</div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: '2.4s' }}>
                  <div className="msg-ai-label"><span style={{ display: 'inline-flex', marginRight: '4px', color: 'var(--orange)' }}>{IconMap.bot}</span> {t.business.journey.convoTitle}</div>
                  <div className="msg-bubble">{t.business.journey.convoAi2}</div>
                  <div className="msg-result">
                    <div className="mr-title">{t.business.journey.convoResult2Title}</div>
                    <div className="mr-items">
                      {t.business.journey.convoResult2Items.map((item, idx) => (
                        <div className="mr-item" key={`convo2-${idx}`}>
                          <span className="mr-dot"></span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: '3.2s' }}>
                  <div className="msg-ai-label"><span style={{ display: 'inline-flex', marginRight: '4px', color: 'var(--orange)' }}>{IconMap.bot}</span> {t.business.journey.convoTitle}</div>
                  <div className="msg-bubble" style={{ background: 'var(--surface3)' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ display: 'block', width: '7px', height: '7px', background: 'var(--text3)', borderRadius: '50%', animation: 'td 1.4s infinite' }}></span>
                      <span style={{ display: 'block', width: '7px', height: '7px', background: 'var(--text3)', borderRadius: '50%', animation: 'td 1.4s 0.2s infinite' }}></span>
                      <span style={{ display: 'block', width: '7px', height: '7px', background: 'var(--text3)', borderRadius: '50%', animation: 'td 1.4s 0.4s infinite' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '64px' }} className="rv">
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

      {/* HIRING */}
      <section id="hiring">
        <div className="section-tag rv">{t.business.hiring.tag}</div>
        <h2 className="section-headline rv">
          {t.business.hiring.headline}
          <br />
          <span style={{ color: 'var(--orange)' }}>{t.business.hiring.headlineHighlight1}</span> {t.business.hiring.headlineMiddle}
          <br />
          <span style={{ color: 'var(--purple-light)' }}>{t.business.hiring.headlineHighlight2}</span>
        </h2>
        <p className="section-sub rv">{t.business.hiring.subheadline}</p>

        <div className="hiring-inner-grid">
          <div>
            <div className="hiring-steps">
              {hiringSteps.map((step, index) => (
                <div key={`hstep-${index}`} className={`hstep rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''} ${index === 3 ? 'd3' : ''}`}>
                  <div className="hnum">{step.num}</div>
                  <div>
                    <div className="hstep-title">{step.title}</div>
                    <div className="hstep-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hiring-stats rv">
              {hiringStats.map((stat, idx) => (
                <div className="h-stat" key={`hstat-${idx}`}>
                  <div className="h-stat-val" data-target={stat.target} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                    0
                  </div>
                  <div className="h-stat-lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv d2">
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
              {t.business.hiring.candidateHeader}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {candidates.map((candidate, idx) => (
                <div className="cand-card" key={`cand-${idx}`}>
                  <div className="cand-avatar" style={{ background: candidate.badgeGradient, color: candidate.badgeColor, fontFamily: 'var(--display)', fontSize: '20px' }}>
                    {candidate.initial}
                  </div>
                  <div className="cand-info">
                    <div className="cand-name">{candidate.name}</div>
                    <div className="cand-detail">{candidate.detail}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 700, color: candidate.scoreColor }}>{candidate.score}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>{t.common.match}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px', padding: '16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                {t.business.hiring.postedTo}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Indeed', 'ZipRecruiter', 'Austin Jobs', 'Spanish Groups', 'Facebook Groups', '+5 more'].map((item, index) => (
                  <span key={item} className={`tag ${index < 2 ? 'tag-o' : index < 4 ? 'tag-p' : index === 4 ? 'tag-b' : 'tag-g'}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '16px', background: 'var(--orange-dim)', border: '1px solid rgba(255,92,26,0.2)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '6px' }}>{t.business.hiring.withMoil}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, color: 'var(--orange)' }}>$850</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{t.business.hiring.avgCostPerHire}</div>
              </div>
              <div style={{ padding: '16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px' }}>{t.business.hiring.industryAvg}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, color: 'var(--text3)', textDecoration: 'line-through' }}>$2,400</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{t.business.hiring.avgCostPerHire}</div>
              </div>
            </div>

            <a className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
              {t.business.hiring.startHiringCta}
            </a>
          </div>
        </div>
      </section>

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
                <div className="stat-val" data-target={stat.target} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                  0
                </div>
                <div className="stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* COMPARISON */}
      <section id="compare" className="section-wrap">
        <div className="section-tag rv" style={{ justifyContent: 'center' }}>
          {t.business.compare.tag}
        </div>
        <h2 className="section-headline rv" style={{ textAlign: 'center' }}>
          {t.business.compare.headline}<br />
          <span style={{ color: 'var(--orange)' }}>{t.business.compare.headlineHighlight1}</span> {t.business.compare.headlineMiddle}<br />
          <span style={{ color: 'var(--purple-light)' }}>{t.business.compare.headlineHighlight2}</span>
        </h2>
        <p
          className="rv"
          style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', maxWidth: '580px', margin: '16px auto 52px', fontWeight: 300 }}
        >
          {t.business.compare.subheadline}
        </p>

        <div className="rv" style={{ overflowX: 'auto', borderRadius: '18px', border: '1px solid var(--border2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '640px' }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: '20px 28px',
                    textAlign: 'left',
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--text3)',
                    background: 'var(--surface2)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {t.business.compare.featureCol}
                </th>
                <th
                  style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontFamily: 'var(--display)',
                    fontSize: '20px',
                    letterSpacing: '2px',
                    background: 'linear-gradient(135deg,rgba(255,92,26,0.1),rgba(124,58,237,0.07))',
                    borderBottom: '2px solid var(--orange)',
                    color: 'var(--orange)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MOIL <span style={{ display: 'inline-flex', marginLeft: '4px', color: 'var(--orange)' }}>{IconMap.star}</span>
                </th>
                <th
                  style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--text3)',
                    background: 'var(--surface2)',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.business.compare.consultantCol}
                </th>
                <th
                  style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--text3)',
                    background: 'var(--surface2)',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.business.compare.genericCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => {
                const moilColor = row[1].startsWith('✓') ? 'var(--green)' : row[1].startsWith('$15') ? 'var(--orange)' : 'var(--text)';
                const consColor = row[2] === '✗' ? 'var(--text3)' : 'var(--text2)';
                const genColor = row[3] === '✗' ? 'var(--text3)' : 'var(--text2)';
                return (
                  <tr key={`compare-row-${index}`} style={{ borderBottom: index === comparisonRows.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 28px', color: 'var(--text)', fontWeight: 500, fontSize: '13px' }}>{row[0]}</td>
                    <td
                      style={{
                        padding: '16px 24px',
                        textAlign: 'center',
                        fontWeight: 700,
                        color: moilColor,
                        background: 'linear-gradient(135deg,rgba(255,92,26,0.04),rgba(124,58,237,0.02))',
                        fontSize: '13px',
                      }}
                    >
                      {row[1]}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center', color: consColor, fontSize: '13px' }}>{row[2]}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'center', color: genColor, fontSize: '13px' }}>{row[3]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }} className="rv">
          <a className="btn-primary" href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
            {t.business.compare.cta}
          </a>
        </div>
      </section>

      <div className="divider"></div>

      {/* BILINGUAL */}
      <section className="section-wrap">
        <div className="bilingual-grid">
          <div>
            <div className="section-tag rv">{t.business.bilingualSection.tag}</div>
            <h2 className="section-headline rv">
              {t.business.bilingualSection.headline} <span style={{ color: 'var(--orange)' }}>{t.business.bilingualSection.headlineHighlight1}</span>
              <br />{t.business.bilingualSection.headlineMiddle} <span style={{ color: 'var(--purple-light)' }}>{t.business.bilingualSection.headlineHighlight2}</span>
            </h2>
            <p className="rv" style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, margin: '20px 0 32px', fontWeight: 300 }}>
              {t.business.bilingualSection.description}
            </p>
            <div className="rv d1" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div className="rv d2">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface2)', padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {t.business.bilingualSection.previewTitle}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                  <span className="tag tag-o">EN</span>
                  <span className="tag tag-p">ES</span>
                </div>
              </div>
              <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                    {t.business.bilingualSection.enLabel}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '10px' }}>
                    <strong>{t.business.bilingualSection.enPostTitle}</strong>
                    <br />
                    <br />
                    {t.business.bilingualSection.enPostBody}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--purple-light)' }}>{t.business.bilingualSection.enPostTags}</div>
                </div>
                <div style={{ background: 'var(--surface2)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                    {t.business.bilingualSection.esLabel}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '10px' }}>
                    <strong>{t.business.bilingualSection.esPostTitle}</strong>
                    <br />
                    <br />
                    {t.business.bilingualSection.esPostBody}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--purple-light)' }}>{t.business.bilingualSection.esPostTags}</div>
                </div>
              </div>
              <div style={{ padding: '0 22px 18px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--green)' }}>
                  {t.business.bilingualSection.previewFootnote}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <BusinessPricingSection />

      <div className="divider"></div>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ textAlign: 'center' }}>
        <div className="section-tag rv" style={{ justifyContent: 'center' }}>
          {t.business.testimonials.tag}
        </div>
        <h2 className="section-headline rv">
          {t.business.testimonials.headline}
          <br />
          <span style={{ color: 'var(--orange)' }}>{t.business.testimonials.headlineHighlight}</span>
        </h2>
        <div className="testi-inner-grid">
          {testimonials.map((item, index) => (
            <div className={`t-card rv ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`} key={`testimonial-${index}`}>
              <span className="t-qmark">&ldquo;</span>
              <div className="t-stars">★★★★★</div>
              <p className="t-text">{item.testimonial}</p>
              <div className="t-divider"></div>
              <div className="t-author">
                <img 
                  src={item.testimonialImage} 
                  alt={item.testimonialName}
                  className="t-av-img"
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '2px solid var(--border2)'
                  }}
                />
                <div>
                  <div className="t-name">{item.testimonialName}</div>
                  <div className="t-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <BusinessFaqSection />

      <div className="divider"></div>

      <BusinessFinalCta />

      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} onLanguageChange={handleLanguageChange} currentLang={currentLang} />

      {/* Customize Modal (commented out) */}
      {/* <BusinessCustomizeModal isOpen={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} /> */}
      </div>
  );
}

export default function BusinessPage() {
  return (
    <I18nProvider>
      <BusinessPageContent />
    </I18nProvider>
  );
}
