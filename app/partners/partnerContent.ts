/**
 * Everything the /partners page says, in one place.
 *
 * The visible FAQ and the FAQPage JSON-LD are both built from FAQS below, so
 * the two cannot drift apart (the same rule `faqJsonLd.ts` states for /business).
 *
 * What may and may not be written here:
 *  - Plan prices are never typed. They come from `pricingCopy` / `PLANS`, which
 *    `evals/pricingCopy.test.js` guards, so a repricing is one edit elsewhere.
 *  - Nothing here claims a partner discount, a revenue share, a reporting
 *    dashboard, a white-label portal or a result figure. None of those is
 *    documented in the product today. Partner terms are described as "set per
 *    program", which is true, rather than as a rate card, which would not be.
 *  - The two partner organizations are real and already linked from the nav.
 *  - Agency retainer figures are the ones /compare/moil-vs-agency already
 *    publishes. One fact, one value, everywhere.
 */

import { PLANS } from '../../src/common/seo/offers';
import { pricingCopy } from '../../src/common/seo/pricingCopy';
import type { AeoFaq } from '../compare/aeoLocks';

export const PARTNER_SUBJECT = 'Moil partnership inquiry';

/** The sentence that answers "what is this page about" — also the hero lede. */
export const PARTNER_ANSWER =
  'Moil is an AI co-founder that does the research, planning, documents and content work for each business in your program, in English and Spanish. Your staff keep the relationships and the follow-up. Moil takes the work that does not scale.';

export const WHY_CARDS = [
  {
    title: 'The production work is done for you',
    copy: 'Moil learns each business once, then produces the market research, business plan, documents and content that a counselor would otherwise draft by hand.',
  },
  {
    title: 'Staff time goes to people, not production',
    copy: 'Your team still talks to owners, makes introductions and decides who needs more help. They stop being the person who writes the first draft.',
  },
  {
    title: 'English and Spanish from the start',
    copy: 'Everything Moil produces comes in both languages, so serving Spanish-speaking owners needs no translator and no second program.',
  },
] as const;

export const BUSINESS_GETS = [
  'A conversation about the business, by voice or text, that Moil remembers. Owners never explain it twice.',
  'Market research on their local market, customers and competitors.',
  'A business plan with projections, the kind a lender asks for.',
  'Documents in the formats owners actually use: Word, spreadsheets and presentation decks.',
  'Brand assets and flyers.',
  'Social posts with generated images, written in the owner’s voice. Posts wait for the owner’s approval before they go out.',
  'All of it in English and Spanish.',
] as const;

/** The plan sentence, straight from the one pricing source. */
export const PLAN_LINE = pricingCopy.en.split;

export const USE_CASES = [
  {
    kicker: 'AS A PROGRAM RESOURCE',
    title: 'A resource for your members or clients',
    copy: 'Give owners access through a signup page that carries your name and logo. They see that Moil comes from you, and you decide who gets access.',
    fits: 'Chamber member benefits · EDC business-support resources · association programs',
  },
  {
    kicker: 'AS PART OF AN INCENTIVE',
    title: 'Part of a grant, loan or incentive package',
    copy: 'Include Moil in what a recipient receives, so the plan they were funded for turns into finished work. Access can be time-limited, for example Market Pro for a set period on top of a base plan.',
    fits: 'Grants · microloans · business-plan competitions · accelerator cohorts',
  },
] as const;

export const USE_CASE_NOTE =
  'Who is covered, which plan, and for how long are set per program.';

export const STEPS = [
  ['01', 'Tell us about your program', 'Who you support, roughly how many businesses, and what you want to change for them.'],
  ['02', 'Agree how access works', 'We settle who is covered, which plan and for how long, and set up a signup page with your name on it.'],
  ['03', 'Onboard the first group', 'Owners begin with a conversation about their business. We can run onboarding with your first group so they start with real work in hand.'],
  ['04', 'Follow up where a person helps most', 'Your team spends its time on the owners who now have research, plans or content in hand and still need a human.'],
] as const;

