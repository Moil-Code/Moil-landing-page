/**
 * Posts a partnership inquiry. Both forms (the popup and the inline form) go
 * through here so they cannot disagree about where the endpoint is.
 *
 * The first path is /partners/inquiry (a rewrite to the API route) because the
 * host can send bare /api/* requests to a different service, which answers 404.
 * If that path itself 404s, the direct API path is tried once.
 */
export const INQUIRY_PATHS = ['/partners/inquiry', '/api/partner-inquiry'] as const;

export async function postInquiry(payload: Record<string, unknown>): Promise<Response> {
  let response: Response | undefined;
  for (const path of INQUIRY_PATHS) {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.status !== 404) return response;
  }
  return response as Response;
}
