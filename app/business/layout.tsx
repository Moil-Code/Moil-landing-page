import type { Metadata } from 'next';
import './business.css';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { en } from '../../src/common/translations/en';
import { faqJsonLd } from '../../src/common/utils/faqJsonLd';

export const metadata: Metadata = {
  title: 'AI Marketing for Small Business — Content Calendar in English & Spanish',
  description: 'Moil learns your small business once, then writes your marketing: a 30-day content calendar with captions and images that refreshes every month. Bilingual English and Spanish. From $25 a month. Start free, no card.',
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
    title: 'AI Marketing for Small Business — Content Calendar in English & Spanish',
    description: 'Moil writes your month of content — researched, in your voice, in English and Spanish. From $25 a month. Start free, no card.',
    url: `${baseURL1}/business`,
    images: [
      {
        url: '/og-business.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil — AI marketing for small business',
      }
    ],
  },
  twitter: {
    title: 'AI Marketing for Small Business — Content Calendar in English & Spanish',
    description: 'Moil writes your month of content — researched, in your voice, in English and Spanish. From $25 a month. Start free, no card.',
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

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Organization — Moil Enterprise Inc., Buda TX, 2-10 */}
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
            "description": "Moil builds AI marketing software for small businesses. It learns a business once, then writes a 30-day content calendar with captions and images, in English and Spanish.",
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
            "sameAs": [
              "https://www.linkedin.com/company/moilapp",
              "https://x.com/MoilApp",
              "https://www.instagram.com/themoilapp/",
              "https://www.tiktok.com/@moilapp",
              "https://www.facebook.com/MoilWorks/"
            ]
          })
        }}
      />

      {/* Product — Professional $25 (co-founder; no Moil360) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Moil Professional",
            "description": "Market research, business plan, coaching and documents for a small business. $25 a month. Does not include the full Moil360 content calendar.",
            "brand": {
              "@type": "Brand",
              "name": "Moil"
            },
            "url": `${baseURL1}/business/pricing`,
            "offers": {
              "@type": "Offer",
              "price": "25",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "25",
                "priceCurrency": "USD",
                "billingDuration": "P1M"
              },
              "description": "Professional — research, plan, coaching, and documents. $25/month."
            }
          })
        }}
      />

      {/* Product — Market Pro $75 (Moil360 on this plan only) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Moil Market Pro",
            "description": "Everything in Professional plus the full Moil360 30-day content calendar — topics, captions and images, in English and Spanish. $75 a month.",
            "brand": {
              "@type": "Brand",
              "name": "Moil"
            },
            "url": `${baseURL1}/business/pricing`,
            "offers": {
              "@type": "Offer",
              "price": "75",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "75",
                "priceCurrency": "USD",
                "billingDuration": "P1M"
              },
              "description": "Market Pro — full Moil360 calendar. $75/month."
            }
          })
        }}
      />

      {/* SoftwareApplication structured data — no AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Moil",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "AI marketing platform for small businesses. Learns the business once, then writes a 30-day content calendar with captions and images and refreshes it monthly, in English and Spanish. Professional $25; the full Moil360 calendar is Market Pro $75.",
            "url": `${baseURL1}/business`,
            "screenshot": `${baseURL1}/og_image_v2.jpg`,
            "offers": [
              {
                "@type": "Offer",
                "name": "Professional",
                "price": "25",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "25",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M",
                  "description": "Research, plan, coaching, and documents"
                },
                "description": "Professional $25/month. Free trial available. No credit card."
              },
              {
                "@type": "Offer",
                "name": "Market Pro",
                "price": "75",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "75",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M",
                  "description": "Full Moil360 30-day calendar"
                },
                "description": "Market Pro $75/month — full Moil360 calendar."
              }
            ],
            "featureList": [
              "AI Marketing for Small Business",
              "Moil360 30-Day Content Calendar",
              "AI Business Plan",
              "AI Market Research",
              "24/7 Coaching",
              "Documents",
              "Moil360 30-Day Calendar (Market Pro $75)",
              "Bilingual English & Spanish"
            ]
          })
        }}
      />

      {/* FAQ structured data — generated from the SAME array the on-page FAQ renders
          (src/common/translations/en.ts -> business.faq.items). It used to be hand-copied
          here, drifted from the component, and the page ended up publishing two
          contradictory sets of answers. Never hand-maintain this again. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(en.business.faq.items)),
        }}
      />

      {/* Article schema — E-E-A-T signals for AI Overview citation. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Moil — AI Marketing for Small Business: A Month of Content, Written for You",
            "description": "Moil learns a small business once, then writes its marketing: a 30-day content calendar with researched topics, captions in the owner\u2019s voice and generated images, refreshed every month, in English and Spanish.",
            "url": `${baseURL1}/business`,
            "datePublished": "2025-01-15",
            "dateModified": "2026-08-18",
            "author": {
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "url": "https://www.moilapp.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "url": "https://www.moilapp.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.moilapp.com/og_image_v2.jpg",
                "width": 1200,
                "height": 630
              }
            },
            "image": "https://www.moilapp.com/og_image_v2.jpg",
            "about": [
              { "@type": "Thing", "name": "AI marketing for small business" },
              { "@type": "Thing", "name": "Social media content calendar" },
              { "@type": "Thing", "name": "Business plan generation" },
              { "@type": "Thing", "name": "Moil360 content calendar" },
              { "@type": "Thing", "name": "Bilingual business tools" }
            ]
          })
        }}
      />

      {/* Speakable schema — designates the AEO direct-answer block as the primary voice/conversational answer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "url": `${baseURL1}/business`,
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["#what-is-moil", ".faq-q", ".faq-a-inner"]
            }
          })
        }}
      />

      {/* Breadcrumb schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
      {/* HowTo structured data — learn once, then plan. Moil360 is Market Pro. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Get a Month of Social Media Content for a Small Business",
            "description": "How to go from a blank calendar to a finished month of content: describe the business once, let Moil research the market, then review the 30 days it writes. Works in English or Spanish.",
            "totalTime": "PT30M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "25"
            },
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Describe your business once",
                "text": "Answer questions about what you sell, who buys and how you talk — by voice or text, in English or Spanish. Moil stores that context and reuses it every month."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Get the market research",
                "text": "Moil researches your customers, your competitors and the local opportunity, and uses it to decide what is worth posting about."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Get your business plan",
                "text": "Moil writes the plan \u2014 strategy, projections and documents \u2014 included with Professional at $25 a month."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Review the 30-day calendar",
                "text": "Moil360 lays out 30 days of topics, captions and images. You review and approve rather than write. The full calendar is Market Pro at $75 a month."
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Let it refresh every month",
                "text": "Next month drafts itself from the same stored context, so nothing expires and you never re-explain the business. Start free, no card."
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
