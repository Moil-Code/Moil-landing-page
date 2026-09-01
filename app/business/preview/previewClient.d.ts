export const DEFAULT_REGISTER_ORIGIN: string;
export const REGISTER_ORIGIN: string;
export function normalizeOrigin(raw: unknown): string;
export function getRegisterOrigin(env?: Record<string, string | undefined>): string;
export function getRegisterUrl(env?: Record<string, string | undefined>): string;
export function getLoginUrl(env?: Record<string, string | undefined>): string;
export function previewSubmitUrl(): string;
export function previewViewUrl(slug: string): string | null;
export function buildRegisterUrl(opts?: {
  lang?: 'en' | 'es';
  previewSlug?: string;
  /** Offered ids only; "decide for me" and an empty pick send nothing. */
  platforms?: string[];
  appendLang?: (url: string, lang: 'en' | 'es') => string;
  env?: Record<string, string | undefined>;
}): string;
export function websiteSubmitBody(input: { website?: string; email?: string; locale?: string }): Record<string, string>;
export function placeSubmitBody(input: { placeId?: string; businessName?: string; email?: string; locale?: string }): Record<string, string>;
export function handleSubmitBody(input: { handle?: string; platform?: string; email?: string; locale?: string }): Record<string, string>;
export function submitPreview(body: object, fetchFn?: typeof fetch): Promise<{
  ok: boolean;
  kind: string;
  status: number;
  body: any;
}>;
export function viewPreview(slug: string, fetchFn?: typeof fetch): Promise<{
  ok: boolean;
  kind: string;
  status: number;
  body: any;
}>;
