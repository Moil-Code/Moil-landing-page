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
export const INTERSTITIAL: string[];
export const SEO_JUNK: string[];
