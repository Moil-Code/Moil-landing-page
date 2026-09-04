import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Subprocessors",
  description:
    "The third-party providers Moil uses to deliver the Services, what each one processes, and where each company is headquartered.",
  alternates: { canonical: `${baseURL1}/subprocessors` },
  robots: { index: true, follow: false },
};

// One row per provider we actually send data to. A provider is listed here only
// if code in the product calls it — an aspirational entry is as misleading as a
// missing one, and a list nobody can verify is not a disclosure.
//
// `hq` is the company's headquarters, deliberately separate from where data is
// processed. Several AI providers are headquartered outside the United States,
// and an employer deciding whether to put business or applicant information
// into this product is entitled to know that without reading a model registry.
type Row = { name: string; purpose: string; hq: string };

const INFRASTRUCTURE: Row[] = [
  { name: "Amazon Web Services", purpose: "Application hosting, file storage (documents and exports), transactional email delivery", hq: "United States" },
  { name: "Supabase", purpose: "Primary database, file storage, and edge functions for the Business Coach and Moil360", hq: "United States" },
  { name: "MongoDB Atlas", purpose: "Accounts, employer profiles, job posts, and legacy business plans", hq: "United States" },
  { name: "Redis (managed)", purpose: "Session/token revocation lists, rate limiting, short-lived caches", hq: "United States" },
  { name: "Cloudinary", purpose: "Image upload and delivery for files you attach in chat", hq: "Israel / United States" },
];

const AI: Row[] = [
  { name: "Google (Gemini, Cloud, Search grounding)", purpose: "Text, image and video generation; text-to-speech; embeddings; live web grounding", hq: "United States" },
  { name: "OpenAI", purpose: "Text and image generation; text-to-speech; audio transcription; embeddings", hq: "United States" },
  { name: "xAI (Grok)", purpose: "Text and image generation; live web search", hq: "United States" },
  { name: "ElevenLabs", purpose: "Voice narration and the realtime voice coach", hq: "United States / United Kingdom" },
  { name: "DeepSeek", purpose: "Reasoning-tier text generation for in-depth coaching answers", hq: "China" },
  { name: "Alibaba Cloud (Qwen / DashScope)", purpose: "Text, image and video generation; voice synthesis", hq: "China" },
  { name: "BytePlus (Seedance)", purpose: "Image-to-video generation when you choose that engine", hq: "Singapore (ByteDance group)" },
];

const OPTIONAL: Row[] = [
  { name: "Meta Platforms", purpose: "Publishing posts to the Facebook Page or Instagram account you connect", hq: "United States" },
  { name: "Google (Gmail API)", purpose: "Sending an email you compose and approve, from your own Gmail account. Send-only — Moil cannot read your inbox.", hq: "United States" },
  { name: "Stripe", purpose: "Subscription billing; read-only access to a payment account you connect", hq: "United States" },
  { name: "Square", purpose: "Read-only access to a payment account you connect", hq: "United States" },
  { name: "Pexels", purpose: "Licensed stock footage used as b-roll in generated video", hq: "Germany" },
];

const ANALYTICS: Row[] = [
  { name: "Segment", purpose: "Product analytics inside the application", hq: "United States" },
  { name: "Datadog", purpose: "Application monitoring, error tracking, and logs", hq: "United States" },
  { name: "Google Analytics", purpose: "Website analytics (marketing site only, after you accept cookies)", hq: "United States" },
  { name: "Microsoft Clarity", purpose: "Website session analytics (marketing site only, after you accept cookies)", hq: "United States" },
  { name: "Meta Pixel", purpose: "Advertising measurement (marketing site only, after you accept cookies)", hq: "United States" },
  { name: "Apollo.io", purpose: "Marketing attribution (marketing site only, after you accept cookies)", hq: "United States" },
];

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th className="border-b border-gray-300 py-2 pr-4 font-[700] text-[#22263A]">Provider</th>
            <th className="border-b border-gray-300 py-2 pr-4 font-[700] text-[#22263A]">What it processes</th>
            <th className="border-b border-gray-300 py-2 font-[700] text-[#22263A]">Headquarters</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.name} className="align-top">
              <td className="border-b border-gray-100 py-2 pr-4 font-medium text-[#22263A]">{s.name}</td>
              <td className="border-b border-gray-100 py-2 pr-4 text-[#5C6178]">{s.purpose}</td>
              <td className="border-b border-gray-100 py-2 text-[#5C6178]">{s.hq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SubprocessorsPage() {
  const sections = [
    {
      heading: "Infrastructure",
      text: "These providers hold your account and content and support the core operation of Moil. They process data in the United States.",
      block: <Table rows={INFRASTRUCTURE} />,
    },
    {
      heading: "AI providers",
      text: (
        <>
          Moil routes a request to the provider suited to the task, so one piece of content may be
          processed by more than one provider. We send the request and only the business context
          needed to answer it, such as your business name, industry, and saved brand details.
          {"\n\n"}
          <strong>DeepSeek and Alibaba Cloud are headquartered in China</strong>, and BytePlus is
          part of the ByteDance group. If you need your account restricted to providers
          headquartered in the United States, email {CONTACT_EMAIL} before uploading content you
          would not want processed outside the US.
          {"\n\n"}
          We instruct providers not to use your content to train their models to the extent their
          API terms allow. We do not control their internal practices or claim more than that.
        </>
      ),
      block: <Table rows={AI} />,
    },
    {
      heading: "Connected services",
      text: "These services receive data only when you connect the corresponding account. Disconnecting it in Settings stops the flow.",
      block: <Table rows={OPTIONAL} />,
    },
    {
      heading: "Analytics and measurement",
      text: (
        <>
          Marketing-site analytics load only after you choose “Accept all” in the cookie banner,
          and never when your browser sends a Global Privacy Control signal. See our{" "}
          <Link href="/cookies">Cookie Policy</Link> and{" "}
          <Link href="/privacy-choices">Your Privacy Choices</Link>.
        </>
      ),
      block: <Table rows={ANALYTICS} />,
    },
    {
      heading: "Changes and questions",
      text: (
        <>
          We update this page when we add or replace a provider. To request advance notice or ask a
          question about a provider, email {CONTACT_EMAIL}. You can also review our{" "}
          <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/dpa">Data Processing Addendum</Link>.
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Moil Subprocessors"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="subprocessors"
      intro="These are the third-party providers we use to deliver the Services. Each processes personal data on our behalf under a contract requiring confidentiality and appropriate security. We list a provider here only if our software actually sends data to it."
      sections={sections}
    />
  );
}
