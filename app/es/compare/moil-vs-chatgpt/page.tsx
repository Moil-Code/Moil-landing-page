import type { Metadata } from 'next';
import { baseURL1 } from '../../../../src/common/constants/baseUrl';
import { AeoCitePage } from '../../../compare/AeoCitePage';
import { ENTITY_LINE_ES, faqPageJsonLd, type AeoFaq, type AeoRow } from '../../../compare/aeoLocks';
import { jsonLd } from '~~/src/common/seo/jsonLd';
import { pricingCopy } from '../../../../src/common/seo/pricingCopy';
import { PLANS } from '../../../../src/common/seo/offers';
import { esRobots, twinAlternates } from '../../../../src/common/es/esPages';
import { BLOG_ES_HUB, ES_CTA, ES_LABELS, LINKS_HEADING_ES } from '../../../../src/common/es/labels';

/**
 * /es/compare/moil-vs-chatgpt — the Spanish twin of /compare/moil-vs-chatgpt
 * (plan 3.5). It keeps the English page's narrow, defensible axis: ChatGPT
 * remembers facts about you; Moil holds structured business context and turns
 * it into finished, scheduled deliverables. DRAFT until reviewed
 * (src/common/es/esPages.ts).
 */
const PATH = '/es/compare/moil-vs-chatgpt';
const EN_PATH = '/compare/moil-vs-chatgpt';
const H1 = '¿En qué se diferencia Moil de ChatGPT?';

const ANSWER =
  'ChatGPT es un asistente general que ahora recuerda datos sobre ti entre conversaciones, pero tú sigues pidiéndole cada pieza de trabajo y armando el resultado. Moil es una plataforma de marketing para negocios pequeños: guarda contexto estructurado sobre tu oferta, tus clientes y tu voz, y lo convierte en un calendario de contenido de 30 días terminado que se renueva cada mes. ChatGPT responde lo que le preguntas. Moil produce el mes, se lo pidas o no.';

const FACTS = [pricingCopy.es.entityPrice];

const ROWS: AeoRow[] = [
  { feature: 'Te recuerda entre sesiones', left: 'Sí: un perfil de negocio estructurado', right: 'Sí: datos y preferencias guardados' },
  { feature: 'Produce trabajo sin que se lo pidas', left: 'Calendario mensual, automático', right: 'No: tú lo pides cada vez' },
  { feature: 'Un calendario de 30 días terminado', left: 'Moil360, organizado día por día', right: 'Lo armarías y mantendrías tú' },
  { feature: 'Imágenes para cada publicación', left: '30 al mes, con tu marca', right: 'Una instrucción a la vez' },
  { feature: 'Investigación de mercado sobre tu competencia', left: 'Incluida y actualizada', right: 'Si la pides, y tú la verificas' },
  { feature: 'Una voz constante durante el mes', left: 'Se aprende una vez y se aplica a todo', right: 'Depende de cómo le escribas' },
  { feature: 'Razonamiento abierto y programación', left: 'No es para eso', right: 'Mucho más fuerte' },
  { feature: 'Precio', left: `$${PLANS.professional.price}–$${PLANS.marketPro.price} al mes`, right: 'Nivel gratis; $20 al mes por Plus' },
];

const FAQS: AeoFaq[] = [
  {
    question: '¿ChatGPT puede escribir mi contenido para redes sociales?',
    answer:
      'Escribe bien publicaciones sueltas. La brecha es el mes: decidir de qué publicar, mantener una voz constante en 30 piezas, hacer las imágenes y repetirlo en cuatro semanas. Ese trabajo de instrucciones y ensamblaje es tuyo con ChatGPT, y es la parte que Moil automatiza.',
  },
  {
    question: 'ChatGPT ya tiene memoria. ¿Eso cierra la brecha?',
    answer:
      'En parte. ChatGPT recuerda datos que mencionaste, y eso ayuda. Pero los guarda como recuerdos sueltos y sigue esperando a que le pidas. Moil mantiene un perfil de negocio estructurado — oferta, clientes, voz, mercado — y lo usa para generar entregables con calendario sin que lo vuelvas a explicar.',
  },
  {
    question: '¿Moil es solo ChatGPT con otra cara?',
    answer:
      'Moil usa modelos de lenguaje, como casi todos los productos con IA. Lo que añade es lo que un chatbot general no tiene: un perfil de negocio persistente, investigación de mercado de tu zona, la estructura de un calendario, una imagen por publicación y salida bilingüe — ensamblado como un entregable mensual y no como un historial de chat.',
  },
  {
    question: '¿Cuándo es ChatGPT la mejor opción?',
    answer:
      'Cuando el trabajo es abierto. Pensar una decisión, redactar un correo difícil, escribir código, analizar una hoja de cálculo o investigar algo ajeno a tu marketing: ChatGPT es más amplio y más barato, y Moil no intenta competir ahí.',
  },
  {
    question: '¿Moil funciona en español como ChatGPT?',
    answer:
      'Los dos manejan español. La diferencia es que Moil produce cada entregable en los dos idiomas por defecto — el calendario, los textos, el plan y la investigación — en vez de traducir a petición, para que un dueño bilingüe no mantenga dos flujos de trabajo.',
  },
  {
    question: '¿Puedo usar los dos?',
    answer:
      'La mayoría de los dueños lo hace. Moil se encarga del trabajo de marketing recurrente que tiene que salir cada mes; ChatGPT sigue siendo útil para todo lo demás. No son sustitutos, y por eso la comparación suele reducirse a qué quieres dejar de hacer a mano.',
  },
];

