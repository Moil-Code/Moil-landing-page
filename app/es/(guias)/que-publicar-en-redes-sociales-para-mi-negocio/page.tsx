import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../../../compare/AeoCitePage';
import { ENTITY_LINE_ES, faqPageJsonLd, type AeoFaq } from '../../../compare/aeoLocks';
import { jsonLd } from '~~/src/common/seo/jsonLd';
import { pricingCopy } from '../../../../src/common/seo/pricingCopy';
import { esRobots } from '../../../../src/common/es/esPages';
import { BLOG_ES_HUB, ES_CTA, ES_LABELS, LINKS_HEADING_ES } from '../../../../src/common/es/labels';

/** Built for "qué publicar en redes sociales para mi negocio" (plan 3.4). DRAFT until reviewed. */
const PATH = '/es/que-publicar-en-redes-sociales-para-mi-negocio';
const H1 = 'Qué publicar en redes sociales para mi negocio: ideas que salen de tu propio negocio';

const ANSWER =
  'Publica lo que tu negocio ya tiene: tus productos y ofertas reales, lo que pasa detrás del mostrador, las respuestas a lo que te preguntan los clientes y lo que cambia con la temporada. Moil investiga tu mercado, parte de tus propios datos y escribe el mes con esa base — no con plantillas genéricas — en español e inglés.';

const FACTS = [
  'Los temas salen de tu negocio: lo que vendes, tus ofertas vigentes, tus eventos y tu temporada. Moil no inventa productos ni precios que no le hayas dado.',
  'Tus propias fotos van primero: Moil las coloca a lo largo del mes y solo genera una imagen cuando no hay una tuya que sirva.',
  pricingCopy.es.entityPrice,
];

const FAQS: AeoFaq[] = [
  {
    question: '¿Qué tipos de publicación funcionan para un negocio local?',
    answer:
      'Cinco, alternados: educativas (cómo hacer algo que tu cliente quiere hacer), detrás de cámaras (tu equipo, tu proceso, tu local), promociones con una oferta real, participación (una pregunta directa a tu comunidad) y prueba social (lo que dicen tus clientes, con sus palabras). Un mes hecho solo de promociones se lee como un anuncio permanente.',
  },
  {
    question: '¿Necesito fotos profesionales?',
    answer:
      'No. Una foto real de tu local, tu producto o tu equipo, tomada con el teléfono, casi siempre funciona mejor que una imagen genérica. Moil guarda tus fotos en una biblioteca y las usa en el mes; cuando no hay una tuya que sirva, genera una imagen con tu marca.',
  },
  {
    question: '¿Cuántos hashtags debo usar?',
    answer:
      'Pocos. Moil usa cinco como máximo por publicación y pone las palabras clave en el texto, que es donde la gente y los buscadores las leen. Una pared de hashtags no ayuda a que te encuentren.',
  },
  {
    question: '¿Cómo sé si lo que publiqué funcionó?',
    answer:
      'Moil lee el alcance y la interacción de cada publicación que salió por Facebook o Instagram y te lo muestra por tipo de publicación, para que veas qué le responde tu público. Con suficientes datos, también usa tus propios resultados para elegir la hora de publicar.',
  },
  {
    question: '¿Puedo decirle a Moil de qué quiero hablar?',
    answer:
      'Sí. Antes de escribir el mes, Moil te ofrece temas armados con tus productos, tus ofertas y tu temporada para que elijas; y siempre puedes darle una instrucción fija, como "menos formal" o "más de mi equipo", que aplica a todo lo que escribe después.',
  },
];

export const metadata: Metadata = {
  title: 'Qué publicar en redes sociales para mi negocio | Moil',
  description:
    'Ideas para publicar que salen de tu propio negocio — productos, detrás de cámaras, preguntas de clientes, temporada — y cómo Moil escribe el mes con esa base, en español e inglés.',
  alternates: { canonical: `${baseURL1}${PATH}` },
  robots: esRobots(PATH),
  openGraph: { title: 'Qué publicar en redes sociales para mi negocio | Moil', description: 'Ideas que salen de tu propio negocio, escritas por Moil.', url: `${baseURL1}${PATH}`, locale: 'es_US' },
};

export default function QuePublicar() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Qué publicar"
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
          { label: 'Calendario de contenido de 30 días para un negocio local', href: 'https://blog.moilapp.com/article/calendario-de-contenido-30-dias-redes-sociales-negocio-local' },
          { label: 'Gestión de reseñas online: clave para negocios locales', href: 'https://blog.moilapp.com/article/gesti-n-de-rese-as-online-clave-para-negocios-locales' },
          { label: 'Video marketing con IA: más clientes para servicios locales', href: 'https://blog.moilapp.com/article/video-marketing-con-ia-m-s-clientes-para-servicios-locales' },
        ]}
      />
    </>
  );
}
