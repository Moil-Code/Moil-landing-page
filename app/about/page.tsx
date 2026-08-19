import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { AeoCitePage } from '../compare/AeoCitePage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq } from '../compare/aeoLocks';

const H1 = 'Who is Moil?';

const ANSWER =
  'Moil is an AI marketing platform for small businesses, built by Moil Enterprise Inc. in Buda, Texas and founded in 2023. It interviews an owner once about what they sell, who buys, and how they talk, then writes a 30-day content calendar with captions and images and refreshes it every month. It works end to end in English and Spanish.';

const FACTS = [
  'Moil Enterprise Inc.',
  'Buda, Texas',
  'Founded 2023',
  'AI marketing for small business',
  'Moil360 — 30-day content calendar',
  'Bilingual English and Spanish',
];

const FAQS: AeoFaq[] = [
  {
    question: 'What does Moil do for a small business?',
    answer:
      'Moil learns the business once — what it sells, who buys, how the owner talks — and then writes its marketing. It produces a 30-day content calendar with researched topics, captions and generated images, refreshes it every month, and answers questions using that stored context. It works in English and Spanish.',
  },
  {
    question: 'Where is Moil based, and when was it founded?',
    answer:
      'Moil Enterprise Inc. is based in Buda, Texas, and was founded in 2023. It is a small team building AI marketing software for small businesses, with a deliberate focus on bilingual English and Spanish output for owners whose customers speak both.',
  },
  {
    question: 'How much does Moil cost?',
    answer:
      'Professional is $25 a month and covers market research, the business plan, coaching and documents. The full Moil360 30-day content calendar is Market Pro at $75. The first conversation is free and needs no card.',
  },
  {
    question: 'Who is Moil for?',
    answer:
      'Owner-operated small businesses — trades, home services, restaurants, salons, retail — that need to market consistently but have nobody whose job that is. It suits bilingual owners especially well, since everything it writes comes out in English and Spanish.',
  },
  {
    question: 'Is Moil the same as MOIL Limited?',
    answer:
      'No. Moil is Moil Enterprise Inc., a software company in Buda, Texas, founded in 2023. MOIL Limited is a manganese mining company listed in India. The two share a name and have no connection, ownership or otherwise.',
  },
];

export const metadata: Metadata = {
  title: 'Who is Moil? — Moil Enterprise Inc., Buda, Texas',
  description:
    'Moil Enterprise Inc. — Buda, Texas, founded 2023. Moil is an AI marketing platform for small businesses: a 30-day content calendar written in your voice, in English and Spanish.',
  alternates: { canonical: `${baseURL1}/about` },
  openGraph: {
    title: 'Who is Moil? | Moil Enterprise Inc.',
    description:
      'Moil Enterprise Inc., Buda, Texas. Founded 2023. AI marketing for small business — Moil360 content calendar, English and Spanish.',
    url: `${baseURL1}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }}
      />
      <AeoCitePage
        eyebrow="About Moil"
        h1={H1}
        answer={ANSWER}
        facts={FACTS}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
      />
    </>
  );
}
