# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server (Next.js)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

Package manager: `yarn` is used for installs (see `vercel.json`), but `npm` scripts work fine.

## Architecture

This is a **Next.js 15 App Router** project using TypeScript, Tailwind CSS, and React 19.

### Multi-section landing page

The site has four distinct sections, each with its own route, layout, and component tree:

| Route | Purpose |
|---|---|
| `/business` | Main landing page (default — root `/` redirects here) |
| `/candidate` | Job marketplace / candidate portal |
| `/marketing` | Content360 marketing product |
| `/legacy` | Legacy page (not actively maintained) |

Each section has a `layout.tsx` for SEO metadata and may have its own CSS file (e.g., `app/business/business.css`).

### Component organization

- `app/<section>/` — Page components, section-specific components, hooks, and utilities
- `src/common/` — Shared components, hooks, translations, and i18n config
- `src/candidate/` — Candidate-specific components (57 files)
- `src/legacy/` — Legacy components including Gemini API utilities
- `src/contexts/` — React Context providers (LanguageContext)

### Internationalization

Custom i18n system layered on top of i18next:

- Languages: `en` and `es`
- Detection priority: URL querystring `?lg=` → localStorage `tlang` → browser navigator
- Translation strings live in `src/common/translations/en.ts` and `es.ts` as nested objects
- Language state is managed via `src/contexts/LanguageContext.tsx`
- Each section has a `useTranslation.ts` hook (e.g., `app/business/useTranslation.ts`) that selects the right subtree of translations
- `src/common/components/I18nProvider.tsx` wraps the app and handles detection/persistence

### AI endpoints: this repo calls none, and that is the rule

`app/api/demo/` used to hold six serverless routes (business-plan, market-research,
financial-projections, business-model, audience-analysis, competitor-analysis) that
each called Google Gemini directly via `src/legacy/utils/geminiApi`. **All seven files
are deleted.** They had **no authentication, no rate limit, and no metering**, they
passed caller-supplied free text (`businessName`, `industry`) straight into a model
prompt, and they had **zero UI callers** — so the only traffic they could ever serve
was somebody else's. A public unmetered model endpoint is a bill anyone on the
internet can run up, and `middleware.ts` cannot help: its matcher excludes `/api`
by design.

**The rule going forward: the marketing site does not hold model credentials.**
Anything AI-shaped is served by the Moil backend (`Business-plan-Staging`, mounted
under `/plan`), which already owns the things a public AI surface needs and this repo
does not — per-IP rate limiting, the daily and monthly spend ledgers, usage
attribution, and one place to revoke a key. A route here would have to reimplement
all four, and would be the copy that drifts.

`NEXT_PUBLIC_GOOGLE_API_KEY_2` existed only for those routes and is gone from
`.env.example`; **unset it in Vercel and revoke it at Google** — a key that is no
longer read is not a key that is no longer valid. `NEXT_PUBLIC_GOOGLE_API_KEY_1`
stays: it is the Places autocomplete widget in `src/candidate/`, a browser-side
Maps key, and a different thing entirely. Restrict it by HTTP referrer.

### Testimonials, reviews, and any quoted customer

**Transcribe or omit. Never author, never "align to positioning."**

In August 2026 commit `8157cd3` rewrote three testimonials so they would echo a new
hero line, while keeping the three real customers' names on them. The quotes were
written by us, not said by them. That is a fabricated endorsement under the FTC's
Rule on the Use of Consumer Reviews and Testimonials (in force since 2024-10-21),
which carries civil penalties per violation — and it destroyed the only genuine
third-party proof the site had, which is also the single strongest input to being
recommended by an answer engine.

The rules, in order of importance:

1. A quote goes on the site only if a customer actually wrote or said it. Editing
   for length or obvious typos is fine. Changing what it claims is not.
2. Every quote carries a dated source we can produce on request — a G2 or Google
   review, an email, a recorded call.
3. If the positioning changes and the existing quotes no longer fit, **remove them
   and go collect new ones.** Do not rewrite them to match. `business.testimonials.items`
   is an empty array for exactly this reason, and the section hides itself while it is
   empty. An empty section costs less than a fabricated one.
4. The same applies to ratings and counts. Do not publish an `AggregateRating`, a star
   figure, or an "N businesses trust us" line without a public, linkable source. The
   previous 4.8★ and "500+" claims were removed because neither could be sourced.
5. `/ai-info` tells assistants not to attribute reviews to Moil while none are
   published. Update that line when real ones exist.

### Styling

- Tailwind CSS with custom brand colors (`moil-navy`, `moil-blue`, `moil-orange`, `moil-green`) defined in `tailwind.config.js`
- Custom breakpoints: `vsm` (320px), `xsm` (400px), `zsm` (480px), `tablet`, `ipad`, `desktop`, `xtraxl` (1440px), `xxlarge` (3200px)
- Global styles split across `app/globals.css` (2009 lines) and `styles/globals.css`
- CSS custom properties for theme variables; dark mode infrastructure exists in `useBusinessUi.ts` but is not fully implemented

### Path aliases

`~~/*` and `@/*` both resolve to the repo root (configured in `tsconfig.json`).

### Deployment

Deployed on Vercel. `vercel.json` sets install command to `yarn install`. TypeScript and ESLint build errors can be bypassed via `NEXT_PUBLIC_IGNORE_BUILD_ERROR=true` env var (see `next.config.js`).
