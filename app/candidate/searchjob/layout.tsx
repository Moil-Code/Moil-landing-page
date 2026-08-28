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
        url: '/og-candidate.jpg',
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
    // No `languages` block. There used to be one declaring
    // `es -> {url}?lg=es`, but `?lg=es` is not a separate document: it
    // self-canonicalises back to this URL and the server still sends
    // `<html lang="en">` / `Content-Language: en`, because the middleware reads
    // the locale from the path, not the query. Semrush counted that as both a
    // canonical/hreflang conflict and an hreflang language mismatch, and Google
    // discards a cluster whose target canonicalises away. `/es/*` is the real
    // Spanish surface; when a Spanish counterpart of this page exists at
    // `/es/...`, declare the pair here and on that page at the same time.
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
