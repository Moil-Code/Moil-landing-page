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

      {/*
        Offerings — typed as Service, deliberately NOT Product.

        These were schema.org/Product until Search Console reported them as
        Merchant listings (missing "image", "shippingDetails",
        "hasMerchantReturnPolicy", "availability") and Product snippets
        (missing "review", "aggregateRating") in Aug 2026. Every one of those
        warnings is a physical-retail requirement Google applies to Product,
        and two of them cannot be satisfied honestly:

          - shippingDetails / hasMerchantReturnPolicy describe shipping a box.
            Moil is a monthly subscription. Declaring shipping terms for it
            would be false structured data, not a fix.
          - review / aggregateRating need a star rating. Moil has real,
            sourced reviews (src/common/data/reviews.ts) but no star scores
            anywhere — Facebook publishes yes/no recommendations, not ratings.
            Inventing a rating is exactly what CLAUDE.md -> "Testimonials"
            rule 4 forbids, and the FTC rule behind it.

        What this trade costs, stated honestly: a product snippet needs name
        plus ONE of review, aggregateRating or offers — so these nodes, which
        carried offers, were snippet-eligible on price alone. Dropping Product
        gives up that eligibility. It was judged worth it because the merchant
        fields above can never be satisfied for a subscription, so the warnings
        would recur forever, and Google grants product snippets to SaaS
        subscriptions rarely in any case. But it is a trade, not a free win.

        The alternative, if that trade is ever judged wrong: keep Product and
        add only image and availability. That clears the one CRITICAL issue
        (missing image) and leaves four non-critical warnings standing, while
        keeping price-snippet eligibility. That is a product call, not a
        technical one.

        Do not change these back to Product without weighing the above.
      */}

      {/* Service — Professional $25 (co-founder; no Moil360) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Moil Professional",
            "serviceType": "AI business assistant subscription",
            "description": "Professional $25/month — ask the co-founder for anything and it produces the finished work: research, plans, documents, brand assets, flyers, decks. It also schedules and publishes the posts you approve to Facebook and Instagram.",
            "brand": {
              "@type": "Brand",
              "name": "Moil"
            },
            "provider": {
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "url": baseURL1
            },
            "areaServed": "US",
            "availableLanguage": ["en", "es"],
            "image": `${baseURL1}/og-pricing.jpg`,
            "url": `${baseURL1}/business/pricing`,
            "offers": {
              "@type": "Offer",
              "price": "25",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `${baseURL1}/business/pricing`,
              "seller": {
                "@type": "Organization",
                "name": "Moil Enterprise Inc.",
                "url": baseURL1
              },
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

      {/* Service — Market Pro $75 (Moil360 on this plan only) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Moil Market Pro",
            "serviceType": "AI marketing calendar subscription",
            "description": "Market Pro $75/month — everything in Professional at higher limits, plus Moil360, which writes the 30-day content calendar automatically, and AI video.",
            "brand": {
              "@type": "Brand",
              "name": "Moil"
            },
            "provider": {
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "url": baseURL1
            },
            "areaServed": "US",
            "availableLanguage": ["en", "es"],
            "image": `${baseURL1}/og-pricing.jpg`,
            "url": `${baseURL1}/business/pricing`,
            "offers": {
              "@type": "Offer",
              "price": "75",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `${baseURL1}/business/pricing`,
              "seller": {
                "@type": "Organization",
                "name": "Moil Enterprise Inc.",
                "url": baseURL1
              },
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
            "description": "The co-founder who does the work you never get to. Small business owners shouldn\u2019t have to be everything — marketing, planning, and content on top of the real job. Moil learns the business once, then produces finished work: plans, posts, and flyers, in English and Spanish. It also schedules and publishes the posts you approve to Facebook and Instagram. Professional $25 makes things on request; Market Pro $75 also writes the month automatically.",
            "url": `${baseURL1}/business`,
            "screenshot": `${baseURL1}/og_image_v2.jpg`,
            "offers": [
              {
                "@type": "Offer",
                "name": "Professional",
                "price": "25",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "25",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M",
                  "description": "Ask for anything; it makes it"
                },
                "description": "Professional $25/month. First conversation free, no card."
              },
              {
                "@type": "Offer",
                "name": "Market Pro",
                "price": "75",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "75",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M",
                  "description": "Also writes your month automatically"
                },
                "description": "Market Pro $75/month — adds the automatic Moil360 calendar and video."
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
