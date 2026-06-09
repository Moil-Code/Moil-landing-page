import type { Metadata } from 'next';
import './business.css';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'AI Co-Founder for Small Business — Business Plans, Hiring & Marketing',
  description: 'Moil gives small businesses an AI co-founder that writes your business plan, runs your marketing, and hires your team. 500+ businesses growing. Try free. From $25/mo.',
  keywords: [
    'AI business plan generator',
    'free business plan generator',
    'AI tools for small business',
    'small business growth platform',
    'AI market research tool',
    'business plan software',
    'smart hiring platform',
    'AI recruiting software small business',
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
    title: 'AI Co-Founder for Small Business — Business Plans, Hiring & Marketing',
    description: 'Business plan, hiring, content marketing & AI coaching — all in one platform. 500+ small businesses growing. Try free. From $25/mo.',
    url: `${baseURL1}/business`,
    images: [
      {
        url: '/og_image_v2.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil AI Business Growth Platform for Small Business',
      }
    ],
  },
  twitter: {
    title: 'AI Co-Founder for Small Business — Business Plans, Hiring & Marketing',
    description: 'Business plan, hiring, content marketing & AI coaching — all in one platform. 500+ small businesses growing. Try free. From $25/mo.',
  },
  alternates: {
    canonical: `${baseURL1}/business`,
    languages: {
      'en': `${baseURL1}/business`,
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
      {/* SoftwareApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Moil Business Growth Platform",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "AI-powered business growth platform for small businesses. Generates business plans, market research, content calendars, and manages smart hiring — all in one platform.",
            "url": `${baseURL1}/business`,
            "screenshot": `${baseURL1}/og_image_v2.jpg`,
            "offers": {
              "@type": "Offer",
              "price": "25",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "25",
                "priceCurrency": "USD",
                "billingDuration": "P1M",
                "description": "Starting price per month"
              },
              "description": "From $25/month. Free trial available."
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": [
              "AI Business Plan Generator",
              "AI Market Research (20-30 pages)",
              "30-Day Content Marketing Calendar",
              "AI Image & Video Generation",
              "Smart Hiring — Post to 10+ Platforms",
              "AI Candidate Matching (95% accuracy)",
              "Competitor Analysis",
              "Financial Projections",
              "24/7 AI Business Coach",
              "Brand DNA System",
              "Bilingual English & Spanish"
            ]
          })
        }}
      />

      {/* FAQ structured data — mirrors the on-page FAQ (en.ts business.faq.items) exactly so Google honors the rich result */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does Moil do for small businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil is an AI co-founder for small businesses. In one guided session it writes your business plan, runs market research, builds a 30-day content marketing calendar, and posts your job to 10+ hiring platforms. It’s fully bilingual in English and Spanish, starts at $25 a month, and is trusted by 500+ small businesses with EDC and Chamber of Commerce partnerships."
                }
              },
              {
                "@type": "Question",
                "name": "How much does Moil cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil plans start at $25/month (Professional) and $75/month (Market Pro). All plans include a 30-day money-back guarantee and no setup fees. Your first AI co-founder conversation requires no credit card. For comparison, a typical small-business consultant runs $5,000–$15,000 per engagement (Thumbtack, 2025) and a marketing agency retainer averages $3,000–$8,000 per month (HawkSEM, 2025)."
                }
              },
              {
                "@type": "Question",
                "name": "Can Moil generate a business plan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. After you answer 21 strategic questions about your business by voice or text — in English or Spanish — Moil produces a complete, investor-ready business plan with 5-year financial projections, go-to-market strategy, and funding requirements. The whole process takes minutes, not weeks."
                }
              },
              {
                "@type": "Question",
                "name": "How does smart hiring work on Moil?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You post a job once and Moil distributes it to 10+ hiring platforms automatically. Moil’s AI then scores and ranks every candidate with 95% accuracy across skills, experience, location, and language. Average time to hire on Moil is 11 days, compared to the SMB benchmark of 83.5 days (SHRM 2025 Recruiting Benchmarking Report) — roughly 87% faster."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is Moil’s AI candidate matching?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil’s AI scoring achieves 95% accuracy across skills, location, experience level, and language requirements. Businesses on Moil report a 94% interview success rate and 91% employee retention at 90 days."
                }
              },
              {
                "@type": "Question",
                "name": "What is Content360?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Content360 is Moil’s AI-powered content marketing engine. It generates a complete 30-day content calendar with researched topics, captions, hashtags, AI-generated images, and AI video — all customized to your brand and industry. Includes 6 content types (Educational, Promotional, Engagement, Behind-the-Scenes, Entertainment) and is available in the Market Pro plan."
                }
              },
              {
                "@type": "Question",
                "name": "Does Moil support Spanish (bilingual)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil is one of the few AI business platforms built fully bilingual in English and Spanish. The onboarding, market research, business plan, content calendar, captions, and hiring pipeline all work in either language. Moil’s bilingual hiring network reaches 58% more bilingual candidates than the industry average — especially relevant to the 5+ million Hispanic-owned U.S. businesses (SBA, 2024)."
                }
              },
              {
                "@type": "Question",
                "name": "How is Moil different from ChatGPT or other generic AI tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generic AI tools are blank slates — every session starts from zero, you’re the integrator, and outputs are rough drafts. Moil is purpose-built for small business owners. It learns your specific business through structured onboarding, maintains context across sessions, integrates real market data, generates actual marketing assets (images and video), connects to 10+ hiring platforms, and delivers finished, ready-to-use outputs."
                }
              },
              {
                "@type": "Question",
                "name": "How is Moil different from hiring a business consultant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A traditional business consultant charges $5,000–$15,000 per engagement and takes 2–4 weeks to deliver. Moil delivers market research, a business plan, content strategy, and hiring setup in one session — for $25–$75 a month. A consultant goes dark between engagements; Moil is on 24/7 and remembers everything about your business."
                }
              },
              {
                "@type": "Question",
                "name": "Is my business data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil is SOC 2 compliant with bank-level encryption. Your business data, market research, and candidate information are protected and never shared with third parties. Moil is trusted by 500+ small businesses and partners with Economic Development Corporations and Chambers of Commerce."
                }
              }
            ]
          })
        }}
      />

      {/* Article schema — E-E-A-T signals for AI Overview citation. Post-March-2026 Google update made Experience the top E-E-A-T factor. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Moil — AI Co-Founder for Small Business: Plan, Hire, Market, and Grow for $25/month",
            "description": "Comprehensive overview of Moil, the AI co-founder platform for small businesses: business plan generation, market research, 30-day content calendar, smart hiring across 10+ platforms, and 24/7 AI coaching. Bilingual English and Spanish.",
            "url": `${baseURL1}/business`,
            "datePublished": "2025-01-15",
            "dateModified": "2026-06-09",
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
              { "@type": "Thing", "name": "AI for small business" },
              { "@type": "Thing", "name": "Business plan generation" },
              { "@type": "Thing", "name": "Smart hiring" },
              { "@type": "Thing", "name": "Content marketing automation" },
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

      {/* Breadcrumb schema — completes the breadcrumb coverage (only /pricing and /searchjob had it previously) */}
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
      {/* HowTo structured data — "21 questions to full business plan" process */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create a Complete Business Plan with AI in Under 30 Minutes",
            "description": "Use Moil's AI co-founder to generate a full business plan, market research, content calendar, and hiring pipeline in one guided session.",
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
                "name": "Answer 21 Strategic Questions",
                "text": "Answer 21 questions about your business by voice or text — in English or Spanish. Moil's AI learns your business model, market, goals, and gaps in 5–10 minutes."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Receive 20–30 Pages of Market Research",
                "text": "Moil automatically generates deep market research using your answers: TAM/SAM/SOM, competitive landscape, customer personas, opportunity scoring, and 8–10 authoritative sources."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Get Your Investor-Ready Business Plan",
                "text": "With one click, receive a polished PDF business plan with 5-year financial projections, go-to-market strategy, operational roadmap, and funding requirements."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Build Your 30-Day Content Marketing Calendar",
                "text": "Content360 generates 30 days of content: researched topics, captions, hashtags, CTAs, AI images, and AI video — ready to post across all platforms."
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Activate Smart Hiring",
                "text": "Post a job once and Moil distributes it to 10+ platforms automatically. AI scores and ranks every candidate with 95% accuracy. Average time to hire: 11 days."
              },
              {
                "@type": "HowToStep",
                "position": 6,
                "name": "Access Your 24/7 AI Business Coach",
                "text": "Your AI co-founder is always available for cash flow guidance, marketing refinements, retention tactics, and scaling advice — and gets smarter the more you use it."
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
