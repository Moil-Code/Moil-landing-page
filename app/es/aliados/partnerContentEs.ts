/**
 * La página de aliados en español. Misma estructura, mismo esquema y mismas
 * afirmaciones que la versión en inglés (app/partners/partnerContent.ts): las
 * dos se dibujan con PartnersBody, y un campo que falte aquí es un error de tipos.
 *
 * Reglas (las mismas que en inglés):
 *  - Los precios de los planes nunca se escriben aquí; salen de offers.ts y
 *    pricingCopy.ts.
 *  - No se afirma descuento para aliados, reparto de ingresos, panel de
 *    reportes, portal de marca blanca ni cifras de resultados. Ninguna de esas
 *    cosas está documentada en el producto hoy. Los términos se describen como
 *    "se definen por programa", que es verdad.
 *  - BORRADOR: no se indexa hasta que una persona hispanohablante revise el
 *    texto (src/common/es/esTwinPages.ts).
 */

import { PLANS } from '../../../src/common/seo/offers';
import { pricingCopy } from '../../../src/common/seo/pricingCopy';
import type { AeoFaq } from '../../compare/aeoLocks';
import type { PartnerCopy } from '../../partners/partnerCopy';

const SUBJECT = 'Consulta de alianza con Moil';
const PLAN_LINE = pricingCopy.es.split;

const LIST_PRICE_HIGH = Number(PLANS.marketPro.price);
const EXAMPLE_BUSINESSES = 100;
const AGENCY_RANGE = '$3,000 a $8,000';
const TOTAL = `$${(EXAMPLE_BUSINESSES * LIST_PRICE_HIGH).toLocaleString('en-US')}`;

const ANSWER =
  'Moil es un cofundador de IA que hace la investigación, la planificación, los documentos y el contenido de cada negocio de tu programa, en español e inglés. Tu equipo conserva las relaciones y el seguimiento. Moil se encarga del trabajo que no escala.';

const FAQS: AeoFaq[] = [
  {
    question: '¿Qué incluye una alianza con Moil?',
    answer:
      'Una alianza da a los negocios que apoyas acceso a Moil, un cofundador de IA que hace investigación, planes de negocio, documentos y contenido para redes sociales en español e inglés. El acceso puede pasar por una página de registro con tu nombre. Al definir tu programa juntos acordamos quién queda cubierto, con qué plan y por cuánto tiempo.',
  },
  {
    question: '¿Quién puede ser aliado de Moil?',
    answer:
      'Organizaciones que ya están cerca de los dueños de pequeños negocios: corporaciones de desarrollo económico, cámaras de comercio, asociaciones empresariales, juntas de fuerza laboral y organizaciones comunitarias sin fines de lucro. La Cámara de Comercio de Queen Creek, en Arizona, y la Buda Economic Development Corporation, en Texas, son aliados actuales. Si tu organización apoya a dueños locales, una conversación es el primer paso.',
  },
  {
    question: '¿Cómo nos ayuda Moil a atender a más negocios sin contratar más personal?',
    answer:
      'Moil produce el trabajo que normalmente requiere a una persona para redactarlo: investigación de mercado, planes, documentos y contenido de cada negocio. Tu equipo revisa el resultado y da seguimiento a los dueños, en lugar de escribir primeros borradores. Cada negocio adicional suma un costo de software, no un salario. Moil no reemplaza el criterio de tus asesores.',
  },
  {
    question: '¿Cuánto cuesta dar Moil a los negocios que apoyamos?',
    answer: `Los precios de lista son por negocio. ${PLAN_LINE} El precio para aliados se define por programa, según cuántos negocios cubre y qué plan reciben. Cuéntanos el tamaño de tu programa y te daremos una cotización clara.`,
  },
  {
    question: '¿Podemos incluir Moil en un programa de subvenciones, préstamos o incentivos?',
    answer:
      'Sí. Quienes reciban el apoyo pueden recibir también acceso a Moil como parte del paquete, para que el plan por el que fueron financiados se convierta en trabajo terminado: investigación, documentos y contenido. El acceso puede tener límite de tiempo, por ejemplo Market Pro por un periodo definido sobre un plan base. Los términos los acordamos contigo para cada programa.',
  },
  {
    question: '¿Moil funciona en español?',
    answer:
      'Sí. Moil funciona en español e inglés de principio a fin, desde la primera conversación hasta cada documento y publicación que produce. Los dueños que hablan español reciben el mismo servicio que todos los demás, sin traductor y sin un programa aparte que tengas que operar.',
  },
  {
    question: '¿Qué sigue haciendo nuestro personal?',
    answer:
      'Tu equipo conserva todo lo que necesita a una persona: conocer a los dueños, hacer presentaciones, decidir quién necesita más ayuda y responder lo que solo ustedes pueden responder. Moil hace el trabajo de producción. Los dueños revisan lo que Moil prepara, y tu personal puede enfocar el seguimiento en quienes ya tienen trabajo real en las manos.',
  },
  {
    question: '¿Cómo empiezan los dueños?',
    answer:
      'Los dueños empiezan con una conversación sobre su negocio, por voz o por texto. Moil recuerda lo que aprende, así que nunca lo explican dos veces, y a partir de ese perfil empieza a producir investigación, planes, documentos y contenido. Podemos acompañar la incorporación de tu primer grupo para que empiece con trabajo real y no con una pantalla vacía.',
  },
  {
    question: '¿Qué podemos reportar a nuestra junta o a quienes nos financian?',
    answer:
      'Cada dueño tiene su propia cuenta, así que lo que podemos reportar depende de cómo se configure el programa. Dinos qué piden tu junta o tus financiadores cuando definamos el programa, y te diremos con claridad qué podemos entregar y qué no, antes de que te comprometas.',
  },
  {
    question: '¿En qué se diferencia Moil de contratar una agencia o un consultor?',
    answer: `La iguala de una agencia para un pequeño negocio cuesta ${AGENCY_RANGE} al mes e incluye criterio y responsabilidad, algo que Moil no ofrece. Moil produce los entregables por una fracción de ese costo, así que conviene a programas que necesitan resultados para muchos negocios. Nuestra comparación con agencias tiene el desglose completo (en inglés).`,
  },
];

