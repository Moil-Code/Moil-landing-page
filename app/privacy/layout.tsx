import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read Moil\'s privacy policy. Learn how Moil Enterprise Inc. collects, uses, and protects your personal information when you use our AI business platform and job marketplace.',
  openGraph: {
    title: 'Privacy Policy',
    description: 'Learn how Moil collects, uses, and protects your personal information.',
    url: `${baseURL1}/privacy`,
  },
  alternates: {
    canonical: `${baseURL1}/privacy`,
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
