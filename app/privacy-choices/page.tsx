import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "~~/src/common/constants/company";
import OptOutButton from "./OptOutButton";

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
        "Depending on where you live (including California under the CCPA/CPRA, and Colorado, Connecticut, Texas, Virginia and other states), you may have the right to: know what personal information we collect and how we use it; access or receive a portable copy of it; correct inaccurate information; delete it; and opt out of any sale or sharing of personal information and of targeted advertising. You will not be treated differently for exercising these rights.",
    },
    {
      heading: "2. Opt Out of Sale or Sharing",
      text:
        "We do not sell personal information for money. On our public marketing website we use Google Analytics, Microsoft Clarity, the Meta Pixel and Apollo — tools that some state privacy laws treat as a \"sale\" or a \"share\" because they involve passing visit data to another company. Use the button below to opt out on this browser. We do not run any of these tools inside the logged-in Moil application.",
      block: <OptOutButton />,
    },
    {
      heading: "3. Global Privacy Control (GPC)",
      text:
        "We treat the Global Privacy Control browser signal as a valid opt-out for the browser that sends it. If your browser or extension sends GPC, you do not need to do anything else here.",
    },
    {
      heading: "4. Access, Correction, Deletion and Portability",
      text:
        `You can reach us two ways: email ${CONTACT_EMAIL} with the subject "Privacy Request", or write to us at the postal address on our Contact page. Tell us which right you want to exercise. We verify that a request really comes from you — normally by replying to the address on your account — and we respond within the time the law requires, which is 45 days in California and may be extended once where the law allows. There is no charge.`,
    },
    {
      heading: "5. Authorized Agents",
      text:
        "An authorized agent may submit a request for you. We will ask for written permission signed by you, and we may still ask you to confirm the request directly before we act on it.",
    },
  ];

  return (
    <LegalPage
      title="Your Privacy Choices"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="privacy-choices"
      intro="Use this page to understand and exercise your privacy rights."
      sections={sections}
    >
      <p className="text-sm text-[var(--text2)]">
        See also our{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link> and{" "}
        <Link href="/cookies" className="text-[#FF6633] underline">Cookie Policy</Link>.
      </p>
    </LegalPage>
  );
}
