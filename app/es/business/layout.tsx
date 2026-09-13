import type { Metadata } from 'next';
import '../../business/business.css';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { es } from '../../../src/common/translations/es';
import { faqJsonLd } from '../../../src/common/utils/faqJsonLd';
import { META_ES } from '../../../src/common/seo/pricingCopy';
import { jsonLd } from '~~/src/common/seo/jsonLd';

export const metadata: Metadata = {
  title: {
    absolute: 'El socio que trabaja el negocio contigo | Moil',
  },
  description: META_ES,
  keywords: [
    'calendario de contenidos para redes sociales',
    'contenido para redes sociales negocio pequeno',
    'que publicar en redes sociales para mi negocio',
    'ideas de contenido para negocios pequenos',
    'marketing para pequenos negocios',
    'plan de marketing para mi negocio',
    'programa para redes sociales en espanol',
    'herramientas de IA para pequenos negocios',
    'plan de negocios con IA',
    'investigacion de mercado con IA',
    'software de marketing en espanol',
    'IA para emprendedores latinos',
  ],
  openGraph: {
    title: 'El socio que trabaja el negocio contigo | Moil',
    description: META_ES,
    url: `${baseURL1}/es/business`,
    locale: 'es_US',
    images: [
      {
        url: '/og-business-es.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil — El socio que trabaja el negocio contigo',
      },
    ],
  },
  twitter: {
    title: 'El socio que trabaja el negocio contigo | Moil',
    description: META_ES,
  },
  alternates: {
    canonical: `${baseURL1}/es/business`,
    languages: {
      'en': `${baseURL1}/business`,
      'es': `${baseURL1}/es/business`,
      'x-default': `${baseURL1}/business`,
    },
  },
};

/**
 * Spanish money-page JSON-LD (Phase B): Breadcrumb + FAQPage only.
 * Article removed (redundant with EN money-page slim). Organization/WebSite
 * come from root layout. FAQ matches BusinessFaqSection via es.business.faq.
 */
export default function BusinessEsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseURL1 },
              { '@type': 'ListItem', position: 2, name: 'Para Negocios', item: `${baseURL1}/es/business` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(faqJsonLd(es.business.faq.items)),
        }}
      />
      {children}
    </>
  );
}
