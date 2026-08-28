/**
 * SEO audit — crawls a running build and fails on the defect classes that the
 * Aug 2026 Semrush Site Audit found, none of which any existing check could see.
 *
 * Why this exists: every one of those defects was in *generated output* that no
 * test and no page view ever looked at. Two `Offer` objects in the root layout
 * shipped without `url` or `priceValidUntil` on all 65 crawled pages. Eight
 * legal pages rendered their title as a styled `<p>`, so they had no `h1` at
 * all. Three pages declared an hreflang pointing at a URL that canonicalised
 * away. The code compiled, the evals passed, and the pages looked right.
 *
 * It reads rendered HTML with no JavaScript executed, which is how the Semrush
 * crawler and every social/AI crawler sees the site.
 *
 * Usage:
 *   node scripts/seo-audit.mjs                 # against http://127.0.0.1:3000
 *   BASE=http://127.0.0.1:3100 node scripts/seo-audit.mjs
 *
 * Exits non-zero when any HARD class is non-zero. The soft signals (text ratio,
 * word count) are reported but never fail the build: they are largely a
 * property of shipping a React app, and gating on them would be noise.
 */

const BASE = (process.env.BASE || 'http://127.0.0.1:3000').replace(/\/$/, '');
const PROD = 'https://www.moilapp.com';

// ── schema rules ─────────────────────────────────────────────────────────────
// Required properties per type. Anything absent here is a field Google's
// structured-data validation asks for on the types this site actually emits.
const REQUIRED = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  WebPage: ['name'],
  Article: ['headline', 'image', 'datePublished', 'author'],
  Product: ['name'],
  SoftwareApplication: ['name', 'offers', 'applicationCategory'],
  WebApplication: ['name', 'offers', 'applicationCategory'],
  Service: ['name'],
  Offer: ['price', 'priceCurrency', 'url', 'availability', 'priceValidUntil'],
  AggregateRating: ['ratingValue', 'reviewCount'],
  Review: ['author', 'reviewRating'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  HowTo: ['name', 'step'],
  HowToStep: ['name'],
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position'],
  ImageObject: ['url'],
  Person: ['name'],
  ContactPoint: ['contactType'],
  ItemList: ['itemListElement'],
  Quotation: ['text'],
  Brand: ['name'],
  Thing: ['name'],
  UnitPriceSpecification: ['price', 'priceCurrency'],
  // Types with nothing Google requires beyond @type.
  PostalAddress: [],
  SpeakableSpecification: [],
  MonetaryAmount: [],
  SearchAction: [],
  EntryPoint: [],
};

function walkSchema(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((n, i) => walkSchema(n, `${path}[${i}]`, out));
    return;
  }
  if (!node || typeof node !== 'object') return;

  const raw = node['@type'];
  for (const t of Array.isArray(raw) ? raw : raw ? [raw] : []) {
    if (!(t in REQUIRED)) {
      // Not a failure: an unrecognised type is usually a new one we have not
      // written a rule for yet. Surfaced so it gets a rule rather than silence.
      out.push({ hard: false, path, msg: `@type "${t}" has no rule in this audit — add one` });
      continue;
    }
    for (const req of REQUIRED[t]) {
      const v = node[req];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) {
        out.push({ hard: true, path, msg: `${t} missing required "${req}"` });
      }
    }
    if (t === 'ListItem' && node.item === undefined && node.name === undefined) {
      out.push({ hard: true, path, msg: 'ListItem needs "item" or "name"' });
    }
    // Organization takes `makesOffer`; `offers` is a Product/Service property
    // and is silently dropped, which reads as "we published a price" while
    // publishing nothing.
    if (t === 'Organization' && node.offers !== undefined) {
      out.push({ hard: true, path, msg: 'Organization uses "offers" (use makesOffer)' });
    }
  }

  for (const [k, v] of Object.entries(node)) {
    if (!k.startsWith('@')) walkSchema(v, `${path}.${k}`, out);
  }
}

// ── html helpers ─────────────────────────────────────────────────────────────
const textOf = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/** Compare a declared absolute URL against a crawled route, origin-agnostic. */
const relOf = (u) => {
  try {
    return new URL(u, PROD).href.replace(PROD, '').replace(BASE, '').replace(/\/$/, '') || '/';
  } catch {
    return u;
  }
};

