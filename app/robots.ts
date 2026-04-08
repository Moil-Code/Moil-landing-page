import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/static/media/',  // Block font file crawling (wastes crawl budget)
          '/api/',
          '/legacy',
          '/login',
          '/register',
          '/authenticate/',
          '/*?*lg=',               // Block ?lg= param variants (now 301'd by middleware)
          '/*?*ref=',              // Block referral parameter variants
          '/*?*trk=',              // Block tracking parameter variants
          '/*?*fbclid=',           // Block Facebook click ID variants
          '/*?*gclid=',            // Block Google click ID variants
        ],
      },
      // Block SEO data-harvesting bots entirely
      {
        userAgent: ['AhrefsBot', 'MJ12bot', 'DotBot', 'SemrushBot'],
        disallow: '/',
      },
    ],
    // Must match canonical www URL — keeps sitemap signal consistent with canonical tags
    sitemap: 'https://www.moilapp.com/sitemap.xml',
  }
}
