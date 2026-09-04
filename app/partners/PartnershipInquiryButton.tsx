'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, ArrowUpRight, CheckCircle2, Send, X } from 'lucide-react';
import styles from '../showcase-pages.module.css';

type FormState = {
  email: string;
  subject: string;
  message: string;
  website: string;
};

const EMPTY_FORM: FormState = { email: '', subject: '', message: '', website: '' };

export function PartnershipInquiryButton({ label, className, defaultSubject = '', destination = 'partners', children }: { label: string; className?: string; defaultSubject?: string; destination?: 'partners' | 'contact'; children?: ReactNode }) {
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
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || 'We could not send your message. Please try again.');

      sendingRef.current = false;
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (caught) {
      sendingRef.current = false;
      setStatus('error');
      setError(caught instanceof Error ? caught.message : 'We could not send your message. Please try again.');
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
            <button type="button" className={styles.inquiryClose} onClick={closeModal} aria-label="Close partnership inquiry">
              <X size={18} aria-hidden="true" />
            </button>

            {status === 'success' ? (
              <div className={styles.inquirySuccess} aria-live="polite">
                <span className={styles.inquiryStatusIcon}><CheckCircle2 size={26} aria-hidden="true" /></span>
                <span className={styles.eyebrow}>MESSAGE SENT</span>
                <h2 id={titleId}>Thank you for reaching out.</h2>
                <p id={descriptionId}>Your note is with the Moil {destination === 'contact' ? 'support' : 'partnerships'} team. We will reply directly to the email address you provided.</p>
                <button type="button" className={styles.inquiryDone} onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                <header className={styles.inquiryHeader}>
                  <span className={styles.eyebrow}>{destination === 'contact' ? 'CONTACT MOIL' : 'PARTNER WITH MOIL'}</span>
                  <h2 id={titleId}>{destination === 'contact' ? label : 'Tell us what your community needs.'}</h2>
                  <p id={descriptionId}>{destination === 'contact' ? 'Add the details below and we will route your message to the right person on our team.' : 'Send a note directly to our partnerships team. We usually begin with the owners you serve and the outcome you want to create.'}</p>
                </header>

                <form className={styles.inquiryForm} onSubmit={submitInquiry}>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-email`}>Your email</label>
                    <input ref={emailRef} id={`${titleId}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@organization.com" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                  </div>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-subject`}>Title</label>
                    <input id={`${titleId}-subject`} name="subject" type="text" required maxLength={120} placeholder="Partnership opportunity in our community" value={form.subject} onChange={(event) => updateField('subject', event.target.value)} />
                  </div>
                  <div className={styles.inquiryField}>
                    <label htmlFor={`${titleId}-message`}>Message</label>
                    <textarea id={`${titleId}-message`} name="message" required minLength={20} maxLength={4000} rows={4} placeholder="Tell us about your organization, the businesses you support, and what you would like to make possible." value={form.message} onChange={(event) => updateField('message', event.target.value)} />
                    <small>{form.message.length}/4000</small>
                  </div>
                  <div className={styles.inquiryHoneypot} aria-hidden="true">
                    <label htmlFor={`${titleId}-website`}>Website</label>
                    <input id={`${titleId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField('website', event.target.value)} />
                  </div>

                  {status === 'error' && <p className={styles.inquiryError} role="alert"><AlertCircle size={16} aria-hidden="true" />{error}</p>}

                  <div className={styles.inquiryFooter}>
                    <p>Sent securely to the Moil {destination === 'contact' ? 'support' : 'partnerships'} team.</p>
                    <button type="submit" className={styles.inquirySubmit} disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : 'Send message'} <Send size={15} aria-hidden="true" />
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
