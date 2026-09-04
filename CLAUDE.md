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

### The wait card must be able to end (2026-09-04)

Reported with a screenshot: five wait sentences typed out, a pulsing bar,
*"Come back to this page any time and your preview will be here"*, and **no
logo, no branding, nothing**. That is the WAIT phase rendering correctly —
`GettingToKnowYou` is the only surface carrying the logo and the colour
swatches, so the missing branding is the missing READY CARD, not a branding
bug. The magnet simply never left `wait`.

**`poll` handled `ready`, `failed`, and `missing` past attempt 8. Everything
else — `building`, `accepted`, `down`, and `ceiling` — fell through to an
unconditional re-arm at a flat 1s, forever.** Two of those are worse than
merely endless:

- **The view limiter is 60 requests a minute per IP and a flat 1s poll sits
  exactly on it.** A second tab, an office NAT or a mobile carrier's CGNAT
  pushes a real founder over, and every GET after that is a 429 — **including
  the one carrying their finished preview**. `ceiling` was unhandled, so the
  retry came back at the same rate and held itself rate-limited. So a server
  that finished perfectly could still never be collected. `nextPollDelayMs`
  keeps ~1s for `WAIT_FAST_ATTEMPTS` (30 — far longer than a healthy
  generation, which is what the 1s cadence exists to catch) and steps down
  after; a 429 backs off further.
- **`classifyHttp` tested `json.slug` BEFORE `json.status === 'ready'`.** That
  works today only because the ready GET happens to carry no top-level slug —
  and POST already answers with one, so the day the GET payload gains it,
  **every finished preview classifies as `accepted`, which is the arm that keeps
  polling.** The reported bug, one field away from itself. Ready is tested
  first now; submit is unaffected because it reads `result.body.slug` /
  `result.body.status` directly rather than the kind.

**`WAIT_GIVE_UP_MS` (6 min) is deliberately LONGER than the server's own build
bound** (`PREVIEW_BUILD_TIMEOUT_MS`, 5 min). On a reachable API the founder
learns `failed` from the SERVER — on a row a re-submission can now actually
regenerate — and a client-invented failure must not pre-empt that honest one.
This bound only fires when the API cannot be reached at all, and it exists so
the card can never spin forever.

**`down` on the resume path no longer clears the saved slug.** A server we
could not read is not a preview that is gone; the founder is put back into the
wait rather than dropped on the form, bounded by the give-up above. The backend
half of that is the same distinction: `findBySlug` answers `undefined` for a
failed LOOKUP and `null` for no row, and the view path collapsed both into a
404 that the client reads as `missing` — which is what CLEARED the slug.

