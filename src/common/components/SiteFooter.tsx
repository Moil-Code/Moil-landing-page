/**
 * SiteFooter — global footer mounted in root app/layout.tsx.
 *
 * Purpose: emit the brand-identity SEO signal Google needs to disambiguate
 * Moil from the Indian mining company and other "moil" namesakes.
 *
 * Two SEO-critical elements MUST stay intact when editing:
 *   1. `rel="me"` on every social link — microformats signal that the linked
 *      profile represents the same entity as this site. Combined with the
 *      reverse signal (each profile listing moilapp.com in its bio), Google
 *      ties them together in the Knowledge Graph.
 *   2. The exact canonical URLs in SOCIAL_LINKS — these MUST match the
 *      `sameAs` array in the JSON-LD Organization block in app/layout.tsx,
 *      and the canonical URLs Google has indexed for each profile. A typo
 *      (e.g. linkedin.com/company/moil-app vs /moilapp) breaks the signal.
 *
 * Server component (no 'use client') — renders on every page including SSR
 * crawls, so Googlebot sees the links without executing JavaScript.
 */

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/moilapp',
    label: 'Moil on LinkedIn',
  },
  {
    name: 'X',
    href: 'https://x.com/MoilApp',
    label: 'Moil on X (Twitter)',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/themoilapp/',
    label: 'Moil on Instagram',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@moilapp',
    label: 'Moil on TikTok',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/MoilWorks/',
    label: 'Moil on Facebook',
  },
] as const;

type NavLink = { label: string; href: string; external?: boolean };

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Business', href: '/business' },
  { label: 'Pricing', href: '/business/pricing' },
  { label: 'Marketing', href: '/marketing' },
  { label: 'Candidates', href: '/candidate' },
  { label: 'Job Search', href: '/candidate/searchjob' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
  { label: 'Privacy', href: '/privacy' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-gray-200 bg-white py-8 px-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
      aria-label="Site footer"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Brand + tagline */}
        <div className="max-w-sm">
          <a href="/" className="inline-block font-semibold text-gray-900 dark:text-gray-100">
            Moil
          </a>
          <p className="mt-2 text-xs leading-relaxed">
            The AI co-founder for small business owners. Bilingual EN/ES. Built in Austin, TX.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4 md:grid-cols-2">
          {NAV_LINKS.map(({ label, href, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener' } : {})}
              className="text-xs hover:text-gray-900 hover:underline dark:hover:text-gray-100"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Social — rel="me" is the SEO signal */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Follow Moil
          </p>
          <ul className="mt-2 flex gap-3">
            {SOCIAL_LINKS.map(({ name, href, label }) => (
              <li key={name}>
                <a
                  href={href}
                  rel="me noopener"
                  target="_blank"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-xs font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-100 dark:hover:text-gray-100"
                >
                  {/* Single-letter glyph keeps the footer dependency-free.
                      Replace with proper icons in a Phase 2 polish pass. */}
                  {name === 'X' ? '𝕏' : name[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
        <span>&copy; {year} Moil Enterprise Inc. All rights reserved.</span>
      </div>
    </footer>
  );
}
