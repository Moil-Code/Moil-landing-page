'use client';

import { useEffect } from 'react';
import { effectiveConsent } from '../consent';
import { SIGNUP_EVENT, rememberUtm, readUtm, signupEventParams } from '../analytics/signup';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires `sign_up_start` when a visitor clicks any CTA that leaves for the app's
 * register page. The CTAs opt in with `data-signup-cta="<name>"` — one
 * delegated listener, so a new CTA cannot forget to wire its own handler, and
 * evals/signupEvent.test.js fails any register link without the attribute.
 *
 * Consent: nothing is sent unless the visitor accepted cookies. gtag only
 * exists once <Analytics /> has loaded it behind the same gate, so an
 * unaccepted visit has no gtag and this is a no-op twice over.
 */
export default function SignupEventBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { rememberUtm(window.sessionStorage, window.location.search); } catch { /* storage unavailable */ }

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const cta = target?.closest?.('a[data-signup-cta]') as HTMLAnchorElement | null;
      if (!cta) return;
      if (effectiveConsent() !== 'accepted') return;
      if (typeof window.gtag !== 'function') return;
      let utm = {};
      try { utm = readUtm(window.sessionStorage); } catch { /* storage unavailable */ }
      window.gtag('event', SIGNUP_EVENT, signupEventParams({
        path: window.location.pathname,
        cta: cta.getAttribute('data-signup-cta') || 'unknown',
        utm,
      }));
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