export const PARTNER_ES: PartnerCopy = {
  lang: 'es',
  inLanguage: 'es-US',
  ogLocale: 'es_US',
  path: '/es/aliados',
  meta: {
    title: 'Moil para EDC y cámaras: más dueños, sin contratar',
    description:
      'Da a los pequeños negocios que apoyas investigación, planes, documentos y contenido en español e inglés, sin sumar personal. Para EDC, cámaras y asociaciones.',
    ogImageAlt: 'Moil, el cofundador de IA para dueños de pequeños negocios',
    siteName: 'Moil',
  },
  breadcrumb: { home: 'Inicio', page: 'Aliados' },
  service: {
    name: 'Moil para organizaciones de desarrollo económico y cámaras de comercio',
    serviceType: 'Software de apoyo a pequeños negocios para organizaciones comunitarias',
    audienceType: 'Corporaciones de desarrollo económico, cámaras de comercio, asociaciones empresariales y juntas de fuerza laboral',
  },
  inquirySubject: SUBJECT,
  hero: {
    eyebrow: 'ALIANZAS CON MOIL',
    titleLead: 'Apoya a más pequeños negocios sin ampliar ',
    titleAccent: 'tu equipo.',
    answer: ANSWER,
    cta: 'Iniciar una conversación de alianza',
    secondary: 'Ver cómo funciona',
    proofLead: 'Trabajamos con ',
    proofLink: 'la Cámara de Comercio de Queen Creek y Buda EDC',
  },
  why: {
    eyebrow: 'POR QUÉ LOS ALIADOS USAN MOIL',
    heading: 'Atiende a más negocios sin contratar a más personas.',
    copy: 'Cada negocio que apoyas necesita el mismo tipo de trabajo: investigación, un plan, documentos, contenido de marketing. Hacerlo a mano para cada uno es la razón por la que los programas se quedan del tamaño de su personal.',
    cards: [
      {
        title: 'El trabajo de producción ya está hecho',
        copy: 'Moil conoce cada negocio una sola vez y luego produce la investigación de mercado, el plan, los documentos y el contenido que un asesor tendría que redactar a mano.',
      },
      {
        title: 'El tiempo del personal va a las personas',
        copy: 'Tu equipo sigue hablando con los dueños, haciendo presentaciones y decidiendo quién necesita más ayuda. Deja de ser quien escribe el primer borrador.',
      },
      {
        title: 'Español e inglés desde el inicio',
        copy: 'Todo lo que produce Moil sale en ambos idiomas, así que atender a dueños que hablan español no requiere traductor ni un segundo programa.',
      },
    ],
  },
  gets: {
    eyebrow: 'LO QUE RECIBE CADA NEGOCIO',
    heading: '¿Qué recibe cada negocio de tu programa?',
    lead: 'Cada dueño recibe un cofundador que conoce su negocio. Según el plan, esto incluye:',
    items: [
      'Una conversación sobre el negocio, por voz o por texto, que Moil recuerda. Los dueños nunca lo explican dos veces.',
      'Investigación de su mercado local, sus clientes y su competencia.',
      'Un plan de negocio con proyecciones, del tipo que pide un prestamista.',
      'Documentos en los formatos que los dueños realmente usan: Word, hojas de cálculo y presentaciones.',
      'Materiales de marca y volantes.',
      'Publicaciones para redes con imágenes generadas, escritas con la voz del dueño. Las publicaciones esperan su aprobación antes de salir.',
      'Todo en español e inglés.',
    ],
    planLine: PLAN_LINE,
    pricingHref: '/es/business/pricing',
    pricingLabel: 'Ver planes y precios',
  },
  fit: {
    eyebrow: 'DOS FORMAS DE USARLO',
    heading: '¿Cómo encaja Moil en los programas que ya tienes?',
    copy: 'Úsalo como un recurso que ofreces, como parte de un incentivo que ya das, o ambas cosas. Quién queda cubierto, con qué plan y por cuánto tiempo se define por programa.',
    cases: [
      {
        kicker: 'COMO RECURSO DEL PROGRAMA',
        title: 'Un recurso para tus miembros o clientes',
        copy: 'Da acceso a los dueños con una página de registro que lleva tu nombre y tu logotipo. Ven que Moil viene de ti, y tú decides quién tiene acceso.',
        fits: 'Beneficios para miembros de cámaras · recursos de apoyo de EDC · programas de asociaciones',
      },
      {
        kicker: 'COMO PARTE DE UN INCENTIVO',
        title: 'Parte de un paquete de subvención, préstamo o incentivo',
        copy: 'Incluye Moil en lo que recibe cada beneficiario, para que el plan por el que fue financiado se convierta en trabajo terminado. El acceso puede tener límite de tiempo, por ejemplo Market Pro por un periodo definido sobre un plan base.',
        fits: 'Subvenciones · microcréditos · concursos de planes de negocio · cohortes de aceleradoras',
      },
    ],
    cta: 'Cuéntanos de tu programa',
  },
  steps: {
    eyebrow: 'CÓMO FUNCIONA',
    heading: '¿Cómo es empezar?',
    copy: 'Una conversación corta, un acuerdo claro sobre quién queda cubierto y un primer grupo trabajando con resultados reales.',
    items: [
      ['01', 'Cuéntanos de tu programa', 'A quién apoyas, aproximadamente cuántos negocios y qué quieres cambiar para ellos.'],
      ['02', 'Acordemos cómo funciona el acceso', 'Definimos quién queda cubierto, con qué plan y por cuánto tiempo, y preparamos una página de registro con tu nombre.'],
      ['03', 'Incorpora al primer grupo', 'Los dueños empiezan con una conversación sobre su negocio. Podemos acompañar la incorporación de tu primer grupo para que arranque con trabajo real en las manos.'],
      ['04', 'Da seguimiento donde una persona ayuda más', 'Tu equipo dedica su tiempo a los dueños que ya tienen investigación, planes o contenido y aún necesitan a una persona.'],
    ],
  },
  cost: {
    eyebrow: 'EL CASO DE COSTOS',
    heading: '¿Cómo se compara el costo con hacerlo a mano?',
    lead: 'Las dos cifras son mensuales. Se muestra el precio de lista para dar escala. El precio para aliados se define por programa.',
    agencyLabel: 'Un negocio, con una agencia',
    agencyRange: AGENCY_RANGE,
    agencyNote: 'El rango habitual de una iguala de redes sociales y contenido para un pequeño negocio.',
    moilLabel: `${EXAMPLE_BUSINESSES} negocios, con Moil`,
    moilTotal: TOTAL,
    moilNote: 'A precio de lista en Market Pro, el más alto de los dos planes.',
    noteBefore: 'Una agencia también ofrece criterio y responsabilidad, algo que Moil no ofrece. Lee la ',
    compareHref: '/compare/moil-vs-agency',
    compareLabel: 'comparación completa con una agencia de marketing (en inglés)',
  },
  partners: {
    eyebrow: 'ALIADOS COMUNITARIOS',
    heading: '¿Quiénes ya son aliados de Moil?',
    copy: 'Nuestros aliados comunitarios ya están cerca de los dueños de negocios que dan forma a sus economías locales. Moil ayuda a que el siguiente paso sea más práctico.',
    visitAriaPrefix: 'Visitar',
    visitLabel: 'Visitar la organización',
    cards: [
      {
        kind: 'ALIADO: CÁMARA',
        location: 'Queen Creek, Arizona',
        copy: 'El conector de la comunidad empresarial de Queen Creek, que reúne a las organizaciones locales mediante recursos, representación, apoyo a la fuerza laboral y relaciones valiosas.',
        logoAlt: 'Logotipo de la Cámara de Comercio de Queen Creek',
      },
      {
        kind: 'ALIADO: EDC',
        location: 'Buda, Texas',
        copy: 'La organización de desarrollo económico de Buda, que impulsa un crecimiento bien administrado, el emprendimiento y una comunidad empresarial arraigada en las personas y el lugar.',
        logoAlt: 'Logotipo de la Buda Economic Development Corporation',
      },
    ],
  },
  limits: {
    eyebrow: 'LÍMITES CLAROS',
    heading: '¿Qué no hace Moil?',
    lead: 'Una alianza funciona mejor cuando sabes dónde se detiene Moil.',
    items: [
      'No reemplaza a tus asesores. Moil produce el trabajo. El criterio, las presentaciones y las decisiones de financiamiento siguen en manos de tu gente.',
      'Los dueños controlan lo que se publica. Las publicaciones se preparan para que el dueño las revise; no salen sin él.',
      'No es un sistema de gestión de casos ni de subvenciones para tu propia organización. Trabaja con los negocios que apoyas.',
      'La publicación va a cuentas conectadas de Facebook e Instagram, con TikTok y YouTube elegidos por publicación. No a LinkedIn ni a X.',
    ],
  },
  faq: {
    eyebrow: 'PREGUNTAS DE LOS ALIADOS',
    heading: 'Respuestas directas para líderes de programas.',
    copy: '¿No está aquí? Envíanos la pregunta y la responderemos con claridad.',
    items: FAQS,
  },
  relatedLabel: 'Páginas relacionadas',
  links: [
    { label: 'Planes y precios', href: '/es/business/pricing' },
    { label: 'Moil frente a una agencia de marketing (en inglés)', href: '/compare/moil-vs-agency' },
    { label: 'Moil como alternativa a un consultor (en inglés)', href: '/compare/alternative-to-consultant' },
    { label: 'Qué es Moil y qué no es (en inglés)', href: '/ai-info' },
    { label: 'Acerca de Moil Enterprise Inc. (en inglés)', href: '/about' },
  ],
  final: {
    eyebrow: 'HAGÁMOSLO ÚTIL',
    heading: 'Empieza con los dueños que más quieres ayudar.',
    copy: 'Cuéntanos de tu comunidad, de los negocios que apoyas y del trabajo que siempre se atora. Exploraremos si una alianza con Moil puede hacer ese trabajo más ligero.',
    cta: 'Hablar con Moil',
  },
};
