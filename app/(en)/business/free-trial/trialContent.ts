/**
 * Moil360 free-trial landing page: every word and every switch, in one file.
 *
 * Source: "Moil360 Free Trial Landing Page: Developer Brief" (Ablad,
 * 2026-10-27). English copy is the brief's final draft; Spanish copy uses the
 * brief's table where it gives one and is a DRAFT elsewhere, pending the
 * native-speaker review the brief requires before launch.
 *
 * Rules the brief sets, and how this file keeps them:
 *   - Only the trial terms are confirmed (30 days free, no credit card, a paid
 *     plan after 30 days). Every PRODUCT claim carries a `claim` id and stays
 *     hidden until it is signed off in CLAIMS_SIGNED_OFF by Andres or Jacobi.
 *     A reviewer can preview them with `?review=claims`, badged as unsigned.
 *   - No statistics, user counts, logos, testimonials, ratings or press. The
 *     proof block stays `null` until a real, approved quote exists.
 *   - No plan names or prices on this page.
 *   - No em dashes in any copy (evals/freeTrialPage.test.js scans for them).
 *   - Scarcity is `none` until Ablad supplies a real end date with a time
 *     zone; see TRIAL_CONFIG.scarcity.
 */
import type { ScarcityConfig } from './trialFunnel';

export type TrialLang = 'en' | 'es';

/** Flagged product claims. Flip one to true only with a named sign-off. */
export const CLAIMS_SIGNED_OFF: Record<string, boolean> = {
  imagesAutoPosting: false,
  brandedContent: false,
  multiPlatformCaptions: false,
  trendResearch: false,
  noPrompting: false,
  // Named platforms (Instagram, Facebook) on sample posts. The example tiles
  // name no platform until this is confirmed.
  namedPlatforms: false,
  // Connecting Instagram and Facebook and publishing to them from Moil360.
  // Added 2026-11-09 after the brief (it was left out of the hand-off). The
  // whole "Post straight to Instagram and Facebook" section hides until this
  // is signed off; it names the platforms, so it signs off namedPlatforms for
  // that section too.
  socialPublishing: false,
};

export const TRIAL_CONFIG: {
  scarcity: ScarcityConfig & { timeZone: string };
  indexable: boolean;
} = {
  // 'deadline' needs endsAt as an ISO date-time WITH an offset, for example
  // '2026-12-01T23:59:00-06:00'. Without one the page falls back to 'none'.
  scarcity: { mode: 'none', endsAt: null, timeZone: 'America/Chicago' },
  // Staging must stay noindex; indexing after launch is Ablad's call.
  indexable: false,
};

export const TRIAL_PATHS: Record<TrialLang, string> = {
  en: '/business/free-trial',
  es: '/es/business/prueba-gratis',
};

export type TrialRow = { title: string; body: string; claim?: string };
export type TrialFaq = { q: string; a: string; claim?: string };
/**
 * `chip` is the one-word label on the hero calendar tile. `image` is a finished
 * post shown in the hero's side cards (public/business/free-trial/).
 */
export type ExamplePost = { day: number; kind: string; chip: string; headline: string; tone: 'bts' | 'edu' | 'eng' | 'promo'; image?: string };

export type TrialCopy = {
  lang: TrialLang;
  meta: { title: string; description: string; ogLocale: string };
  cta: string;
  trialNote: string;
  hero: { eyebrow: string; h1: string; sub: string; hook: string };
  scarcity: {
    trueUrgency: string;
    deadline: string;
    closed: string;
    countdownLabel: string;
    units: { days: string; hours: string; minutes: string; seconds: string };
  };
  phone: { title: string; locked: string; dayLabel: string };
  pain: { h2: string; body: string };
  solution: { h2: string; body: string };
  features: { h2: string; rows: TrialRow[] };
  /** Connect and post to Instagram and Facebook. Gated as a whole by `claim`. */
  social: {
    claim: string;
    h2: string;
    body: string;
    points: TrialRow[];
    visual: { accounts: string; connected: string; ready: string; postNow: string; postingTo: string };
  };
  how: { h2: string; steps: TrialRow[] };
  peek: {
    h2: string;
    unlock: string;
    exampleLabel: string;
    lockedAria: string;
    examples: ExamplePost[];
  };
  offer: { h2: string; body: string };
  faq: { h2: string; items: TrialFaq[] };
  final: { h2: string; sub: string };
  review: { badge: string };
  /** Short section labels in the /business style (the orange mono tag above each headline). */
  tags: { pain: string; solution: string; features: string; social: string; how: string; peek: string; offer: string; faq: string };
  /** Trial terms repeated beside the final button. Confirmed terms only. */
  trust: string[];
};

