import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../../../compare/AeoCitePage';
import { ENTITY_LINE_ES, faqPageJsonLd, type AeoFaq } from '../../../compare/aeoLocks';
import { jsonLd } from '~~/src/common/seo/jsonLd';
import { pricingCopy } from '../../../../src/common/seo/pricingCopy';
import { TIER_LIMITS } from '../../../../src/common/seo/tierLimits';
import { esRobots } from '../../../../src/common/es/esPages';
import { BLOG_ES_HUB, ES_CTA, ES_LABELS, LINKS_HEADING_ES } from '../../../../src/common/es/labels';

/**
 * /es/calendario-de-contenidos-para-redes-sociales — built for the query
 * "calendario de contenidos para redes sociales negocio pequeño", where no
 * product holds page one (plan 3.4). Not a translation of /business: a
 * self-contained answer, the real pricing from pricingCopy, a FAQ the schema
 * renders from, and links into the Spanish blog. DRAFT until reviewed
 * (src/common/es/esPages.ts).
 */
const PATH = '/es/calendario-de-contenidos-para-redes-sociales';
const H1 = 'Calendario de contenidos para redes sociales: el mes listo sin escribirlo tú';

const ANSWER =
  'Un calendario de contenidos para redes sociales es el plan de qué publicar cada día del mes: el tema, el texto y la imagen de cada publicación. Moil lo escribe por ti después de aprender tu negocio una vez — investigación, textos con tu voz e imágenes — en español e inglés, y tú apruebas cada publicación antes de que salga.';

const FACTS = [
  pricingCopy.es.entityPrice,
  pricingCopy.es.professionalFeature + '.',
  'En Market Pro, Moil360 escribe el mes completo y lo deja listo para que lo revises; nada se publica sin tu aprobación a menos que tú actives la publicación automática.',
  'Todo sale en español e inglés: el calendario, los textos y las imágenes.',
];

const FAQS: AeoFaq[] = [
  {
    question: '¿Qué debe llevar un calendario de contenidos para un negocio pequeño?',
    answer:
      'Cuatro cosas por publicación: la fecha, el tema, el texto ya escrito y la imagen. Y variedad a lo largo del mes: publicaciones educativas, detrás de cámaras, promociones reales, preguntas a tu comunidad y prueba social. Un calendario que solo dice "publicar el martes" no ahorra trabajo; el trabajo es escribirlo.',
  },
  {
    question: '¿Cada cuánto debo publicar?',
    answer:
      `No hay un número mágico; lo que cuesta es la constancia. Moil produce ${TIER_LIMITS.professional.postsPerWeek} publicaciones a la semana en Professional y ${TIER_LIMITS.marketPro.postsPerWeek} en Market Pro, siempre con imagen, para que la constancia no dependa de que te sobre tiempo.`,
  },
  {
    question: '¿Hay una plantilla gratis de calendario de 30 días?',
    answer:
      'Sí. En el blog de Moil hay una plantilla de calendario de contenido de 30 días para un negocio local, en español, que puedes usar sin cuenta. El calendario escrito por Moil — con textos e imágenes — es parte de Market Pro.',
  },
  {
    question: '¿Moil publica por mí en Facebook e Instagram?',
    answer:
      'Sí. Conectas tus cuentas una vez, revisas lo que Moil escribe y lo que apruebas se programa y se publica en tu página de Facebook y en Instagram. Moil también lee el alcance y la interacción de cada publicación y usa tus propios resultados para elegir la hora de publicar.',
  },
  {
    question: '¿Sirve si mi negocio atiende en español?',
    answer:
      'Sí, de principio a fin. Moil te entrevista en español, investiga tu mercado, escribe el plan y el calendario en español, y también en inglés si tus clientes hablan los dos idiomas — sin que mantengas dos versiones a mano.',
  },
];

export const metadata: Metadata = {
  title: 'Calendario de contenidos para redes sociales para un negocio pequeño | Moil',
  description:
    'Qué es un calendario de contenidos, qué debe llevar y cómo Moil escribe el mes completo por ti — textos con tu voz e imágenes, en español e inglés. ' + pricingCopy.es.entityPrice,
  alternates: { canonical: `${baseURL1}${PATH}` },
  robots: esRobots(PATH),
  openGraph: { title: 'Calendario de contenidos para redes sociales | Moil', description: 'El mes de publicaciones listo sin escribirlo tú.', url: `${baseURL1}${PATH}`, locale: 'es_US' },
};

export default function CalendarioDeContenidos() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Calendario de contenidos"
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
          { label: 'Calendario de contenido de 30 días para un negocio local (plantilla)', href: 'https://blog.moilapp.com/article/calendario-de-contenido-30-dias-redes-sociales-negocio-local' },
          { label: 'Calendario de marketing anual: qué publicar cada mes', href: 'https://blog.moilapp.com/article/marketing-calendar-plan-anual-de-contenido-para-pymes-de-servicios' },
        ]}
      />
    </>
  );
}
