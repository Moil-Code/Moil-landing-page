# Moil landing page — SEO / AEO audit and implementation plan

**Status: audit + plan. Positioning decided 2026-08-19 — plan and marketing lead, hiring de-linked. No code shipped yet.**
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

## 3. Decision — made: plan + marketing, hiring de-linked

**Decided by Andres, 2026-08-19.** Hiring stopped being the main product some time ago. Clients
stay for Moil360 and the coach — the thing that learns the business, remembers it, and produces the
content they need. Usage says so; the copy should follow usage rather than the other way round.

**Moil is: the thing that runs a small business's marketing.** Plan and research feed it; Moil360
is the output; the coach is what keeps it right over time.

**The job marketplace stays live and fully de-linked.** `/candidate` and
`candidate.moilapp.com` continue to exist as their own product. They disappear from the `/business`
narrative, the business nav, `llms.txt`, and every business-side schema block. No hiring language
survives anywhere on the business surface.

### Three consequences that follow immediately

**a. The testimonial fix changes shape.** Phase 0 originally said "revert to the originals." Those
originals are hiring quotes — restoring them as featured proof now contradicts the positioning.
**They still must come out of the codebase**, because the shipped versions are fabricated. But the
replacement is not a rewrite — rewriting them is the original sin. The replacement is to **collect
new, real quotes about Moil360 and the coach** and run with *zero testimonials in the interim*. An
empty section costs less than a fabricated one, and it costs far less than a legal exposure.

**b. `/compare/moil-vs-chatgpt` is now factually wrong.** It claims "ChatGPT is a blank chat. Every
session starts from zero." ChatGPT shipped persistent cross-conversation memory and now stores
10,000+ facts per user. Any assistant evaluating that page will correct it — on the exact page built
to win the comparison. The real difference is narrower and more defensible: **ChatGPT remembers
facts about you; Moil holds structured business context and turns it into finished, scheduled
deliverables.** Memory is not the wedge. Memory plus output is.

**c. The price anchor breaks against the new competitor set.** "$25 vs a $5,000 consultant" works.
"$75 vs Buffer at $5/channel, Publer at $4, Later at $18.75, SocialBee at $29" does not. The honest
frame: those tools **schedule what you write** — Moil **writes it**. That is a real difference, but
it must be argued explicitly on every comparison page, never assumed.

---

## 4. Naming — what the research says, not what we'd like

The instinct that "AI" is overused and slightly repellent is empirically supported. The instinct
that "co-founder" should therefore lead is not — but "co-founder" does have a place.

### 4.1 On "AI"

| Finding | Source |
|---|---|
| "AI" in product descriptions **lowers emotional trust**, which lowers purchase intent (1,000+ US adults) | WSU / *J. Hospitality Marketing & Mgmt* |
| The penalty is **amplified for symbolic products and disappears for functional ones** | *Frontiers in Psychology*, Jun 2026 |
| **Detailed** AI disclosure reduces brand skepticism; **superficial** disclosure increases it | Sagepub, 2026 |
| AI labels raise appeal via novelty while lowering it via lost authenticity — the net depends on framing | Sagepub, 2026 |

Moil is a functional product — it produces a calendar — so "AI" is not fatal here. But it is doing
no work in a headline while occupying the most valuable words on the page. And **"AI co-founder" as
a bare adjective is superficial disclosure — the exact form that measurably increases skepticism.**
Describing what the system actually does is the form that builds trust.

### 4.2 On "co-founder"

A positioning word, not a search word — and currently aimed at the wrong person. "AI co-founder"
lives in startup and VC media (Forbes, Y Combinator, CoFounder.AI, Medium). Its native speakers are
**startup founders**. A landscaper, a restaurant owner, a salon owner does not call themselves a
founder and is not shopping for a co-founder.

This is structurally the same error as "shop": a word borrowed from a world the customer does not
live in. Tech-world instead of retail-world, but the same mistake — which is why swapping one for
the other would not fix anything.

**It keeps a job, just not the H1's job.** As the emotional frame — someone in it with you, who
knows the business — it is strong, it is Moil's existing equity, and it belongs on the eyebrow /
brand line.

### 4.3 On "coach"

The AI business coach category is forming (Sintra, GhostCoach, Buddy, iTrepreneur at ~$39.99/mo),
so there is some demand. But the category is defined by **advising**, and the research on it is
blunt: the platforms that win "integrate naturally into daily business operations rather than
sitting on the side as advice-only tools." Moil produces finished work. "Coach" files it under
not-doing, and undersells the only thing customers are actually staying for.

### 4.4 What people actually search: the job, not the helper

