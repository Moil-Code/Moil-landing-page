import { SpanishI18nProvider } from '../../../../src/common/components/SpanishI18nProvider';
import { BusinessPricingPageContent } from '../../../(en)/business/pricing/BusinessPricingPageContent';

// Spanish-locale variant of /business/pricing. Same component tree, locale
// forced to 'es' so /es/business/pricing is a Spanish document.
export default function BusinessPricingPageEs() {
  return (
    <SpanishI18nProvider>
      <BusinessPricingPageContent />
    </SpanishI18nProvider>
  );
}
