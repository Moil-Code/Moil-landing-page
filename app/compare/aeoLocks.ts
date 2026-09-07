/**
 * Shared entity facts for the citation pages.
 *
 * One canonical sentence, stated once per page. The previous version repeated a
 * denial ("not affiliated with MOIL Limited") on every surface, which teaches the
 * association rather than breaking it — entity disambiguation is won with sameAs
 * links and consistent listings, and lives on /about now.
 */

import { pricingCopy } from '../../src/common/seo/pricingCopy';

export const ENTITY_LINE =
  `Moil is the AI co-founder for small business owners, built by Moil Enterprise Inc. in Buda, Texas. It learns a business once, then produces the finished work — research, plans, documents — and, on Market Pro, writes the whole month of content with captions and images and refreshes it every month, in English and Spanish. ${pricingCopy.en.entityPrice}`;

/** The same sentence for the Spanish citation pages, from the same price source. */
export const ENTITY_LINE_ES =
  `Moil es el socio de IA para dueños de negocio, hecho por Moil Enterprise Inc. en Buda, Texas. Aprende el negocio una vez y produce el trabajo terminado — investigación, planes, documentos — y, en Market Pro, escribe el mes completo de contenido con textos e imágenes y lo renueva cada mes, en inglés y en español. ${pricingCopy.es.entityPrice}`;

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
