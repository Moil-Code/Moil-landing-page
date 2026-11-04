export const EVENTS: Readonly<Record<string, readonly string[]>>;
export const EVENTS_URL: string;
export const LANDING_EVENTS: readonly string[];
export const MAX_STR: number;
export function buildEvent(
	name: string,
	props?: Record<string, unknown> | null,
): { event: string; props: Record<string, string | number | boolean> } | null;
export function emitFunnelEvent(
	name: string,
	props?: Record<string, unknown> | null,
	slug?: string | null,
	fetchFn?: typeof fetch,
): void;
export function safeValue(v: unknown): string | number | boolean | undefined;
