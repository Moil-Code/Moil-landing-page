import type { Metadata } from "next";
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
            Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`} className="text-[#FF6633] underline">{CONTACT_EMAIL}</a>{" "}
            with the subject &ldquo;Privacy Request&rdquo;.
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
