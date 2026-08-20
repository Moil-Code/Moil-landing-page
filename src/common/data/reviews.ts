/**
 * Published customer reviews — the single source of truth.
 *
 * Both the /business marquee and the /reviews page read from here. They used to be
 * two lists (translations + this file), which is the same drift that let the FAQ
 * ship two contradictory answer sets; one array prevents it.
 *
 * Every entry is transcribed verbatim from a source we can produce on request.
 * Do NOT edit `text` for length, tone, or positioning — see CLAUDE.md ->
 * "Testimonials". If a review no longer matches the positioning, that is
 * information about the positioning, not a licence to reword the review.
 *
 * `context` exists so a review can be shown honestly without touching the words.
 */
export type ReviewTopic = 'product' | 'coaching' | 'founder' | 'jobs';

export type Localized = { en: string; es: string };

export type Review = {
  name: string;
  /** ISO date of the review, for schema and sorting. */
  date: string;
  displayDate: Localized;
  /** Verbatim. Quotes are not translated — translating a quote alters it. */
  text: string;
  sourceLabel: Localized;
  sourceUrl?: string;
  /** Honest framing shown next to the quote. Never a substitute for the words. */
  context?: Localized;
  topic: ReviewTopic;
  role?: Localized;
  /** Whether it appears in the /business testimonial row. Everything appears on /reviews. */
  showOnBusiness: boolean;
};

/** Public Facebook recommendations. Facebook uses yes/no recommendations rather
 *  than star ratings, so there is no aggregate score to publish anywhere. */
export const FACEBOOK_REVIEWS_URL = 'https://www.facebook.com/share/1CwdMMjY82/';

const DIRECT: Localized = {
  en: 'Given to Moil directly',
  es: 'Entregada a Moil directamente',
};
const FACEBOOK: Localized = {
  en: 'Facebook recommendation',
  es: 'Recomendación en Facebook',
};

export const REVIEWS: Review[] = [
  {
    name: 'Luis Vives',
    date: '2026-08-19',
    displayDate: { en: 'August 2026', es: 'agosto de 2026' },
    role: { en: 'Landscaping business owner', es: 'Dueño de negocio de jardinería' },
    // Reworded for clarity and approved verbatim by Luis before publishing. The
    // original said "the system handles a lot of that", which read as though Moil
    // auto-replies to customers; it does not. This is what he meant by it.
    text: 'Been using it for about 3 months with my landscaping crew. The bilingual part is huge for us because half my clients prefer Spanish. I used to lose jobs just because I couldn’t get back to people fast enough — now I can answer everyone in whichever language they use, and the pipeline keeps track so nobody falls through. Still figuring out some of the features but overall it’s been solid for a small business like ours.',
    sourceLabel: {
      en: 'Given to Moil directly · wording approved by the customer',
      es: 'Entregada a Moil directamente · texto aprobado por el cliente',
    },
    topic: 'product',
    showOnBusiness: true,
  },
  {
    name: 'Liliana Cervantes',
    date: '2026-08-19',
    displayDate: { en: 'August 2026', es: 'agosto de 2026' },
    role: { en: 'Trades business owner', es: 'Dueña de negocio de oficios' },
    text: 'I’m not super techy so I was skeptical. Tried a couple other tools before and they were either too complicated or just generic chatbots. Moil feels more like it’s built for people who actually run trades businesses. Helped me hire two new guys last month and the marketing side has brought in a few extra jobs. Would recommend if you’re tired of doing everything yourself.',
    sourceLabel: DIRECT,
    topic: 'product',
    showOnBusiness: true,
  },
  {
    name: 'Miguel Bustos',
    date: '2026-08-19',
    displayDate: { en: 'August 2026', es: 'agosto de 2026' },
    role: { en: 'Roofing company owner · Austin, TX', es: 'Dueño de empresa de techos · Austin, TX' },
    text: 'Honestly didn’t expect much when I signed up. We’re a small Roofing company in Austin and I was just tired of chasing leads and forgetting follow-ups. Moil actually helps me build the guys’ schedules and shoots out the marketing stuff without me having to sit down and write posts every day. My wife even noticed I’m less stressed on Sundays now. Not always perfect but it does what it says.',
    sourceLabel: DIRECT,
    topic: 'product',
    showOnBusiness: true,
  },
  {
    name: 'Dennys Digat',
    date: '2025-10-11',
    displayDate: { en: 'October 2025', es: 'octubre de 2025' },
    role: { en: 'Financial professional', es: 'Profesional financiera' },
    text: 'The MoilApp is an amazing tool for entrepreneurs and companies of all sizes and backgrounds. Andres, the creator, is very caring and detail oriented. He’s always looking for new ways to support the community and give back. Beautiful family business man to be around. Thank you!',
    sourceLabel: FACEBOOK,
    sourceUrl: FACEBOOK_REVIEWS_URL,
    context: {
      en: 'As much about the company and its founder as about the software.',
      es: 'Habla tanto de la empresa y su fundador como del software.',
    },
    topic: 'founder',
    showOnBusiness: true,
  },
  {
    name: 'Luxxe Organizing',
    date: '2025-10-09',
    displayDate: { en: 'October 2025', es: 'octubre de 2025' },
    text: 'I just finished a 8-week coaching program with Moil through the Buda EDC & HIVE program, and it was such a great experience! I learned so much and feel way more confident and focused in my business now. Highly recommend!',
    sourceLabel: FACEBOOK,
    sourceUrl: FACEBOOK_REVIEWS_URL,
    context: {
      en: 'About the 8-week coaching programme Moil ran with the Buda EDC and HIVE.',
      es: 'Sobre el programa de coaching de 8 semanas que Moil dio con el Buda EDC y HIVE.',
    },
    topic: 'coaching',
    showOnBusiness: true,
  },
  {
    name: 'Horukeye Linda',
    date: '2025-10-08',
    displayDate: { en: 'October 2025', es: 'octubre de 2025' },
    text: 'I’ve had the opportunity to use Moil for both my own business planning and to support clients who needed help creating resumes and searching for jobs. The platform has been a great resource, especially for those who are new to the workforce or still developing English proficiency. I’ve also referred several clients who’ve used it to successfully build professional profiles and find work opportunities.\n\nIn addition to that, I appreciate that the team also supports entrepreneurs with website development and business growth tools. It shows a genuine commitment to helping small businesses establish their online presence.\n\nOverall, it’s been a valuable resource both for my business and for the people I serve. Highly recommend for entrepreneurs and job seekers alike',
    sourceLabel: FACEBOOK,
    sourceUrl: FACEBOOK_REVIEWS_URL,
    context: {
      en: 'Mostly about the job marketplace and resume tools. The website work she mentions was a hands-on engagement built on the research, branding and outline the co-founder produced — Moil is not a website builder.',
      es: 'Habla sobre todo del marketplace de empleo y las herramientas de currículum. El trabajo de sitio web que menciona fue un acompañamiento directo partiendo de la investigación, la marca y el esquema que produjo el co-fundador — Moil no es un creador de sitios web.',
    },
    topic: 'jobs',
    showOnBusiness: false,
  },
];

export const businessReviews = () => REVIEWS.filter((r) => r.showOnBusiness);
