# Design rules

The rules every page on the marketing site follows. The system itself lives in
`app/business/business.css` and the `/business` components; new pages reuse those
classes rather than building their own palette (see `app/free-trial/` for a page built
that way). Background and reasoning for the mid-page sections:
[`docs/BUSINESS_STORY_SECTIONS_REDESIGN.md`](docs/BUSINESS_STORY_SECTIONS_REDESIGN.md).

## Color

### White text on orange

**Anything filled with orange carries white text and white icons.** Buttons, numbered
nodes, icon tiles, badges, chat bubbles: if the fill is orange, the content on it is
`#FFFFFF`. Never dark text on orange, including when a brief or an outside design asks
for it.

- The action orange is `#FF6633` (`--business-accent`, and `--orange` inside
  `.business-system-section`). Hover is `#FF7A40`.
- Orange is the only primary action color on a page. One label, one color for the
  main action.
- Contrast: white on `#FF6633` is about 2.9:1, below WCAG AA (4.5:1) for normal text.
  That is a known, accepted trade-off of the brand pairing. Keep text on orange
  **bold (700+) and at least 15px**, keep buttons at least 49px tall (56px on ad
  landing pages), and never put body copy or fine print on an orange fill.

### Other tokens

| Token | Value | Use |
|---|---|---|
| Action orange | `#FF6633` | Primary buttons, icon tiles, numbered nodes, accent words in headlines (`.business-accent-text`) |
| Purple | `#5843BE` | Hero accent word (`.business-hero h1 strong`), eyebrows, focus outlines |
| Light purple | `#B2A0FF` / `--purple-light` | Purple accents in dark mode, `#final .fl-p` |
| Surfaces, text, rules | `--bg`, `--surface`, `--surface2`, `--text`, `--text2`, `--text3`, `--border`, `--business-rule` | Always the theme variables, so light and dark mode both work |

## Type

- One typeface: Inter, self-hosted in `app/layout.tsx` (`--display`, `--body`, `--mono` all map to it).
- Section headlines: `.section-headline` inside `.business-section-header`, with one
  accent span (`.business-accent-text`).
- Section labels: `.section-tag` (orange, uppercase, with the short rule before it).

## Section grammar

- Numbered rail beside each section header (`.business-section-header__rail`, "01 / 04").
- Cards: `.capability-registry__row` (number, orange icon tile, title, copy).
- Steps: `.journey-steps` / `.jstep`.
- Closing action: the dark panel (`.capabilities-v2__cta`) or the `#final` block.
- Scroll reveal: `.rv` (with `.d1`, `.d2` delays), and always shown when the visitor
  prefers reduced motion.
