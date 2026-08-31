export function sanitizeTagline(raw: unknown): string;
export function readyBrandName(brand?: { name?: string } | null): string;
export function canShowReadyCard(brand?: { name?: string } | null): boolean;
export function websiteFieldDecision(read?: {
	ok?: boolean;
	reason?: string;
	website?: string;
} | null):
	| { kind: 'submit'; website: string }
	| { kind: 'refuse_social' }
	| { kind: 'refuse_website' };
export function readPositioning(body?: {
	positioning?: Record<string, unknown>;
	brand?: Record<string, unknown>;
} | null): {
	audience: string;
	problem: string;
	cadence: string;
	voice: string[];
	keyTerms: string[];
	present: boolean;
};
export function shopProducts(brand?: { products?: unknown } | null): string[];
export function shopDescriptor(brand?: { tagline?: unknown; description?: unknown } | null): string;
export function shopFact(brand?: object | null, key?: string): string;
export function captionIsUrlOrEcho(
	caption: unknown,
	brand?: { website?: string; handle?: string } | null,
): boolean;
export function creativeUrlFromPost(post?: object | null): string;
export function realPosts(
	content?: { posts?: unknown[] } | null,
	brand?: object | null,
): Array<{ caption: string; imageUrl: string }>;
export function progressFromBody(body?: object | null): string;
export const INTERSTITIAL: string[];
export const SEO_JUNK: string[];
