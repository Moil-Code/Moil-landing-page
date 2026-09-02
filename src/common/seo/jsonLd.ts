/**
 * Serialise structured data for a `<script type="application/ld+json">` body.
 *
 * `JSON.stringify` does not escape `<`, so a string value containing
 * `</script><script>…` would close the JSON-LD block and execute. Every block on
 * the site is built from developer-authored constants today, so this is not
 * exploitable now — it becomes exploitable the day reviews, FAQs or offers are
 * sourced from a CMS or an API. Escaping `<` as `\u003c` (and the U+2028/2029 line terminators) is byte-for-byte valid
 * JSON, parses identically, and removes the class.
 *
 * Use this everywhere a JSON-LD body is emitted; never `JSON.stringify` directly.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
