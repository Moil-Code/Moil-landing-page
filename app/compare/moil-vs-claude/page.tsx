import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { ComparisonPage, type ComparisonRow } from '../ComparisonPage';

export const metadata: Metadata = {
  title: 'Moil vs Claude — Which AI Tool is Better for Small Business?',
  description:
    'Compare Moil vs Claude (Anthropic) for small business owners. Moil is purpose-built: market research, business plans, hiring, and content — all in one bilingual platform. Claude is a general AI assistant.',
  alternates: { canonical: `${baseURL1}/compare/moil-vs-claude` },
  openGraph: {
    title: 'Moil vs Claude | Moil',
    description: 'See why Moil beats Claude for small business owners who need an AI co-founder, not a general assistant.',
    url: `${baseURL1}/compare/moil-vs-claude`,
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

export default function MoilVsClaude() {
  return (
    <ComparisonPage
      competitor="Claude"
      competitorCategory="general AI assistant"
      bannerSrc="/compare-claude-v2.png"
      bannerAlt="Moil and Claude visual comparison"
      rows={ROWS}
    />
  );
}
