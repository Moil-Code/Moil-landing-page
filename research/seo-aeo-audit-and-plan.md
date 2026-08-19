# Moil landing page — SEO / AEO audit and implementation plan

**Status: audit + plan only. No code ships until the positioning decision in §3 is signed off.**
Date: 2026-08-19 · Branch: `claude/landing-page-seo-audit-k0xt6h`

---

## 0. The one-paragraph version

The last three commits (`#13`, `#14`, `#15` — "Phase 1 AEO", "Phase 2 AEO", "AEO: replace
testimonials") optimized the site to agree with itself instead of with demand. A word nobody
searches — **"shop"** — was chosen as a lock, propagated verbatim into ~40 places including
title tags, six JSON-LD blocks, `llms.txt` and five `/compare` pages, and then **three named
customers' testimonials were rewritten to contain it**. Meanwhile the same rendered page still
demos a hiring pipeline while the FAQ next to it declares "Moil is not a hiring platform." The
whole effort also aimed at the wrong surface: research shows ChatGPT cites a recommended SaaS
vendor's *own site* only ~11.6% of the time, so roughly 88% of what an AI reads before
recommending you is somebody else's page. Three commits were spent rewriting the 12%. This
document is the revert list, the positioning decision that has to be made first, and a two-track
plan — repair the page, then go build the off-site corpus that actually produces recommendations.

---

## 1. Audit — what is wrong, in severity order

### 1.1 🔴 CRITICAL — Testimonials were rewritten, not collected

Commit `8157cd3` replaced three testimonials while **keeping the three real names**.

| | Before (commit `8157cd3^`) | After (shipped) |
|---|---|---|
| Luis Vives | "I posted a position and within hours we connected with multiple great candidates. Moil cut what used to take us weeks down to a single afternoon." | "I told Moil **the shop** once. It wrote the plan and I keep using it when I need a next step, instead of starting from zero." |
| Liliana Cervantes | "Excellent platform whether you're looking for a job or for workers. We use it for both sides of our business now — and the bilingual support is a real differentiator." | "We run **the shop** in English and Spanish. Moil keeps the plan and the month of posts in both, not a one-time PDF." |
| Miguel Bustos | "100% recommendable. Moil helps me find employees the moment I need extra help — no posting to 10 different sites, no ghost candidates." | "I ask Moil for the plan and the month instead of paying a consultant. It already knows the business." |

The commit message says it plainly: *"quotes and roles now describe the plan and monthly posts,
not hiring metrics."* The quotes were **authored to match the hero**, not gathered from the
customers. Three problems, in order:

1. **Legal.** The FTC's Rule on the Use of Consumer Reviews and Testimonials (effective
   2024-10-21) prohibits testimonials attributed to people that misrepresent what they said, with
   civil penalties up to **$53,088 per violation**; the Commission sent warning letters to ten
   companies over fake testimonials heading into 2026. Putting invented sentences in a named real
   person's mouth on a commercial page is squarely the prohibited conduct. This is the single
   item on this list that is not merely a marketing mistake.
2. **It destroyed the best AEO asset on the site.** The GEO study (10,000 queries, 25 domains)
   measures **+41% visibility from quotations**, the largest single lever it found — but that
   depends on the quotes being real, specific and corroborated elsewhere. "I posted a position and
   within hours we connected with multiple great candidates" is exactly that. "I told Moil the
   shop once" is unfalsifiable filler.
3. **It reads as AI-written.** All three new quotes share one cadence, one vocabulary, one
   sentence length, and one rhetorical move (a contrast clause: "instead of starting from zero" /
   "not a one-time PDF" / "instead of paying a consultant"). Real reviews from three different
   people do not converge on one voice. This is the clearest slop tell on the page.

**Action: revert to the originals, verify with the three customers in writing, and never write a
testimonial again.** If the originals cannot be substantiated either, pull the section entirely
until real ones exist. An empty testimonials section costs less than a fabricated one.

### 1.2 🔴 CRITICAL — The page contradicts itself about what Moil is

