'use client';

/**
 * The chrome around every citation page — nav, mobile menu, footer — in one
 * component so the English /compare layout and the Spanish /es layouts render
 * the same shell. Lives here (not in a layout file) because Next restricts
 * what a layout may export.
 */
import { BusinessFooter } from '../../../app/business/components/BusinessFooter';
import { getRegisterUrl } from '~~/app/business/preview/previewClient';
import { BusinessMobileMenu } from '../../../app/business/components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../../../app/business/components/BusinessNav';
import { useBusinessUi } from '../../../app/business/hooks/useBusinessUi';
import { useLanguageContext } from './I18nProvider';

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function CompareShell({ children }: { children: React.ReactNode }) {
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
