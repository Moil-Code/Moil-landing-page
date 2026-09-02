import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import {
  COMPANY_NAME,
  COMPANY_ADDRESS,
  CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
} from "~~/src/common/constants/company";

// ─────────────────────────────────────────────────────────────────────────────
// ATTORNEY REVIEW REQUIRED — five determinations in this document are legal
// calls, not drafting choices. Each is written CONSERVATIVELY (claiming less
// protection for Moil, more disclosure to the user) so that being wrong errs
// toward over-disclosure, which is the survivable direction. A lawyer should
// confirm or narrow each:
//
//  1. SALE / SHARE. §16 says the marketing-site analytics "may" constitute a
//     sale or share under the CCPA. Whether GA4 / Clarity / Meta Pixel /
//     Apollo.io cross that line depends on the contracts in place with each.
//     If they are all service-provider contracts, this can be narrowed; until
//     someone has read them, the honest answer is "may".
//  2. DUAL ROLE ON APPLICANT DATA. Moil is a "business" for its own users and
//     arguably a "service provider" for applicant data an employer processes
//     through it. §17 and the DPA are written for both; confirm the split.
//  3. AUTOMATED DECISIONS. The interview product produces AI analysis of a
//     candidate. NYC Local Law 144 (bias audit + notice), the Illinois AI
//     Video Interview Act (consent + deletion on request), and the Colorado AI
//     Act all potentially attach. This policy discloses the processing; it
//     does NOT claim a bias audit has been performed, because none has.
//  4. RETENTION. Two periods are marked "[to be confirmed by engineering]".
//     They are placeholders on purpose — a published retention period we do
//     not actually honour is worse than an unstated one.
//  5. BREACH TIMING. §13 states the Texas 60-day period. Confirm against every
//     state whose residents we serve; some are shorter.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Moil Enterprise Inc. collects, uses, shares, and protects your personal information across our AI business platform, content tools, and job marketplace.",
  alternates: { canonical: `${baseURL1}/privacy` },
  robots: { index: true, follow: false },
};

/**
 * Notice at Collection (CCPA/CPRA §1798.100(a), 11 CCR §7012).
 *
 * Every row must describe something the product ACTUALLY does. Where a
 * retention period has not been fixed by engineering the cell says so out
 * loud — a number invented here would be a promise nobody is keeping, which
 * is worse than admitting the gap.
 */
const COLLECTION_ROWS: Array<[string, string, string, string, string]> = [
  [
    "Account and identity",
    "You, or Google sign-in",
    "Create and secure your account; support",
    "Hosting, database and email providers",
    "Life of the account, then 30 days",
  ],
  [
    "Business profile and brand",
    "You; your website, when you ask us to read it",
    "Generate plans, content, and brand assets",
    "AI providers; hosting",
    "Life of the account",
  ],
  [
    "Coach conversations and AI memory",
    "You (what you type or say to the coach)",
    "Answer you; remember your business between sessions",
    "AI providers; hosting",
    "Life of the account; individual memories deletable in-app",
  ],
  [
    "Uploaded documents (PDF, DOCX, CSV, XLSX)",
    "You — often exports from Stripe, Shopify, Square or QuickBooks",
    "Answer questions about your own numbers",
    "AI providers; hosting",
    "Life of the account",
  ],
  [
    "Photos and images, which may show people",
    "You (photo library, logo uploads, chat attachments)",
    "Produce your posts, flyers, and video",
    "AI image/video providers; image hosting",
    "Life of the account, unless you delete the photo",
  ],
  [
    "Voice and audio",
    "You, when you use voice features or record an interview answer",
    "Transcribe what you said; speak answers back",
    "Speech-to-text and text-to-speech providers",
    "Transcript kept with the conversation; recordings — see §12",
  ],
  [
    "Financial and transaction data (sensitive)",
    "Stripe Connect / Square, when you connect them; files you upload",
    "Show what you were paid and what is owed; month-end reporting",
    "Hosting only — never sent to advertising networks",
    "Life of the connection; deleted on disconnect",
  ],
  [
    "Connected-account credentials",
    "Meta, Google, Stripe, Square, at your direction",
    "Publish, send, or read only what the feature needs",
    "Not shared; encrypted at rest",
    "Deleted immediately when you disconnect",
  ],
  [
    "Applicant and candidate data",
    "Job seekers, and employers who upload it",
    "Run the job marketplace on the employer's instructions",
    "Hosting; the employer who posted the role",
    "As instructed by the employer; deleted on request",
  ],
  [
    "Location and time zone",
    "You (address fields, Places autocomplete); your browser",
    "Local market research; schedule posts in your own day",
    "Maps provider; hosting",
    "Life of the account",
  ],
  [
    "Usage, device and log data",
    "Your browser and our servers",
    "Security, debugging, service quality",
    "Analytics and monitoring providers",
    "Server logs 30–90 days [to be confirmed by engineering]",
  ],
  [
    "Website-preview data (before signup)",
    "The website address a visitor types on our marketing site",
    "Generate the free preview and, if you leave an email, follow up",
    "AI providers; hosting",
    "12 months if the preview is never claimed [to be confirmed]",
  ],
];

