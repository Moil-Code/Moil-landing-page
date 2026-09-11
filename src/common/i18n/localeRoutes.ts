/**
 * The English ⇄ Spanish route twins — the ONE list.
 *
 * Three things used to hold their own copy of this map: `BusinessNav`'s
 * `localeRouteMap`, the sitemap's `alternates`, and (implicitly) the
 * `?lg=` push in `BusinessCustomizeModal` and the footer, which held no map at
 * all and so switched language by rewriting the query string of an English URL
 * — leaving `/business?lg=es` as the URL a Spanish reader shares, bookmarks
 * and (before the middleware fix) was indexed under. hreflang tells Google two
 * documents are twins; it does not make the toggle land on the twin.
 *
 * `twinPath(pathname, lang)` answers "where does this page live in that
 * language". `null` means "nowhere yet" — the caller keeps its state-only
 * behaviour rather than inventing a URL.
 */

import { normalizePathname } from './pathLocale';

export type TwinLang = 'en' | 'es';

export const LOCALE_TWINS: ReadonlyArray<Readonly<Record<TwinLang, string>>> = [
  { en: '/business', es: '/es/business' },
  { en: '/business/pricing', es: '/es/business/pricing' },
  { en: '/help', es: '/es/ayuda' },
  // Spanish compare twins (plan 3.5). The toggle reaches them as soon as they
  // exist — a reader can use a draft — while indexing and hreflang wait on
  // `reviewed` in src/common/es/esPages.ts.
  { en: '/compare/moil-vs-buffer', es: '/es/compare/moil-vs-buffer' },
  { en: '/compare/moil-vs-chatgpt', es: '/es/compare/moil-vs-chatgpt' },
];

/** The twin pair a path belongs to, in either language, or null. */
export function localeTwins(pathname: string): Readonly<Record<TwinLang, string>> | null {
  const path = normalizePathname(pathname);
  return LOCALE_TWINS.find((pair) => pair.en === path || pair.es === path) ?? null;
}

/** The path this page lives at in `lang`, or null when it has no twin. */
export function twinPath(pathname: string, lang: TwinLang): string | null {
  const pair = localeTwins(pathname);
  return pair ? pair[lang] : null;
}
