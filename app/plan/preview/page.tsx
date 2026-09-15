'use client';

import { I18nProvider, useLanguageContext } from '../../../src/common/components/I18nProvider';
import { PreviewMagnet } from '../../business/components/PreviewMagnet';

/**
 * GET /plan/preview is the public magnet door.
 *
 * Next filesystem pages win over afterFiles rewrites, so this page
 * would also swallow POST /plan/preview (HTML 200 → magnet "down").
 * next.config.js puts the JSON rewrite in beforeFiles, gated on
 * Content-Type: application/json, so POST (and JSON GET) still proxy
 * to the Business Plan API. Document GET has no that header, so this
 * page still wins. GET /plan/preview/:slug has no page and stays an
 * afterFiles rewrite.
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
