# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server (Next.js)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm test           # Offline eval suite (no network, no build)

# SEO — needs a build running first: `npm run build && npm run start`
npm run audit:seo  # Crawl the running build and fail on broken markup
BASE=http://127.0.0.1:3100 npm run audit:seo   # against another port
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

### The pre-wall platform picker offers what we can honour (`app/business/preview/platformChoice.js`)

`MARKETING_FIRST_REBUILD_PLAN` step 3 specs this picker from the competitor's own pre-wall transcript — *TikTok · Instagram · YouTube · Facebook · LinkedIn · or Decide For Me*. **Three of those five cannot receive a post from us.** The Moil backend is explicit (`Business-plan-Staging/utils/socialPlatforms.js`): `PUBLISHABLE_PLATFORMS` is instagram + facebook, `KNOWN_PLATFORMS` adds linkedin (it has a caption variant, a voice and a handle slot — and no scheduler branch), and that file's own comment calls the gap *"the honest description of what we ship"*. TikTok and YouTube are not even known.

A founder who ticks TikTok on the **acquisition** screen, hands over an email and never sees a TikTok post has been told something untrue at the moment they trusted us most — the dead-control failure, at the worst possible place for it, and worse than the competitor's version because theirs presumably works.

So **`OFFERED` is what we can honour and `COMING` NAMES the rest**, unselectable, each with a reason. An omission reads as an oversight and a founder cannot tell that from a decision: "not yet" is an answer, nothing is not. Rules:
- **A refused network is REPORTED**, never silently dropped — otherwise the screen and the stored answer disagree with nothing to explain it.
- **An empty choice is "decide for me", not "no networks".** Storing an empty set produces a month with nowhere to go, and the founder finds out a week later.
- **"Decide for me" resolves to EVERY publishable network, never a guess** — with two, that is both — and carries `decided: false` as the receipt that we chose rather than them.
- **`OFFERED` may never exceed the backend's `PUBLISHABLE_PLATFORMS`.** The repos cannot import each other and neither CI has the other checkout, so `Business-plan-Staging/evals/fixtures/landing-platformChoice.js` is a committed pin (the `fe-contentProfile` pattern) and its check asserts a **direction, not equality**: the landing may NAME a network it cannot offer, and does; it may never OFFER one. A reverse assertion keeps the "not yet" rows alive so the screen cannot slide back to silent omission. Moving a network from `COMING` to `OFFERED` is a two-repo change with a human in the middle, by construction.

Pinned by `evals/platformChoice.test.js`, red-verified nine ways including the specced mistake itself.

**THE ANSWER NOW HAS A CONSUMER, AND IT IS NOT THE PREVIEW ROW (2026-08-30).** The plan proposed storing the choice on `business_previews.brand`, on the true observation that it is free-form JSONB needing no migration. It is still the wrong home, and that table's own migration header says why: `identity_key` is UNIQUE *"precisely so a preview is generated once and replayed forever"*. **There is ONE ROW PER BUSINESS.** Brand DNA scraped off a website is the same fact for every visitor; a PREFERENCE is not — two people previewing the same restaurant would inherit each other's picks, and whoever signed up would be seeded with a stranger's answer, with nothing erroring.

So the carrier is per VISITOR and it is `?platforms=` on the register URL (`buildRegisterUrl`), beside the slug, on the same hop, into the same app-origin record. The consumer is `Business-plan-Staging/service/preview/previewPlatformSeed.js` → the founder's own Autopilot `settings.platform`, seeded once at claim time and never overwriting a choice they made inside the product.

Two rules ride on this side: only `isOffered` ids travel (a value in a URL a founder can read is a promise, and `buildRegisterUrl` asks `platformChoice` rather than re-enumerating the networks — the eval fails on a second inline list); and **"decide for me" and an empty pick send nothing at all**, because sending the resolved pair would report a decision they never made and freeze today's default into their account.

**The picker UI itself is still not built here** — that is a design surface, not a wiring one, and the mechanism underneath it is now complete and tested end to end.

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
   **Rewording is allowed only when the customer approves the exact final wording,
   in writing, before it ships.** "They said it could be reworded" is not approval —
   that is the gap commit `8157cd3` fell through. Draft it, send it back, wait. If
   they edit your draft, their version wins. Record the approval date as the source.
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

### The intake we describe is the intake we have (2026-08-30)

The site described a **21-question intake** in eleven surfaces per language. The product ships **four doors** — a website URL, a PDF, typed text, or spoken answers. Verified before rewriting: nothing in `Business-plan-Staging` defines a 21-question flow, and that repo's `CLAUDE.md` calls them "the four intake doors" throughout.

The worst copy was in `app/marketing/layout.tsx`'s **JSON-LD FAQ answers** — structured data is what an answer engine quotes verbatim, which makes it the most expensive place on this site for a false sentence, and it is the same class the pricing rules already cover.

