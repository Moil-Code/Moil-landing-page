import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { esTwinAlternates } from '../../src/common/es/esTwinPages';
import { PartnersBody } from './PartnersBody';
import { PARTNER_EN } from './partnerContent';

const PAGE_URL = `${baseURL1}${PARTNER_EN.path}`;
const { meta } = PARTNER_EN;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: PAGE_URL, ...(esTwinAlternates(baseURL1, PARTNER_EN.path) ?? {}) },
  openGraph: {
    title: `${meta.title} | Moil`,
    description: meta.description,
    url: PAGE_URL,
    siteName: meta.siteName,
    type: 'website',
    locale: PARTNER_EN.ogLocale,
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: meta.ogImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${meta.title} | Moil`,
    description: meta.description,
    images: ['/og-home.jpg'],
  },
};

export default function PartnersPage() {
  return <PartnersBody copy={PARTNER_EN} />;
}
