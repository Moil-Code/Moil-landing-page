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
 * /es/compare/moil-vs-buffer — the Spanish twin of /compare/moil-vs-buffer
 * (plan 3.5). Same facts, same concessions, same structure; the words are a
 * translation and ship as a DRAFT until a Spanish speaker has reviewed them
 * (src/common/es/esPages.ts). Prices come from pricingCopy / offers, never a
 * literal, so the two languages cannot quote different numbers.
 */
const PATH = '/es/compare/moil-vs-buffer';
const EN_PATH = '/compare/moil-vs-buffer';
const H1 = 'Moil vs Buffer: ¿cuál le conviene a un negocio pequeño?';

const ANSWER =
  'Buffer es una herramienta de programación: tú escribes las publicaciones y Buffer las publica a tiempo, desde unos $5 por canal al mes. Moil escribe las publicaciones y las publica: investiga tu mercado, redacta un mes de textos con tu voz, genera las imágenes, lo organiza en un calendario de 30 días en español e inglés y, cuando tú apruebas, lo publica en tu página de Facebook y en Instagram. ' + pricingCopy.es.entityPrice + ' La diferencia real es la cobertura: Buffer publica en muchas más redes y añade una bandeja de interacción; Moil cubre Facebook e Instagram, pero decide y escribe lo que sale.';

const ROWS: AeoRow[] = [
  { feature: 'Decide de qué publicar', left: 'Investiga tu mercado cada mes', right: 'Tú decides' },
  { feature: 'Escribe los textos', left: 'Un mes completo, con tu voz', right: 'Su asistente de IA te ayuda a reescribir' },
  { feature: 'Crea las imágenes', left: '30 al mes, con tu marca', right: 'Las pones tú' },
  { feature: 'Publica según un calendario', left: 'Facebook, Instagram, TikTok y YouTube, después de que apruebas', right: 'Su fuerte: colas y mejores horas' },
  { feature: 'Redes cubiertas', left: 'Facebook, Instagram, TikTok y YouTube', right: 'La mayoría de las redes' },
  { feature: 'Bandeja de interacción y respuestas', left: 'No la ofrece', right: 'Incluida en planes de pago' },
  { feature: 'Métricas por publicación', left: 'Alcance e interacción, leídos de vuelta', right: 'Incluidas' },
  { feature: 'Elige la hora de publicar', left: 'A partir de tus propios resultados', right: 'Sugerencias de mejor hora' },
  { feature: 'Español además de inglés', left: 'Cada entregable, en los dos idiomas', right: 'Escribes en el idioma que quieras' },
  { feature: 'Plan de negocios e investigación de mercado', left: `Incluidos desde $${PLANS.professional.price}`, right: 'No los ofrece' },
  { feature: 'Precio de entrada', left: `$${PLANS.professional.price} al mes`, right: 'Gratis para 3 canales; ~$5 por canal' },
];

