'use client';

import { BusinessFaqSection } from '../components/BusinessFaqSection';
import { BusinessFinalCta } from '../components/BusinessFinalCta';
import { BusinessFooter } from '../components/BusinessFooter';
import { BusinessMobileMenu } from '../components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../components/BusinessNav';
import { BusinessPricingSection } from '../components/BusinessPricingSection';
import { useBusinessUi } from '../hooks/useBusinessUi';

const navItems: NavItem[] = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Get Started', href: '#final' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
];

const mobileItems: NavItem[] = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Get Started', href: '#final' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
];

export default function BusinessPricingPage() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();

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
          💸 Simple, transparent pricing for small businesses
        </div>

        <h1 className="hero-headline">
          Pricing That <span className="hl-o">Scales</span>
          <br />
          With Your Business
          <br />
          <span className="hl-p">Not Against It.</span>
        </h1>

        <p className="hero-sub">
          Pick the plan that fits your stage. Upgrade as you grow, cancel anytime, and keep your AI co-founder working
          24/7.
        </p>

        <div className="hero-ctas">
          <a className="btn-primary" href="https://business.moilapp.com/register" target="_blank" rel="noreferrer">
            🚀 Start Free Now <span>→</span>
          </a>
          <a className="btn-secondary" href="#pricing">
            ▶ See Plans
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-pill">
            <span className="dot dot-g"></span> 30-Day Guarantee
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> No Setup Fees
          </div>
          <div className="trust-pill">
            <span className="dot dot-p"></span> Cancel Anytime
          </div>
          <div className="trust-pill">
            <span className="dot dot-g"></span> Bilingual EN/ES
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> From $15/month
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <BusinessPricingSection />

      <div className="divider"></div>

      <BusinessFaqSection />

      <div className="divider"></div>

      <BusinessFinalCta />

      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}
