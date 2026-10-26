import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { PartnersBody } from '../PartnersBody';
import { PARTNER_EN } from '../partnerContent';
import { PARTNER_IEDC_COPY } from './iedcCopy';

/**
 * /partners/iedc is the page a QR code or a business card at the IEDC Annual
 * Conference points to. Same body as /partners, plus a short banner and a form
 * that is already filled in, so a visitor in a hallway only types an email.
 *
 * It is a campaign door, not a second page to rank: noindex, canonical to
 * /partners, and not in the sitemap.
 */
export const metadata: Metadata = {
  title: PARTNER_EN.meta.title,
  description: PARTNER_EN.meta.description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${baseURL1}${PARTNER_EN.path}` },
};

export default function PartnersIedcPage() {
  return <PartnersBody copy={PARTNER_IEDC_COPY} />;
}
