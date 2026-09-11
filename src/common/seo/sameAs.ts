/**
 * Moil's public profiles — the ONE list.
 *
 * Read by the Organization `sameAs` arrays in app/layout.tsx and
 * app/business/layout.tsx, and by SiteFooter's rel="me" links. The three used
 * to be hand-copied with a comment asking that they be kept identical; a
 * typo in any one (e.g. /moil-app vs /moilapp on LinkedIn) breaks the
 * entity-disambiguation signal that keeps Google from confusing Moil with
 * MOIL Limited. sameAs MUST exactly match the canonical URLs Google has
 * indexed for each profile (verified Apr 2026).
 *
 * Plan WS4.2: add G2, Google Business Profile, Crunchbase and Product Hunt
 * here ONLY once each listing is live — a sameAs to a 404 is worse than none.
 */
export const SOCIAL_PROFILES = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/moilapp', label: 'Moil on LinkedIn' },
  { name: 'X', href: 'https://x.com/MoilApp', label: 'Moil on X (Twitter)' },
  { name: 'Instagram', href: 'https://www.instagram.com/themoilapp/', label: 'Moil on Instagram' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@moilapp', label: 'Moil on TikTok' },
  { name: 'Facebook', href: 'https://www.facebook.com/MoilWorks/', label: 'Moil on Facebook' },
] as const;

/** The schema.org Organization.sameAs value. */
export const SAME_AS: readonly string[] = SOCIAL_PROFILES.map((p) => p.href);