/** Arithmetic on published list prices. Not a promise of partner pricing. */
const LIST_PRICE_HIGH = Number(PLANS.marketPro.price);
const EXAMPLE_BUSINESSES = 100;
export const COST_EXAMPLE = {
  businesses: EXAMPLE_BUSINESSES,
  total: `$${(EXAMPLE_BUSINESSES * LIST_PRICE_HIGH).toLocaleString('en-US')}`,
  agencyRange: '$3,000 to $8,000',
} as const;

export const LIMITS = [
  'It does not replace your advisors. Moil produces the work. Judgement, introductions and funding decisions stay with your people.',
  'Owners stay in control of what is published. Posts are prepared for the owner to review, not sent without them.',
  'It is not a case-management or grant-management system for your own organization. It works with the businesses you support.',
  'Publishing goes to connected Facebook and Instagram accounts, with TikTok and YouTube chosen per post. Not to LinkedIn or X.',
] as const;

export const FAQS: AeoFaq[] = [
  {
    question: 'What does a Moil partnership include?',
    answer:
      'A partnership gives the businesses you support access to Moil, an AI co-founder that does research, business plans, documents and social content in English and Spanish. Access can run through a signup page carrying your name. We agree who is covered, which plan and for how long when we scope your program together.',
  },
  {
    question: 'Who can partner with Moil?',
    answer:
      'Organizations already close to small-business owners: economic development corporations, chambers of commerce, business associations, workforce boards and community nonprofits. Queen Creek Chamber of Commerce in Arizona and Buda Economic Development Corporation in Texas are current partners. If your organization supports local owners, a conversation is the right first step.',
  },
  {
    question: 'How does Moil help us serve more businesses without adding headcount?',
    answer:
      'Moil produces the work that usually needs a person to draft: market research, plans, documents and content for each business. Your staff review the output and follow up with owners instead of writing first drafts. Each additional business adds a software cost rather than a salary. It does not replace your advisors’ judgement.',
  },
  {
    question: 'How much does it cost to give Moil to the businesses we support?',
    answer: `List prices are per business. ${PLAN_LINE} Partner pricing is set per program, based on how many businesses are covered and which plan they receive. Share the size of your program and we will quote it plainly.`,
  },
  {
    question: 'Can we include Moil in a grant, loan or incentive program?',
    answer:
      'Yes. Recipients can receive Moil access as part of the package, so the plan they were funded for becomes finished work: research, documents and content. Access can be time-limited, for example Market Pro for a set period on top of a base plan. We set the terms with you for each program.',
  },
  {
    question: 'Does Moil work in Spanish?',
    answer:
      'Yes. Moil runs in English and Spanish end to end, from the first conversation to every document and post it produces. Spanish-speaking owners get the same service as everyone else, with no translator and no separate program for you to run.',
  },
  {
    question: 'What do our staff still need to do?',
    answer:
      'Your team keeps everything that needs a person: knowing the owners, making introductions, deciding who needs more help and answering the questions only you can. Moil does the production work. Owners review what Moil prepares, and your staff can focus follow-up on owners who now have real work in hand.',
  },
  {
    question: 'How do owners get started?',
    answer:
      'Owners start with a conversation about their business, by voice or text. Moil keeps what it learns, so they never explain it twice, and begins producing research, plans, documents and content from that profile. We can run onboarding with your first group so they start with real work, not an empty screen.',
  },
  {
    question: 'What can we report on to our board or funders?',
    answer:
      'Each owner has their own account, so what we can report depends on how the program is set up. Tell us what your board or funders ask for when we scope the program, and we will say plainly what we can provide and what we cannot, before you commit.',
  },
  {
    question: 'How is Moil different from hiring an agency or a consultant?',
    answer: `A small-business agency retainer runs ${COST_EXAMPLE.agencyRange} a month and includes judgement and accountability, which Moil does not provide. Moil produces the deliverables for a fraction of that, so it suits programs that need output for many businesses. Our agency comparison has the full breakdown.`,
  },
];

export const PARTNER_LINKS = [
  { label: 'Plans and pricing', href: '/business/pricing' },
  { label: 'Moil vs a marketing agency', href: '/compare/moil-vs-agency' },
  { label: 'Moil as an alternative to a consultant', href: '/compare/alternative-to-consultant' },
  { label: 'What Moil is, and what it is not', href: '/ai-info' },
  { label: 'About Moil Enterprise Inc.', href: '/about' },
] as const;
