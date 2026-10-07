'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, ArrowUpRight, CheckCircle2, Send, X } from 'lucide-react';
import styles from '../showcase-pages.module.css';
import { PUBLIC_FALLBACK_EMAIL } from '../api/partner-inquiry/deliveryOutcome';

type FormState = {
  email: string;
  subject: string;
  message: string;
  website: string;
};

const EMPTY_FORM: FormState = { email: '', subject: '', message: '', website: '' };

type Lang = 'en' | 'es';

/**
 * Form chrome per language. English is byte-identical to what shipped. The
 * server answers in English, so for Spanish we map its failure by STATUS and
 * keep the one thing a visitor must not lose: the fallback address.
 */
const COPY = {
  en: {
    sendFailed: 'We could not send your message. Please try again.',
    close: 'Close partnership inquiry',
    sent: 'MESSAGE SENT',
    thanks: 'Thank you for reaching out.',
    sentBody: (team: string) => `Your note is with the Moil ${team} team. We will reply directly to the email address you provided.`,
    teamContact: 'support',
    teamPartners: 'partnerships',
    eyebrowContact: 'CONTACT MOIL',
    eyebrowPartners: 'PARTNER WITH MOIL',
    headingPartners: 'Tell us what your community needs.',
    introContact: 'Add the details below and we will route your message to the right person on our team.',
    introPartners: 'Send a note directly to our partnerships team. We usually begin with the owners you serve and the outcome you want to create.',
    email: 'Your email',
    emailPlaceholder: 'you@organization.com',
    title: 'Title',
    titlePlaceholder: 'Partnership opportunity in our community',
    message: 'Message',
    messagePlaceholder: 'Tell us about your organization, the businesses you support, and what you would like to make possible.',
    website: 'Website',
    sentSecurely: (team: string) => `Sent securely to the Moil ${team} team.`,
    sending: 'Sending…',
    send: 'Send message',
    done: 'Done',
  },
  es: {
    sendFailed: `No pudimos enviar tu mensaje ahora. Inténtalo de nuevo en un momento o escríbenos a ${PUBLIC_FALLBACK_EMAIL}.`,
    close: 'Cerrar consulta de alianza',
    sent: 'MENSAJE ENVIADO',
    thanks: 'Gracias por escribirnos.',
    sentBody: (team: string) => `Tu mensaje está con el equipo de ${team} de Moil. Te responderemos directamente al correo que nos diste.`,
    teamContact: 'soporte',
    teamPartners: 'alianzas',
    eyebrowContact: 'CONTACTA A MOIL',
    eyebrowPartners: 'ALÍATE CON MOIL',
    headingPartners: 'Cuéntanos qué necesita tu comunidad.',
    introContact: 'Agrega los detalles y enviaremos tu mensaje a la persona indicada de nuestro equipo.',
    introPartners: 'Envía una nota directamente a nuestro equipo de alianzas. Solemos empezar por los dueños de negocio que atiendes y el resultado que quieres lograr.',
    email: 'Tu correo',
    emailPlaceholder: 'tu@organizacion.com',
    title: 'Asunto',
    titlePlaceholder: 'Oportunidad de alianza en nuestra comunidad',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu organización, los negocios que apoyas y lo que te gustaría hacer posible.',
    website: 'Sitio web',
    sentSecurely: (team: string) => `Enviado de forma segura al equipo de ${team} de Moil.`,
    sending: 'Enviando…',
    send: 'Enviar mensaje',
    done: 'Listo',
  },
} as const;

/** The Spanish message for a failed send, chosen by status; the server's English is kept for English. */
function spanishFailure(status: number): string {
  if (status === 400) return 'Revisa tu correo, el asunto y el mensaje (mínimo 20 caracteres) e inténtalo de nuevo.';
  if (status === 429) return 'Se enviaron demasiados mensajes. Espera unos minutos e inténtalo de nuevo.';
  if (status === 502 || status === 503) return COPY.es.sendFailed;
  return COPY.es.sendFailed;
}


