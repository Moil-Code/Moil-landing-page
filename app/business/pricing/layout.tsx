import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { jsonLd } from '~~/src/common/seo/jsonLd';

export const metadata: Metadata = {
  title: {
    absolute: 'Thirty days of content on brand. Research, plans, documents. | Moil',
  },
  description:
    'Market Pro is the AI co-founder: learns once, thinks with you, does the work, and writes the month in English or Spanish. Professional is $25 if you want the research, plan, and documents without the month.',
  keywords: [
    'AI co-founder pricing',
    'Market Pro $75',
    'thirty days of content on brand',
    'small business software cost',
    'content calendar tool price',
  ],
  openGraph: {
    title: 'Thirty days of content on brand. Research, plans, documents. | Moil',
    description:
      'Market Pro is the AI co-founder: learns once, thinks with you, does the work, and writes the month in English or Spanish. Professional is $25 if you want the research, plan, and documents without the month.',
    url: `${baseURL1}/business/pricing`,
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil Pricing — Market Pro thirty days of content on brand',
      }
    ],
  },
  twitter: {
    title: 'Thirty days of content on brand. Research, plans, documents. | Moil',
    description:
      'Market Pro is the AI co-founder: learns once, thinks with you, does the work, and writes the month in English or Spanish. Professional is $25 if you want the research, plan, and documents without the month.',
  },
  alternates: {
    canonical: `${baseURL1}/business/pricing`,
    // The Spanish pricing page declares `en -> /business/pricing`. Without the
    // matching pair here the cluster is non-reciprocal, and Google drops a
    // one-way hreflang cluster entirely rather than half-honouring it.
    languages: {
      en: `${baseURL1}/business/pricing`,
      es: `${baseURL1}/es/business/pricing`,
      'x-default': `${baseURL1}/business/pricing`,
    },
  },
};

export default function BusinessPricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Thirty days of content on brand. Research, plans, documents.",
            "description": "Market Pro is the AI co-founder: learns once, thinks with you, does the work, and writes the month in English or Spanish. Professional is $25 if you want the research, plan, and documents without the month.",
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
