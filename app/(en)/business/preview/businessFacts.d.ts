export declare const HOURS_MAX: number;
export declare const FACT_MAX: number;
export declare const DAY_ORDER: readonly string[];

export type FactChip = { id: string; value: string };
export type ScheduleLine = { days: string[]; opens: string; closes: string };
export type BusinessFacts = {
	chips: FactChip[];
	hours: ScheduleLine[];
	rating: { value: number; count: number } | null;
};

export declare function orderDays(days: unknown): string[];
export declare function scheduleLines(hours: unknown): ScheduleLine[];
export declare function businessFacts(body: unknown): BusinessFacts | null;
