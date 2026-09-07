import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { HelpPageBody } from '../../src/common/help/HelpPageBody';
import './help.css';

/**
 * /help — the support page assistants cite and the site never had (plan 8.6).
 * Content: src/common/help/helpContent.ts (one list per language, grouped;
 * FAQPage schema is generated from the same list). Twin: /es/ayuda.
 */
export const metadata: Metadata = {
  title: 'Help center — getting started, plans, publishing, billing',
  description: 'Plain answers to what owners ask Moil most: getting started, what Professional and Market Pro include, publishing to your accounts, billing and cancelling, and your data.',
  alternates: {
    canonical: `${baseURL1}/help`,
    languages: { en: `${baseURL1}/help`, es: `${baseURL1}/es/ayuda`, 'x-default': `${baseURL1}/help` },
  },
  openGraph: { title: 'Help center | Moil', description: 'Getting started, plans, publishing, billing and your data — answered plainly.', url: `${baseURL1}/help` },
};

export default function HelpPage() {
  return <HelpPageBody lang="en" />;
}
