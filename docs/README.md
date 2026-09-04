# Moil SEO / SEM / AEO Playbooks

Two playbooks, one system. Structural model adapted from
[khasky/marketing-and-seo-playbook](https://github.com/khasky/marketing-and-seo-playbook), rewritten
around Moil's actual product, stack, competitive set, and 2026 search conditions.

| Doc | For | Battlefield | First lever |
|---|---|---|---|
| **[Playbook 1 — Moil's own system](./seo-aeo-playbook-moil.md)** | Moil growth + engineering | National SERPs, AI answers, bilingual | Sitemap + entity graph + comparison pages |
| **[Playbook 2 — Client playbook](./seo-aeo-playbook-clients.md)** | Moil delivery team + SMB clients | Local Pack, Google Business Profile, AI local answers | GBP primary category + reviews |

## Formats

Each playbook exists as Markdown (source of truth, reviewable in PRs) and as a standalone HTML
page for reading and sharing:

| | Markdown | HTML | Hosted |
|---|---|---|---|
| Playbook 1 | [`seo-aeo-playbook-moil.md`](./seo-aeo-playbook-moil.md) | [`html/playbook-moil.html`](./html/playbook-moil.html) | https://claude.ai/code/artifact/e336c00c-186c-4a9b-bc36-0bcaabab20ae |
| Playbook 2 | [`seo-aeo-playbook-clients.md`](./seo-aeo-playbook-clients.md) | [`html/playbook-clients.html`](./html/playbook-clients.html) | https://claude.ai/code/artifact/ec855e17-d388-410a-8bd4-e3111b146bed |

The hosted pages are private until shared from the page's own share menu. The HTML files are
self-contained (no external CSS, JS, fonts or images) and pure ASCII, so they render identically
however they're served — including from `file://`. The client playbook's HTML adds two working
tools the Markdown can't: a live 100-point scorecard and delivery checklists that persist in the
browser.

To preview them locally:

```bash
python3 -m http.server 4310 --directory docs/html
```

Both are also registered as a `playbook-docs` server in `.claude/launch.json`. Edit the HTML and
republish to the same URL to update a hosted page.

Related: [`research/strategy.md`](../research/strategy.md) — the locked `/business` conversion sprint
that Playbook 1 operationalizes.

## The three rules both playbooks share

1. **One fact, one value, everywhere.** Contradiction across surfaces makes AI engines decline to state
   the fact at all.
2. **Extractability beats eloquence.** A 45-word answer under a question-shaped heading gets cited; a
   beautiful build-up does not.
3. **No claim without a source.** Also the biggest E-E-A-T lever either playbook has.

## Why this is not just "SEO"

Organic CTR falls ~61% where an AI Overview appears, 83% of those searches end with no click, and 93%
of AI Mode searches do. But brands *cited inside* an AI Overview earn +35% organic and +91% paid
clicks, and AI-referred traffic converts at roughly 4.4× organic. Ranking without being cited now
loses most of the click — so both playbooks optimize citation share first, rank second, and measure
branded-search lift as the honest proxy for the exposure that can't be tracked.