export default function PrivacyPage() {
  const noticeTable = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#EFF1F8] text-left">
            <th className="border border-[#D7DBEA] px-3 py-2 font-semibold">Category</th>
            <th className="border border-[#D7DBEA] px-3 py-2 font-semibold">Where it comes from</th>
            <th className="border border-[#D7DBEA] px-3 py-2 font-semibold">Why we process it</th>
            <th className="border border-[#D7DBEA] px-3 py-2 font-semibold">Who else sees it</th>
            <th className="border border-[#D7DBEA] px-3 py-2 font-semibold">How long we keep it</th>
          </tr>
        </thead>
        <tbody>
          {COLLECTION_ROWS.map((row) => (
            <tr key={row[0]} className="align-top">
              {row.map((cell, i) => (
                <td key={i} className="border border-[#D7DBEA] px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[#5C6178]">
        We do not use any of these categories for cross-context behavioral advertising inside the
        logged-in Moil application. Marketing and analytics tools run on our public website only,
        and only after you accept them — see section 8.
      </p>
    </div>
  );

  const sections = [
    {
      heading: "1. Introduction",
      text: `This Privacy Policy explains how ${COMPANY_NAME} ("Moil", "we", "us"), with its principal place of business at ${COMPANY_ADDRESS}, collects, uses, shares, and protects personal information when you use our websites, applications, and services at www.moilapp.com and its subdomains (the "Services"). By using the Services you agree to this Policy. It should be read together with our Terms and Conditions.`,
    },
    {
      heading: "2. Information We Collect",
      text:
        "• Account and identity: name, email, password, and authentication data (including Google sign-in).\n" +
        "• Business and brand data: business name, industry, plans, brand colors, fonts, logos, products, offers, and anything you tell the coach about your business. If you give us your website address, we read the public page to extract your brand.\n" +
        "• Content and prompts: messages, files, and instructions you submit to the AI coach and the content tools, including the documents you upload (PDF, Word, CSV, and Excel — commonly sales exports from Stripe, Shopify, Square or QuickBooks).\n" +
        "• Photographs and images, which may include images of people you have photographed.\n" +
        "• Voice and audio: when you use a voice feature, your speech is streamed to a transcription provider; when the coach speaks, the text is sent to a speech provider. Interview-practice answers are recorded as audio you upload.\n" +
        "• Financial and transaction data: if you connect Stripe or Square, we read your own payments and invoices; uploaded sales exports contain the same kind of data.\n" +
        "• Connected accounts: when you link Meta (Facebook/Instagram), Google (send-only Gmail), Stripe, or Square, we receive and store the access credentials and account details the feature needs.\n" +
        "• Applicant and candidate data: job seekers provide profile, employment history, and résumé data; employers may upload information about applicants, which we process on the employer's behalf.\n" +
        "• Location and time zone: addresses you enter, places you select from autocomplete, and the time zone your browser reports (so your posts publish on your own day).\n" +
        "• Inferred and derived data: the coach keeps a working memory of facts about your business, and computes metrics and milestones from what you have told it.\n" +
        "• Usage and device data: log data, IP address, device and browser type, pages viewed, and interactions, collected via cookies and similar technologies.\n" +
        "• Prospective-customer data: if you use the free preview on our marketing site before creating an account, we store the business website you entered and, if you choose to give it, your email address.",
    },
    {
      heading: "3. Notice at Collection",
      text:
        "This table summarises what we collect, why, who else sees it, and how long we keep it. It is the Notice at Collection required by California law and is a useful summary wherever you live.",
      block: noticeTable,
    },
    {
      heading: "4. Sensitive Information",
      text:
        "Some features involve information that state privacy laws treat as sensitive:\n" +
        "• Financial account and transaction data, when you connect Stripe or Square or upload a sales export.\n" +
        "• Audio of your voice, when you use voice features or record an interview answer.\n" +
        "• Precise location, if you choose to share it for local market research.\n" +
        "We process this information only to provide the feature you turned on. We ask for your permission at the moment you connect the account or enable the feature. We do not use it for advertising, we do not use voice audio to identify you, and we do not sell or share it. You can withdraw permission at any time by disconnecting the account or turning the feature off, which stops the processing and deletes the stored credentials.",
    },
    {
      heading: "5. How We Use Information",
      text:
        "We use personal information to: provide, maintain, and improve the Services; power AI features (coaching, business plans, content, images, video, voice, and job matching); personalize your experience; process payments and manage subscriptions; communicate with you (service messages always, and marketing messages where you have consented or where the law allows); keep the Services secure and prevent fraud or abuse; and comply with legal obligations.",
    },
    {
      heading: "6. AI Processing of Your Data",
      text:
        "To generate output, your prompts and the relevant parts of your business data are sent to the AI providers listed on our Subprocessors page. They act as our service providers and are bound by our agreements with them.\n" +
        "Training: we do not ask any provider to train on your content, and we do not send your content to any provider for that purpose. Each provider's own API terms govern what they may do with data sent to their API; the Subprocessors page records each provider's position. Two providers deserve a specific mention because of where they are based: DeepSeek (used for the deeper reasoning behind some strategic coaching answers) and Alibaba Cloud Model Studio / Qwen (used for text and image generation). If you would rather your business data were not processed by a particular provider, contact us before using the affected feature.\n" +
        "Learning across customers: we use aggregated, de-identified patterns — never your name, your business name, or your figures — to improve the advice the coach gives other businesses. Nothing that identifies you or your business leaves your account.\n" +
        "AI output may be inaccurate. See our Terms and Conditions for the disclaimers that apply.",
    },
    {
      heading: "7. GOOGLE USER DATA",
      text:
        "If you connect a Google account, we access only the data needed to provide the features you request, and we ask for the narrowest scopes required. Moil requests send-only Gmail access (gmail.send) together with basic identity (openid, email, profile). Moil cannot read, search, modify or delete any message in your Gmail account. We use your Google account address only to show you which account is connected and to set the correct sender address on email you approve.\n" +
        "Moil's use of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements. Specifically:\n" +
        "• We do not use Google user data to develop, improve, or train generalized or non-personalized artificial intelligence or machine learning models, and we do not transfer Google user data to any third-party AI or ML service.\n" +
        "• We never send the contents of your Gmail account, your recipients' addresses, or your Google account identifiers to any AI provider.\n" +
        "• We do not transfer Google user data to third parties except as necessary to provide the services, comply with applicable law, or as part of a merger, acquisition or sale of assets with your consent.\n" +
        "• We do not use Google user data for advertising.\n" +
        "• We do not allow humans to read Google user data unless we have your consent, it is necessary for security or to comply with applicable law, or the data is aggregated and de-identified.\n" +
        `You can revoke Moil's access at any time in your Google Account permissions, and you can ask us to delete Google user data we hold by emailing ${CONTACT_EMAIL}.`,
    },
    {
      heading: "8. Meta (Facebook and Instagram)",
      text:
        "If you connect Meta so that Moil can publish for you, we receive and store: the list of Facebook Pages you administer, an access token for the Page you choose, the linked Instagram business account identifier, your Meta account display name, the identifiers of posts we publish, and the engagement metrics for those posts. We use this only to publish what you approve and to report back how those posts performed. We do not use it for advertising and we do not sell or share it.\n" +
        "You can disconnect Meta at any time in Settings, which revokes Moil's authorization at Meta and deletes the stored tokens. You can also remove Moil from Facebook's \"Apps and Websites\" settings; Moil operates the data-deletion callback and status page that Meta requires for that flow.",
    },
    {
      heading: "9. Payment Connections (Stripe and Square)",
      text:
        "Stripe is our payment processor for your Moil subscription. Separately, you can connect your own Stripe or Square account so Moil can show you what you have been paid and what is outstanding.\n" +
        "These connections are read-only in behaviour. Moil reads charges, invoices and merchant profile data; Moil never initiates a charge, a refund, or a transfer of your money. Square grants Moil read-only scopes. Stripe does not offer a read-only scope to platform applications like ours, so the credential Stripe issues is broader than what we use it for — we constrain it in our code, and the connected-account data we read is only what is described here. Disconnecting in Settings deletes the stored credential.",
    },
    {
      heading: "10. How We Share Information",
      text:
        "We share personal information with: service providers and subprocessors who process data on our behalf (hosting, storage, payments, AI, analytics, email — see our Subprocessors page); other users where the Services are designed to do so (an employer and a candidate in the job marketplace, or a social platform when you direct us to publish); authorities or others when required by law or to protect rights and safety; and a successor entity in a merger, acquisition, or sale of assets.\n" +
        "We do not sell personal information for money. On our public marketing website we use analytics and marketing tools that some state laws treat as a \"sale\" or \"share\" — see section 12.",
    },
    {
      heading: "11. Cookies and Tracking",
      text:
        "On our public marketing website we use strictly necessary cookies, plus Google Analytics, Microsoft Clarity, the Meta Pixel, and the Apollo visitor tool. Those four load only after you choose \"Accept all\" in our cookie banner, and never when your browser sends a Global Privacy Control signal. Inside the logged-in Moil application we use product analytics and session tooling (Segment, Hotjar) to understand how features are used and to debug problems. See our Cookie Policy for the detail, and Your Privacy Choices to change your mind at any time.",
    },
    {
      heading: "12. Data Retention",
      text:
        "We keep personal information for as long as your account is active and as needed to provide the Services, then only as required to comply with legal obligations, resolve disputes, and enforce agreements. Section 3 gives the period for each category. A few specifics worth stating plainly:\n" +
        "• Documents you generate and download are removed from our export storage shortly after the download link expires (about 17 minutes).\n" +
        "• Connected-account credentials are deleted immediately when you disconnect.\n" +
        "• Coach conversations and the AI memory built from them are kept for the life of the account; you can delete individual memories from the memory panel at any time.\n" +
        "• Voice: we keep the transcript as part of your conversation. Retention of raw interview-practice recordings is being finalised [to be confirmed by engineering]; ask us and we will delete a specific recording.",
    },
    {
      heading: "13. Data Security",
      text:
        "We use administrative, technical, and organizational safeguards designed to protect personal information, including encryption in transit, encryption of connected-account credentials at rest, and access controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.\n" +
        "If a security incident affects your personal information, we will notify you and any regulator we are required to notify without unreasonable delay and within the time the law requires. For Texas residents that is no later than 60 days after we determine that a breach occurred.",
    },
    {
      heading: "14. Your Rights and Choices",
      text:
        "Depending on where you live, you may have the right to access, correct, delete, or receive a portable copy of your personal information, to object to or restrict certain processing, and to withdraw consent. You will not be treated differently for exercising any of these rights.\n" +
        "How to reach us: email " +
        CONTACT_EMAIL +
        ", or use the form on our Your Privacy Choices page. We verify that a request really comes from you (usually by replying from the address on the account) and respond within the time the law requires — 45 days in California, extendable once where the law allows. An authorized agent may act for you with written permission.",
    },
    {
      heading: "15. Deleting Your Account and Data",
      text:
        `Email ${CONTACT_EMAIL} with the subject "Delete my account" from the address on your account. Self-service deletion and export are being built into Settings; until they ship, this is the way to make the request, and we treat it exactly the same.\n` +
        "Once we have confirmed it is you, we delete your account, business profile, conversations, uploaded files, generated content, connected-account credentials, and voice-session records within 45 days, with three exceptions we want you to know about:\n" +
        "• Records we must keep for tax, accounting, fraud-prevention, or legal-hold reasons.\n" +
        "• Content you have already published to a third-party platform, which is governed by that platform — you delete it there.\n" +
        "• A minimal deletion marker: when you delete a single remembered fact, we keep a one-way marker of it so the coach does not learn the same fact back from your existing conversations. The marker cannot be read back as the original text and exists only to make your deletion stick.\n" +
        "Disconnecting Facebook, Instagram, Google, Stripe, or Square deletes the related credentials straight away and stops us reading that account.",
    },
    {
      heading: "16. U.S. State Privacy Rights (including California)",
      text:
        "If you live in California, Colorado, Connecticut, Texas, Virginia, or another state with a comprehensive privacy law, you have the right to know what personal information we collect, to access, correct, and delete it, to obtain a portable copy, and to opt out of the \"sale\" of personal information, of \"sharing\" or processing for targeted (cross-context behavioral) advertising, and of certain profiling.\n" +
        "We use third-party marketing and analytics tools on our public marketing website — currently Google Analytics, Microsoft Clarity, the Meta Pixel, and Apollo — that these laws may treat as a \"sale\" or a \"share\". You can opt out at any time by choosing \"Reject non-essential\" in our cookie banner, by using the Your Privacy Choices page, by emailing us, or by enabling the Global Privacy Control signal in your browser, which we honour as a valid opt-out. We do not run these tools inside the logged-in Moil application, and we do not knowingly sell or share the personal information of anyone under 16.",
    },
    {
      heading: "17. Where We Operate and International Transfers",
      text:
        "The Services are offered to users in the United States, and we process and store information in the U.S. and in other countries where our providers operate. If you access the Services from the European Economic Area or the United Kingdom: " +
        COMPANY_NAME +
        " is the controller of your personal information, you may exercise the rights described above by writing to " +
        CONTACT_EMAIL +
        ", you may lodge a complaint with your local supervisory authority, and where required we use appropriate safeguards (such as Standard Contractual Clauses) for cross-border transfers.",
    },
    {
      heading: "18. Children's Privacy",
      text:
        "The employer side of the Services is for adults: you must be 18 or older to create a business account. Job seekers must be at least 16, and where the law requires parental consent for someone under 18 it is the job seeker's and their guardian's responsibility to have it. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us information, contact us and we will delete it.",
    },
    {
      heading: "19. Changes to This Policy",
      text:
        "We may update this Policy from time to time. We will update the \"Last updated\" date and, for material changes, give you at least 30 days' notice by email before they take effect. Your continued use of the Services after that constitutes acceptance.",
    },
    {
      heading: "20. Contact Us",
      text: `For privacy questions or requests, contact ${COMPANY_NAME} at ${CONTACT_EMAIL} or ${COMPANY_ADDRESS}.`,
    },
  ];

  return (
    <LegalPage
      title="Moil Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      page="privacy"
      sections={sections}
    >
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