**Only the intake claim was rewritten.** Surrounding claims that were not verified — "20–30 pages", "8–10 real sources" — are left byte-identical. Fixing one unsourced number is not a licence to silently endorse the others.

**The scan found three files a hand grep missed, on its first run**, including a legacy surface. The reason is the lesson worth keeping: the grep enumerated casings (`21 strategic`, `21 Questions`) and the live strings were **Title Case** (`21 Strategic Questions`). That is precisely the Title-Case bracket-label class recorded one repo over — a hand-written list of spellings misses one, and a scan does not.

`evals/pricingTruth.test.js` therefore carries a repo-wide, case-insensitive scan binding the number to a question word in either language (the bare number is far too common — years, sizes, ids), plus an assertion that **the scan can actually see a violation**: without it, a clean result and a broken walker look identical. Red-verified six ways.

### The SEO audit is the gate on rendered output

`npm run audit:seo` (`scripts/seo-audit.mjs`) boots the build and reads the HTML
with **no JavaScript executed** — the way Googlebot, the Semrush crawler, and
every social and AI crawler read it. CI runs it on every PR after the build.

It exists because the Aug 2026 Semrush Site Audit found 131 errors that nothing
in this repo could see. Every one was in generated output that compiled cleanly
and looked correct in a browser:

- Two `Offer` objects in the root layout had no `url` and no `priceValidUntil`,
  so two invalid schema items shipped on **all 65 crawled pages**.
- `LegalPage` rendered its title as a styled `<p>`, so eight compliance pages
  had no `h1` and no `h2` at all.
- Three pages declared `hreflang es -> <url>?lg=es`, a URL that self-canonicalises
  back to the clean one and serves `lang="en"`.
- Both footer legal links pointed at `/privacy`, leaving `/terms` and five other
  pages with no incoming internal link anywhere on the site.

The audit **fails the build** on: invalid or unparseable JSON-LD, a page with no
`h1` or more than one, an `<img>` with no `alt`, and any hreflang cluster that is
non-reciprocal, points at a URL that canonicalises elsewhere, or names a language
the target does not serve.

It **reports but never fails on** text-to-HTML ratio and word count. Those are
largely a property of shipping a React app; gating on them produces noise nobody
reads, and the one page that genuinely needs attention
(`/candidate/searchjob`, 59 server-rendered words) is a product decision.

Routes come from `/sitemap.xml` at runtime plus `/` and `/legacy`, so a new page
is audited the day it is published rather than the day someone remembers to add
it to a list. **A new schema `@type` with no rule is reported, not failed** —
add it to `REQUIRED` in the script rather than letting it pass silently.

Prices and offer bodies live in `src/common/seo/offers.ts` and nowhere else, for
the same reason the Blog keeps positioning in `brand.ts`: they were hand-written
in four files and had already drifted.

### Styling

- Tailwind CSS with custom brand colors (`moil-navy`, `moil-blue`, `moil-orange`, `moil-green`) defined in `tailwind.config.js`
- Custom breakpoints: `vsm` (320px), `xsm` (400px), `zsm` (480px), `tablet`, `ipad`, `desktop`, `xtraxl` (1440px), `xxlarge` (3200px)
- Global styles split across `app/globals.css` (2009 lines) and `styles/globals.css`
- CSS custom properties for theme variables; dark mode infrastructure exists in `useBusinessUi.ts` but is not fully implemented

### Path aliases

`~~/*` and `@/*` both resolve to the repo root (configured in `tsconfig.json`).

### Deployment

**Production is PM2 + nginx on an AWS instance, not Vercel.** `.github/workflows/deploy.yml`
runs `.github/deploy.sh` over AWS SSM on every push to `main`; `ecosystem.config.js`
is what actually decides how the app runs (`next start` under PM2, fork mode,
port from `PORT`). Vercel is still connected and builds previews on PRs, which is
why `vercel.json` exists and why a green Vercel check does **not** mean production
updated — the `Deploy to server` workflow is the one that does that.

This distinction matters for performance work: nginx on that host serves
`/_next/static/**`, so anything about compression, HTTP/2 or caching of static
assets is server config, not `next.config.js`. See
`docs/performance-server-config.md` and the ready-to-apply
`docs/nginx/moilapp-performance.conf`.

Dependencies install with **yarn** (`yarn install --frozen-lockfile`), not `npm ci`
— the committed `package-lock.json` is out of sync with `package.json` and React 19
conflicts with `lucide-react`'s declared peer range, so npm fails twice over.
Locally, `npm install --legacy-peer-deps` works; do not commit the lockfile churn
it produces.

TypeScript and ESLint build errors can be bypassed via `NEXT_PUBLIC_IGNORE_BUILD_ERROR=true`
(see `next.config.js`) — though note Next 16 no longer reads the `eslint` key there
and warns about it on every build.
