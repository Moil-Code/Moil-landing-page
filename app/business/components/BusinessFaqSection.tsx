'use client';

import { useState } from 'react';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

export function BusinessFaqSection() {
  const { t } = useLanguageContext();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ textAlign: 'center' }}>
      <div className="section-tag rv" style={{ justifyContent: 'center' }}>
        {t.business.faq.tag}
      </div>
      <h2 className="section-headline rv">
        {t.business.faq.headline}<br />
        <span style={{ color: 'var(--orange)' }}>{t.business.faq.headlineHighlight}</span>
      </h2>
      <div className="faq-list rv" style={{ textAlign: 'left', marginTop: '52px' }}>
        {t.business.faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={`faq-${index}`} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenIndex(isOpen ? null : index)}>
                {item.question}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
