'use client';

import type { ReactNode } from 'react';
import { BusinessFooter } from '../../../app/business/components/BusinessFooter';
import { BusinessMobileMenu } from '../../../app/business/components/BusinessMobileMenu';
import { BusinessNav, type NavItem } from '../../../app/business/components/BusinessNav';
import { useBusinessUi } from '../../../app/business/hooks/useBusinessUi';
import { I18nProvider, useLanguageContext } from './I18nProvider';
import styles from './BrandPageShell.module.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const MOBILE_ITEMS: NavItem[] = [
  { label: 'Business Plan', href: '/business' },
  { label: 'Moil Services', href: '/marketing' },
  { label: 'Hiring', href: '/candidate' },
  ...NAV_ITEMS,
];

function PageChrome({ children }: { children: ReactNode }) {
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
        onToggleTheme={toggleTheme}
        theme={theme}
        items={NAV_ITEMS}
        ctaHref="https://employer-beta.moilapp.com/register"
        ctaLabel="Get Started"
        currentLang={lang}
        onLanguageChange={setLang}
      />
      {children}
      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} currentLang={lang} onLanguageChange={setLang} />
    </div>
  );
}

export function BrandPageShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <PageChrome>{children}</PageChrome>
    </I18nProvider>
  );
}
