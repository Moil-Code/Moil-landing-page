/**
 * /help and /es/ayuda — one question list per language, grouped.
 *
 * Plan 8.6: assistants cite support pages disproportionately and the site
 * had none (/contact is a form). The rule that keeps this page honest is
 * that it answers "how", it does not sell, and it makes NO new claim: every
 * answer is either the business FAQ the landing already renders (so the help
 * page and the landing page cannot answer one question two ways), a price
 * sentence from pricingCopy, or a fact restated from the Terms. The billing
 * and connected-account answers a human writes from real support threads go
 * here too — never typed with a price in them.
 */
import type { FaqItem } from '../utils/faqJsonLd';
import { en } from '../translations/en';
import { es } from '../translations/es';
import { pricingCopy } from '../seo/pricingCopy';

export type HelpGroup = { id: string; title: string; items: FaqItem[] };
export type HelpPage = { eyebrow: string; title: string; lede: string; contact: string; groups: HelpGroup[] };

const faqEn = en.business.faq.items;
const faqEs = es.business.faq.items;
const byQ = (items: readonly FaqItem[], start: string): FaqItem => {
  const hit = items.find((i) => i.question.startsWith(start));
  if (!hit) throw new Error(`help: no FAQ item starting "${start}"`);
  return hit;
};

