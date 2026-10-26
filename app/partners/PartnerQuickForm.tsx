'use client';

import { useId, useRef, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import styles from '../showcase-pages.module.css';
import { PUBLIC_FALLBACK_EMAIL } from '../api/partner-inquiry/deliveryOutcome';
import type { PartnerCopy } from './partnerCopy';

/**
 * The two-field version of the partnership inquiry, shown in the open so a
 * visitor can send with an email and an organization name. It posts to the same
 * route as the popup, so every lead lands in the same place.
 */
export function PartnerQuickForm({ copy, source = 'partners-hero' }: { copy: PartnerCopy; source?: string }) {
  const q = copy.quick;
  const id = useId();
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setStatus('sending');
    setError('');
    try {
      const base = copy.conference?.message ?? q.defaultMessage;
      const response = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          organization,
          website,
          source,
          destination: 'partners',
          subject: copy.inquirySubject,
          message: `${base} (${organization})`.slice(0, 4000),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(copy.lang === 'es' ? q.failed : result.error || q.failed);
      setStatus('success');
    } catch (caught) {
      setStatus('error');
      setError(caught instanceof Error ? caught.message : q.failed);
    } finally {
      sending.current = false;
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.quickDone} role="status" aria-live="polite">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div><strong>{q.sentTitle}</strong><p>{q.sentBody}</p></div>
      </div>
    );
  }

  return (
    <form className={styles.quickForm} onSubmit={submit}>
      <p className={styles.quickLead}>{q.lead}</p>
      <div className={styles.quickRow}>
        <label htmlFor={`${id}-email`} className={styles.srOnly}>{q.email}</label>
        <input id={`${id}-email`} type="email" name="email" autoComplete="email" required maxLength={254} placeholder={q.email} value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }} />
        <label htmlFor={`${id}-org`} className={styles.srOnly}>{q.organization}</label>
        <input id={`${id}-org`} type="text" name="organization" autoComplete="organization" required maxLength={120} placeholder={q.organization} value={organization} onChange={(e) => setOrganization(e.target.value)} />
        <div className={styles.inquiryHoneypot} aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <button type="submit" className={styles.primary} disabled={status === 'sending'}>{status === 'sending' ? q.sending : q.send} <Send size={15} aria-hidden="true" /></button>
      </div>
      {status === 'error' && <p className={styles.quickError} role="alert">{error}</p>}
      <p className={styles.quickNote}>{q.note} {PUBLIC_FALLBACK_EMAIL}</p>
    </form>
  );
}
