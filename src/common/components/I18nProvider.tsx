'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en, es, type TranslationKeys } from '../translations';
import { isEnglishBusinessPath, isSpanishPath } from '../i18n/pathLocale';
import { twinPath } from '../i18n/localeRoutes';

type Language = 'en' | 'es';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
  isLoading: boolean;
}

const translations: Record<Language, TranslationKeys> = { en, es };

const LanguageContext = createContext<LanguageContextType | null>(null);

/** Read language from the path first, then ?lg=, then localStorage. */
function detectInitialLang(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const { pathname, search } = window.location;
    if (isSpanishPath(pathname)) return 'es';
    const lg = new URLSearchParams(search).get('lg');
    if (lg === 'en' || lg === 'es') return lg;
    // `/business` is the English door. A leftover tlang=es from /es must
    // not flip this URL to Spanish after hydration.
    if (isEnglishBusinessPath(pathname)) return 'en';
    const stored = localStorage.getItem('tlang');
    if (stored === 'en' || stored === 'es') return stored as Language;
  } catch {}
  return 'en';
}

export function I18nProvider({ children, initialLang }: { children: ReactNode; initialLang?: Language }) {
  // initialLang forces a language for the entire subtree — used by
  // /es/* routes so server-rendered HTML matches the URL's locale and
  // crawlers see Spanish content at the Spanish URL. When omitted, we
  // fall back to path → URL ?lg= → localStorage (never path-blind).
  const [lang, setLangState] = useState<Language>(initialLang ?? detectInitialLang);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    if (isSpanishPath(url.pathname)) {
      try { localStorage.setItem('tlang', 'es'); } catch {}
      // A prior English visit used to append ?lg=en here, and middleware
      // then set cookie lang=en on the Spanish URL.
      if (url.searchParams.get('lg') === 'en') {
        url.searchParams.delete('lg');
        window.history.replaceState({}, '', url.toString());
      }
      setIsLoading(false);
      return;
    }

    if (isEnglishBusinessPath(url.pathname)) {
      setIsLoading(false);
      return;
    }

    if (!url.searchParams.get('lg')) {
      try {
        const stored = localStorage.getItem('tlang');
        if (stored === 'en' || stored === 'es') {
          url.searchParams.set('lg', stored);
          window.history.replaceState({}, '', url.toString());
        }
      } catch {}
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    if (typeof window === 'undefined') return;

    setLangState(newLang);
    localStorage.setItem('tlang', newLang);
    document.cookie = `googtrans=${newLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: newLang } }));

    const url = new URL(window.location.href);
    // A page with a twin NAVIGATES to it: the URL is the locale source of truth
    // (pathLocale.ts), so the toggle must write the URL Google indexes for that
    // language, never `?lg=` on the other language's document. Arrival still
    // reads `?lg=` (detectInitialLang) so old links keep working; it is simply
    // not what the toggle writes any more.
    const twin = twinPath(url.pathname, newLang);
    if (twin && twin !== url.pathname) {
      url.pathname = twin;
      url.searchParams.delete('lg');
      window.location.assign(url.toString());
      return;
    }
    if (twin) return; // already on this language's document
    // No twin exists yet: state-only, as before.
    url.searchParams.set('lg', newLang);
    window.history.replaceState({}, '', url.toString());
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within I18nProvider');
  }
  return context;
}
