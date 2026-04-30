/**
 * Homepage (`/`) — broad SMB landing page.
 *
 * SEO design (per MOIL SEO master plan, Task 1.1 + 2.1):
 *   - Self-canonical to `https://www.moilapp.com/` (NOT redirected to /business).
 *   - Targets broad non-brand SMB intent: "AI for small business," "small business AI tool."
 *     `/business` owns the deeper "AI business plan generator" intent — this page
 *     does NOT compete with it; it funnels traffic into it.
 *   - Server-rendered for crawl reliability. No client-side JS required to render content.
 *   - Bilingual: English by default. Spanish version ships in PR B once middleware
 *     stops stripping `?lg=es` and hreflang alternates can be emitted.
 *
 * The previous version of this file was a 7-line `redirect('/business')` — that
 * collapsed all homepage SEO authority into /business and prevented `/` from
 * ranking independently. Reverting that decision (master plan Option A).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { baseURL1 } from '../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Moil — The AI Co-Founder for Small Business',
  description:
    'Moil gives small business owners an AI co-founder. Business plans, marketing, and hiring — bilingual EN/ES. Try free, from $25/mo.',
  alternates: {
    canonical: `${baseURL1}/`,
    // hreflang alternates land in PR B once middleware preserves ?lg=es
    languages: {
      'en-US': `${baseURL1}/`,
      'x-default': `${baseURL1}/`,
    },
  },
  openGraph: {
    title: 'Moil — The AI Co-Founder for Small Business',
    description:
      'AI tools for small business owners: business plans, marketing, hiring. Bilingual EN/ES. From $25/mo.',
    url: `${baseURL1}/`,
    images: [
      {
        url: '/og_image_v2.png',
        width: 1200,
        height: 630,
        alt: 'Moil — AI Co-Founder for Small Business',
      },
    ],
  },
  twitter: {
    title: 'Moil — The AI Co-Founder for Small Business',
    description:
      'AI tools for small business owners: business plans, marketing, hiring. Bilingual EN/ES. From $25/mo.',
  },
};

const PRODUCT_CARDS = [
  {
    title: 'Grow your business',
    body: 'Generate an investor-ready business plan, market research, and 5-year financials in minutes. Built for SMB owners — not Fortune 500 consultants.',
    href: '/business',
    cta: 'Start your business plan',
    keywords: 'AI business plan generator, small business growth platform',
  },
  {
    title: 'Hire your team faster',
    body: 'Post one job, reach 10+ platforms. AI ranks every applicant by skills, language, and fit — average time-to-hire: 11 days.',
    href: '/business#hiring',
    cta: 'See smart hiring',
    keywords: 'smart hiring software, AI recruiting tool',
  },
  {
    title: 'Market like a pro',
    body: 'Content360 builds you a 30-day calendar with AI-generated images, video, and copy — so you stop guessing what to post.',
    href: '/marketing',
    cta: 'Explore Content360',
    keywords: 'AI content marketing, content calendar AI',
  },
] as const;

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          AI for small business — your co-founder has arrived.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
          Moil is the bilingual AI co-founder for small business owners. Generate a complete
          business plan, run your marketing, and hire your team — all in one platform.
          Trusted by 500+ businesses. Available in English and Spanish.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/business"
            className="inline-flex items-center justify-center rounded-md bg-[#5843BE] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#4836a3]"
          >
            Get started free
          </Link>
          <Link
            href="/business/pricing"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 transition hover:border-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-100"
          >
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          From $25/month · 30-day money-back guarantee · No credit card to start
        </p>
      </section>

      {/* Three product cards — internal links into deep pages */}
      <section className="mx-auto max-w-6xl px-4 pb-20" aria-labelledby="what-moil-does">
        <h2 id="what-moil-does" className="text-center text-3xl font-bold md:text-4xl">
          What Moil does for small businesses
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          Three things every small business owner needs — bundled into one AI co-founder.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRODUCT_CARDS.map((card) => (
            <article
              key={card.href}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {card.body}
              </p>
              <Link
                href={card.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-[#5843BE] hover:underline"
              >
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Social proof + bilingual mention */}
      <section className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Built for small businesses · Disponible en Español
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Texas-built. Bilingual by default. Trusted by 500+ businesses.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            Moil was built for the SMB owners corporate AI keeps ignoring — HVAC, cleaning,
            construction, hospitality, and trades. Operates fluently in English and Spanish.
            From the first business plan to the first hire, Moil is the co-founder you've been
            covering for.
          </p>
          <div className="mt-8">
            <Link
              href="/business"
              className="inline-flex items-center justify-center rounded-md bg-[#5843BE] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#4836a3]"
            >
              Start free with Moil
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links — additional internal linking */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold">Where to start</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/business" className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-100">
            Business plan generator
          </Link>
          <Link href="/business/pricing" className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-100">
            Pricing
          </Link>
          <Link href="/marketing" className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-100">
            Content marketing
          </Link>
          <Link href="/candidate" className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-100">
            Find a job
          </Link>
          <a
            href="https://blog.moilapp.com"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-100"
          >
            Blog
          </a>
        </div>
      </section>
    </div>
  );
}
