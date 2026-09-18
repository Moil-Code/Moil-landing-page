#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('pricing sections v2', () => {
  const page = read('app/business/BusinessPageContent.tsx');
  const pricing = read('app/business/components/BusinessPricingSection.tsx');
  const pricingPage = read('app/business/pricing/BusinessPricingPageContent.tsx');
  const css = read('app/business/business.css');
  const v2 = css.slice(css.indexOf('Pricing system v2: editorial index'));

  it('turns the glance section into three intentional modules without a six-column ghost grid', () => {
    assert.match(page, /className="pricing-glance"/);
    assert.match(page, /pricing-glance__metrics/);
    assert.match(v2, /\.pricing-glance \.pricing-glance__metrics\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
    assert.doesNotMatch(v2, /\.pricing-glance \.pricing-glance__metrics\s*\{[^}]*repeat\(6,/s);
  });

  it('shares one comparison workspace while the pricing page declares its detailed context', () => {
    assert.match(pricing, /className="pricing-plan-stage"/);
    assert.match(pricing, /export function BusinessPricingSection\(\{ detailed = false \}/);
    assert.match(pricingPage, /<BusinessPricingSection detailed \/>/);
    assert.doesNotMatch(pricing, /window\.location\.pathname/);
  });

  it('uses accessible billing state and preserves both translated choices', () => {
    assert.match(pricing, /role="group"/);
    assert.equal((pricing.match(/aria-pressed=/g) || []).length, 2);
    assert.equal((pricing.match(/type="button"/g) || []).length, 2);
    assert.match(pricing, /t\.business\.pricing\.monthly/);
    assert.match(pricing, /t\.business\.pricing\.annual/);
  });

  it('locks the application pairing: exact orange with white text and icons', () => {
    assert.match(v2, /--pricing-accent:\s*#FF6633/);
    assert.match(v2, /\.pricing-billing-toggle button\.is-active\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*var\(--pricing-accent\)/s);
    assert.match(v2, /\.pricing-section-v2 \.pbtn-pri\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*var\(--pricing-accent\)/s);
    assert.match(v2, /\.pricing-glance \.pricing-glance__metric\.is-featured\s*\{[^}]*color:\s*#FFFFFF[^}]*background:\s*var\(--pricing-accent\)/s);
  });

  it('keeps signup attribution and language-aware register URLs', () => {
    assert.match(pricing, /appendLangToUrl\(getRegisterUrl\(\), lang\)/);
    assert.match(pricing, /data-signup-cta=/);
    assert.match(pricing, /target="_blank"/);
    assert.match(pricing, /rel="noreferrer"/);
  });
});
