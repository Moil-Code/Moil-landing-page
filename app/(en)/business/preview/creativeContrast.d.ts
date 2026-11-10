export const WCAG_AA_NORMAL_TEXT: number;
export const DARK_INK: string;
export const LIGHT_INK: string;
export const DEFAULT_SURFACE: string;
export function normalizeHex(value: unknown, fallback?: string): string;
export function contrastRatio(a: unknown, b: unknown): number;
export function accessibleTextColor(background: unknown, preferred: unknown, minimum?: number): string;
