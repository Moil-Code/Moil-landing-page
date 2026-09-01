import { MetadataRoute } from 'next'
import { baseURL1 } from '../src/common/constants/baseUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = baseURL1
  // Stamp the current deploy date so Googlebot knows these pages were updated.
  const today = new Date()

  return [
    {
      // Primary business landing page — moilapp.com (/) redirects here
      url: `${baseUrl}/business`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/business`,
          es: `${baseUrl}/es/business`,
        },
      },
    },
    {
      // Spanish counterpart of /business — bilingual SEO entry point
      url: `${baseUrl}/es/business`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/business`,
          es: `${baseUrl}/es/business`,
        },
      },
    },
    {
      url: `${baseUrl}/business/pricing`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/business/pricing`,
          es: `${baseUrl}/es/business/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/es/business/pricing`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/business/pricing`,
          es: `${baseUrl}/es/business/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-info`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-buffer`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-later`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-hootsuite`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-chatgpt`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-claude`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/best-ai-content-calendar-tools`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/done-for-you-social-media-alternatives`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-agency`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/alternative-to-consultant`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      // Demoted: hiring is not the lead product
      url: `${baseUrl}/candidate`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/candidate/searchjob`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // The remaining compliance pages. All six are indexable, all six are linked
    // from the global footer, and all six were missing from this file — which
    // is how a page ends up crawled but never declared. `/legacy` stays out on
    // purpose: robots.txt disallows it.
    {
      url: `${baseUrl}/cookies`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dpa`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/subprocessors`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-choices`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
