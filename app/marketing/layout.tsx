import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { content360Styles } from './content360Styles';

export const metadata: Metadata = {
  title: 'Content360 by Moil — Your Entire Month of Marketing. Built by AI. | Moil',
  description: 'Stop guessing. Content360 researches your market, writes every post, generates AI images and video, and builds your complete 30-day content calendar automatically. Starts at $15/month.',
  keywords: [
    'AI content calendar',
    'content marketing calendar tool',
    '30 day content plan',
    'social media content calendar AI',
    'AI social media planner',
    'content marketing automation',
    'AI content generator small business',
    'social media strategy tool',
    'AI caption generator',
    'content calendar generator free',
    'AI marketing tool small business',
    'automated content calendar',
    'AI Instagram content strategy',
    'brand content strategy AI',
    'AI content creation tool',
    'content marketing software',
    'social media AI tool',
    'monthly content planner AI',
    'bilingual content calendar',
    'small business social media AI'
  ],
  openGraph: {
    title: 'Content360 by Moil — Your Entire Month of Marketing. Built by AI.',
    description: 'Content360 researches your market, writes every post, generates AI images and video, and builds your complete 30-day content calendar — automatically. From $15/month.',
    url: `${baseURL1}/marketing`,
    siteName: 'Moil',
    images: [
      {
        url: '/og_image_v2.png',
        width: 1200,
        height: 630,
        alt: 'Content360 by Moil — AI Content Marketing Calendar for Small Business',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content360 by Moil — Your Entire Month of Marketing. Built by AI.',
    description: 'Content360 researches your market, writes every post, generates AI images and video, and builds your complete 30-day calendar — automatically. From $15/month.',
    images: ['/og_image_v2.png'],
    creator: '@MoilApp',
    site: '@MoilApp',
  },
  alternates: {
    canonical: `${baseURL1}/marketing`,
  },
};

// Server component — injects CSS in the initial HTML, preventing flash of unstyled content
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: content360Styles }} />

      {/* SoftwareApplication structured data for Content360 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Content360 by Moil",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "AI-powered content marketing calendar generator. Creates a complete 30-day social media plan with captions, hashtags, AI images, and video — customized to your brand. Trusted by 500+ businesses.",
            "url": `${baseURL1}/marketing`,
            "offers": [
              {
                "@type": "Offer",
                "name": "Starter",
                "price": "15",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "15",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M"
                },
                "description": "Full AI toolbox for businesses just getting started. 75 AI images, 3 job postings/month."
              },
              {
                "@type": "Offer",
                "name": "Professional",
                "price": "25",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "25",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M"
                },
                "description": "More capacity for growing businesses. 200 AI images, 10 job postings/month."
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
                  "billingDuration": "P1M"
                },
                "description": "Unlimited power. Full Content360 access. Unlimited job postings, 15 video credits/month."
              }
            ],
            "featureList": [
              "30-Day Content Marketing Calendar",
              "AI-Generated Captions & Hashtags",
              "AI Image Generation (30 custom images/month)",
              "AI Video Generation",
              "Brand DNA System",
              "Recursive Growth Engine (no repeated topics)",
              "Multi-Platform Support",
              "Bilingual English & Spanish Content",
              "6 Content Types (Educational, Promotional, Engagement, BTS, Entertainment)"
            ]
          })
        }}
      />

      {/* HowTo structured data — Content360 6-step process */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Build a 30-Day Content Marketing Calendar with AI",
            "description": "Content360 by Moil turns your business answers into a complete month of social media content — posts, images, video, captions, and strategy — automatically.",
            "totalTime": "PT10M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "15"
            },
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Answer 21 Strategic Questions",
                "text": "Answer 21 questions about your business in 5–10 minutes by voice or text, in English or Spanish. Your AI learns your brand, market, goals, and content gaps."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "AI Conducts Your Market Research",
                "text": "Content360 analyzes your industry, competitors, and audience to identify the exact topics and content types that will resonate with your customers."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Receive Your Investor-Ready Business Plan",
                "text": "Get a complete business plan with 5-year financial projections — ready for investors, banks, or partners."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Get Your 30-Day Content Calendar",
                "text": "30 days of researched topics, tested hooks, full captions by content type, CTAs, hashtags, AI images, and AI video — built for your brand, ready to post."
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Smart Hiring Activates Automatically",
                "text": "Post a job once and reach 10+ platforms. AI matches candidates with 95% accuracy. Average time to hire is 11 days."
              },
              {
                "@type": "HowToStep",
                "position": 6,
                "name": "Your AI Coach Keeps You Growing",
                "text": "Feed last month's results back in. Content360 reads your history, avoids repeated topics, and evolves your content strategy month over month."
              }
            ]
          })
        }}
      />

      {/* FAQ structured data for Content360 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Content360?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Content360 is Moil's AI-powered content marketing engine. It researches your market, writes every post, generates custom AI images and video, and assembles your complete 30-day content calendar — automatically. No agency, no designer, no guesswork."
                }
              },
              {
                "@type": "Question",
                "name": "How much does Content360 cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Content360 is included in Moil's plans starting at $15/month (Starter), $25/month (Professional), and $75/month (Market Pro with full Content360 access). All plans include a 30-day money-back guarantee. No setup fees."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to generate a 30-day content calendar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "After answering 21 questions (5–10 minutes), Content360 generates your complete 30-day content calendar automatically. The entire process from onboarding to ready-to-post content takes under 30 minutes."
                }
              },
              {
                "@type": "Question",
                "name": "Does Content360 support Spanish (bilingual content)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every post, caption, and strategy is available in English and Spanish with one click. Content360 is built for bilingual businesses and reaches 58% more bilingual customers than competitors."
                }
              },
              {
                "@type": "Question",
                "name": "What types of content does Content360 create?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Content360 generates 6 types of content: Educational, Promotional, Engagement, Behind-the-Scenes, and Entertainment posts. Each comes with researched topics, optimized hooks, full captions, CTAs, hashtags, AI-generated images, and AI video for your highest-impact days."
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
