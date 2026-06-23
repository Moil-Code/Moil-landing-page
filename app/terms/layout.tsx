import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read Moil\'s Terms and Conditions. Understand the rules for using Moil Enterprise Inc.\'s AI business platform, content tools, and job marketplace.',
  openGraph: {
    title: 'Terms and Conditions',
    description: 'The terms that govern your use of Moil\'s AI business platform and job marketplace.',
    url: `${baseURL1}/terms`,
  },
  alternates: {
    canonical: `${baseURL1}/terms`,
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
