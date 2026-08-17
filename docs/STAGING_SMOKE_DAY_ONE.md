# Staging smoke — day one (visual only)

Checked: 2026-08-17  
URL: https://moil-landing-page-git-staging-andres-urregos-projects-d325c4bc.vercel.app/business  
Scope: visual check only. No login. No new accounts. Did not open www.moilapp.com or employer-beta. No merge.

## Result: PASS

| Check | Result | What was on screen |
|---|---|---|
| 1. Primary CTA | **PASS** | Orange hero button: `Start free — no credit card →`. Hover destination: `https://business.moilapp.com/register?lg=en`. Button stayed enabled. Not clicked through to registration. |
| 2. Three-door public preview magnet | **PASS** | Card under the hero CTAs with three doors: **Website** / **Google listing** / **Social handle**. Not only a jump to `#journey`. |
| 3. Down-state OK if plan API unset | **PASS** | Preview form is in down-state. Start free remains visible and enabled. |

## Door copy (EN)

- **Website** (default): placeholder `https://yourbusiness.com`. Down-state: `The preview is unavailable right now. You can still start free — no credit card.`
- **Google listing**: `Listing search is unavailable right now. Try a website or a handle.` (plus the same preview-unavailable line)
- **Social handle**: placeholder `@yourbusiness or a profile URL`. Same preview-unavailable down-state as Website.

Magnet submit button still present: `See a preview of your brand`.

## Screenshots

Saved on the agent VM (not committed):

- `/opt/cursor/artifacts/screenshots/staging-business-hero.png` — hero, Website door, Start free, down-state
- `/opt/cursor/artifacts/screenshots/staging-business-google-listing-tab.png` — Google listing door down-state
- `/opt/cursor/artifacts/screenshots/staging-business-social-handle-tab.png` — Social handle door + placeholder
- `/opt/cursor/artifacts/screenshots/staging-business-console.png` — same hero with DevTools; non-blocking 400 / preload warnings

## Notes

- Header also shows `Get Started` (nav) and secondary hero CTA `Try the AI co-founder`. Primary hero CTA is the orange Start free button.
- Console had a 400 on a third-party/event URL and unused-preload warnings. Page still rendered. Consistent with preview API being unavailable.
- Did not submit the magnet form. Did not create an account. Did not visit production or employer-beta.
