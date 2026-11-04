'use client';

import { EnglishI18nProvider } from '../../../src/common/components/EnglishI18nProvider';
import { CompareShell } from '../../../src/common/components/CompareShell';
import '../business/business.css';
import './comparison.css';

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnglishI18nProvider>
      <CompareShell>
        {children}
      </CompareShell>
    </EnglishI18nProvider>
  );
}
