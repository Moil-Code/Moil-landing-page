# Playbook 1 — Moil's Own SEO / SEM / AEO System

**Audience:** Moil growth, marketing, and engineering
**Scope:** `moilapp.com` and all Moil-owned surfaces
**Companion doc:** [Playbook 2 — Client SEO/AEO Playbook](./seo-aeo-playbook-clients.md)
**Related:** [`research/strategy.md`](../research/strategy.md) (the /business conversion sprint this playbook operationalizes)
**Owner:** Taiwo · **Review cadence:** monthly · **Last updated:** 2026-08-13

---

## Baseline reality (from the Aug 11 team call)

**Roughly 99% of Moil's customers today come from Andres personally meeting and onboarding them
through cohorts. Almost none come from search.** That reframes this whole document: search is a
*net-new channel being opened*, not an existing channel being tuned. There is no traffic baseline to
protect and no rankings to defend. It also means Analytics cannot guide the early work — it shows who
already arrives, never why the people we want aren't arriving.

### Direction set on that call — these override the defaults below

1. **Questions, not keyword volume.** SEO/AEO here is driven by answering the real questions clients
   ask. Understand the personas and the problems Moil solves, then build Q&As per page around those
   questions. The keyword-volume-first approach was explicitly corrected as backwards: volume tells
   you how many people search a phrase, not which question closes a deal. Volume is a sanity check,
   never the starting point. This is why §4 now opens with personas.
2. **Fix the main website before spinning up anything new.** Multi-page structure, persona sections,
   per-page Q&As, and a link to the blog come first. Separate domains/subdomains come second, as
   campaign redirects (§9.5).
3. **No changes just to make changes.** Every update must tie to a measurable objective — more of the
   right clients reaching the site. If a task can't name its objective, it doesn't ship.

---

## 0. How to read this document

