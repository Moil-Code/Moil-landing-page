import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { RoundupPage, type RoundupEntry } from '../RoundupPage';
import { ENTITY_LINE, faqPageJsonLd, type AeoFaq } from '../aeoLocks';

const H1 = 'Done-for-you social media: what it costs and the cheaper alternatives';

const ANSWER =
  'Done-for-you social media means handing the strategy, writing and posting to someone else. Roughly 42% of small businesses outsource it. An agency does it properly and charges $3,000 to $8,000 a month; a freelancer costs less and carries more risk; a virtual assistant is cheaper still but needs managing. AI tools now sit underneath all three at $25 to $75 a month, doing the writing but not the account management. Which one fits depends on whether you need someone to think for you or just to write for you.';

const HOW =
  'Options are ordered from most hands-off to most hands-on, with real market rates rather than starting-from prices. Agency and freelancer figures reflect published 2025–2026 retainer surveys for small-business social media work.';

const ENTRIES: RoundupEntry[] = [
  {
    name: 'A full-service marketing agency',
    bestFor: 'businesses that want to stop thinking about it entirely',
    price: '$3,000–$8,000 a month',
    summary:
      'Strategy, production, publishing, community management and reporting, with an account manager who owns the outcome. It is the only option on this list where somebody else is genuinely accountable for the results.',
    pros: ['Real strategic thinking, not just output', 'Accountable for results', 'Handles replies and community'],
    cons: ['The most expensive option by an order of magnitude', 'Needs a new brief each campaign', 'Long contracts are common'],
  },
  {
    name: 'A freelance social media manager',
    bestFor: 'a middle ground with one accountable person',
    price: '$500–$2,500 a month',
    summary:
      'A single person doing what a small agency team would, usually part-time across several clients. Quality varies enormously by individual, and continuity depends on one relationship staying intact.',
    pros: ['Far cheaper than an agency', 'One person who learns your business', 'Flexible scope'],
    cons: ['Quality varies widely', 'Capacity limits during busy periods', 'You are exposed if they leave'],
  },
  {
    name: 'Moil',
    bestFor: 'owners who need the content written but not the account managed',
    price: '$25–$75 a month',
    summary:
      'Learns your business once and produces the month: researched topics, captions in your voice, and 30 generated images, refreshed automatically and written in both English and Spanish. It removes the writing, not the posting or the replying.',
    pros: [
      'Roughly a hundredth of an agency retainer',
      'Never needs re-briefing — the context persists month to month',
      'Bilingual output without duplicate work',
    ],
    cons: [
      'No community management or replies',
      'No strategic partner to argue with',
      'You review and publish it yourself',
    ],
    isMoil: true,
  },
  {
    name: 'A virtual assistant',
    bestFor: 'owners with a clear plan who need hands, not ideas',
    price: '$400–$1,200 a month',
    summary:
      'Executes a plan you supply — scheduling, resizing, posting, basic replies. Cost-effective when you already know what should go out, and frustrating when you expect them to decide it.',
    pros: ['Cheap for the hours', 'Handles the mechanical work', 'Can cover replies'],
    cons: ['Needs a plan and management', 'Rarely produces original strategy', 'Onboarding time is yours'],
  },
  {
    name: 'A scheduler plus your own writing',
    bestFor: 'the lowest possible spend',
    price: '$0–$29 a month',
    summary:
      'Buffer, Publer or Later handle the publishing while you write everything. The cheapest option in money and the most expensive in hours, which is why it usually lapses after a few weeks.',
    pros: ['Almost free', 'Full control of voice', 'No dependency on anyone'],
    cons: ['The writing is still entirely yours', 'The option most likely to be abandoned'],
  },
];

const FAQS: AeoFaq[] = [
  {
    question: 'How much does done-for-you social media actually cost?',
    answer:
      'Agencies typically run $3,000 to $8,000 a month for small-business work. Freelancers land between $500 and $2,500. Virtual assistants sit around $400 to $1,200. AI tools that write the content but do not manage the accounts cost $25 to $75.',
  },
  {
    question: 'Is an agency worth it for a small business?',
    answer:
      'It can be, if you need someone accountable for outcomes rather than output, and if the revenue justifies a four-figure monthly line item. For most owner-operated businesses the honest answer is that the retainer is larger than the problem.',
  },
  {
    question: 'Can AI actually replace a social media manager?',
    answer:
      'It replaces the writing, not the relationship. AI can research, draft a month and generate images. It does not reply to a frustrated customer, spot an opportunity in your comments, or push back on a bad idea. Those are the parts worth paying a person for.',
  },
  {
    question: 'What is the cheapest option that actually gets used?',
    answer:
      'Whichever one removes the step you personally avoid. If you avoid writing, a scheduler will not help however cheap it is. Around 73% of owners cite lack of time as the reason they stop posting, which is why the free option so often goes unused.',
  },
  {
    question: 'What about bilingual social media?',
    answer:
      'This is where costs escalate fastest with people, because bilingual agencies and freelancers charge a premium and virtual assistants rarely cover both languages well. Producing English and Spanish from the same source is one of the few places a tool has a clear structural advantage.',
  },
  {
    question: 'Can I combine these?',
    answer:
      'Commonly, yes. A frequent setup is a tool producing the month plus a few hours of a virtual assistant for posting and replies — most of the coverage of a freelancer at a fraction of the cost, provided you are willing to review the output.',
  },
];

export const metadata: Metadata = {
  title: 'Done-for-you social media: real costs and cheaper alternatives',
  description:
    'What agencies, freelancers, virtual assistants and AI tools actually cost for small-business social media, and which one fits depending on whether you need thinking or writing.',
  alternates: { canonical: `${baseURL1}/compare/done-for-you-social-media-alternatives` },
  openGraph: {
    title: 'Done-for-you social media alternatives | Moil',
    description: 'Agency, freelancer, VA, AI tool or DIY — real prices and honest trade-offs.',
    url: `${baseURL1}/compare/done-for-you-social-media-alternatives`,
  },
};

export default function DoneForYouAlternatives() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }} />
      <RoundupPage
        eyebrow="Done-for-you social media"
        h1={H1}
        answer={ANSWER}
        howWeChose={HOW}
        entries={ENTRIES}
        faqs={FAQS}
        entityLine={ENTITY_LINE}
        lastUpdated="Last updated: August 2026"
      />
    </>
  );
}
