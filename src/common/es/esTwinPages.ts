/**
 * Spanish twins whose page is NOT the AeoCitePage format, and so cannot sit in
 * ES_PAGES (that registry's gate asserts an answer literal, ES_LABELS and so
 * on for every entry).
 *
 * The rule is the same one src/common/es/esPages.ts states, and it is not
 * optional: the copy ships as a DRAFT until a human Spanish speaker has
 * reviewed it. Until then the page is real (it renders, the language toggle
 * reaches it) but it is NOT INDEXABLE: noindex, out of the sitemap, and no
 * hreflang pointing at it from the English page. Flip `reviewed` to true and
 * all three turn on together, because one flag drives them
 * (evals/esPartnersPage.test.js pins that they cannot disagree).
 */
export type EsTwin = {
  path: string;
  en: string;
  reviewed: boolean;
};

export const ES_TWIN_PAGES: readonly EsTwin[] = [
  { path: '/es/aliados', en: '/partners', reviewed: false },
];

function twin(path: string): EsTwin {
  const t = ES_TWIN_PAGES.find((x) => x.path === path);
  if (!t) throw new Error(`esTwinPages: ${path} is not registered`);
  return t;
}

/** `robots` metadata for a Spanish twin: indexable only once reviewed. */
export function esTwinRobots(path: string) {
  return twin(path).reviewed ? undefined : { index: false, follow: true, googleBot: { index: false, follow: true } };
}

/** hreflang alternates for a pair, from either half: nothing until the Spanish half is reviewed. */
export function esTwinAlternates(baseUrl: string, enPath: string): { languages: Record<string, string> } | undefined {
  const t = ES_TWIN_PAGES.find((x) => x.en === enPath);
  if (!t || !t.reviewed) return undefined;
  return { languages: { en: `${baseUrl}${enPath}`, es: `${baseUrl}${t.path}`, 'x-default': `${baseUrl}${enPath}` } };
}