export const metadata: Metadata = {
  title: 'Moil vs ChatGPT para el marketing de un negocio pequeño',
  description:
    'ChatGPT responde lo que le preguntas. Moil guarda el contexto de tu negocio y produce un calendario de contenido de 30 días terminado cada mes, en español e inglés. Una comparación honesta, con dónde gana ChatGPT.',
  alternates: { canonical: `${baseURL1}${PATH}`, ...(twinAlternates(baseURL1, EN_PATH) ?? {}) },
  robots: esRobots(PATH),
  openGraph: {
    title: 'Moil vs ChatGPT | Moil',
    description: 'ChatGPT responde lo que le preguntas. Moil produce el mes. Dónde gana cada uno, lado a lado.',
    url: `${baseURL1}${PATH}`,
    locale: 'es_US',
  },
};

export default function MoilVsChatGPTEs() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Moil vs ChatGPT"
        h1={H1}
        answer={ANSWER}
        facts={FACTS}
        table={{ caption: 'Un asistente general vs una plataforma de marketing.', leftHeader: 'Moil', rightHeader: 'ChatGPT', rows: ROWS }}
        verdict={{
          moil:
            'Tu marketing tiene que salir cada mes y nadie en el negocio se hace cargo. Quieres el calendario escrito, con imágenes y listo para revisar, en vez de pedirlo pieza por pieza — y lo necesitas en español e inglés.',
          them:
            'Quieres un asistente de uso general para trabajo abierto: pensar, escribir, programar, analizar. ChatGPT es más amplio, cuesta menos y no requiere configurar el contexto de un negocio. No intenta entregarte un mes terminado, y no puede publicarlo.',
        }}
        bulletsHeading="Cómo se ve la diferencia en un mes normal"
        bullets={[
          'Con ChatGPT tú decides los temas. Con Moil los temas salen de investigación sobre tu mercado y tu competencia.',
          'Con ChatGPT mantienes la voz constante explicándola otra vez. Moil la aprende una vez y la aplica a las 30 publicaciones.',
          'Con ChatGPT el mes termina y nada empieza el siguiente. Moil redacta el mes siguiente desde el mismo perfil.',
          'La salida bilingüe es una petición en ChatGPT y un valor por defecto en Moil.',
        ]}
        limitations={[
          'Moil es estrecho. Para cualquier cosa fuera de dirigir y promocionar un negocio pequeño, un asistente general es la mejor herramienta.',
          'Moil no escribe código, no analiza hojas de cálculo ni razona sobre problemas arbitrarios.',
          'ChatGPT es más barato: gratis, o $20 al mes por Plus. Moil tiene que valer la diferencia en horas ahorradas, no en precio.',
          'Si disfrutas escribir tu propio contenido y solo quieres ayuda para pulirlo, Moil es más producto del que necesitas.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE_ES}
        labels={ES_LABELS}
        ctaHref={ES_CTA}
        linksHeading={LINKS_HEADING_ES}
        links={[
          { label: 'Guías en español del blog de Moil', href: BLOG_ES_HUB },
          { label: 'Plan de marketing para mi negocio: qué lleva y cómo se escribe', href: `${baseURL1}/es/plan-de-marketing-para-mi-negocio` },
          { label: 'Moil vs ChatGPT, en inglés', href: `${baseURL1}${EN_PATH}` },
        ]}
      />
    </>
  );
}