Pinned by `evals/previewWaitTermination.test.js` (10 cases, pure rules proved
behaviourally, the magnet's wiring bounded to the `poll` and resume slices),
red-verified six ways: the flat cadence restored, the 429 backoff removed, the
client bound dropped below the server's, the give-up removed from `poll`, the
classify order restored, and `down` clearing the slug again.

### "Try another business" has to actually forget the old one (2026-09-04)

Everything about the magnet is built to RESUME — the `preview_slug` cookie
survives a reload for seven days, a server we could not read keeps the slug
rather than dropping the founder on the form, and the wait card promises in
as many words that the preview will be here when they come back. That is the
right default, and it is exactly what makes the escape hatch load-bearing:
the ONE founder who wants a different business needs an action that genuinely
forgets, or the cookie hands them the old one again on the next page load.

**`reset()` cleared every piece of React state and NOT the cookie.** So the
control worked until the next refresh and then silently undid itself — a dead
control with a delay on it, which is the class this product has removed
several times over.

**It was rendered on the READY card only**, and the screen a stuck founder is
looking at is the WAIT card. So the one surface with no way out was the one
the resume cookie returns them to every time.

**AND A RESET CANNOT CANCEL A FETCH ALREADY IN FLIGHT**, which is the half no
amount of reading the label finds. `stopWaitClock()` clears a timer;
`cancelled.current` is only ever set on unmount. A `viewPreview` resolving a
beat after the wipe called `onReady`, which **re-sets the cookie** and flips
back to the ready card — after the founder explicitly asked for it to be gone.
Every poll now carries the RUN it belongs to (`runId`), checked **after** the
await as well as before; a stale run writes nothing. Two orderings are
load-bearing: the reset **retires the run before clearing the cookie** (a poll
landing between the two would re-set the cookie we just cleared), and the
re-arm passes its OWN `rid` rather than minting a fresh one, which would let a
poll escape the reset it should obey. Both starters — the resume effect and
`beginWait` — mint a run, because a run minted in one place only leaves the
other un-retirable.

**The wipe is total and EXPLICIT-ONLY**, and the asymmetry decides both
halves: under-clearing leaves a founder stuck with a business they asked to
leave and no way to say so twice, while over-clearing costs one re-typed URL —
but a *resume* that stops resuming loses a preview for every founder who
simply came back, which is far commoner. So `reset` also clears the website
field (leaving the old address makes "try another business" a form that
re-submits the one they left), and the eval **counts the clear sites** so a new
one needs a human.

Pinned by `evals/previewWipe.test.js` (18 checks; the cookie module proved
behaviourally against a fake document, the magnet's wiring bounded to each
enclosing function with a found-the-slice assertion), red-verified **nine
ways** — including both original bugs restored verbatim.

### Proof of work, not proof of reading (`previewPosts.js`, 2026-09-04)

The ready card showed a logo, five colour swatches, a positioning line and a
list of what we had read off the site. Every word of it is about the SCRAPE.
A founder arriving from an ad has no way to tell that apart from a clever
summariser — the thing they came to find out is whether we can make the
*posts*, and the card never showed one.

**THE SERVER HAS BEEN SENDING THEM ALL ALONG.** `composePreview` composes up
to three finished posts (`content.kind === 'posts'`), each with a caption, a
headline and a §10 creative, and `shapeReadyPayload` has always put them on
the wire. **The card dropped them twice over**: `PreviewMagnet`'s
`ReadyPayload` type declared no `content` key so `onReady` never carried it,
and `gettingToKnowYou.js` listed `posts` in `BANNED_HEADING_IDS`. Measured on
a real business — three posts produced, zero shown. The repo's own
`docs/CLOSING_THE_MUNCH_GAP.md` scores *"First hour, pre-paywall: Behind"* for
exactly this.

**A CARD NEEDS WORDS AND SOMETHING TO LOOK AT.** `postCards` requires a
caption plus EITHER a headline (the type-led treatment) or a photo (their own
picture under our wash). Neither is an empty frame, so such a post is DROPPED
rather than padded — the `topicCandidates` rule, one surface over. **A caption
is never promoted into a headline**: cutting a sentence to fit a type slot
composes a claim the founder never made, which is what `brandProducts` refuses
by declining prose rather than truncating it.

**ONE TREATMENT PER CARD — TYPE IS NEVER PAINTED OVER THE PHOTOGRAPH.** With a
headline we paint the brand-gradient ground; with none we show the photo. That
matches `buildCreativeSvg`, which paints no photo at all, and it is the honest
answer to a contrast question we cannot settle: the photo is an uncontrolled
image off their own site, so brand-primary type over it has no legibility
guarantee. Found by LOOKING at a render, not by reading the diff.

**THE CREATIVE IS PAINTED IN THE DOM, NEVER LOADED AS A DATA URI.** A
`data:image/svg+xml` document has an opaque origin, so every external
reference inside it is blocked — and Chromium paints its BROKEN-IMAGE ICON in
the blocked slot rather than skipping it. So the founders WITH a logo would
have got a broken glyph and the ones without would have got clean art. The
backend half of that is `buildCreativeSvg`, which no longer carries an
`<image>` at all; the mark is this card's job, and it is a real `<img>` in the
DOM with an `onError` that hides it.

**COLOURS COME FROM THE BRAND, never from the post.** `creativePalette` reads
`brand.colors` — the same swatches rendered above — so the card and the
fallback cannot disagree about what this business looks like. A repeated
colour never becomes the accent, or the last word is painted invisibly on its
own ground.

**The `leftover-6` marker was NARROWED, not deleted.** A second scrape and a
website builder are still OFF and the eval still pins that; only the posts
magnet moved. `posts` stays in `BANNED_HEADING_IDS` because that list stops a
GET key becoming a prose HEADING SECTION — the strip is a typed render with
its own rules, which is a different thing.

Pinned by `evals/previewPosts.test.js` (24 checks), red-verified thirteen
ways. **Two harness lessons, both of which cost a green run first:** the
refusal checks matched the eval's own explanatory COMMENT, so the source is
comment-stripped before any `doesNotMatch` (with a found-the-component
assertion, or the refusals pass vacuously); and a
`.replace('if (seen.has(key)) continue;', '', 1)` injection hit the FIRST of
two identical lines — the colour dedup, not the caption dedup — so it proved
nothing until it was redone by line index. **When an injection stays green,
suspect the injection before the code.**

### A `.d.ts` sidecar shadows its module, so drift breaks the BUILD alone (2026-09-04)

`app/business/preview/*.js` are CommonJS modules with hand-written `.d.ts`
sidecars beside them. **TypeScript resolves an import to the DECLARATION file
and never looks at the JavaScript**, so a sidecar that has stopped listing what
its module exports is not a stale comment — it is the only thing the compiler
believes.

**That is invisible to `npm test` by construction.** `node --test` loads the
`.js`, so every eval stays green while `next build` fails. It happened: the
wait-termination work added `shouldGiveUpWaiting`, a second `opts` argument to
`nextPollDelayMs` and four constants to `previewWaitCopy.js` and left the
sidecar declaring the original five. **276/276 passed and CI was red**, on

```
TS2305: Module '"../preview/previewWaitCopy"' has no exported member 'shouldGiveUpWaiting'.
TS2554: Expected 0-1 arguments, but got 2.
```

`evals/dtsSidecarParity.test.js` closes it — exhaustive over every `.d.ts` with
a `.js` sibling. Rules:
- **VALUE exports must match; TYPE exports may not.** `export type ReadFail` in
  `previewInput.d.ts` is a legitimate declaration-only name, and demanding one
  in `module.exports` would fail for a reason that is not the defect the gate
  guards — how a gate gets weakened by whoever has to get past it.
- **Both directions are named with the consequence attached.** A name the
  module exports and the sidecar omits fails the BUILD; a name the sidecar
  declares and the module does not export TYPECHECKS and is `undefined` at
  runtime, which is the worse of the two.
- **A module with no readable export block is REPORTED, never silently
  passed**, and there is a reachability floor plus a canary — a clean result
  and a broken walker look identical.
- **HONEST LIMIT, written down rather than assumed away:** it checks NAMES, not
  signatures. The TS2554 half above — a changed parameter list — is beyond a
  text scan, and a guard read as stronger than it is becomes the reason nobody
  adds the real one.

**The scan's own canary caught two defects in the scan, and that is the
transferable part.** Ending the brace match at `\n};` skips a one-line export
block, and matching one key per LINE reads only the first of `{ a, b }` —
`platformPickerView.js` is one line carrying five exports and hit both, so the
first cut reported a real module as exporting one name out of five. **A sweep
that under-reports looks exactly like a clean repo.** It brace-matches and
splits on top-level commas now.

**Do not run `prettier` over `evals/`.** The repo ships no `.prettierrc`, so
prettier's defaults (2-space, double quotes) are not this codebase's style
(tabs, single quotes) and it reformats the whole file around a one-line change
— the same reviewability cost the sister repo records for
`moil360Agent.service.js`.

Red-verified both directions, including the real CI failure restored verbatim.

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
