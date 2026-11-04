import { notFound } from 'next/navigation';

// With one root layout per language there is no app-wide root, so an
// unmatched URL has no layout to render the 404 in. This catch-all gives it
// one: it matches only what no other route, redirect or rewrite claimed, and
// answers with the site's 404 (status 404) from app/(en)/not-found.tsx.
export default function Missing() {
  notFound();
}
