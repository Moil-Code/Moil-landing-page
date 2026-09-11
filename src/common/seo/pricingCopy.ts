/**
 * Every prose sentence on this site that says what $25 or $75 buys, in one
 * place per language.
 *
 * Why this file exists (2026-09-05): seven surfaces said Professional was "$25
 * if you want the research, plan and documents WITHOUT the month" while twelve
 * said the opposite — that the "30-day calendar" came "from $25". Both were
 * hand-typed drift from the day `offers.ts` pulled the schema.org Offer bodies
 * into one file and left the prose behind. An entity whose own pages disagree
 * about its price is a low-confidence entity to a retrieval system, and a
 * founder who reads both pages reads one of them as a lie.
 *
 * Rules, all pinned by `evals/pricingCopy.test.js`:
 *   - No number is typed here. Prices come from `offers.ts` (`PLANS`), the
 *     quantities from `tierLimits.ts` (the backend pin). A sentence can only
 *     ever be as wrong as those two files.
 *   - No network is named for the $25 tier. The backend lets Professional
 *     publish to Instagram and Facebook by hand today; whether the $25 tier
 *     should be single-network is an open owner call (plan WS1.0), and copy
 *     that says neither number cannot need rewriting when it is made.
 *   - The Market Pro line names an extra network only when the AUTOMATIC
 *     month actually reaches one Professional does not (`marketProExtraNetworks`).
 *     Today that set is empty, so the clause is omitted — never rendered blank.
 *   - "A taste of the studio" / "una probadita del estudio" is the product's
 *     own word for the $25 tier (backend `tasteWeek.js`). It is honest about
 *     $25 and sells $75 without describing $25 by what it lacks.
 *     "probadita" is deliberate US/Mexican register for the Hispanic trades
 *     audience; the human Spanish review may swap it for "una muestra".
 *
 * Meta descriptions are kept at or under 155 characters (the eval measures).
 */

import { PLANS } from './offers';
import { TIER_LIMITS, marketProExtraNetworks } from './tierLimits';

export type CopyLang = 'en' | 'es';

const pro = `$${PLANS.professional.price}`;
const mp = `$${PLANS.marketPro.price}`;
const proPosts = TIER_LIMITS.professional.postsPerWeek;
const mpPosts = TIER_LIMITS.marketPro.postsPerWeek;

