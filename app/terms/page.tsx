"use client";

import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import {
  COMPANY_NAME,
  COMPANY_ADDRESS,
  CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
} from "~~/src/common/constants/company";

// Section numbering changed on September 1, 2026. Old §14–§24 are now §16–§28
// because §14 (Automated Actions) and §15 (Beta Features) were inserted, and
// §21 (Moil's infringement defense) and §26 (Language) were added. The
// changelog at the bottom of the page lists every substantive change.
//
// TODO(legal): full street address required for CAN-SPAM, DMCA agent directory
// and CCPA — COMPANY_ADDRESS is city/state only (see src/common/constants/company.ts).

export default function TermsPage() {
  const lastUpdated = LEGAL_LAST_UPDATED;

  const terms = [
    {
      heading: "1. Agreement to These Terms",
      text:
        "These Terms and Conditions (\"Terms\") are a binding agreement between you and " +
        COMPANY_NAME +
        " (\"Moil\", \"we\", \"us\"), with its principal place of business in " +
        COMPANY_ADDRESS +
        ". They govern your access to and use of our websites, applications, and services available at www.moilapp.com and its subdomains (the \"Services\"). By creating an account, clicking \"I agree\", or otherwise accessing or using the Services, you accept these Terms and our Privacy Policy, which is incorporated by reference. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you represent that you are authorized to bind that organization to these Terms, and \"you\" includes that organization.",
    },
    {
      // ATTORNEY REVIEW REQUIRED: candidate minimum age (16) and the
      // parental-consent condition for 16–17 year olds. State minors' laws
      // (e.g. California, Texas SCOPE Act) and COPPA (under 13) should be
      // checked against the actual candidate onboarding flow before this ships.
      heading: "2. Eligibility",
      text:
        "Business accounts. You must be at least 18 years old and able to form a legally binding contract to create a business account, subscribe to a paid plan, post a job, connect a third-party account, or use the AI coach and marketing tools.\n" +
        "Job seekers. You may create a job-seeker profile if you are at least 16 years old. If you are 16 or 17, you confirm that a parent or legal guardian has reviewed these Terms and consents to your use of the Services where the law requires that consent.\n" +
        "The Services are not directed to children under 16, and we do not knowingly collect personal information from anyone under 16. You are responsible for making sure your use of the Services complies with all laws that apply to you.",
    },
    {
      heading: "3. Your Account",
      text:
        "To access most features you must create an account and provide accurate, current, and complete information. You are responsible for safeguarding your login credentials and for all activity that occurs under your account. Notify us immediately at " +
        CONTACT_EMAIL +
        " if you suspect unauthorized use. You may register or sign in using a third-party provider (such as Google); your use of that provider remains subject to its own terms.",
    },
    {
      heading: "4. The Services",
      text:
        "Moil provides AI-assisted tools for small businesses and workers. These may include an AI business coach, business planning and market research, AI-generated documents, AI-generated content such as images, logos, marketing materials, videos and social media posts (\"Moil360\"), tools that publish content and send email on your behalf once you set them up (see Section 14), read-only connections to payment providers, a job marketplace connecting employers and candidates, and related features. We may add, change, suspend, or remove features at any time. Some features are provided on a paid basis as described below.",
    },
    {
      heading: "5. Subscriptions, Billing and Auto-Renewal",
      text:
        "Certain features require a paid subscription. Prices are stated at the point of purchase. Paid plans are billed in advance on a recurring basis (for example, monthly) and automatically renew for successive periods at the then-current price until you cancel. By subscribing, you authorize us and our payment processor (Stripe) to charge your payment method for each renewal until you cancel. We do not store full card numbers; payments are processed by Stripe under its own terms.\n" +
        "Price and plan changes. We may change prices or plan features on a going-forward basis. We will email you at the address on your account at least 30 days before a price increase takes effect. The new price applies from your first renewal after that notice period. If you do not agree to the new price, cancel before that renewal and you will not be charged it.",
    },
    {
      heading: "6. Cancellations and Refunds",
      text:
        "You may cancel your subscription at any time through your account settings or by contacting " +
        CONTACT_EMAIL +
        ". Cancellation stops future renewals; you keep access until the end of your current paid period. Except where applicable law requires otherwise, payments are non-refundable, and we do not provide refunds or credits for partial periods, unused features, or content already generated.",
    },
    {
      heading: "7. Free Trials and Promotions",
      text:
        "We may offer free trials or promotional pricing. Unless we tell you otherwise, at the end of a free trial your subscription automatically converts to a paid plan and your payment method is charged at the then-current price unless you cancel before the trial ends. We may modify or withdraw trials and promotions at any time.",
    },
    {
      heading: "8. AI-Generated Content and No Professional Advice",
      text:
        "The Services use artificial intelligence to generate text, plans, documents, images, videos, audio, and other outputs (\"AI Output\"). AI Output may be inaccurate, incomplete, outdated, or unsuitable for your situation, and may not be unique to you. AI Output is provided for general informational purposes only and is NOT legal, financial, tax, accounting, employment, or other professional advice. You are solely responsible for reviewing, verifying, and deciding whether to rely on any AI Output, and you should consult a qualified professional before making decisions. Moil is not liable for actions you take based on AI Output.\n" +
        "Templates, not advice. Some AI Output takes the form of contracts, non-disclosure agreements, operating agreements, policies, invoices, quotes, financial models, or similar documents. These are general templates generated from the information you provide. They are not tailored legal, tax, or financial advice and have not been reviewed by a lawyer or accountant. Have a licensed professional in your jurisdiction review any such document before you sign it, send it, file it, or rely on it.\n" +
        "Moil is not a law firm, an accounting firm, or a registered investment adviser. Using the Services does not create an attorney-client, accountant-client, or fiduciary relationship between you and Moil.",
    },
    {
      heading: "9. Ownership and Use of AI Output",
      text:
        "As between you and Moil, and subject to your compliance with these Terms and any applicable third-party AI provider terms, you may use the AI Output you generate for your lawful business and personal purposes. AI Output may not be legally protectable, may resemble output provided to others, and may be subject to third-party rights. You are responsible for confirming that your use of AI Output (including images, videos and logos) does not infringe any third party's intellectual property, publicity, or other rights.",
    },
    {
      heading: "10. Your Content and License to Moil",
      text:
        "You keep ownership of the content, files, prompts, business information, brand assets, photos, recordings, and other materials you submit or connect (\"Your Content\").\n" +
        "License. You grant Moil a worldwide, non-exclusive, royalty-free license — sublicensable solely to the service providers that help us operate the Services (listed on our Subprocessors page) — to host, store, reproduce, process, adapt, transcribe, and display Your Content as needed to provide, secure, and improve the Services and, where you direct us to (for example, by connecting a social account or approving an email), to publish or send it on your behalf.\n" +
        "No training on Your Content. We do not use Your Content to train general-purpose AI models, and we do not permit our AI providers to do so where their terms allow us to prevent it (see our Privacy Policy and Subprocessors page for each provider's status). We may use aggregated, de-identified patterns derived from how the Services are used — never your name, your business name, or your figures — to improve the advice the Services give.\n" +
        "Your representations. You represent that you own or have the rights needed for Your Content; that where Your Content includes images, video, or recordings of other people (for example, your team or your customers), you have their permission to use it in the way you direct, including publishing it; and that Your Content does not violate any law or third-party right.",
    },
    {
      heading: "11. Acceptable Use",
      text:
        "You agree not to: (a) use the Services for any unlawful, fraudulent, infringing, defamatory, harassing, or harmful purpose; (b) upload other people's personal data without a lawful basis or required consent; (c) post discriminatory, misleading, or non-compliant job listings; (d) attempt to reverse engineer, scrape, overload, disrupt, or gain unauthorized access to the Services; (e) use the Services to build a competing product or to train competing AI models; (f) misuse AI features to generate illegal, deceptive, or rights-infringing content, including fake reviews or testimonials; or (g) circumvent usage limits, security, or access controls. We may investigate and take action, including suspension or removal of content, for suspected violations.",
    },
    {
      heading: "12. Job Marketplace",
      text:
        "Where Moil connects employers and candidates, Moil acts only as a venue. Moil is not a party to, and does not guarantee the outcome of, any application, hiring, or employment relationship. Employers are solely responsible for their job postings, hiring decisions, and compliance with all applicable employment, wage, anti-discrimination, and equal-opportunity laws. Candidates are responsible for the accuracy of their profiles, resumes, and submissions. Moil does not guarantee employment, applicants, the accuracy of listings or profiles, or any particular result.\n" +
        "Equal opportunity. Moil supports equal employment opportunity. Employers may not use the Services to discriminate on the basis of race, color, religion, sex (including pregnancy, sexual orientation, and gender identity), national origin, age, disability, genetic information, veteran status, or any other characteristic protected by law, and may not post job listings that do so. Moil does not use, and you may not use, our AI features to infer a protected characteristic or to make decisions based on one.\n" +
        "Automated hiring tools. If you use AI-assisted features (such as candidate matching, ranking, or interview-practice analysis) as part of a hiring decision, you are solely responsible for complying with laws that govern automated employment decision tools, including New York City Local Law 144, the Illinois Artificial Intelligence Video Interview Act, and the Colorado Artificial Intelligence Act, including any required notices, bias audits, impact assessments, and human review. Moil's matching features are a starting point for a human decision, not a substitute for one.\n" +
        "Not a consumer reporting agency. Moil is not a consumer reporting agency under the Fair Credit Reporting Act (FCRA). We do not perform background checks, and nothing you obtain through the Services is a \"consumer report\". You may not use information from the Services as a consumer report or in any way that would require FCRA compliance.",
    },
    {
      heading: "13. Third-Party Services and Connected Accounts",
      text:
        "The Services integrate with third parties such as Meta (Facebook Pages and Instagram), Google (sign-in and send-only Gmail), Stripe (billing and Stripe Connect), and Square. When you connect a third-party account, you authorize Moil to access and act on that account only as needed to provide the features you turn on — including publishing content and sending email you direct us to publish or send — and your use of those services remains subject to their own terms and policies. You can disconnect an account at any time in your settings; disconnecting deletes the access tokens we hold for it. We are not responsible for third-party services, their availability, or their acts and omissions.",
    },
    {
      heading: "14. Automated Actions and Standing Instructions (Autopilot)",
      text:
        "Some features act for you after you set them up. These include Autopilot (which prepares and, if you choose, publishes social media posts on a schedule), standing instructions such as a weekly content direction, routines (standing orders you ask the coach to carry out), draft payment reminders, and email drafting (together, \"Automated Actions\").\n" +
        "How they work. Autopilot has two modes. In Review mode, nothing is published until you approve each post. In Full auto mode, posts that pass our internal quality checks are published on the schedule you set, without you reviewing each one. Email is never sent from your connected account until you approve the specific draft, and your approval is tied to the exact content you saw. Routines never approve anything on your behalf. You can pause Autopilot, switch modes, cancel a routine, change a standing instruction, or disconnect a connected account at any time in your settings.\n" +
        "Your authorization and responsibility. When you turn on an Automated Action you authorize Moil to take the actions you selected, within the limits you set. You are the publisher of anything posted to your accounts and the sender of any email sent from your account. You are responsible for that content complying with advertising and consumer-protection law (including the FTC's rules on endorsements, reviews and testimonials), the CAN-SPAM Act and other email laws, intellectual property and publicity rights, and the rules of the platform it is published on. Review what Autopilot prepares. If you choose Full auto mode, you accept that content you have not individually reviewed may be published, and that AI Output can be wrong.\n" +
        "Payment connections are read-only in practice. If you connect Stripe or Square, Moil reads transaction and merchant information to show you what has been paid and to draft reminders. Moil never initiates a charge, refund, payout, or transfer and never moves money, even where a provider's connection would technically permit it. Payment reminders are drafts; you decide whether and how to send them.\n" +
        "Third-party platforms. Meta, Google, Stripe, Square, and other platforms may limit, suspend, or restrict your accounts under their own rules, including because of content an Automated Action published or sent. Moil is not responsible for those decisions, for sending or publishing limits, or for the availability of a third-party service, and we may pause an Automated Action to protect you or the Services.",
    },
    {
      heading: "15. Beta Features",
      text:
        "We may label some features as beta, preview, early access, or similar (\"Beta Features\"). Beta Features are provided for evaluation. They may be changed or withdrawn at any time, may contain errors, may not work with every account, and may not be covered by our standard support. To the extent permitted by law, Beta Features are provided without any warranty and our liability for them is limited as set out in Section 20. Do not rely on a Beta Feature for anything you cannot afford to lose.",
    },
    {
      heading: "16. Intellectual Property",
      text:
        "The Services, including all software, text, graphics, logos, trademarks, and the \"Moil\" name and brand, are owned by " +
        COMPANY_NAME +
        " or its licensors and are protected by intellectual property laws. Except for the rights expressly granted to you in these Terms, we reserve all rights. You may not copy, modify, distribute, or create derivative works from the Services without our prior written permission.",
    },
    {
      heading: "17. Feedback",
      text:
        "If you send us suggestions, ideas, or feedback about the Services, you grant Moil a perpetual, irrevocable, royalty-free license to use them for any purpose without obligation or compensation to you.",
    },
    {
      heading: "18. Suspension and Termination",
      text:
        "You may stop using the Services at any time. We may suspend or terminate your access, with or without notice, if you violate these Terms, create risk or legal exposure for us, or for any other reason at our discretion. On termination, your right to use the Services ends and any Automated Actions stop. You may request deletion or a copy of your data as described in our Privacy Policy. Sections that by their nature should survive — including ownership, disclaimers, limitation of liability, indemnification, and dispute resolution — survive termination.",
    },
    {
      heading: "19. Disclaimers",
      text:
        "THE SERVICES AND ALL AI OUTPUT ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY CONTENT OR AI OUTPUT WILL BE ACCURATE OR RELIABLE. SOME JURISDICTIONS DO NOT ALLOW CERTAIN WARRANTY EXCLUSIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.",
    },
    {
      // ATTORNEY REVIEW REQUIRED: cap amount, carve-outs, and the
      // basis-of-the-bargain language against Texas consumer-protection law.
      heading: "20. Limitation of Liability",
      text:
        "TO THE FULLEST EXTENT PERMITTED BY LAW, MOIL AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) USD $100.\n" +
        "EXCEPTIONS. THE LIMITATIONS IN THIS SECTION DO NOT APPLY TO (A) A PARTY'S FRAUD, GROSS NEGLIGENCE, OR WILLFUL MISCONDUCT; (B) DEATH OR PERSONAL INJURY CAUSED BY A PARTY'S NEGLIGENCE; OR (C) ANY LIABILITY THAT CANNOT BE LIMITED OR EXCLUDED UNDER APPLICABLE LAW.\n" +
        "THESE LIMITATIONS APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE. YOU AGREE THAT THEY ARE AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN YOU AND MOIL, THAT THE PRICE OF THE SERVICES REFLECTS THEM, AND THAT WE WOULD NOT PROVIDE THE SERVICES ON THESE TERMS WITHOUT THEM.",
    },
    {
      // ATTORNEY REVIEW REQUIRED: scope of the infringement defense
      // (U.S. rights only; exclusions for Your Content, AI Output, Beta Features).
      heading: "21. Moil's Defense of Infringement Claims",
      text:
        "If a third party claims that the Services — excluding Your Content, AI Output, Beta Features, and third-party services — infringe its United States patent, copyright, or trademark, or misappropriate its trade secret, we will defend you against that claim and pay any damages finally awarded against you by a court or agreed by us in a settlement. You must notify us promptly in writing, give us sole control of the defense and any settlement, and cooperate reasonably. We have no obligation for a claim that arises from Your Content, from AI Output, from your combination of the Services with products or data we did not supply, from your modification of the Services, or from your use of the Services in breach of these Terms. If a claim is made or we believe one is likely, we may modify the Services so they are no longer infringing, obtain a license, or terminate the affected Services and refund any prepaid fees for the unused period. This section states our entire liability for infringement claims and is subject to the limits in Section 20.",
    },
    {
      heading: "22. Indemnification",
      text:
        "You agree to indemnify, defend, and hold harmless Moil and its affiliates from and against any claims, damages, liabilities, and expenses (including reasonable legal fees) arising out of or related to Your Content, content published or sent through an Automated Action you enabled, your use of the Services, your violation of these Terms, or your violation of any law or third-party right.",
    },
    {
      heading: "23. Governing Law and Venue",
      text:
        "These Terms are governed by the laws of the State of Texas, USA, without regard to its conflict-of-laws rules. Subject to Section 24, the state and federal courts located in Hays County, Texas will have exclusive jurisdiction over any dispute that is not subject to arbitration, and you consent to their jurisdiction and venue.",
    },
    {
      // ATTORNEY REVIEW REQUIRED: entire arbitration section — AAA Consumer
      // Rules selection, fee-shifting threshold, delegation clause, class-waiver
      // severability, mass-arbitration batching, and the re-opened opt-out.
      heading: "24. Dispute Resolution: Arbitration and Class-Action Waiver",
      text:
        "PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO GO TO COURT.\n" +
        "Informal resolution first. Before starting arbitration or a court case, the party with a claim must send the other a written notice describing the dispute and the relief sought — to Moil at " +
        CONTACT_EMAIL +
        " with the subject \"Dispute Notice\", or to you at the email address on your account. The parties will try in good faith to resolve the dispute informally for 30 days after the notice is received.\n" +
        "Agreement to arbitrate. If the dispute is not resolved, you and Moil agree to resolve any dispute, claim, or controversy arising out of or relating to these Terms or the Services by final and binding individual arbitration, not in court. This includes disputes about whether this section applies, is valid, or is enforceable, which the arbitrator — not a court — will decide. The Federal Arbitration Act governs this section.\n" +
        "Rules and forum. The arbitration will be administered by the American Arbitration Association (\"AAA\") under its Consumer Arbitration Rules, as modified by this section (or, where you use the Services on behalf of a business and the AAA determines the Consumer Arbitration Rules do not apply, its Commercial Arbitration Rules). The rules are available at adr.org. Hearings will be held by video or telephone unless the arbitrator decides an in-person hearing is needed, in which case it will take place in the county where you live or another place the parties agree on.\n" +
        "Fees. For a claim seeking USD $10,000 or less, Moil will pay all AAA filing, administrative, and arbitrator fees beyond the amount of the filing fee you would pay to bring the claim in your local small-claims court, unless the arbitrator finds the claim frivolous or brought for an improper purpose. Each party pays its own attorneys' fees unless applicable law or the AAA rules provide otherwise.\n" +
        "Small claims and injunctions. Either party may bring an individual claim in small-claims court instead of arbitration, if the claim qualifies. Either party may also ask a court for an injunction to stop actual or threatened infringement or misuse of intellectual property or unauthorized access to the Services.\n" +
        "Class-action waiver. You and Moil agree to bring claims only in an individual capacity, and not as a plaintiff or class member in any purported class, collective, consolidated, or representative action. The arbitrator may not consolidate claims of different people and may not award relief to anyone other than the individual party. If this class-action waiver is found unenforceable for a particular claim or request for relief, that claim or request (and only that one) will be severed and decided in court under Section 23, and the rest of this section will still apply to every other claim.\n" +
        "Mass arbitration. If 25 or more similar arbitration demands are filed against Moil by or with the help of the same lawyers or coordinated lawyers, the AAA will administer them in batches of up to 50 demands, with one arbitrator and a single set of filing and administrative fees per side per batch. The parties will cooperate with the AAA to resolve the batches in stages and may agree to a global mediation. Any statute of limitations is tolled for a claim from the time its demand is filed until its batch is heard.\n" +
        "Jury trial waiver. To the extent any claim proceeds in court rather than in arbitration, you and Moil each waive any right to a jury trial.\n" +
        "Opt-out. You may opt out of this arbitration agreement by emailing " +
        CONTACT_EMAIL +
        " with the subject \"Arbitration Opt-Out\", your name, and your account email within 30 days of first accepting these Terms. If we later make a material change to this section, you may opt out of the changed section by the same method within 30 days after the change takes effect; if you do, the version of this section you last agreed to continues to apply. Opting out does not affect any other part of these Terms.",
    },
    {
      heading: "25. Changes to These Terms",
      text:
        "We may update these Terms from time to time. If we make a material change, we will give you at least 30 days' notice by email to the address on your account and will update the \"Last updated\" date before the change takes effect — except where a change is required by law or is needed to address a security or abuse issue, in which case it takes effect as soon as the law allows. A change to Section 24 re-opens the 30-day arbitration opt-out described there. Your continued use of the Services after a change takes effect means you accept it. If you do not agree, cancel your subscription and stop using the Services before the effective date.",
    },
    {
      // ATTORNEY REVIEW REQUIRED: English-controls clause. Some states (e.g.
      // California Civil Code §1632) require the translated version to be
      // provided and can limit an English-controls clause for consumer
      // contracts negotiated primarily in Spanish.
      heading: "26. Language",
      text:
        "These Terms are written in English. We may provide a Spanish translation as a courtesy to help you understand them. If the English and Spanish versions conflict, the English version controls to the extent permitted by applicable law.",
    },
    {
      heading: "27. General",
      text:
        "These Terms, together with the Privacy Policy and any plan-specific terms, are the entire agreement between you and Moil regarding the Services. If any provision is found unenforceable, the remaining provisions stay in effect. Our failure to enforce a provision is not a waiver. You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets. We are not liable for delays or failures caused by events beyond our reasonable control.",
    },
    {
      heading: "28. Contact Us",
      text:
        "Questions about these Terms? Contact " + COMPANY_NAME + " at " + CONTACT_EMAIL + " or " + COMPANY_ADDRESS + ".",
    },
  ];

  // This page used to hand-roll a byte-for-byte copy of the LegalPage shell —
  // same wrapper, same Back link, same title block, same section loop. That is
  // why the fixed-header overlap had to be found twice: fixing /cookies left
  // /terms still opening with its Back link underneath the nav, with nothing
  // erroring. One shell, one place to fix it.
  return (
    <LegalPage title="Moil Terms and Conditions" lastUpdated={lastUpdated} page="terms" sections={terms}>
      <p className="text-sm text-[#5C6178]">
        Changelog — {lastUpdated}: added Automated Actions and Standing Instructions (Section 14) and Beta Features
        (Section 15); expanded the professional-advice disclaimer (Section 8), the content license and no-training
        commitment (Section 10), and the job-marketplace rules (Section 12); added the job-seeker age rule (Section 2);
        30 days&apos; email notice for price increases (Section 5) and material changes (Section 25); added liability
        carve-outs and a basis-of-the-bargain statement (Section 20) and Moil&apos;s defense of infringement claims
        (Section 21); moved venue to Hays County, Texas (Section 23); expanded the arbitration terms (Section 24); and
        added a language clause (Section 26). Sections were renumbered accordingly.
      </p>
      <p className="text-sm text-[#5C6178]">
        See also our{" "}
        <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>. Versión en español:{" "}
        <Link href="/es/terms" className="text-[#FF6633] underline">Términos y Condiciones</Link>.
      </p>
    </LegalPage>
  );
}
