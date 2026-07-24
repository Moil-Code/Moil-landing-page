import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { ComparisonPage, type ComparisonRow } from '../ComparisonPage';

export const metadata: Metadata = {
  title: 'Moil vs ChatGPT — Which AI Tool is Better for Small Business?',
  description:
    'Compare Moil vs ChatGPT for small business owners. Moil is purpose-built: market research, business plans, hiring, and content — all in one bilingual platform. ChatGPT is a general chatbot.',
  alternates: { canonical: `${baseURL1}/compare/moil-vs-chatgpt` },
  openGraph: {
    title: 'Moil vs ChatGPT | Moil',
    description: 'See why Moil beats ChatGPT for small business owners who need an AI co-founder, not a chatbot.',
    url: `${baseURL1}/compare/moil-vs-chatgpt`,
  },
};

const ROWS: ComparisonRow[] = [
  { feature: 'Purpose-built for small business', moil: true, competitor: false },
  { feature: 'Investor-ready business plan (PDF)', moil: true, competitor: false },
  { feature: 'Deep market research (8–10 real sources)', moil: true, competitor: false },
  { feature: 'Smart hiring & job matching', moil: true, competitor: false },
  { feature: 'AI content calendar & scheduling', moil: true, competitor: false },
  { feature: 'Bilingual (English & Spanish)', moil: true, competitor: false },
  { feature: '5-year financial projections', moil: true, competitor: false },
  { feature: 'AI image & video creation', moil: true, competitor: false },
  { feature: 'General-purpose chat', moil: false, competitor: true },
  { feature: 'Free plan available', moil: true, competitor: true },
];

export default function MoilVsChatGPT() {
  return (
    <ComparisonPage
      competitor="ChatGPT"
      competitorCategory="general-purpose chatbot"
      bannerSrc="/compare-chatgpt-v2.png"
      bannerAlt="Moil and ChatGPT visual comparison"
      rows={ROWS}
    />
  );
}
