'use client';

import { BusinessFooter } from '../business/components/BusinessFooter';
import { getRegisterUrl } from '~~/app/(en)/business/preview/previewClient';
import { BusinessMobileMenu } from '../business/components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../business/components/BusinessNav';
import { useBusinessUi } from '../business/hooks/useBusinessUi';
import { EnglishI18nProvider } from '../../../src/common/components/EnglishI18nProvider';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import '../business/business.css';
import '../compare/comparison.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function AboutShell({ children }: { children: React.ReactNode }) {
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
        theme={theme}
        items={NAV_ITEMS}
        ctaHref={getRegisterUrl()}
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

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnglishI18nProvider>
      <AboutShell>{children}</AboutShell>
    </EnglishI18nProvider>
  );
}
