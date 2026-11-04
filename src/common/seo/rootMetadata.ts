import type { Metadata } from 'next';
import { META_EN } from './pricingCopy';
import { baseURL1 } from '../constants/baseUrl';

/**
 * The site-wide metadata both root layouts start from (app/(en)/layout.tsx
 * and app/es/layout.tsx). Each section's own layout overrides what it needs,
 * exactly as it did when there was one root layout.
 */
export const rootMetadata: Metadata = {
  title: {
    default: 'Moil | AI Marketing for Small Business — English & Spanish',
    template: '%s | Moil'
  },
  description: META_EN,
  keywords: [
    'AI marketing for small business',
    'social media content calendar',
    'done for you social media',
    'Moil360',
    'AI business plan generator',
    'AI co-founder small business',
    'AI tools for small business',
    'business plan software',
    'AI market research tool',
    'small business growth platform',
    'content calendar AI',
    'competitor analysis tool',
    'AI business coach',
    'bilingual business platform',
    'SMB AI platform',
    'free business plan generator',
    'AI financial projections',
    'small business software Texas',
    'business automation tools',
    'startup tools'
  ],
  authors: [{ name: 'Moil Enterprise Inc.', url: 'https://www.moilapp.com' }],
  creator: 'Moil Enterprise Inc.',
  publisher: 'Moil Enterprise Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseURL1),
  // NOTE: no `alternates.canonical` here — every leaf page (`/`, `/business`,
  // `/candidate`, `/privacy`, `/business/pricing`) declares its
  // own self-canonical via its own metadata. A root canonical here would
  // override every page that doesn't override it, which is exactly the bug
  // that consolidated the homepage's SEO authority into /business.
  openGraph: {
    title: 'Moil | AI Marketing for Small Business — English & Spanish',
    description: META_EN,
    url: baseURL1,
    siteName: 'Moil',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil - AI Co-Founder for Small Business',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moil | AI Marketing for Small Business — English & Spanish',
    description: META_EN,
    images: ['/og-home.jpg'],
    creator: '@MoilApp',
    site: '@MoilApp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/moil-196.png', sizes: '196x196', type: 'image/png' },
    ],
    apple: [
      { url: '/moil-196.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  // Google Search Console verification. Set NEXT_PUBLIC_GSC_VERIFICATION in the
  // environment (GSC → Settings → Ownership verification → HTML tag → the
  // `content` value) and the meta tag is emitted automatically on next build.
  // Unset → no tag rendered. No code change needed to activate.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
  category: 'business',
  classification: 'AI Business Growth Platform',
};
