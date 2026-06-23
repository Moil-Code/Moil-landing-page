import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { COMPANY_NAME, CONTACT_EMAIL } from "~~/src/common/constants/company";

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
      text: "We engage the subprocessors listed on our Subprocessors page to help deliver the Services, under contracts that impose data-protection obligations. We remain responsible for their performance.",
    },
    {
      heading: "5. Data Subject Requests",
      text: "We assist the customer, taking into account the nature of processing, in responding to requests from individuals to exercise their rights under applicable privacy laws.",
    },
    {
      heading: "6. Personal Data Breaches",
      text: "We will notify the customer without undue delay after becoming aware of a personal data breach affecting customer personal data, and provide information reasonably needed to meet notification obligations.",
    },
    {
      heading: "7. Return and Deletion",
      text: "On termination, and at the customer's choice, we will delete or return customer personal data, except where retention is required by law.",
    },
    {
      heading: "8. International Transfers",
      text: "Where personal data is transferred across borders, we rely on appropriate safeguards such as the Standard Contractual Clauses where required.",
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
      lastUpdated="June 23, 2026"
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
