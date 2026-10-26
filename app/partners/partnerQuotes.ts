/**
 * Quotes from partner organizations, shown on /partners.
 *
 * TRANSCRIBE OR OMIT. A quote goes here only if the person actually said or wrote
 * it and approved this exact wording. Editing for length or an obvious typo is
 * fine; changing what it claims is not. Every entry needs the person, the
 * organization, where it came from, and the date they approved it. If a partner
 * has not said something we can use, leave the list empty: the section hides
 * itself, and an empty section costs less than an invented one.
 *
 * evals/partnerQuotes.test.js fails any entry missing those fields.
 */
export type PartnerQuote = {
  /** The words, as approved. */
  quote: string;
  name: string;
  role: string;
  organization: string;
  /** Where we got it, e.g. "Email to Moil" or "Recorded call". */
  source: string;
  /** YYYY-MM-DD the person approved this exact wording. */
  approvedOn: string;
};

export const PARTNER_QUOTES: readonly PartnerQuote[] = [];
