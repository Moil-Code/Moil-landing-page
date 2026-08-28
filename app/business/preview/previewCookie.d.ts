export const PREVIEW_SLUG_COOKIE: string;
export const PREVIEW_SLUG_MAX_AGE: number;
export function previewCookieOptions(): { maxAge: number; sameSite: 'lax'; path: string };
export function setPreviewSlugCookie(slug: string, doc?: { cookie: string }): void;
export function clearPreviewSlugCookie(doc?: { cookie: string }): void;
export function readPreviewSlugCookie(doc?: { cookie?: string }): string;
