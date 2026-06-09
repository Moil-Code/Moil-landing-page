'use client';

import { I18nProvider } from '../../../src/common/components/I18nProvider';
import { BusinessPageContent } from '../../business/page';

// Spanish-locale variant of /business. Same component tree, but locale
// is forced to 'es' so the URL → content → schema → hreflang all agree.
// Google crawls /es/business and sees real Spanish content; non-Spanish
// searchers hit /business and see English. Bilingual SEO without the
// duplicate-content trap.
export default function BusinessPageEs() {
  return (
    <I18nProvider initialLang="es">
      <BusinessPageContent />
    </I18nProvider>
  );
}
