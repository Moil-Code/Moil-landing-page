# Moil landing rebuild audit — 2026-08-30

**Audit only.** No product behavior changed. This file is the only commit.

Checked **both** surfaces the founder asked for:

| Surface | Git | What it is | Verified live |
|---|---|---|---|
| **www LIVE** | `main` @ `20c92c97` (plan-time SHA; still HEAD) | AWS nginx + PM2 (`Deploy to server` on push to `main`). Not Vercel. | `https://www.moilapp.com/business` — `Server: nginx/1.18.0`, title and H1 match `main` |
| **staging twin** | `staging` @ `0a44dfcf` = **PR #29** merged | Vercel preview, `x-robots-tag: noindex` | `https://moil-landing-page-git-staging-andres-urregos-projects-d325c4bc.vercel.app/business` — deploy `dpl_2NrZcxcCWmih3PG7u8HDMRtvfKsj`, commit `0a44dfcf` |

Method: read `staging` (this branch started there), `git diff main..staging` (16 files), `git show main:…` for the old origin contract, curl/fetch of www and the twin, and a look at unmerged `origin/claude/competitive-audit-gaps-vkg3la` so **GIT DEBT** is not confused with what is live.

**Copy is identical on `main` and `staging`.** `src/common/translations/{en,es}.ts` has a zero-line diff. The twin delta is origins and magnet transport only. Every positioning score below is therefore the same on www and the twin unless the row says otherwise.

---

## Scorecard

Score = what a visitor or crawler gets on **www / `main` / staging twin** today.  
`GIT DEBT` = exists on another branch or as leftover helpers, not shipped here.

