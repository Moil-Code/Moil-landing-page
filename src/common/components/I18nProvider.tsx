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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const lgParam = url.searchParams.get('lg') as Language | null;
    const storedLang = localStorage.getItem('tlang') as Language | null;

    let effectiveLang: Language = 'en';

    if (lgParam && (lgParam === 'en' || lgParam === 'es')) {
      effectiveLang = lgParam;
      localStorage.setItem('tlang', lgParam);
    } else if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
      effectiveLang = storedLang;
      url.searchParams.set('lg', storedLang);
      window.history.replaceState({}, '', url.toString());
    }

    setLangState(effectiveLang);
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
