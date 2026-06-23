"use client";

import Link from "next/link";
import CandidateNavigation from "~~/src/candidate/components/navigation";


export default function TermsPage() {
  const lastUpdated = "June 23, 2026";

  const terms = [
    {
      "heading": "1. Agreement to These Terms",
      "text": "These Terms and Conditions (\"Terms\") form a binding agreement between you and Moil Enterprise Inc. (\"Moil\", \"we\", \"us\"), headquartered in Austin, TX, and govern your access to and use of our websites, applications, and services available at www.moilapp.com and its subdomains (the \"Services\"). By creating an account, clicking \"I agree\", or otherwise accessing or using the Services, you accept these Terms and our Privacy Policy, which is incorporated by reference. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you represent that you are authorized to bind that organization to these Terms."
    },
    {
      "heading": "2. Eligibility",
      "text": "You must be at least 18 years old and able to form a legally binding contract to use the Services. The Services are not directed to children, and we do not knowingly collect personal information from anyone under 18. You are responsible for ensuring that your use of the Services complies with all laws that apply to you."
    },
    {
      "heading": "3. Your Account",
      "text": "To access most features you must create an account and provide accurate, current, and complete information. You are responsible for safeguarding your login credentials and for all activity that occurs under your account. Notify us immediately at contacto@moilapp.com if you suspect unauthorized use. You may register or sign in using a third-party provider (such as Google); your use of that provider remains subject to its own terms."
    },
    {
      "heading": "4. The Services",
      "text": "Moil provides AI-assisted tools for small businesses and workers, which may include an AI business coach, business planning and market research, AI-generated content such as images, logos, marketing materials and social media posts (\"Moil360\"), a job marketplace connecting employers and candidates, and related features. We may add, change, suspend, or remove features at any time. Some features are provided on a paid basis as described below."
    },
    {
      "heading": "5. Subscriptions, Billing & Auto-Renewal",
      "text": "Certain features require a paid subscription. Prices are stated at the point of purchase. Paid plans are billed in advance on a recurring basis (for example, monthly) and AUTOMATICALLY RENEW for successive periods at the then-current price until you cancel. By subscribing, you authorize us and our payment processor (Stripe) to charge your payment method for each renewal until you cancel. We do not store full card numbers; payments are processed by Stripe under its own terms. We may change prices or plan features on a going-forward basis; we will give you advance notice, and changes take effect at your next renewal."
    },
    {
      "heading": "6. Cancellations & Refunds",
      "text": "You may cancel your subscription at any time through your account settings or by contacting contacto@moilapp.com. Cancellation stops future renewals; you retain access until the end of your current paid period. Except where required by applicable law, payments are non-refundable and we do not provide refunds or credits for partial periods, unused features, or content already generated."
    },
    {
      "heading": "7. Free Trials & Promotions",
      "text": "We may offer free trials or promotional pricing. Unless we tell you otherwise, at the end of a free trial your subscription automatically converts to a paid plan and your payment method is charged at the then-current price unless you cancel before the trial ends. We may modify or withdraw trials and promotions at any time."
    },
    {
      "heading": "8. AI-Generated Content & No Professional Advice",
      "text": "The Services use artificial intelligence to generate text, plans, images, and other outputs (\"AI Output\"). AI Output may be inaccurate, incomplete, outdated, or unsuitable for your situation and may not be unique to you. AI Output is provided for general informational purposes only and is NOT legal, financial, tax, accounting, employment, or other professional advice. You are solely responsible for reviewing, verifying, and deciding whether to rely on any AI Output, and you should consult a qualified professional before making decisions. Moil is not liable for actions you take based on AI Output."
    },
    {
      "heading": "9. Ownership and Use of AI Output",
      "text": "As between you and Moil, and subject to your compliance with these Terms and any applicable third-party AI provider terms, you may use the AI Output you generate for your lawful business and personal purposes. AI Output may not be legally protectable, may resemble output provided to others, and may be subject to third-party rights; you are responsible for confirming that your use of AI Output (including images and logos) does not infringe any third party's intellectual property, publicity, or other rights. We may retain and use de-identified or aggregated data derived from your use to operate, secure, and improve the Services."
    },
    {
      "heading": "10. Your Content and License to Moil",
      "text": "You retain ownership of the content, files, prompts, business information, brand assets, and other materials you submit (\"Your Content\"). You grant Moil a worldwide, non-exclusive, royalty-free license to host, store, reproduce, process, adapt, and display Your Content as needed to provide and improve the Services and, where you direct us to do so (for example, by connecting a social account), to publish it on your behalf. You represent that you own or have the necessary rights to Your Content and that it does not violate any law or third-party right."
    },
    {
      "heading": "11. Acceptable Use",
      "text": "You agree not to: (a) use the Services for any unlawful, fraudulent, infringing, defamatory, harassing, or harmful purpose; (b) upload others' personal data without a lawful basis or required consent; (c) post discriminatory, misleading, or non-compliant job listings; (d) attempt to reverse engineer, scrape, overload, disrupt, or gain unauthorized access to the Services; (e) use the Services to build a competing product or to train competing AI models; (f) misuse AI features to generate illegal, deceptive, or rights-infringing content; or (g) circumvent usage limits, security, or access controls. We may investigate and take action, including suspension or removal of content, for suspected violations."
    },
    {
      "heading": "12. Job Marketplace",
      "text": "Where Moil connects employers and candidates, Moil acts only as a venue and is not a party to, and does not guarantee the outcome of, any application, hiring, or employment relationship. Employers are solely responsible for their job postings, hiring decisions, and compliance with all applicable employment, anti-discrimination, and equal-opportunity laws. Candidates are responsible for the accuracy of their profiles, resumes, and submissions. Moil does not guarantee employment, applicants, the accuracy of listings or profiles, or any particular result."
    },
    {
      "heading": "13. Third-Party Services & Social Publishing",
      "text": "The Services integrate with third parties such as Meta (Facebook and Instagram), Stripe, and Google. When you connect a third-party account, you authorize Moil to access and act on that account as needed to provide the Services—including publishing content you direct us to publish—and your use of those services remains subject to their own terms and policies. We are not responsible for third-party services, their availability, or their acts and omissions."
    },
    {
      "heading": "14. Intellectual Property",
      "text": "The Services, including all software, text, graphics, logos, trademarks, and the \"Moil\" name and brand, are owned by Moil Enterprise Inc. or its licensors and are protected by intellectual property laws. Except for the rights expressly granted to you in these Terms, we reserve all rights. You may not copy, modify, distribute, or create derivative works from the Services without our prior written permission."
    },
    {
      "heading": "15. Feedback",
      "text": "If you send us suggestions, ideas, or feedback about the Services, you grant Moil a perpetual, irrevocable, royalty-free license to use them for any purpose without obligation or compensation to you."
    },
    {
      "heading": "16. Suspension & Termination",
      "text": "You may stop using the Services at any time. We may suspend or terminate your access, with or without notice, if you violate these Terms, create risk or legal exposure for us, or for any other reason at our discretion. Upon termination, your right to use the Services ends. Sections that by their nature should survive—including ownership, disclaimers, limitation of liability, indemnification, and dispute resolution—survive termination."
    },
    {
      "heading": "17. Disclaimers",
      "text": "THE SERVICES AND ALL AI OUTPUT ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR THAT ANY CONTENT OR AI OUTPUT WILL BE ACCURATE OR RELIABLE. SOME JURISDICTIONS DO NOT ALLOW CERTAIN WARRANTY EXCLUSIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU."
    },
    {
      "heading": "18. Limitation of Liability",
      "text": "TO THE FULLEST EXTENT PERMITTED BY LAW, MOIL AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICES. OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) USD $100."
    },
    {
      "heading": "19. Indemnification",
      "text": "You agree to indemnify, defend, and hold harmless Moil and its affiliates from and against any claims, damages, liabilities, and expenses (including reasonable legal fees) arising out of or related to Your Content, your use of the Services, your violation of these Terms, or your violation of any law or third-party right."
    },
    {
      "heading": "20. Governing Law",
      "text": "These Terms are governed by the laws of the State of Texas, USA, without regard to its conflict-of-laws rules. Subject to the dispute-resolution section below, the state and federal courts located in Travis County, Texas will have exclusive jurisdiction, and you consent to their jurisdiction and venue."
    },
    {
      "heading": "21. Dispute Resolution; Arbitration & Class-Action Waiver",
      "text": "PLEASE READ THIS SECTION CAREFULLY—IT AFFECTS YOUR LEGAL RIGHTS. Except for small-claims matters and requests for injunctive relief to protect intellectual property, you and Moil agree to resolve any dispute arising out of or relating to these Terms or the Services through final and binding individual arbitration, rather than in court. You and Moil waive any right to a jury trial and to participate in a class, collective, or representative action. You may opt out of this arbitration agreement by emailing contacto@moilapp.com within 30 days of first accepting these Terms."
    },
    {
      "heading": "22. Changes to These Terms",
      "text": "We may update these Terms from time to time. If we make material changes, we will update the \"Last updated\" date and may provide additional notice. Your continued use of the Services after changes take effect constitutes acceptance of the revised Terms. If you do not agree, you must stop using the Services."
    },
    {
      "heading": "23. General",
      "text": "These Terms, together with the Privacy Policy and any plan-specific terms, are the entire agreement between you and Moil regarding the Services. If any provision is found unenforceable, the remaining provisions stay in effect. Our failure to enforce a provision is not a waiver. You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets. We are not liable for delays or failures caused by events beyond our reasonable control."
    },
    {
      "heading": "24. Contact Us",
      "text": "Questions about these Terms? Contact Moil Enterprise Inc. at contacto@moilapp.com."
    }
  ];


  return (
    <>
      <div className="bg-[#F7F8FC]">
        <CandidateNavigation refQuery="" lgQuery="" setQueryLg={() => { }} page="terms" setShowLanguageModal={() => { }} />
        <div className="py-4 flex justify-center items-center">
          <div className="flex flex-col gap-y-6 md:max-w-[700px] lg:max-w-[750px] px-6 py-6 md:py-10">
            <Link className="w-max flex items-center gap-x-1" href="/">
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.65625 16.4062H29.5312C29.8213 16.4062 30.0995 16.5215 30.3046 16.7266C30.5098 16.9317 30.625 17.2099 30.625 17.5C30.625 17.7901 30.5098 18.0683 30.3046 18.2734C30.0995 18.4785 29.8213 18.5938 29.5312 18.5938H7.65625C7.36617 18.5938 7.08797 18.4785 6.88285 18.2734C6.67773 18.0683 6.5625 17.7901 6.5625 17.5C6.5625 17.2099 6.67773 16.9317 6.88285 16.7266C7.08797 16.5215 7.36617 16.4062 7.65625 16.4062Z" fill="#FF6633" />
                <path d="M8.10906 17.4994L17.1806 26.5688C17.386 26.7742 17.5014 27.0527 17.5014 27.3432C17.5014 27.6336 17.386 27.9122 17.1806 28.1176C16.9753 28.3229 16.6967 28.4383 16.4063 28.4383C16.1158 28.4383 15.8373 28.3229 15.6319 28.1176L5.78813 18.2738C5.68627 18.1722 5.60546 18.0515 5.55032 17.9186C5.49518 17.7857 5.4668 17.6433 5.4668 17.4994C5.4668 17.3556 5.49518 17.2131 5.55032 17.0802C5.60546 16.9474 5.68627 16.8267 5.78813 16.7251L15.6319 6.8813C15.8373 6.67593 16.1158 6.56055 16.4063 6.56055C16.6967 6.56055 16.9753 6.67593 17.1806 6.8813C17.386 7.08668 17.5014 7.36523 17.5014 7.65568C17.5014 7.94613 17.386 8.22468 17.1806 8.43005L8.10906 17.4994Z" fill="#FF6633" />
              </svg>
              <span className="text-[#FF6633] text-base leading-normal text-center">Back</span>
            </Link>

            <div className="flex flex-col gap-y-2">
              <p className="text-[24px] md:text-[40px] font-[800] tetx-[#22263A] leading-normal">Moil Terms and Conditions</p>
              <p className="text-sm text-[#5C6178]">Last updated: {lastUpdated}</p>
            </div>

            <div className="flex flex-col gap-y-6">
              {terms.map((term, i) => {
                return (
                  <div key={i} className="text-base leading-normal font-medium">
                    <p className="font-[700]">{term.heading}</p>
                    <p>{term.text}</p>
                  </div>
                )
              })}
            </div>

            <p className="text-sm text-[#5C6178]">
              See also our{" "}
              <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
