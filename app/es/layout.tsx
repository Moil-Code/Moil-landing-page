import type { Metadata } from 'next';
import { RootDocument } from '../../src/common/components/RootDocument';
import { rootMetadata } from '../../src/common/seo/rootMetadata';

export const metadata: Metadata = rootMetadata;

// Root layout of every Spanish document (/es and /es/*): `<html lang="es">`
// on the first byte, decided by the route, not by a request header.
export default function SpanishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
