/**
 * sign_up_start — the one conversion event the marketing site can fire.
 *
 * Plan 0.4 (F7): the landing fired no event beyond page views, the blog's
 * analytics header says it cannot "tell whether an article drove a single
 * signup", and blog → landing → app had no attribution at all, so nothing in
 * the positioning plan could be tied to a customer. This module is the PURE
 * half: what to remember on arrival and what to send on a click. The
 * SignupEventBridge component does the DOM work and gates on cookie consent.
 *
 * Rules:
 *   - UTM parameters are captured ONCE, on arrival, and kept for the session,
 *     so a click two pages later still says which article sent the visitor.
 *   - Only the five utm_* keys are read; nothing else from the URL is kept.
 *   - The event carries the page path and the CTA's name. No email, no
 *     preview slug, no free text — a conversion event is not a place for PII.
 *   - The app's own signup-complete event is the second half (human step in
 *     the plan): this only measures the click that leaves the site.
 */

export const SIGNUP_EVENT = 'sign_up_start';
export const UTM_STORAGE_KEY = 'moil_inbound_utm';
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** The utm_* pairs present in a query string, bounded and trimmed. */
export function utmFromSearch(search: string): Utm {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v && v.trim()) out[key] = v.trim().slice(0, 120);
  }
  return out;
}

export function signupEventParams(input: { path: string; cta: string; utm: Utm }): Record<string, string> {
  const params: Record<string, string> = {
    page_path: input.path.slice(0, 200),
    cta: input.cta.slice(0, 60),
  };
  for (const key of UTM_KEYS) {
    const v = input.utm[key];
    if (v) params[key] = v;
  }
  return params;
}

/** Persist arrival UTMs for the session; never overwrite a stored set with an empty one. */
export function rememberUtm(storage: Pick<Storage, 'getItem' | 'setItem'>, search: string): Utm {
  const fresh = utmFromSearch(search);
  if (Object.keys(fresh).length > 0) {
    try { storage.setItem(UTM_STORAGE_KEY, JSON.stringify(fresh)); } catch { /* private mode */ }
    return fresh;
  }
  return readUtm(storage);
}

export function readUtm(storage: Pick<Storage, 'getItem'>): Utm {
  try {
    const raw = storage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: Utm = {};
    for (const key of UTM_KEYS) if (typeof parsed?.[key] === 'string') out[key] = parsed[key];
    return out;
  } catch {
    return {};
  }
}
