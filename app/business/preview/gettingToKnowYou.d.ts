export const WAIT_BEAT_HEADINGS: readonly string[];
export const WAIT_BEAT_HEADING_KEY: Record<string, string>;
export const TYPEOUT_MS_PER_CHAR: number;
export const SECTION_ORDER: readonly string[];
export const HEADING_KEY: Record<string, string>;
export const BANNED_HEADING_IDS: readonly string[];
export const FOLDED_LINE_MAX: number;
export function asText(value: unknown): string;
export function asList(value: unknown): string[];
export function httpsUrl(raw: unknown): string;
export function foldBeatHeading(raw?: unknown): string;
export function waitBeatsFromBody(body?: object | null): Array<{ heading: string; text: string }>;
export function waitBeatHeadingKey(heading: string): string;
export function typedText(text?: unknown, charCount?: unknown, reduceMotion?: boolean): string;
export function overviewFromBrand(brand?: object | null): string;
export function httpsPhotos(brand?: object | null): string[];
export function logoUrl(brand?: object | null): string;
export function colorRow(brand?: object | null): string[];
export function voiceFromBody(body?: {
	brand?: object;
	positioning?: object;
} | null): { chips: string[]; sentence: string };
export function scheduleFromPick(selected?: unknown): string[];
export function isMoilNavLine(raw?: unknown): boolean;
export function foldShopCtas(raw?: unknown): string[];
export function foldShopSlogans(raw?: unknown): string[];
export function knowingLeadFromBody(body?: {
	brand?: object;
	positioning?: object;
} | null): Array<{ heading: string; text: string }>;
export function proofFromBrand(brand?: object | null): {
	id: string;
	kind: string;
	logo: string;
	colors: string[];
	photos: string[];
} | null;
export function profileSections(
	body?: {
		brand?: object;
		positioning?: object;
		content?: object;
	} | null,
	opts?: { selected?: string[] },
): Array<{
	id: string;
	kind: string;
	value?: string | string[];
	chips?: string[];
	sentence?: string;
	logo?: string;
	colors?: string[];
	photos?: string[];
	observeOnly?: boolean;
}>;
export function headingKeyFor(id: string): string;