| Item | www LIVE (`main` `20c92c9`) | staging twin (`0a44dfcf` / #29) | Notes |
|---|---|---|---|
| Marketing-first hero (“month of posts that go out”) | **ABSENT** | **ABSENT** | `/business` hat + title + AEO + eval lock are **AI co-founder**. Month language is the subhead and the pricing H2, not the H1. |
| AI co-founder / AI Marketing as the live door | **IN CODE** (co-founder) | **IN CODE** (co-founder) | Root layout + `/marketing` still say **AI Marketing**. Three tracks on one site. |
| URL magnet → synthesized profile → 2–3 real posts pre-wall | **PARTIAL** | **PARTIAL** | Magnet + thin brand card **IN CODE**. Posts typed in state, **never rendered**. Evals **forbid** the old promise list. |
| Platform picker pre-wall | **ABSENT** | **ABSENT** | Website-only magnet. `PLATFORMS` helpers leftover. Picker **IN CODE** only on unmerged `claude/competitive-audit-gaps-vkg3la`. |
| $25 vs $75 story (always sell Market Pro?) | **PARTIAL** | **PARTIAL** | Two-tier story **IN CODE**. Market Pro featured. Primary CTA is plan-agnostic `Start free`. No `?plan=` preselect. |
| Spanish `/es` native month-of-posts vs bank-first | **PARTIAL** | **PARTIAL** | Native `/es/business` **IN CODE**. Bank-first **ABSENT** (eval-blocked). Landing H1 is owner-burden / *socio*, not month-of-posts. Pricing H1 is the month. |
| String: “publishes itself” | **ABSENT** | **ABSENT** | Closest live line: publishes **what you approve**. |
| String: “agent” (product) | **ABSENT** | **ABSENT** | Legal “Designated Agent” / HTTP only. |
| String: “copilot” | **ABSENT** | **ABSENT** | Docs crawler allowlist only. |
| String: “automation” / “automate” | **IN CODE** | **IN CODE** | AEO, schema, `/about`, `llms.txt`, journey. |
| String: “21 strategic questions” | **IN CODE** | **IN CODE** | Buried sections + `/marketing` + JSON-LD. Not in the hero. Killed only on the unmerged audit branch. |
| Twin env gates (`PLAN_API_ORIGIN`, `NEXT_PUBLIC_REGISTER_ORIGIN`) | **PARTIAL** / **ABSENT** | **IN CODE** and **live** | www: register hardcoded to production; magnet still reads `NEXT_PUBLIC_PLAN_API_ORIGIN` (cross-origin). Twin: same-origin `/plan/preview` + env-gated register; unset register still defaults to `https://business.moilapp.com`. |

---

## 1. Marketing-first hero vs AI co-founder / AI Marketing

**Score: ABSENT (marketing-first as `/business` lead) · IN CODE (AI co-founder) · PARTIAL (month language elsewhere) · PARTIAL (AI Marketing on other routes)**

`evals/investorDoor.test.js` **locks** the English door to the co-founder frame. Changing the H1 without changing that eval is a red build.

Live `/business` (www and twin, same strings):

| Slot | English (`src/common/translations/en.ts`) | Spanish (`es.ts`) |
|---|---|---|
| Eyebrow / hat | `The AI co-founder for small business owners` | `El socio de los dueños de negocio` |
| H1 | `You shouldn't have to be everything on top of the real job.` | `No deberías tener que encargarte de todo, además de hacer el trabajo que realmente importa.` |
| Sub | `…Research, plans, documents, and thirty days of content on brand…` | `…investigación, planes, documentos, y treinta días de contenido con tu marca…` |
| Title | `AI co-founder for small business owners \| Moil` (`app/business/layout.tsx`) | `El socio que trabaja el negocio contigo \| Moil` |
| AEO first graf | `Moil is the AI co-founder for small business owners.` | `Moil es el socio de los dueños de negocio.` |

Confirmed on live www HTML (2026-08-31): hat, H1, and AEO match the table. Twin title is the same English title.

**Where month-of-posts actually leads**

- Pricing section H2 / `/business/pricing` H1: `Thirty days of content on brand. Research, plans, documents.` (`en.ts` ~459, ~596). Same in ES: `Treinta días de contenido con tu marca…`.
- `/marketing` hero: `Your Entire Month of Marketing. Built by AI.` (`en.ts` ~632–634). That route is a **second product story**, not the default door (`/` still 301s to `/business`).
- Exact phrase `posts that go out`: **ABSENT** in the repo.

**AI Marketing drift (not the `/business` hero, still shipped)**

- Root `app/layout.tsx` default title: `Moil | AI Marketing for Small Business — English & Spanish`.
- `/about` and `evals/investorDoor.test.js` **forbid** `AI marketing platform`.
- `app/compare/aeoLocks.ts` still says Moil is an AI marketing platform.

There is no `brand.ts`. Positioning is split across translations, layouts, `offers.ts`, `llms.txt`, `/ai-info`, and leftover `app/business/utils/n8nTranslation.ts` (not wired to `HeroSection`).

**Even the unmerged rebuild branch does not change this hero.** `origin/claude/competitive-audit-gaps-vkg3la` still ships the same eyebrow, H1, and sub. `MARKETING_FIRST_REBUILD_PLAN` is named in that branch’s `CLAUDE.md` (picker = step 3); the plan file is **not** in this repo.

---

## 2. URL magnet → synthesized profile → 2–3 real posts pre-wall

**Score: PARTIAL**

Shipped funnel (both branches; twin changes only *where* the fetch goes):

```
website URL → POST /plan/preview → poll GET /plan/preview/:slug
  → ready card (name, sanitized tagline, logo, color dots)
  → Start free → register?preview=<slug>
```

| Step | Score | Evidence |
|---|---|---|
| URL magnet, website-only | **IN CODE** | `PreviewMagnet.tsx` single `name="website"` field. Submit copy: `See a preview of your brand`. Social URLs refused (`websiteFieldDecision` in `previewReveal.js`). |
| Synthesized profile | **PARTIAL** | Ready card requires `brand.name`. Shows tagline / logo / up to 6 swatches. `category`, `address`, `products`, `sources` are typed and unused. |
| 2–3 real posts pre-wall | **ABSENT** | `content.posts` is stored (`PreviewMagnet.tsx` ~39–42, ~128–132) and **never read in JSX**. Defaults to `{ kind: 'brand-only', posts: [] }`. |
| Email / paywall after N posts | **ABSENT** | Soft register CTA only. Evals pin no `type="email"`. |

`evals/previewMagnet.test.js` **kills** the old reveal promise list, including `A month of posts in your voice, with the images made for you`. That copy cannot return without a red eval. This repo cannot see whether the Plan API still generates posts; the landing **does not show them**.

PR #19 (on `main`, therefore also on the twin after #29’s merge of `20c92c97`) is the lock: website-only, thin ready card, no posts on the card.

---

## 3. Platform picker pre-wall

**Score: ABSENT** (www and twin)

`PreviewMagnet` does not import `readHandle`, `PLATFORMS`, or any picker view. Evals assert no handle chip, no Places chip, no `PLATFORMS.map`.

Leftover (not UI):

- `previewInput.js` still defines `PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin']` and `readHandle`.
- `previewClient.js` still has unused `handleSubmitBody` / `placeSubmitBody`.
- Magnet i18n still has `doorsLabel`, `doorHandle`, `platformLabel` (dead keys).

**GIT DEBT:** `origin/claude/competitive-audit-gaps-vkg3la` (`273f655`) implements the picker: `platformChoice.js`, `platformPickerView.js`, wired into the **ready card** above Start free, `?platforms=` on the register URL. Offered = Instagram + Facebook only; TikTok / YouTube / LinkedIn are named “not yet”. That branch is **not** on `main` or `staging`. No open PR at audit time.

---

## 4. $25 vs $75 story (always sell Market Pro?)

**Score: PARTIAL**

| Plan | Monthly | Annual in this repo | Role in copy |
|---|---|---|---|
| Professional | **$25** | **$240** (was $300) | “Research, plan, and documents. **Without the month.**” |
| Market Pro | **$75** | **$700** (was $900) | Featured. “Thirty days of content on brand, plus…” |

Canonical comment in `en.ts` ~158–172: *$25 makes things when asked; $75 also runs the month unasked.* Schema: `src/common/seo/offers.ts`.

**Always sell Market Pro?**

- **IN CODE** as bias: Market Pro card first + `featured` + BEST VALUE badge (`BusinessPricingSection.tsx`). Hero secondary CTA `See Market Pro` → `#pricing`. Pricing page sidebar hardcodes the Market Pro name. PR #21 lock: “Always sell Market Pro. Plan is not the H1.”
- **ABSENT** as a hard sell: register URLs have no `plan=` / `tier=` param. Primary CTA everywhere is `Start free — no card` / `Empieza gratis — sin tarjeta`.
- **Tension:** problem section and final CTA still anchor **$25** (`Moil is $25.` / ES `Qué te da $25 al mes`). ES final-CTA trust line names both prices.

**GIT DEBT (not on www/twin):** the unmerged audit branch’s `evals/pricingTruth.test.js` header says Market Pro annual in the **apps** is **$720**, not `$700`, and that Professional is no longer “without the month” — the live tier split is **density** (reviewed posts vs auto-publish), not a feature hole. That correction is **not** on `main` or `staging`. Treat the $700 / “without the month” lines as **unverified against Stripe** until that lands.

No `Starter` / `$15` on the live business door (killed in #12).

---

## 5. Spanish `/es` — native month-of-posts vs bank-first

**Score: PARTIAL**

**Native Spanish door: IN CODE**

- Routes: `/es/business`, `/es/business/pricing`. `/es` → `/es/business` 301.
- Middleware: path `/es/*` wins over `?lg=`, `Accept-Language`, and a stale `lang=en` cookie (`middleware.ts`, `pathLocale.ts`).
- Live www `/es/business` (2026-08-31): `lang`/cookie Spanish, hat `El socio de los dueños de negocio`, H1 the owner-burden sentence, magnet `Ver una vista previa de tu marca`.

**Month-of-posts as the ES landing lead: ABSENT.** Month is in the sub and in the pricing H1 (`Treinta días de contenido con tu marca…`).

**Bank-first: ABSENT.** `evals/spanishDoor.test.js` fails the build if `El banco quiere un plan`, `Marketing con IA`, `se arma la cabeza`, the retired short H1s, or `Desde $25` return on the first screen.

ES is written as its own door (PR #21), not an EN paste. `co-fundador` is buried; the hat is *socio*.

---

## 6. Named strings

| String | Score | Where it lives (or does not) |
|---|---|---|
| **publishes itself** | **ABSENT** | No match. Live: `anything you approve gets scheduled and published` (`en.ts` FAQ), `schedules and publishes the posts you approve` (`offers.ts`). |
| **agent** (product) | **ABSENT** | DMCA / privacy / robots / npm. Not a product claim. |
| **copilot** | **ABSENT** | Playbook crawler regex only. |
| **automation / automate** | **IN CODE** | AEO: `automates content creation thirty days at a time` (`en.ts` ~136, `app/business/layout.tsx` JSON-LD, `/about`, `llms.txt`). Journey: `Everything automated.` `/marketing`: `Every step automated.` ES: `Todo automatizado.` |
| **21 strategic questions** | **IN CODE** | Identity (`answer 21 strategic questions`), capabilities (`21 Questions` tag), journey H2 `From 21 Questions to` / step `21 Strategic Questions`, bilingual blurb, `/marketing` HowTo schema (`Answer 21 Strategic Questions`). ES: `21 preguntas estratégicas`. **Not in the hero.** Leftover: `n8nTranslation.ts`, `src/legacy/sections/*`. |

`evals/positioning.test.js` does **not** ban these five strings on `main`/`staging`. The 21-question kill exists only on `claude/competitive-audit-gaps-vkg3la` (repo-wide case-insensitive scan in `pricingTruth.test.js`). That branch’s `CLAUDE.md` states the product intake is **four doors** (URL, PDF, typed text, spoken) — verified against `Business-plan-Staging`, not against a 21-question flow.

---

## 7. Twin env gates vs live www still on `main`

### staging / twin — **IN CODE**, and the Vercel preview is using them

PR #29 (`933f1d4` + `be3fc31` + merge `0a44dfcf`):

| Gate | Behavior on `staging` |
|---|---|
| `PLAN_API_ORIGIN` (server-only) | `next.config.js` rewrite: `/plan/preview` → `$PLAN_API_ORIGIN/plan/preview`. Client **always** fetches relative `/plan/preview`. Unset → no rewrite → fetch fails → magnet down-state. `NEXT_PUBLIC_PLAN_API_ORIGIN` is leftover rewrite fallback only; client does not read it. |
| `NEXT_PUBLIC_REGISTER_ORIGIN` | `getRegisterOrigin()` in `previewClient.js`. Next inlines the **static** `process.env.NEXT_PUBLIC_REGISTER_ORIGIN` member (`933f1d4` — same class of bug as #16). Unset → `https://business.moilapp.com`. |
| CTAs | Nav, footer, mobile menu, final CTA, pricing, hero, page content: `getRegisterUrl()` / `buildRegisterUrl()`. `/business/login` and `/business/register` redirects use the same helpers. |
| Hardcoded twin hosts in source | **None.** Evals fail on `employer-beta`, `staging.ai`, `stagebeta.moilapp.com`, `ai.moilapp.com` in the gated files. |

Live twin (2026-08-31):

- Deploy is `0a44dfcf` (#29). `x-robots-tag: noindex`.
- Register hrefs are **not** `https://business.moilapp.com/register` (www’s nine CTAs are). Twin host is a different `*.moilapp.com` name, inlined from env — source still has zero hardcoded twin host.
- `GET /plan/preview` on the twin hits a rate-limited JSON API (rewrite is **on**). `GET` without a slug is 404, as expected for a view.

`.env.example` on staging documents both gates and tells Staging Deploy to set them after merge — not in git.

### www / `main` — **PARTIAL** (plan rewrite exists; register and magnet client do not match the twin)

`main` @ `20c92c9` still has the **old** client contract:

```js
// git show main:app/business/preview/previewClient.js
const REGISTER_ORIGIN = 'https://business.moilapp.com/register';
function getPlanApiOrigin(env) { /* process.env.NEXT_PUBLIC_PLAN_API_ORIGIN */ }
function previewSubmitUrl(origin) { return origin + '/plan/preview'; } // cross-origin
```

- All business CTAs and `/business/login|register` redirects **hardcode** `https://business.moilapp.com`. Confirmed live: nine `href="https://business.moilapp.com/register?lg=en"`.
- Magnet starts `down` if `NEXT_PUBLIC_PLAN_API_ORIGIN` is empty (`PreviewMagnet` on `main`).
- `next.config.js` on `main` already has the **server** `PLAN_API_ORIGIN` rewrite (same destinations). The **browser** does not use it.
- Live www `GET /plan/preview` returned Express + rate-limit headers (nginx or a server rewrite in front of Next). The **client bundle on `main` still prefers the public plan origin**, not same-origin.

Footer login on `main` still points at `https://moilapp.com/business` (not `/login`). Twin #29 fixes that to `getLoginUrl()`.

**Not gated on either branch:** compare pages, `/about` layout, `/marketing` nav, `src/common/constants/baseUrl.tsx` — still production `business.moilapp.com`.

---

## 8. What is on staging that is not on `main`

Exactly **16 files**, +203 / −138. `git log staging..main` is empty — `main` has nothing the twin lacks. Staging-only commits:

```
0a44dfc Merge pull request #29 …
933f1d4 Fix getRegisterOrigin so Next inlines NEXT_PUBLIC_REGISTER_ORIGIN
be3fc31 Env-gate register origin and use same-origin /plan/preview
127f7c6 merge origin/main at 20c92c97 onto staging twin
deb7760 chore: pin a durable Vercel preview on the staging branch   ← empty tree; marker only
```

| File | Twin-only behavior |
|---|---|
| `.env.example` | `NEXT_PUBLIC_REGISTER_ORIGIN`; public plan origin demoted to comment |
| `next.config.js` | login/register redirects via `getLoginUrl` / `getRegisterUrl` |
| `previewClient.js` + `.d.ts` | same-origin plan URLs; `getRegisterOrigin` |
| `PreviewMagnet.tsx` | no `getPlanApiOrigin` pre-gate; relative fetches |
| `BusinessNav`, `BusinessFooter`, `BusinessMobileMenu`, `BusinessFinalCta`, `BusinessPricingSection`, `HeroSection`, `BusinessPageContent`, `BusinessPricingPageContent` | env-gated CTAs |
| `evals/previewMagnet.test.js` | same-origin + register-env pins; anti-twin-host scan |
| `evals/investorDoor.test.js`, `spanishDoor.test.js` | website-only magnet pins instead of “magnet not in the diff” |

**Not on staging vs `main`:** no hero rewrite, no posts on the card, no picker, no 21-question kill, no price-ladder correction.

---

## www LIVE vs staging twin vs GIT DEBT

### www LIVE (`main` `20c92c9`, nginx)

A visitor on `https://www.moilapp.com/business` gets:

1. **AI co-founder** hat, owner-burden H1, thirty days mentioned in the sub — not a marketing-first H1.
2. Website-only magnet. Thin brand card if the plan API answers. **No posts. No platform picker.**
3. **Start free** → `https://business.moilapp.com/register`. **See Market Pro** → in-page `#pricing` ($75 featured, $25 still on the page).
4. `/es/business` is a real Spanish document (*socio*, not bank-first, not month-as-H1).
5. AEO / schema / journey still say **automates** and **21 strategic questions**.
6. Magnet talks **cross-origin** to whatever `NEXT_PUBLIC_PLAN_API_ORIGIN` was baked into the last AWS build.

This is the investor door from PR #21, plus the website-only magnet from #19, plus the SEO/schema work through #28. It is **not** the marketing-first rebuild.

### staging twin (`0a44dfcf` / #29, Vercel, noindex)

Same **words** as www. Different **plumbing**:

1. Magnet fetch is same-origin `/plan/preview`; Vercel rewrite to `PLAN_API_ORIGIN` is live.
2. Start free / nav / footer / pricing resolve to the **twin employer origin** via `NEXT_PUBLIC_REGISTER_ORIGIN` (unset would have kept production — that fallback did **not** win on this preview).
3. Source still refuses to hardcode that host. Safe to keep #29 **off** `main` until someone intends www to use the same-origin magnet.

Use the twin to test scrape → ready card → register hop. Do **not** use it to judge a new hero, posts on the wall, or a picker. Those are not on this SHA.

### GIT DEBT (not on www, not on the twin)

1. **Marketing-first `/business` hero** — not started. Eval-locked the other way. Unmerged rebuild branch also left the hero alone.
2. **2–3 posts on the ready card** — type exists; UI and evals go the other way. Showing posts is a new product PR, not a flip.
3. **Platform picker** — implemented on `origin/claude/competitive-audit-gaps-vkg3la` (`platformChoice` + `platformPickerView` + magnet screen + `?platforms=`), **unmerged**, no open PR at audit time. Latest Vercel deploys on the project are that branch, not `staging`.
4. **“21 strategic questions”** — still live in eleven-ish surfaces per language. Kill + four-door rewrite is on the same unmerged branch.
5. **Price / tier truth** — `$700` vs apps’ `$720`; “Professional = without the month” may be false if density is the real split. Only on that branch’s `pricingTruth` eval.
6. **Three positioning tracks** — `/business` + `/about` + `llms.txt` = AI co-founder; root metadata + `/marketing` = AI Marketing; pricing H2 = thirty days of content. `aeoLocks.ts` contradicts `/about`.
7. **Dead magnet doors** — i18n keys + `readHandle` + `PLATFORMS` on `main`/`staging` after the UI was removed.
8. **Hardcoded production CTAs** on compare / about / marketing even on the twin.
9. **`n8nTranslation.ts`** static hero (old co-founder + marketing-first mix) — leftover, not rendered.
10. **#29 vs `main`** — merging the twin onto www would switch the magnet to same-origin `/plan/preview` and env-gate register (production default if unset). That is an ops decision, not a copy decision. Do not merge this audit PR; do not treat #29 as the rebuild.

---

## Locks this audit did not touch

- No H1 / hat / pricing / magnet / eval edits.
- No merge to `main` or `staging`.
- No Vercel env writes.
- Testimonials array remains empty on purpose (`CLAUDE.md`).

Plan-time pins still hold: **www = `20c92c9`**, **twin #29 = `0a44dfcf`**.
