import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Find Jobs Fast | AI Resume Builder & Bilingual Job Search | Moil',
  description: 'Find your next job faster with Moil\'s AI job matching. Build a professional resume in minutes, practice interviews with AI, and access thousands of bilingual job opportunities. Free for candidates.',
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
    'professional resume AI'
  ],
  openGraph: {
    title: 'Find Jobs Fast | AI Resume Builder & Bilingual Job Search | Moil',
    description: 'Find your next job faster with AI job matching. Build a resume in minutes, practice interviews, and access thousands of bilingual opportunities. Free for candidates.',
    url: `${baseURL1}/candidate`,
    images: [
      {
        url: '/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Moil AI-Powered Job Search and Career Platform',
      }
    ],
  },
  twitter: {
    title: 'Find Jobs Fast | AI Resume Builder & Bilingual Job Search | Moil',
    description: 'Find your next job faster with AI job matching. Build a resume in minutes, practice interviews, and access thousands of bilingual opportunities. Free for candidates.',
  },
  alternates: {
    canonical: `${baseURL1}/candidate`,
    languages: {
      'en': `${baseURL1}/candidate`,
      'es': `${baseURL1}/candidate?lg=es`,
    },
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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Moil Job Search Platform",
            "applicationCategory": "EmploymentApplication",
            "operatingSystem": "Web",
            "description": "AI-powered job search platform for bilingual candidates. AI job matching, resume builder, voice interview assistant, and career coaching — free for candidates.",
            "url": `${baseURL1}/candidate`,
            "screenshot": `${baseURL1}/og_image.png`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
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

      {/* ItemList structured data for job search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Job Opportunities on Moil",
            "description": "Thousands of job opportunities across industries, with a focus on bilingual (English/Spanish) positions",
            "url": `${baseURL1}/candidate/searchjob`,
            "numberOfItems": "10000"
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
                  "text": "Moil's AI analyzes your skills, experience, and preferences to match you with the most relevant job opportunities. Our AI matching has a 94% interview success rate, helping you land interviews faster."
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
      {children}
    </>
  );
}
