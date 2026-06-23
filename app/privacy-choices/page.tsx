import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Your Privacy Choices",
  description:
    "Exercise your privacy rights with Moil, including access, deletion, correction, and opt-out of sale or sharing of personal information.",
  alternates: { canonical: `${baseURL1}/privacy-choices` },
  robots: { index: true, follow: false },
};

export default function PrivacyChoicesPage() {
  const sections = [
    {
      heading: "1. Your Rights",
      text:
        "Depending on where you live (including California under the CCPA/CPRA and other U.S. states), you may have the right to: know what personal information we collect and how we use it; access or receive a copy of it; correct inaccurate information; delete it; and opt out of any sale or sharing of personal information. You will not be discriminated against for exercising these rights.",
    },
    {
      heading: "2. We Do Not Sell Your Information",
      text: "We do not sell your personal information, and we do not share it for cross-context behavioral advertising in a way that requires an opt-out. You can still submit a request below to record your preference.",
    },
    {
      heading: "3. How to Submit a Request",
      text: `Email ${CONTACT_EMAIL} with the subject "Privacy Request" and tell us which right you want to exercise. We will verify your identity (to protect your data) and respond within the time required by law. An authorized agent may submit a request on your behalf with proof of authorization.`,
    },
    {
      heading: "4. Global Privacy Control (GPC)",
      text: "Where supported, we treat the Global Privacy Control browser signal as a valid opt-out preference for the browser that sends it.",
    },
  ];

  return (
    <LegalPage
      title="Your Privacy Choices"
      lastUpdated="June 23, 2026"
      page="privacy-choices"
      intro="Use this page to understand and exercise your privacy rights."
      sections={sections}
    >
      <p className="text-sm text-[#5C6178]">
        See also our{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link> and{" "}
        <Link href="/cookies" className="text-[#FF6633] underline">Cookie Policy</Link>.
      </p>
    </LegalPage>
  );
}
