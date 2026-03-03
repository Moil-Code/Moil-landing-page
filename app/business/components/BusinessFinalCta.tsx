'use client';

import { appendLangToUrl } from '../utils/appendLangToUrl';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

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
      <a className="final-btn rv" href={appendLangToUrl("https://business.moilapp.com/register", lang)} target="_blank" rel="noreferrer">
        {t.business.finalCta.cta} <span>→</span>
      </a>
      <div className="final-trust rv">
        {t.business.finalCta.trust.map((item, index) => (
          <div className="ft-item" key={`final-trust-${index}`}>
            <span className="gc">✓</span> {item}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: '64px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}
        >
          {t.business.finalCta.trustedBy}
        </div>
        <div style={{ color: 'var(--purple-light)', fontSize: '18px', letterSpacing: '3px' }}>★★★★★</div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            color: 'var(--text3)',
            marginTop: '6px',
          }}
        >
          {t.business.finalCta.statsLine}
        </div>
      </div>
    </section>
  );
}
