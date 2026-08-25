import type { Metadata } from 'next';
import '../../business/business.css';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { es } from '../../../src/common/translations/es';
import { faqJsonLd } from '../../../src/common/utils/faqJsonLd';

export const metadata: Metadata = {
  title: {
    absolute: 'Plan para el banco, un mes de posts, o $25 en vez de una agencia de $500 | Moil',
  },
  description: 'Moil escribe un plan que puedes llevar al banco, al SBA o al lease, y — en Market Pro — un mes de posts para Facebook e Instagram que se publican con tu voz. Professional $25 al mes. El mes de posts no está en los $25. Inglés y español.',
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
    title: 'Plan para el banco, un mes de posts, o $25 en vez de una agencia de $500 | Moil',
    description: 'Moil escribe un plan que puedes llevar al banco, al SBA o al lease, y — en Market Pro — un mes de posts para Facebook e Instagram que se publican con tu voz. Professional $25 al mes. El mes de posts no está en los $25. Inglés y español.',
    url: `${baseURL1}/es/business`,
    locale: 'es_US',
    images: [
      {
        url: '/og-business-es.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil — Plan para el banco, un mes de posts, o $25',
      },
    ],
  },
  twitter: {
    title: 'Plan para el banco, un mes de posts, o $25 en vez de una agencia de $500 | Moil',
    description: 'Moil escribe un plan que puedes llevar al banco, al SBA o al lease, y — en Market Pro — un mes de posts para Facebook e Instagram que se publican con tu voz. Professional $25 al mes. El mes de posts no está en los $25. Inglés y español.',
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

export default function BusinessEsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* hreflang pairing — Article + Speakable + Breadcrumb live on the English layout;
          this Spanish surface only needs locale-specific metadata + the alternates above. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseURL1 },
              { '@type': 'ListItem', position: 2, name: 'Para Negocios', item: `${baseURL1}/es/business` },
            ],
          }),
        }}
      />
      {/* Spanish FAQPage, generated from the Spanish translation array so the
          structured data matches what a Spanish visitor actually reads. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(es.business.faq.items)),
        }}
      />
      {children}
    </>
  );
}
