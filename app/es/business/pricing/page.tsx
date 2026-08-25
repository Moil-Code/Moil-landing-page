'use client';

import { I18nProvider } from '../../../../src/common/components/I18nProvider';
import { BusinessPricingPageContent } from '../../../business/pricing/page';

// Spanish-locale variant of /business/pricing. Same component tree, locale
// forced to 'es' so /es/business/pricing is a Spanish document.
export default function BusinessPricingPageEs() {
  return (
    <I18nProvider initialLang="es">
      <BusinessPricingPageContent />
    </I18nProvider>
  );
}
