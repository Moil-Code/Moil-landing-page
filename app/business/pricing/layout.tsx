import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Pricing | AI Business Platform Plans Starting at $15/month | Moil',
  description: 'Simple, affordable pricing for Moil\'s AI business platform. Plans starting at $15/month include AI business plan generation, market research, content calendar, and smart hiring. No setup fees. Free trial available.',
  keywords: [
    'AI business platform pricing',
    'business plan software pricing',
    'affordable AI tools small business',
    'small business software cost',
    'AI tools $15 per month',
    'business growth platform plans',
    'SMB software pricing',
    'AI hiring software cost',
    'content calendar tool price',
    'cheap AI business tools'
  ],
  openGraph: {
    title: 'Pricing | AI Business Platform Plans Starting at $15/month | Moil',
    description: 'Affordable AI business tools starting at $15/month. Business plan, market research, content calendar, and smart hiring. Free trial available.',
    url: `${baseURL1}/business/pricing`,
    images: [
      {
        url: '/hero-business.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil Pricing — AI Business Platform Plans',
      }
    ],
  },
  twitter: {
    title: 'Pricing | AI Business Platform Plans Starting at $15/month | Moil',
    description: 'Affordable AI business tools starting at $15/month. Business plan, market research, content calendar, and smart hiring. Free trial available.',
  },
  alternates: {
    canonical: `${baseURL1}/business/pricing`,
  },
};

export default function BusinessPricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Pricing structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Moil Pricing",
            "description": "Pricing plans for Moil's AI business growth platform",
            "url": `${baseURL1}/business/pricing`,
            "breadcrumb": {
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
                  "name": "Business",
                  "item": `${baseURL1}/business`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Pricing",
                  "item": `${baseURL1}/business/pricing`
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}
