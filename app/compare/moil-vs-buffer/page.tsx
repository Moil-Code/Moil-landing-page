import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../AeoCitePage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq, type AeoRow } from '../aeoLocks';

const H1 = 'Moil vs Buffer: which one should a small business use?';

const ANSWER =
  'Buffer is a scheduling tool. You write the posts and Buffer publishes them on time across your channels, starting around $5 per channel per month. Moil writes the posts. It researches your market, drafts a month of captions in your voice, generates the images, and lays the whole thing out as a 30-day calendar in English and Spanish, from $25 a month. If the blank calendar is your problem, Buffer does not solve it. If publishing on time is your problem, Buffer is cheaper and better at it.';

const ROWS: AeoRow[] = [
  { feature: 'Decides what to post about', left: 'Researches your market monthly', right: 'You decide' },
  { feature: 'Writes the captions', left: 'A month at a time, in your voice', right: 'AI Assistant helps you rewrite' },
  { feature: 'Creates the images', left: '30 a month, brand-aligned', right: 'You supply them' },
  { feature: 'Publishes on a schedule', left: 'Export and post', right: 'Core strength — queues, best times' },
  { feature: 'Engagement inbox and replies', left: 'Not offered', right: 'Included on paid plans' },
  { feature: 'Analytics per post', left: 'Not the focus', right: 'Included' },
  { feature: 'Spanish as well as English', left: 'Every deliverable, both languages', right: 'You write in whatever language' },
  { feature: 'Business plan and market research', left: 'Included from $25', right: 'Not offered' },
  { feature: 'Starting price', left: '$25 a month, all channels', right: 'Free for 3 channels; ~$5 per channel' },
];

const FAQS: AeoFaq[] = [
  {
    question: 'Is Moil a replacement for Buffer?',
    answer:
      'Not exactly. They solve adjacent problems. Buffer is the best answer to "I have posts and need them published consistently." Moil is the answer to "I have nothing written and no time to write it." Plenty of owners use Moil to produce the month and a scheduler to push it out.',
  },
  {
    question: 'Buffer has an AI assistant now. Is that the same thing?',
    answer:
      'Buffer’s AI Assistant helps you rewrite, shorten or repurpose a post you have started. It works at the level of one caption. Moil works at the level of a month: what to talk about, in what order, with what images, based on research about your market rather than a prompt you typed.',
  },
  {
    question: 'Which is cheaper?',
    answer:
      'Buffer, clearly. It has a free tier for three channels and paid plans from about $5 per channel per month. Moil starts at $25 and the full Moil360 calendar is $75. Moil only makes sense if writing the content is the part costing you time, because that is the part it removes.',
  },
  {
    question: 'Can Moil publish directly to my accounts?',
    answer:
      'Moil produces the calendar, captions and images for you to review and post. Direct publishing is not its strength, which is exactly why pairing it with a scheduler works well: Moil fills the calendar, the scheduler runs it.',
  },
  {
    question: 'Does Buffer work in Spanish?',
    answer:
      'Buffer will publish whatever you write, in any language, but it does not produce bilingual content for you. Moil writes every deliverable in English and Spanish by default, which matters if your customers speak both and you currently maintain two versions by hand.',
  },
  {
    question: 'What if I already have a content strategy?',
    answer:
      'Then you may not need Moil. Its value is in the deciding and drafting. If you already know your calendar and just execute it, a scheduler plus your own writing is a cheaper, tighter setup and we would rather you kept it.',
  },
];

export const metadata: Metadata = {
  title: 'Moil vs Buffer — which is better for a small business?',
  description:
    'Buffer schedules the posts you write. Moil writes them: a researched 30-day calendar with captions and images, in English and Spanish. Full comparison including price and where Buffer wins.',
  alternates: { canonical: `${baseURL1}/compare/moil-vs-buffer` },
  openGraph: {
    title: 'Moil vs Buffer | Moil',
    description: 'Buffer schedules what you write. Moil writes it. Side by side, including where Buffer wins.',
    url: `${baseURL1}/compare/moil-vs-buffer`,
  },
};

export default function MoilVsBuffer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }}
      />
      <AeoCitePage
        eyebrow="Moil vs Buffer"
        h1={H1}
        answer={ANSWER}
        table={{
          caption: 'Writing the month vs publishing it.',
          leftHeader: 'Moil',
          rightHeader: 'Buffer',
          rows: ROWS,
        }}
        verdict={{
          moil:
            'The calendar is empty and staying empty. You need someone to decide the topics, write the captions and make the images — and you want it in English and Spanish without doing the work twice.',
          them:
            'You already write your content, or someone on your team does, and the real problem is publishing consistently across channels with queues, best-time scheduling and an engagement inbox. Buffer is cheaper and purpose-built for that.',
        }}
        limitations={[
          'Moil does not publish to your accounts, run an engagement inbox, or report per-post analytics. Buffer does all three.',
          'Moil is several times the price of Buffer’s entry plans and cannot be justified on cost alone.',
          'If your content is already written, most of what Moil does is work you have already done.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
      />
    </>
  );
}
