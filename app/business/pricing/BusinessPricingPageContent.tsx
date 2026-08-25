'use client';

import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Languages,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BusinessFaqSection } from '../components/BusinessFaqSection';
import { BusinessFinalCta } from '../components/BusinessFinalCta';
import { BusinessFooter } from '../components/BusinessFooter';
import { BusinessMobileMenu } from '../components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../components/BusinessNav';
import { BusinessPricingSection } from '../components/BusinessPricingSection';
import { useBusinessUi } from '../hooks/useBusinessUi';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';

export function BusinessPricingPageContent() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { t, lang: currentLang, setLang } = useLanguageContext();

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLang(lang);
  };

  const navItems: NavItem[] = [
    { label: t.business.nav.features, href: '/business#capabilities' },
    { label: t.business.nav.howItWorks, href: '/business#journey' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  const mobileItems: NavItem[] = [
    { label: t.common.whatIsMoil, href: '/business#identity' },
    { label: t.business.nav.features, href: '/business#capabilities' },
    { label: t.business.nav.howItWorks, href: '/business#journey' },
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  return (
      <div className="pricing-page-shell">
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
        />

      <section className="pricing-page-hero">
        <div className="pricing-hero-art" aria-hidden="true">
          <Image src="/hero_bg.jpg" alt="" fill priority sizes="100vw" className="hero-bg-dark" />
          <Image
            src="https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1920/v1783442089/hero_bg_light_eeeazi.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-bg-light"
          />
        </div>
        <div className="pricing-hero-grid" aria-hidden="true"></div>
        <div className="pricing-hero-glow pricing-hero-glow--orange" aria-hidden="true"></div>
        <div className="pricing-hero-glow pricing-hero-glow--purple" aria-hidden="true"></div>

        <div className="pricing-hero-inner">
          <div className="pricing-hero-copy">
            <div className="pricing-page-eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              {t.business.pricingPage.heroEyebrow}
            </div>
            <h1 className="pricing-page-headline">
              {t.business.pricingPage.heroHeadline}{' '}
              <span className="hl-o">{t.business.pricingPage.heroHighlight1}</span>
              <br />
              {t.business.pricingPage.heroMiddle}
              <br />
              <span className="hl-p">{t.business.pricingPage.heroHighlight2}</span>
            </h1>
            <p className="pricing-page-sub">{t.business.pricingPage.heroSub}</p>

            <div className="pricing-page-actions">
              <a
                className="btn-primary btn-wave"
                href={appendLangToUrl('https://business.moilapp.com/register', currentLang)}
                target="_blank"
                rel="noreferrer"
              >
                {t.business.pricingPage.heroCta} <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="btn-secondary" href="#pricing">
                {t.business.pricingPage.heroCtaSecondary} <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="pricing-included-card" aria-label="Capabilities included with Moil">
            <div className="pricing-included-top">
              <span>{t.business.pricing.tag}</span>
              <span className="pricing-live-chip"><span></span> {t.business.identity.cardTitle}</span>
            </div>
            <div className="pricing-included-price">
              <span className="pricing-from">{currentLang === 'es' ? 'Desde' : 'From'}</span>
              <strong>{t.business.pricing.professional.monthlyPrice}</strong>
              <span>{t.business.pricing.perMonth}</span>
            </div>
            <p>{t.business.pricing.professional.tagline}</p>
            <div className="pricing-capability-list">
              {[
                { icon: BarChart3, label: t.business.ticker.marketResearch },
                { icon: FileText, label: t.business.ticker.businessPlan },
                { icon: Sparkles, label: t.business.ticker.coach },
                { icon: Languages, label: t.business.ticker.bilingual },
              ].map(({ icon: Icon, label }) => (
                <div className="pricing-capability" key={label}>
                  <span><Icon size={17} aria-hidden="true" /></span>
                  <strong>{label}</strong>
                  <CheckCircle2 size={17} aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className="pricing-included-foot">
              <ShieldCheck size={17} aria-hidden="true" />
              {t.business.pricingPage.trust30Day} · {t.business.pricingPage.trustNoSetup}
            </div>
          </aside>
        </div>

        <div className="pricing-trust-rail">
          {[
            t.business.pricingPage.trust30Day,
            t.business.pricingPage.trustNoSetup,
            t.business.pricingPage.trustCancel,
            t.business.pricingPage.trustBilingual,
            t.business.pricingPage.trustPrice,
          ].map((item) => (
            <span key={item}><CheckCircle2 size={15} aria-hidden="true" /> {item}</span>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <BusinessPricingSection />

      <div className="divider"></div>

      <BusinessFaqSection />

      <div className="divider"></div>

      <BusinessFinalCta />

      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} onLanguageChange={handleLanguageChange} currentLang={currentLang} />
      </div>
  );
}
