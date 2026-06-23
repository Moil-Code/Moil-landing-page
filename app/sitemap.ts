import { MetadataRoute } from 'next'
import { baseURL1 } from '../src/common/constants/baseUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = baseURL1
  // Stamp the current deploy date so Googlebot knows these pages were updated.
  const today = new Date()

  return [
    {
      // Homepage (/) — broad-SMB landing page; self-canonical now, no longer
      // redirects to /business (see app/page.tsx). Must be in the sitemap so
      // Google indexes it as its own non-brand-intent entry point.
      url: `${baseUrl}/`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      // Primary business landing page — deep "AI business plan" intent
      url: `${baseUrl}/business`,
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
    },
    {
      url: `${baseUrl}/candidate`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/candidate/searchjob`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
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
  ]
}
