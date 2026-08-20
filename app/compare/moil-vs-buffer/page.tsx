import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../AeoCitePage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq, type AeoRow } from '../aeoLocks';

const H1 = 'Moil vs Buffer: which one should a small business use?';

const ANSWER =
  'Buffer is a scheduling tool: you write the posts, Buffer publishes them on time across your channels, starting around $5 per channel per month. Moil writes the posts and publishes them. It researches your market, drafts a month of captions in your voice, generates the images, lays it out as a 30-day calendar in English and Spanish, and \u2014 once you approve \u2014 schedules and posts it to your Facebook Page and Instagram, from $25 a month. The real split is coverage: Buffer publishes to far more networks and adds an engagement inbox; Moil covers Facebook and Instagram but is the one that decides and writes what goes out.';

const ROWS: AeoRow[] = [
  { feature: 'Decides what to post about', left: 'Researches your market monthly', right: 'You decide' },
  { feature: 'Writes the captions', left: 'A month at a time, in your voice', right: 'AI Assistant helps you rewrite' },
  { feature: 'Creates the images', left: '30 a month, brand-aligned', right: 'You supply them' },
  { feature: 'Publishes on a schedule', left: 'Facebook and Instagram, after you approve', right: 'Core strength — queues, best times' },
  { feature: 'Networks covered', left: 'Facebook Pages and Instagram', right: 'Most major networks' },
  { feature: 'Engagement inbox and replies', left: 'Not offered', right: 'Included on paid plans' },
  { feature: 'Analytics per post', left: 'Reach and engagement, read back', right: 'Included' },
  { feature: 'Chooses the posting hour', left: 'From your own measured results', right: 'Best-time suggestions' },
  { feature: 'Spanish as well as English', left: 'Every deliverable, both languages', right: 'You write in whatever language' },
  { feature: 'Business plan and market research', left: 'Included from $25', right: 'Not offered' },
  { feature: 'Starting price', left: '$25 a month, all channels', right: 'Free for 3 channels; ~$5 per channel' },
];

const FAQS: AeoFaq[] = [
  {
    question: 'Is Moil a replacement for Buffer?',
    answer:
      'For Facebook and Instagram it can be, because Moil schedules and publishes to those itself. Buffer stays the better fit if you publish to LinkedIn, X, TikTok or Pinterest, or if you want an inbox for replies. The honest split: Buffer answers "I have posts and need them published across every channel"; Moil answers "I have nothing written and no time to write it."',
  },
  {
    question: 'Buffer has an AI assistant now. Is that the same thing?',
    answer:
      'Buffer’s AI Assistant helps you rewrite, shorten or repurpose a post you have started. It works at the level of one caption. Moil works at the level of a month: what to talk about, in what order, with what images, based on research about your market rather than a prompt you typed.',
  },
  {
    question: 'Which is cheaper?',
    answer:
      'Buffer, on price per channel. It has a free tier for three channels and paid plans from about $5 per channel per month. Moil starts at $25 and the full Moil360 calendar is $75. They are not really priced against each other: Buffer charges to move content you already have, Moil charges to produce it. If writing the content is the part costing you time, that is the part Moil removes.',
  },
  {
    question: 'Can Moil publish directly to my accounts?',
    answer:
      'Yes, to Facebook Pages and Instagram. You review the month, approve what you want, and Moil schedules and posts it — image, video or carousel — then reads reach and engagement back and uses your own results to pick the hour it posts. LinkedIn, X and TikTok are not connected, so for those you take the finished post and upload it yourself.',
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
            'You already write your content, or someone on your team does, and the job is moving it across many channels — LinkedIn, X, TikTok, Pinterest — with queues and an inbox for replies. That is what Buffer is built for, at a few dollars a channel.',
        }}
        limitations={[
          'Moil publishes to Facebook Pages and Instagram only. LinkedIn, X, TikTok and Pinterest are not connected — Buffer covers them.',
          'Moil has no engagement inbox and no social listening. It reads reach and engagement back on what it posted; it will not show you replies or mentions.',
          'Moil is several times the price of Buffer’s entry plans. If publishing is all you need, it is the wrong thing to buy.',
          'If your content is already written, most of what Moil does is work you have already done.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
      />
    </>
  );
}
