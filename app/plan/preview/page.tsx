'use client';

import { I18nProvider, useLanguageContext } from '../../../src/common/components/I18nProvider';
import { PreviewMagnet } from '../../business/components/PreviewMagnet';

/**
 * GET /plan/preview is the public magnet door.
 *
 * The Next rewrite still proxies POST /plan/preview and GET /plan/preview/:slug
 * to the Business Plan API. This page only wins for document GET (no slug),
 * so visiting the URL no longer 404s on the API.
 */
function Door() {
  const { t } = useLanguageContext();
  return (
    <main className="plan-preview-door">
      <div className="business-hero__preview" aria-labelledby="plan-preview-heading">
        <div className="business-hero__preview-heading">
          <h1 id="plan-preview-heading">{t.business.hero.previewTitle}</h1>
        </div>
        <PreviewMagnet />
      </div>
    </main>
  );
}

export default function PlanPreviewPage() {
  return (
    <I18nProvider>
      <Door />
    </I18nProvider>
  );
}