export const TRIAL_EN: TrialCopy = {
  lang: 'en',
  meta: {
    title: '30 days of content. Free. | Moil360',
    description:
      'Answer a few questions about your business. Moil360 plans and designs a month of posts for you. 30 days free, no credit card needed.',
    ogLocale: 'en_US',
  },
  cta: 'Claim my 30 free days',
  trialNote: 'No credit card needed. After 30 days, you choose a plan to keep going.',
  hero: {
    eyebrow: 'Moil360 content studio',
    h1: '30 days of content. Free.',
    sub: 'Answer a few questions about your business. Moil360 plans and designs a month of posts for you.',
    hook: 'Want to see what a month of posts for your business could look like?',
  },
  scarcity: {
    trueUrgency: 'Your 30 days start the day you sign up.',
    deadline: 'The free 30-day offer ends {date}.',
    closed: 'The free 30-day offer has ended.',
    countdownLabel: 'Time left',
    units: { days: 'd', hours: 'h', minutes: 'm', seconds: 's' },
  },
  phone: { title: 'Your month', locked: 'Locked', dayLabel: 'Day' },
  pain: {
    h2: 'Posting every day is a second job.',
    body:
      'Coming up with ideas. Making images. Writing captions for every platform. It is easy to start strong and go quiet when the work piles up, and every quiet week is a week your customers do not hear from you.',
  },
  solution: {
    h2: 'Moil360 plans the month for you.',
    body: 'Tell it about your business once. It maps out 30 days of posts, with images and captions ready for you to review.',
  },
  features: {
    h2: 'What you get',
    rows: [
      { title: 'Images and auto posting.', body: 'Ready-made images for your posts, with auto posting.', claim: 'imagesAutoPosting' },
      { title: 'Content with your brand.', body: 'Posts that carry your colors and the look of your business.', claim: 'brandedContent' },
      { title: 'Captions for every platform.', body: 'One idea, written the way each platform needs it.', claim: 'multiPlatformCaptions' },
      { title: 'Ideas based on trends.', body: 'Post ideas shaped by what is current in your market.', claim: 'trendResearch' },
      { title: 'No prompts to write.', body: 'You answer a few questions. Moil360 does the rest.', claim: 'noPrompting' },
    ],
  },
  social: {
    claim: 'socialPublishing',
    h2: 'Post straight to Instagram and Facebook.',
    body: 'Connect your accounts once. When a post is ready, publish it from Moil360. No downloading images, no copying captions, no switching apps.',
    points: [
      { title: 'Connect in a few clicks.', body: 'Link your Instagram and Facebook accounts from inside Moil360.', claim: 'socialPublishing' },
      { title: 'Publish from one place.', body: 'Your post, image and caption go out from Moil360, just as you approved them.', claim: 'socialPublishing' },
      { title: 'Both feeds, one step.', body: 'Send the same post to Instagram and Facebook together.', claim: 'socialPublishing' },
    ],
    visual: { accounts: 'Connected accounts', connected: 'Connected', ready: 'Ready to post', postNow: 'Post now', postingTo: 'Posting to' },
  },
  how: {
    h2: 'How it works',
    steps: [
      { title: 'Tell Moil about your business.', body: 'A few questions about what you sell and who you serve.' },
      { title: 'Get your 30-day plan.', body: 'A full month of posts with images and captions.' },
      { title: 'Review and post.', body: 'Look it over, make it yours, publish.' },
    ],
  },
  peek: {
    h2: 'What is on day 12?',
    unlock: 'Days 4 to 30 unlock when you start free.',
    exampleLabel: 'Example',
    lockedAria: 'Day {n} is locked. Start free to unlock it.',
    // Days 1 and 2 match the two finished posts in the hero's side cards (their
    // headlines are the posts' own). Day 1 is a client's post (Nativa
    // Aesthetics): it needs their sign-off before paid traffic. Day 3 is still
    // a placeholder for a sample cleaning service.
    examples: [
      { day: 1, image: '/business/free-trial/example-day-01.webp', tone: 'promo', chip: 'Promo', kind: 'Promotion', headline: 'Fullness that builds itself' },
      { day: 2, image: '/business/free-trial/example-day-02.webp', tone: 'edu', chip: 'Product', kind: 'Product', headline: 'Stop wasting hours on manual posts' },
      { day: 3, tone: 'eng', chip: 'Ask', kind: 'Question', headline: 'Which room do you always clean last?' },
    ],
  },
  offer: {
    h2: 'Free for 30 days.',
    body: 'No credit card needed to start. When the 30 days end, you choose a plan to keep using Moil360.',
  },
  faq: {
    h2: 'Questions',
    items: [
      { q: 'Do I need a credit card?', a: 'No. You can start without one.' },
      { q: 'What happens after 30 days?', a: 'Your free period ends and you choose one of our plans to continue.' },
      {
        q: 'Do I have to write prompts?',
        a: 'No. Moil360 builds your content from what it learns about your business when you start.',
        claim: 'noPrompting',
      },
      { q: 'Who is it for?', a: 'Small business owners who want to stay visible online without becoming full-time marketers.' },
      // "How long does it take to start?" is left out until the product team
      // supplies the real answer (open question 7 in the brief).
    ],
  },
  final: { h2: 'Your next 30 days, planned.', sub: 'Start free. No credit card needed.' },
  review: { badge: 'Needs sign-off' },
  tags: {
    pain: 'The hard part',
    solution: 'The fix',
    features: 'In the plan',
    social: 'Connect and post',
    how: 'Three steps',
    peek: 'Peek inside',
    offer: 'The offer',
    faq: 'Before you start',
  },
  trust: ['30 days free', 'No credit card needed', 'Choose a plan after 30 days'],
};

