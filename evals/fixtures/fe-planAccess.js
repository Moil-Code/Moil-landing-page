/*
 * COMMITTED PIN — a verbatim copy of
 *   Moil-Employer-FE-Staging/src/utils/subscriptionHelper/planAccess.js
 * taken 2026-09-06 from branch claude/qa-validation-testing-65lasb.
 * Why a copy: CI has no sibling checkout, and a skip-if-missing check is a
 * check that never runs on the suite that gates merge. evals/pricingCopy.test.js
 * reads this file always and the live sibling when one is present (skipping
 * LOUDLY otherwise), so a stale pin is caught locally even though CI can only
 * check the pin. Refresh by copying the file over this one when planAccess.js
 * changes; do not edit by hand.
 */
/**
 * Plan Access Helper — mirrors the feature flags from planConfig.js on the backend.
 *
 * Feature access per plan tier (Jimmy lock — always sell Market Pro):
 *   Basic (legacy)   → no premium features
 *   Starter          → businessPlan, keywordResearch, businessCoach
 *   Professional     → coach + MANUAL Moil360 studio (`content360`). No Autopilot.
 *   Market Pro       → the FULL product (`marketPro`): Autopilot publishes,
 *                      carousels, video, second language.
 *
 * $25 Professional is the way in: 3 posts/week in the manual studio,
 * 3 generated photographs a week — ENFORCED in the studio since 2026-09-05
 * (backend photoAllowance.js; before that the sold number reached only the
 * Autopilot drop Professional cannot run) — Instagram + Facebook of what
 * they made, video credits 0. It does NOT get a scheduled month, a weekly
 * drop, Autopilot staging, or 4 posts/week — those claims are stale.
 *
 * $75 Market Pro is the full product: 7 calendar slots/week + Autopilot
 * actually publishes, carousels + video. `marketPro` FeatureGates those
 * surfaces, not only the upgrade card. Quantities the server still enforces
 * (`utils/planLimits.js`) are not copied here.
 *
 * What this file owns is the ROUTE / UI gate. Both marketing tiers may open
 * `/moil-360`. Only Market Pro may open Autopilot, video gen, carousel gen.
 */

const PLAN_FEATURES = {
  // ─── BASIC / LEGACY ────────────────────────────
  basic_monthly: {
    businessPlan: false,
    keywordResearch: false,
    businessCoach: false,
    content360: false,
    marketPro: false,
  },
  basic_yearly: {
    businessPlan: false,
    keywordResearch: false,
    businessCoach: false,
    content360: false,
    marketPro: false,
  },

  // ─── STARTER (standard_*) ─────────────────────
  standard_monthly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: false,
    marketPro: false,
  },
  standard_yearly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: false,
    marketPro: false,
  },

  // ─── PROFESSIONAL ─────────────────────────────
  // The $25 base tier: MANUAL studio only. `content360` opens `/moil-360`.
  // `marketPro` stays false — Autopilot, video/b-roll gen, carousel gen,
  // and the second-language toggle are Market Pro.
  // generatedPhotosPerWeek stays 3 on the server; do
  // not flatten this into a caption-only week.
  //
  // `keywordResearch` IS TRUE HERE AND THE THREE COPIES DISAGREE. This
  // comment read "false to match BE" until 2026-09-12, describing the
  // value 65d517cf had already reversed on the line below — and a comment
  // that contradicts the code beside it is the first thing the next reader
  // believes. Measured 2026-09-12: backend routes (planFeatures.js) false,
  // gateway screen (planConfig.js) false, this client fallback true. The
  // flip landed in ONE of three copies, so a Professional founder whose
  // profile predates the server entitlement block is offered a feature the
  // routes then refuse. Settling it is a pricing call and needs all three
  // flipped in one window; the backend's evals/planTierLockstep.test.js is
  // what reports the disagreement.
  //
  // History: both repos read `content360: true` until 2026-08-20 with
  // NOTHING limiting a Professional account (the $25/$75 giveaway); then
  // both read `false` while the boundary was the absence of the studio.
  // It is `true` again because the studio is the $25 product. Autopilot
  // is NOT implied by that flag — `marketPro` is what still separates
  // the tiers here, and FeatureGate on Autopilot/video/carousel is what
  // makes that visible. If this file and the backend ever disagree the
  // failure is loud in one direction and silent in the other.
  professional_monthly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: true,
    marketPro: false,
  },
  professional_yearly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: true,
    marketPro: false,
  },

  // ─── MARKET PRO ───────────────────────────────
  marketing_pro_monthly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: true,
    marketPro: true,
  },
  marketing_pro_yearly: {
    businessPlan: true,
    keywordResearch: true,
    businessCoach: true,
    content360: true,
    marketPro: true,
  },
};

/**
 * Check if a plan has access to a specific feature.
 * @param {string} plan       — employer.plan value e.g. "standard_monthly"
 * @param {string} feature    — one of: "businessPlan", "keywordResearch", "businessCoach", "content360", "marketPro"
 * @returns {boolean}
 */
export function hasFeatureAccess(plan, feature) {
  if (!plan || !PLAN_FEATURES[plan]) return false;
  return PLAN_FEATURES[plan][feature] === true;
}

