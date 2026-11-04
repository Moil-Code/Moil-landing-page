import type { Metadata } from 'next';
import { RootDocument } from '../../src/common/components/RootDocument';
import { rootMetadata } from '../../src/common/seo/rootMetadata';

export const metadata: Metadata = rootMetadata;

// Root layout of every English document (all routes outside /es). The
// language comes from the route, so nothing here reads the request and the
// pages under it render statically.
export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
