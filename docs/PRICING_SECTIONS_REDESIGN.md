# Pricing sections redesign

Status: implemented on /business and /business/pricing.

## Design question

How can the pricing summary and detailed plan selector feel like one coherent,
high-trust decision flow instead of two unrelated grids?

## Directions evaluated

1. **Editorial index + comparison workspace — selected.** A compact pricing
   index introduces the three facts, then a contained workspace lets the buyer
   switch billing and compare both plans without losing context.
2. **Feature ledger.** A dense matrix makes every difference explicit, but it
   duplicates the tier comparison already present on the landing page and asks
   too much reading effort from a first-time visitor.
3. **Guided plan chooser.** A short question flow could recommend a tier, but it
   hides the full prices and creates interaction cost before the buyer can
   compare.

The first direction was selected because it gives pricing immediate hierarchy,
keeps both plans visible, and preserves a direct path to registration.

## Design system

- #FF6633 is the only high-emphasis pricing color.
- Every #FF6633 action surface uses white text and white icons.
- Neutral surfaces, thin rules, restrained shadows, and numbered modules create
  hierarchy without ornamental gradients competing with the offer.
- Market Pro is recommended through four redundant signals: position, orange
  rule, badge, and primary CTA. Color is not the only signal.
- Monthly and annual controls expose aria-pressed; every touch target is at
  least 44 CSS pixels on mobile.
- The three summary metrics always occupy three intentional modules. There is
  no empty fourth column.
- Desktop comparison is side by side. Tablet and mobile use one reading column
  with prices and actions before the feature lists.

## Evaluation

| Metric | Weight | Previous | Implemented |
|---|---:|---:|---:|
| Information hierarchy | 15 | 7 | 14 |
| Price and CTA clarity | 15 | 9 | 14 |
| Visual coherence across both sections | 14 | 6 | 13 |
| Comparison efficiency | 12 | 7 | 11 |
| Density and scanability | 10 | 5 | 9 |
| Responsive behavior | 10 | 5 | 9 |
| Interaction and focus states | 8 | 5 | 8 |
| Brand consistency | 8 | 5 | 8 |
| Accessibility structure | 8 | 5 | 7 |
| **Total** | **100** | **54** | **93** |

This is a design heuristic rather than user-research data. The release measure
should be pricing-section engagement, billing-toggle use, plan CTA conversion,
and the split between Market Pro and Professional registrations.
