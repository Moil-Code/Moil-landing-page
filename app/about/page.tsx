import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { AeoCitePage } from '../compare/AeoCitePage';
import { faqPageJsonLd, type AeoFaq } from '../compare/aeoLocks';

const H1 = 'Moil is the AI co-founder for small business owners.';

const ANSWER =
  'Moil is the AI co-founder for small business owners.\n\nOwners shouldn’t have to be everything on top of the real job. Moil learns the business once, builds a brain that compounds, thinks with them, and does the work — research, plans, documents — and automates content creation thirty days at a time, on brand, in English or Spanish.\n\nWe sell to owners directly, and we distribute B2G through EDCs and chambers that put seats in the businesses they already support.';

const FACTS = [
  'Moil Enterprise Inc.',
  'Buda, Texas',
  'Founded 2023',
  'AI co-founder for small business owners',
  'Thirty days of content on brand',
  'Bilingual English and Spanish',
];

const FAQS: AeoFaq[] = [
  {
    question: 'What does Moil do for a small business?',
    answer:
      'Moil is the AI co-founder for small business owners. It learns the business once, builds a brain that compounds, thinks with them, and does the work — research, plans, documents — and automates content creation thirty days at a time, on brand, in English or Spanish.',
  },
  {
    question: 'Where is Moil based, and when was it founded?',
    answer: 'Moil Enterprise Inc. is based in Buda, Texas, and was founded in 2023.',
  },
  {
    question: 'How much does Moil cost?',
    answer:
      'Market Pro is $75 a month: the month of content plus the work. Professional is $25 for the same co-founder with a lighter month — four posts a week that you approve before anything publishes. The first conversation is free and needs no card.',
  },
  {
    question: 'Who is Moil for?',
    answer:
      'Small business owners who shouldn’t have to be everything on top of the real job. Direct to owners, and B2G through EDCs and chambers that put seats in the businesses they already support.',
  },
  {
    question: 'Is Moil the same as MOIL Limited?',
    answer:
      'No. Moil is Moil Enterprise Inc., a software company in Buda, Texas, founded in 2023. The mining company listed in India shares a name and has no connection, ownership or otherwise.',
  },
];

const ABOUT_ENTITY =
  'Moil is the AI co-founder for small business owners, built by Moil Enterprise Inc. in Buda, Texas, founded 2023.';

export const metadata: Metadata = {
  title: {
    absolute: 'Moil is the AI co-founder for small business owners | Moil Enterprise Inc.',
  },
  description:
    'Moil is the AI co-founder for small business owners. Moil Enterprise Inc., Buda, Texas, founded 2023.',
  alternates: { canonical: `${baseURL1}/about` },
  openGraph: {
    title: 'Moil is the AI co-founder for small business owners | Moil Enterprise Inc.',
    description:
      'Moil is the AI co-founder for small business owners. Moil Enterprise Inc., Buda, Texas, founded 2023.',
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
        entityLine={ABOUT_ENTITY}
        assurances={['Market Pro $75', 'English & Spanish', 'Start free, no card']}
      />
    </>
  );
}
