import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "~~/src/common/constants/company";

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
      text:
        "Cookies are small text files placed on your device when you visit a website. We also use similar technologies such as local storage, pixels, and SDKs. Together we refer to these as \"cookies\".",
    },
    {
      heading: "2. What Runs on Our Public Website",
      text:
        "Two things run no matter what, because the site cannot work without them:\n" +
        "• Strictly necessary: security, load balancing, and remembering your session. These cannot be switched off.\n" +
        "• Preferences: your language choice, and your answer to the cookie banner itself (stored in your browser so we do not ask again).\n" +
        "Everything below loads only after you choose \"Accept all\", and never when your browser sends a Global Privacy Control signal:\n" +
        "• Google Analytics — how many people visit and which pages they read.\n" +
        "• Microsoft Clarity — aggregated interaction and session-replay data used to find broken layouts.\n" +
        "• Meta Pixel — measures whether an ad we ran led to a visit.\n" +
        "• Apollo — identifies the company a business visitor may belong to, for sales follow-up.\n" +
        "If you choose \"Reject non-essential\", none of those four are loaded at all. They are not added later, and rejecting costs you nothing on the site.",
    },
    {
      heading: "3. What Runs Inside the Moil Application",
      text:
        "Once you are signed in, we use product analytics and session tooling (Segment and Hotjar) to understand which features are used and to debug problems that people report. We do not run advertising or visitor-identification tools inside the application.",
    },
    {
      heading: "4. Managing Your Choices",
      text:
        "The cookie banner is the fastest way to change your mind — it appears on your first visit, and Your Privacy Choices lets you switch off non-essential tools at any time afterwards. You can also control cookies in your browser settings, including deleting or blocking them, though some features will not work if you block strictly necessary cookies. We honour the Global Privacy Control (GPC) browser signal as an opt-out for the browser that sends it.",
    },
    {
      heading: "5. Third-Party Cookies",
      text:
        "The tools named above are operated by the providers listed on our Subprocessors page. Their use of information is governed by their own privacy policies.",
    },
    {
      heading: "6. Changes",
      text:
        "We may update this Cookie Policy from time to time. Material changes will be reflected by the \"Last updated\" date above.",
    },
    {
      heading: "7. Contact",
      text: `Questions about cookies? Email us at ${CONTACT_EMAIL}.`,
    },
  ];

  return (
    <LegalPage
      title="Moil Cookie Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="cookies"
      sections={sections}
    >
      <p className="text-sm text-[var(--text2)]">
        Related:{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>,{" "}
        <Link href="/privacy-choices" className="text-[#FF6633] underline">Your Privacy Choices</Link>, and{" "}
        <Link href="/subprocessors" className="text-[#FF6633] underline">Subprocessors</Link>.
      </p>
    </LegalPage>
  );
}
