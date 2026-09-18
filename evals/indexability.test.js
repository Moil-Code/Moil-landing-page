#!/usr/bin/env node
'use strict';

/**
 * Indexability contracts that are easy to break while every page still looks
 * correct in a browser. The rendered audit checks the complete output; these
 * fast source checks name the routing decisions directly when they regress.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('canonical URLs stay consolidated and indexable', () => {
  it('permanently redirects the apex host to www', () => {
    const config = read('next.config.js');
    assert.match(config, /has:\s*\[\{ type: 'host', value: 'moilapp\.com' \}\]/);
    assert.match(config, /destination:\s*'https:\/\/www\.moilapp\.com\/:path\*'/);
  });

  it('uses a permanent root redirect to the canonical business page', () => {
    const page = read('app/page.tsx');
    assert.match(page, /import \{ permanentRedirect \} from 'next\/navigation'/);
    assert.match(page, /permanentRedirect\('\/business'\)/);
  });

  it('preserves the known malformed marketing URL as a permanent redirect', () => {
    const config = read('next.config.js');
    assert.match(config, /source:\s*'\/marketing!!'[\s\S]{0,160}destination:\s*'\/business'[\s\S]{0,80}permanent:\s*true/);
  });

  it('keeps the reviewed Spanish comparison twins in the generated sitemap', () => {
    const pages = read('src/common/es/esPages.ts');
    for (const route of ['/es/compare/moil-vs-buffer', '/es/compare/moil-vs-chatgpt']) {
      const escaped = route.replaceAll('/', '\\/');
      assert.match(pages, new RegExp(`path: '${escaped}'[^\\n]+reviewed: true`));
    }
  });

  it('gives the job directory a crawlable link and server-rendered guidance', () => {
    const footer = read('src/candidate/components/landing/footer.tsx');
    const page = read('app/candidate/searchjob/page.tsx');
    assert.match(footer, /"\/candidate\/searchjob"/);
    assert.doesNotMatch(page, /^['"]use client['"]/);
    assert.match(page, /id="job-search-guide"/);
  });
});
