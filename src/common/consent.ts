/**
 * Cookie-consent state — the ONE reader every tracking script gates on.
 *
 * `CookieConsent.tsx` has written `moil_cookie_consent` and broadcast
 * `moil:cookie-consent` since it shipped, "so analytics scripts can be gated
 * on consent" — and nothing listened. GA4, Microsoft Clarity (session replay),
 * the Facebook Pixel and the Apollo visitor tracker all loaded on first paint
 * for every visitor, including one who then clicked "Reject non-essential".
 * The banner was decorative, and its own copy ("By clicking Accept all you
 * agree…") described a gate that did not exist.
 *
 * Rules:
 * - Only an EXPLICIT "accepted" loads a non-essential script. Unknown (no
 *   choice yet, storage unavailable) is treated as not consented — the cost of
 *   a missed pageview is a number in a dashboard; the cost of a tracker fired
 *   against a refusal is a compliance exposure.
 * - Global Privacy Control (`navigator.globalPrivacyControl`) is honoured as a
 *   refusal for the session. It is the browser saying "reject", and CCPA/CPRA
 *   regulations treat it as a valid opt-out-of-sale/share signal.
 * - This module holds no DOM rendering; the hook is the only React surface.
 */
import { useEffect, useState } from 'react';

export const CONSENT_STORAGE_KEY = 'moil_cookie_consent';
export const CONSENT_EVENT = 'moil:cookie-consent';

export type ConsentValue = 'accepted' | 'rejected';

export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true;
}

/** Stored choice, or null when none has been recorded / storage is unavailable. */
export function readStoredConsent(): ConsentValue | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw === 'accepted' || raw === 'rejected' ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Effective consent for loading non-essential scripts. GPC wins over a stored
 * "accepted" — a browser-level refusal made after the click is the most recent
 * expression of the visitor's intent.
 */
export function effectiveConsent(): ConsentValue | null {
  if (hasGlobalPrivacyControl()) return 'rejected';
  return readStoredConsent();
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    window.localStorage.setItem(`${CONSENT_STORAGE_KEY}_at`, new Date().toISOString());
  } catch {
    /* persistence failure must never break the page */
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { value } }));
  } catch {
    /* ignore */
  }
}

/**
 * React hook: current effective consent, live-updated when the banner records
 * a choice. Starts as null on the server and on first client render so nothing
 * is injected before the choice is known.
 */
export function useConsent(): ConsentValue | null {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  useEffect(() => {
    setConsent(effectiveConsent());
    const onChange = () => setConsent(effectiveConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);
  return consent;
}
