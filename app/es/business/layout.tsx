import type { Metadata } from 'next';
import '../../business/business.css';
import { baseURL1 } from '../../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Co-fundador con IA para pequeños negocios — plan, contratación y marketing',
  description: 'Moil le da a los pequeños negocios un co-fundador con IA que redacta tu plan de negocios, dirige tu marketing y contrata a tu equipo. 500+ negocios creciendo. Prueba gratis. Desde $25/mes.',
  keywords: [
    'co-fundador IA pequeños negocios',
    'plan de negocios con IA',
    'herramientas IA para pequeños negocios',
    'plataforma de crecimiento para PYMEs',
    'investigación de mercado con IA',
    'software para planes de negocio',
    'contratación inteligente con IA',
    'reclutamiento con IA pequeñas empresas',
    'calendario de contenido con IA',
    'IA bilingüe para negocios',
    'IA para emprendedores latinos',
    'plataforma SMB en español',
    'plan de negocios listo para inversionistas',
    'herramientas IA negocios de servicios',
  ],
  openGraph: {
    title: 'Co-fundador con IA para pequeños negocios — plan, contratación y marketing',
    description: 'Plan de negocios, contratación, marketing de contenido y coaching con IA — todo en una plataforma. 500+ pequeños negocios creciendo. Desde $25/mes.',
    url: `${baseURL1}/es/business`,
    locale: 'es_US',
    images: [
      {
        url: '/og-business-es.jpg',
        width: 1200,
        height: 630,
        alt: 'Moil — Co-fundador con IA para pequeños negocios',
      },
    ],
  },
  twitter: {
    title: 'Co-fundador con IA para pequeños negocios',
    description: 'Plan de negocios, contratación, marketing de contenido y coaching con IA — todo en una plataforma. Desde $25/mes.',
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
      {children}
    </>
  );
}
