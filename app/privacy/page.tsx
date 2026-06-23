"use client";

import Link from "next/link";
import CandidateNavigation from "~~/src/candidate/components/navigation";


export default function PrivacyPage() {
  const privacyAgreement = [
    {
      "heading": "1. Introduction",
      "text": "Welcome to Moil. This Privacy Policy explains how Moil Enterprise Inc., headquartered in Austin, TX, collects, uses, and shares your personal information when you use our services via our website www.moilapp.com."
    },
    {
      "heading": "2. Information Collection and Use",
      "text": "Moil collects personal information like names, contact details, and employment history when you create an account or use our services. This information is used to provide and improve our AI-driven resume builder, personalized job matching, and other career-related services."
    },
    {
      "heading": "3. Data Sharing and Disclosure",
      "text": "We may share your information with potential employers or as legally required. We do not sell your personal data."
    },
    {
      "heading": "4. Data Security",
      "text": "We implement appropriate security measures to protect your data against unauthorized access, alteration, or destruction."
    },
    {
      "heading": "5. User Rights and Choices",
      "text": "You have the right to access, update, or request deletion of your personal information. Please contact contacto@moilapp.com for such requests."
    },
    {
      "heading": "6. Cookies and Tracking Technologies",
      "text": "We use cookies and similar technologies for website functionality and analytics."
    },
    {
      "heading": "7. International Data Transfers",
      "text": "Your information may be transferred to and maintained on computers located outside your state or country where the data protection laws may differ from those of your jurisdiction."
    },
    {
      "heading": "8. Policy Changes",
      "text": "We may update this policy and will notify you of any changes by posting the new policy on this page."
    },
    {
      "heading": "9. Contact Information",
      "text": "For any privacy-related questions or concerns, please email contacto@moilapp.com."
    }
  ]

  const termOfService = [
    {
      "heading": "1. Introduction",
      "text": "Welcome to Moil, provided by Moil Enterprise Inc. These Terms of Service govern your use of our services via www.moilapp.com."
    },
    {
      "heading": "2. User Accounts",
      "text": "You must provide accurate information when creating an account and maintain the confidentiality of your login credentials."
    },
    {
      "heading": "3. Service Usage",
      "text": "Our services are intended for career-related purposes only. Misuse or unauthorized use of our platform is prohibited."
    },
    {
      "heading": "4. Intellectual Property",
      "text": "All content on Moil, including text, graphics, logos, and software, is the property of Moil Enterprise Inc."
    },
    {
      "heading": "5. Disclaimers and Limitations of Liability",
      "text": "Moil is not responsible for the accuracy of job matches or user-generated content. Our liability is limited to the fullest extent permitted by law."
    },
    {
      "heading": "6. User Responsibilities",
      "text": "You are responsible for all activities under your account and must comply with all applicable laws."
    },
    {
      "heading": "7. Termination of Use",
      "text": "We may terminate or suspend your access to Moil for any violation of these terms."
    },
    {
      "heading": "8. Governing Law and Dispute Resolution",
      "text": "These terms are governed by the laws of the State of Texas, USA. Any disputes will be resolved in the courts of Travis County, Texas."
    },
    {
      "heading": "9. Amendments to Terms",
      "text": "We reserve the right to modify these terms at any time. Your continued use of Moil constitutes acceptance of these changes."
    },
    {
      "heading": "10. Contact Information",
      "text": "For questions about these terms, please email contacto@moilapp.com."
    }
  ]


  return (
    <>
      <div className="bg-[#F7F8FC]">
        <CandidateNavigation refQuery="" lgQuery="" setQueryLg={() => { }} page="privacy" setShowLanguageModal={() => { }} />
        <div className="py-4 flex justify-center items-center">
          <div className="flex flex-col gap-y-6 md:max-w-[700px] lg:max-w-[750px] px-6 py-6 md:py-10">
            <Link className="w-max flex items-center gap-x-1" href="/">
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.65625 16.4062H29.5312C29.8213 16.4062 30.0995 16.5215 30.3046 16.7266C30.5098 16.9317 30.625 17.2099 30.625 17.5C30.625 17.7901 30.5098 18.0683 30.3046 18.2734C30.0995 18.4785 29.8213 18.5938 29.5312 18.5938H7.65625C7.36617 18.5938 7.08797 18.4785 6.88285 18.2734C6.67773 18.0683 6.5625 17.7901 6.5625 17.5C6.5625 17.2099 6.67773 16.9317 6.88285 16.7266C7.08797 16.5215 7.36617 16.4062 7.65625 16.4062Z" fill="#FF6633" />
                <path d="M8.10906 17.4994L17.1806 26.5688C17.386 26.7742 17.5014 27.0527 17.5014 27.3432C17.5014 27.6336 17.386 27.9122 17.1806 28.1176C16.9753 28.3229 16.6967 28.4383 16.4063 28.4383C16.1158 28.4383 15.8373 28.3229 15.6319 28.1176L5.78813 18.2738C5.68627 18.1722 5.60546 18.0515 5.55032 17.9186C5.49518 17.7857 5.4668 17.6433 5.4668 17.4994C5.4668 17.3556 5.49518 17.2131 5.55032 17.0802C5.60546 16.9474 5.68627 16.8267 5.78813 16.7251L15.6319 6.8813C15.8373 6.67593 16.1158 6.56055 16.4063 6.56055C16.6967 6.56055 16.9753 6.67593 17.1806 6.8813C17.386 7.08668 17.5014 7.36523 17.5014 7.65568C17.5014 7.94613 17.386 8.22468 17.1806 8.43005L8.10906 17.4994Z" fill="#FF6633" />
              </svg>
              <span className="text-[#FF6633] text-base leading-normal text-center">Back</span>
            </Link>

            <p className="text-[24px] md:text-[40px] font-[800] tetx-[#22263A] leading-normal">Moil Privacy Agreement</p>

            <div className="flex flex-col gap-y-6">
              {privacyAgreement.map((agg, i) => {
                return (
                  <div className="text-base leading-normal font-medium">
                    <p className="font-[700]">{agg.heading}</p>
                    <p>{agg.text}</p>
                  </div>
                )
              })}
            </div>

            <p className="text-[24px] md:text-[40px] font-[800] tetx-[#22263A] leading-normal">Moil Terms of Service</p>

            <div className="flex flex-col gap-y-6">
              {termOfService.map((term, i) => {
                return (
                  <div className="text-base leading-normal font-medium">
                    <p className="font-[700]">{term.heading}</p>
                    <p>{term.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}