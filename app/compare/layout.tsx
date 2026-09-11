'use client';

import { I18nProvider } from '../../src/common/components/I18nProvider';
import { CompareShell } from '../../src/common/components/CompareShell';
import '../business/business.css';
import './comparison.css';

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CompareShell>
        {children}
      </CompareShell>
    </I18nProvider>
  );
}
