'use client';

import type { ReactNode } from 'react';
import { BrandPageChrome } from './BrandPageChrome';
import { EnglishI18nProvider } from './EnglishI18nProvider';

// The brand pages' shell for English documents. Spanish documents use
// BrandPageShellEs (same chrome, Spanish table only).
export function BrandPageShell({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: 'en' | 'es';
}) {
  return (
    <EnglishI18nProvider initialLang={initialLang}>
      <BrandPageChrome>{children}</BrandPageChrome>
    </EnglishI18nProvider>
  );
}
