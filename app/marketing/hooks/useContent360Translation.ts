'use client';

import { useLanguageContext } from '@/src/common/components/I18nProvider';
import { getLocaleData } from '../data';

/**
 * Convenience hook for the Content360 marketing page.
 * Returns the marketing translation subtree, the current lang, the setter,
 * and all locale-aware data structures in one call.
 */
export function useContent360Translation() {
  const { lang, setLang, t, isLoading } = useLanguageContext();
  return {
    t: t.marketing,
    lang,
    setLang,
    data: getLocaleData(lang),
    isLoading,
  };
}
