import { EnglishI18nProvider } from '../../../../src/common/components/EnglishI18nProvider';
import { BusinessPricingPageContent } from './BusinessPricingPageContent';

export default function BusinessPricingPage() {
  return (
    <EnglishI18nProvider>
      <BusinessPricingPageContent />
    </EnglishI18nProvider>
  );
}
