import type { Metadata } from 'next';
import '../../business/business.css';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { es } from '../../../src/common/translations/es';
import { faqJsonLd } from '../../../src/common/utils/faqJsonLd';

export const metadata: Metadata = {
  title: {
    absolute: 'El socio que trabaja el negocio contigo | Moil',
  },
  description: 'Moil aprende el negocio una vez, piensa contigo y hace el trabajo. Investigación, planes, documentos, y treinta días de contenido con tu marca, en inglés o en español. Market Pro es $75. Professional es $25: el mismo co-fundador con un mes más liviano — cuatro posts por semana que apruebas antes de que se publique nada.',
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
    description: 'Moil aprende el negocio una vez, piensa contigo y hace el trabajo. Investigación, planes, documentos, y treinta días de contenido con tu marca, en inglés o en español. Market Pro es $75. Professional es $25: el mismo co-fundador con un mes más liviano — cuatro posts por semana que apruebas antes de que se publique nada.',
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
    description: 'Moil aprende el negocio una vez, piensa contigo y hace el trabajo. Investigación, planes, documentos, y treinta días de contenido con tu marca, en inglés o en español. Market Pro es $75. Professional es $25: el mismo co-fundador con un mes más liviano — cuatro posts por semana que apruebas antes de que se publique nada.',
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
