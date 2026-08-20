/**
 * FAQPage structured data, generated from the same translation array the on-page
 * FAQ renders. Previously the JSON-LD was hand-maintained in layout.tsx while the
 * component held its own hardcoded list; the two drifted apart and the page ended
 * up publishing two contradictory sets of answers. Generating one from the other
 * makes that class of drift impossible.
 *
 * Note on value: Google deprecated FAQ rich results on 2026-05-07 and no AI vendor
 * confirms a citation benefit, so this is kept for correctness and for the crawlers
 * that still parse it — not as a ranking lever.
 */
export type FaqItem = { question: string; answer: string };

export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
