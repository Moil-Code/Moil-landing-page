export type AdParams = Partial<Record<
  'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'fbclid',
  string
>>;

export type ScarcityConfig = { mode: 'none' | 'deadline'; endsAt: string | null };

export type ScarcityState =
  | { kind: 'none' }
  | { kind: 'deadline'; endsAtMs: number; msLeft: number }
  | { kind: 'closed' };

export const AD_PARAM_KEYS: readonly string[];
export const AD_STORAGE_KEY: string;
export function adParamsFromSearch(search: string): AdParams;
export function readAdParams(storage: Pick<Storage, 'getItem'>): AdParams;
export function rememberAdParams(storage: Pick<Storage, 'getItem' | 'setItem'>, search: string): AdParams;
export function trialRegisterHref(registerUrl: string, lang: 'en' | 'es', adParams?: AdParams): string;
export function scarcityState(config: ScarcityConfig, nowMs: number): ScarcityState;
export function countdownParts(msLeft: number): { days: number; hours: number; minutes: number; seconds: number };
export function claimVisible(claimId: string | undefined, signedOff: Record<string, boolean>, reviewMode: boolean): boolean;
export function crossedDepths(fraction: number, alreadySent: Set<number>): number[];
