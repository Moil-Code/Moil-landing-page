// Central company identity used across legal / compliance pages.
//
// TODO(legal): full street address required for CAN-SPAM, DMCA agent directory
// and CCPA. City/state alone is not a "valid physical postal address" under
// CAN-SPAM, the Copyright Office DMCA agent directory requires a full address,
// and CCPA §1798.130 requires a designated method for requests that can include
// a postal address. COMPANY_ADDRESS is deliberately left as-is rather than
// guessed at — a wrong address printed in a legal notice is worse than an
// incomplete one. Replace it here and every legal page picks it up.
export const COMPANY_NAME = "Moil Enterprise Inc.";
export const COMPANY_ADDRESS = "Buda, TX, USA";
export const CONTACT_EMAIL = "cs@moilapp.com";

// One date for the September 2026 legal refresh. Each page reads it so the
// "Last updated" line and the changelog cannot drift apart.
export const LEGAL_LAST_UPDATED = "September 1, 2026";
export const LEGAL_LAST_UPDATED_ES = "1 de septiembre de 2026";
