/**
 * URL path is the locale source of truth.
 *
 * `/es` and `/es/*` are Spanish documents. Every other path is an English
 * document. Query-string `?lg=` and Accept-Language must not override that
 * for `<html lang>`, `Content-Language`, or the `lang` cookie on `/es/*` —
 * those were how `/es/business` shipped as English to Google.
 */

export type SiteLocale = 'en' | 'es';

export function normalizePathname(pathname: string): string {
  const path = String(pathname || '/').split('?')[0];
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

export function isSpanishPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return path === '/es' || path.startsWith('/es/');
}

export function isEnglishBusinessPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return path === '/business' || path.startsWith('/business/');
}

/** Document language for `<html lang>` and `Content-Language`. Path only. */
export function documentLocaleFromPathname(pathname: string): SiteLocale {
  return isSpanishPath(pathname) ? 'es' : 'en';
}

/**
 * Value for the `lang` cookie.
 *   - `/es` and `/es/*` always `es` (path wins over `?lg=` and any prior cookie)
 *   - otherwise `?lg=en|es` is an explicit switcher choice
 *   - otherwise `en` — never infer Spanish from Accept-Language on an English URL
 */
export function langCookieValue(pathname: string, lgParam: string | null): SiteLocale {
  if (isSpanishPath(pathname)) return 'es';
  if (lgParam === 'en' || lgParam === 'es') return lgParam;
  return 'en';
}

/** Request header middleware writes so the root layout can set `<html lang>` on first paint. */
export const HTML_LANG_HEADER = 'x-html-lang';
