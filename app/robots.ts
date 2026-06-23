import { MetadataRoute } from 'next'

/**
 * robots.txt — apex (`www.moilapp.com`).
 *
 * Two changes vs. previous version:
 *   1. `sitemap` is an array of all 4 sitemaps (apex + blog + business +
 *      candidate). Previously listed only the apex sitemap, which left
 *      Google's sitemap report blind to the blog's 47 articles and the two
 *      subdomains. The blog's own GSC submission still happens manually
 *      (Master Plan Task 1.6) — listing it here is the secondary signal.
 *   2. Removed `/*?*lg=` from disallow. The previous middleware stripped
 *      `?lg=` so it was right to disallow indexable variants. The new
 *      middleware preserves `?lg=es` as the indexable Spanish canonical, so
 *      this disallow now actively prevents Spanish indexation. Removed.
 *
 * Other disallows kept:
 *   - `/_next/static/media/` — font/asset paths showing as "Crawled, not
 *     indexed" wasted crawl budget.
 *   - `/api/`, `/legacy`, `/login`, `/register`, `/authenticate/` — non-public
 *     surfaces.
 *   - `?ref=`, `?trk=`, `?fbclid=`, `?gclid=` — tracking-only params, no
 *     content swap, no SEO value.
 *
 * SEO data-harvesting bots (Ahrefs, MJ12, DotBot, Semrush) blocked entirely —
 * they don't drive traffic, only crawl budget consumption and competitive
 * intel that flows the wrong direction.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/static/media/',
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
    // All four sitemaps Google should know about. The blog and subdomain
    // sitemaps still need their own GSC submissions (Master Plan Task 1.6),
    // but referencing them from the apex robots.txt is a secondary signal
    // Google uses for cross-property discovery.
    sitemap: [
      'https://www.moilapp.com/sitemap.xml',
      'https://blog.moilapp.com/sitemap.xml',
      'https://business.moilapp.com/sitemap.xml',
      'https://candidate.moilapp.com/sitemap.xml',
    ],
  }
}
