import { PARTNER_EN } from '../partnerContent';
import type { PartnerCopy } from '../partnerCopy';

/** Subject the lead email carries, so conference leads can be told apart. */
export const IEDC_SUBJECT = 'IEDC 2026 conversation';

/**
 * The English partners page plus the conference banner. Nothing here claims a
 * booth, a session or an offer: only what the rest of the page already says.
 */
export const PARTNER_IEDC_COPY: PartnerCopy = {
  ...PARTNER_EN,
  inquirySubject: IEDC_SUBJECT,
  conference: {
    eyebrow: 'IEDC ANNUAL CONFERENCE · NEW ORLEANS',
    heading: 'Meeting at IEDC? Here is the short version.',
    copy: 'Moil is an AI co-founder for the small businesses your organization supports. It produces their research, plans, documents and content in English and Spanish, so your staff spend their time on the owners. Leave your email and we will follow up directly, or keep scrolling for the full picture.',
    points: [
      'Current partners: Queen Creek Chamber and Buda EDC',
      'English and Spanish, end to end',
      'Owners approve posts before they publish, by default',
    ],
    cta: 'Leave your email',
    message: 'I connected with the Moil team at IEDC in New Orleans. I would like to talk about how Moil could work with our programs.',
  },
};
