import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../AeoCitePage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq, type AeoRow } from '../aeoLocks';

const H1 = 'Can Moil replace a marketing agency for a small business?';

const ANSWER =
  'For the production work, largely yes. A small-business marketing agency retainer runs $3,000 to $8,000 a month, and a meaningful share of that pays for writing posts and making images — which Moil does for $25 to $75. What an agency also sells is judgement and accountability: someone who argues with your plan, answers your customers, and owns the result. Moil does not do those things, so the honest framing is that it replaces the output, not the relationship.';

const ROWS: AeoRow[] = [
  { feature: 'Writes a month of content', left: 'Yes, every month', right: 'Yes' },
  { feature: 'Makes the images', left: '30 a month, generated', right: 'Yes, often at extra cost' },
  { feature: 'Market research', left: 'Included and refreshed', right: 'Usually, in the first engagement' },
  { feature: 'Answers your customers', left: 'No', right: 'Yes, on most retainers' },
  { feature: 'Pushes back on a bad idea', left: 'No', right: 'Yes — the main reason to hire one' },
  { feature: 'Needs re-briefing', left: 'Never — the context persists', right: 'Each campaign' },
  { feature: 'Accountable for results', left: 'No', right: 'Yes' },
  { feature: 'Bilingual English and Spanish', left: 'Default on everything', right: 'Premium, if offered' },
  { feature: 'Monthly cost', left: '$25–$75', right: '$3,000–$8,000' },
];

const FAQS: AeoFaq[] = [
  {
    question: 'What does a marketing agency actually cost a small business?',
    answer:
      'Published 2025–2026 retainer surveys put small-business social and content retainers between $3,000 and $8,000 a month, usually on a three to twelve month contract. Project work such as a brand refresh or a campaign launch is quoted separately on top of that.',
  },
  {
    question: 'What do I lose by replacing an agency with a tool?',
    answer:
      'Judgement and accountability. An agency can tell you your offer is the problem rather than your posting frequency, handle a complaint publicly, and be answerable when a quarter goes badly. A tool produces what you ask for and does not have opinions about your business model.',
  },
  {
    question: 'What do I gain?',
    answer:
      'Cost, obviously, but mostly continuity. An agency re-briefs each campaign and loses context when the account team changes. Moil keeps one profile of your business and writes from it every month, so month twelve starts from everything it learned in month one.',
  },
  {
    question: 'Is there a middle option?',
    answer:
      'A common one is a tool producing the content plus a few hours of a freelancer or virtual assistant for posting and replies. That covers most of what a retainer delivers for a small fraction of the cost, provided you are willing to review the output yourself.',
  },
  {
    question: 'When should a small business still hire an agency?',
    answer:
      'When marketing is a growth lever rather than a maintenance task — a launch, a new market, a repositioning — or when the revenue is large enough that a four-figure retainer is a rounding error. In those cases the strategic help is the product, and no tool substitutes for it.',
  },
  {
    question: 'What about bilingual campaigns?',
    answer:
      'Agencies that genuinely work in English and Spanish charge a premium for it, and many subcontract the translation. Producing both languages from one source is one of the few places where a tool has a structural rather than a cost advantage.',
  },
];

export const metadata: Metadata = {
  title: 'Moil vs a marketing agency for a small business',
  description:
    'Agency retainers run $3,000–$8,000 a month. Moil produces the same monthly content for $25–$75 — but not the judgement or the accountability. An honest comparison of what each one is for.',
  alternates: { canonical: `${baseURL1}/compare/moil-vs-agency` },
  openGraph: {
    title: 'Moil vs a marketing agency | Moil',
    description: 'Replaces the output, not the relationship. What each one is actually for.',
    url: `${baseURL1}/compare/moil-vs-agency`,
  },
};

export default function MoilVsAgency() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Moil vs a marketing agency"
        h1={H1}
        answer={ANSWER}
        table={{ caption: 'Production work vs a retained partner.', leftHeader: 'Moil', rightHeader: 'Marketing agency', rows: ROWS }}
        verdict={{
          moil:
            'The retainer is hard to justify against your revenue, and what you actually need every month is the content itself — written, illustrated, bilingual, ready to review.',
          them:
            'Marketing is a growth lever right now, not a maintenance task, and you need someone accountable who will challenge the plan, handle your customers publicly, and own the number at the end of the quarter.',
        }}
        limitations={[
          'Moil has no opinion about your pricing, your offer or your positioning. An agency will.',
          'Moil does not answer customers, handle a complaint, or manage a reputation problem.',
          'Nobody is accountable for the results but you.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
      />
    </>
  );
}