Structure adapted from the [khasky marketing-and-seo-playbook](https://github.com/khasky/marketing-and-seo-playbook)
sequence — research → positioning → trust → conversion → content → technical → AI search → measurement —
and rewritten around Moil's actual product, stack, and competitive set. Every recommendation is
either (a) verifiable in this repo, or (b) traceable to a cited 2026 source in §13.

Three rules govern everything below:

1. **One fact, one value, everywhere.** Price, review count, time-to-hire, founding year, and city
   must be byte-identical across the site, `llms.txt`, schema, G2, LinkedIn, and the blog. LLMs
   punish contradiction by declining to state the fact at all.
2. **Extractability beats eloquence.** A 45-word answer under a question-shaped H2 gets cited. A
   beautiful three-paragraph build-up does not.
3. **No claim without a source.** Same discipline as `research/strategy.md` §2. If we can't cite it,
   it doesn't ship — this is also the single biggest E-E-A-T lever we control.

---

## 1. The 2026 search reality (why this playbook exists)

| Fact | Number | Source |
|---|---|---|
| Organic CTR on queries with AI Overviews | **−61%** (1.76% → 0.61%) | Seer Interactive, 2.43B impressions |
| Clicks lost when an AI Overview appears | **−46.7%** relative | Pew Research, 68k queries |
| Searches ending with no click (AI Mode) | **93%** | 2026 zero-click analyses |
| Searches ending with no click (AI Overview present) | **83%** | ibid. |
| Google queries showing an AI Overview | **~48%** | 2026 AI Overview trackers |
| Extra organic clicks for brands **cited inside** an AI Overview | **+35%** organic, **+91%** paid | Seer Interactive |
| ChatGPT-referred signup conversion | **~15.9%** | 2026 AI-referral analyses |
| Perplexity-referred signup conversion | **~10.5%** | ibid. |
| AI search traffic conversion vs. organic | **~4.4×** | ibid. |
| AI-referral sessions arriving with **no referrer** (land in Direct) | **35–70%** | ibid. |
| Share of global searches Gartner expects AI assistants to handle in 2026 | **~25%** (>50% by 2028) | Gartner |

**The strategic read:** rankings still matter, but ranking without being *cited* now loses most of the
click. Traffic will look flatter than it is, because a third to two-thirds of AI referrals hide in
Direct. So we optimize for **citation share first, rank second, and we measure branded-search lift as
the honest proxy** for exposure we can't see.

**The good news for Moil specifically:** AI referral traffic converts at ~4.4× organic, and Moil is a
low-friction, free-first-conversation product. High-intent, low-volume AI traffic suits us better than
it suits most SaaS.

---

## 2. Current-state audit (what is already true in this repo)

Verified against the codebase on 2026-08-13. This is the baseline; §12 is the plan on top of it.

### Shipped and working

| Asset | Location | Status |
|---|---|---|
| AI-crawler allowlist (16 agents, explicitly enumerated) | [`app/robots.ts`](../app/robots.ts) | ✅ Best-in-class |
| `llms.txt` fact sheet | [`public/llms.txt`](../public/llms.txt) | ✅ Shipped, accurate, consistent |
| Self-canonicals per leaf page, no root override | [`app/layout.tsx:52`](../app/layout.tsx) | ✅ Correctly commented |
| hreflang EN/ES + `x-default` | [`app/business/layout.tsx:52`](../app/business/layout.tsx), [`app/es/business/layout.tsx:42`](../app/es/business/layout.tsx) | ✅ Points at `/es/business`, not `?lg=` |
| Spanish path-prefix route | `app/es/business/` | ✅ Real indexable URL |
| Schema stack on /business (18 types incl. Article, Speakable, HowTo, FAQPage, BreadcrumbList, AggregateRating) | [`app/business/layout.tsx`](../app/business/layout.tsx) | ✅ Unusually complete |
| Comparison pages | `app/compare/moil-vs-chatgpt/`, `app/compare/moil-vs-claude/` | ⚠️ Only 2 of ~8 needed |
| Middleware no longer 301-strips `?lg=` | [`middleware.ts`](../middleware.ts) | ✅ Spanish indexability fixed |
| OG images per surface | `public/og-*.jpg` | ✅ |

### Open gaps (ranked by leverage)

Gaps 1–5 were raised on the Aug 11 call and outrank everything the code audit found on its own. They
are architectural: the site does not represent what Moil does, so no amount of on-page tuning rescues it.

1. **The site is effectively single-page, with no per-page Q&As.** Moil builds strong multi-page,
   Q&A-rich sites *for clients* — and its own landing page is the worst of the set at SEO and AEO.
   Root cause; everything else is downstream.
2. **Whole capability areas have no section or tab:** EDCs and chambers of commerce, websites, and
   content creation. Buyers in those segments find nothing to match against and answer engines have
   nothing to cite.
3. **The blog is orphaned.** It auto-publishes 5 articles every Monday, but nothing on the landing page
   links to it and no section points at it — ~260 articles a year earning close to zero. See §8.2.
4. **No campaign attribution.** No way to tell email vs. social vs. direct. Every channel decision is
   currently made blind, which makes the "measurable objective" rule impossible to honor.
5. **Inconsistent search identity.** "Moil app" and "Moil AI" surface different results (websites vs.
   LinkedIn) and vary by location. Fix it, but explicitly *lower* priority than ranking for the
   problems Moil solves.
6. **Sitemap covers 7 URLs.** `app/sitemap.ts` omits `/compare/*`, `/contact`, `/terms`, `/cookies`,
   `/dmca`, `/dpa`, `/accessibility`, `/privacy-choices`, `/subprocessors`, and every future `/es/*`.
   Comparison pages are the highest-citation-value URLs we own and they aren't in the sitemap.
7. **Blog also lives on `blog.moilapp.com`.** Google treats subdomains as separate sites for authority
   consolidation purposes. 47 articles of link equity are pooling somewhere that doesn't lift
   `/business`. Same for `business.moilapp.com` and `candidate.moilapp.com` — three subdomains
   referenced in `app/robots.ts` sitemap array.
8. **`AhrefsBot` and `SemrushBot` are `Disallow: /`.** Defensible as competitive hygiene, but it also
   breaks our own Ahrefs/Semrush **Site Audit** on `moilapp.com` and removes us from third-party
   datasets that some AI-visibility tools ingest. Decide deliberately (§9.4).
9. **No G2 / Capterra listing.** Per `research/strategy.md` §11 this is a ~3× AEO citation multiplier
   and it's still out of scope. G2 is also the one B2B review site that shows up in Perplexity
   citations. This is the largest single unclaimed lever.
10. **No original research asset.** Original data is the strongest durable GEO lever available and we
   have a data position nobody else has (500+ SMBs, bilingual, hiring + planning + content in one
   product).
11. **Zero `/es/*` coverage beyond `/business`.** No Spanish pricing, candidate, marketing, or compare
   pages, despite bilingual being differentiator #3.
12. **No AI-citation measurement.** No prompt panel, no GA4 AI channel group, no share-of-voice
   baseline. We cannot report on the thing this playbook optimizes.
13. **`?lg=` duplicates now crawlable.** `app/robots.ts` intentionally removed `/*?*lg=` when Spanish
   lived on the query string. Spanish has since moved to `/es/*`, so `?lg=es` variants are now
   crawlable duplicates that canonical back to English. Harmless but wasteful — low-priority cleanup.

---

## 3. Entity layer (do this before content)

AI systems answer about **entities**, not pages. Before optimizing any page, make "Moil" unambiguous.

### 3.1 The canonical fact block

This is the single source of truth. It already lives in [`public/llms.txt`](../public/llms.txt) — keep
it there and mirror it everywhere without paraphrasing.

```
Name:            Moil (product) / Moil Enterprise Inc. (company)
Category:        AI co-founder / AI business platform for small business
Founded:         2023
HQ:              Austin, Texas, USA
Pricing:         Professional $25/mo · Market Pro $75/mo · first AI conversation free, no card
Languages:       English + Spanish (fully bilingual, end to end)
Audience:        SMB owners, 1–20 employees
Proof:           500+ businesses onboarded · 4.8★ · EDC + Chamber of Commerce partnerships
Hiring proof:    11-day average time-to-hire vs. 83.5-day SMB benchmark (SHRM 2025) · 95% match accuracy
Replaces:        consultant ($5–15k/engagement), agency retainer ($3–8k/mo), standalone ATS ($299+/mo)
```

**Rule:** changing any value here is a cross-surface change ticket, not a copy edit. Checklist:
site copy → `en.ts`/`es.ts` → `llms.txt` → all JSON-LD → G2/Capterra → LinkedIn → Crunchbase → blog
boilerplate → sales deck.

### 3.2 Entity graph to build (in order)

| Surface | Why it matters | Effort | Owner |
|---|---|---|---|
| **Crunchbase** profile, complete + funding + founders | Feeds Wikidata and most entity resolvers | S | |
| **LinkedIn** company page, keyword-true tagline, weekly posts | LinkedIn is a top-5 cited domain across AI engines | S | |
| **G2** listing + 20 seeded reviews | ~3× citation multiplier; the one review site Perplexity cites | M | |
| **Capterra / GetApp / Software Advice** (Gartner network) | Category-page presence for "AI business plan software" | M | |
| **Wikidata** item for Moil Enterprise Inc. | Machine-readable entity anchor; feeds Wikipedia-adjacent retrieval | M | |
| **Product Hunt** launch (or re-launch of Content360) | Durable backlink + review corpus | M | |
| **EDC + Chamber** partner pages linking to `moilapp.com` | Real local authority; we already have the relationships | S | |
| **Wikipedia** — only when independent press coverage exists | Highest-value citation source in ChatGPT | L | |

`sameAs` every one of these from the `Organization` schema in `app/layout.tsx` once live.

### 3.3 Consistency audit (monthly, 15 minutes)

Ask each engine verbatim and log the answer: *"What is Moil?"*, *"How much does Moil cost?"*,
*"Where is Moil based?"*, *"Is Moil bilingual?"*. Any wrong or hedged answer is an entity-consistency
bug — trace it to the surface stating the wrong thing.

---

## 4. Personas, their questions, and only then keywords

The order of this section is the point. Personas first, the real questions each asks second, page
structure third, search volume last as a sanity check. Reversing that order was the specific mistake
corrected on the Aug 11 call.

**Why volume-first fails here.** Keyword volume tells you how many people type a phrase. It cannot tell
you which question makes an EDC director book a call, and it systematically under-counts the questions
that matter most — long, specific, high-intent ones asked in a chat window rather than a search box.
With ~99% of customers arriving through cohorts, we also have no traffic data to mine. So we start from
the personas we already know intimately from cohort work, write down the questions they actually ask,
and answer those on a page.

### 4.0 The four personas

Three of these have no section on the site today (gap #2 in §2).

| Persona | What they actually want to know | Page | Status |
|---|---|---|---|
| **SMB owner** (1–20 employees) | Can one tool replace my consultant, agency and ATS? What does it cost? Will it work in Spanish? | `/business`, `/for/smbs` | Exists |
| **EDC** (economic development corp) | How does Moil help me serve the small businesses in my region at scale? What do I report to my board? What does onboarding a cohort look like? | `/for/edcs` | **Missing** |
| **Chamber of Commerce** | What do my members get? Is this a member benefit I can offer bilingually? How do we co-brand it? | `/for/chambers` | **Missing** |
| **Job seeker** | Where are bilingual jobs near me? | `/candidate` | Exists |

**The two unrepresented capabilities:** **websites** and **content creation** have no section, so the
site under-sells what Moil does. Content creation maps to Content360 and needs a capability page plus Q&As.

> ⚠️ **Flag — needs Andres to settle.** "Websites" as a listed Moil capability **contradicts**
> `research/strategy.md` §1, which states Moil does not build websites and uses that as the reason not
> to compare against Durable. The Aug 11 call is the newer input, so it is treated as current and a page
> is scoped below — but the two documents disagree and the comparison-page strategy depends on which is
> right. **Do not ship a websites page until this is confirmed.**

### 4.0.1 Building the Q&A bank

The actual production process — the same one Moil already runs successfully for clients. Per persona:

1. **Harvest real questions** from cohort sessions, onboarding calls, support threads and sales
   objections. Verbatim, in the asker's words.
2. **Group into 8–12 questions per page.** One page per persona or capability, never one page for all.
3. **Answer each in 40–80 words** under a question-shaped `<h2>`, self-contained enough to be lifted
   out of context.
4. **Reconcile with `FAQPage` schema** — one source of truth between visible Q&A and JSON-LD.
5. **Only now check volume**, to pick phrasing among two equally true ways of asking the same thing.
   Never to decide whether a question earns a place.

Seed questions raised directly on the call: *how Moil supports EDCs and chambers of commerce*, and
*AI tools for small businesses*.

### 4.1 Keyword sets — the sanity-check layer

Everything below is secondary to the Q&A bank above. Use it to choose phrasing and to catch demand we
hadn't thought to answer, not to set the agenda.

#### Pool A — Business owner (revenue)

| Intent tier | Example queries | Page type |
|---|---|---|
| **Category / high commercial** | `ai business plan generator`, `business plan software`, `ai tools for small business` | Money page + pillar |
| **Comparison** | `liveplan alternatives`, `bizway vs upmetrics`, `ziprecruiter alternative for small business`, `moil vs chatgpt` | `/compare/*` |
| **Job-to-be-done** | `how to write a business plan for an hvac company`, `how to do market research for a small business`, `30 day content calendar template` | Blog cluster + free tool |
| **Price-led** | `cheap business plan software`, `business plan generator free`, `ai marketing tools under $50` | Pricing + comparison |
| **Bilingual** | `software plan de negocios`, `herramientas de ia para pequeñas empresas`, `plan de negocios con inteligencia artificial` | `/es/*` |

#### Pool B — Job seeker (marketplace supply, feeds Pool A's value)

`bilingual jobs near me`, `spanish speaking jobs`, `hvac technician jobs [city]`, `trabajos en español`.
High volume, low commercial value directly — but candidate liquidity *is* the hiring product. Route to
`/candidate/searchjob` and programmatic job pages, never to `/business`.

#### Pool C — AI prompts (the AEO target list)

These are not keywords; they're the prompts a buyer types into ChatGPT/Gemini. Track ~40, starting
with the 10 already defined in `research/strategy.md` §5 plus:

- "What's the cheapest way to get a business plan and market research done?"
- "I run a 12-person HVAC company and I'm doing everything myself — what software should I use?"
- "Best AI tools for a Latino-owned small business that works in English and Spanish"
- "How do small businesses hire faster than 80 days?"
- "Alternatives to hiring a marketing agency for a small business"
- "Is there one tool that does business planning, marketing, and hiring?"
- "Best AI tool for small business 2026"
- "ZipRecruiter is too expensive — what else can I use to hire?"

**Baseline protocol:** run all 40 across ChatGPT, Gemini, Perplexity, Claude, and Google AI Mode.
Record: does Moil appear (yes/no), position in the answer, whether we're cited with a link, and which
competitors are named. That table is the AEO scoreboard. Re-run monthly, same prompts, same order.

---

## 5. Page architecture

### 5.1 The four page classes

**The one structural rule:** every page in every class below carries its own 8–12 question Q&A block,
built from the §4 process and reconciled with `FAQPage` schema. That is what "multi-page, Q&A-rich"
means — and it is what Moil already builds for clients but not for itself.

```
MONEY PAGES          /business · /business/pricing · /marketing · /candidate
  ↑ internal links from everything below

PERSONA LAYER  (new) /for/smbs · /for/edcs · /for/chambers
                     one page per buyer, each with its own Q&A bank

CAPABILITY LAYER     /capabilities/content-creation      (Content360)
               (new) /capabilities/websites              — blocked pending the §4 flag

COMPARISON LAYER     /compare/moil-vs-<competitor>       (decision-stage, highest citation value)
                     /compare/<competitor>-alternatives   (competitor-brand demand)

USE-CASE LAYER       /solutions/<job>        e.g. /solutions/business-plan
                     /industries/<vertical>  e.g. /industries/hvac

CONTENT LAYER        /blog/<pillar> + spokes  (topical authority, link acquisition)
FREE-TOOL LAYER      /tools/<tool>            (links + top-of-funnel + product demo)
```

### 5.2 Comparison pages — build these next (highest ROI)

Two exist (`moil-vs-chatgpt`, `moil-vs-claude`). Build the rest against the *real* competitor set from
`research/strategy.md` §1 — and keep honoring that doc's rule: **do not** publish Moil-vs-HubSpot or
Moil-vs-Durable, because comparing to a CRM or a website builder makes us look unfocused.

| Priority | URL | Targets |
|---|---|---|
| 1 | `/compare/moil-vs-liveplan` | Category leader, $20–40/mo |
| 2 | `/compare/liveplan-alternatives` | Competitor-brand demand |
| 3 | `/compare/moil-vs-ziprecruiter` | $299/mo anchor, our strongest price story |
| 4 | `/compare/moil-vs-bizway` | Direct AI-native rival |
| 5 | `/compare/moil-vs-upmetrics` | Long-tail category |
| 6 | `/compare/marketing-agency-vs-ai` | The $3–8k/mo economic alternative |
| 7 | `/compare/moil-vs-workable` | ATS long-tail |
| 8 | `/es/compare/moil-vs-chatgpt` | Spanish mirror of our best performer |

**Comparison page template (use for every one):**

1. H1: `Moil vs {Competitor}: {honest one-line verdict}`
2. **40–60 word direct answer** immediately under H1 — the single most-extracted block on the page.
3. Comparison table: price, what it covers, bilingual, hiring included, time-to-value. Real numbers,
   dated, with a "verified {Month Year}" stamp.
4. **"Choose {Competitor} if…"** — a genuine section naming cases where they win. This is what makes
   the page citable rather than promotional; LLMs demote one-sided comparisons.
5. **"Choose Moil if…"**
6. Migration/switching steps.
7. FAQ (5 Qs) reconciled 1:1 with `FAQPage` schema — one source of truth, per `strategy.md` §5.
8. `last reviewed` date, refreshed quarterly.

### 5.3 Industry pages (the vertical play we deferred)

`research/strategy.md` §11 punted these pending /business lift. They are now the clearest expansion
path, because they simultaneously serve search intent, AI prompts ("software for HVAC business"), and
our real proof base.

Ship 4: `/industries/hvac`, `/industries/landscaping`, `/industries/cleaning-services`,
`/industries/restaurants`. Each needs genuine vertical substance — real hiring roles, real seasonal
content-calendar examples, real margin math. Four hand-built pages beat forty templated ones; thin
templated verticals are the classic programmatic-SEO failure and Google's helpful-content systems
target exactly that pattern.

### 5.4 Free tools (link magnets + product demo)

We already have working Gemini endpoints in `app/api/demo/*`. Wrap them as standalone indexable tools:

| Tool | URL | Why |
|---|---|---|
| Business plan outline generator | `/tools/business-plan-generator` | Highest-volume category term |
| Time-to-hire / cost-per-hire calculator | `/tools/cost-per-hire-calculator` | Uses SHRM benchmarks — citable, linkable |
| Content calendar generator (30 days) | `/tools/content-calendar-generator` | Content360 demo |
| Job description writer | `/tools/job-description-generator` | Feeds both sides of the marketplace |

Each: own URL, fast LCP, no signup to see first output, one primary CTA, and a "how this works"
section with the methodology so it's citable.

### 5.5 Blog clusters (move to `/blog` — see §8.2)

Three pillars, spokes linking up and back with descriptive anchors:

1. **Pillar: How to run a small business with AI** → spokes on plan, market research, content,
   hiring, pricing, coaching.
2. **Pillar: Hiring for small service businesses** → spokes on 83.5-day benchmark, job descriptions,
   bilingual hiring, trade-specific roles, interview scorecards.
3. **Pillar: Bilingual business growth / Negocios bilingües** → spokes in both languages. Almost
   uncontested; 5M+ Hispanic-owned US businesses, 35% growth 2019–2024.

Per khasky's content chapter: fewer, deeper guides first. Only after 25–50 posts with traction do
lighter timely posts earn their place.

---

## 6. On-page AEO spec (apply to every new page)

This is the checklist. It encodes what cited pages have in common.

- [ ] **Direct-answer block, 40–60 words, in the first 150 words of visible HTML.** ~55% of LLM
      citations come from the opening block (`strategy.md` §3). Server-rendered, not animated in.
- [ ] **Question-shaped H2s** matching real prompts, each followed by a self-contained 40–80 word
      answer that makes sense lifted out of context.
- [ ] **200–300 word chunks** under clear headers. Retrieval operates on chunks; a 900-word
      undifferentiated section is one bad chunk.
- [ ] **One verifiable claim per sentence.** Kill hedges ("may help you potentially…"). Hedged
      sentences are unciteable.
- [ ] **Named-entity density:** name competitors, tools, standards, cities, and job titles explicitly.
      Pronouns and "our platform" don't resolve to entities.
- [ ] **A number with a source in every major section.** Sourced statistics are the most-extracted
      content type on the web.
- [ ] **Real `<h2>`/`<h3>` tags** for card and comparison titles — not styled `<div>`s
      (`strategy.md` §5 flags this).
- [ ] **Tables and lists** for anything comparative. Tables are extracted near-verbatim.
- [ ] **Visible `Last updated: {date}`**, top and bottom, refreshed monthly. Recency is a retrieval
      signal.
- [ ] **~2,000–3,000 words on money pages.** Sub-800-word pages get ~37% fewer citations
      (`strategy.md` §5).
- [ ] **Everything above server-rendered.** If it needs JS to appear, assume no AI crawler sees it.
      This is why `strategy.md` item 10 (server-render stats' final values instead of animating from
      "0") matters more than it looks.
- [ ] **Schema:** `WebPage` + `FAQPage` + `BreadcrumbList` minimum; `Article` with `author`,
      `datePublished`, `dateModified` on content; `SoftwareApplication` + `Offer` on money pages;
      `Speakable` on the direct-answer block. Only mark up what's visibly on the page.

### 6.1 Direct-answer block — worked example

> **What is Moil?**
> Moil is an AI co-founder for small businesses. In one guided session it writes your business plan,
> runs market research, builds a 30-day content calendar, and posts your job to 10+ hiring platforms —
> fully bilingual in English and Spanish. Plans start at $25/month; the first conversation is free.
> 500+ small businesses have onboarded.

61 words. Names the category, the four jobs, the differentiator, the price, and the proof. Every fact
matches `llms.txt`. This is the shape to copy on every page — swapping in that page's specifics.

---

## 7. Off-site citation surfaces (where the compounding actually happens)

On-page work makes us *citable*. Off-site presence makes us *retrieved*. Per the 30M-citation Peec AI
analysis, Reddit is the most-cited domain across ChatGPT, Google AI Mode, Gemini, Perplexity and AI
Overviews combined; Wikipedia dominates ChatGPT; YouTube dominates Gemini; G2 shows up in Perplexity.
No single domain exceeds ~5% of citations — so the play is *presence across many*, not one big win.

| Surface | Moil play | Multiplier / note |
|---|---|---|
| **Reddit** — r/smallbusiness, r/Entrepreneur, r/HVAC, r/sweatystartup, r/EmpleosUSA | Founder account, genuinely helpful answers, disclosed affiliation, no link-drops | ~4× citation multiplier (`strategy.md` §11); most-cited domain overall |
| **G2 / Capterra** | Listing + 20 seeded reviews + category presence | ~3× multiplier; the B2B review site Perplexity cites |
| **YouTube** | 10 screen-recorded walkthroughs, EN + ES, transcripts published on-site | Owns Gemini citations |
| **LinkedIn** | Founder + company posting original data weekly | Top-5 cited domain |
| **Original research** | See §7.1 — highest-leverage item in this playbook | Creates *net-new* citable facts |
| **Podcasts** | SMB/trades/Latino-business shows; 12/year | Transcripts are dense entity text |
| **Digital PR** | Pitch the research to SMB and Texas business press | Path to Wikipedia eligibility |
| **Directories** | EDC, Chamber, SBA resource pages, Hispanic chambers | Real local authority we already have access to |
| **Guest posts** | Original frameworks only, relevance over DA, varied anchors | khasky content chapter |

### 7.1 The Moil SMB AI Index (build this)

Summarizing other people's statistics makes us a downstream source. Publishing our own makes us the
upstream one. We have data nobody else has.

**Proposal:** an annual + quarterly-updated report from anonymized, aggregated platform data:

- Average time-to-hire by trade among Moil users, vs. the 83.5-day SHRM benchmark.
- Which business-plan sections SMB owners actually revise most.
- English vs. Spanish content-engagement differences for the same business.
- Cost-per-hire distribution vs. the $5,475 SHRM benchmark.

Ship it as: an HTML report page with a table per finding (not a gated PDF), a methodology section, a
`Dataset` schema block, an explicit CC-BY-style "cite this as" line, and downloadable CSV. Then pitch
it. Every citation of a Moil statistic is a citation of Moil — and it is defensible, because it's true.

**Prerequisite:** privacy/legal review of the aggregation and disclosure approach before any data
leaves the platform. Route through the same review that governs `/privacy` and `/dpa`.

---

## 8. Technical SEO — Next.js specifics

### 8.1 Fix the sitemap (this week)

[`app/sitemap.ts`](../app/sitemap.ts) returns 7 URLs. Make it exhaustive and keep the `alternates`
pattern already used for `/business`:

```ts
// add, at minimum:
/compare/moil-vs-chatgpt        priority 0.8   weekly
/compare/moil-vs-claude         priority 0.8   weekly
/contact                        priority 0.5   monthly
/terms /cookies /dpa
/accessibility /privacy-choices /subprocessors   priority 0.3   yearly
// then every /compare/*, /industries/*, /solutions/*, /tools/*, and /es/* as they ship
```

Two hygiene notes: `lastModified: new Date()` on every entry stamps *today* on every deploy, which
trains Google to ignore our `lastmod` values — use real per-page content dates. And avoid `priority`
theater: Google largely ignores it, so keep it coarse.

### 8.2 Rescue the blog — link it, then consolidate it

The highest-leverage technical change available, with two independent halves. Do them in this order:
the first is an afternoon, the second is a project.

**Half one: stop orphaning it.** The blog auto-publishes 5 articles every Monday and *nothing on the
landing page links to it*. Unlinked pages get almost none of the site's authority and are discovered
only via the sitemap, so ~260 articles a year produce close to nothing. Fix:

- A real **Resources / Blog** entry in the primary nav and the footer.
- A blog section on `/business` surfacing the 3 most recent relevant posts.
- Contextual links from each persona and capability page into the posts answering that persona's
  questions — and back from each post to its persona page. This is the hub-and-spoke pattern from §5,
  and it is what turns 260 orphaned posts into topical authority.

> **Audit before amplifying.** Five auto-published articles a week is a volume machine, and khasky's
> anti-pattern list warns specifically against volume before pillar assets. Before linking it
> prominently, sample 15 posts and check they are genuinely useful and on-persona. If they are thin,
> linking them *hurts* — fix the generator's brief first, then link. Turning the volume down and the
> quality up is a legitimate outcome of this audit.

**Half two: move it onto the apex domain.** `blog.moilapp.com`, `business.moilapp.com`, and
`candidate.moilapp.com` each accumulate authority separately from the apex. Move the blog to a path on the main domain via Next.js rewrites in
`next.config.js`:

```js
async rewrites() {
  return [{ source: '/blog/:path*', destination: 'https://blog.moilapp.com/:path*' }]
}
```

Then 301 the subdomain to the path, update internal links and `robots.ts`, and resubmit. 47 articles
of link equity begin lifting `/business` instead of a sibling property. Sequence carefully with
whoever owns the blog platform; a botched migration is the one change here that can lose traffic.

### 8.3 Core Web Vitals

Targets from `strategy.md` §7 stand: Lighthouse mobile ≥90 performance, 100 SEO, ≥95 a11y.
LCP < 2.5s, INP < 200ms, CLS < 0.1 — **field** data in Search Console, not lab scores. Specifics
already identified in that doc: `next/image` for Cloudinary testimonial images with explicit
dimensions, `prefers-reduced-motion` gates on the counter interval and IntersectionObserver, hero
preload, and a Bebas Neue subset audit (it currently loads sitewide from `app/layout.tsx`).

81% of AI Overview queries are mobile — mobile field vitals are the ones that count.

### 8.4 Crawl and indexation hygiene

- Verify all four properties in Search Console (apex + three subdomains) and submit each sitemap.
- Keep the khasky rule: to keep a page out of the index, **allow** crawling and serve `noindex`.
  `Disallow` + `noindex` silently cancels the `noindex`.
- Re-add `/*?*lg=` to the `*` disallow group in `app/robots.ts` now that Spanish lives at `/es/*`.
  The self-canonical already handles it, so this is crawl-budget cleanup, not a bug fix — and the
  comment block in `robots.ts` should be updated to record the new reasoning.
- Audit redirect chains on the `/` → `/business` hop; it must be a single 301.
- Set up a monthly Screaming Frog or Sitebulb crawl. Note that our own `AhrefsBot`/`SemrushBot`
  blocks limit those vendors' site-audit features on `moilapp.com` (§9.4).

### 8.5 Bilingual expansion

Reciprocal hreflang is correct today on `/business` ↔ `/es/business` with `x-default` → English.
Extend the same pattern as each Spanish page ships. Priority order:
`/es/business/pricing` → `/es/candidate` → `/es/marketing` → `/es/compare/*`.

Translate, don't machine-mirror: Spanish keyword research is separate work (`plan de negocios`,
`herramientas de IA para pequeñas empresas`), and `es.ts` key parity must land in lockstep with
`en.ts` per `strategy.md` §6.

### 8.6 `llms.txt` — decision recorded

`strategy.md` §5 said don't ship it (no measurable lift per the Search Engine Land study). It has since
shipped at [`public/llms.txt`](../public/llms.txt) and is accurate and well-written.

**Resolution: keep it.** Not because it drives traffic — the evidence still says it doesn't — but
because it is now our most compact canonical fact sheet, it costs ~zero to maintain, and it gives
every human and agent one unambiguous place to read Moil's facts. Treat it as an entity-consistency
artifact, hold it to the §3.1 change checklist, and do not credit it with traffic in reporting.

---

## 9. Paid search and paid-media interaction

SEM here is a *complement* to the AEO thesis, not a separate program.

### 9.1 Where paid earns its place

1. **Brand defense.** Competitors bid on "Moil"; AI answers increasingly name alternatives. Cheap,
   high-ROAS, non-negotiable.
2. **Comparison-term coverage while the organic pages age.** Bid `liveplan alternatives`,
   `ziprecruiter alternative` and point them at the matching `/compare/*` page — the ad buys traffic
   now, the page earns citations later, and paid CTR data tells us which comparison pages to build next.
3. **The AI-Overview arbitrage.** Cited brands see **+91% paid clicks** on AI-Overview SERPs. Where
   we're organically cited, raise paid bids on the same query — the two multiply.
4. **Spanish-language paid.** Materially less competition than English; test early.

### 9.2 Where not to spend

Don't buy broad head terms (`small business software`) to compensate for a thin page — khasky's
anti-pattern list names this directly, and at 83% zero-click those SERPs are expensive. Don't run
remarketing to paper over an activation problem; fix onboarding first.

### 9.3 UTM discipline — and the attribution blind spot

> **Gap #4 from §2.** There is currently no way to tell whether a visitor came from email, social or
> direct. Until that is fixed, every channel decision is a guess and the "measurable objective" rule
> cannot be honored. This is the cheapest high-value fix in the document: a naming convention plus a
> GA4 channel group, no code.

```
?utm_source=google&utm_medium=cpc&utm_campaign=compare-liveplan&utm_content=headline-b
?utm_source=chamber&utm_medium=referral&utm_campaign=partner-directory
?utm_source=newsletter&utm_medium=email&utm_campaign=2026-09-cohort&utm_content=cta-footer
?utm_source=linkedin&utm_medium=social&utm_campaign=edc-launch&utm_content=carousel-a
```

Standardize on the five-parameter scheme, write it in one place the whole team uses, and align it with
the GA4 channel groups in §10. Every email send and social post gets tagged with no exceptions — one
untagged campaign poisons the comparison for the whole month. Keep `?ref=`/`?trk=`/`?fbclid=`/`?gclid=`
disallowed in `robots.ts` as they are today.

### 9.5 Campaign domains and subdomains — reconciled

The call set the direction: after the main site is fixed, stand up separate domains or subdomains as
redirects (e.g. `/SMBs`, `/EDCs`) that double as per-campaign tracking links. The goal is right; the
mechanism needs one adjustment, because §8.2 is simultaneously arguing to *collapse* subdomains. Both
hold at once if the two jobs are separated:

| Job | Mechanism | Why |
|---|---|---|
| **Rank and get cited** | Real *paths* on the apex: `moilapp.com/for/edcs` | Keeps authority on one domain; a redirect can never rank |
| **Be memorable in a campaign** | Short vanity domain or subdomain, 301 into the path: `moilforedcs.com` → `/for/edcs` | Speakable on a call, printable on a flyer |
| **Attribute the campaign** | UTMs preserved through the 301, or appended by the redirect rule | This is the actual tracking mechanism — not the domain itself |

**The one thing to get right:** a 301 must **preserve the query string**, or the UTMs die at the
redirect and the campaign becomes untrackable — the exact problem we're solving. Test each vanity domain
with a tagged URL before it goes on any flyer. Keep the destination a real indexable path: the redirect
is for humans and attribution, never for SEO.

### 9.4 Decision needed: unblock Ahrefs/Semrush?

**Current:** `Disallow: /` for `AhrefsBot`, `SemrushBot`, `MJ12bot`, `DotBot`.
**Cost:** we can't run their site audits on our own domain; we're absent from datasets some
AI-visibility tools ingest; competitors still see our backlinks (those are discovered from *other*
sites' pages, not ours).
**Benefit:** marginally less competitive intel flowing outward, and a little crawl budget.
**Recommendation:** unblock `AhrefsBot` and `SemrushBot` (keep `MJ12bot`/`DotBot` blocked). The
diagnostic value to us exceeds the intel value to competitors, who can already see most of it.
Owner decision — record it in the `robots.ts` comment block either way.

---

## 10. Measurement

### 10.1 GA4 setup

GA4 added a native **AI Assistant** channel to the Default Channel Group on 2026-05-13. It covers
ChatGPT and Gemini but **excludes Perplexity** and every referrer-less session — so still build a
custom channel group:

```
Channel name: AI Surfaces
Condition:    Source matches regex
chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|bard\.google\.com|meta\.ai|you\.com|bing\.com/chat
```

Then: mark `start_free_trial` / `demo_started` / `register_click` as key events; add a hidden
`first_touch_source` field on the signup form so attribution survives into CRM; and segment by
language to see whether `/es/*` pulls its weight.

**And the channels we currently cannot see at all.** Before the AI-surfaces work, close gap #4. These
only work if §9.3's UTM discipline is applied to every send and every post.

| Channel group | Matches | Answers |
|---|---|---|
| **Email — campaign** | `utm_medium = email` | Which sends actually drive signups |
| **Social — organic** | `utm_medium = social`, no paid source | Whether posting is worth the hours |
| **Social — paid** | `utm_medium` in `cpc, paid_social` | Ad ROAS by campaign |
| **Partner — EDC / chamber** | `utm_source` in the partner list | Which partnerships send real traffic — the §5 persona pages depend on this |
| **AI Surfaces** | the regex above | Citation-driven traffic |

Report all of them against one denominator — signups — so channels can be compared rather than admired
separately.

**State the limitation in every report:** 35–70% of AI referrals arrive with no referrer and land in
Direct. Any "AI traffic" number we publish is a floor, not a measurement.

### 10.2 The AEO scoreboard (the number that matters most)

Monthly, same 40 prompts from §4.3, across ChatGPT / Gemini / Perplexity / Claude / Google AI Mode:

| Metric | Definition | Target, month 6 |
|---|---|---|
| **Citation rate** | % of prompts where Moil appears | 35% |
| **Linked-citation rate** | % where we appear *with* a link | 20% |
| **Share of voice** | Moil mentions ÷ all vendor mentions | 15% |
| **Fact accuracy** | % of appearances stating price/features correctly | 95% |
| **Competitor set** | Which rivals get named alongside us | tracked, not targeted |

Do this manually to start — a spreadsheet and an hour a month. Only buy a tool (Profound, Peec,
Otterly, AthenaHQ) once the manual version proves we'll act on the data.

### 10.3 Branded-search lift (proxy for invisible AI exposure)

Search Console → Performance → queries containing "moil". Most AI exposure produces no click at all;
people read the answer, then search the brand later. Branded impressions and clicks are the honest
proxy for AI recommendation volume. Track the trend, not the absolute.

### 10.4 KPI tree

```
Trials started (from organic + AI surfaces)
├── AI-surface sessions           ← AEO scoreboard, entity graph, off-site presence
├── Non-branded organic clicks    ← comparison + industry + tool pages, technical health
├── Branded organic clicks        ← AI exposure proxy, PR, research asset
└── Conversion rate by surface    ← direct-answer clarity, pricing page, demo friction
```

### 10.5 Cadence

| Rhythm | Work |
|---|---|
| **Weekly** | GSC impressions/clicks delta; CWV field check on `/business`; competitor homepage-and-hero diff; publish per calendar |
| **Monthly** | 40-prompt AEO scoreboard; entity consistency audit (§3.3); refresh `Last updated` stamps; sitemap diff vs. routes; GA4 AI-surfaces review |
| **Quarterly** | Comparison-page fact refresh + `verified` stamps; full technical crawl; keyword-and-prompt list refresh; research-asset update; roadmap re-prioritization |
| **Annually** | SMB AI Index full edition; competitive-set review; schema audit against current spec |

Wire the weekly/monthly items into the existing `/loop` cadence described in `strategy.md` §10.

---

## 11. Anti-patterns (adapted from khasky, made Moil-specific)

1. **Scaling paid before `/business` converts.** The conversion sprint in `research/strategy.md`
   precedes any spend increase.
2. **Publishing thin verticals at volume.** Four real industry pages, not forty templated ones.
3. **Treating SEO as keywords only.** At 83% zero-click on AI-Overview SERPs, entity and citation work
   *is* the SEO work.
4. **Trusting attribution reports as ground truth.** Up to 70% of AI referrals are invisible. Report
   floors and proxies, and say so.
5. **Volume content before pillar assets.** Deep guides first; light posts after 25–50 posts of
   traction.
6. **Comparing to the wrong competitors.** No Moil-vs-HubSpot, no Moil-vs-Durable. `strategy.md` §1
   explains why, and it applies to `/compare/*` as much as to the homepage.
7. **Inconsistent facts across surfaces.** Price on the pricing page ≠ price in `llms.txt` means AI
   engines stop stating our price at all.
8. **Animated or client-only key content.** Stats animating from "0" means bots read "0".
9. **Measuring signups without activation.** A trial that never generates a plan is not a win.
10. **One-sided comparison pages.** No honest "choose them if…" section means the page reads as an ad
    and doesn't get cited.

---

## 12. 90-day roadmap

Ordered by leverage-per-unit-effort. Each row is one ticket.

### Tranche 0 — weeks 1–4: what the Aug 11 call directed

| # | Task | Objective it serves | Effort |
|---|---|---|---|
| 0.1 | Harvest the real questions per persona from cohort and onboarding sessions (§4) | Everything downstream is built from this list | M |
| 0.2 | Link the blog: nav + footer + a section on `/business` | Recovers ~260 articles/yr from orphaning | S |
| 0.3 | Sample-audit 15 auto-published posts before amplifying them | Avoids linking thin content | S |
| 0.4 | UTM convention written down; every email and social post tagged | Closes the attribution blind spot | S |
| 0.5 | GA4 channel groups: email, social, partner, AI surfaces | Makes channels comparable | S |
| 0.6 | `/for/edcs` with its own 8–12 question Q&A block | A named buyer with no page today | M |
| 0.7 | `/for/chambers` with its own Q&A block | Same | M |
| 0.8 | `/capabilities/content-creation` with Q&A block | Site under-sells Content360 | M |
| 0.9 | Retest "Moil app" vs "Moil AI" in clean browsers, incognito, 2+ locations | Diagnoses the split identity | S |
| 0.10 | Confirm with Andres whether **websites** is a Moil capability (§4 flag) | Unblocks a page and the Durable comparison call | S |

**Deliberately not in Tranche 0:** campaign domains and subdomains. The call was explicit that they come
*after* the main website is fixed, and §9.5 explains why they can't rank on their own anyway.

### Days 1–30 — Foundation and measurement

| # | Task | Files / surface | Effort |
|---|---|---|---|
| 1 | Exhaustive sitemap with real `lastModified` dates | `app/sitemap.ts` | S |
| 2 | GA4 AI-Surfaces channel group + key events + hidden form field | GA4 | S |
| 3 | 40-prompt AEO baseline across 5 engines | spreadsheet | M |
| 4 | Entity fact block locked; audit every surface against §3.1 | all | S |
| 5 | Crunchbase + LinkedIn + Wikidata complete, `sameAs` wired | `app/layout.tsx` | M |
| 6 | G2 + Capterra listings live; first 20 review requests sent | off-site | M |
| 7 | Ahrefs/Semrush robots decision recorded | `app/robots.ts` | S |
| 8 | Verify 4 GSC properties, submit all sitemaps | GSC | S |
| 9 | CWV pass on `/business` + `/es/business` (`strategy.md` §7 items) | `page.tsx`, images, fonts | M |

### Days 31–60 — Pages that earn citations

| # | Task | Effort |
|---|---|---|
| 10 | `/compare/moil-vs-liveplan` + `/compare/liveplan-alternatives` | M |
| 11 | `/compare/moil-vs-ziprecruiter` + `/compare/marketing-agency-vs-ai` | M |
| 12 | Retrofit the §6 AEO spec onto both existing `/compare` pages | S |
| 13 | `/industries/hvac` + `/industries/cleaning-services` (real vertical substance) | L |
| 14 | Blog → `/blog` consolidation (rewrite + 301 + internal links + robots) | L |
| 15 | `/es/business/pricing` + hreflang + sitemap | M |
| 16 | `/tools/cost-per-hire-calculator` (SHRM-benchmarked, citable) | M |

### Days 61–90 — Compounding assets

| # | Task | Effort |
|---|---|---|
| 17 | **Moil SMB AI Index v1** — report page, `Dataset` schema, CSV, "cite this as" (after privacy review) | L |
| 18 | Digital PR push on the Index; 5 SMB/Texas/Latino-business outlets | M |
| 19 | 10 YouTube walkthroughs, EN + ES, transcripts published on-site | L |
| 20 | Reddit presence: 3 subreddits, disclosed, genuinely useful, 8 weeks in | M |
| 21 | Remaining 4 comparison pages | M |
| 22 | `/industries/landscaping` + `/industries/restaurants` | M |
| 23 | Brand-defense + comparison-term paid campaigns live with §9.3 UTMs | M |
| 24 | Month-3 AEO scoreboard vs. baseline; re-prioritize from the delta | S |

**Success criteria at day 90:** citation rate ≥20% (from baseline), all money pages meeting the §6
spec, blog consolidated onto the apex, G2 live with 20+ reviews, Index v1 published and pitched, and a
scoreboard we actually run every month.

---

## 13. Sources

**Repo and internal**
- [khasky/marketing-and-seo-playbook](https://github.com/khasky/marketing-and-seo-playbook) — structural model; chapters on technical SEO, content/link building, AI search & GEO, marketing pages & attribution, keywords & tools
- [`research/strategy.md`](../research/strategy.md) — Moil positioning, defensible facts, AEO decisions
- [`app/robots.ts`](../app/robots.ts), [`app/sitemap.ts`](../app/sitemap.ts), [`public/llms.txt`](../public/llms.txt), [`middleware.ts`](../middleware.ts), [`app/business/layout.tsx`](../app/business/layout.tsx)

**AI search impact and zero-click**
- [Zero-Click Search Statistics 2026](https://www.digitalapplied.com/blog/zero-click-search-statistics-2026-complete-data)
- [AI Overviews CTR Statistics 2026 — WordsAtScale](https://wordsatscale.com/ai-overviews-ctr-statistics-2026/)
- [AI Overviews Killed CTR 61% — Dataslayer](https://www.dataslayer.ai/blog/google-ai-overviews-the-end-of-traditional-ctr-and-how-to-adapt-in-2025)
- [Google AI Mode and Zero-Click](https://pasqualepillitteri.it/en/news/811/google-ai-mode-zero-click-seo-2026-en)
- [Google AI Overviews in 2026: 48% of Searches](https://thestacc.com/blog/google-ai-overview-statistics/)
- [AI SEO Statistics 2026 — Omnibound](https://www.omnibound.ai/blog/ai-seo-statistics)

**AEO / GEO practice and research**
- [GEO: Generative Engine Optimization (Princeton, arXiv 2311.09735)](https://arxiv.org/pdf/2311.09735)
- [Generative engine optimization — Wikipedia](https://en.wikipedia.org/wiki/Generative_engine_optimization)
- [GEO: The Complete Guide for 2026 — LLM Pulse](https://llmpulse.ai/blog/geo-guide/)
- [GEO, AEO, and SEO in 2026 — WRITER](https://writer.com/blog/geo-aeo-optimization/)
- [AEO: Complete Guide 2026 — AirOps](https://www.airops.com/blog/aeo-answer-engine-optimization)
- [AEO Complete Guide 2026 — Frase](https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai)
- [AEO: 6 Best Practices for 2026 — Position Digital](https://www.position.digital/blog/answer-engine-optimization-best-practices/)

**Citation source distribution**
- [Top domains cited by AI search: 30M sources — Peec AI](https://peec.ai/blog/top-domains-cited-by-ai-search-analysis-based-on-30m-sources)
- [The Most-Cited Domains in AI: A 3-Month Study — Semrush](https://www.semrush.com/blog/most-cited-domains-ai/)
- [Top 10 Sources LLMs Cite Most in 2026 — Contently](https://contently.com/2026/04/29/top-sources-llms-cite/)
- [How Reddit Affects AI Visibility in 2026](https://quickseo.ai/blog/how-reddit-affects-ai-visibility-2026)

**Measurement**
- [How to Track ChatGPT, Perplexity, and Gemini Traffic in GA4 (2026) — Insightland](https://insightland.org/blog/how-to-track-chatgpt-perplexity-and-gemini-traffic-in-ga4-a-complete-2026-setup-guide/)
- [Track ChatGPT, Perplexity & Gemini Traffic in GA4 — AuthorityTech](https://authoritytech.io/blog/ai-traffic-attribution-how-to-track-chatgpt-perplexity-gemini)
- [GA4 AI Search Referral Attribution — OrganikPI](https://organikpi.com/blog/technical-seo/ga4-ai-search-referral-attribution/)

**Internal — direction and constraints**
- **Moil team call, August 11 2026** (Andres, Jacob, Taiwo; 48m) — source for the questions-not-volume
  doctrine, the EDC and chamber personas, the websites and content-creation gaps, the orphaned blog, the
  missing campaign attribution, the brand-name split, the fix-the-main-site-first sequencing, and the
  ~99%-from-cohorts baseline. Where this call and `research/strategy.md` (2026-06-09) disagree, the call
  is newer and treated as current — with the one unresolved conflict flagged in §4.

**Cited in `research/strategy.md`, carried forward here:** Salesforce SMB Trends Report 6th ed. (2025);
SHRM 2025 Recruiting Benchmarking Report; SBA Office of Advocacy + Stanford SLEI; UCLA Latino Policy &
Politics Institute.
