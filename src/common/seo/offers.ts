/**
 * The two Moil offers, in schema.org form, in one place.
 *
 * Why this file exists: the same two Offer objects were hand-written in four
 * files (app/layout.tsx, app/business/layout.tsx, app/candidate/layout.tsx,
 * app/marketing/layout.tsx) with different fields in each copy. None of them
 * carried `url` or `priceValidUntil`, which are the fields Google's Offer
 * validation asks for, so every one of the ~65 crawled pages shipped two
 * invalid Offer items — the single largest contributor to the "98 structured
 * data items are invalid" error in the Aug 2026 Site Audit.
 *
 * It is also the same drift the Blog solved with brand.ts: a price written in
 * four places is a price that will eventually disagree with itself. Change a
 * price here and nowhere else.
 *
 * The DESCRIPTIONS drift the same way the prices did, and worse: these are the
 * strings an answer engine quotes back as fact. Both said Professional had no
 * scheduled month, which stopped being true on 2026-08-30 when the tier
 * boundary moved from the FEATURE to the DENSITIES (4 posts a week reviewed vs
 * 7 published automatically — Business-plan-Staging/utils/planLimits.js).
 * Neither names a network the product cannot publish to.
 */

import { baseURL1 } from '../constants/baseUrl';

export const PRICING_URL = `${baseURL1}/business/pricing`;

/**
 * `priceValidUntil` is required for a valid Offer, and a hardcoded date silently
 * turns the markup invalid the day it passes. Every route in this app is
 * server-rendered on demand, so computing it per render keeps it permanently a
 * year out instead of permanently expiring.
 */
export function priceValidUntil(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

type PlanKey = 'professional' | 'marketPro';

const PLANS: Record<PlanKey, { name: string; price: string; description: string; unitDescription: string }> = {
  professional: {
    name: 'Moil Professional',
    price: '25',
    description:
      'Professional $25/month — a scheduled month of content at four posts a week on Instagram and Facebook, which you approve before anything publishes, plus the AI co-founder: research, plans, documents, brand assets, flyers, decks.',
    unitDescription: 'A month at four posts a week, plus anything you ask for',
  },
  marketPro: {
    name: 'Moil Market Pro',
    price: '75',
    description:
      'Market Pro $75/month — a post every day on Instagram and Facebook, published for you with no review step, plus unlimited AI images, 15 video credits a month, and the AI co-founder.',
    unitDescription: 'A post a day, published for you',
  },
};

/**
 * A complete, valid schema.org Offer. Every field Google checks is present:
 * price, priceCurrency, availability, url, priceValidUntil, and a seller.
 */
export function moilOffer(plan: PlanKey) {
  const p = PLANS[plan];
  return {
    '@type': 'Offer',
    name: p.name,
    description: p.description,
    price: p.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: PRICING_URL,
    priceValidUntil: priceValidUntil(),
    category: 'Business Software',
    seller: {
      '@type': 'Organization',
      name: 'Moil Enterprise Inc.',
      url: baseURL1,
    },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: p.price,
      priceCurrency: 'USD',
      billingDuration: 'P1M',
      description: p.unitDescription,
    },
  };
}

/** Both offers, in the order they are sold. */
export function moilOffers() {
  return [moilOffer('professional'), moilOffer('marketPro')];
}

/**
 * The Moil product itself. `/reviews` previously inlined a bare
 * `{'@type':'SoftwareApplication', name:'Moil'}` as the `about` of each
 * Quotation — a SoftwareApplication with neither `applicationCategory` nor
 * `offers` is an invalid item, and there were six of them on that one page.
 */
export function moilSoftwareApplication() {
  return {
    '@type': 'SoftwareApplication',
    name: 'Moil',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${baseURL1}/business`,
    offers: moilOffers(),
  };
}
