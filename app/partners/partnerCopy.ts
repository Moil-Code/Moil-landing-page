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
    imageAlt: string;
    /** Three short, scannable facts under the lede. Each is stated elsewhere on the page. */
    facts: readonly string[];
  };

  /** The two-field inquiry form shown in the open. */
  quick: {
    lead: string;
    sub: string;
    name: string;
    email: string;
    organization: string;
    send: string;
    sending: string;
    sentTitle: string;
    sentBody: string;
    note: string;
    failed: string;
    /** Message sent when no conference message applies. */
    defaultMessage: string;
  };

  /** One owner, start to finish: the path from a conversation to finished work. */
  flow: {
    eyebrow: string;
    heading: string;
    copy: string;
    items: readonly { label: string; title: string; copy: string }[];
    footnote: string;
  };

  /** The jobs an economic development organization already runs, and what changes in each. */
  jobs: {
    eyebrow: string;
    heading: string;
    copy: string;
    stuckLabel: string;
    moilLabel: string;
    staffLabel: string;
    items: readonly { title: string; stuck: string; moil: string; staff: string }[];
    cta: string;
  };

  /** Present only on the conference landing (/partners/iedc). */
  conference?: {
    eyebrow: string;
    heading: string;
    copy: string;
    points: readonly string[];
    cta: string;
    /** Prefilled into the inquiry form so a visitor can send with only an email. */
    message: string;
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
    perLabel: string;
    perValue: string;
    perNote: string;
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
