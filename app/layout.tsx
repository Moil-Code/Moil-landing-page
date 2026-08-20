import type { Metadata } from 'next';
import { Bebas_Neue, Inter, Poppins } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import Analytics from '../src/common/components/analytics';
import { SiteFooter } from '../src/common/components/SiteFooter';
import CookieConsent from '../src/common/components/CookieConsent';
import { baseURL1 } from '../src/common/constants/baseUrl';

const bebas = Bebas_Neue({ weight: ['400'], subsets: ['latin'], display: 'swap' });

// Inter and Poppins used to arrive via three `@import url(fonts.googleapis…)`
// statements inside globals.css / business.css. A CSS `@import` of a remote
// stylesheet is the worst case for render-blocking: the browser must download
// our CSS, parse it, then open a second origin and download another stylesheet
// before it can paint. Lighthouse costed that chain at ~955 ms on mobile.
// next/font self-hosts the woff2 files from our own origin, inlines the
// @font-face rules into the build's CSS, and preloads them, so the round trip
// to fonts.googleapis.com / fonts.gstatic.com disappears entirely.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// preload:false because Poppins is only referenced by /candidate and a couple of
// shared widgets. Left on, next/font preloads all four weights at VeryHigh
// priority on every route — 32 KB that /business never paints with.
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Moil | AI Marketing for Small Business — English & Spanish',
    template: '%s | Moil'
  },
  description: 'Moil learns your small business once, then writes your marketing: a 30-day content calendar with captions and images that refreshes every month. Bilingual English and Spanish. From $25 a month.',
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
  // `/candidate`, `/marketing`, `/privacy`, `/business/pricing`) declares its
  // own self-canonical via its own metadata. A root canonical here would
  // override every page that doesn't override it, which is exactly the bug
  // that consolidated the homepage's SEO authority into /business.
  openGraph: {
    title: 'Moil | AI Marketing for Small Business — English & Spanish',
    description: 'Research, plan, and coaching for $25 a month. The full Moil360 calendar is Market Pro, $75. English and Spanish. Moil Enterprise Inc., Buda, Texas.',
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
    description: 'Research, plan, and coaching for $25 a month. The full Moil360 calendar is Market Pro, $75. English and Spanish. Moil Enterprise Inc., Buda, Texas.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The font *variable* classes must sit on <html>, not <body>: business.css
    // builds its --body / --display / --mono tokens on `:root`, and a custom
    // property referencing an undefined variable is invalid at computed-value
    // time — which silently drops every font-family on the page to the Tailwind
    // fallback stack. Keep them here so :root can resolve them.
    <html lang="en" className={`scroll-smooth ${inter.variable} ${poppins.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        {/* Pre-paint theme restore. The server starts in light mode, then this
            blocking script applies a saved dark preference before the browser
            paints. The attribute lives on <html> for the entire application so
            client-side and full-page navigation share one stable theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem('moil-theme');d.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){d.setAttribute('data-theme','light')}})()`,
          }}
        />
        <meta name="theme-color" content="#5843BE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "alternateName": "Moil",
              "url": "https://www.moilapp.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.moilapp.com/moil-512.png",
                "width": 512,
                "height": 512
              },
              "description": "Moil builds an AI co-founder for small business owners. It learns a business once, then produces the finished work the owner has no time to make, in English and Spanish.",
              "foundingDate": "2023",
              "industry": "Business Software",
              "numberOfEmployees": "2-10",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Buda",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "cs@moilapp.com",
                "url": "https://www.moilapp.com"
              },
              // sameAs MUST exactly match the canonical URLs Google has indexed
              // for each profile (verified Apr 2026). A typo (e.g. /moil-app vs
              // /moilapp on LinkedIn) breaks the entity-disambiguation signal
              // and lets Google confuse Moil with namesake brands.
              // Mirror this list in src/common/components/SiteFooter.tsx.
              "sameAs": [
                "https://www.linkedin.com/company/moilapp",
                "https://x.com/MoilApp",
                "https://www.instagram.com/themoilapp/",
                "https://www.tiktok.com/@moilapp",
                "https://www.facebook.com/MoilWorks/"
              ],
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Moil Professional",
                  "description": "Professional $25/month — ask the co-founder for anything and it produces the finished work: research, plans, documents, brand assets, flyers, landing pages.",
                  "price": "25",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "25",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M"
                  },
                  "category": "Business Software"
                },
                {
                  "@type": "Offer",
                  "name": "Moil Market Pro",
                  "description": "Full Moil360 30-day calendar plus the AI co-founder. $75 a month.",
                  "price": "75",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "75",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M"
                  },
                  "category": "Business Software"
                }
              ]
            })
          }}
        />


        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Moil",
              "url": "https://www.moilapp.com",
              "description": "An AI co-founder for small business owners — research, plans, documents, brand, landing pages and content, in English and Spanish.",
            })
          }}
        />
      </head>
      <body className={`${bebas.className} antialiased`} suppressHydrationWarning={true}>
        <Analytics />
        {/* Apollo tracking — deferred so it never blocks page render / LCP */}
        <Script
          id="apollo-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){
                var n=Math.random().toString(36).substring(7),
                  o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,
                o.async=!0,
                o.defer=!0,
                o.onload=function(){
                  window.trackingFunctions && window.trackingFunctions.onLoad && window.trackingFunctions.onLoad({appId:"6882701177d61d001958874e"})
                },
                document.head.appendChild(o)
              }
              initApollo();
            `,
          }}
        />
        <div id="modal"></div>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          {/* Global SiteFooter — emits social rel="me" links on every page,
              the cheapest brand-identity SEO signal we have. /business has
              its own rich BusinessFooter that stacks above this one for now;
              visual consolidation is a Phase 2 polish task. */}
          <SiteFooter />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
