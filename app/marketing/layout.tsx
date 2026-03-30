import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { content360Styles } from './content360Styles';

export const metadata: Metadata = {
  title: 'Content360 | AI Content Calendar — 30-Day Social Media Plan in Minutes | Moil',
  description: 'Generate a complete 30-day content marketing calendar with AI. Content360 by Moil creates captions, hashtags, AI images, and video ideas for every post — customized to your brand. From $15/month.',
  keywords: [
    'AI content calendar',
    'content marketing calendar tool',
    '30 day content plan',
    'social media content calendar AI',
    'AI social media planner',
    'content marketing automation',
    'AI content generator small business',
    'social media strategy tool',
    'AI Instagram captions',
    'content calendar generator',
    'AI marketing tool small business',
    'automated content calendar',
    'social media scheduling AI',
    'brand content strategy',
    'AI content creation tool'
  ],
  openGraph: {
    title: 'Content360 | AI Content Calendar — 30-Day Social Media Plan in Minutes',
    description: 'Generate a complete 30-day content marketing calendar with AI. Custom captions, hashtags, AI images, and video ideas — done in minutes, not weeks.',
    url: `${baseURL1}/marketing`,
    siteName: 'Moil',
    images: [
      {
        url: '/og_image_v2.png',
        width: 1200,
        height: 630,
        alt: 'Content360 by Moil — AI Content Marketing Calendar',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content360 | AI Content Calendar — 30-Day Social Media Plan in Minutes',
    description: 'Generate a complete 30-day content marketing calendar with AI. Custom captions, hashtags, AI images, and video ideas — done in minutes.',
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
            "description": "AI-powered content marketing calendar generator. Creates a complete 30-day social media plan with captions, hashtags, AI images, and video ideas — customized to your brand.",
            "url": `${baseURL1}/marketing`,
            "offers": {
              "@type": "Offer",
              "price": "15",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "15",
                "priceCurrency": "USD",
                "billingDuration": "P1M"
              },
              "description": "Included in Moil plans from $15/month"
            },
            "featureList": [
              "30-Day Content Marketing Calendar",
              "AI-Generated Captions & Hashtags",
              "AI Image Generation",
              "AI Video Ideas",
              "Brand-Customized Content",
              "Multi-Platform Support",
              "Bilingual English & Spanish Content"
            ]
          })
        }}
      />
      {children}
    </>
  );
}