| Demand signal | Evidence |
|---|---|
| **"done for you social media" / DFY social media** — an established category term with its own content ecosystem | Category analysis, 2026 |
| **42% of small businesses already outsource social media management** | Clutch survey |
| **73% lack of time · 58% inconsistent posting · 47% content-creation fatigue · 41% managing multiple platforms** | Buffer survey of small business owners |
| **67% cite lack of time** as why they cannot stay consistent | 1,200-owner survey |
| Professionals lose **~9.3 hrs/week** rebuilding context in AI tools; ~87 hrs/yr re-establishing who they are | Context-continuity research, 2026 |
| `calendario de contenidos para redes sociales` is established Spanish demand — HubSpot, GoDaddy, Adobe and Hootsuite all compete for it | Spanish SERP review |

Nobody searches a metaphor for the helper. They search the job that is not getting done.

### 4.5 The architecture — four surfaces, four readers

This is the actual lesson of the "shop" failure. It was not a bad word so much as **one lock forced
onto four surfaces that have different readers.** The fix is not a better lock.

| Surface | Reader | Needs | Language |
|---|---|---|---|
| H1 / hero | Owner, first 3 seconds | To recognize their own problem | The job, in their words. No "AI", no metaphor. |
| Eyebrow / brand line | Same owner, 5 seconds later | An emotional frame | **"co-founder" lives here** |
| Answer block · schema · `llms.txt` · `/ai-info` | The machine | A category it can classify and recommend | **"AI" lives here** — explicit and detailed, where disclosure builds trust |
| Titles · URLs · comparison pages | Search | To match the query | The job + the trade |

### 4.6 Recommended lead copy

**H1** — the job, in the owner's words:

> **You run the business. Moil runs the marketing.**

**Subhead** — the mechanism, including the continuity that is the real retention driver:

> Moil learns your business once — what you sell, who buys, how you talk — then writes your month
> of content and keeps it coming. English and Spanish. From $25/month.

**Eyebrow** — where "co-founder" does its work:

> The co-founder who handles what you never get to.

**Answer block** (for assistants — detailed disclosure, functional framing, no adjectives):

> Moil is an AI marketing platform for small businesses. It interviews the owner once about what
> they sell, who buys, and how they talk, then produces a 30-day content calendar with captions and
> images, refreshes it each month, and answers questions about the business using that stored
> context. Fully bilingual English/Spanish. $25/month; the full Moil360 calendar is $75.

Alternates worth testing against the H1, same register: *"The month of content your business never
has time to make."* · *"Your marketing, written for the month ahead."*

---

## 5. Where the demand is

### 5.1 🥇 Bilingual Spanish — uncontested, and currently broken

Unchanged from the original audit and now more valuable, since content marketing is the lead. See
§1.4 — `/es/business` currently renders English. Buffer, Later, Hootsuite, SocialBee and Publer are
English-first; `calendario de contenidos para redes sociales` is contested only by generic
publisher content (HubSpot, GoDaddy, Adobe), not by a bilingual product that actually writes the
calendar.

`calendario de contenidos para redes sociales` · `qué publicar en redes sociales para mi negocio` ·
`ideas de contenido para negocios pequeños` · `plan de marketing para mi negocio` ·
`programa para redes sociales en español` · `cómo hacer un plan de negocios`

### 5.2 🥈 The job, by trade

Owners search their trade and the job that is not done:

`what to post on social media for a [trade] business` · `social media content ideas for a landscaping business` ·
`done for you social media for small business` · `30-day content calendar for a restaurant` ·
`how to stay consistent posting for my business` · `social media for contractors` ·
`marketing plan for an HVAC company`

Low competition, high intent, and it maps directly onto the evidenced pain (73% time, 58%
consistency). Ten genuinely distinct pages beat fifty templated ones.

### 5.3 🥉 Comparison and alternative queries — retargeted

The old set aimed at consultants and agencies. Under the new positioning the buyer is comparing
**content tools**, and Moil must argue the schedule-vs-write distinction explicitly (§3c).

| Build | Angle |
|---|---|
| `/compare/moil-vs-buffer` | Buffer schedules what you write; Moil writes it. Highest-volume comparison in the category. |
| `/compare/moil-vs-later` | Same axis, visual-first competitor at $18.75/mo |
| `/compare/moil-vs-hootsuite` | Incumbent; OwlyGPT makes the AI-content comparison direct |
| `/compare/best-ai-content-calendar-tools` | Listicle format — what assistants lift wholesale |
| `/compare/done-for-you-social-media-alternatives` | Positions Moil against agencies **and** tools at once |
| `/compare/moil-vs-chatgpt` | **Rewrite** — the "blank chat" claim is false (§3b) |
| Keep: `moil-vs-agency`, `alternative-to-consultant` | Still real prompt patterns; the cost anchor works here |
| Retire: `bilingual-local-shop`, `moil-vs-claude` | 301 the first; the second duplicates the ChatGPT page |

