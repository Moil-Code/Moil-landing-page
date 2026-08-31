export const WAIT_STEP_IDS: readonly string[];
export const SECTION_ORDER: readonly string[];
export const HEADING_KEY: Record<string, string>;
export const BANNED_HEADING_IDS: readonly string[];
export function asText(value: unknown): string;
export function asList(value: unknown): string[];
export function httpsUrl(raw: unknown): string;
export function waitStepsFromBody(body?: object | null): string[];
export function overviewFromBrand(brand?: object | null): string;
export function httpsPhotos(brand?: object | null): string[];
export function logoUrl(brand?: object | null): string;
export function colorRow(brand?: object | null): string[];
export function voiceFromBody(body?: {
	brand?: object;
	positioning?: object;
} | null): { chips: string[]; sentence: string };
export function scheduleFromPick(selected?: unknown): string[];
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
	observeOnly?: boolean;
}>;
export function headingKeyFor(id: string): string;
