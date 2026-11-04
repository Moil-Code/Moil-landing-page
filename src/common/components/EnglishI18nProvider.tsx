'use client';

import type { ReactNode } from 'react';
import { en } from '../translations/en';
import { I18nProvider } from './I18nProvider';

const EN = { lang: 'en' as const, t: en };

/**
 * The language provider for English documents: ships the English table only
 * (the Spanish one loads on demand). `initialLang` keeps its old meaning; with
 * none, the provider still honours `?lg=` and a stored choice.
 */
export function EnglishI18nProvider({ children, initialLang }: { children: ReactNode; initialLang?: 'en' | 'es' }) {
  return (
    <I18nProvider dictionary={EN} initialLang={initialLang}>
      {children}
    </I18nProvider>
  );
}
