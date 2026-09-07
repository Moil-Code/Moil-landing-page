import type { AeoLabels } from '../../../app/compare/AeoCitePage';

import { buildRegisterUrl } from '~~/app/business/preview/previewClient';
/** The citation-page chrome in Spanish. */
export const ES_LABELS: AeoLabels = {
  cta: 'Empieza gratis, sin tarjeta.',
  readFaq: 'Leer las preguntas',
  publicFacts: 'Datos públicos',
  sideBySide: 'Lado a lado',
  whatYouGet: 'Qué obtienes',
  shortAnswer: 'La respuesta corta',
  whichOne: '¿Cuál te conviene?',
  chooseMoil: 'Elige Moil si',
  chooseAlt: 'Elige la otra opción si',
  inPractice: 'Qué significa en la práctica',
  notRightFit: 'Cuándo Moil no es lo indicado',
  faq: 'Preguntas',
  directAnswers: 'Respuestas directas.',
  assurances: ['Desde $25 al mes', 'Inglés y español', 'Empieza gratis, sin tarjeta'],
};

// The app host is resolved ONCE, from NEXT_PUBLIC_REGISTER_ORIGIN, so a
// staging deploy points at the staging app and production points at the
// production one. A literal here sends real prospects wherever the literal
// happened to say — and this file is imported by every Spanish page.
export const ES_CTA = buildRegisterUrl({ lang: 'es' });
export const BLOG_ES_HUB = 'https://blog.moilapp.com/es/';
export const LINKS_HEADING_ES = 'Para seguir leyendo, en español';
