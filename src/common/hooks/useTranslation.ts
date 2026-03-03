'use client';

import { useState, useEffect, useCallback } from 'react';
import { en, es, type TranslationKeys } from '../translations';

type Language = 'en' | 'es';

interface UseTranslationReturn {
  t: TranslationKeys;
  lang: Language;
  setLang: (lang: Language) => void;
  isLoading: boolean;
}

const translations: Record<Language, TranslationKeys> = { en, es };

export function useTranslation(): UseTranslationReturn {
  const [lang, setLangState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from URL or localStorage on mount
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
      // Update URL to match localStorage
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

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('lg', newLang);
    window.history.replaceState({}, '', url.toString());

    // Update Google Translate cookie
    document.cookie = `googtrans=${newLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;

    // Dispatch event for external integrations
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: newLang } }));
  }, []);

  return {
    t: translations[lang],
    lang,
    setLang,
    isLoading,
  };
}

// Helper to get nested translation value by dot notation path
export function getTranslationValue(
  obj: TranslationKeys,
  path: string
): string {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}