// Founder-facing plan names, used by the grant banner.
const PLAN_LABELS = {
  basic_monthly: "Basic",
  basic_yearly: "Basic",
  standard_monthly: "Starter",
  standard_yearly: "Starter",
  professional_monthly: "Professional",
  professional_yearly: "Professional",
  marketing_pro_monthly: "Market Pro",
  marketing_pro_yearly: "Market Pro",
};

/**
 * Feature access including any time-boxed plan grant.
 *
 * A founder can hold a base plan plus a temporary tier on top — two months of
 * Market Pro over a standard_yearly partner license. The backend merges the
 * two and returns the result on the employer profile as `entitlement`
 * (recomputed on every read, never cached, because a grant ends on a
 * timestamp).
 *
 * WHEN `entitlement` IS PRESENT IT WINS. When it is absent — an older backend,
 * a partial profile fetch — we fall back to the plan-only rule, which is
 * exactly today's behaviour. Never try to reconstruct a grant client-side:
 * the grant rows are not sent, and guessing would either hide a feature the
 * founder paid for or offer one the server will refuse.
 *
 * This is a UX gate only. `requireFeature` on the backend is the real one —
 * the employer slice is persisted to localStorage and is editable.
 *
 * @param {object} employer  — the employer profile from Redux
 * @param {string} feature
 */
export function hasEntitledFeature(employer, feature) {
  const entitlement = employer?.entitlement;
  if (entitlement && entitlement.features) {
    return entitlement.features[feature] === true;
  }

  // Fallback: plan-only, status-gated, identical to the pre-grant behaviour.
  const status =
    typeof employer?.plan_status === "string"
      ? employer.plan_status.toLowerCase()
      : "";
  const isEntitled =
    status === "active" || status === "trial" || status === "trialing";
  return isEntitled && hasFeatureAccess(employer?.plan, feature);
}

/**
 * True when this founder is on a live plan that is not Market Pro.
 * Used to hide Autopilot / video / carousel / second-language and to
 * FeatureGate those surfaces with an upgrade wall.
 *
 * Signup / login / tests with no employer row return false — do not
 * intercept a language toggle before there is a plan to lock.
 */
export function needsMarketProUpgrade(employer) {
  if (!employer || !(employer.plan || employer.entitlement)) return false;
  return !hasEntitledFeature(employer, "marketPro");
}

/**
 * Second language (ESP / Translate Post / Settings EN|ES) is Market Pro.
 * No live plan yet (signup, login, free) — the toggle is how they pick.
 */
export function hasSecondLanguageAccess(employer) {
  if (hasEntitledFeature(employer, "marketPro")) return true;
  return !needsMarketProUpgrade(employer);
}

/**
 * The active grant a founder should be told about, or null.
 * Used for the "Market Pro until 5 Oct" banner.
 */
export function activeGrantSummary(employer) {
  const entitlement = employer?.entitlement;
  if (!entitlement || !entitlement.hasGrant) return null;
  const grants = entitlement.activeGrants || [];
  if (grants.length === 0) return null;

  // The soonest-ending grant is the one worth counting down to.
  const soonest = grants.reduce((best, g) =>
    !best || new Date(g.expiresAt) < new Date(best.expiresAt) ? g : best
  , null);
  if (!soonest) return null;

  return {
    planKey: soonest.planKey,
    planLabel: PLAN_LABELS[soonest.planKey] || soonest.planKey,
    expiresAt: soonest.expiresAt,
    basePlan: entitlement.basePlan,
    basePlanLabel:
      PLAN_LABELS[entitlement.basePlan] || entitlement.basePlan || null,
    grantCount: grants.length,
  };
}

// Cheapest → dearest. This is an ORDERING CLAIM and it is the only hand-written
// part of getMinPlanForFeature — everything else is read from PLAN_FEATURES, so
// a flag flip cannot leave a label behind. Keep it in lockstep with
// PLAN_TIER_ORDER in the sister repo's utils/planFeatures.js.
const PLAN_TIER_ORDER = [
  "basic_monthly",
  "standard_monthly",
  "professional_monthly",
  "marketing_pro_monthly",
];

/**
 * Get a user-friendly minimum plan name needed for a feature.
 *
 * DERIVED, never stored. This was a literal map, and its own comment recorded
 * that it had been wrong in BOTH directions for content360: it read
 * "Professional" while Professional did NOT carry the feature (sending a
 * founder to buy a $25 plan that hits the same wall), then "Market Pro" after
 * the flag was pulled back, and it had to be corrected by hand AGAIN at the
 * pricing cutover when Professional gained the feature for real. Three edits,
 * each one a separate chance to forget — and forgetting is silent, because a
 * wrong upgrade path renders perfectly.
 *
 * It answers the same question PLAN_FEATURES already answers, so it reads it:
 * the first tier in price order whose flags include the feature, rendered
 * through PLAN_LABELS. Flipping content360 for professional_* now moves this
 * string with no second edit.
 *
 * An unknown feature falls back to "Starter" exactly as before — the cheapest
 * paid tier is the honest answer when we cannot name a requirement, and it
 * never sends anyone to a plan dearer than they need.
 *
 * @param {string} feature
 * @returns {string}
 */
export function getMinPlanForFeature(feature) {
  const key = PLAN_TIER_ORDER.find(
    (plan) => PLAN_FEATURES[plan] && PLAN_FEATURES[plan][feature] === true
  );
  return (key && PLAN_LABELS[key]) || "Starter";
}

export { PLAN_FEATURES, PLAN_LABELS };
