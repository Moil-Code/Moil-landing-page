'use client';

import type { ReactNode } from 'react';
import { getRegisterUrl } from '~~/app/(en)/business/preview/previewClient';
import { BusinessFooter } from '../../../app/(en)/business/components/BusinessFooter';
import { BusinessMobileMenu } from '../../../app/(en)/business/components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../../../app/(en)/business/components/BusinessNav';
import { useBusinessUi } from '../../../app/(en)/business/hooks/useBusinessUi';
import { useLanguageContext } from './I18nProvider';
import styles from './BrandPageShell.module.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const MOBILE_ITEMS: NavItem[] = [
  { label: 'Business Plan', href: '/business' },
  { label: 'Moil360', href: '/business#pricing' },
  { label: 'Hiring', href: '/candidate' },
  ...NAV_ITEMS,
];

/**
 * The brand pages' nav, mobile menu and footer, inside whichever language
 * provider the page's shell set up (BrandPageShell for English documents,
 * BrandPageShellEs for /es/*). Kept apart from the providers so a Spanish
 * page does not ship the English translation table, and vice versa.
 */
export function BrandPageChrome({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } = useBusinessUi();
  const { lang, setLang } = useLanguageContext();

  return (
    <div className={styles.shell}>
      <div className="cursor" id="cur" aria-hidden="true" />
      <div className="cursor-ring" id="curR" aria-hidden="true" />
      <BusinessMobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={MOBILE_ITEMS}
        ctaLabel="Get started"
        currentLang={lang}
      />
      <BusinessNav
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        theme={theme}
        items={NAV_ITEMS}
        ctaHref={getRegisterUrl()}
        ctaLabel="Get Started"
        currentLang={lang}
        onLanguageChange={setLang}
      />
      {children}
      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} currentLang={lang} onLanguageChange={setLang} />
    </div>
  );
}
