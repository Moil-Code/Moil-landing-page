import type { Metadata } from 'next';
import { priceValidUntil } from '../../src/common/seo/offers';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { jsonLd } from '~~/src/common/seo/jsonLd';

export const metadata: Metadata = {
  title: 'Find Trade & Blue-Collar Jobs',
  description: 'Browse local job openings for trades, construction, maintenance & more. Apply in 2 minutes. AI-powered matching finds your best fit. Free for candidates. Powered by Moil.',
  keywords: [
    'AI job search',
    'AI resume builder',
    'find jobs near me',
    'bilingual jobs',
    'job search platform',
    'AI job matching',
    'resume builder free',
    'career opportunities',
    'bilingual job search',
    'employment platform',
    'interview preparation AI',
    'job finder',
    'jobs in Texas',
    'bilingual career platform',
    'AI career coach',
    'job alerts',
    'Spanish English jobs',
    'job marketplace free',
    'voice interview assistant',
    'professional resume AI',
    'skilled trades jobs',
    'service worker jobs',
    'skilled worker jobs near me',
    'trade jobs hiring now'
  ],
  openGraph: {
    title: 'Find Trade & Blue-Collar Jobs | Moil',
    description: 'Browse local job openings for trades, construction, maintenance & more. Apply in 2 minutes. AI-powered matching. Free for candidates.',
    url: `${baseURL1}/candidate`,
    images: [
      {
        url: '/og-candidate.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil AI-Powered Job Search and Career Platform',
      }
    ],
  },
  twitter: {
    title: 'Find Trade & Blue-Collar Jobs | Moil',
    description: 'Browse local job openings for trades, construction, maintenance & more. Apply in 2 minutes. Free for candidates.',
  },
  alternates: {
    canonical: `${baseURL1}/candidate`,
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

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* WebApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Moil Job Search Platform",
            "applicationCategory": "EmploymentApplication",
            "operatingSystem": "Web",
            "description": "AI-powered job search platform for bilingual candidates. AI job matching, resume builder, voice interview assistant, and career coaching — free for candidates.",
            "url": `${baseURL1}/candidate`, 
            "screenshot": `${baseURL1}/og-candidate.jpg`,
            "offers": {
              "@type": "Offer",
              "name": "Moil for job seekers",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `${baseURL1}/candidate`,
              "priceValidUntil": priceValidUntil(),
              "category": "Employment",
              "seller": {
                "@type": "Organization",
                "name": "Moil Enterprise Inc.",
                "url": baseURL1
              },
              "description": "Free for job seekers"
            },
            "featureList": [
              "AI Job Matching",
              "AI Resume Builder",
              "Voice Interview Assistant",
              "Bilingual English & Spanish Support",
              "Job Alerts",
              "Career Coaching",
              "Interview Preparation",
              "Salary Insights"
            ]
          })
        }}
      />

      {/*
        No ItemList of job opportunities.

        This was an ItemList with numberOfItems "10000" and no itemListElement —
        an invalid list (one that lists nothing) whose only real content was a
        count we cannot source. That is the same unsupported-number problem as
        the retired business-count line removed earlier; CLAUDE.md ->
        "Testimonials" rule 4 covers counts, not just ratings.

        If real listings are ever exposed here, emit JobPosting nodes for the
        jobs actually on the page — each with title, description, datePosted,
        hiringOrganization and jobLocation — rather than a bare total.
      */}

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Moil free for job seekers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Moil's job search and career tools are free for candidates. You can search jobs, build your AI resume, use the voice interview assistant, and apply to positions at no cost. Paid plans are for businesses that want to post jobs and access AI growth tools."
                }
              },
              {
                "@type": "Question",
                "name": "How does Moil's AI job matching work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil's AI analyzes your skills, experience, and preferences to match you with the most relevant job opportunities, scoring each opening on skills, experience, location, and language fit."
                }
              },
              {
                "@type": "Question",
                "name": "Does Moil support bilingual job seekers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Moil is one of the few job platforms built for bilingual candidates. The entire platform is available in English and Spanish, and we feature a large number of bilingual job opportunities."
                }
              },
              {
                "@type": "Question",
                "name": "How does the AI resume builder work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil's AI resume builder helps you create a professional, ATS-optimized resume in minutes. Answer a few questions about your experience and the AI generates a polished resume tailored to the jobs you're applying for."
                }
              },
              {
                "@type": "Question",
                "name": "What is the voice interview assistant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Moil's voice interview assistant lets you practice real interview questions using your voice. The AI analyzes your answers and gives real-time feedback to help you improve your interview performance."
                }
              }
            ]
          })
        }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseURL1 },
              { "@type": "ListItem", "position": 2, "name": "For Candidates", "item": `${baseURL1}/candidate` }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
