import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how Moil uses cookies and similar technologies, the categories we use, and how to manage your preferences.",
  alternates: { canonical: `${baseURL1}/cookies` },
  robots: { index: true, follow: false },
};

export default function CookiesPage() {
  const sections = [
    {
      heading: "1. What Are Cookies?",
      text: "Cookies are small text files placed on your device when you visit a website. We also use similar technologies such as local storage, pixels, and SDKs. Together we refer to these as \"cookies\".",
    },
    {
      heading: "2. Categories of Cookies We Use",
      text:
        "• Strictly necessary: required for the site to work (security, load balancing, remembering your session and consent choice). These cannot be switched off.\n" +
        "• Preferences: remember choices such as your language.\n" +
        "• Analytics: help us understand how the site is used so we can improve it (for example, Segment and Datadog).\n" +
        "• Marketing/attribution: help us measure campaigns and understand visitor interest (for example, Apollo).",
    },
    {
      heading: "3. Managing Your Cookies",
      text:
        "When you first visit, our cookie banner lets you accept or reject non-essential cookies. You can also control cookies through your browser settings, including deleting or blocking them — though some features may not work if you block strictly necessary cookies. Where supported, we honor the Global Privacy Control (GPC) browser signal.",
    },
    {
      heading: "4. Third-Party Cookies",
      text: "Some cookies are set by the third-party providers listed on our Subprocessors page. Their use of information is governed by their own privacy policies.",
    },
    {
      heading: "5. Changes",
      text: "We may update this Cookie Policy from time to time. Material changes will be reflected by the \"Last updated\" date above.",
    },
    {
      heading: "6. Contact",
      text: `Questions about cookies? Email us at ${CONTACT_EMAIL}.`,
    },
  ];

  return (
    <LegalPage title="Moil Cookie Policy" lastUpdated="June 23, 2026" page="cookies" sections={sections}>
      <p className="text-sm text-[#5C6178]">
        Related:{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>,{" "}
        <Link href="/privacy-choices" className="text-[#FF6633] underline">Your Privacy Choices</Link>, and{" "}
        <Link href="/subprocessors" className="text-[#FF6633] underline">Subprocessors</Link>.
      </p>
    </LegalPage>
  );
}
