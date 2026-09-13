/**
 * One Organization block for the whole site.
 *
 * Root `app/layout.tsx` emits this once. Nested layouts (business, pricing,
 * compare, …) must NOT emit a second top-level Organization — Google RRT
 * counted 2–3 valid Organization items on money pages and SEMrush still
 * clusters the overlap under "invalid structured data".
 *
 * `numberOfEmployees` is omitted: a string range like "2-10" is an invalid
 * type, and inventing a headcount fails the same bar as inventing ratings.
 * `streetAddress` / `postalCode` stay omitted until COMPANY_ADDRESS holds a
 * real street (see src/common/constants/company.ts) — never invent them.
 */

import { baseURL1 } from '../constants/baseUrl';
import { COMPANY_NAME } from '../constants/company';
import { moilOffers } from './offers';
import { SAME_AS } from './sameAs';

export type MoilOrganizationOptions = {
  /** Root layout includes makesOffer; nested callers should leave this false. */
  includeOffers?: boolean;
};

export function moilOrganization(options: MoilOrganizationOptions = {}) {
  const { includeOffers = false } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    alternateName: 'Moil',
    url: baseURL1,
    logo: {
      '@type': 'ImageObject',
      url: `${baseURL1}/moil-512.png`,
      width: 512,
      height: 512,
    },
    description:
      'Moil builds an AI co-founder for small business owners. It learns a business once, then produces the finished work the owner has no time to make, in English and Spanish.',
    foundingDate: '2023',
    industry: 'Business Software',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buda',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'cs@moilapp.com',
      url: baseURL1,
    },
    sameAs: SAME_AS,
    // Organization takes `makesOffer`, not `offers` — `offers` is a
    // Product/Service property and is silently dropped here.
    ...(includeOffers ? { makesOffer: moilOffers() } : {}),
  };
}
