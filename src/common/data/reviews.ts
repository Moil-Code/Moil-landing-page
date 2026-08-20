/**
 * Published customer reviews.
 *
 * Every entry is transcribed verbatim from a source we can produce on request.
 * Do not edit the `text` field for length, tone, or positioning — see CLAUDE.md
 * -> "Testimonials". If a review no longer matches how the product is positioned,
 * that is information about the positioning, not a licence to reword the review.
 *
 * `context` exists so a review can be shown honestly without editing it. Luxxe's
 * review is about an 8-week coaching programme run with the Buda EDC and HIVE,
 * not about the software on its own, and the label says so rather than letting
 * the quote imply something it does not claim.
 */
export type ReviewTopic = 'product' | 'coaching' | 'founder' | 'jobs';

export type Review = {
  name: string;
  /** ISO date of the review itself, used for schema and sorting. */
  date: string;
  displayDate: string;
  text: string;
  /** Where it can be verified. */
  sourceLabel: string;
  sourceUrl?: string;
  /** Honest framing shown alongside the quote. Never a substitute for the words. */
  context?: string;
  topic: ReviewTopic;
  role?: string;
};

/** Public Facebook recommendations page. Facebook uses yes/no recommendations
 *  rather than star ratings, so there is no aggregate score to publish here. */
export const FACEBOOK_REVIEWS_URL = 'https://www.facebook.com/share/1CwdMMjY82/';

export const REVIEWS: Review[] = [
  {
    name: 'Luis Vives',
    date: '2026-08-19',
    displayDate: 'August 2026',
    role: 'Landscaping business owner',
    text: 'Been using it for about 3 months with my landscaping crew. The bilingual part is huge for us because half my clients prefer Spanish. I used to lose jobs just because I couldn’t get back to people fast enough — now I can answer everyone in whichever language they use, and the pipeline keeps track so nobody falls through. Still figuring out some of the features but overall it’s been solid for a small business like ours.',
    sourceLabel: 'Given to Moil directly · wording approved by the customer',
    topic: 'product',
  },
  {
    name: 'Liliana Cervantes',
    date: '2026-08-19',
    displayDate: 'August 2026',
    role: 'Trades business owner',
    text: 'I’m not super techy so I was skeptical. Tried a couple other tools before and they were either too complicated or just generic chatbots. Moil feels more like it’s built for people who actually run trades businesses. Helped me hire two new guys last month and the marketing side has brought in a few extra jobs. Would recommend if you’re tired of doing everything yourself.',
    sourceLabel: 'Given to Moil directly',
    topic: 'product',
  },
  {
    name: 'Miguel Bustos',
    date: '2026-08-19',
    displayDate: 'August 2026',
    role: 'Roofing company owner · Austin, TX',
    text: 'Honestly didn’t expect much when I signed up. We’re a small Roofing company in Austin and I was just tired of chasing leads and forgetting follow-ups. Moil actually helps me build the guys’ schedules and shoots out the marketing stuff without me having to sit down and write posts every day. My wife even noticed I’m less stressed on Sundays now. Not always perfect but it does what it says.',
    sourceLabel: 'Given to Moil directly',
    topic: 'product',
  },
  {
    name: 'Luxxe Organizing',
    date: '2025-10-09',
    displayDate: 'October 2025',
    text: 'I just finished a 8-week coaching program with Moil through the Buda EDC & HIVE program, and it was such a great experience! I learned so much and feel way more confident and focused in my business now. Highly recommend!',
    sourceLabel: 'Facebook recommendation',
    sourceUrl: FACEBOOK_REVIEWS_URL,
    context: 'About the 8-week coaching programme Moil ran with the Buda EDC and HIVE, not the software on its own.',
    topic: 'coaching',
  },
  {
    name: 'Dennys Digat',
    date: '2025-10-11',
    displayDate: 'October 2025',
    role: 'Financial professional',
    text: 'The MoilApp is an amazing tool for entrepreneurs and companies of all sizes and backgrounds. Andres, the creator, is very caring and detail oriented. He’s always looking for new ways to support the community and give back. Beautiful family business man to be around. Thank you!',
    sourceLabel: 'Facebook recommendation',
    sourceUrl: FACEBOOK_REVIEWS_URL,
    context: 'About the company and its founder rather than a specific feature.',
    topic: 'founder',
  },
];
