import type { Metadata } from 'next';
import './business.css';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Business Growth Platform | AI-Powered Market Research & Smart Hiring | Moil',
  description: 'Transform your business with Moil\'s AI-powered platform. Get instant market research, generate business plans, and hire top talent. Trusted by 500+ businesses. Start your free trial today.',
  keywords: [
    'business growth platform',
    'AI market research',
    'business planning software',
    'smart hiring tools',
    'startup tools',
    'SMB growth',
    'business automation',
    'market analysis AI',
    'competitor analysis',
    'business intelligence'
  ],
  openGraph: {
    title: 'Business Growth Platform | AI-Powered Market Research & Smart Hiring',
    description: 'Transform your business with AI-powered market research, business planning, and smart hiring tools. Start your free trial today.',
    url: `${baseURL1}/business`,
    images: ['/hero-business.jpg'],
  },
  twitter: {
    title: 'Business Growth Platform | AI-Powered Market Research & Smart Hiring',
    description: 'Transform your business with AI-powered market research, business planning, and smart hiring tools. Start your free trial today.',
  },
  alternates: {
    canonical: `${baseURL1}/business`,
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Business-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Moil Business Growth Platform",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "AI-powered business growth platform with market research, business planning, and smart hiring tools",
            "url": `${baseURL1}/business`,
            "screenshot": `${baseURL1}/hero-business.jpg`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free trial available"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500"
            },
            "featureList": [
              "AI Market Research",
              "Business Plan Generation", 
              "Smart Hiring Tools",
              "Competitor Analysis",
              "Growth Analytics"
            ]
          })
        }}
      />
      {children}
    </>
  );
}