const FAQS: AeoFaq[] = [
  {
    question: '¿Moil reemplaza a Buffer?',
    answer:
      'Para Facebook, Instagram, TikTok y YouTube puede hacerlo, porque Moil programa y publica ahí por sí mismo. Buffer sigue siendo mejor opción si publicas en LinkedIn, X, TikTok o Pinterest, o si quieres una bandeja para responder. La diferencia honesta: Buffer responde a "tengo publicaciones y necesito publicarlas en todos los canales"; Moil responde a "no tengo nada escrito ni tiempo para escribirlo".',
  },
  {
    question: 'Buffer ya tiene un asistente de IA. ¿Es lo mismo?',
    answer:
      'El asistente de Buffer te ayuda a reescribir, acortar o adaptar una publicación que ya empezaste. Trabaja a nivel de un texto. Moil trabaja a nivel de un mes: de qué hablar, en qué orden, con qué imágenes, a partir de investigación sobre tu mercado y no de una instrucción que escribiste.',
  },
  {
    question: '¿Cuál es más barato?',
    answer:
      'Buffer, en precio por canal. Tiene un nivel gratis para tres canales y planes de pago desde unos $5 por canal al mes. ' + pricingCopy.es.entityPrice + ' En realidad no compiten en precio: Buffer cobra por mover contenido que ya tienes, Moil cobra por producirlo. Si escribir el contenido es lo que te quita tiempo, esa es la parte que Moil elimina.',
  },
  {
    question: '¿Moil puede publicar directamente en mis cuentas?',
    answer:
      'Sí, en páginas de Facebook, en Instagram, TikTok y YouTube. Revisas el mes, apruebas lo que quieras y Moil lo programa y lo publica — imagen, video o carrusel — y después lee el alcance y la interacción y usa tus propios resultados para elegir la hora de publicar. LinkedIn, X y TikTok no están conectados, así que ahí tomas la publicación terminada y la subes tú.',
  },
  {
    question: '¿Buffer funciona en español?',
    answer:
      'Buffer publica lo que escribas, en cualquier idioma, pero no produce contenido bilingüe por ti. Moil escribe cada entregable en español e inglés por defecto, lo que importa si tus clientes hablan los dos idiomas y hoy mantienes dos versiones a mano.',
  },
  {
    question: '¿Y si ya tengo una estrategia de contenido?',
    answer:
      'Entonces quizá no necesitas Moil. Su valor está en decidir y redactar. Si ya sabes tu calendario y solo lo ejecutas, un programador más tu propia escritura es una combinación más barata y más ajustada, y preferimos que la conserves.',
  },
];

export const metadata: Metadata = {
  title: 'Moil vs Buffer: ¿cuál es mejor para un negocio pequeño?',
  description:
    'Buffer programa las publicaciones que tú escribes. Moil las escribe: un calendario de 30 días con textos e imágenes, en español e inglés. Comparación completa, con precios y dónde gana Buffer.',
  alternates: { canonical: `${baseURL1}${PATH}`, ...(twinAlternates(baseURL1, EN_PATH) ?? {}) },
  robots: esRobots(PATH),
  openGraph: {
    title: 'Moil vs Buffer | Moil',
    description: 'Buffer programa lo que escribes. Moil lo escribe. Lado a lado, incluyendo dónde gana Buffer.',
    url: `${baseURL1}${PATH}`,
    locale: 'es_US',
  },
};

export default function MoilVsBufferEs() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />
      <AeoCitePage
        eyebrow="Moil vs Buffer"
        h1={H1}
        answer={ANSWER}
        table={{ caption: 'Escribir el mes vs publicarlo.', leftHeader: 'Moil', rightHeader: 'Buffer', rows: ROWS }}
        verdict={{
          moil:
            'El calendario está vacío y va a seguir vacío. Necesitas que alguien decida los temas, escriba los textos y haga las imágenes — y lo quieres en español e inglés sin hacer el trabajo dos veces.',
          them:
            'Ya escribes tu contenido, o alguien de tu equipo lo hace, y el trabajo es moverlo a muchos canales — LinkedIn, X, TikTok, Pinterest — con colas y una bandeja para responder. Para eso está hecho Buffer, por unos dólares por canal.',
        }}
        limitations={[
          'Moil publica en páginas de Facebook, en Instagram, TikTok y YouTube. LinkedIn, X y Pinterest no están conectados; Buffer los cubre.',
          'Moil no tiene bandeja de interacción ni escucha social. Lee el alcance y la interacción de lo que publicó; no te muestra respuestas ni menciones.',
          'Moil cuesta varias veces más que los planes de entrada de Buffer. Si publicar es todo lo que necesitas, es la compra equivocada.',
          'Si tu contenido ya está escrito, la mayor parte de lo que hace Moil es trabajo que ya hiciste.',
        ]}
        faqs={FAQS}
        entityLine={ENTITY_LINE_ES}
        labels={ES_LABELS}
        ctaHref={ES_CTA}
        linksHeading={LINKS_HEADING_ES}
        links={[
          { label: 'Guías en español del blog de Moil', href: BLOG_ES_HUB },
          { label: 'Calendario de contenidos para redes sociales para un negocio pequeño', href: `${baseURL1}/es/calendario-de-contenidos-para-redes-sociales` },
          { label: 'Moil vs Buffer, en inglés', href: `${baseURL1}${EN_PATH}` },
        ]}
      />
    </>
  );
}
