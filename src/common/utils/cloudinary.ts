/**
 * Cloudinary delivery-URL helper.
 *
 * The screenshot URLs pasted around this codebase point at the raw Cloudinary
 * export: the light-theme product captures are 3000+ px wide, 1.2–1.5 MB PNGs.
 * That is a problem twice over:
 *
 *  1. `next/image` has to download and re-encode each one with sharp. With
 *     several on a page the optimizer blows past its request timeout and returns
 *     500 for the whole set, which surfaces in the dev log as
 *     `Error [TimeoutError]: The operation was aborted due to timeout` (code 23,
 *     `TIMEOUT_ERR`) followed by `GET /_next/image?... 500`.
 *  2. Even when it succeeds it is pure waste — Cloudinary can do the resize and
 *     format negotiation at the CDN edge, for free, before a byte reaches us.
 *
 * `cld()` injects a transformation segment: `f_auto` negotiates AVIF/WebP from
 * the request's Accept header, `q_auto` picks a quality, and `w_<width>` caps the
 * pixel dimensions. Pass the widest size the slot is ever painted at, times two
 * for high-DPR screens.
 *
 * Idempotent and safe on any input: the pattern only matches when `/upload/` is
 * followed directly by the `v<digits>/` version segment, so a URL that already
 * carries a transformation is returned untouched, as is any non-Cloudinary URL.
 */
export function cld(src: string, width: number): string;
export function cld(src: undefined, width: number): undefined;
export function cld(src: string | undefined, width: number): string | undefined;
export function cld(src: string | undefined, width: number): string | undefined {
  if (!src) return src;
  return src.replace(
    /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/)/,
    (_match, base: string, version: string) => `${base}f_auto,q_auto,w_${width}/${version}`
  );
}
