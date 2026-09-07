'use client';

import { useState, useEffect } from 'react';
import type { NavItem } from './BusinessNav';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { getRegisterUrl } from '../preview/previewClient';
import { usePathname } from 'next/navigation';
import { documentLocaleFromPathname, isSpanishPath } from '../../../src/common/i18n/pathLocale';

type BusinessMobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  currentLang?: 'en' | 'es';
};

export function BusinessMobileMenu({
  open,
  onClose,
  onToggleTheme,
  theme,
  items,
  ctaLabel = 'Start free — no credit card',
  ctaHref = getRegisterUrl(),
  currentLang,
}: BusinessMobileMenuProps) {
  // Seeded from the prop, exactly as BusinessNav and BusinessFooter do. An
  // unconditional 'en' here is only corrected by the effect below, i.e. after
  // hydration — so the SERVED HTML of every Spanish page sent its primary
  // mobile CTA to the English signup, and a reader who tapped before hydration
  // got it. Mobile is the dominant device for this audience.
  const pathname = usePathname() || '/';
  // The PATH is the locale source of truth (src/common/i18n/pathLocale.ts says so
  // in its own header, and `langCookieValue` gives the path priority over `?lg=`
  // and any stored value). These chrome components read only the prop, `?lg=` and
  // localStorage — none of which a Spanish visitor arriving from Google has — so
  // on /es/* they defaulted to English and every signup CTA carried ?lg=en.
  const [lang, setLang] = useState<'en' | 'es'>(currentLang ?? documentLocaleFromPathname(pathname));

  useEffect(() => {
    if (currentLang) {
      setLang(currentLang);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const lgParam = isSpanishPath(pathname) ? 'es' : (url.searchParams.get('lg') as 'en' | 'es' | null);
      const storedLang = localStorage.getItem('tlang') as 'en' | 'es' | null;
      if (lgParam && (lgParam === 'en' || lgParam === 'es')) setLang(lgParam);
      else if (storedLang && (storedLang === 'en' || storedLang === 'es')) setLang(storedLang);
    }
  }, [currentLang, pathname]);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<{ lang: 'en' | 'es' }>) => setLang(e.detail.lang);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  return (
    <div className={`mob-menu ${open ? 'open' : ''}`} id="mobMenu">
      {items.map((item) => (
        <a
          key={item.href + item.label}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          onClick={onClose}
        >
          {item.label}
        </a>
      ))}
      <a className="mob-cta" href={appendLangToUrl(ctaHref, lang)} target="_blank" rel="noreferrer" onClick={onClose} data-signup-cta="mobile-menu">
        {ctaLabel}
      </a>
      <div className="mob-footer">
        <span className="mob-theme-label">Theme</span>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="toggle-knob">{theme === 'dark' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}</div>
        </button>
      </div>
    </div>
  );
}
