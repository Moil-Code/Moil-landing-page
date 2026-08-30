export function normalizeOrigin(raw: unknown): string;
export function getPlanApiOrigin(env?: Record<string, string | undefined>): string;
export function isPlanApiConfigured(origin?: string): boolean;
export function previewSubmitUrl(origin: string): string | null;
export function previewViewUrl(origin: string, slug: string): string | null;
export function buildRegisterUrl(opts?: {
  lang?: 'en' | 'es';
  previewSlug?: string;
  /** Offered ids only; "decide for me" and an empty pick send nothing. */
  platforms?: string[];
  appendLang?: (url: string, lang: 'en' | 'es') => string;
}): string;
export function websiteSubmitBody(input: { website?: string; email?: string; locale?: string }): Record<string, string>;
export function placeSubmitBody(input: { placeId?: string; businessName?: string; email?: string; locale?: string }): Record<string, string>;
export function handleSubmitBody(input: { handle?: string; platform?: string; email?: string; locale?: string }): Record<string, string>;
export function submitPreview(origin: string, body: object, fetchFn?: typeof fetch): Promise<{
  ok: boolean;
  kind: string;
  status: number;
  body: any;
}>;
export function viewPreview(origin: string, slug: string, fetchFn?: typeof fetch): Promise<{
  ok: boolean;
  kind: string;
  status: number;
  body: any;
}>;
export const REGISTER_ORIGIN: string;
