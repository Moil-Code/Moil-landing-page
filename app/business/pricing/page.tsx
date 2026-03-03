'use client';

import { BusinessFaqSection } from '../components/BusinessFaqSection';
import { BusinessFinalCta } from '../components/BusinessFinalCta';
import { BusinessFooter } from '../components/BusinessFooter';
import { BusinessMobileMenu } from '../components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../components/BusinessNav';
import { BusinessPricingSection } from '../components/BusinessPricingSection';
import { useBusinessUi } from '../hooks/useBusinessUi';
import { I18nProvider, useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';

function BusinessPricingPageContent() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { t, lang: currentLang, setLang } = useLanguageContext();

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLang(lang);
  };

  const navItems: NavItem[] = [
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.faq, href: '#faq' },
    { label: t.common.getStarted, href: '#final' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

  const mobileItems: NavItem[] = [
    { label: t.business.nav.pricing, href: '#pricing' },
    { label: t.common.faq, href: '#faq' },
    { label: t.common.getStarted, href: '#final' },
    { label: t.common.blog, href: 'https://blog.moilapp.com', external: true },
  ];

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
        />

      <section id="hero">
        <div className="hero-grid"></div>
        <div className="hero-orb orb1"></div>
        <div className="hero-orb orb2"></div>
        <div className="hero-orb orb3"></div>

        <div className="hero-eyebrow pricing-hero-eyebrow">
          <span className="eyebrow-pulse"></span>
          {t.business.pricingPage.heroEyebrow}
        </div>

        <h1 className="hero-headline">
          {t.business.pricingPage.heroHeadline} <span className="hl-o">{t.business.pricingPage.heroHighlight1}</span>
          <br />
          {t.business.pricingPage.heroMiddle}
          <br />
          <span className="hl-p">{t.business.pricingPage.heroHighlight2}</span>
        </h1>

        <p className="hero-sub">
          {t.business.pricingPage.heroSub}
        </p>

        <div className="hero-ctas">
          <a className="btn-primary" href={appendLangToUrl("https://business.moilapp.com/register", currentLang)} target="_blank" rel="noreferrer">
            {t.business.pricingPage.heroCta} <span>→</span>
          </a>
          <a className="btn-secondary" href="#pricing">
            {t.business.pricingPage.heroCtaSecondary}
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-pill">
            <span className="dot dot-g"></span> {t.business.pricingPage.trust30Day}
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> {t.business.pricingPage.trustNoSetup}
          </div>
          <div className="trust-pill">
            <span className="dot dot-p"></span> {t.business.pricingPage.trustCancel}
          </div>
          <div className="trust-pill">
            <span className="dot dot-g"></span> {t.business.pricingPage.trustBilingual}
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> {t.business.pricingPage.trustPrice}
          </div>
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

export default function BusinessPricingPage() {
  return (
    <I18nProvider>
      <BusinessPricingPageContent />
    </I18nProvider>
  );
}