function joinNames(names: string[], and: string): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} ${and} ${names[names.length - 1]}`;
}

/** "LinkedIn as well as Instagram and Facebook, " — or nothing at all. */
function extraNetworksClause(lang: CopyLang): string {
  const extra = marketProExtraNetworks();
  if (extra.length === 0) return '';
  return lang === 'en'
    ? `${joinNames(extra, 'and')} as well as Instagram and Facebook, `
    : `${joinNames(extra, 'y')} además de Instagram y Facebook, `;
}

export type PricingCopy = {
  /** ≤155 chars. The site-wide default and the /business meta description. */
  meta: string;
  /** ≤155 chars. The pricing page meta description. */
  metaPricing: string;
  /** The full Professional sentence, on-page. */
  professional: string;
  /** The full Market Pro sentence, on-page. */
  marketPro: string;
  /** One line that states the split, for surfaces that only get one sentence. */
  split: string;
  /** Pricing-card taglines. */
  professionalTagline: string;
  marketProTagline: string;
  /** The Professional feature bullet that replaced "Without the month of content". */
  professionalFeature: string;
  /** The Market Pro feature bullet at the top of its card. */
  marketProFeature: string;
  /** FAQ answer to "How much does Moil cost?". */
  faqCost: string;
  /** The tiers-section line in the "what Moil made" list. */
  madeItem: string;
  /** The trust chip that names both prices. */
  trustBoth: string;
  /** The final-CTA subheadline. */
  finalCta: string;
  /** The three-guides sentence. */
  guides: string;
  /** The pricing hero sub / pricing section subheadline. */
  heroSub: string;
  /** The one-paragraph entity sentence used by /about, /ai-info and the compare pages. */
  entityPrice: string;
};

export const pricingCopy: Readonly<Record<CopyLang, PricingCopy>> = {
  en: {
    meta: `Moil, the AI co-founder for small business owners: research, a real plan, and a taste of the studio. ${pro}/mo. The whole month written for you: ${mp}.`,
    metaPricing: `Professional, ${pro} a month: research, a plan, documents and a taste of the studio. Market Pro, ${mp}: Moil360 writes your whole month. English and Spanish.`,
    professional: `Professional, ${pro} a month: the co-founder — research, a plan you can take to a lender, coaching and documents — plus a taste of the studio: ${proPosts} posts a week with generated images, which you approve and publish yourself. No automatic month, no video, no carousels.`,
    marketPro: `Market Pro, ${mp} a month: everything in Professional, and Moil360 writes your whole month — ${mpPosts} posts a week, carousels, video, ${extraNetworksClause('en')}and publishing on autopilot.`,
    split: `Professional is ${pro} a month; the whole month written for you is Market Pro at ${mp}.`,
    professionalTagline: `Professional ${pro}: research, plan and documents, plus a taste of the studio.`,
    marketProTagline: `Market Pro ${mp}: the whole month written for you, plus research, plans and documents.`,
    professionalFeature: `A taste of the studio: ${proPosts} posts a week, with images, that you approve and publish`,
    marketProFeature: `The whole month written for you: ${mpPosts} posts a week, on brand`,
    faqCost: `Market Pro is ${mp} a month: the whole month written for you, plus the work — research, plans, documents. Professional is ${pro} a month: the research, plan and documents, plus a taste of the studio. The first conversation is free and needs no card.`,
    madeItem: `Market Pro is ${mp}. Professional is ${pro}: the work, plus a taste of the studio.`,
    trustBoth: `Professional ${pro} · Market Pro ${mp}`,
    finalCta: `Your business plan, your market research, and a taste of the studio from ${pro} a month. The whole month written for you at ${mp}. In English and Spanish.`,
    guides: `Guides: how to write the plan, which AI plan generator to use, and how a month of content gets written — Professional ${pro}/month, the whole month on Market Pro ${mp}/month.`,
    heroSub: `Market Pro is the AI co-founder: learns once, thinks with you, does the work, and writes the month in English or Spanish. Professional is ${pro} a month for the research, plan and documents, plus a taste of the studio.`,
    entityPrice: `Professional is ${pro} a month; the whole month written for you is Market Pro at ${mp}.`,
  },
  es: {
    meta: `Moil, el socio de IA para dueños de negocio: investigación, un plan real y una probadita del estudio. ${pro}/mes. El mes completo escrito para ti: ${mp}.`,
    metaPricing: `Professional, ${pro} al mes: investigación, plan, documentos y una probadita del estudio. Market Pro, ${mp}: Moil360 escribe tu mes completo. Inglés y español.`,
    professional: `Professional, ${pro} al mes: el socio — investigación, un plan que puedes llevar al banco, asesoría y documentos — más una probadita del estudio: ${proPosts} publicaciones a la semana con imágenes generadas, que tú apruebas y publicas. Sin mes automático, sin video, sin carruseles.`,
    marketPro: `Market Pro, ${mp} al mes: todo lo de Professional, y Moil360 escribe tu mes completo: ${mpPosts} publicaciones a la semana, carruseles, video, ${extraNetworksClause('es')}y publicación en piloto automático.`,
    split: `Professional es ${pro} al mes; el mes completo escrito para ti es Market Pro a ${mp}.`,
    professionalTagline: `Professional ${pro}: la investigación, el plan y los documentos, más una probadita del estudio.`,
    marketProTagline: `Market Pro ${mp}: el mes completo escrito para ti, más la investigación, los planes y los documentos.`,
    professionalFeature: `Una probadita del estudio: ${proPosts} publicaciones a la semana, con imágenes, que tú apruebas y publicas`,
    marketProFeature: `El mes completo escrito para ti: ${mpPosts} publicaciones a la semana, con tu marca`,
    faqCost: `Market Pro es ${mp} al mes: el mes completo escrito para ti, más el trabajo — investigación, planes, documentos. Professional es ${pro} al mes: la investigación, el plan y los documentos, más una probadita del estudio. La primera conversación es gratis y no pide tarjeta.`,
    madeItem: `Market Pro es ${mp}. Professional es ${pro}: el trabajo, más una probadita del estudio.`,
    trustBoth: `Professional ${pro} · Market Pro ${mp}`,
    finalCta: `Tu plan de negocios, tu investigación de mercado y una probadita del estudio desde ${pro} al mes. El mes completo escrito para ti por ${mp}. En inglés y español.`,
    guides: `Guías: cómo escribir el plan, qué generador de planes con IA usar, y cómo se escribe un mes de contenido — Professional ${pro}/mes, el mes completo en Market Pro ${mp}/mes.`,
    heroSub: `Market Pro es el socio: aprende una vez, piensa contigo, hace el trabajo y escribe el mes en inglés o en español. Professional es ${pro} al mes por la investigación, el plan y los documentos, más una probadita del estudio.`,
    entityPrice: `Professional es ${pro} al mes; el mes completo escrito para ti es Market Pro a ${mp}.`,
  },
};

/** The English meta as a string constant, for `metadata` objects that need one. */
export const META_EN = pricingCopy.en.meta;
export const META_ES = pricingCopy.es.meta;
