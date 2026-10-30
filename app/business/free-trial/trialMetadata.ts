import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { TRIAL_CONFIG, TRIAL_COPY, TRIAL_PATHS, type TrialLang } from './trialContent';

/**
 * Metadata for one language of the trial page. Both pages link each other
 * with hreflang (the brief asks for it) and stay noindex until
 * TRIAL_CONFIG.indexable is turned on; they are also left out of the sitemap.
 */
export function trialMetadata(lang: TrialLang): Metadata {
  const copy = TRIAL_COPY[lang];
  const url = `${baseURL1}${TRIAL_PATHS[lang]}`;
  return {
    title: { absolute: copy.meta.title },
    description: copy.meta.description,
    robots: TRIAL_CONFIG.indexable
      ? undefined
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseURL1}${TRIAL_PATHS.en}`,
        es: `${baseURL1}${TRIAL_PATHS.es}`,
        'x-default': `${baseURL1}${TRIAL_PATHS.en}`,
      },
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      url,
      siteName: 'Moil',
      type: 'website',
      locale: copy.meta.ogLocale,
      images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: copy.hero.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.meta.title,
      description: copy.meta.description,
      images: ['/og-home.jpg'],
    },
  };
}
