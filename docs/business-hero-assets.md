# Business hero shader assets

The centered hero uses two coordinated backgrounds inspired by the user's `Group 1 (1).png` halftone reference. Images were created with the built-in ImageGen tool; video motion was rendered locally from those images with Core Image and AVFoundation.

## Deliverables

- `public/business/shaders/hero-light-v1.jpg` — light theme poster and static fallback.
- `public/business/shaders/hero-dark-v1.jpg` — dark theme poster and static fallback.
- `public/business/shaders/hero-light-loop-v1.mp4` — 1280 × 720, H.264, 30 fps, 8 seconds, silent loop.
- `public/business/shaders/hero-dark-loop-v1.mp4` — matching dark loop.

Motion uses gentle periodic displacement, scale, distortion, and lighting. All parameters return to their starting values over the loop. The hero only loads the active theme's video, pauses offscreen or in a hidden tab, provides a user pause control, and uses the poster when reduced motion is requested or playback is unavailable.

## Section companions

Three transparent WebP variants extend the same embossed microdot material without repeating the full hero behind every section:

- `public/business/shaders/cofounder-corner-v1.webp`: curved lower-right field behind Your AI Co-Founder.
- `public/business/shaders/capabilities-corner-v1.webp`: intersecting lower-left ribbons for Platform Capabilities.
- `public/business/shaders/value-corner-v1.webp`: a low crescent along the bottom of What You Actually Get.

Generated with ImageGen from the light hero reference, using purple `#5843BE`, lavender highlights, and restrained `#FF6633` accents. The compositions reserve 70–80% negative space for content. Transparent assets work on both theme surfaces; CSS reduces opacity and shifts the texture toward the corners on mobile. The three optimized assets total approximately 484 KB.

## Light hero generation prompt

Use case: stylized-concept. Create a premium LIGHT MODE shader background image for Moil's business landing-page hero, wide 16:9 landscape. Image 1 is a pattern/composition reference, not a color reference. Transform its overlapping halftone dot fields into sophisticated finely embossed ceramic microdots arranged in fluid curved sheets with subtle moire interference. Brand palette: clean warm-white #FAF9FD background, exact brand purple #5843BE with pale lavender and tiny restrained #FF6633 peach-orange edge accents. Composition designed for CENTERED single-column website hero: central 65% and upper central 70% must remain quiet almost white negative space for large dark headline and centered input form. Texture hugs far left and right edges and lower corners, denser sculptural wave of microdots in bottom quarter; soft feathered blending toward center, no hard boundaries. Dimensional but restrained, refined editorial technology aesthetic, very fine detail and diffuse studio lighting. No rainbow CMYK, no saturated red, no black dots, no text, logos, UI, watermark or objects. This is the complete background asset only.

## Final dark-image prompt

Use case: lighting-weather. Asset: DARK MODE companion shader for the Moil business website hero. Image 1 is the edit target. Preserve its exact 16:9 composition, every curved sheet of fine embossed microdots, negative space, scale and edges. Change ONLY material and lighting to dark mode: matte near-black violet #0B0814 central background, midnight purple ceramic dots illuminated by exact Moil purple #5843BE, soft lavender highlights and tiny restrained #FF6633 warm orange accents along outer corners. The central 65% and upper central 70% remain calm deep near-black with very low detail for bright centered headline and form. Denser detailed dotted waves remain bottom quarter and far side edges. Premium and sophisticated, quiet, subtle, beautiful dimensional lighting, no neon glow, no blue, no red dominant areas, no text, no UI, no watermark.
