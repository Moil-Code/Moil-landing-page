# Moil /business — Surgical Conversion Sprint
**Locked strategy doc · 2026-06-09**

Single source of truth for the surgical conversion sprint. Every code change
in this branch should be justifiable against a line in this doc.

---

## 1. Positioning (locked)

**Broad promise, specific proof.** Universal SMB framing in the hero so we
don't clip the 75% of SMBs already adopting AI; service businesses (HVAC,
trades, home services) lead as the concrete proof points where Moil has the
real hiring moat.

**Primary ICP:** SMB owners (1–20 employees) who are already using or testing
AI tools and are tired of (a) paying agencies $3K–$8K/mo, (b) wearing every
hat, and (c) waiting 80+ days to make a hire.

**Defensible differentiators:**
1. Full SMB lifecycle in one product (plan + market research + content + smart
   hiring + coach). Every category competitor owns ONE slice; Moil owns the
   chain — and is priced like a single tool, not the stack.
2. Smart Hiring inside the same platform as planning and content. Dedicated
   ATS tools (ZipRecruiter, Workable) start at $299/mo and only do hiring;
   Moil's entire platform starts at $25/mo.
3. Bilingual EN/ES with real `/es/*` URLs. Almost every category competitor
   is English-only US-centric.

**Real competitor set (by category — corrected from earlier draft):**

