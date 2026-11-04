import type { Metadata } from 'next';

// Legacy page — excluded from search indexing to protect crawl budget
// and prevent outdated content from surfacing in search results.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
