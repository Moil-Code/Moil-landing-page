/**
 * Funnel events for the free-trial page (brief, "Tracking and UTMs").
 *
 * Consent: every tracker on the site loads inside <Analytics />, which renders
 * nothing until the visitor accepts cookies. So `fbq` and `gtag` only exist
 * after consent, and every call here is a no-op before it. Do not load the
 * Pixel from this page to get around that gate.
 *
 * Tracking must never delay the page: nothing here awaits, and a missing
 * tracker is silently skipped.
 */
import { CONSENT_EVENT, effectiveConsent } from '../../../src/common/consent';

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

function trackers(): { fbq?: Fbq; gtag?: Gtag } {
  if (typeof window === 'undefined') return {};
  if (effectiveConsent() !== 'accepted') return {};
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };
  return {
    fbq: typeof w.fbq === 'function' ? w.fbq : undefined,
    gtag: typeof w.gtag === 'function' ? w.gtag : undefined,
  };
}

/** A Meta standard event (ViewContent) or one of the brief's custom events. */
export function trackTrialEvent(
  name: 'ViewContent' | 'cta_click' | 'peek_day_click' | 'scroll_depth',
  params: Record<string, string | number>,
): void {
  const { fbq, gtag } = trackers();
  try {
    if (fbq) fbq(name === 'ViewContent' ? 'track' : 'trackCustom', name, params);
  } catch { /* a tracker error must never break the page */ }
  try {
    if (gtag) gtag('event', name === 'ViewContent' ? 'view_item' : name, params);
  } catch { /* ignore */ }
}

/**
 * Run `fire` once, as soon as the Pixel exists. The Pixel loads after
 * hydration, and only after consent, which may be given later on this same
 * visit; poll briefly and re-arm when the consent banner records a choice.
 */
export function onceWhenPixelReady(fire: () => void): () => void {
  let done = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const attempt = () => {
    if (done) return;
    let tries = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      tries += 1;
      if (trackers().fbq) {
        done = true;
        clearInterval(timer);
        fire();
      } else if (tries >= 40) {
        clearInterval(timer);
      }
    }, 250);
  };
  attempt();
  window.addEventListener(CONSENT_EVENT, attempt);
  return () => {
    done = true;
    clearInterval(timer);
    window.removeEventListener(CONSENT_EVENT, attempt);
  };
}
