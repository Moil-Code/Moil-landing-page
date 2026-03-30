import type { Metadata } from 'next';
import { Bebas_Neue } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import Analytics from '../src/common/components/analytics';
import { baseURL1 } from '../src/common/constants/baseUrl';

const bebas = Bebas_Neue({ weight: ['400'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Moil | AI Co-Founder for Small Business — Business Plan, Hiring & Growth',
    template: '%s | Moil'
  },
  description: 'Moil is the AI co-founder every small business deserves. Generate a business plan, run market research, build a content calendar, and hire top talent — all in one platform. Trusted by 500+ businesses.',
  keywords: [
    'AI business plan generator',
    'AI co-founder small business',
    'AI tools for small business',
    'business plan software',
    'AI market research tool',
    'small business growth platform',
    'smart hiring software',
    'AI recruiting tool',
    'content calendar AI',
    'competitor analysis tool',
    'AI business coach',
    'bilingual business platform',
    'SMB AI platform',
    'job marketplace',
    'free business plan generator',
    'AI financial projections',
    'small business software Texas',
    'business automation tools',
    'AI workforce solutions',
    'startup tools'
  ],
  authors: [{ name: 'Moil Enterprise Inc.', url: 'https://moilapp.com' }],
  creator: 'Moil Enterprise Inc.',
  publisher: 'Moil Enterprise Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseURL1),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Moil | AI Co-Founder for Small Business — Business Plan, Hiring & Growth',
    description: 'The AI co-founder every small business deserves. Business plan, market research, content calendar, smart hiring — all in one platform. Trusted by 500+ SMBs.',
    url: baseURL1,
    siteName: 'Moil',
    images: [
      {
        url: '/og_image_v2.png',
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
    title: 'Moil | AI Co-Founder for Small Business — Business Plan, Hiring & Growth',
    description: 'The AI co-founder every small business deserves. Business plan, market research, content calendar, smart hiring — all in one platform. Trusted by 500+ SMBs.',
    images: ['/og_image_v2.png'],
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
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5843BE' },
    ],
  },
  manifest: '/site.webmanifest',
  // TODO: Replace with real codes from Google Search Console, Yandex Webmaster
  // verification: {
  //   google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE',
  //   yandex: 'REPLACE_WITH_YANDEX_CODE',
  // },
  category: 'business',
  classification: 'AI Business Growth Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
              "name": "Moil",
              "alternateName": "Moil Enterprise Inc.",
              "url": "https://moilapp.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://moilapp.com/og_image_v2.png",
                "width": 1200,
                "height": 630
              },
              "description": "AI co-founder platform for small businesses. Generate business plans, run market research, build a 30-day content calendar, and hire top talent — all powered by AI.",
              "foundingDate": "2023",
              "industry": "Business Software",
              "numberOfEmployees": "11-50",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Austin",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "contacto@moilapp.com",
                "url": "https://moilapp.com"
              },
              "sameAs": [
                "https://twitter.com/MoilApp",
                "https://linkedin.com/company/moil-app"
              ],
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Moil Business Growth Platform",
                  "description": "AI-powered tools for market research, business plan generation, content marketing, and smart hiring. Starting at $15/month.",
                  "price": "15",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "15",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M"
                  },
                  "category": "Business Software"
                },
                {
                  "@type": "Offer",
                  "name": "Moil Job Marketplace",
                  "description": "Free job search platform connecting candidates with top employers",
                  "price": "0",
                  "priceCurrency": "USD",
                  "category": "Employment Platform"
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
              "url": baseURL1,
              "description": "AI-powered business growth platform and job marketplace",
              "potentialAction": [
                {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${baseURL1}/candidate/searchjob?title={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              ]
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
        </div>
      </body>
    </html>
  );
}