export const TRIAL_ES: TrialCopy = {
  lang: 'es',
  meta: {
    title: '30 días de contenido. Gratis. | Moil360',
    description:
      'Responde unas preguntas sobre tu negocio. Moil360 planea y diseña un mes de publicaciones para ti. 30 días gratis, sin tarjeta de crédito.',
    ogLocale: 'es_US',
  },
  cta: 'Reclamar mis 30 días gratis',
  trialNote: 'Sin tarjeta de crédito. Después de 30 días, eliges un plan para continuar.',
  hero: {
    eyebrow: 'Estudio de contenido Moil360',
    h1: '30 días de contenido. Gratis.',
    sub: 'Responde unas preguntas sobre tu negocio. Moil360 planea y diseña un mes de publicaciones para ti.',
    hook: '¿Quieres ver cómo se vería un mes de publicaciones para tu negocio?',
  },
  scarcity: {
    trueUrgency: 'Tus 30 días empiezan el día que te registras.',
    deadline: 'La oferta gratis de 30 días termina el {date}.',
    closed: 'La oferta gratis de 30 días terminó.',
    countdownLabel: 'Tiempo restante',
    units: { days: 'd', hours: 'h', minutes: 'm', seconds: 's' },
  },
  phone: { title: 'Tu mes', locked: 'Bloqueado', dayLabel: 'Día' },
  pain: {
    h2: 'Publicar todos los días es un segundo trabajo.',
    body:
      'Pensar en ideas. Hacer imágenes. Escribir textos para cada plataforma. Es fácil empezar con fuerza y quedarte en silencio cuando se acumula el trabajo, y cada semana en silencio es una semana en la que tus clientes no saben de ti.',
  },
  solution: {
    h2: 'Moil360 planea el mes por ti.',
    body: 'Cuéntale de tu negocio una vez. Arma 30 días de publicaciones, con imágenes y textos listos para que los revises.',
  },
  features: {
    h2: 'Lo que recibes',
    rows: [
      { title: 'Imágenes y publicación automática.', body: 'Imágenes listas para tus publicaciones, con publicación automática.', claim: 'imagesAutoPosting' },
      { title: 'Contenido con tu marca.', body: 'Publicaciones con tus colores y el estilo de tu negocio.', claim: 'brandedContent' },
      { title: 'Textos para cada plataforma.', body: 'Una idea, escrita como la necesita cada plataforma.', claim: 'multiPlatformCaptions' },
      { title: 'Ideas basadas en tendencias.', body: 'Ideas de publicaciones según lo que está pasando en tu mercado.', claim: 'trendResearch' },
      { title: 'Sin instrucciones que escribir.', body: 'Respondes unas preguntas. Moil360 hace el resto.', claim: 'noPrompting' },
    ],
  },
  social: {
    claim: 'socialPublishing',
    h2: 'Publica directo en Instagram y Facebook.',
    body: 'Conecta tus cuentas una vez. Cuando una publicación esté lista, publícala desde Moil360. Sin descargar imágenes, sin copiar textos, sin cambiar de app.',
    points: [
      { title: 'Conecta en unos clics.', body: 'Vincula tus cuentas de Instagram y Facebook desde Moil360.', claim: 'socialPublishing' },
      { title: 'Publica desde un solo lugar.', body: 'Tu publicación, imagen y texto salen desde Moil360, tal como los aprobaste.', claim: 'socialPublishing' },
      { title: 'Las dos cuentas, un paso.', body: 'Envía la misma publicación a Instagram y Facebook a la vez.', claim: 'socialPublishing' },
    ],
    visual: { accounts: 'Cuentas conectadas', connected: 'Conectada', ready: 'Lista para publicar', postNow: 'Publicar ahora', postingTo: 'Publicando en' },
  },
  how: {
    h2: 'Cómo funciona',
    steps: [
      { title: 'Cuéntale a Moil de tu negocio.', body: 'Unas preguntas sobre lo que vendes y a quién atiendes.' },
      { title: 'Recibe tu plan de 30 días.', body: 'Un mes completo de publicaciones con imágenes y textos.' },
      { title: 'Revisa y publica.', body: 'Míralo, hazlo tuyo y publícalo.' },
    ],
  },
  peek: {
    h2: '¿Qué hay en el día 12?',
    unlock: 'Los días 4 al 30 se desbloquean cuando empiezas gratis.',
    exampleLabel: 'Ejemplo',
    lockedAria: 'El día {n} está bloqueado. Empieza gratis para desbloquearlo.',
    examples: [
      { day: 1, image: '/business/free-trial/example-day-01.webp', tone: 'promo', chip: 'Promo', kind: 'Promoción', headline: 'Volumen que se construye solo' },
      { day: 2, image: '/business/free-trial/example-day-02.webp', tone: 'edu', chip: 'Producto', kind: 'Producto', headline: 'Deja de perder horas en publicaciones manuales' },
      { day: 3, tone: 'eng', chip: 'Pregunta', kind: 'Pregunta', headline: '¿Qué cuarto limpias siempre al final?' },
    ],
  },
  offer: {
    h2: 'Gratis por 30 días.',
    body: 'No necesitas tarjeta de crédito para empezar. Cuando terminen los 30 días, eliges un plan para seguir usando Moil360.',
  },
  faq: {
    h2: 'Preguntas',
    items: [
      { q: '¿Necesito tarjeta de crédito?', a: 'No. Puedes empezar sin una.' },
      { q: '¿Qué pasa después de 30 días?', a: 'Tu periodo gratis termina y eliges uno de nuestros planes para continuar.' },
      {
        q: '¿Tengo que escribir instrucciones?',
        a: 'No. Moil360 crea tu contenido a partir de lo que aprende de tu negocio cuando empiezas.',
        claim: 'noPrompting',
      },
      { q: '¿Para quién es?', a: 'Para dueños de pequeños negocios que quieren seguir visibles en internet sin volverse expertos en marketing de tiempo completo.' },
    ],
  },
  final: { h2: 'Tus próximos 30 días, planeados.', sub: 'Empieza gratis. Sin tarjeta de crédito.' },
  review: { badge: 'Falta aprobación' },
  tags: {
    pain: 'Lo difícil',
    solution: 'La solución',
    features: 'En el plan',
    social: 'Conecta y publica',
    how: 'Tres pasos',
    peek: 'Échale un vistazo',
    offer: 'La oferta',
    faq: 'Antes de empezar',
  },
  trust: ['30 días gratis', 'Sin tarjeta de crédito', 'Eliges un plan después de 30 días'],
};

export const TRIAL_COPY: Record<TrialLang, TrialCopy> = { en: TRIAL_EN, es: TRIAL_ES };