| What Moil does | Real competitors | Avoid as "competitor" |
|---|---|---|
| Business plan + market research | LivePlan ($20–$40/mo), Bizway ($19+), Upmetrics ($7–$29) | Generic "consultant" (cost anchor, not a SaaS competitor) |
| Content calendar + AI assets | Buffer, Later, Hootsuite (with AI add-ons), Predis.ai | Durable (it's a website builder, different problem) |
| Smart hiring + matching | ZipRecruiter ($299+), Workable ($149+), Indeed Smart Sourcing, Manatal | LinkedIn Recruiter (enterprise, wrong segment) |
| General AI baseline | ChatGPT, Claude, Perplexity Pro | — |
| Economic alternative | Marketing agency ($3K–$8K/mo), business consultant ($5K–$15K/project) | HubSpot (sales CRM — different problem entirely) |

**Why not HubSpot / Durable as competitors:** HubSpot is a sales CRM for
companies that already have a sales motion — Moil doesn't compete in CRM.
Durable is an AI website builder — Moil doesn't build websites. Comparing
to either makes Moil look unfocused and confuses the buyer about what Moil
actually replaces.

---

## 2. Defensible facts we can put on the page

Every number on the homepage must trace back to a citable source or a real
internal metric. No inventing.

| Claim | Source | Notes |
|---|---|---|
| 75% of SMBs are already using or testing AI | Salesforce SMB Trends Report 6th ed. (2025) | Use verb "using or testing", **not** "will adopt in 2026" |
| 83% of growing SMBs use AI vs. 55% of declining ones | Salesforce, same report | Strong growth-correlation framing |
| 91% of AI-adopting SMBs say AI boosts revenue | Salesforce, same report | Headline ROI line |
| SMB average time-to-hire: 83.5 days; cost per hire: $5,475 | SHRM 2025 Recruiting Benchmarking Report | Anchor for Moil's 11-day claim → ~87% faster |
| Marketing agency retainers for SMBs: $3K–$8K/mo | Dollarpocket + HawkSEM 2025 agency pricing surveys | Anchor for Moil's $25/mo (120x–320x cheaper) |
| 43% of SMB owners say "wearing too many hats" is the hardest part | Constant Contact SMB survey | Pain hook |
| 61% admit running a business alone is harder than expected | Adobe Express / Talker Research, May 2026 | Pain hook |
| ~50% of small businesses have no marketing plan | OutboundEngine via SEJ | Marketing pain |
| 5M+ Hispanic-owned businesses, $800B/yr revenue | SBA Office of Advocacy + Stanford SLEI | Bilingual TAM proof |
| Latino-owned employer businesses grew 35% (2019–2024) vs. 6% national | UCLA Latino Policy & Politics Institute | Bilingual growth story |

**Internal proof points confirmed real and citable:**
- 500+ businesses onboarded
- EDC partnerships (link source)
- Chamber of Commerce partnerships (link source)
- 4.8★ rating — Andres confirmed real; keep in schema but **add a visible
  source link** on the page or Google may treat as unverified

---

## 3. Conversion architecture (new /business section order)

Current order has the strongest asset (the $5K-vs-$15 comparison) buried below
an abstract "Identity" section. New order:

1. **Hero** — single H1, single subhead, single primary CTA, single secondary
   CTA (in-page demo, not YouTube). Trust strip below CTAs.
2. **60-word AEO answer block** — "What is Moil?" in plain language. First
   150 words is where 55% of LLM citations come from.
3. **Problem / VS pricing reveal** (move up from current mid-page) — $5K
   consultant vs. $25 Moil, side-by-side cards.
4. **Logo strip** — EDC, Chamber, real customer logos.
5. **AI conversation / journey demo** (already exists, just protect it).
6. **Capability grid** — 6 cards (Plan, Market Research, Content360, Smart
   Hiring, Brand DNA, 24/7 Coach).
7. **Comparison table** — Moil vs. Consultant / Agency / HubSpot / Durable /
   DIY ChatGPT. New section. LLM citation gold.
8. **Outcome examples (labeled hypothetical)** — "Example: a 12-person HVAC
   business…" — three scenarios with numbers.
9. **Stats** — keep current `id="stats"` but server-render final values.
10. **Pricing** — annual/monthly toggle, "most popular" marker on middle tier.
11. **Testimonials** — real 500+ count + EDC/Chamber recognition. Replace
    "500+ Businesses Can't Be Wrong" cliché.
12. **FAQ** — reconciled with FAQPage schema (one source of truth).
13. **Final CTA + last-updated stamp**.

---

## 4. Copy direction (the rewrite brief)

### Hero — H1 candidates (final pick A)

**A. (Recommended)**
> Stop wearing every hat. Plan your business in an hour, hire in 11 days,
> market on autopilot — for the price of lunch.

Why: embeds two proof points (11 days, low price), mirrors the dominant SMB
verbatim ("too many hats"), no jargon.

**B. (paid-ad variant)**
> Run your small business like you hired a team — for $25 a month.

### Subhead
> Your AI co-founder for business planning, market research, content marketing,
> and smart hiring. Trusted by 500+ small businesses. Bilingual EN/ES.

### CTAs (unified, used everywhere)
- Primary: **"Start free — no credit card"** (same-tab to register)
- Secondary: **"Try the AI co-founder"** (in-page anchor to live demo using
  existing `app/api/demo/*` endpoints — no signup)

Kill: every `🚀` emoji in CTAs, every variant label, the YouTube `target="_blank"`.

### Trust strip (under CTAs, single row)
`500+ small businesses · EDC + Chamber partner · 4.8★ · Bilingual EN/ES`

### Problem section H2
> Stop paying $5,000 for advice you can't act on.

(Replaces the broken "Stop Paying Consultant Prices for One-Size Answers.")

### Testimonials H2
> What 500+ owners actually built with Moil.

(Replaces "500+ Businesses Can't Be Wrong.")

### De-Texas the homepage
- Eyebrow: drop "in Texas"
- Testimonial roles: rotate non-Texas locations (or remove location entirely)
- Journey demo: rotate 3 industries OR generic "service business" example

---

## 5. AEO + SEO additions

**Direct-answer block (visible HTML, top of page):**
> Moil is an AI co-founder for small businesses. In one guided session, it
> writes your business plan, runs market research, builds a 30-day content
> marketing calendar, and posts your job to 10+ hiring platforms — fully
> bilingual in English and Spanish. Starts at $25/month. 500+ SMBs onboarded.

**10 conversational queries the page must answer** (each as an H2 + 40–80
word answer):
1. What is an AI co-founder and how does it work?
2. How can a small business use AI to write a business plan?
3. How do I do market research for my small business using AI?
4. Can AI build a 30-day content calendar for my business?
5. What AI tools help me hire employees?
6. How much does an AI business platform cost?
7. What's the best bilingual AI platform for Latino entrepreneurs?
8. Moil vs HubSpot — which is right for a small business?
9. Moil vs Durable / Bizway / LivePlan?
10. Is Moil better than ChatGPT for running a business?

**Schema changes:**
- **Keep**: Organization, WebSite, SoftwareApplication, FAQPage, HowTo
- **Fix**: Reconcile FAQPage entries with the on-page FAQ component (single
  source of truth)
- **Fix**: AggregateRating — keep ratingCount:500 (Andres confirmed real) but
  add a visible review-source link on the page
- **Add**: Article schema with `author` (Person/Organization),
  `datePublished`, `dateModified` — Experience is the top E-E-A-T lever
  post-March-2026 update
- **Add**: Speakable schema on the direct-answer block + key Q&A summaries
- **Add**: BreadcrumbList on /business (currently only on /pricing and /searchjob)
- **Punt**: Product/Review schema (needs real G2/Capterra listings first)
- **Don't ship**: llms.txt (Search Engine Land study shows no measurable lift)

**Other AEO:**
- Server-render stats final values (currently animate from "0" — bots see "0")
- "Last updated: [date]" stamp at top + bottom, refresh monthly
- Use `<h3>` for capability/comparison card titles (currently divs)
- Word count target: ~2,900 (sub-800 pages get 37% fewer citations)

---

## 6. Bilingual /es/* (this cycle)

- Create `/es/business` route (Spanish-first version of /business)
- Add `hreflang` alternate tags on both `/business` and `/es/business`
- Update sitemap to include `/es/business`
- Translation key parity: `src/common/translations/es.ts` already exists —
  port new copy keys in lockstep with `en.ts`
- Middleware: stop forcing cookie-only switching; allow direct `/es/*` URLs
  to render Spanish content without redirect

---

## 7. Performance pass

- Convert testimonial `<img>` Cloudinary fulls to `next/image` with
  width/height (CLS fix + responsive sizes)
- Gate the counter `setInterval` and IntersectionObserver behind
  `prefers-reduced-motion`
- Preload hero image (`hero.png` / `hero-business.jpg`) with `<link rel=preload>`
- Audit fonts — Bebas Neue is loaded for the whole site; verify subset
- Target: Lighthouse mobile ≥90 performance, 100 SEO, ≥95 accessibility

---

## 8. Build order (highest leverage first)

Each step gets its own commit so we can isolate regressions.

| # | Change | Files | Risk |
|---|---|---|---|
| 1 | Strategy doc (this file) | `research/strategy.md` | None |
| 2 | Hero copy rewrite (EN) | `src/common/translations/en.ts` | Low |
| 3 | Unify CTAs + kill YouTube secondary | `app/business/page.tsx`, `en.ts` | Low |
| 4 | Move VS/problem section above the fold | `app/business/page.tsx` | Med |
| 5 | Add 60-word AEO direct-answer block | `app/business/page.tsx`, `en.ts` | Low |
| 6 | De-Texas the eyebrow + journey + testimonials | `en.ts`, `page.tsx` | Low |
| 7 | Add Moil vs alternatives comparison section | new component + `en.ts` | Med |
| 8 | Reconcile FAQ schema with on-page FAQ | `layout.tsx`, `BusinessFaqSection.tsx` | Low |
| 9 | Add Article + Speakable + Breadcrumb schema | `layout.tsx` | Low |
| 10 | Server-render stats final values | `page.tsx`, `useBusinessUi.ts` | Low |
| 11 | Last-updated stamp | `page.tsx` | None |
| 12 | Testimonial perf fix (`next/image`) | `page.tsx` | Low |
| 13 | Mirror copy in ES | `src/common/translations/es.ts` | Low |
| 14 | `/es/business` route + hreflang + sitemap | new route + `layout.tsx` + `sitemap.ts` | Med |
| 15 | Performance pass + Lighthouse verification | various | Low |

---

## 9. Test plan

- After each commit: type-check via `tsc --noEmit` if node_modules available;
  otherwise spot-read the diff
- After Step 15: Lighthouse mobile + desktop on `/business` and `/es/business`
- Schema validator (validator.schema.org) on every JSON-LD block
- LLM smoke test: ask ChatGPT and Perplexity "what is Moil?" and "best AI
  tool for small business 2026" — log whether Moil appears
- Browser walkthrough of full conversion flow: hero → demo → pricing → register

---

## 10. Loop (post-ship)

Recurring via the `/loop` skill:
- **Weekly**: re-run Lighthouse on /business, check competitor homepages for
  hero changes, log GSC impression deltas if accessible
- **Monthly**: refresh the "Last updated" date, audit the 10 AEO Q&A
  responses against current LLM outputs, check whether Moil now appears in
  any of the 9 non-branded queries from the AEO baseline

---

## 11. Out of scope (this cycle)

Things we identified but won't ship now:
- G2 / Capterra third-party listings (off-site, 3x AEO citation multiplier —
  worth doing but a separate workstream)
- Reddit presence in r/smallbusiness, r/Entrepreneur (4x citation multiplier
  — separate workstream)
- Full /candidate and /marketing conversion rewrites (this sprint is /business only)
- Real video testimonials (need to film them)
- llms.txt (no measurable lift per SEL study)
- Industry-specific landing pages (Jobber-style — defer to next sprint if
  /business lifts indicate vertical pages would pay off)
