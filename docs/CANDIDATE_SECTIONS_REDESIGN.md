# Candidate landing page redesign

The approved hero, job search, navigation, theme hook, and shared/global styles are unchanged. The new CSS Module wrapper begins immediately after `CandidateHero`. The business page is the design reference; its concurrent edits are not part of this work.

## Design elements and their use

| Element from the business page | Candidate application |
| --- | --- |
| Inter typography and tight headline spacing | One typeface with a clear headline, body, label, and supporting-text hierarchy |
| Numbered section markers | Sections 01–07, with compact outlined number tiles |
| Purple and orange brand accents | Purple for feature emphasis; orange for primary career actions |
| White/lavender surfaces; navy dark mode | Opaque reading surfaces, explicit foreground/background pairs |
| Product demonstrations | Resume document, interview practice illustration, interactive EN/ES preview |
| Thin dividers and restrained corners | Group related content without nested cards, gradients, or decorative motion |
| Shared language and theme preference | All new interface copy works in English and Spanish; customer quotation remains verbatim |

## Section map

| Section | Elements and layout |
| --- | --- |
| 01 · AI resume | Two-column editorial introduction, four concise feature rows, primary CTA, resume paper illustration, voice-input note |
| 02 · Interview coaching | Split heading, dark practice studio illustration with waveform, learning checklist, industry tags, practice CTA |
| 03 · Bilingual | Feature copy and checklist paired with a local EN/ES interactive preview. Switching the preview does not change the page language. |
| 04 · Benefits | Career CTA followed by a divided four-column strip: Free, Voice, EN/ES, Open. Two columns on mobile. |
| 05 · Reviews | Editorial introduction and sourced full customer quotation, with date and source link |
| 06 · FAQ | Introduction and support contact beside eight native, keyboard-accessible disclosure rows; one open at a time |
| 07 · Closing CTA | Dark plum panel, peach headline emphasis, career steps, candidate product CTA and career-resource link |
| Footer | Candidate-specific resource navigation, existing brand logo, social and legal links |

## Copy and behavior decisions

The feature headlines, core descriptions, interview-learning checklist, bilingual benefits, platform benefits, and most FAQ copy are retained. Text is reorganized to reduce repetition.

- Replaced the inconsistent “20+ languages” label with English & Spanish.
- Removed invented-looking preview scores and real-time recording claims; visual examples are labeled as illustrations.
- Replaced unsupported “thousands” and success-statistics framing with existing product benefits.
- Reviews now read the central dated, sourced `REVIEWS` data (the jobs-related review by Horukeye Linda). No ratings or reworded testimonials were added.
- The old newsletter form only logged an email and showed a success message. The closing section now directs visitors to the existing candidate product and career resources. No subscription service has been added.
- Removed the speculative paid candidate features from the FAQ to match the existing free-candidate positioning. Privacy guidance links to the policy without adding unsupported security assurances.
- Candidate app links retain `ref` and `lg` through the existing URL builder. Footer links for candidate features now point to the relevant candidate section.

## Verification

- TypeScript: passes.
- Production build: passes.
- Changed candidate components: 9 files pass the installed Next.js core-web-vitals and TypeScript ESLint rules, without errors or warnings. The repository's normal lint command fails in its existing FlatCompat configuration before reading source files; this configuration was not modified.
- Rendered light-theme text contrast: 181 elements checked, no failures; minimum 5.84:1.
- Rendered dark-theme text contrast: 189 elements checked, no failures; minimum 5.97:1.
- Contrast checks cover text in the redesigned wrapper and resolve opaque ancestor backgrounds. They exclude the unchanged hero/navigation and are not a complete WCAG conformance audit.
- Production bilingual preview switches to Spanish, and FAQ supports Enter and single-open disclosure behavior.
- SEO audit: all 33 routes pass the existing schema, heading, image-alt, and hreflang gates.
- Responsive checks at 320px, 390px, 768px, and 1280px: no horizontal page or redesigned-section overflow. English and Spanish layouts checked; Spanish referral/language parameters preserved.
- Local preview reports existing Google Places/Translate setup warnings from the unchanged hero/language infrastructure; this redesign does not alter those integrations.

## Files

`src/candidate/components/landing/` owns shared elements, scoped CSS, and the candidate footer. The existing seven candidate section files own their respective content and layouts. `app/candidate/page.tsx` adds the wrapper and passes existing referral/language props. Build-generated candidate page modification date is updated.
