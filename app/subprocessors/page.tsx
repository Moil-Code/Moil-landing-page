import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Subprocessors",
  description:
    "The third-party service providers Moil uses to process personal data, including hosting, payments, AI, analytics, and social publishing.",
  alternates: { canonical: `${baseURL1}/subprocessors` },
  robots: { index: true, follow: false },
};

const subprocessors: { name: string; purpose: string; region: string }[] = [
  { name: "Amazon Web Services (AWS)", purpose: "Cloud hosting, storage, and email delivery", region: "USA" },
  { name: "Supabase", purpose: "Database, file storage, and edge functions", region: "USA / EU" },
  { name: "Stripe", purpose: "Payment processing and subscription billing", region: "USA" },
  { name: "Google (Gemini / Cloud)", purpose: "AI generation, grounding, and analytics", region: "USA" },
  { name: "OpenAI", purpose: "AI text and image generation", region: "USA" },
  { name: "Alibaba Cloud (Qwen)", purpose: "AI text and image generation", region: "USA / Global" },
  { name: "xAI (Grok)", purpose: "AI generation and live web search", region: "USA" },
  { name: "Meta Platforms", purpose: "Publishing to Facebook/Instagram when you connect an account", region: "USA" },
  { name: "Segment", purpose: "Product analytics", region: "USA" },
  { name: "Datadog", purpose: "Application monitoring and logging", region: "USA" },
  { name: "Apollo.io", purpose: "Marketing analytics and attribution", region: "USA" },
];

export default function SubprocessorsPage() {
  return (
    <LegalPage
      title="Moil Subprocessors"
      lastUpdated="June 23, 2026"
      page="subprocessors"
      intro="Moil uses the third-party providers below to help deliver the Services. They may process personal data on our behalf under contracts that require appropriate confidentiality and security. This list is representative and current as of the date above; it may change as we add, remove, or replace service providers. Contact us for the most current list."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="border-b border-gray-300 py-2 pr-4 font-[700] text-[#22263A]">Provider</th>
              <th className="border-b border-gray-300 py-2 pr-4 font-[700] text-[#22263A]">Purpose</th>
              <th className="border-b border-gray-300 py-2 font-[700] text-[#22263A]">Region</th>
            </tr>
          </thead>
          <tbody>
            {subprocessors.map((s) => (
              <tr key={s.name} className="align-top">
                <td className="border-b border-gray-100 py-2 pr-4 font-medium text-[#22263A]">{s.name}</td>
                <td className="border-b border-gray-100 py-2 pr-4 text-[#5C6178]">{s.purpose}</td>
                <td className="border-b border-gray-100 py-2 text-[#5C6178]">{s.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[#5C6178]">
        To request the current subprocessor list or to ask a question, email {CONTACT_EMAIL}. See also our{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link> and{" "}
        <Link href="/dpa" className="text-[#FF6633] underline">Data Processing Addendum</Link>.
      </p>
    </LegalPage>
  );
}
