import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { COMPANY_NAME, COMPANY_ADDRESS, CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Moil Enterprise Inc. for support, privacy requests, partnerships, and general questions.",
  alternates: { canonical: `${baseURL1}/contact` },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      page="contact"
      intro="We'd love to hear from you. Reach out and we'll get back to you as soon as we can."
    >
      <div className="flex flex-col gap-y-5 text-base leading-normal font-medium text-[#22263A]">
        <div>
          <p className="font-[700]">General & Support</p>
          <p>
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF6633] underline">{CONTACT_EMAIL}</a>
          </p>
        </div>
        <div>
          <p className="font-[700]">Privacy Requests</p>
          <p>
            To access, correct, delete, or receive a copy of your personal information, or to opt out
            of sale/sharing, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`} className="text-[#FF6633] underline">{CONTACT_EMAIL}</a>{" "}
            with the subject &ldquo;Privacy Request&rdquo;, or write to the mailing address below.
          </p>
          <p className="pt-1 text-sm text-[#5C6178]">
            We confirm receipt within 10 business days and respond within 45 days, extendable once by
            a further 45 days where the request is complex — we will tell you if that happens. We
            verify your identity before acting on a request, and we will not charge you or provide a
            lesser standard of service for exercising a right. An authorized agent may submit a
            request on your behalf with written permission. See{" "}
            <Link href="/privacy-choices" className="text-[#FF6633] underline">Your Privacy Choices</Link>{" "}
            and our <Link href="/privacy" className="text-[#FF6633] underline">Privacy Policy</Link>.
          </p>
        </div>
        <div>
          <p className="font-[700]">Copyright (DMCA)</p>
          <p>
            Send infringement notices to{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=DMCA%20Notice`} className="text-[#FF6633] underline">{CONTACT_EMAIL}</a>{" "}
            with the subject &ldquo;DMCA Notice&rdquo;. See our{" "}
            <Link href="/dmca" className="text-[#FF6633] underline">Copyright &amp; DMCA Policy</Link>.
          </p>
        </div>
        <div>
          <p className="font-[700]">Security</p>
          <p>
            To report a vulnerability, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Security%20Report`} className="text-[#FF6633] underline">{CONTACT_EMAIL}</a>{" "}
            with the subject &ldquo;Security Report&rdquo;. Please give us a reasonable period to
            investigate and remediate before public disclosure. We will not pursue legal action
            against good-faith research that respects user privacy and avoids service disruption.
          </p>
        </div>
        <div>
          <p className="font-[700]">Mailing Address</p>
          <p>{COMPANY_NAME}</p>
          <p>{COMPANY_ADDRESS}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
          <a href="https://www.linkedin.com/company/moilapp" target="_blank" rel="noopener noreferrer" className="text-[#5843BE] underline">LinkedIn</a>
          <a href="https://www.facebook.com/themoilapp" target="_blank" rel="noopener noreferrer" className="text-[#5843BE] underline">Facebook</a>
          <a href="https://instagram.com/themoilapp" target="_blank" rel="noopener noreferrer" className="text-[#5843BE] underline">Instagram</a>
          <a href="https://blog.moilapp.com" target="_blank" rel="noopener noreferrer" className="text-[#5843BE] underline">Blog</a>
        </div>
      </div>
    </LegalPage>
  );
}
