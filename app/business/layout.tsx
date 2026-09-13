import type { Metadata } from 'next';
import './business.css';
import { moilOffers } from '../../src/common/seo/offers';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { en } from '../../src/common/translations/en';
import { faqJsonLd } from '../../src/common/utils/faqJsonLd';
import { META_EN } from '../../src/common/seo/pricingCopy';
import { jsonLd } from '~~/src/common/seo/jsonLd';

export const metadata: Metadata = {
  title: {
    absolute: 'AI co-founder that writes the plan and the month | Moil',
  },
  description: META_EN,
  keywords: [
    'AI marketing for small business',
    'social media content calendar',
    'done for you social media',
    'AI content calendar tool',
    'what to post on social media for my business',
    'social media for small business owners',
    'AI social media captions',
    'Moil360',
    'bilingual marketing tools',
    'marketing software in Spanish',
    'calendario de contenidos para redes sociales',
    'contenido para redes sociales negocio pequeno',
    'Buffer alternative',
    'Later alternative',
    'Hootsuite alternative',
    'AI business plan generator',
    'AI market research tool',
    'AI business coach',
    'small business marketing plan',
    'content marketing for contractors',
    'social media for HVAC business',
    'social media for landscaping business',
    'small business AI tools',
    'AI co-founder',
  ],
  openGraph: {
    title: 'AI co-founder that writes the plan and the month | Moil',
    description: META_EN,
    url: `${baseURL1}/business`,
    images: [
      {
        url: '/og-business.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil — AI co-founder for small business owners',
      }
    ],
  },
  twitter: {
    title: 'AI co-founder that writes the plan and the month | Moil',
    description: META_EN,
  },
  alternates: {
    canonical: `${baseURL1}/business`,
    languages: {
      'en': `${baseURL1}/business`,
      'es': `${baseURL1}/es/business`,
      'x-default': `${baseURL1}/business`,
    },
  },
};

/**
 * Money-page JSON-LD stack (Phase B):
 *   keep — SoftwareApplication+Offers, FAQPage (visible #faq UI), Breadcrumb,
 *          Speakable WebPage. Organization + WebSite live once in root layout.
 *   slimmed — duplicate Organization, Service×2, Article, HowTo removed
 *          (overlapping types drove SEMrush "invalid structured data" + RRT
 *          optional warnings for dates / employees / priceSpecification).
 */
export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SoftwareApplication — offers from shared helper (PriceSpecification). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Moil",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "Moil is the AI co-founder for small business owners. Owners shouldn\u2019t have to be everything on top of the real job. Moil learns the business once, builds a brain that compounds, thinks with them, and does the work \u2014 research, plans, documents \u2014 and, on Market Pro, writes the whole month of content, on brand, in English or Spanish.",
            "url": `${baseURL1}/business`,
            "screenshot": `${baseURL1}/og_image_v2.jpg`,
            "offers": moilOffers(),
            "featureList": [
              "AI co-founder for small business owners",
              "Moil360 30-Day Content Calendar",
              "AI Business Plan",
              "AI Market Research",
              "24/7 Coaching",
              "Documents",
              "Moil360 — the month written automatically (Market Pro)",
              "Bilingual English & Spanish"
            ]
          })
        }}
      />

      {/* FAQ — same array as BusinessFaqSection (id="faq") on business + pricing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(faqJsonLd(en.business.faq.items)),
        }}
      />

      {/* Speakable — AEO direct-answer block */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Moil — the AI co-founder for small business owners",
            "url": `${baseURL1}/business`,
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["#what-is-moil", ".faq-q", ".faq-a-inner"]
            }
          })
        }}
      />

      {/* Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseURL1
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "For Business",
                "item": `${baseURL1}/business`
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
