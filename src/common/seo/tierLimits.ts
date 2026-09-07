/**
 * What each tier QUANTITATIVELY buys — a committed copy of the backend's
 * `utils/planLimits.js` (Business-plan-Staging), which is the only thing that
 * enforces these numbers. Every sentence on this site that names a quantity
 * ("3 posts a week", "no video") reads it from here, never types it, so the
 * copy can only ever drift as far as this file — and `evals/pricingCopy.test.js`
 * compares this file to the committed backend pin (always) and to the live
 * sibling checkout (when one is present, skipping LOUDLY when it is not).
 *
 * Why the numbers are here and not fetched: the landing is a static marketing
 * site with no backend call on the page path, and a claim about price is not
 * something to leave to a request that can fail. A pin that is checked beats a
 * fetch that is not.
 *
 * Pinned from: Business-plan-Staging/utils/planLimits.js (2026-09-06)
 *   professional  postsPerWeek 3 · generatedPhotosPerWeek 3 · brollReelsPerWeek 0
 *                 generativeVideosPerMonth 0 · autoPromote false · platforms IG+FB
 *   marketing_pro postsPerWeek 7 · generatedPhotosPerWeek 7 · brollReelsPerWeek 3
 *                 generativeVideosPerMonth 12 · autoPromote true · platforms all
 */

export type TierId = 'professional' | 'marketPro';

export type TierLimits = {
  /** Posts a week the studio (Professional) or Autopilot (Market Pro) produces. */
  postsPerWeek: number;
  generatedPhotosPerWeek: number;
  brollReelsPerWeek: number;
  generativeVideosPerMonth: number;
  /** Autopilot publishes with no human in the loop. */
  autoPromote: boolean;
  /** Carousel generation is a Market Pro capability (FE `marketPro` gate). */
  carousels: boolean;
  /**
   * Networks the tier's PUBLISH path may reach. Professional is the two it was
   * sold against; Market Pro is every network the backend's scheduler can
   * serve (`socialPlatforms.PUBLISHABLE_PLATFORMS`).
   */
  platforms: readonly string[];
};

export const TIER_LIMITS: Readonly<Record<TierId, TierLimits>> = {
  professional: {
    postsPerWeek: 3,
    generatedPhotosPerWeek: 3,
    brollReelsPerWeek: 0,
    generativeVideosPerMonth: 0,
    autoPromote: false,
    carousels: false,
    platforms: ['instagram', 'facebook'],
  },
  marketPro: {
    postsPerWeek: 7,
    generatedPhotosPerWeek: 7,
    brollReelsPerWeek: 3,
    generativeVideosPerMonth: 12,
    autoPromote: true,
    carousels: true,
    platforms: ['instagram', 'facebook', 'linkedin'],
  },
};

/**
 * The networks the AUTOMATIC month actually goes out to — a pin of the backend's
 * `dropTargets.PROMOTABLE_PLATFORMS`, which is what `_runWeeklyDropForUser`
 * reads as its `stageable` set (moil360Agent.service.js).
 *
 * It is deliberately NOT `socialPlatforms.FAN_OUT_ALIASES.both`. That constant
 * is the frozen stored meaning of the legacy `platform: 'both'` string — the
 * networks a founder picked when "both" meant two — and the backend's own note
 * says so in as many words. It answers a different question from "where does
 * the automatic month go", and the two stopped agreeing on 2026-09-05 when
 * Autopilot learned to promote LinkedIn end to end (backend P3, `dropTargets.js`).
 * Reading the alias made `marketProExtraNetworks()` a control that could never
 * fire — both of its inputs derived from the same frozen pair — so Market Pro's
 * copy silently dropped a real $75-only differentiator.
 *
 * The marketing copy describes the automatic month, so the network it may name
 * as a Market Pro extra is `autopilot minus professional`.
 */
export const AUTOPILOT_PLATFORMS: readonly string[] = ['instagram', 'facebook', 'linkedin'];

export const PLATFORM_LABELS: Readonly<Record<string, string>> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
};

/** Networks the automatic month reaches that Professional does not. */
export function marketProExtraNetworks(): string[] {
  const pro = new Set(TIER_LIMITS.professional.platforms);
  return AUTOPILOT_PLATFORMS.filter((p) => !pro.has(p)).map((p) => PLATFORM_LABELS[p] ?? p);
}
