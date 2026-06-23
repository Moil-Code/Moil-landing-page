'use client';

import { I18nProvider } from '../../src/common/components/I18nProvider';
import { BusinessPageContent } from './BusinessPageContent';

// /business renders the English locale. The Spanish counterpart lives
// at app/es/business/page.tsx and re-uses BusinessPageContent with
// initialLang="es" — see research/strategy.md for the bilingual SEO plan.
export default function BusinessPage() {
  return (
    <I18nProvider>
      <BusinessPageContent />
    </I18nProvider>
  );
}
