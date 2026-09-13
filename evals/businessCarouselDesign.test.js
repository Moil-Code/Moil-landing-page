const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

describe('reference testimonial carousel and finished work', () => {
  const page = read('app/business/BusinessPageContent.tsx');
  const carousel = read('app/business/components/TestimonialCarousel.tsx');
  const css = read('app/business/business.css');

  it('uses the original sourced quotes, dated provenance, and no invented ratings', () => {
    assert.match(page, /businessReviews\(\)\.map/);
    assert.match(page, /testimonial: review\.text/);
    assert.match(page, /review\.displayDate\[currentLang\]/);
    assert.match(page, /writtenInEnglishLabel/);
    assert.doesNotMatch(page, /★★★★★/);
    assert.doesNotMatch(page, /testimonialImages\[i %/);
  });
  it('keeps duplicate loop content out of the accessibility tree', () => {
    assert.match(carousel, /review-carousel__clone" aria-hidden="true" inert/);
    assert.match(carousel, /role="region" aria-roledescription/);
    assert.match(carousel, /tabIndex=\{0\}/);
  });
  it('can pause motion and stops it offscreen or in a hidden tab', () => {
    assert.match(carousel, /aria-pressed=\{paused\}/);
    assert.match(carousel, /IntersectionObserver/);
    assert.match(carousel, /document\.hidden/);
    assert.match(carousel, /removeEventListener\('visibilitychange', sync\)/);
    assert.match(css, /\.review-carousel__viewport:focus-within[^{]*\{ animation-play-state: paused;/);
  });
  it('uses a seamless rightward loop with swipe and reduced-motion alternatives', () => {
    assert.match(css, /@keyframes reviews-drift \{ from \{ transform: translateX\(-50%\); \} to \{ transform: translateX\(0\);/);
    const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
    assert.match(reduced, /\.review-carousel__track \{ animation: none;/);
    assert.match(reduced, /overflow-x: auto/);
    assert.match(reduced, /\.review-carousel__clone, \.review-carousel__pause \{ display: none;/);
  });
  it('keeps all finished-work translations and adds a language-aware CTA', () => {
    assert.match(page, /t\.business\.made\.items\.map/);
    assert.match(page, /t\.business\.made\.footnote/);
    assert.match(page, /className="made__cta" data-signup-cta="finished-work"/);
    assert.match(css, /\.made-v3 \.made__list, \.made-v3 \.made__list--jobs \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  });
});
