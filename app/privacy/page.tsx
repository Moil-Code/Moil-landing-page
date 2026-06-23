import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { COMPANY_NAME, COMPANY_ADDRESS, CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Moil Enterprise Inc. collects, uses, shares, and protects your personal information across our AI business platform, content tools, and job marketplace.",
  alternates: { canonical: `${baseURL1}/privacy` },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  const sections = [
    {
      heading: "1. Introduction",
      text: `This Privacy Policy explains how ${COMPANY_NAME} ("Moil", "we", "us"), with its principal place of business at ${COMPANY_ADDRESS}, collects, uses, shares, and protects personal information when you use our websites, applications, and services at www.moilapp.com and its subdomains (the "Services"). By using the Services you agree to this Policy. It should be read together with our Terms and Conditions.`,
    },
    {
      heading: "2. Information We Collect",
      text:
        "• Account information: name, email, password, and authentication data (including via Google sign-in).\n" +
        "• Profile and career data: for job seekers, this can include employment history, resumes/CVs, skills, and other details you provide.\n" +
        "• Business and brand data: business name, industry, plans, brand colors, logos, and content you create or upload.\n" +
        "• Content and prompts: messages, files, and instructions you submit to the AI coach and content tools.\n" +
        "• Payment information: processed by our payment processor (Stripe). We do not store full card numbers.\n" +
        "• Connected accounts: when you link a social account (e.g., Facebook/Instagram via Meta), we receive tokens and account details needed to publish on your behalf.\n" +
        "• Usage and device data: log data, IP address, device/browser type, pages viewed, and interactions, collected via cookies and similar technologies.",
    },
    {
      heading: "3. How We Use Information",
      text:
        "We use personal information to: provide, maintain, and improve the Services; power AI features (coaching, business plans, content, images, and job matching); personalize your experience; process payments and manage subscriptions; communicate with you (including service and, with your consent where required, marketing messages); ensure security and prevent fraud or abuse; and comply with legal obligations.",
    },
    {
      heading: "4. AI Processing of Your Data",
      text:
        "To generate output, your prompts and relevant content are processed by AI providers we use as service providers (see our Subprocessors page). We do not permit these providers to use your content to train their general, publicly-available models except as configured for the Services, and we may use de-identified or aggregated data to operate, secure, and improve the Services. AI output may be inaccurate — see our Terms and Conditions for important disclaimers.",
    },
    {
      heading: "5. How We Share Information",
      text:
        "We share personal information with: service providers and subprocessors who process data on our behalf (hosting, storage, payments, AI, analytics, email); other users where the Services are designed to do so (e.g., an employer and a candidate in the job marketplace, or a social platform when you direct us to publish); authorities or others when required by law or to protect rights and safety; and a successor entity in a merger, acquisition, or sale of assets. We do not sell your personal information.",
    },
    {
      heading: "6. Cookies and Tracking",
      text:
        "We use strictly necessary, preference, and analytics cookies and similar technologies. You can manage non-essential cookies through our cookie banner and your browser settings. See our Cookie Policy for details.",
    },
    {
      heading: "7. Data Retention",
      text:
        "We keep personal information for as long as your account is active and as needed to provide the Services, then retain it only as required to comply with legal obligations, resolve disputes, and enforce agreements. You can ask us to delete your account and associated data as described below.",
    },
    {
      heading: "8. Data Security",
      text:
        "We use administrative, technical, and organizational safeguards designed to protect personal information, including encryption in transit and access controls. No method of transmission or storage is 100% secure, so we cannot guarantee absolute security.",
    },
    {
      heading: "9. Your Rights and Choices",
      text:
        "Depending on where you live, you may have rights to access, correct, delete, or port your personal information, to object to or restrict certain processing, and to withdraw consent. To exercise any right, email " +
        CONTACT_EMAIL +
        ". We will verify your request and respond within the time required by applicable law. You will not be discriminated against for exercising your rights.",
    },
    {
      heading: "10. U.S. State Privacy Rights (including California)",
      text:
        "Residents of California and other U.S. states with privacy laws have additional rights, including the right to know, delete, and correct personal information, and to opt out of any sale or sharing of personal information. We do not sell personal information and do not share it for cross-context behavioral advertising in a way that requires an opt-out, but you can still submit choices on our Your Privacy Choices page.",
    },
    {
      heading: "11. International Data Transfers",
      text:
        "We are based in the United States and may process and store information in the U.S. and other countries where our providers operate. Where required, we use appropriate safeguards (such as Standard Contractual Clauses) for cross-border transfers.",
    },
    {
      heading: "12. Children's Privacy",
      text:
        "The Services are not directed to children, and we do not knowingly collect personal information from anyone under 18. If you believe a child has provided us information, contact us and we will delete it.",
    },
    {
      heading: "13. Changes to This Policy",
      text:
        "We may update this Policy from time to time. We will update the \"Last updated\" date and, for material changes, may provide additional notice. Your continued use of the Services after changes take effect constitutes acceptance.",
    },
    {
      heading: "14. Contact Us",
      text: `For privacy questions or requests, contact ${COMPANY_NAME} at ${CONTACT_EMAIL} or ${COMPANY_ADDRESS}.`,
    },
  ];

  return (
    <LegalPage title="Moil Privacy Policy" lastUpdated="June 23, 2026" page="privacy" sections={sections}>
      <p className="text-sm text-[#5C6178]">
        Related:{" "}
        <Link href="/cookies" className="text-[#FF6633] underline">Cookie Policy</Link>,{" "}
        <Link href="/subprocessors" className="text-[#FF6633] underline">Subprocessors</Link>,{" "}
        <Link href="/privacy-choices" className="text-[#FF6633] underline">Your Privacy Choices</Link>,{" "}
        <Link href="/dpa" className="text-[#FF6633] underline">Data Processing Addendum</Link>, and{" "}
        <Link href="/terms" className="text-[#FF6633] underline">Terms and Conditions</Link>.
      </p>
    </LegalPage>
  );
}
