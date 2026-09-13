#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('business story sections editorial system', () => {
  const page = read('app/business/BusinessPageContent.tsx');
  const css = read('app/business/business.css');
  const v2 = css.slice(css.indexOf('BUSINESS STORY SYSTEM'));

  it('connects all four requested sections to one shared design system', () => {
    assert.match(page, /id="identity" className="business-system-section identity-v2"/);
    assert.match(page, /id="capabilities" className="business-system-section capabilities-v2/);
    assert.match(page, /id="journey" className="business-system-section journey-v2/);
    assert.match(page, /id="bilingual" className="section-wrap business-system-section bilingual-v2"/);
    assert.equal((page.match(/business-section-header__rail/g) || []).length, 4);
  });

  it('uses section-specific structures instead of repeating a generic card grid', () => {
    assert.match(page, /identity-v2__workbench/);
    assert.match(page, /capability-registry__index/);
    assert.match(page, /<ol className="journey-steps">/);
    assert.match(page, /bilingual-v2__lab/);
  });

  it('locks exact brand orange to white text and icons on filled controls', () => {
    assert.match(v2, /--business-accent:\s*#FF6633/);
    assert.match(v2, /\.capability-registry__icon,[\s\S]*?color:\s*#FFFFFF;[\s\S]*?background:\s*var\(--business-accent\)/);
    assert.match(v2, /\.capability-registry__cta,[\s\S]*?color:\s*#FFFFFF;[\s\S]*?background:\s*var\(--business-accent\)/);
    // .jnum rests as an outline chip and FILLS on hover, so the filled control
    // to lock is the hover rule — the base rule is accent-on-tint, not white.
    assert.match(v2, /\.journey-v2 \.jstep:hover \.jnum\s*\{[^}]*color:\s*#FFFFFF;[^}]*background:\s*var\(--business-accent\)/s);
    assert.match(v2, /\.bilingual-v2 \.bislider__handle\s*\{[^}]*color:\s*#FFFFFF;[^}]*background:\s*var\(--business-accent\)/s);
  });

  it('keeps semantic regions, ordered process steps, and accessible decorative icons', () => {
    assert.match(page, /<header className="business-section-header/);
    assert.match(page, /<article[^>]*className="capability-registry__feature/);
    assert.match(page, /<aside className="journey-v2__visual/);
    assert.match(page, /<ol className="journey-steps">/);
    assert.match(page, /aria-hidden="true">\{IconMap\.arrowRight\}/);
  });

  it('preserves translated content and language-aware signup destinations', () => {
    assert.match(page, /t\.business\.identity\.tag/);
    assert.match(page, /t\.business\.capabilities\.tag/);
    assert.match(page, /t\.business\.journey\.tag/);
    assert.match(page, /t\.business\.bilingualSection\.tag/);
    assert.match(page, /appendLangToUrl\(getRegisterUrl\(\), currentLang\)/);
    assert.match(page, /data-signup-cta="content360"/);
    assert.match(page, /data-signup-cta="journey"/);
  });

  it('provides tablet and small-screen compositions without horizontal ghost columns', () => {
    assert.match(v2, /@media \(max-width:\s*960px\)/);
    assert.match(v2, /@media \(max-width:\s*680px\)/);
    assert.match(v2, /\.capability-registry\s*\{\s*grid-template-columns:\s*1fr;/s);
    assert.match(v2, /\.bilingual-v2 \.bilingual-highlights\s*\{\s*grid-template-columns:\s*1fr;/s);
  });
});
