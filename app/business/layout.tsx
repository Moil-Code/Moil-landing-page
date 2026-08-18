import type { Metadata } from 'next';
import './business.css';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'AI Co-Founder for Local Shops — Plan, Coaching & Moil360',
  description: 'Moil is the AI co-founder for local shops. Research, plan, and coaching for $25 a month. The full Moil360 calendar is Market Pro, $75. English and Spanish. Start free, no card.',
  keywords: [
    'AI co-founder for local shops',
    'Moil360',
    'AI business plan generator',
    'free business plan generator',
    'AI tools for small business',
    'small business growth platform',
    'AI market research tool',
    'business plan software',
    'content calendar AI',
    'competitor analysis tool free',
    'AI financial projections',
    'AI business coach',
    'bilingual business tools',
    'small business software Texas',
    'SMB AI platform',
    'business automation software',
    'AI co-founder',
    'market research software',
    'startup business tools',
    'investor ready business plan',
    'service business software',
    'home services business tools',
    'trade business management',
    'HVAC business software',
    'small business AI tools'
  ],
  openGraph: {
    title: 'AI Co-Founder for Local Shops — Plan, Coaching & Moil360',
    description: 'Research, plan, and coaching for $25 a month. The full Moil360 calendar is Market Pro, $75. English and Spanish. Start free, no card.',
    url: `${baseURL1}/business`,
    images: [
      {
        url: '/og-business.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil AI Co-Founder for Local Shops',
      }
    ],
  },
  twitter: {
    title: 'AI Co-Founder for Local Shops — Plan, Coaching & Moil360',
    description: 'Research, plan, and coaching for $25 a month. The full Moil360 calendar is Market Pro, $75. English and Spanish. Start free, no card.',
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
            "description": "AI co-founder for local shops. Learns the business once, then writes the plan and a 30-day Moil360 calendar in English and Spanish. Not affiliated with MOIL Limited (India).",
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
            "description": "AI co-founder for local shops: research, plan, coaching, and documents. $25 a month. Does not include the full Moil360 calendar.",
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
            "description": "AI co-founder plus the full Moil360 30-day calendar in English and Spanish. $75 a month.",
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
            "description": "AI co-founder for local shops. Learns the business once, then writes the plan and coaches in English and Spanish. Professional $25; full Moil360 calendar is Market Pro $75.",
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
              "AI Co-Founder for Local Shops",
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

      {/* FAQ structured data — mirrors the on-page FAQ (BusinessFaqSection) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does Moil do for local shops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil is the AI co-founder for local shops. It learns the business once, then writes the plan and coaches the owner in English and Spanish. Professional is $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75. Moil is not a hiring platform."
                }
              },
              {
                "@type": "Question",
                "name": "How much does Moil cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Professional is $25 a month and includes the AI co-founder: research, plan, coaching, and documents. The full Moil360 30-day calendar is Market Pro at $75. Start free, no card. A typical consultant runs $5,000–$15,000 per engagement, and a marketing agency retainer averages $3,000–$8,000 a month."
                }
              },
              {
                "@type": "Question",
                "name": "Can Moil generate a business plan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil learns your shop once, then writes a business plan from that context in English or Spanish. Research, the plan, coaching, and documents come with Professional at $25 a month. The full Moil360 calendar is not in that plan; it is Market Pro at $75. Start free, no card."
                }
              },
              {
                "@type": "Question",
                "name": "What is Moil360?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil360 is the 30-day content calendar Moil writes after it learns the shop — topics, captions, and assets in English and Spanish. The full calendar is Market Pro at $75 a month. Professional at $25 is the AI co-founder for research, plan, coaching, and documents. It does not include the full Moil360 calendar."
                }
              },
              {
                "@type": "Question",
                "name": "Does Moil work in Spanish?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil works in English and Spanish end to end. It learns the business once, then writes the plan, coaching, and documents in either language. Professional is $25 a month. The full Moil360 calendar is also bilingual and ships with Market Pro at $75. Start free, no card."
                }
              },
              {
                "@type": "Question",
                "name": "How is Moil different from ChatGPT or Claude?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ChatGPT and Claude are blank chats. Every session starts from zero, and you assemble the work. Moil is the AI co-founder for local shops: it learns the business once, then writes the plan and coaches in English and Spanish. Professional is $25 a month. The full Moil360 calendar is Market Pro at $75."
                }
              },
              {
                "@type": "Question",
                "name": "How is Moil different from a consultant or agency?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A typical consultant charges $5,000–$15,000 per engagement. A marketing agency retainer averages $3,000–$8,000 a month. Moil is the AI co-founder at $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75. Moil stays on after the plan is written."
                }
              },
              {
                "@type": "Question",
                "name": "Is Moil the same as MOIL Limited?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil is Moil Enterprise Inc. in Buda, Texas — the AI co-founder for local shops. It is not a hiring platform and is not affiliated with MOIL Limited of India. Professional is $25 a month for research, plan, coaching, and documents. The full Moil360 calendar is Market Pro at $75."
                }
              }
            ]
          })
        }}
      />

      {/* Article schema — E-E-A-T signals for AI Overview citation. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Moil — AI Co-Founder for Local Shops: Research, Plan, and Coaching for $25 a Month",
            "description": "Moil is the AI co-founder for local shops. It learns the business once, then writes the plan and coaches in English and Spanish. The full Moil360 calendar is Market Pro, $75.",
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
              { "@type": "Thing", "name": "AI co-founder for local shops" },
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
            "name": "How to Create a Business Plan with Your AI Co-Founder",
            "description": "Use Moil's AI co-founder to learn the shop once, then write the plan and coach in English or Spanish. Professional is $25 a month. The full Moil360 calendar is Market Pro, $75.",
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
                "name": "Tell Moil About Your Shop",
                "text": "Answer questions about your shop by voice or text — in English or Spanish. Moil learns the business once."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Receive Market Research",
                "text": "Moil writes market research from that context: customers, competitors, and the local opportunity."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Get Your Business Plan",
                "text": "Moil writes the plan — strategy, projections, and documents — included with Professional at $25 a month."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Add the Full Moil360 Calendar (Market Pro)",
                "text": "The full 30-day Moil360 calendar is Market Pro at $75 a month. It is not included at $25."
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Keep Your AI Coach",
                "text": "Your AI co-founder stays on for coaching in English and Spanish after the plan is written. Start free, no card."
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
