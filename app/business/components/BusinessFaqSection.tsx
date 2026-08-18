'use client';

import { useState } from 'react';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

/** Phase 1 AEO FAQ — 40–60 word direct answers. Co-founder + plan + Moil360 at the locked prices. No hiring-led answers. */
const BUSINESS_FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What does Moil do for local shops?',
    answer:
      'Moil is the AI co-founder for local shops. It learns the business once, then writes the plan and coaches the owner in English and Spanish. Professional is $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75. Moil is not a hiring platform.',
  },
  {
    question: 'How much does Moil cost?',
    answer:
      'Professional is $25 a month and includes the AI co-founder: research, plan, coaching, and documents. The full Moil360 30-day calendar is Market Pro at $75. Start free, no card. A typical consultant runs $5,000–$15,000 per engagement, and a marketing agency retainer averages $3,000–$8,000 a month.',
  },
  {
    question: 'Can Moil generate a business plan?',
    answer:
      'Yes. Moil learns your shop once, then writes a business plan from that context in English or Spanish. Research, the plan, coaching, and documents come with Professional at $25 a month. The full Moil360 calendar is not in that plan; it is Market Pro at $75. Start free, no card.',
  },
  {
    question: 'What is Moil360?',
    answer:
      'Moil360 is the 30-day content calendar Moil writes after it learns the shop — topics, captions, and assets in English and Spanish. The full calendar is Market Pro at $75 a month. Professional at $25 is the AI co-founder for research, plan, coaching, and documents. It does not include the full Moil360 calendar.',
  },
  {
    question: 'Does Moil work in Spanish?',
    answer:
      'Yes. Moil works in English and Spanish end to end. It learns the business once, then writes the plan, coaching, and documents in either language. Professional is $25 a month. The full Moil360 calendar is also bilingual and ships with Market Pro at $75. Start free, no card.',
  },
  {
    question: 'How is Moil different from ChatGPT or Claude?',
    answer:
      'ChatGPT and Claude are blank chats. Every session starts from zero, and you assemble the work. Moil is the AI co-founder for local shops: it learns the business once, then writes the plan and coaches in English and Spanish. Professional is $25 a month. The full Moil360 calendar is Market Pro at $75.',
  },
  {
    question: 'How is Moil different from a consultant or agency?',
    answer:
      'A typical consultant charges $5,000–$15,000 per engagement. A marketing agency retainer averages $3,000–$8,000 a month. Moil is the AI co-founder at $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75. Moil stays on after the plan is written.',
  },
  {
    question: 'Is Moil the same as MOIL Limited?',
    answer:
      'Moil is Moil Enterprise Inc. in Buda, Texas — the AI co-founder for local shops. It is not a hiring platform and is not affiliated with MOIL Limited of India. Professional is $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75.',
  },
];

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
        {BUSINESS_FAQ_ITEMS.map((item, index) => {
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