Every page must carry: a self-contained 40–60 word answer, a real pricing table with real
competitor prices, a feature matrix, explicit "best for" labels, **honest limitations**, 6–9 unique
FAQs, pros/cons, a direct recommendation, and a real refresh cadence.

### 5.4 Baseline prompts

```
best AI tool to write social media content for my small business
done for you social media for small business
what should I post for my landscaping business
tool that writes a month of social media content
best AI content calendar tool
Buffer alternatives for a small business that has no time to write
herramienta para crear contenido de redes sociales en español
calendario de contenidos para redes sociales negocio pequeño
AI marketing tool that remembers my business
what is Moil / is Moil legit / Moil vs Buffer
tools for Hispanic small business owners
```

---

## 6. Implementation plan

Phases 0–2 are repair and ship in order. **Phase 4 is the one that moves AI recommendations** — if
resourcing forces a choice, cut Phase 3 before Phase 4.

### Phase 0 — Stop the bleeding

| # | Action |
|---|---|
| 0.1 | **Remove the three fabricated testimonials.** Do not restore the hiring originals as featured proof (§3a) and do not rewrite them. Ship with no testimonials until real Moil360/coach quotes exist. |
| 0.2 | Write the **testimonial policy into `CLAUDE.md`**: transcribed, never authored or "aligned to positioning"; every quote carries a dated source. This is what stops a future agent repeating it. |
| 0.3 | Remove the 4.8★ `AggregateRating` from JSON-LD unless a public, linkable review source exists. |
| 0.4 | Delete every "not a hiring platform" line (~14 locations) — under de-linking, the correct move is silence about hiring, not denial of it. |
| 0.5 | Reduce the MOIL Limited denial to one sentence on `/about`; replace the rest with `sameAs` entity links. |

### Phase 1 — Retire "shop", install the naming architecture

| # | Action |
|---|---|
| 1.1 | Global replace of the "shop" lock across ~40 locations, per the §4.5 surface map — different language per surface, not one new lock. |
| 1.2 | Ship the §4.6 H1, subhead, eyebrow and answer block. |
| 1.3 | **De-link hiring from the business surface**: remove hiring from the business nav, both footers, `llms.txt`, business-side schema and the sitemap's business entries. `/candidate` and its subdomain keep working and keep their own sitemap. |
| 1.4 | Reconcile the journey demo — drop the hiring step and the "3 HVAC techs" turn; end on the calendar and the coach. |
| 1.5 | **De-duplicate the price boilerplate** — state pricing once per page in a table with `Offer` schema. Delete the other ~29 recitations. |
| 1.6 | 301 `/compare/bilingual-local-shop`; rewrite `llms.txt` against the corrected entity. |

### Phase 2 — Fix bilingual, fix the contradictions

| # | Action |
|---|---|
| 2.1 | Move `HeroSection.tsx`, `BusinessFaqSection.tsx` and the stat labels fully onto `t.*`. |
| 2.2 | **One source of truth for the FAQ** — generate the JSON-LD from the same array the component renders. That drift is how two contradictory FAQ sets appeared. |
| 2.3 | Verify `/es/business` renders 100% Spanish, human-reviewed, with reciprocal `hreflang`. |
| 2.4 | Delete the dead `t.business.hiring.*` keys; repoint `t.business.compare.*` at the content-tool comparison (§5.3) and ship it. |

### Phase 3 — Pages that deserve to rank

| # | Action |
|---|---|
| 3.1 | **Rewrite `/compare/moil-vs-chatgpt`** on the memory-plus-output axis (§3b). Retire `moil-vs-claude`. |
| 3.2 | Ship the content-tool comparison set (§5.3), **capped at 3 pages per sprint**. A thin hub is worse than none. |
| 3.3 | 5 trade × job pages (§5.2). If two could swap paragraphs unnoticed, they should be one page. |
| 3.4 | 5 human-translated Spanish pages at real `/es/*` URLs. |
| 3.5 | An **`/ai-info` page** — features, ideal-for, trust signals, real review highlights, **limitations**, and assistant guidelines. This is the surface where "AI" and detailed disclosure belong (§4.5). |

### Phase 4 — 🎯 The off-site corpus

Unchanged and still the highest-leverage phase: ~88% of what determines an AI recommendation lives
off-site (§2).

