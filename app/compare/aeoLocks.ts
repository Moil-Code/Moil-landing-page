/**
 * Shared entity facts for the citation pages.
 *
 * One canonical sentence, stated once per page. The previous version repeated a
 * denial ("not affiliated with MOIL Limited") on every surface, which teaches the
 * association rather than breaking it — entity disambiguation is won with sameAs
 * links and consistent listings, and lives on /about now.
 */

export const ENTITY_LINE =
  'Moil is an AI marketing platform for small businesses, built by Moil Enterprise Inc. in Buda, Texas. It learns a business once, then writes a 30-day content calendar with captions and images and refreshes it every month, in English and Spanish. Professional is $25 a month; the full Moil360 calendar is Market Pro at $75.';

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
