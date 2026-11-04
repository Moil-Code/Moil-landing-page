'use client';

import type { ReactNode } from 'react';
import { BrandPageChrome } from './BrandPageChrome';
import { SpanishI18nProvider } from './SpanishI18nProvider';

// The brand pages' shell for Spanish documents (/es/*): the shared chrome
// with the Spanish table only.
export function BrandPageShellEs({ children }: { children: ReactNode }) {
  return (
    <SpanishI18nProvider>
      <BrandPageChrome>{children}</BrandPageChrome>
    </SpanishI18nProvider>
  );
}
