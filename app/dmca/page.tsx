import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { COMPANY_NAME, COMPANY_ADDRESS, CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Copyright & DMCA Policy",
  description:
    "How to report copyright infringement on Moil under the Digital Millennium Copyright Act (DMCA), and how to file a counter-notice.",
  alternates: { canonical: `${baseURL1}/dmca` },
  robots: { index: true, follow: false },
};

export default function DmcaPage() {
  const sections = [
    {
      heading: "1. Our Commitment",
      text: `${COMPANY_NAME} respects intellectual property rights and expects users to do the same. We respond to clear notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).`,
    },
    {
      heading: "2. Reporting Infringement",
      text:
        "If you believe content on the Services infringes your copyright, send a written notice to our Designated Agent (below) that includes: (a) your physical or electronic signature; (b) identification of the copyrighted work; (c) identification of the allegedly infringing material and its location; (d) your contact information; (e) a statement that you have a good-faith belief the use is not authorized; and (f) a statement, under penalty of perjury, that the information is accurate and you are authorized to act.",
    },
    {
      heading: "3. Counter-Notification",
      text:
        "If your content was removed and you believe it was a mistake or misidentification, you may submit a counter-notice with: your signature; identification of the removed material and its prior location; a statement under penalty of perjury that you have a good-faith belief it was removed by mistake; your contact information; and consent to the jurisdiction of the federal court for your district.",
    },
    {
      heading: "4. Repeat Infringers",
      text: "We may, in appropriate circumstances, suspend or terminate accounts of users who are repeat infringers.",
    },
    {
      heading: "5. Designated Agent & Registration",
      text: `Send DMCA notices to our Designated Copyright Agent: ${COMPANY_NAME}, Attn: Copyright Agent, ${COMPANY_ADDRESS}; or by email to ${CONTACT_EMAIL} with the subject line "DMCA Notice".\n\nImportant: Our Designated Copyright Agent is (or will be) registered with the U.S. Copyright Office. For the most current registered-agent details, visit copyright.gov/dmca-directory or contact us directly. Registration is required to fully benefit from DMCA safe-harbor protections.`,
    },
  ];

  return (
    <LegalPage title="Copyright & DMCA Policy" lastUpdated="June 23, 2026" page="dmca" sections={sections}>
      <p className="text-sm text-[#5C6178]">
        See also our{" "}
        <Link href="/terms" className="text-[#FF6633] underline">Terms and Conditions</Link>.
      </p>
    </LegalPage>
  );
}
