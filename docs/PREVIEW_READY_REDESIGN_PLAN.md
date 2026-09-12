# Preview ready-state redesign proposal

Status: Focus canvas selected and implemented in the production ready state.

## Design thesis

The preview should feel like a compact AI workbench: calm enough to read,
structured enough to trust, and direct enough to convert. Sophistication comes
from hierarchy, restraint, and behavior—not from adding more gradients, glows,
or cards.

Selected direction: **Focus canvas**. The development-only comparison route was
removed after selection so the losing variants and switcher cannot drift into
production code.

## What is weakening the current design

1. Almost every region has a border, tint, radius, or gradient, so none of the
   regions owns the hierarchy.
2. The floating URL pill, unnamed green status dot, and bright scrollbar look
   like separate interface fragments rather than one coherent system.
3. The two-column card grid makes extracted prose look like settings. It also
   creates unstable density when some fields are absent.
4. Permanent pencil bubbles make every section look unfinished and compete
   with the conversion action.
5. The platform picker compresses enabled, disabled, and explanatory states
   into one crowded line.
6. The sticky CTA is visually louder than the work it is selling, while the
   secondary reset action occupies too much footer height.
7. Orange, purple, blue, and green all communicate emphasis at once. The page
   has color variety but no semantic color discipline.

## Recommended information architecture

### Desktop and tablet

Use a single workspace frame with two zones:

- **Reading canvas (about 68%)**: source, identity, overview, audience,
  problem, differentiator, and voice. Use section dividers and definition rows,
  not a grid of tinted cards.
- **Action rail (about 32%)**: publishing destination, cadence, first-draft
  expectation, primary CTA, and reset. This separates “what Moil learned” from
  “what the visitor should do next.”

The title becomes outcome-oriented (`Your strategy, distilled`) and the status
becomes explicit (`Ready to review`). The website is source metadata, not a
chat bubble.

### Mobile

Preserve the same content model, but reveal it as four short review steps:

1. Your business
2. Your audience
3. Your edge
4. Publishing plan

Keep the production CTA in the existing sticky action region. Do not move the
conversion action behind the reveal animation or behind a completed final
step. The step structure reduces reading load; it must not create a funnel
gate.

## Visual system

- Neutral paper and warm gray canvas; Moil orange `#FF6633` is the action color
  with the application-standard white text and icon pairing.
- Moil orange is a sparse brand signal for provenance, not a fill for every
  action.
- Green is reserved for a truthful success/status state.
- One-pixel neutral dividers replace most card borders.
- 8 px spacing foundation; primary rhythm uses 16/24/32 px.
- 20 px outer radius, 9–11 px controls, pills only for tags and statuses.
- Inter remains the UI face. Use a restrained editorial serif only in the
  dossier variant, not the recommended production direction.
- Body copy: 13–17 px depending on importance; 1.5–1.65 line height; prose
  measure capped near 68 characters.
- Shadows appear only on the workspace and primary action. Nested content does
  not float.

## Interaction model

- Show `Edit` as a quiet text control. On pointer devices it can strengthen on
  section hover; on touch it remains visible.
- Editing happens in place and keeps the current local-only behavior. No new
  persistence promise is introduced.
- Instagram, Facebook, and Decide for me are three equal rows or compact
  controls. The current empty-selection-means-decide contract remains intact.
- LinkedIn, TikTok, and YouTube move into one noninteractive availability note,
  not three pseudo-controls. Their honest “not yet” message remains present.
- The primary action uses outcome copy (`Continue with this profile`) while
  preserving “No card required” as nearby reassurance.
- `Try another business` remains available in ready and wait states and must
  continue to clear the cookie and retire in-flight work.
- Reveal motion stays under 260 ms with small distance and no action delay.

## Sophistication scorecard

This is an expert heuristic, not user-research data. Each row awards points up
to its weight. A production-ready direction should score at least 85/100, have
no category below 70% of its available points, and pass all accessibility gates.

| Metric | Weight | Current | A: Focus canvas | B: Dossier | C: Guided review |
|---|---:|---:|---:|---:|---:|
| Information hierarchy | 15 | 8 | 14 | 13 | 14 |
| Task and CTA clarity | 15 | 7 | 14 | 12 | 13 |
| Visual coherence | 12 | 6 | 11 | 11 | 10 |
| Content legibility | 12 | 7 | 11 | 11 | 10 |
| Interaction affordance | 10 | 6 | 9 | 8 | 9 |
| Density and scanability | 10 | 4 | 9 | 10 | 8 |
| Trust and status clarity | 8 | 4 | 7 | 8 | 7 |
| Responsive fitness | 8 | 4 | 7 | 6 | 8 |
| Accessibility readiness | 6 | 4 | 6 | 5 | 6 |
| Brand distinctiveness | 4 | 2 | 4 | 4 | 3 |
| **Total** | **100** | **52** | **92** | **88** | **88** |

Why A wins: it has the strongest balance of product credibility and conversion
clarity. B is excellent for a downloadable report but feels too dense for an
acquisition surface. C is excellent on a phone but creates unnecessary review
steps on desktop.

## Non-negotiable acceptance criteria

- WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large text and
  meaningful UI boundaries, except the established white-on-`#FF6633` primary
  action treatment, which follows the application-wide brand convention.
- Every interactive target is at least 44 by 44 CSS px on touch layouts.
- Keyboard focus is visible and never clipped by the scroll container.
- Every status has a text label; color is never the only signal.
- No horizontal overflow at 320, 390, 768, 1024, or 1440 px.
- The primary CTA is always available and is not delayed by animation.
- Reduced-motion users receive immediate content with no type-out dependency.
- Missing payload sections collapse without leaving blank grid cells.
- Maximum of one high-emphasis action per viewport region.
- Maximum of one brand accent plus one semantic status color in the ready card.
- Long English and Spanish labels wrap without overlapping the control icon.
- Disabled platforms do not receive button semantics or appear selectable.
- Existing event names and payload privacy rules remain unchanged.

## Production implementation sequence

1. **Structure:** split `GettingToKnowYou.tsx` into the reading canvas, action
   rail, reusable insight row, and availability note.
   Keep data shaping and the existing ready/wait state machine unchanged.
2. **Copy:** add the new outcome title, explicit status, source label, action
   copy, and availability summary in both English and Spanish.
3. **Visual tokens:** replace preview-specific rainbow treatments in
   `business.css` with the neutral system and semantic accent rules. Do not
   modify global landing-page tokens.
4. **Responsive behavior:** preserve the desktop split through tablet, then
   stack the same review canvas into one scrollable mobile column below 640 px.
   Keep the compact conversion action outside the scroll region so it remains
   continuously available without adding an artificial step gate.
5. **Interaction states:** implement hover, focus, edit, selected, unavailable,
   saving-local, and reduced-motion states. Preserve empty selection as Decide
   for me.
6. **Verification:** run the preview eval suite, type-check, render EN/ES at the
   five target widths, test keyboard-only operation, and compare the ready,
   sparse-data, editing, wait, failure, and reset states.
7. **Measure after release:** compare ready-to-signup conversion, edit rate by
   section, platform-choice rate, reset rate, and time from ready seen to CTA.
   Treat the visual score as a launch gate and behavior as the final judge.

## Scope locks preserved from the product

- No AI endpoint or credentials are added to this marketing repository.
- The free card continues to omit generated posts.
- Local edits do not persist before onboarding.
- Instagram and Facebook remain the only selectable networks.
- The wait-to-ready continuity, bounded polling, resume cookie, reset behavior,
  event names, and privacy-safe analytics stay intact.
