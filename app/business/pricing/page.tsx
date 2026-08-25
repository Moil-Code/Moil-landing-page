'use client';

import { I18nProvider } from '../../../src/common/components/I18nProvider';
import { BusinessPricingPageContent } from './BusinessPricingPageContent';

export default function BusinessPricingPage() {
  return (
    <I18nProvider>
      <BusinessPricingPageContent />
    </I18nProvider>
  );
}
