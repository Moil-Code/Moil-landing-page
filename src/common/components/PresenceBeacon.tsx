'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { effectiveConsent } from '../consent';
import { BEAT_MS, resolveVisitorId, visitBody, visitUrl } from '../presence/visitorBeacon';

/**
 * Tells the gateway someone is on a landing page, so the admin "Active users"
 * page can show them. Rules live in ../presence/visitorBeacon.js.
 *
 * It sends on load, on every route change, and once a minute while the tab is
 * visible. A hidden tab sends nothing: a person is not "on the page" behind
 * another tab. Every failure is swallowed — this must never affect the page.
 */
const ORIGIN = process.env.NEXT_PUBLIC_MOIL_GATEWAY_ORIGIN;

function randomBytes(n: number): ArrayLike<number> {
  const out = new Uint8Array(n);
  window.crypto.getRandomValues(out);
  return out;
}

export default function PresenceBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const url = visitUrl(ORIGIN);
    if (!url || typeof window === 'undefined') return;

    let session: Storage | null = null;
    try { session = window.sessionStorage; } catch { session = null; }

    const send = () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const vid = resolveVisitorId({
          // Read at send time, not from a hook: the hook starts at null and
          // would mint a throwaway id on first paint for a visitor who accepted.
          consent: effectiveConsent(),
          cookieString: document.cookie,
          setCookie: (c) => { document.cookie = c; },
          session,
          random: randomBytes,
          hostname: window.location.hostname,
          secure: window.location.protocol === 'https:',
        });
        if (!vid) return;
        const body = visitBody({
          vid,
          pathname: pathname || window.location.pathname,
          referrer: document.referrer,
          ownHost: window.location.hostname,
        });
        // credentials: the gateway reads the app's jwt cookie, when there is
        // one, to record a signed-in founder by name instead of as a visitor.
        fetch(url, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'text/plain' },
          credentials: 'include',
          keepalive: true,
        }).catch(() => { /* telemetry only */ });
      } catch {
        /* telemetry only */
      }
    };

    send();
    const timer = window.setInterval(send, BEAT_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') send(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pathname]);

  return null;
}
