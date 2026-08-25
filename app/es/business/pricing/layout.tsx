import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: {
    absolute: '$25 para que aprenda el negocio. $75 para el mes de posts que se publica. | Moil',
  },
  description:
    'Professional $25: investigación, plan, coaching, documentos — así se arma la cabeza. No incluye el mes de posts. Market Pro $75: el mes de posts, con tu voz, publicado en Facebook e Instagram.',
  openGraph: {
    title: '$25 para que aprenda el negocio. $75 para el mes de posts que se publica. | Moil',
    description:
      'Professional $25: investigación, plan, coaching, documentos — así se arma la cabeza. No incluye el mes de posts. Market Pro $75: el mes de posts, con tu voz, publicado en Facebook e Instagram.',
    url: `${baseURL1}/es/business/pricing`,
    locale: 'es_US',
  },
  twitter: {
    title: '$25 para que aprenda el negocio. $75 para el mes de posts que se publica. | Moil',
    description:
      'Professional $25: investigación, plan, coaching, documentos — así se arma la cabeza. No incluye el mes de posts. Market Pro $75: el mes de posts, con tu voz, publicado en Facebook e Instagram.',
  },
  alternates: {
    canonical: `${baseURL1}/es/business/pricing`,
    languages: {
      en: `${baseURL1}/business/pricing`,
      es: `${baseURL1}/es/business/pricing`,
      'x-default': `${baseURL1}/business/pricing`,
    },
  },
};

export default function BusinessPricingEsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '$25 para que aprenda el negocio. $75 para el mes de posts que se publica.',
            description:
              'Professional $25: investigación, plan, coaching, documentos — así se arma la cabeza. No incluye el mes de posts. Market Pro $75: el mes de posts, con tu voz, publicado en Facebook e Instagram.',
            url: `${baseURL1}/es/business/pricing`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseURL1 },
                { '@type': 'ListItem', position: 2, name: 'Para Negocios', item: `${baseURL1}/es/business` },
                { '@type': 'ListItem', position: 3, name: 'Precios', item: `${baseURL1}/es/business/pricing` },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
