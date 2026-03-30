import type { Metadata } from 'next';
import './business.css';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'AI Business Plan Generator & Smart Hiring for Small Business | Moil',
  description: 'Generate a complete business plan in minutes with AI. Moil gives small businesses market research, financial projections, a 30-day content calendar, and smart hiring — starting at $15/month. Trusted by 500+ SMBs.',
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
    'investor ready business plan'
  ],
  openGraph: {
    title: 'AI Business Plan Generator & Smart Hiring for Small Business | Moil',
    description: 'Generate a complete business plan in minutes. Market research, content calendar, financial projections & smart hiring — all in one AI platform. From $15/month.',
    url: `${baseURL1}/business`,
    images: [
      {
        url: '/hero-business.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil AI Business Growth Platform for Small Business',
      }
    ],
  },
  twitter: {
    title: 'AI Business Plan Generator & Smart Hiring for Small Business | Moil',
    description: 'Generate a complete business plan in minutes. Market research, content calendar, financial projections & smart hiring — all in one AI platform. From $15/month.',
  },
  alternates: {
    canonical: `${baseURL1}/business`,
    languages: {
      'en': `${baseURL1}/business`,
      'es': `${baseURL1}/business?lg=es`,
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
            "screenshot": `${baseURL1}/hero-business.jpg`,
            "offers": {
              "@type": "Offer",
              "price": "15",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "15",
                "priceCurrency": "USD",
                "billingDuration": "P1M",
                "description": "Starting price per month"
              },
              "description": "From $15/month. Free trial available."
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

      {/* FAQ structured data */}
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
                  "text": "Moil is an AI co-founder platform for small businesses. It generates complete business plans, conducts market research (20-30 pages), creates a 30-day content marketing calendar, produces AI images and videos, and manages smart hiring across 10+ job platforms — all in one session starting with 21 strategic questions."
                }
              },
              {
                "@type": "Question",
                "name": "How much does Moil cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil starts at $15/month. A free trial is available. See our pricing page at moilapp.com/business/pricing for full details on all plans and features."
                }
              },
              {
                "@type": "Question",
                "name": "Can Moil generate a business plan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil's AI generates a complete, investor-ready business plan with 5-year financial projections after you answer 21 strategic questions about your business. The entire process takes minutes, not weeks."
                }
              },
              {
                "@type": "Question",
                "name": "Does Moil support Spanish (bilingual)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil fully supports English and Spanish. The platform is designed for bilingual business owners and candidates, making it one of the few AI business platforms with native bilingual support."
                }
              },
              {
                "@type": "Question",
                "name": "How does smart hiring work on Moil?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "With Moil's smart hiring, you post a job once and it automatically distributes to 10+ job platforms. Moil's AI then matches and ranks candidates with 95% accuracy, saving hours of manual screening."
                }
              },
              {
                "@type": "Question",
                "name": "What is Content360?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Content360 is Moil's AI-powered content marketing feature. It generates a complete 30-day content calendar with captions, hashtags, AI images, and AI video — customized to your business's brand and industry."
                }
              },
              {
                "@type": "Question",
                "name": "How is Moil different from hiring a business consultant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Traditional business consultants charge $5,000–$15,000 per engagement and take 2–4 weeks to deliver. Moil delivers market research, a business plan, content strategy, and hiring setup in minutes — for as little as $15/month."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
