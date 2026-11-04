import type { Metadata } from 'next';
import { RootDocument } from '../src/common/components/RootDocument';
import { rootMetadata } from '../src/common/seo/rootMetadata';
import NotFoundPage from '../src/common/sections/error_page';

// The 404 for a URL no route matches. There is one root layout per language
// (app/(en)/layout.tsx, app/es/layout.tsx) and so no app-wide root to render
// an unmatched URL in; Next.js answers those from this file instead
// (experimental.globalNotFound in next.config.js), with status 404, in the
// same document as every other page.
// Same head as before the split: the site title as is (this page is its own
// root, so the root's "%s | Moil" template would otherwise be applied to it).
const siteTitle =
  rootMetadata.title && typeof rootMetadata.title === 'object' && 'default' in rootMetadata.title
    ? rootMetadata.title.default
    : 'Moil';
export const metadata: Metadata = { ...rootMetadata, title: { absolute: siteTitle } };

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundPage />
    </RootDocument>
  );
}
