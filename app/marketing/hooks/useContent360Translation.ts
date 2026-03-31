'use client';

import { useCallback } from 'react';
import { useLanguageContext } from '@/src/common/components/I18nProvider';
import { getLocaleData } from '../data';

/**
 * Convenience hook for the Content360 marketing page.
 * Returns the marketing translation subtree, the current lang, the setter,
 * and all locale-aware data structures in one call.
 *
 * setLang does a full page reload with ?lg= in the URL so the server-rendered
 * HTML is replaced with the correct language — same pattern as the business page.
 */
export function useContent360Translation() {
  const { lang, setLang: setLangCtx, t, isLoading } = useLanguageContext();

  const setLang = useCallback((newLang: 'en' | 'es') => {
    setLangCtx(newLang); // persist to localStorage + update URL param via context
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lg', newLang);
      window.location.href = url.toString(); // full reload so all sections re-render
    }
  }, [setLangCtx]);

  return {
    t: t.marketing,
    lang,
    setLang,
    data: getLocaleData(lang),
    isLoading,
  };
}
