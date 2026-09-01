'use client';

import { appendLangToUrl } from '../utils/appendLangToUrl';
import { getRegisterUrl } from '../preview/previewClient';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { ArrowRight, Check } from 'lucide-react';

export function BusinessFinalCta() {
  const { t, lang } = useLanguageContext();

  return (
    <section id="final">
      <div className="final-bg"></div>
      <div className="final-grid-lines"></div>
      <p className="final-tag rv">{t.business.finalCta.tag}</p>
      <h2 className="final-headline rv">
        {t.business.finalCta.headline}<br />{t.business.finalCta.headlineMiddle}<br />
        <span className="fl-p">{t.business.finalCta.headlineHighlight}</span>
      </h2>
      <p className="final-sub rv">
        {t.business.finalCta.subheadline}
      </p>
      <a className="final-btn rv" href={appendLangToUrl(getRegisterUrl(), lang)} rel="noreferrer">
        {t.business.finalCta.cta} <ArrowRight size={18} aria-hidden="true" />
      </a>
      <div className="final-trust rv">
        {t.business.finalCta.trust.map((item, index) => (
          <div className="ft-item" key={`final-trust-${index}`}>
            <span className="gc"><Check size={14} aria-hidden="true" /></span> {item}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: '64px', textAlign: 'center' }}>
      </div>
    </section>
  );
}
