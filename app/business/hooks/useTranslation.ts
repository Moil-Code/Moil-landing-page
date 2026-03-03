'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  SupportedLanguage,
  getCurrentLanguage,
  setLanguage,
  t,
  translateText,
  TranslationResponse,
} from '../utils/n8nTranslation';

export interface UseTranslationReturn {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  translateAsync: (text: string, context?: string) => Promise<TranslationResponse>;
  isLoading: boolean;
}

/**
 * Hook for managing translations in the business landing page
 */
export function useTranslation(): UseTranslationReturn {
  const [lang, setLangState] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLangState(currentLang);

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent<{ lang: SupportedLanguage }>) => {
      setLangState(event.detail.lang);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // Set language and update state
  const handleSetLang = useCallback((newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setLangState(newLang);
  }, []);

  // Get static translation
  const translate = useCallback(
    (key: string) => {
      return t(key, lang);
    },
    [lang]
  );

  // Async translation using n8n webhook
  const translateAsync = useCallback(
    async (text: string, context?: string): Promise<TranslationResponse> => {
      setIsLoading(true);
      try {
        const response = await translateText({
          text,
          targetLanguage: lang,
          context,
        });
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [lang]
  );

  return {
    lang,
    setLang: handleSetLang,
    t: translate,
    translateAsync,
    isLoading,
  };
}

export default useTranslation;
