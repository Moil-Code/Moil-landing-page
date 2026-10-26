# /partners audit and plan, IEDC Annual Conference (2026-10-26)

## Who is arriving

IEDC (International Economic Development Council) holds its Annual Conference in New Orleans, Oct 25-28, 2026, at the Hyatt Regency. Coverage expects close to 2,000 economic development professionals and industry partners, about 35-40 breakout sessions and three town halls. Reported themes: resilience, AI in economic development organizations, entrepreneurship, rural development, housing, child care. A separate entrepreneurship-led event (Elevate) follows the conference. This is IEDC's centennial year.
Sources: neworleans.iedconline.org; Biz New Orleans "Nearly 2,000 expected at IEDC conference"; Hoodline IEDC 2026. No published session list was found, so nothing here claims a session or a booth.

The visitor is an EDO director, small-business or BRE manager, or a board-facing deputy. They arrive from a QR code or a business card with one question: "what is this, does it fit my programs, what do I do next?" They are not buyers of "AI". They buy outputs for owners, staff time, and board answers.

## What the page did well

- Honest by construction: one copy file, FAQ and schema from one array, claims guarded by `evals/partnersPage.test.js`.
- A clear answer sentence, honest limits, real partners, prices read from one source.

## Findings

| # | Finding | Impact |
|---|---|---|
| 1 | Nothing shows how Moil works. The page lists outputs as a bullet list, but a first-time reader never sees the path from one owner conversation to finished work. | High: "understand what we do and how we do it" |
| 2 | The page speaks in generic "programs". It never names the jobs an EDO already runs (small-business support, grants and loans, retention and expansion, Spanish-speaking owners) or what Moil changes in each. | High: the reader cannot place themselves |
| 3 | Proof sits low. The only proof is a one-line link in the hero and two cards halfway down. | Medium |
| 4 | The hero has no scannable facts. Spanish, owner approval and per-program terms appear only deep in the page. | Medium |
| 5 | The inquiry form opens empty. It needs a title and 20+ characters of message, a lot to type on a phone in a hallway. | High: conversion |
| 6 | No conference entry. A QR code would land on the evergreen page with no signal that this is the 2-minute version, and the lead arrives unlabelled. | High |
| 7 | The cost block compares one agency client with 100 Moil businesses. It never states the per-business figure an EDO would divide by. | Medium |
| 8 | Section order buries "how it works" and the partners under the cost case. | Medium |
| 9 | Spanish twin must carry every change (type-enforced). It is still a noindex draft awaiting native review. | Process |

## What we cannot fix with copy (needs facts from Andres)

Booth or session details, a booking link, any partner outcome (numbers, quotes), a founding-partner offer, a board report sample, data ownership and privacy terms. The page eval bans these until they exist. Each is a high-value addition once real.

## Execution

1. Hero: add three scannable facts under the lede.
2. New "One owner, start to finish" flow section (conversation, research, plan, documents, content).
3. New "The jobs your team already does" section: four EDO functions, each with the bottleneck, what Moil does, what staff still do.
4. Reorder: hero, flow, why, jobs, fit, partners, steps, gets, cost, limits, FAQ, final.
5. Cost: add the per-business monthly list price.
6. Conference landing at `/partners/iedc` (noindex, canonical `/partners`, not in the sitemap): banner, three proof points, form prefilled so a visitor only types an email. Lead subject reads "IEDC 2026 conversation".
7. Inquiry form accepts a prefilled message.
8. Spanish twin updated in lockstep.
9. Evals extended: new headings, conference route, form prefill, claim guard still green.

## Measure

Inquiries with subject "IEDC 2026 conversation" (the lead email subject carries `[Partner inquiry]`). Compare against the evergreen subject.
