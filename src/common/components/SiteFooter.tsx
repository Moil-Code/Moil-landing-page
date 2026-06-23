'use client';

/**
 * SiteFooter — global footer mounted in root app/layout.tsx.
 *
 * Renders ONLY on pages that don't ship their own footer (e.g. /privacy,
 * /legacy). The section pages each have a richer, theme-aware footer
 * (BusinessFooter, Content360Footer, the candidate FooterSection), so this
 * one is hidden there to avoid a stacked double-footer. The brand-entity
 * signal those pages would otherwise lose is already covered by the JSON-LD
 * `sameAs` array in app/layout.tsx (present on every page).
 *
 * Dark-themed so it sits correctly under dark pages (the business pages are
 * dark via CSS variables, not Tailwind class-based dark mode).
 *
 * SEO-critical when editing:
 *   1. `rel="me"` on every social link — entity-disambiguation microformat.
 *   2. SOCIAL_LINKS URLs MUST match the `sameAs` array in app/layout.tsx.
 */

import { usePathname } from 'next/navigation';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/moilapp', label: 'Moil on LinkedIn' },
  { name: 'X', href: 'https://x.com/MoilApp', label: 'Moil on X (Twitter)' },
  { name: 'Instagram', href: 'https://www.instagram.com/themoilapp/', label: 'Moil on Instagram' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@moilapp', label: 'Moil on TikTok' },
  { name: 'Facebook', href: 'https://www.facebook.com/MoilWorks/', label: 'Moil on Facebook' },
] as const;

type NavLink = { label: string; href: string; external?: boolean };

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Business', href: '/business' },
  { label: 'Pricing', href: '/business/pricing' },
  { label: 'Marketing', href: '/marketing' },
  { label: 'Candidates', href: '/candidate' },
  { label: 'Job Search', href: '/candidate/searchjob' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
];

// Legal lives in the footer (organized), never the header. Both point to the
// combined Terms-of-Service + Privacy page at /privacy.
const LEGAL_LINKS: readonly NavLink[] = [
  { label: 'Terms of Service', href: '/privacy' },
  { label: 'Privacy Policy', href: '/privacy' },
];

// Section routes that ship their own footer — hide the global one there.
const OWN_FOOTER_PREFIXES = ['/business', '/es/business', '/candidate', '/marketing'];

export function SiteFooter() {
  const pathname = usePathname() || '/';
  const hasOwnFooter = OWN_FOOTER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
  if (hasOwnFooter) return null;

  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-gray-800 bg-[#0f1c3f] px-4 py-10 text-sm text-gray-400"
      aria-label="Site footer"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Brand + tagline */}
        <div className="max-w-sm">
          <a href="/" className="inline-block text-base font-semibold text-white">
            Moil
          </a>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            The AI co-founder for small business owners. Bilingual EN/ES. Built in Austin, TX.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
          {NAV_LINKS.map(({ label, href, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener' } : {})}
              className="text-xs text-gray-400 transition hover:text-white hover:underline"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Social — rel="me" is the SEO signal */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white">Follow Moil</p>
          <ul className="mt-3 flex gap-3">
            {SOCIAL_LINKS.map(({ name, href, label }) => (
              <li key={name}>
                <a
                  href={href}
                  rel="me noopener"
                  target="_blank"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-xs font-medium text-gray-300 transition hover:border-white hover:text-white"
                >
                  {name === 'X' ? '𝕏' : name[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright + organized legal links */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 border-t border-gray-800 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="text-gray-500">&copy; {year} Moil Enterprise Inc. All rights reserved.</span>
        <nav aria-label="Legal" className="flex gap-4">
          {LEGAL_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="text-gray-400 transition hover:text-white hover:underline">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