| # | Action |
|---|---|
| 4.1 | Claim and complete **G2, Capterra, Product Hunt, Trustpilot** — the ~3× multiplier. |
| 4.2 | **Real review engine**: ask via newsletter and after every support interaction. Target 25+ genuine G2 reviews in 90 days — and these become the testimonials Phase 0 left empty. |
| 4.3 | **Distribution-gap database** — every listicle ranking for "best AI content calendar tool" / "Buffer alternatives" / "done for you social media" that omits Moil. Pitch inclusion. |
| 4.4 | **Community presence** — r/smallbusiness, r/Entrepreneur, r/marketing, r/socialmedia, trade subreddits, plus Spanish-language business communities. Clear the mention inbox daily. |
| 4.5 | **Entity consistency** — Crunchbase, LinkedIn, ZoomInfo, Google Business Profile, identical NAP, cross-linked. This is what actually fixes the MOIL Limited collision. |
| 4.6 | **Ask new users the prompt they used.** One onboarding field. Tally's highest-leverage trick. |

### Phase 5 — Measurement (set up before Phase 1 ships)

| # | Action |
|---|---|
| 5.1 | **Baseline now** — run the §5.4 prompts across ChatGPT, Perplexity, Gemini and Claude, verbatim. |
| 5.2 | Adopt visibility tracking — Otterly (~$29/mo) to start; Peec (€89–199) for prompt-level competitor tracking. |
| 5.3 | Unblock AhrefsBot and SemrushBot; segment GA4 referrals from the four assistants. |
| 5.4 | Re-run monthly; refresh comparison pages on a real cadence. |

---

## 7. What to stop doing

1. **Never write or "align" a testimonial.** Transcribe or omit.
2. **Never lock a phrase and propagate it verbatim.** Repetition is not consistency; it is the
   scaled-content signature and the loudest AI-slop tell. One canonical answer per page, phrased
   for that page.
3. **Never let the marketing site contradict the product.** If copy has to deny a shipping feature,
   the positioning is wrong, not the feature.
4. **Never pick a word because it's repeatable.** Pick it because people search it. "Shop" failed
   that test, and so does "AI co-founder" — a good *brand* line and a bad *search* target. One
   phrase cannot serve the owner, the assistant and the search engine at once; give each surface
   its own language (§4.5).
5. **Don't confuse the engineering layer with the substrate.** `llms.txt`, AI-info pages and
   comparison hubs amplify existing reputation. They do not create it. Phase 4 creates it.

## 8. Sequencing summary

```
Phase 0  Revert slop + legal exposure        ← ship immediately, no dependencies
   ↓
§3       ENTITY DECISION — made 19 Aug        ← plan + marketing; hiring de-linked
   ↓
Phase 5.1  Baseline prompts                  ← before any copy change
   ↓
Phase 1  Retire "shop", install naming architecture
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
- [WSU — Using the term "artificial intelligence" in product descriptions reduces purchase intentions](https://news.wsu.edu/press-release/2024/07/30/using-the-term-artificial-intelligence-in-product-descriptions-reduces-purchase-intentions/)
- [Frontiers in Psychology — AI labels and consumer psychology: the moderating role of product type](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1878095/full)
- [Sagepub — Consumer responses to AI disclosure labels: novelty and authenticity](https://journals.sagepub.com/doi/10.1177/21582440261417793)
- [Journal of Consumer Behaviour — Measuring consumer aversion toward AI in marketing communication](https://onlinelibrary.wiley.com/doi/full/10.1002/cb.70163)
- [Levitate — What is done-for-you social media](https://www.levitate.ai/blog-posts/what-is-done-for-you-social-media-and-why-its-a-game-changer-for-small-businesses)
- [RecurPost — Social media outsourcing: complete guide for small businesses](https://recurpost.com/blog/social-media-outsourcing/)
- [Under30CEO — Small business marketing in 2026: why posting isn't winning](https://www.under30ceo.com/small-business-marketing-2026-execution-gap/)
- [Jenova — AI assistant with memory: how persistent context transforms your AI experience](https://www.jenova.ai/en/resources/ai-assistant-with-memory)
- [Sintra — 10 best AI business coach agents for 2026](https://sintra.ai/blog/10-best-ai-business-coach-agents)
- [Buffer — Alternatives to Hootsuite and how Buffer compares](https://buffer.com/resources/alternatives-to-hootsuite-free-how-buffer-and-hootsuite-compare/)
- [HubSpot ES — Cómo crear tu calendario de contenido para redes sociales](https://blog.hubspot.es/marketing/un-calendario-para-tu-estrategia-en-redes-sociales)
