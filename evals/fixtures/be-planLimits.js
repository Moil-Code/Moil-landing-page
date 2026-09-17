/*
 * COMMITTED PIN of the backend's tier quantities — what `utils/planLimits.js`
 * (Business-plan-Staging) actually enforces, plus `dropTargets.PROMOTABLE_PLATFORMS`,
 * the networks the automatic month is STAGED AND PROMOTED to (never the frozen
 * `FAN_OUT_ALIASES.both` alias, which answers a different question). Generated from the live sibling on
 * the date below by evals/pricingCopy.test.js's own regen instructions; never
 * edited by hand. Regenerate:
 *   node -e "..." (see the test file) — or copy the numbers after a backend change.
 */
module.exports = {
  "pinnedFrom": "Business-plan-Staging/utils/planLimits.js + service/content360/dropTargets.js",
  "pinnedOn": "2026-09-17",
  "professional": {
    "postsPerWeek": 3,
    "generatedPhotosPerWeek": 3,
    "brollReelsPerWeek": 0,
    "generativeVideosPerMonth": 0,
    "autoPromote": false,
    "platforms": [
      "instagram",
      "facebook"
    ]
  },
  "marketing_pro": {
    "postsPerWeek": 7,
    "generatedPhotosPerWeek": 7,
    "brollReelsPerWeek": 3,
    "generativeVideosPerMonth": 12,
    "autoPromote": true,
    "platforms": [
      "instagram",
      "facebook",
      "tiktok",
      "youtube"
    ]
  },
  "autopilotPlatforms": [
    "instagram",
    "facebook"
  ]
};
