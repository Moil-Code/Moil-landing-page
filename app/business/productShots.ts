// ─────────────────────────────────────────────────────────────────────────────
// Product screenshot slots for the business landing page.
//
// This is the SINGLE place to wire real screenshots. Each slot below renders a
// CSS mockup placeholder until a screenshot URL is supplied here — at which point
// <ProductShot> swaps in a framed, theme-aware, CLS-safe next/image.
//
// To go live with a real capture:
//   1. Upload the screenshot to Cloudinary (res.cloudinary.com is already an
//      allowed remote host — see next.config.js). Export at the listed width/height
//      so AVIF/WebP + responsive sizing kick in automatically.
//   2. Paste the URL into `srcLight` (and optionally `srcDark` for a dark-theme
//      capture — if omitted, the light shot is used for both themes).
//   3. That's it. The placeholder is replaced automatically.
//
// Keep width/height accurate to the export — they reserve layout space and prevent
// cumulative layout shift (CLS), which protects the LCP/AEO work already done here.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductShotSource {
  /** Screenshot URL for light theme. Also the fallback for dark if `srcDark` is unset. */
  srcLight?: string;
  /** Optional dark-theme capture. Falls back to `srcLight` when omitted. */
  srcDark?: string;
  /** Intrinsic export width in px — required to reserve space and avoid CLS. */
  width: number;
  /** Intrinsic export height in px — required to reserve space and avoid CLS. */
  height: number;
}

export const productShots: Record<string, ProductShotSource> = {
  // CAPABILITIES → Moil360 — the content calendar with real posts/thumbnails.
  content360: { srcLight: '/Moil360_top.jpg', width: 3010, height: 1470 },

  // JOURNEY — an actual AI conversation producing a market-research result.
  journeyChat: { srcLight: '/Business_coach_chat.jpg', width: 3024, height: 1508 },

  // HIRING — the candidate-matching screen with real match scores.
  hiringCandidates: { srcLight: '/job_post.jpg', width: 1120, height: 1186 },

  // IDENTITY / AI co-founder — real product screens: market research + business plan.
  identityResearch: { srcLight: '/market_research.jpg', width: 3022, height: 1506 },
  identityPlan: { srcLight: '/Business_plan.jpg', width: 3024, height: 1494 },

  // NOTE: the BILINGUAL section uses a bespoke before/after slider
  // (components/BilingualSlider.tsx) with /English.png + /spanish.png,
  // not a ProductShot slot.
};
