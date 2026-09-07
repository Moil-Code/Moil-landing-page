import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';
import { jsonLd } from '~~/src/common/seo/jsonLd';
import { pricingCopy } from '../../../../src/common/seo/pricingCopy';

export const metadata: Metadata = {
  title: {
    absolute: 'Treinta días de contenido con tu marca | Moil',
  },
  description: pricingCopy.es.metaPricing,
  openGraph: {
    title: 'Treinta días de contenido con tu marca | Moil',
    description: pricingCopy.es.metaPricing,
    url: `${baseURL1}/es/business/pricing`,
    locale: 'es_US',
  },
  twitter: {
    title: 'Treinta días de contenido con tu marca | Moil',
    description: pricingCopy.es.metaPricing,
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
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Treinta días de contenido con tu marca',
            description: pricingCopy.es.heroSub,
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
