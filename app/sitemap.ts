import { MetadataRoute } from 'next'
import { baseURL1 } from '../src/common/constants/baseUrl'
import { LOCALE_TWINS } from '../src/common/i18n/localeRoutes'
import pageDates from '../src/common/seo/pageDates.json'
import { ES_PAGES } from '../src/common/es/esPages'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = baseURL1
  // lastModified is the route's last REAL change, derived from git by
  // scripts/page-dates.mjs (prebuild) into pageDates.json. It used to be
  // `new Date()` on every URL at every build, which Google documents it
  // ignores — and which the blog's own audit fails the build for.
  const dateFor = (route: string) => {
    const d = (pageDates as Record<string, string>)[route]
    if (!d) throw new Error(`sitemap: ${route} has no entry in pageDates.json — run scripts/page-dates.mjs`)
    return new Date(d)
  }
  // hreflang alternates come from the ONE twin list (src/common/i18n/localeRoutes.ts),
  // the same list the language toggle navigates by — so the toggle and the
  // sitemap cannot disagree about which URL is the Spanish document.
  const alternatesFor = (p: string) => {
    const pair = LOCALE_TWINS.find((tw) => tw.en === p || tw.es === p)
    if (!pair) throw new Error(`sitemap: ${p} has no locale twin`)
    return { languages: { en: `${baseUrl}${pair.en}`, es: `${baseUrl}${pair.es}` } }
  }

  // The Spanish pages built for the Spanish query (plan 3.4/3.5) enter the
  // sitemap ONLY once a human has reviewed the copy — the same `reviewed`
  // flag that turns off their noindex and turns on hreflang, so the three
  // cannot disagree (evals/spanishPages.test.js).
  const twinLanguages = (enPath: string, esPath: string) => ({
    languages: { en: `${baseUrl}${enPath}`, es: `${baseUrl}${esPath}`, 'x-default': `${baseUrl}${enPath}` },
  })
  const reviewedEs = ES_PAGES.filter((p) => p.reviewed)
  const esEntries: MetadataRoute.Sitemap = reviewedEs.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: dateFor(p.path),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    ...(p.en ? { alternates: twinLanguages(p.en, p.path) } : {}),
  }))
  const esAlternatesFor = (enPath: string) => {
    const es = reviewedEs.find((p) => p.en === enPath)
    return es ? { alternates: twinLanguages(enPath, es.path) } : {}
  }

  return [
    ...esEntries,
    {
      // Primary business landing page — moilapp.com (/) redirects here
      url: `${baseUrl}/business`,
      lastModified: dateFor('/business'),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: alternatesFor('/business'),
    },
    {
      // Spanish counterpart of /business — bilingual SEO entry point
      url: `${baseUrl}/es/business`,
      lastModified: dateFor('/es/business'),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: alternatesFor('/business'),
    },
    {
      url: `${baseUrl}/business/pricing`,
      lastModified: dateFor('/business/pricing'),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: alternatesFor('/business/pricing'),
    },
    {
      url: `${baseUrl}/es/business/pricing`,
      lastModified: dateFor('/es/business/pricing'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: alternatesFor('/business/pricing'),
    },
    {
      url: `${baseUrl}/help`,
      lastModified: dateFor('/help'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: alternatesFor('/help'),
    },
    {
      url: `${baseUrl}/es/ayuda`,
      lastModified: dateFor('/es/ayuda'),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: alternatesFor('/help'),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: dateFor('/about'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: dateFor('/work'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: dateFor('/partners'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: dateFor('/team'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: dateFor('/reviews'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-info`,
      lastModified: dateFor('/ai-info'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-buffer`,
      lastModified: dateFor('/compare/moil-vs-buffer'),
      changeFrequency: 'monthly',
      priority: 0.8,
      ...esAlternatesFor('/compare/moil-vs-buffer'),
    },
    {
      url: `${baseUrl}/compare/moil-vs-later`,
      lastModified: dateFor('/compare/moil-vs-later'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-hootsuite`,
      lastModified: dateFor('/compare/moil-vs-hootsuite'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-chatgpt`,
      lastModified: dateFor('/compare/moil-vs-chatgpt'),
      changeFrequency: 'monthly',
      priority: 0.8,
      ...esAlternatesFor('/compare/moil-vs-chatgpt'),
    },
    {
      url: `${baseUrl}/compare/best-ai-content-calendar-tools`,
      lastModified: dateFor('/compare/best-ai-content-calendar-tools'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/done-for-you-social-media-alternatives`,
      lastModified: dateFor('/compare/done-for-you-social-media-alternatives'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/moil-vs-agency`,
      lastModified: dateFor('/compare/moil-vs-agency'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/alternative-to-consultant`,
      lastModified: dateFor('/compare/alternative-to-consultant'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: dateFor('/contact'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: dateFor('/terms'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      // Demoted: hiring is not the lead product
      url: `${baseUrl}/candidate`,
      lastModified: dateFor('/candidate'),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/candidate/searchjob`,
      lastModified: dateFor('/candidate/searchjob'),
      changeFrequency: 'daily',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: dateFor('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // The remaining compliance pages. All six are indexable, all six are linked
    // from the global footer, and all six were missing from this file — which
    // is how a page ends up crawled but never declared. `/legacy` stays out on
    // purpose: robots.txt disallows it.
    {
      url: `${baseUrl}/cookies`,
      lastModified: dateFor('/cookies'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: dateFor('/dmca'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dpa`,
      lastModified: dateFor('/dpa'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/subprocessors`,
      lastModified: dateFor('/subprocessors'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: dateFor('/accessibility'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-choices`,
      lastModified: dateFor('/privacy-choices'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
