import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/legacy',
        ],
      },
      {
        // Block SEO harvesting bots
        userAgent: ['AhrefsBot', 'MJ12bot', 'DotBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://moilapp.com/sitemap.xml',
  }
}