export function PartnershipInquiryButton({ label, className, defaultSubject = '', destination = 'partners', lang = 'en', children }: { label: string; className?: string; defaultSubject?: string; destination?: 'partners' | 'contact'; lang?: Lang; children?: ReactNode }) {
  const t = COPY[lang];
  const team = destination === 'contact' ? t.teamContact : t.teamPartners;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const sendingRef = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => emailRef.current?.focus());

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !sendingRef.current) {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const closeModal = () => {
    if (sendingRef.current) return;
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setError('');
    }
  };

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendingRef.current = true;
    setStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, destination }),
      });
      // A proxy or platform error page is HTML, not JSON. Reading it as JSON
      // threw "Unexpected token '<'" straight into the visitor's error line.
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) throw new Error(lang === 'es' ? spanishFailure(response.status) : result.error || t.sendFailed);

      sendingRef.current = false;
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (caught) {
      sendingRef.current = false;
      setStatus('error');
      setError(caught instanceof Error ? caught.message : t.sendFailed);
    }
  };

  return (
    <>
      <button ref={triggerRef} type="button" className={className} onClick={() => {
        setStatus('idle');
        setError('');
        setForm((current) => current.subject ? current : { ...current, subject: defaultSubject });
        setOpen(true);
      }}>
        {children || <>{label} <ArrowUpRight size={17} aria-hidden="true" /></>}
      </button>

      {open && createPortal((
        <div className={styles.inquiryBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section ref={modalRef} className={styles.inquiryModal} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }}>
            <button type="button" className={styles.inquiryClose} onClick={closeModal} aria-label={t.close}>
              <X size={18} aria-hidden="true" />
            </button>

            {status === 'success' ? (
              <div className={styles.inquirySuccess} aria-live="polite">
                <span className={styles.inquiryStatusIcon}><CheckCircle2 size={26} aria-hidden="true" /></span>
                <span className={styles.eyebrow}>{t.sent}</span>
                <h2 id={titleId}>{t.thanks}</h2>
                <p id={descriptionId}>{t.sentBody(team)}</p>
                <button type="button" className={styles.inquiryDone} onClick={closeModal}>{t.done}</button>
              </div>
            ) : (
              <>
                <header className={styles.inquiryHeader}>
                  <span className={styles.eyebrow}>{destination === 'contact' ? t.eyebrowContact : t.eyebrowPartners}</span>
                  <h2 id={titleId}>{destination === 'contact' ? label : t.headingPartners}</h2>
                  <p id={descriptionId}>{destination === 'contact' ? t.introContact : t.introPartners}</p>
                </header>

                <form className={styles.inquiryForm} onSubmit={submitInquiry}>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-email`}>{t.email}</label>
                    <input ref={emailRef} id={`${titleId}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder={t.emailPlaceholder} value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                  </div>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-subject`}>{t.title}</label>
                    <input id={`${titleId}-subject`} name="subject" type="text" required maxLength={120} placeholder={t.titlePlaceholder} value={form.subject} onChange={(event) => updateField('subject', event.target.value)} />
                  </div>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-message`}>{t.message}</label>
                    <textarea id={`${titleId}-message`} name="message" required minLength={20} maxLength={4000} rows={4} placeholder={t.messagePlaceholder} value={form.message} onChange={(event) => updateField('message', event.target.value)} />
                    <small>{form.message.length}/4000</small>
                  </div>
                  <div className={styles.inquiryHoneypot} aria-hidden="true">
                    <label htmlFor={`${titleId}-website`}>{t.website}</label>
                    <input id={`${titleId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField('website', event.target.value)} />
                  </div>

                  {status === 'error' && <p className={styles.inquiryError} role="alert"><AlertCircle size={16} aria-hidden="true" />{error}</p>}

                  <div className={styles.inquiryFooter}>
                    <p>{t.sentSecurely(team)}</p>
                    <button type="submit" className={styles.inquirySubmit} disabled={status === 'sending'}>
                      {status === 'sending' ? t.sending : t.send} <Send size={15} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      ), document.body)}
    </>
  );
}
