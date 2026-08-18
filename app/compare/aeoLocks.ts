/** Phase 2 AEO locks — public facts and prices only. No founder bio. No hiring pillar. */

export const ENTITY_LINE =
  'Moil is Moil Enterprise Inc. in Buda, Texas — the AI co-founder for local shops. It is not a hiring platform and is not affiliated with MOIL Limited of India. Professional is $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75.';

export type AeoFaq = {
  question: string;
  answer: string;
};

export type AeoRow = {
  feature: string;
  left: string;
  right: string;
};

export function faqPageJsonLd(faqs: AeoFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
