import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../../../compare/AeoCitePage';
import { ENTITY_LINE_ES, faqPageJsonLd, type AeoFaq } from '../../../compare/aeoLocks';
import { jsonLd } from '~~/src/common/seo/jsonLd';
import { pricingCopy } from '../../../../src/common/seo/pricingCopy';
import { esRobots } from '../../../../src/common/es/esPages';
import { BLOG_ES_HUB, ES_CTA, ES_LABELS, LINKS_HEADING_ES } from '../../../../src/common/es/labels';

/** Built for "plan de marketing para mi negocio" (plan 3.4). DRAFT until reviewed. */
const PATH = '/es/plan-de-marketing-para-mi-negocio';
const H1 = 'Plan de marketing para mi negocio: qué debe tener y cómo lo escribe Moil';

const ANSWER =
  'Un plan de marketing para un negocio pequeño responde cuatro preguntas: a quién le vendes, qué te hace distinto, dónde te van a encontrar y qué vas a publicar cada semana. Moil hace la investigación de tu mercado y de tu competencia, escribe el plan y lo convierte en un mes de contenido, en español e inglés.';

const FACTS = [
  'Un consultor cobra entre $5,000 y $15,000 por proyecto por un plan y una investigación de mercado; una agencia, entre $3,000 y $8,000 al mes por producir el contenido.',
  pricingCopy.es.entityPrice,
  'El plan y la investigación salen en Professional; el mes de contenido escrito, en Market Pro.',
];

const FAQS: AeoFaq[] = [
  {
    question: '¿Qué diferencia hay entre un plan de negocios y un plan de marketing?',
    answer:
      'El plan de negocios explica cómo funciona y cómo gana dinero el negocio — lo que pide un banco o un inversionista. El plan de marketing es una parte de él: a quién le vendes, con qué mensaje, por qué canales y con qué presupuesto. Moil escribe los dos a partir de la misma investigación.',
  },
  {
    question: '¿Cuánto cuesta un plan de marketing con una agencia o un consultor?',
    answer:
      'Un consultor de pequeños negocios suele cobrar entre $5,000 y $15,000 por proyecto por el plan y la investigación; una agencia de marketing, entre $3,000 y $8,000 al mes por producir el contenido. Moil produce el plan, la investigación y el mes de contenido por una suscripción mensual, sin la relación ni el criterio humano que una agencia sí aporta.',
  },
  {
    question: '¿Moil hace la investigación de mercado?',
    answer:
      'Sí. Investiga a tus clientes, a tu competencia y la oportunidad local, y usa eso para decidir qué vale la pena publicar y qué debe decir el plan. La investigación cita sus fuentes; cuando no encuentra un dato, lo dice en lugar de inventarlo.',
  },
  {
    question: '¿Puedo llevar el plan al banco?',
    answer:
      'Sí. El plan sale como documento — Word o PDF — con estrategia, proyecciones y los documentos de apoyo, escrito para que lo lea un banco, una EDC o un inversionista. Tú lo revisas y lo ajustas antes de presentarlo.',
  },
  {
    question: '¿Qué pasa después del plan?',
    answer:
      'El plan dice qué publicar; Market Pro lo publica. Moil360 escribe el mes completo — temas, textos con tu voz e imágenes — lo deja listo para que lo revises y lo programa en Facebook e Instagram cuando lo apruebas.',
  },
];

export const metadata: Metadata = {
  title: 'Plan de marketing para mi negocio: qué debe tener | Moil',
  description:
    'Las cuatro preguntas que responde un plan de marketing para un negocio pequeño, qué cobra una agencia o un consultor, y cómo Moil escribe el plan y el mes de contenido, en español e inglés.',
  alternates: { canonical: `${baseURL1}${PATH}` },
  robots: esRobots(PATH),
  openGraph: { title: 'Plan de marketing para mi negocio | Moil', description: 'Qué debe tener, y cómo Moil lo escribe.', url: `${baseURL1}${PATH}`, locale: 'es_US' },
};

export default function PlanDeMarketing() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Plan de marketing"
        h1={H1}
        answer={ANSWER}
        facts={FACTS}
        faqs={FAQS}
        entityLine={ENTITY_LINE_ES}
        labels={ES_LABELS}
        ctaHref={ES_CTA}
        linksHeading={LINKS_HEADING_ES}
        links={[
          { label: 'Guías en español del blog de Moil', href: BLOG_ES_HUB },
          { label: 'Mejor generador de plan de negocios con IA en español (2026)', href: 'https://blog.moilapp.com/article/mejor-generador-de-plan-de-negocios-con-ia-en-espanol-2026' },
          { label: 'Calendario de marketing anual: qué publicar cada mes', href: 'https://blog.moilapp.com/article/marketing-calendar-plan-anual-de-contenido-para-pymes-de-servicios' },
        ]}
      />
    </>
  );
}