On one rendered page, at the same time:

| Says Moil is not a hiring platform | Says Moil hires for you |
|---|---|
| FAQ ×3 (`BusinessFaqSection.tsx`) | Journey demo: *"start the hiring pipeline for 3 HVAC techs"* |
| `<title>`, meta description | Journey demo result: *"Job live in 2 min — AI matching candidates now"* |
| 6 JSON-LD blocks in `app/business/layout.tsx` | Nav + footer link: "Hiring" |
| `public/llms.txt` | `/candidate` job marketplace, linked from `llms.txt` |
| `app/about/page.tsx` ×4 | Live prod `<title>`: *"…Business Plans, **Hiring** & Marketing"* |
| `app/compare/*` ×4 | LinkedIn / ZoomInfo company descriptions |

An entity that denies its own shipping product is the worst possible input to a retrieval system.
LLMs resolve conflicting claims about an entity by lowering confidence and omitting it — or, worse,
by surfacing the negation, which means the sentence Moil earns in an answer becomes *"Moil is not
a hiring platform."* That is a terrible thing to own.

Related: **"Not affiliated with MOIL Limited of India" appears ~10 times.** MOIL Limited (the
NSE-listed Indian manganese miner) is a genuine entity collision, but repeating a denial teaches
the association rather than breaking it. Entity disambiguation is won with `sameAs` links,
consistent NAP across Crunchbase/LinkedIn/GBP, and *one* canonical statement on `/about` — not
with repetition.

### 1.3 🔴 CRITICAL — "shop" is a word with no demand behind it

Propagated into ~40 locations: H1, `<title>` ×3, meta descriptions, six JSON-LD blocks, eight FAQ
answers, five `/compare` pages, `/about`, `llms.txt`, footer nav, and a URL (`/compare/bilingual-local-shop`).

Why it fails, concretely:

- **Wrong intent cluster.** In US English "shop" resolves to (a) a retail store, (b) an auto/repair
  shop, or (c) the verb *to shop* — an enormous ecommerce-intent term. Optimizing for it puts Moil
  in SERPs where searchers want to buy products, not software.
- **The LLM prior is "retail store."** An assistant parsing *"AI co-founder for local shops"* has to
  decide what a shop is, and it will land on storefront retail — which **excludes** HVAC,
  landscaping, cleaning, trucking, construction and every trade in Moil's own copy. The page's own
  demo is a *residential HVAC company in Austin*. The lock argues against the demo.
- **It is narrower than the stated ICP.** `research/strategy.md` locks the ICP at "SMB owners,
  1–20 employees." "Shop" clips that to storefront retail.
