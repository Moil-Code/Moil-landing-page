'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en, es, type TranslationKeys } from '../translations';

type Language = 'en' | 'es';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
  isLoading: boolean;
}

const translations: Record<Language, TranslationKeys> = { en, es };

const LanguageContext = createContext<LanguageContextType | null>(null);

/** Read language from URL ?lg= or localStorage synchronously (client-only). */
function detectInitialLang(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const lg = new URLSearchParams(window.location.search).get('lg');
    if (lg === 'en' || lg === 'es') return lg;
    const stored = localStorage.getItem('tlang');
    if (stored === 'en' || stored === 'es') return stored as Language;
  } catch {}
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialised synchronously on the client so there is no flash of English
  // when the page loads with ?lg=es or a persisted language in localStorage.
  // On the server (SSR) detectInitialLang() returns 'en' — the hydration
  // mismatch is suppressed on the html element via suppressHydrationWarning.
  const [lang, setLangState] = useState<Language>(detectInitialLang);
  const [isLoading, setIsLoading] = useState(false);

  // Persist URL param on first mount if missing, without blocking render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
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

  const setLang = useCallback((newLang: Language) => {
    if (typeof window === 'undefined') return;

    setLangState(newLang);
    localStorage.setItem('tlang', newLang);

    const url = new URL(window.location.href);
    url.searchParams.set('lg', newLang);
    window.history.replaceState({}, '', url.toString());

    document.cookie = `googtrans=${newLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: newLang } }));
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
