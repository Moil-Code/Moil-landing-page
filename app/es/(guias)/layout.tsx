'use client';

import { SpanishI18nProvider } from '../../../src/common/components/SpanishI18nProvider';
import { CompareShell } from '../../../src/common/components/CompareShell';
import '../../(en)/business/business.css';
import '../../(en)/compare/comparison.css';

/** Spanish citation pages: the same shell as /compare, forced to Spanish so the document matches its URL. */
export default function EsPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpanishI18nProvider>
      <CompareShell>{children}</CompareShell>
    </SpanishI18nProvider>
  );
}
