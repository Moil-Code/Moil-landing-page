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
import type { PartnerCopy } from './partnerCopy';

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

/** The English page, assembled from the constants above. */
export const PARTNER_EN: PartnerCopy = {
  lang: 'en',
  inLanguage: 'en-US',
  ogLocale: 'en_US',
  path: '/partners',
  meta: {
    title: 'Moil for EDCs and chambers: more owners, no new hires',
    description:
      'Give the small businesses you support research, plans, documents and content in English and Spanish, without adding staff. For EDCs, chambers and associations.',
    ogImageAlt: 'Moil, the AI co-founder for small business owners',
    siteName: 'Moil',
  },
  breadcrumb: { home: 'Home', page: 'Partners' },
  service: {
    name: 'Moil for economic development organizations and chambers of commerce',
    serviceType: 'Small-business support software for community organizations',
    audienceType: 'Economic development corporations, chambers of commerce, business associations and workforce boards',
  },
  inquirySubject: PARTNER_SUBJECT,
  hero: {
    eyebrow: 'MOIL PARTNERSHIPS',
    titleLead: 'Support more small businesses without adding to ',
    titleAccent: 'your team.',
    answer: PARTNER_ANSWER,
    cta: 'Start a partnership conversation',
    secondary: 'See how it works',
    proofLead: 'Working with ',
    proofLink: 'Queen Creek Chamber of Commerce and Buda EDC',
  },
  why: {
    eyebrow: 'WHY PARTNERS USE MOIL',
    heading: 'Serve more businesses without hiring more people.',
    copy: 'Every business you support needs the same kinds of work: research, a plan, documents, marketing content. Doing that by hand for each one is why programs stall at the size of their staff.',
    cards: WHY_CARDS,
  },
  gets: {
    eyebrow: 'WHAT EACH BUSINESS GETS',
    heading: 'What does each business in your program get?',
    lead: 'Each owner gets a co-founder that knows their business. Depending on the plan, that includes:',
    items: BUSINESS_GETS,
    planLine: PLAN_LINE,
    pricingHref: '/business/pricing',
    pricingLabel: 'See plans and pricing',
  },
  fit: {
    eyebrow: 'TWO WAYS TO USE IT',
    heading: 'How can Moil fit the programs you already run?',
    copy: `Use it as a resource you offer, as part of an incentive you already give, or both. ${USE_CASE_NOTE}`,
    cases: USE_CASES,
    cta: 'Tell us about your program',
  },
  steps: {
    eyebrow: 'HOW IT WORKS',
    heading: 'What does getting started look like?',
    copy: 'A short conversation, a clear agreement on who is covered, and a first group working with real output.',
    items: STEPS,
  },
  cost: {
    eyebrow: 'THE COST CASE',
    heading: 'How does the cost compare with doing it by hand?',
    lead: 'Both figures below are monthly. List price is shown for scale. Partner pricing is set per program.',
    agencyLabel: 'One business, with an agency',
    agencyRange: COST_EXAMPLE.agencyRange,
    agencyNote: 'The usual range for a small-business social and content retainer.',
    moilLabel: `${COST_EXAMPLE.businesses} businesses, with Moil`,
    moilTotal: COST_EXAMPLE.total,
    moilNote: 'At list price on Market Pro, the higher of the two plans.',
    noteBefore: 'An agency also gives judgement and accountability, which Moil does not. Read the ',
    compareHref: '/compare/moil-vs-agency',
    compareLabel: 'full comparison with a marketing agency',
  },
  partners: {
    eyebrow: 'COMMUNITY PARTNERS',
    heading: 'Who already partners with Moil?',
    copy: 'Our community partners are already close to the business owners shaping their local economies. Moil helps make the next step more practical.',
    visitAriaPrefix: 'Visit',
    visitLabel: 'Visit organization',
    cards: [
      {
        kind: 'CHAMBER PARTNER',
        location: 'Queen Creek, Arizona',
        copy: 'Queen Creek’s business community connector, bringing local organizations together through resources, advocacy, workforce support, and meaningful relationships.',
        logoAlt: 'Queen Creek Chamber of Commerce logo',
      },
      {
        kind: 'EDC PARTNER',
        location: 'Buda, Texas',
        copy: 'Buda’s economic-development organization, championing carefully managed growth, entrepreneurship, and a business community rooted in people and place.',
        logoAlt: 'Buda Economic Development Corporation logo',
      },
    ],
  },
  limits: {
    eyebrow: 'HONEST LIMITS',
    heading: 'What does Moil not do?',
    lead: 'A partnership works best when you know where Moil stops.',
    items: LIMITS,
  },
  faq: {
    eyebrow: 'QUESTIONS PARTNERS ASK',
    heading: 'Direct answers for program leaders.',
    copy: 'Not here? Send us the question and we will answer it plainly.',
    items: FAQS,
  },
  relatedLabel: 'Related pages',
  links: PARTNER_LINKS,
  final: {
    eyebrow: "LET'S MAKE IT USEFUL",
    heading: 'Start with the owners you want to help most.',
    copy: 'Tell us about your community, the businesses you support, and the work that keeps getting stuck. We will explore whether a Moil partnership can make that work lighter.',
    cta: 'Talk to Moil',
  },
};
