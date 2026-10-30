import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { esTwinRobots } from '../../../src/common/es/esTwinPages';
import { PartnersBody } from '../../partners/PartnersBody';
import { PARTNER_EN } from '../../partners/partnerContent';
import { PARTNER_ES } from './partnerContentEs';

/**
 * /es/aliados, el gemelo en español de /partners. Mismo cuerpo, mismo esquema.
 * Es un BORRADOR: no se indexa hasta que `reviewed` sea true en esTwinPages.
 */
const PAGE_URL = `${baseURL1}${PARTNER_ES.path}`;
const { meta } = PARTNER_ES;
const reviewed = !esTwinRobots(PARTNER_ES.path);

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: esTwinRobots(PARTNER_ES.path),
  alternates: {
    canonical: PAGE_URL,
    ...(reviewed
      ? { languages: { en: `${baseURL1}${PARTNER_EN.path}`, es: PAGE_URL, 'x-default': `${baseURL1}${PARTNER_EN.path}` } }
      : {}),
  },
  openGraph: {
    title: `${meta.title} | Moil`,
    description: meta.description,
    url: PAGE_URL,
    siteName: meta.siteName,
    type: 'website',
    locale: PARTNER_ES.ogLocale,
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: meta.ogImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${meta.title} | Moil`,
    description: meta.description,
    images: ['/og-home.jpg'],
  },
};

export default function AliadosPage() {
  return <PartnersBody copy={PARTNER_ES} />;
}
