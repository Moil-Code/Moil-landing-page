'use client';

import type { ReactNode } from 'react';
import { es } from '../translations/es';
import { I18nProvider } from './I18nProvider';

const ES = { lang: 'es' as const, t: es };

/**
 * The language provider for Spanish documents (/es/*): ships the Spanish table
 * only and forces Spanish, so the server-rendered HTML matches the URL.
 */
export function SpanishI18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider dictionary={ES} initialLang="es">
      {children}
    </I18nProvider>
  );
}
