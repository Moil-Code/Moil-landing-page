import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Search Jobs — Bilingual Job Opportunities Near You',
  description: 'Search thousands of job opportunities with Moil\'s AI-powered job search. Filter by location, industry, and language. Find bilingual jobs (English/Spanish) and apply in minutes. Free for candidates.',
  keywords: [
    'search jobs',
    'job search',
    'bilingual jobs near me',
    'find jobs',
    'job openings near me',
    'jobs in Texas',
    'English Spanish jobs',
    'bilingual job openings',
    'AI job search platform',
    'job search free',
    'jobs hiring now',
    'full time jobs',
    'part time jobs bilingual',
    'remote jobs bilingual',
    'job board'
  ],
  openGraph: {
    title: 'Search Jobs — Bilingual Job Opportunities Near You',
    description: 'Search thousands of bilingual job opportunities. AI-powered matching connects you with the right employer. Free for candidates.',
    url: `${baseURL1}/candidate/searchjob`,
    images: [
      {
        url: '/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Moil Job Search — Find Bilingual Job Opportunities',
      }
    ],
  },
  twitter: {
    title: 'Search Jobs — Bilingual Job Opportunities Near You',
    description: 'Search thousands of bilingual job opportunities with AI matching. Free for candidates.',
  },
  alternates: {
    canonical: `${baseURL1}/candidate/searchjob`,
  },
};

export default function SearchJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Job Search — Moil",
            "description": "Search thousands of bilingual job opportunities on Moil",
            "url": `${baseURL1}/candidate/searchjob`,
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
                  "name": "Candidates",
                  "item": `${baseURL1}/candidate`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Search Jobs",
                  "item": `${baseURL1}/candidate/searchjob`
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