export const helpContent: Readonly<Record<'en' | 'es', HelpPage>> = {
  en: {
    eyebrow: 'Help',
    title: 'Moil help center',
    lede: 'Plain answers to the questions owners ask us most: getting started, what each plan includes, publishing, billing, and your data. If yours is not here, write to cs@moilapp.com.',
    contact: 'Still stuck? Email cs@moilapp.com or use the contact page.',
    groups: [
      {
        id: 'getting-started',
        title: 'Getting started',
        items: [
          byQ(faqEn, 'What does Moil do'),
          byQ(faqEn, 'Do I need marketing experience'),
          byQ(faqEn, 'Does Moil work in Spanish'),
          { question: 'Is there a free trial?', answer: 'The first conversation is free and needs no card. You see what Moil learns about your business and what it produces before you pay anything.' },
          byQ(faqEn, 'Can Moil build staff schedules'),
          byQ(faqEn, 'Can Moil help me hire'),
        ],
      },
      {
        id: 'plans',
        title: 'What $25 and $75 include',
        items: [
          byQ(faqEn, 'How much does Moil cost'),
          { question: 'What does Professional include?', answer: pricingCopy.en.professional },
          { question: 'What does Market Pro include?', answer: pricingCopy.en.marketPro },
          byQ(faqEn, 'What is Moil360'),
        ],
      },
      {
        id: 'publishing',
        title: 'Publishing and connected accounts',
        items: [
          byQ(faqEn, 'Does Moil post to my accounts'),
          byQ(faqEn, 'How is Moil different from Buffer'),
          { question: 'Nothing publishes without me, right?', answer: 'Right. On Professional you approve and publish each post yourself. On Market Pro, Moil360 stages the week for your review by default; publishing without a review is a setting you switch on, and you can switch it off again at any time.' },
        ],
      },
      {
        id: 'billing',
        title: 'Billing and cancelling',
        items: [
          { question: 'How am I billed?', answer: 'Paid plans are billed in advance, monthly, and renew automatically at the then-current price until you cancel. Payments are processed by Stripe; Moil does not store full card numbers. See the Terms of Service for the full wording.' },
          { question: 'How do I cancel?', answer: 'Any time, from your account settings or by emailing cs@moilapp.com. Cancelling stops the next renewal; your plan stays active until the end of the period you already paid for.' },
        ],
      },
      {
        id: 'data',
        title: 'Your data and privacy',
        items: [
          { question: 'Who can see what I tell Moil about my business?', answer: 'You. Your business profile, plans and content are private to your account. The providers that process data on our behalf are listed on the subprocessors page, and the Privacy Policy and Data Processing Addendum say what each may do with it.' },
          { question: 'Can I delete my data?', answer: 'Yes. Request deletion from your account settings or by emailing cs@moilapp.com, and it is carried out as the Privacy Policy describes.' },
          byQ(faqEn, 'Is Moil the same as MOIL Limited'),
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Ayuda',
    title: 'Centro de ayuda de Moil',
    lede: 'Respuestas claras a lo que más nos preguntan los dueños de negocio: cómo empezar, qué incluye cada plan, cómo se publica, la facturación y tus datos. Si la tuya no está aquí, escríbenos a cs@moilapp.com.',
    contact: '¿Sigues atorado? Escribe a cs@moilapp.com o usa la página de contacto.',
    groups: [
      {
        id: 'primeros-pasos',
        title: 'Primeros pasos',
        items: [
          byQ(faqEs, '¿Qué hace Moil'),
          byQ(faqEs, '¿Necesito saber de marketing'),
          byQ(faqEs, '¿Moil funciona en español'),
          { question: '¿Hay una prueba gratis?', answer: 'La primera conversación es gratis y no pide tarjeta. Ves lo que Moil aprende de tu negocio y lo que produce antes de pagar nada.' },
          byQ(faqEs, '¿Moil puede armar horarios'),
          byQ(faqEs, '¿Moil me ayuda a contratar'),
        ],
      },
      {
        id: 'planes',
        title: 'Qué incluyen $25 y $75',
        items: [
          byQ(faqEs, '¿Cuánto cuesta Moil'),
          { question: '¿Qué incluye Professional?', answer: pricingCopy.es.professional },
          { question: '¿Qué incluye Market Pro?', answer: pricingCopy.es.marketPro },
          byQ(faqEs, '¿Qué es Moil360'),
        ],
      },
      {
        id: 'publicacion',
        title: 'Publicación y cuentas conectadas',
        items: [
          byQ(faqEs, '¿Moil publica en mis cuentas'),
          byQ(faqEs, '¿En qué se diferencia de Buffer'),
          { question: '¿Nada se publica sin mí, verdad?', answer: 'Así es. En Professional tú apruebas y publicas cada publicación. En Market Pro, Moil360 deja la semana lista para que la revises; publicar sin revisión es una opción que tú activas, y puedes desactivarla cuando quieras.' },
        ],
      },
      {
        id: 'facturacion',
        title: 'Facturación y cancelación',
        items: [
          { question: '¿Cómo se me cobra?', answer: 'Los planes de pago se cobran por adelantado, cada mes, y se renuevan automáticamente al precio vigente hasta que canceles. Los pagos los procesa Stripe; Moil no guarda números de tarjeta completos. Los Términos de Servicio tienen el texto completo.' },
          { question: '¿Cómo cancelo?', answer: 'Cuando quieras, desde la configuración de tu cuenta o escribiendo a cs@moilapp.com. Cancelar detiene la siguiente renovación; tu plan sigue activo hasta el final del periodo que ya pagaste.' },
        ],
      },
      {
        id: 'datos',
        title: 'Tus datos y privacidad',
        items: [
          { question: '¿Quién puede ver lo que le cuento a Moil de mi negocio?', answer: 'Tú. Tu perfil de negocio, tus planes y tu contenido son privados de tu cuenta. Los proveedores que procesan datos por nosotros están en la página de subprocesadores, y la Política de Privacidad y el Anexo de Procesamiento de Datos dicen qué puede hacer cada uno con ellos.' },
          { question: '¿Puedo borrar mis datos?', answer: 'Sí. Pide la eliminación desde la configuración de tu cuenta o escribiendo a cs@moilapp.com, y se hace como lo describe la Política de Privacidad.' },
          byQ(faqEs, '¿Moil es lo mismo que MOIL Limited'),
        ],
      },
    ],
  },
};

export function helpFaqItems(lang: 'en' | 'es'): FaqItem[] {
  return helpContent[lang].groups.flatMap((g) => g.items);
}
