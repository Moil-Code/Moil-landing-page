import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import '../../business/business.css';

export const metadata: Metadata = {
  title: {
    absolute: 'Preview your brand | Moil',
  },
  description:
    'Paste your website. Moil reads the business and builds a first brand preview.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${baseURL1}/business`,
  },
};

export default function PlanPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
