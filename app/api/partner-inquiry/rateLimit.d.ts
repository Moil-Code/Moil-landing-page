export declare const WINDOW_MS: number;
export declare const MAX_REQUESTS: number;
export declare const MAX_KEYS: number;

export declare function trustedHops(env?: Record<string, string | undefined>): number;

export declare function clientIp(
	headers: { get(name: string): string | null },
	env?: Record<string, string | undefined>,
): string;

export declare function createLimiter(options?: {
	windowMs?: number;
	max?: number;
	maxKeys?: number;
}): {
	isRateLimited(key: string, now?: number): boolean;
	size(): number;
};
