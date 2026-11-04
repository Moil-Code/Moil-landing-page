export const PLATFORMS: readonly ['instagram', 'facebook', 'tiktok', 'linkedin'];

export type ReadFail = { ok: false; reason: string; platform?: string };

export function readWebsite(
  input: unknown,
): { ok: true; website: string; host: string } | ReadFail;

export function readHandle(
  input: unknown,
  chosenPlatform?: unknown,
): { ok: true; handle: string; platform: string } | ReadFail;

export function readPlaceId(
  input: unknown,
): { ok: true; placeId: string } | ReadFail;

export function platformFromUrl(input: unknown): string;