- **Nobody self-identifies that way.** Owners type their trade ("HVAC company", "landscaping
  business", "food truck", "salon") or the generic "small business." Nobody prompts an assistant
  for "AI tool for my shop."

**The diagnostic worth internalizing:** the word was picked to be *repeatable* — a "lock" — rather
than because anyone searches it. Then the reviews were bent to fit it. Optimizing copy for internal
consistency instead of external demand is the root cause of everything in this section, and "shop"
is just its most visible symptom.

### 1.4 🟠 HIGH — Bilingual is the moat, and `/es/business` renders in English

`/es/business` was built specifically so Google has a Spanish URL to index. Then English strings
were hardcoded into the components it renders:

| Component | Problem |
|---|---|
| `app/business/sections/HeroSection.tsx` | H1, subhead, primary CTA, eyebrow and all five trust pills are **raw English strings**. Only `ctaSecondary` uses `t`. |
| `app/business/components/BusinessFaqSection.tsx` | Renders a hardcoded `BUSINESS_FAQ_ITEMS` array — English only. Ignores `t.business.faq.items` entirely. |
| `app/business/BusinessPageContent.tsx` (stats) | Labels hardcoded: `'Professional / month'`, `'Market Pro · full Moil360'`, `'English & Spanish'`. |

So a Spanish searcher who lands on `/es/business` gets an **English H1, English FAQ, English
stats**. Meanwhile `es.ts` still holds correct Spanish translations for all of it — now orphaned.
This is the most expensive unforced error in the audit: it breaks the one advantage that is
genuinely uncontested (see §4.2).

### 1.5 🟠 HIGH — Repetition at scaled-content-abuse levels

This exact pair of sentences appears verbatim ~30 times across the site:

> "Professional is $25 a month for research, plan, coaching, and documents. The full Moil360
> calendar is Market Pro at $75."

And the five `/compare` pages are the same template with the same paragraphs reworded. Google's
spam policy on **scaled content abuse** targets many pages generated with little original value
regardless of how they were produced; near-duplicate comparison pages are also doorway-adjacent.

Contrast with the Tally pages this was modeled on: each of theirs carries **6–9 unique H3 FAQs
matching distinct buyer queries**, plus real pricing tables, feature matrices, pros/cons, "best
for" labels and an explicit recommendation. The *format* was copied; the *substance* was not.

### 1.6 🟡 MEDIUM — Dead code, dead sections, dead strategy

- `t.business.compare.*` — a full Moil-vs-alternatives comparison table sits fully written in
  `en.ts` and is **not rendered anywhere**. `research/strategy.md` called it "LLM citation gold."
- `t.business.hiring.*` — an entire hiring section, unrendered.
- `t.business.statsSection.stats.*` — six orphaned stat labels.
- `t.business.faq.items` — eight FAQ entries, orphaned by the hardcoded array in 1.4.
- `journeySteps` skips `step5` with the comment `// step5 was Smart Hiring`, while `convoUser2`
  two screens later still asks Moil to run the hiring pipeline.

### 1.7 🟡 MEDIUM — Technical

| Item | Finding | Action |
|---|---|---|
| `llms.txt` | Shipped despite `strategy.md` explicitly saying don't. Evidence is against it: Ahrefs (137K domains) found **97% never read**, 96% of the few hits were bots and only 19.5% of those were AI tools; SE Ranking (~300K domains) found no significant correlation with AI citations; Google confirmed no support. | Keep it — it costs nothing and Tally has one — but **fix its contents** (it currently carries the shop/not-a-hiring-platform copy) and **stop counting it as a channel**. |
| FAQPage schema | Google added the deprecation notice on 2026-05-07; FAQ rich results are gone and no vendor confirms an AI-citation benefit. Harmless to retain. | Keep, deprioritize. Stop treating it as the centerpiece. |
| `app/robots.ts` | Blocks `AhrefsBot`, `SemrushBot`, `MJ12bot`, `DotBot`. | **Unblock Ahrefs + Semrush.** They feed the visibility datasets and monitoring tools you need to measure any of this. Blocking them mostly blinds you. |
| `middleware.ts` | Sets a `lang` cookie from `Accept-Language` on every uncookied request; content varies by cookie without a `Vary` header. | Risk of a Spanish render cached at an English URL. Resolve when Spanish moves fully to `/es/*` paths. |
| AI-crawler allowlist | Well done — explicit `allow` for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot et al. | Keep as is. |
| Stats server-rendering | Already fixed — final values render server-side with the counter overwriting on hydration. | No action. |
| `/compare` URL | `/compare/bilingual-local-shop` bakes "shop" into a URL. | Redirect 301 to a new slug when the term is retired. |

---

## 2. The strategic error underneath all of it

The three AEO commits assumed the landing page is where AI recommendations are won. The data says
otherwise:

| Finding | Source |
|---|---|
| ChatGPT cites a recommended SaaS tool's **own site just ~11.6%** of the time across 40 software categories | 2026 SaaS citation study |
| Wikipedia (13.15%) + Reddit (11.97%) = **>25% of all US ChatGPT citations** | 5W Research, 2026 |
| Reddit is **46.7%** of Perplexity's top citation sources | Perplexity citation analysis, 2026 |
| Brands with G2 / Capterra / Trustpilot / Yelp profiles see a **~3x citation multiplier** | 2026 citation study |
| ChatGPT cites brands 0.59% of responses vs Perplexity 13.05% — a **46x platform gap** | 34,234-response study, 2026 |
| GEO levers: **quotations +41%, statistics +32%, citations +30%, fluency +28%** | GEO paper, 10K queries / 25 domains |

**Roughly 88% of what an AI reads before recommending a tool is a page Moil does not own.** Three
commits were spent rewriting the ~12%, and they made it worse.

The Tally post says this out loud and it is the part most people skip:

> "Tally didn't start with some genius AI search strategy. They spent years building a product
> people genuinely recommended across Reddit, communities, reviews and the wider internet.
> **ChatGPT recommends Tally because the internet does.** But now they're engineering around that
> signal to make sure it keeps happening."

The comparison hub, the AI Info page, the `llms.txt` and the MCP server are the *engineering-around*
layer. They work because the substrate — 4.8 on G2, 4.9 on Product Hunt, years of unprompted Reddit
love — already existed. Moil copied the engineering layer and, in the same motion, **deleted its own
substrate** by rewriting the only three real customer quotes it had.

So the plan below has two tracks, and Track B is the one that actually moves the number.

---

## 3. Decision required before any code — pick the entity

Everything downstream depends on resolving §1.2. Two coherent options; there is no third.

### Option A — "AI co-founder for small business," hiring included ✅ RECOMMENDED

Moil is one platform covering plan → market research → content (Moil360) → hiring → coaching,
bilingual EN/ES, $25–$75/mo.

**Why this one:**
- It matches what actually ships: `/candidate` marketplace, the nav, the pricing page, the live
  production `<title>`, LinkedIn, ZoomInfo.
- **The real reviews are about hiring.** All three original testimonials praise hiring. That is
  organic, unprompted product love — precisely the substrate Tally spent years accumulating. When
  real customers celebrate a pillar and the copy denies it, the copy is what's wrong.
- Hiring is the genuine differentiator. Everyone has an AI business plan generator; a $25/mo
  platform where planning and hiring share the same business context does not otherwise exist.
  Dedicated ATS tools start at $149–$299/mo and only do hiring.
- It is the wider net: "small business" carries orders of magnitude more search and prompt volume
  than "shop," and it is how owners self-describe.

**Cost:** the "not a hiring platform" line is retired everywhere, and the `/compare` pages are
rebuilt rather than patched.

### Option B — narrow to plan + marketing, drop hiring

Only defensible if the business is genuinely sunsetting hiring. Then `/candidate`, the nav, the
job marketplace, the pricing tiers and the demo must all go too — a company decision, not a copy
decision. **Do not ship the marketing-site half of Option B while the product half still ships.**
That is the current state and it is the worst of both.

> **This is the sign-off gate.** Everything in §5 assumes Option A. If Option B is chosen, §5
> stands but the trade-page and hiring-query work in Phases 3–4 is cut and replaced with
> planning/marketing verticals only.

---

## 4. Where the demand actually is

The mandate was to figure out what people search and how they'll find Moil instead of the
competition. Four pools, ranked by winnability.

### 4.1 Do NOT fight head-on: "AI business plan generator"

Owned by LivePlan, Upmetrics, monday.com's blog, Visme, Pipedrive and a thick layer of listicle
farms, all with years of domain authority. Moil will not out-rank them by writing a better homepage.
Moil can, however, **get listed inside their listicles** — see Phase 4.3, which is the cheap way to
appear in the exact answers those pages feed.

### 4.2 🥇 Bilingual Spanish — uncontested, and currently broken

This is Moil's single biggest structural advantage and the shipped site squanders it (§1.4).
Almost no US SMB SaaS competitor maintains genuine Spanish pages — LivePlan, Upmetrics, Bizway and
Bizplanr are English-only. Meanwhile there are ~5M Hispanic-owned US businesses generating ~$800B/yr,
Latino-owned employer firms grew ~35% (2019–2024) vs ~6% nationally, and Spanish-language demand
concentrates in TX, CA, FL and AZ — Moil is *in Texas*.

Target the phrases owners actually type:
`plan de negocios para [oficio]` · `cómo hacer un plan de negocios` · `software para pequeños negocios en español` ·
`programa para hacer plan de negocios` · `cómo contratar empleados para mi negocio` · `plan de marketing para mi negocio`

Real Spanish pages at real `/es/*` URLs, translated by a human, with correct `hreflang`. Not machine
-translated English. This is the highest ratio of winnable-to-valuable on the whole list.

### 4.3 🥈 Trade × job pages — where the intent actually lives

Owners don't search "AI co-founder." They search their trade and their job:

- `business plan for an HVAC company` · `for a landscaping business` · `for a food truck` · `for a cleaning business` · `for a trucking company` · `for a salon`
- `marketing plan for a [trade] business` · `30-day social media calendar for a [trade]`
- `how to hire an HVAC technician` · `how to write a job description for a [role]` · `where to post a job for a [trade]`
- `how much does a business consultant cost for a small business`

Low competition, high intent, and Moil already has the proof written — the journey demo *is* an
HVAC company in Austin with real market numbers. `strategy.md` deferred these as "Jobber-style
vertical pages"; they should be the core of the content plan, not the deferred item. Ten of these,
each genuinely different, beat fifty templated ones — and they dodge §1.5 entirely.

### 4.4 🥉 Comparison + alternative queries — the Tally play, aimed correctly

The current `/compare` set targets ChatGPT, Claude, "agency", "consultant" and "bilingual local
shop." Only two of those are things a buyer is actually choosing between, and none is a **product**
comparison query with commercial intent. The queries that convert are the ones naming the tool the
buyer is currently evaluating:

| Build | Why |
|---|---|
| `/compare/moil-vs-liveplan` | The category incumbent; highest-volume alternative query |
| `/compare/moil-vs-upmetrics` | 110K+ users, ranks everywhere, runs its own alternatives hub |
| `/compare/moil-vs-bizway` | Direct AI-native competitor |
| `/compare/liveplan-alternatives` | "Alternatives" queries out-convert "vs" queries |
| `/compare/best-ai-business-plan-generators` | Listicle format — the format LLMs lift from wholesale |
| `/compare/moil-vs-ziprecruiter` (Option A only) | $299/mo hiring-only vs $25/mo platform — a genuinely strong angle |
| Keep + rebuild: `moil-vs-chatgpt`, `moil-vs-claude`, `moil-vs-agency`, `alternative-to-consultant` | Real prompt patterns; the pages just need substance |
| Retire: `bilingual-local-shop` | 301 → a real Spanish landing page |

**Every one must earn its page** (this is where the current set fails):
a self-contained 40–60 word answer up top · a real pricing table with real competitor prices · a
feature matrix · explicit **"best for"** labels · **honest limitations** (Tally publishes these —
admitting what you're not best at is a trust signal LLMs reward) · 6–9 **unique** H3 FAQs, each a
distinct real query · pros/cons · a direct recommendation · a real `dateModified` and an actual
refresh cadence.

### 4.5 The prompts to baseline against

Before shipping anything, run these across ChatGPT, Perplexity, Gemini and Claude and record
whether Moil appears at all. This is the before-picture; without it nothing below is measurable.

```
best AI tool for a small business owner
best AI business plan generator 2026
LivePlan alternatives
cheapest way to get a business plan written
AI tool that writes a business plan and a marketing calendar
software for a small business in Spanish
herramienta de IA para pequeños negocios
cómo hacer un plan de negocios para mi negocio de jardinería
best AI tool for an HVAC business
how do I hire a technician for my HVAC company
alternative to hiring a marketing agency for a small business
what is Moil
is Moil legit
Moil vs LivePlan
bilingual business software for Latino business owners
tools for Hispanic small business owners
```

---

## 5. Implementation plan

Phases 0–2 are repair and must ship in order. Phase 3 onward is the growth work. **Phase 4 is the
one that moves AI recommendations**; if resourcing forces a choice, cut Phase 3 before Phase 4.

### Phase 0 — Stop the bleeding (ship first, no dependencies)

| # | Action | Files |
|---|---|---|
| 0.1 | **Revert the three testimonials** to their pre-`8157cd3` text in `en.ts` + `es.ts`. Obtain written confirmation from Luis Vives, Liliana Cervantes and Miguel Bustos that the restored quotes are theirs. If any cannot be confirmed, remove that entry. | `src/common/translations/{en,es}.ts` |
| 0.2 | Write and adopt a **testimonial policy**: quotes are transcribed, never authored or "aligned to positioning"; every quote carries a dated source (G2, Google, email, recorded call); the policy lives in `CLAUDE.md` so future agents cannot repeat this. | `CLAUDE.md` |
| 0.3 | Remove `AggregateRating` / any 4.8★ claim from JSON-LD **unless** a public, linkable review source exists. Unverifiable ratings in schema are a manual-action risk. | `app/business/layout.tsx` |
| 0.4 | Delete every instance of **"not a hiring platform"** (assumes Option A). | ~14 locations |
| 0.5 | Reduce **"not affiliated with MOIL Limited"** to one sentence on `/about`; replace the rest with `sameAs` entity links in `Organization` schema. | `app/about/page.tsx`, both `layout.tsx` |

### Phase 1 — Retire "shop", restore searched language

| # | Action |
|---|---|
| 1.1 | Global replace of the "shop" lock. **"small business"** / **"small business owner"** as the default; the specific trade where the context is a trade. ~40 locations across `layout.tsx` ×2, `HeroSection.tsx`, `BusinessFaqSection.tsx`, `aeoLocks.ts`, five `/compare` pages, `/about`, `llms.txt`, both footers, `sitemap.ts`. |
| 1.2 | **New H1** for `/business` — must contain a searched term, name the outcome, and survive being read aloud by an assistant. Draft: *"The AI co-founder for small business — your plan, your marketing, and your next hire."* Sub: *"Moil learns your business once, then writes your business plan, runs your market research, builds your 30-day content calendar, and posts your job — in English and Spanish. From $25/month."* |
| 1.3 | Rewrite the **60-word answer block** so it is the paragraph you'd want quoted verbatim in an AI answer: what Moil is, who it's for, what it costs, what makes it different, no marketing adjectives. |
| 1.4 | **De-duplicate the price boilerplate.** State pricing once per page, in a table, with `Offer` schema. Delete the other ~29 recitations. |
| 1.5 | 301 `/compare/bilingual-local-shop` → the new Spanish landing page. |
| 1.6 | Rewrite `public/llms.txt` against the corrected entity. Keep it short; expect nothing from it. |

### Phase 2 — Fix bilingual, and fix the contradictions

| # | Action |
|---|---|
| 2.1 | Move `HeroSection.tsx` fully onto `t.*` — H1, subhead, eyebrow, primary CTA, all five trust pills. |
| 2.2 | Move `BusinessFaqSection.tsx` off the hardcoded `BUSINESS_FAQ_ITEMS` array onto `t.business.faq.items`; reconcile `en.ts` / `es.ts` so both carry the same eight questions with the corrected entity. |
| 2.3 | Move the stats labels onto `t.*`. |
| 2.4 | **Single source of truth for the FAQ**: the JSON-LD in `layout.tsx` must be generated from the same array the component renders — not hand-maintained in parallel. That drift is how the two contradictory FAQ sets appeared. |
| 2.5 | Reconcile the journey demo with the entity: restore `step5` (Smart Hiring) under Option A. |
| 2.6 | Delete the dead keys — or ship what they describe. `t.business.compare.*` is a complete comparison table; **ship it** (§4.4 format). `t.business.hiring.*`: ship under Option A, delete under B. |
| 2.7 | Verify `/es/business` renders 100% Spanish. Human-review the Spanish; confirm `hreflang` reciprocity both ways. |
| 2.8 | Add one visible, dated "last updated" stamp driven by a real value, not a hardcoded string. |

### Phase 3 — Build pages that deserve to rank

| # | Action |
|---|---|
| 3.1 | Rebuild the four surviving `/compare` pages to the full §4.4 spec. Each page's FAQs must be **unique to that page**. |
| 3.2 | Ship the new comparison set (§4.4): LivePlan, Upmetrics, Bizway, `liveplan-alternatives`, `best-ai-business-plan-generators`, and ZipRecruiter under Option A. **Cap at 3 pages per sprint** — a thin comparison hub is worse than none, and §1.5 is how that happens. |
| 3.3 | Ship 5 trade pages (§4.3), starting with HVAC since the proof already exists. Each needs genuinely trade-specific research, numbers and examples — if two pages could swap paragraphs without anyone noticing, both should be one page. |
| 3.4 | Ship 5 Spanish pages at real `/es/*` URLs (§4.2). Human-translated. |
| 3.5 | Build an **`/ai-info` page**, Tally-style: basic info, background, core features, ideal-for, platform, trust signals, real review highlights, clients, **limitations**, and an "AI assistant guidelines" section stating which strengths, use cases and pricing an assistant should reference. Link it from the footer and `llms.txt`. |
| 3.6 | Per-page GEO hygiene: one self-contained answer paragraph, cited statistics with linked sources, real customer quotations, `Article` schema with `author` / `datePublished` / `dateModified`, `BreadcrumbList`. |

### Phase 4 — 🎯 The off-site corpus (this is the actual acquisition work)

Per §2, ~88% of what determines an AI recommendation lives here.

| # | Action | Why |
|---|---|---|
| 4.1 | Claim and fully complete **G2, Capterra, Product Hunt, Trustpilot** profiles. | ~3x citation multiplier |
| 4.2 | **Real review engine** — Tally's method: ask via newsletter and after every support interaction. Target 25+ real G2 reviews in 90 days. Never write one. | The substrate everything else rests on |
| 4.3 | **Distribution-gap database** — catalog every listicle ranking for "best AI business plan generator" / "LivePlan alternatives" / "best AI tools for small business" that does **not** mention Moil. Pitch inclusion. | Gets Moil inside the ~88% |
| 4.4 | **Community presence** — r/smallbusiness, r/Entrepreneur, r/HVAC, r/plumbing, r/restaurateur, plus Spanish-language business communities. Answer questions genuinely, disclose affiliation, don't spam. Route brand + competitor mentions into a shared inbox and clear it daily. | Reddit = 11.97% of ChatGPT citations, 46.7% of Perplexity's top sources |
| 4.5 | **Entity consistency** — Crunchbase, LinkedIn, ZoomInfo, Google Business Profile, identical NAP, cross-linked via `sameAs`. | Fixes the MOIL Limited collision properly (§1.2) |
| 4.6 | **Ask new users the prompt they used.** One onboarding field: "How did you hear about Moil? If it was ChatGPT/Claude/Perplexity — what did you ask?" | Tally's highest-leverage trick; turns AEO from guesswork into a keyword list |

### Phase 5 — Measurement (set up before Phase 1 ships)

| # | Action |
|---|---|
| 5.1 | **Baseline now**: run the §4.5 prompt set across all four assistants, record verbatim. Without a before-picture nothing here is provable. |
| 5.2 | Adopt AI-visibility tracking — Otterly (~$29/mo) is the right starting tier; Peec (€89–199) if prompt-level competitor tracking is needed. |
| 5.3 | **Unblock AhrefsBot + SemrushBot** in `app/robots.ts`. |
| 5.4 | GA4: segment referrals from `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`. |
| 5.5 | Re-run the prompt set monthly. Refresh comparison pages on a real cadence — Tally's freshness is a deliberate tactic, not a side effect. |
| 5.6 | Track *prompts*, not just keywords. The onboarding answers from 4.6 become the roadmap. |

---

## 6. What to stop doing

1. **Never write or "align" a testimonial.** Transcribe or omit.
2. **Never lock a phrase and propagate it verbatim.** Repetition is not consistency; it is the
   scaled-content signature and the loudest AI-slop tell. One canonical answer per page, phrased
   for that page.
3. **Never let the marketing site contradict the product.** If copy has to deny a shipping feature,
   the positioning is wrong, not the feature.
4. **Never pick a word because it's repeatable.** Pick it because people search it. "Shop" failed
   this test; so would "AI co-founder" as a standalone head term — it's a good *brand* line and a
   bad *search* target, which is why §1.2's H1 carries both.
5. **Don't confuse the engineering layer with the substrate.** `llms.txt`, AI-info pages and
   comparison hubs amplify existing reputation. They do not create it. Phase 4 creates it.

## 7. Sequencing summary

```
Phase 0  Revert slop + legal exposure        ← ship immediately, no dependencies
   ↓
§3       ENTITY DECISION (sign-off gate)     ← blocks everything below
   ↓
Phase 5.1  Baseline prompts                  ← before any copy change
   ↓
Phase 1  Retire "shop", restore language
   ↓
Phase 2  Fix bilingual + contradictions
   ↓
Phase 3  Pages that deserve to rank    ║  Phase 4  Off-site corpus  ← the one that matters
   ↓                                   ║     ↓
Phase 5  Measure, monthly              ←──────┘
```

---

## Sources

- [Ahrefs — We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/)
- [5W Research via PR Newswire — Wikipedia and Reddit drive over 25% of ChatGPT citations](https://www.prnewswire.com/news-releases/wikipedia-and-reddit-now-drive-over-25-of-chatgpt-citations-in-the-us-new-5w-research-finds--wsj-nyt-and-bloomberg-do-not-appear-in-the-top-20-302768339.html)
- [Study: ChatGPT Cites a Recommended SaaS Tool's Own Site Just 12% of the Time](https://natlawreview.com/press-releases/study-chatgpt-cites-recommended-saas-tools-own-site-just-12-time)
- [FTC — The Consumer Reviews and Testimonials Rule: Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers)
- [Benesch Law — FTC Endorsement Guides and penalties up to $50k+ per violation](https://www.beneschlaw.com/insight/endorsement-enforcement-ftc-updates-endorsement-guides-and-proposes-rule-that-would-impose-penalties-up-to-50k-per-violation/)
- [Google Search Central — Spam Policies for Google Web Search](https://developers.google.com/search/docs/essentials/spam-policies)
- [FAQ Schema in 2026: What's Confirmed, What's Not](https://www.quattr.com/blog/faq-schema-in-2026)
- [Foundation — How Tally Tapped into GEO to Drive 25% of New Users](https://foundationinc.co/lab/tally-geo/)
- [Tally — AI Info page](https://tally.so/ai-info)
- [Qwairy — Tally.so GEO audit: 10% of signups from ChatGPT](https://www.qwairy.co/blog/how-tally-reached-3-million-arr)
- [Contently — Top 10 Sources LLMs Cite Most in 2026](https://contently.com/2026/04/29/top-sources-llms-cite/)
- [EMGI — The Reddit Citation Study: Subreddits Cited by AI Search](https://emgigroup.com/blog/reddit-citations-saas-ai-search/)
- [Omnibound — GEO Statistics 2026: 60+ Data Points on AI Citations](https://www.omnibound.ai/blog/generative-engine-optimization-statistics)
- [Otterly — Best AI Search Monitoring Tools 2026](https://otterly.ai/blog/best-ai-search-monitoring-and-llm-monitoring-solutions/)
- [Upmetrics — LivePlan Alternatives](https://upmetrics.co/liveplan-alternatives)
- [McKinsey — The economic state of Latinos in America: Building up small businesses](https://www.mckinsey.com/featured-insights/diversity-and-inclusion/the-economic-state-of-latinos-in-the-us)
