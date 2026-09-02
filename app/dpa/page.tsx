import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { COMPANY_NAME, CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Data Processing Addendum",
  description:
    "Summary of Moil's Data Processing Addendum (DPA) for business customers whose use of the Services involves processing personal data.",
  alternates: { canonical: `${baseURL1}/dpa` },
  robots: { index: true, follow: false },
};

export default function DpaPage() {
  const sections = [
    {
      heading: "1. Purpose and Roles",
      text: `This page summarizes how ${COMPANY_NAME} processes personal data on behalf of business customers (for example, employers who process applicant data through the Services). For most such processing, the customer is the "controller" and Moil acts as a "processor". A signed DPA is available on request.`,
    },
    {
      heading: "2. Scope and Instructions",
      text: "We process customer personal data only to provide the Services and according to the customer's documented instructions, the Terms and Conditions, and applicable law.",
    },
    {
      heading: "3. Confidentiality and Security",
      text: "Personnel authorized to process personal data are bound by confidentiality, and we maintain technical and organizational measures appropriate to the risk, including encryption in transit and access controls.",
    },
    {
      heading: "4. Subprocessors",
      text: "We engage the subprocessors listed on our Subprocessors page to help deliver the Services, under contracts that impose data-protection obligations. We remain responsible for their performance. We will give the customer notice before adding or replacing a subprocessor that processes customer personal data, and the customer may object on reasonable data-protection grounds; if we cannot accommodate the objection, the customer may terminate the affected Services.",
    },
    {
      heading: "4a. AI Providers and Model Training",
      text: "Some subprocessors are AI providers, and content the customer submits may be sent to them to generate a response. We instruct those providers not to use customer content to train their models, to the extent each provider's API terms allow. We do not control their internal practices and make no representation beyond that instruction. Two AI providers we use are headquartered in China and one is part of the ByteDance group; the Subprocessors page identifies each by name and headquarters. A customer that requires processing limited to United States-headquartered providers should contact us before submitting data.",
    },
    {
      heading: "5. Data Subject Requests",
      text: "We assist the customer, taking into account the nature of processing, in responding to requests from individuals to exercise their rights under applicable privacy laws.",
    },
    {
      heading: "6. Personal Data Breaches",
      text: "We will notify the customer without undue delay, and in any event within 72 hours, after becoming aware of a personal data breach affecting customer personal data, and provide the information reasonably needed for the customer to meet its own notification obligations. Where Moil is itself required to notify individuals under state breach-notification law, we do so within the period that law allows.",
    },
    {
      heading: "7. Return and Deletion",
      text: "On termination, and at the customer's choice, we will delete or return customer personal data, except where retention is required by law.",
    },
    {
      heading: "8. International Transfers",
      text: "Moil's infrastructure processes data in the United States. Where personal data originating in the European Economic Area or the United Kingdom is transferred, we rely on the Standard Contractual Clauses or another lawful transfer mechanism. Separately, some AI subprocessors are headquartered outside the United States, including in China; that is disclosed by name on the Subprocessors page rather than left to a general clause, because a customer cannot assess a transfer it has not been told about.",
    },
    {
      heading: "8a. California: Service Provider Terms",
      text: `For personal information the customer discloses to us that is subject to the California Consumer Privacy Act as amended, ${COMPANY_NAME} acts as a "service provider". We are prohibited from, and will not: sell or share that personal information; retain, use, or disclose it for any purpose other than performing the Services specified in the agreement, or as otherwise permitted by the CCPA; retain, use, or disclose it outside the direct business relationship with the customer; or combine it with personal information received from another source, except as the CCPA permits. We will notify the customer if we determine we can no longer meet these obligations, and the customer may take reasonable steps to stop and remediate unauthorized use.`,
    },
    {
      heading: "9. Audits",
      text: "On reasonable request and subject to confidentiality, we will make available information necessary to demonstrate compliance with these obligations.",
    },
    {
      heading: "10. Requesting a Signed DPA",
      text: `To execute a DPA, email ${CONTACT_EMAIL}.`,
    },
  ];

  return (
    <LegalPage
      title="Data Processing Addendum (Summary for Business Customers)"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="dpa"
      intro="This is a plain-language summary for business customers and is not a substitute for the signed Data Processing Addendum, which governs in the event of any conflict."
      sections={sections}
    >
      <p className="text-sm text-[#5C6178]">
        Related:{" "}
        <Link href="/subprocessors" className="text-[#FF6633] underline">Subprocessors</Link>,{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>, and{" "}
        <Link href="/terms" className="text-[#FF6633] underline">Terms and Conditions</Link>.
      </p>
    </LegalPage>
  );
}
