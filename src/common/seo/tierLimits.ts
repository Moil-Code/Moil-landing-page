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
 * Pinned from: Business-plan-Staging/utils/planLimits.js (2026-09-17)
 *   professional  postsPerWeek 3 · generatedPhotosPerWeek 3 · brollReelsPerWeek 0
 *                 generativeVideosPerMonth 0 · autoPromote false · platforms IG+FB
 *   marketing_pro postsPerWeek 7 · generatedPhotosPerWeek 7 · brollReelsPerWeek 3
 *                 generativeVideosPerMonth 12 · autoPromote true
 *                 platforms IG+FB+TikTok+YouTube
 *
 * TWO DIFFERENT QUESTIONS LIVE HERE AND THE COPY MUST NOT BLEND THEM.
 * "Where can this tier PUBLISH" (`TierLimits.platforms`) and "where does the
 * AUTOMATIC month go" (`AUTOPILOT_PLATFORMS`) stopped having the same answer
 * on the backend's 2026-09-14 cut, and this file said the opposite of the
 * truth on both: it claimed LinkedIn — which publishes NOWHERE, it is built
 * and locked behind SOCIAL_APPROVED_PLATFORMS — and it did not know that
 * TikTok and YouTube had gone live. Stale in both directions at once, which
 * is the shape that survives review: the over-claim reads as a feature and
 * the under-claim reads as modesty.
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
    platforms: ['instagram', 'facebook', 'tiktok', 'youtube'],
  },
};

/**
 * The networks the AUTOMATIC month actually goes out to — a pin of the backend's
 * `dropTargets.PROMOTABLE_PLATFORMS`, which is what `_runWeeklyDropForUser`
 * reads as its `stageable` set (moil360Agent.service.js).
 *
 * It is deliberately NOT `TIER_LIMITS.marketPro.platforms`. Autopilot can only
 * stage a network whose PROMOTE branch can finish unattended, and the backend
 * derives that set as `META_PLATFORMS + NON_META_PROMOTABLE filtered by
 * isPublishable` — so TikTok and YouTube are publishable and NOT promotable
 * (`platform_manual_only`), and LinkedIn has a promote branch but is not
 * publishable, which removes it from both. Naming a publish-only network as an
 * autopilot destination promises a founder a post that nothing will send.
 *
 * It is also not `socialPlatforms.FAN_OUT_ALIASES.both` — that constant is the
 * frozen stored meaning of the legacy `platform: 'both'` string, i.e. what a
 * PAST choice meant, not where the month goes.
 */
export const AUTOPILOT_PLATFORMS: readonly string[] = ['instagram', 'facebook'];

/**
 * Display names. A label is a VOCABULARY, never a claim — `linkedin` keeps one
 * although nothing publishes there, so the day it is promoted the copy renders
 * a name rather than a raw id.
 */
export const PLATFORM_LABELS: Readonly<Record<string, string>> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

/**
 * Built and connectable, but publishing NOWHERE today — the honest limit that
 * has to travel with any claim about publishing, or the next correction is a
 * founder expecting a post that never goes out. Pin of the backend's
 * `socialPlatforms.GATED_PLATFORMS`.
 */
export const GATED_NETWORKS: readonly string[] = ['linkedin'];

const label = (p: string) => PLATFORM_LABELS[p] ?? p;

/** Every network a founder can publish to today, widest tier first. */
export function publishNetworks(): string[] {
  return TIER_LIMITS.marketPro.platforms.map(label);
}

/** The honest limit, for the surfaces that make a publishing claim. */
export function gatedNetworks(): string[] {
  return GATED_NETWORKS.map(label);
}

/**
 * Networks Market Pro can PUBLISH to that Professional cannot. This is a real
 * $75-only differentiator and it is NOT an autopilot claim: these are posts the
 * founder sends from the studio, so the copy that names them must say so.
 */
export function marketProExtraPublishNetworks(): string[] {
  const pro = new Set(TIER_LIMITS.professional.platforms);
  return TIER_LIMITS.marketPro.platforms.filter((p) => !pro.has(p)).map(label);
}

/** Networks the automatic month reaches that Professional does not. */
export function marketProExtraNetworks(): string[] {
  const pro = new Set(TIER_LIMITS.professional.platforms);
  return AUTOPILOT_PLATFORMS.filter((p) => !pro.has(p)).map(label);
}
