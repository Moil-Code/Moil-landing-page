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
            <th className="border-b border-[var(--border2)] py-2 pr-4 font-[700] text-[var(--text)]">Provider</th>
            <th className="border-b border-[var(--border2)] py-2 pr-4 font-[700] text-[var(--text)]">What it processes</th>
            <th className="border-b border-[var(--border2)] py-2 font-[700] text-[var(--text)]">Headquarters</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.name} className="align-top">
              <td className="border-b border-[var(--border)] py-2 pr-4 font-medium text-[var(--text)]">{s.name}</td>
              <td className="border-b border-[var(--border)] py-2 pr-4 text-[var(--text2)]">{s.purpose}</td>
              <td className="border-b border-[var(--border)] py-2 text-[var(--text2)]">{s.hq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SubprocessorsPage() {
  return (
    <LegalPage
      title="Moil Subprocessors"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="subprocessors"
      intro="These are the third-party providers we use to deliver the Services. Each processes personal data on our behalf under a contract requiring confidentiality and appropriate security. We list a provider here only if our software actually sends data to it."
    >
      <h2 className="mt-8 text-lg font-[700] text-[var(--text)]">Infrastructure</h2>
      <p className="text-sm text-[var(--text2)]">
        These hold your account and your content. All of them process data in the United States.
      </p>
      <Table rows={INFRASTRUCTURE} />

      <h2 className="mt-8 text-lg font-[700] text-[var(--text)]">AI providers</h2>
      <p className="text-sm text-[var(--text2)]">
        Moil routes a request to whichever provider is available and suited to the task, so a single
        piece of content may be processed by more than one of these. What we send is the text of your
        request plus the business context needed to answer it — for example your business name,
        industry, and the brand details you have saved.
      </p>
      <p className="text-sm text-[var(--text2)]">
        <strong>Two of these companies are headquartered in China</strong> (DeepSeek and Alibaba
        Cloud) and one is part of the ByteDance group (BytePlus). We name them because you should be
        able to decide, with that in hand, what you put into the product. If you need your account
        restricted to United States–headquartered providers, email {CONTACT_EMAIL} — say so before
        you upload anything you would not want processed outside the US.
      </p>
      <p className="text-sm text-[var(--text2)]">
        We instruct providers not to use your content to train their models, to the extent each
        provider&apos;s API terms allow. We do not control their internal practices and we do not
        claim more than that.
      </p>
      <Table rows={AI} />

      <h2 className="mt-8 text-lg font-[700] text-[var(--text)]">Only when you connect them</h2>
      <p className="text-sm text-[var(--text2)]">
        Nothing below receives your data unless you connect that account yourself. Disconnecting it
        in Settings stops the flow.
      </p>
      <Table rows={OPTIONAL} />

      <h2 className="mt-8 text-lg font-[700] text-[var(--text)]">Analytics</h2>
      <p className="text-sm text-[var(--text2)]">
        The four marketing-site tools load only after you choose &quot;Accept all&quot; on the cookie
        banner, and never when your browser sends a Global Privacy Control signal. See{" "}
        <Link href="/cookies" className="text-[#FF6633] underline">Cookies</Link> and{" "}
        <Link href="/privacy-choices" className="text-[#FF6633] underline">Your Privacy Choices</Link>.
      </p>
      <Table rows={ANALYTICS} />

      <h2 className="mt-8 text-lg font-[700] text-[var(--text)]">Changes to this list</h2>
      <p className="text-sm text-[var(--text2)]">
        We update this page when we add or replace a provider. To be notified of changes in advance,
        or to ask a question about any provider here, email {CONTACT_EMAIL}. See also our{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link> and{" "}
        <Link href="/dpa" className="text-[#FF6633] underline">Data Processing Addendum</Link>.
      </p>
    </LegalPage>
  );
}