async function inspect(route) {
  const res = await fetch(BASE + route, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MoilSeoAudit)' },
  });
  const html = await res.text();
  const page = { route, status: res.status };

  page.htmlLang = (html.match(/<html[^>]*\slang="([^"]*)"/i) || [])[1] || null;
  page.h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1]).slice(0, 60));
  page.canonical = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || [])[1] || null;
  page.hreflang = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi)]
    .map((m) => ({ lang: m[1], href: m[2] }));

  page.schema = [];
  const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  blocks.forEach(([, body], i) => {
    try {
      walkSchema(JSON.parse(body), `ld[${i}]`, page.schema);
    } catch (e) {
      page.schema.push({ hard: true, path: `ld[${i}]`, msg: `invalid JSON: ${e.message}` });
    }
  });

  page.imgNoAlt = [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => !/\salt=/.test(tag))
    .map((tag) => tag.slice(0, 100));

  const text = textOf(html);
  page.words = text ? text.split(/\s+/).length : 0;
  page.ratio = +((Buffer.byteLength(text) / Buffer.byteLength(html)) * 100).toFixed(1);

  return page;
}

// ── routes ───────────────────────────────────────────────────────────────────
// Derived from the app's own sitemap so a new page is audited the day it is
// published, rather than the day someone remembers to add it to a list here.
async function routes() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const fromSitemap = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => relOf(m[1]));
  // Pages that are deliberately not in the sitemap but are still crawlable and
  // still have to be correct.
  const extras = ['/', '/legacy'];
  return [...new Set([...fromSitemap, ...extras])];
}

// ── run ──────────────────────────────────────────────────────────────────────
const pages = [];
for (const route of await routes()) {
  try {
    pages.push(await inspect(route));
  } catch (e) {
    pages.push({ route, fatal: String(e) });
  }
}

const failures = [];
const soft = [];

for (const p of pages) {
  if (p.fatal) {
    failures.push(`${p.route}: could not be fetched — ${p.fatal}`);
    continue;
  }
  if (p.status >= 400) {
    failures.push(`${p.route}: HTTP ${p.status}`);
    continue;
  }

  for (const s of p.schema) {
    (s.hard ? failures : soft).push(`${p.route} ${s.path}: ${s.msg}`);
  }
  if (p.h1s.length === 0) failures.push(`${p.route}: no <h1>`);
  if (p.h1s.length > 1) failures.push(`${p.route}: ${p.h1s.length} <h1> elements — ${p.h1s.join(' | ')}`);
  for (const tag of p.imgNoAlt) failures.push(`${p.route}: <img> without alt — ${tag}`);

  // hreflang has to be reciprocal and has to point at pages that keep their own
  // canonical. A one-way cluster, or one whose target canonicalises elsewhere,
  // is discarded by Google rather than half-honoured.
  const self = relOf(p.canonical || p.route);
  if (p.hreflang.length && !p.hreflang.some((h) => relOf(h.href) === self)) {
    failures.push(`${p.route}: hreflang set with no self-reference (canonical ${self})`);
  }
  for (const h of p.hreflang) {
    if (h.lang === 'x-default') continue;
    const target = relOf(h.href);
    const tp = pages.find((x) => !x.fatal && relOf(x.route) === target);
    if (!tp) {
      failures.push(`${p.route}: hreflang ${h.lang} -> ${h.href} is not a crawled page`);
      continue;
    }
    if (relOf(tp.canonical || target) !== target) {
      failures.push(`${p.route}: hreflang ${h.lang} -> ${h.href} canonicalises to ${relOf(tp.canonical)}`);
    }
    if (!tp.hreflang.some((x) => relOf(x.href) === self)) {
      failures.push(`${p.route}: hreflang ${h.lang} -> ${h.href} has no return link to ${self}`);
    }
    if (tp.htmlLang && !tp.htmlLang.startsWith(h.lang)) {
      failures.push(`${p.route}: hreflang "${h.lang}" -> ${h.href} serves lang="${tp.htmlLang}"`);
    }
  }

  if (p.ratio < 10) soft.push(`${p.route}: text/HTML ratio ${p.ratio}%`);
  if (p.words < 500) soft.push(`${p.route}: ${p.words} words`);
}

console.log(`\n  Moil landing page — SEO audit\n`);
console.log(`  Pages crawled: ${pages.length}\n`);

if (soft.length) {
  console.log(`  ${soft.length} note(s) — not build-failing:`);
  for (const s of soft) console.log(`    · ${s}`);
  console.log('');
}

if (failures.length) {
  console.error(`  ${failures.length} FAILURE(S):`);
  for (const f of failures) console.error(`    ✗ ${f}`);
  console.error('\n  FAILED — these ship as broken markup that no page view will show you.\n');
  process.exit(1);
}

console.log('  PASSED — schema valid, every page has one h1, every image has alt,');
console.log('  every hreflang cluster is reciprocal and canonical-consistent.\n');
