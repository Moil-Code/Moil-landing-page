/**
 * The Spanish pages built for the Spanish query (plan 3.4 / 3.5), and whether
 * a human Spanish speaker has reviewed each one.
 *
 * The plan's rule is not optional: "Human-reviewed Spanish". Engineering
 * builds the route, layout, schema, sitemap and hreflang scaffold; the copy
 * ships as a DRAFT until reviewed. Until then a page is REAL (it renders, the
 * toggle reaches it, a reader can use it) but it is NOT INDEXABLE — noindex,
 * out of the sitemap, no hreflang pointing at it — because a draft that
 * ranks is a draft that gets quoted. Flip `reviewed` to true and every
 * scaffold piece turns on at once (evals/spanishPages.test.js pins that the
 * three cannot disagree).
 */
export type EsPage = {
  path: string;
  /** English twin, when the page is a translation rather than a query-built original. */
  en: string | null;
  reviewed: boolean;
};

export const ES_PAGES: readonly EsPage[] = [
  { path: '/es/calendario-de-contenidos-para-redes-sociales', en: null, reviewed: false },
  { path: '/es/que-publicar-en-redes-sociales-para-mi-negocio', en: null, reviewed: false },
  { path: '/es/plan-de-marketing-para-mi-negocio', en: null, reviewed: false },
  { path: '/es/compare/moil-vs-buffer', en: '/compare/moil-vs-buffer', reviewed: true },
  { path: '/es/compare/moil-vs-chatgpt', en: '/compare/moil-vs-chatgpt', reviewed: true },
];

export function esPage(path: string): EsPage {
  const p = ES_PAGES.find((x) => x.path === path);
  if (!p) throw new Error(`esPages: ${path} is not registered`);
  return p;
}

/** `robots` metadata for a Spanish page: indexable only once reviewed. */
export function esRobots(path: string) {
  return esPage(path).reviewed ? undefined : { index: false, follow: true };
}

/** hreflang alternates for a twin pair — only once the Spanish half is reviewed. */
export function twinAlternates(baseUrl: string, enPath: string): { languages: Record<string, string> } | undefined {
  const es = ES_PAGES.find((x) => x.en === enPath);
  if (!es || !es.reviewed) return undefined;
  return { languages: { en: `${baseUrl}${enPath}`, es: `${baseUrl}${es.path}`, 'x-default': `${baseUrl}${enPath}` } };
}

/** Self-referencing en + x-default when a page has no reviewed Spanish twin. */
export function selfAlternates(baseUrl: string, path: string): { languages: Record<string, string> } {
  const url = `${baseUrl}${path}`;
  return { languages: { en: url, 'x-default': url } };
}
