'use client';

import { BusinessFooter } from '../business/components/BusinessFooter';
import { BusinessMobileMenu } from '../business/components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../business/components/BusinessNav';
import { useBusinessUi } from '../business/hooks/useBusinessUi';
import { I18nProvider, useLanguageContext } from '../../src/common/components/I18nProvider';
import '../business/business.css';
import './comparison.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/business#capabilities' },
  { label: 'How It Works', href: '/business#journey' },
  { label: 'Pricing', href: '/business/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
];

function CompareShell({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { lang, setLang } = useLanguageContext();

  return (
    <div className="compare-shell">
      <div className="cursor" id="cur"></div>
      <div className="cursor-ring" id="curR"></div>
      <BusinessMobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={NAV_ITEMS}
        ctaLabel="Start free — no credit card"
        currentLang={lang}
      />
      <BusinessNav
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={NAV_ITEMS}
        ctaHref="https://business.moilapp.com/register"
        ctaLabel="Get Started Free"
        currentLang={lang}
        onLanguageChange={setLang}
      />
      {children}
      <BusinessFooter
        theme={theme}
        onToggleTheme={toggleTheme}
        currentLang={lang}
        onLanguageChange={setLang}
      />
    </div>
  );
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CompareShell>
        {children}
      </CompareShell>
    </I18nProvider>
  );
}
