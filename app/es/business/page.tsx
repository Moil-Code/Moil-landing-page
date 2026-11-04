import { SpanishI18nProvider } from '../../../src/common/components/SpanishI18nProvider';
import { BusinessPageContent } from '../../(en)/business/BusinessPageContent';

// Spanish-locale variant of /business. Same component tree, but locale
// is forced to 'es' so the URL → content → schema → hreflang all agree.
// Google crawls /es/business and sees real Spanish content; non-Spanish
// searchers hit /business and see English. Bilingual SEO without the
// duplicate-content trap.
export default function BusinessPageEs() {
  return (
    <SpanishI18nProvider>
      <BusinessPageContent />
    </SpanishI18nProvider>
  );
}
