import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../AeoCitePage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq, type AeoRow } from '../aeoLocks';

const H1 = 'Is there a cheaper alternative to a small business consultant?';

const ANSWER =
  'A small-business consultant typically charges $5,000 to $15,000 for an engagement and delivers a plan, market research and a set of recommendations over two to four weeks. Moil produces the plan and the research from a conversation, for $25 a month, and then keeps going — writing the marketing that a consulting deliverable usually leaves you to execute alone. The trade is real: a consultant brings experience and judgement about your specific situation, and a tool brings persistence and a much lower price.';

const ROWS: AeoRow[] = [
  { feature: 'Business plan', left: 'Written from your answers', right: 'Written from interviews' },
  { feature: 'Market research', left: 'Included, refreshed', right: 'Included, point-in-time' },
  { feature: 'Turnaround', left: 'Same session', right: 'Two to four weeks' },
  { feature: 'Executes the plan afterwards', left: 'Writes your monthly content', right: 'Usually not — that is your job' },
  { feature: 'Available after delivery', left: 'Always', right: 'Goes dark between engagements' },
  { feature: 'Judgement about your situation', left: 'Generic to your inputs', right: 'The reason to hire one' },
  { feature: 'Industry experience and network', left: 'None', right: 'Often the real value' },
  { feature: 'English and Spanish', left: 'Both, by default', right: 'Depends entirely on the consultant' },
  { feature: 'Cost', left: '$25 a month', right: '$5,000–$15,000 per engagement' },
];

const FAQS: AeoFaq[] = [
  {
    question: 'What does a small business consultant charge?',
    answer:
      'Typical engagements run $5,000 to $15,000 depending on scope, with two to four weeks to deliver. Hourly work sits roughly between $150 and $400. Specialists in a specific trade or a specific market usually charge at the upper end.',
  },
  {
    question: 'Can AI write a business plan that a bank or investor will accept?',
    answer:
      'It can produce a complete, properly structured plan with projections quickly, which is most of the work. What it cannot do is defend the assumptions in a room. For a loan application the structure is usually enough; for a serious raise, expect to do real work on the numbers yourself.',
  },
  {
    question: 'What does a consultant give me that a tool does not?',
    answer:
      'Judgement about your particular situation, pattern recognition from businesses like yours, an outside perspective that is willing to be unwelcome, and sometimes a network. None of that is replicated by a tool that works from your own answers.',
  },
  {
    question: 'What does a tool give me that a consultant does not?',
    answer:
      'Persistence and execution. A consulting engagement ends with a document and the hard part still ahead of you. Moil keeps the same context afterwards and turns it into the monthly marketing work, which is where most plans quietly die.',
  },
  {
    question: 'Is this a real substitute or just a cheaper thing?',
    answer:
      'It is a substitute for the deliverable, not for the advice. If what you need is a plan and research so you can move, the economics are not close. If what you need is someone experienced to tell you that your plan is wrong, pay the consultant.',
  },
  {
    question: 'What about consultants who work in Spanish?',
    answer:
      'They exist but are thin on the ground in most US markets, and bilingual engagements tend to carry a premium. Producing the plan and research in both languages from one conversation removes that constraint entirely.',
  },
];

export const metadata: Metadata = {
  title: 'Cheaper alternative to a small business consultant',
  description:
    'Consultants charge $5,000–$15,000 per engagement for a plan and market research. Moil produces both for $25 a month and then writes the marketing — but brings no judgement about your situation. Honest comparison.',
  alternates: { canonical: `${baseURL1}/compare/alternative-to-consultant` },
  openGraph: {
    title: 'A cheaper alternative to a business consultant | Moil',
    description: 'Substitutes for the deliverable, not the advice. What each one is worth.',
    url: `${baseURL1}/compare/alternative-to-consultant`,
  },
};

export default function AlternativeToConsultant() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Alternative to a consultant"
        h1={H1}
        answer={ANSWER}
        table={{ caption: 'An engagement vs an ongoing tool.', leftHeader: 'Moil', rightHeader: 'Business consultant', rows: ROWS }}
        verdict={{
          moil:
            'You need a plan and market research so you can start moving, and you know the harder part is the twelve months of execution afterwards that a consulting document does not cover.',
          them:
            'You need someone experienced to look at your specific situation and tell you something you do not want to hear — about your pricing, your market, or whether the business works at all. That is judgement, and it is worth paying for.',
        }}
        limitations={[
          'Moil works from your answers, so it inherits your blind spots rather than correcting them.',
          'No industry network, no introductions, no experience of businesses like yours.',
          'It will not tell you the plan is a bad idea.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
      />
    </>
  );
}
