'use client';

import { I18nProvider } from '../../../src/common/components/I18nProvider';
import { CompareShell } from '../../../src/common/components/CompareShell';
import '../../business/business.css';
import '../../compare/comparison.css';

/** Spanish citation pages: the same shell as /compare, forced to Spanish so the document matches its URL. */
export default function EsPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider initialLang="es">
      <CompareShell>{children}</CompareShell>
    </I18nProvider>
  );
}
