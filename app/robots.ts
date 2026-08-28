import { MetadataRoute } from 'next'

/**
 * robots.txt — apex (`www.moilapp.com`).
 *
 * Disallowed:
 *   - `/api/`, `/legacy`, `/login`, `/register`, `/authenticate/` — non-public
 *     surfaces.
 *   - `?ref=`, `?trk=`, `?fbclid=`, `?gclid=` — tracking-only params, no
 *     content swap, no SEO value.
 *
 * Not disallowed, deliberately:
 *   - `/*?*lg=` — the middleware no longer strips `?lg=`, and every `?lg=`
 *     variant self-canonicalises to its clean URL, so they cost nothing to
 *     leave crawlable. The Spanish documents live at `/es/*`.
 *   - `/_next/static/media/` — see the note on the rule below.
 *
 * SEO data-harvesting bots (Ahrefs, MJ12, DotBot, Semrush) blocked entirely —
 * they don't drive traffic, only crawl budget consumption and competitive
 * intel that flows the wrong direction. Note this does not stop a Semrush Site
 * Audit the account owner runs against their own property.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // `/_next/static/media/` was disallowed here to stop font and asset
          // paths appearing as "Crawled, not indexed". That traded a cosmetic
          // GSC line for a real cost: it is where next/font writes the
          // self-hosted woff2 files, so blocking it stops Googlebot fetching
          // the fonts the page needs to render, and a renderer that cannot
          // fetch a render-blocking asset judges the page on what it could
          // load. Unblocked.
          '/api/',
          '/legacy',
          '/login',
          '/register',
          '/authenticate/',
          '/*?*ref=',
          '/*?*trk=',
          '/*?*fbclid=',
          '/*?*gclid=',
        ],
      },
      // AI answer engines — explicit welcome (AEO).
      // Being crawled and cited by ChatGPT, Perplexity, Google AI Overviews,
      // Gemini and Claude IS the strategy, so we enumerate the major answer/
      // citation agents with their own allow rule. The `*` group above already
      // permits them by default; stating it here makes the intent durable — a
      // future blanket "block AI" change has to consciously delete this — and
      // scopes each agent to public content only (no auth/api/tracking).
      // Add new engines here as they emerge.
      {
        userAgent: [
          'GPTBot',             // OpenAI — training corpus
          'OAI-SearchBot',      // OpenAI — ChatGPT Search index
          'ChatGPT-User',       // OpenAI — ChatGPT user-triggered browsing
          'Google-Extended',    // Google — Gemini / AI Overviews grounding (does NOT affect Google Search ranking)
          'PerplexityBot',      // Perplexity — search index
          'Perplexity-User',    // Perplexity — user-triggered fetch
          'ClaudeBot',          // Anthropic — crawler
          'Claude-SearchBot',   // Anthropic — search retrieval
          'Claude-User',        // Anthropic — user-triggered fetch
          'anthropic-ai',       // Anthropic — legacy UA
          'CCBot',              // Common Crawl — feeds many open LLMs
          'Applebot-Extended',  // Apple Intelligence
          'Meta-ExternalAgent', // Meta AI
          'Amazonbot',          // Amazon / Alexa+
          'DuckAssistBot',      // DuckDuckGo AI
          'cohere-ai',          // Cohere
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/legacy',
          '/login',
          '/register',
          '/authenticate/',
          '/*?*ref=',
          '/*?*trk=',
          '/*?*fbclid=',
          '/*?*gclid=',
        ],
      },
      {
        userAgent: ['AhrefsBot', 'MJ12bot', 'DotBot', 'SemrushBot'],
        disallow: '/',
      },
    ],
    // Only this host's sitemap. The blog, business and candidate sitemaps used
    // to be listed here as a "cross-property discovery" signal. What it
    // actually did was tell every crawler that ~94 URLs on other hostnames
    // belong to this property: the Aug 2026 Site Audit pulled all four
    // sitemaps, found none of those URLs reachable by an internal link from
    // www.moilapp.com — because they are on different hosts — and reported
    // "79 orphaned pages in sitemaps".
    //
    // Each host serves its own robots.txt and its own sitemap, and each is
    // submitted to Search Console under its own property. That is the
    // supported way to get a subdomain crawled; a foreign sitemap reference
    // is not.
    sitemap: 'https://www.moilapp.com/sitemap.xml',
  }
}
