import type { Metadata } from "next";
import LegalPage from "~~/src/common/components/LegalPage";
import { baseURL1 } from "~~/src/common/constants/baseUrl";
import { CONTACT_EMAIL } from "~~/src/common/constants/company";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Moil's commitment to digital accessibility, the standards we work toward, and how to request help or report a barrier.",
  alternates: { canonical: `${baseURL1}/accessibility` },
  robots: { index: true, follow: false },
};

export default function AccessibilityPage() {
  const sections = [
    {
      heading: "1. Our Commitment",
      text: "Moil is committed to making our Services usable by as many people as possible, including people with disabilities. We aim to provide an inclusive experience regardless of ability or technology.",
    },
    {
      heading: "2. Standards",
      text: "We work toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with a wide range of disabilities.",
    },
    {
      heading: "3. Measures We Take",
      text:
        "• Designing with sufficient color contrast and clear typography.\n" +
        "• Supporting keyboard navigation and semantic, screen-reader-friendly markup.\n" +
        "• Providing text alternatives for meaningful images where applicable.\n" +
        "• Reviewing accessibility as part of our ongoing development.",
    },
    {
      heading: "4. Ongoing Effort and Limitations",
      text: "Accessibility is an ongoing effort. Some areas may not yet be fully accessible, and some third-party content may be outside our control. We continue to improve over time.",
    },
    {
      heading: "5. Feedback and Assistance",
      text: `If you encounter an accessibility barrier or need assistance, please contact us at ${CONTACT_EMAIL} and we will work to provide the information or service you need through an accessible method.`,
    },
  ];

  return <LegalPage title="Accessibility Statement" lastUpdated="June 23, 2026" page="accessibility" sections={sections} />;
}
