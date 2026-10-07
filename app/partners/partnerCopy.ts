/**
 * The shape of everything the partners page says, in one language.
 *
 * /partners and /es/aliados render the SAME component (PartnersBody) from two
 * instances of this type, so the two languages cannot grow different layouts,
 * different schema or different claims. A key missing from the Spanish object
 * is a type error, not a silently English heading.
 */

import type { AeoFaq } from '../compare/aeoLocks';

/** Facts about the two real partner organizations. The same in both languages. */
export const PARTNER_ORGS = [
  {
    number: '01',
    name: 'Queen Creek Chamber of Commerce',
    href: 'https://queencreekchamber.com/',
    logo: '/partners/queen-creek-chamber-logo.png',
    brand: 'queenCreek',
  },
  {
    number: '02',
    name: 'Buda Economic Development Corporation',
    href: 'https://www.budaedc.com/',
    logo: '/partners/buda-edc-logo.svg',
    brand: 'budaEdc',
  },
] as const;

/** The words that differ per language for each partner card, in PARTNER_ORGS order. */
export type PartnerCardText = { kind: string; location: string; copy: string; logoAlt: string };

export type PartnerCopy = {
  lang: 'en' | 'es';
  /** BCP 47 for schema `inLanguage`. */
  inLanguage: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** Path of this page, e.g. '/partners'. */
  path: string;
  meta: { title: string; description: string; ogImageAlt: string; siteName: string };
  breadcrumb: { home: string; page: string };
  service: { name: string; serviceType: string; audienceType: string };
  /** Subject prefilled in the inquiry form. */
  inquirySubject: string;

  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    answer: string;
    cta: string;
    secondary: string;
    proofLead: string;
    proofLink: string;
  };

  why: { eyebrow: string; heading: string; copy: string; cards: readonly { title: string; copy: string }[] };

  gets: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: readonly string[];
    planLine: string;
    pricingHref: string;
    pricingLabel: string;
  };

  fit: {
    eyebrow: string;
    heading: string;
    copy: string;
    cases: readonly { kicker: string; title: string; copy: string; fits: string }[];
    cta: string;
  };

  steps: {
    eyebrow: string;
    heading: string;
    copy: string;
    items: readonly (readonly [string, string, string])[];
  };

  cost: {
    eyebrow: string;
    heading: string;
    lead: string;
    agencyLabel: string;
    agencyRange: string;
    agencyNote: string;
    moilLabel: string;
    moilTotal: string;
    moilNote: string;
    noteBefore: string;
    compareHref: string;
    compareLabel: string;
  };

  partners: {
    eyebrow: string;
    heading: string;
    copy: string;
    visitAriaPrefix: string;
    visitLabel: string;
    cards: readonly [PartnerCardText, PartnerCardText];
  };

  limits: { eyebrow: string; heading: string; lead: string; items: readonly string[] };

  faq: { eyebrow: string; heading: string; copy: string; items: AeoFaq[] };

  relatedLabel: string;
  links: readonly { label: string; href: string }[];

  final: { eyebrow: string; heading: string; copy: string; cta: string };
};
