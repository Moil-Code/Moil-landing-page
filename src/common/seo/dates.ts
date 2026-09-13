/**
 * Article / sitemap dates → ISO-8601 with an explicit timezone.
 *
 * `pageDates.json` stores calendar days (`YYYY-MM-DD`). Google Rich Results
 * Test flags bare dates as "invalid datetime" + "missing a timezone". Append
 * midnight UTC so every consumer (Article datePublished / dateModified) ships
 * a valid, timezone-qualified value without inventing a wall-clock edit time.
 *
 * Values that already include a time (or offset) pass through unchanged.
 */
export function isoDateTimeWithTz(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00.000Z`;
  }
  return date;
}
