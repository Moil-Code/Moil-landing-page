import { Inter } from 'next/font/google';

import '../../../app/globals.css';
import Analytics from './analytics';
import SignupEventBridge from './SignupEventBridge';
import { SiteFooter } from './SiteFooter';
import CookieConsent from './CookieConsent';
import PresenceBeacon from './PresenceBeacon';
import type { SiteLocale } from '../i18n/pathLocale';
import { SAME_AS } from '../seo/sameAs';
import { moilOffers } from '../seo/offers';
import { jsonLd } from '../seo/jsonLd';

// Inter is self-hosted rather than loaded with a CSS `@import`. A remote
// stylesheet is the worst case for render-blocking: the browser must download
// our CSS, parse it, then open a second origin and download another stylesheet
// before it can paint. next/font self-hosts the woff2 files from our own origin,
// inlines the @font-face rules into the build's CSS, and preloads them.
//
// Inter is the single typeface across the marketing site. Keeping the variable
// on <html> means its scoped business/marketing tokens resolve on every route.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


/**
 * The HTML document every page renders in: <html>, the head scripts and
 * JSON-LD, the trackers' consent gate, the footer and the cookie banner.
 *
 * There are two root layouts, one per language (app/(en)/layout.tsx and
 * app/es/layout.tsx), and both render this with their own `lang`. The
 * language is therefore a property of the route, known at build time:
 * `/es/*` is `<html lang="es">` on the first byte, and no page has to read
 * the request to find out, which is what lets the pages render statically.
 * (It used to come from a middleware request header, which made 44 of 46
 * routes render per request with `Cache-Control: private, no-store`.)
 */
export function RootDocument({
  lang,
  children,
}: {
  lang: SiteLocale;
  children: React.ReactNode;
}) {

  return (
    // The font *variable* classes must sit on <html>, not <body>: business.css
    // builds its --body / --display / --mono tokens on `:root`, and a custom
    // property referencing an undefined variable is invalid at computed-value
    // time — which silently drops every font-family on the page to the Tailwind
    // fallback stack. Keep them here so :root can resolve them.
    <html lang={lang} className={`scroll-smooth ${inter.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        {/* Pre-paint theme restore. The server starts in light mode, then this
            blocking script applies a saved dark preference before the browser
            paints. The attribute lives on <html> for the entire application so
            client-side and full-page navigation share one stable theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem('moil-theme');d.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){d.setAttribute('data-theme','light')}})()`,
          }}
        />
        <meta name="theme-color" content="#5843BE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Moil Enterprise Inc.",
              "alternateName": "Moil",
              "url": "https://www.moilapp.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.moilapp.com/moil-512.png",
                "width": 512,
                "height": 512
              },
              "description": "Moil builds an AI co-founder for small business owners. It learns a business once, then produces the finished work the owner has no time to make, in English and Spanish.",
              "foundingDate": "2023",
              "industry": "Business Software",
              "numberOfEmployees": "2-10",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Buda",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "cs@moilapp.com",
                "url": "https://www.moilapp.com"
              },
              // sameAs MUST exactly match the canonical URLs Google has indexed
              // for each profile (verified Apr 2026). A typo (e.g. /moil-app vs
              // /moilapp on LinkedIn) breaks the entity-disambiguation signal
              // and lets Google confuse Moil with namesake brands.
              // One list: src/common/seo/sameAs.ts (SiteFooter reads it too).
              "sameAs": SAME_AS,
              // Organization takes `makesOffer`, not `offers` — `offers` is a
              // Product/Service property and is silently dropped here. The offer
              // bodies come from src/common/seo/offers.ts so price, url and
              // priceValidUntil cannot drift between the pages that declare them.
              "makesOffer": moilOffers()
            })
          }}
        />


        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Moil",
              // "moil" is a dictionary word (to toil and moil) and the ticker of
              // MOIL Limited, the NSE-listed manganese miner — so the bare term is
              // not a navigational query for us and never will be. Google's site
              // name docs say alternateName is what it falls back to when the
              // preferred name is not selected; these are the qualified forms
              // owners actually type, and the ones that convert in Search Console.
              "alternateName": ["Moil App", "Moilapp"],
              "url": "https://www.moilapp.com",
              "description": "The co-founder who does the work you never get to — plans, posts, and flyers, produced from one profile of the business, in English and Spanish.",
            })
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        {/* Every tracker (GA4, Clarity, FB Pixel, Apollo) lives inside
            <Analytics />, which renders nothing until the visitor consents.
            Do not add a tracking <Script> here — it would bypass the gate. */}
        <Analytics />
        {/* sign_up_start on every register CTA (data-signup-cta) — consent-gated inside. */}
        <SignupEventBridge />
        {/* Landing presence for the admin "Active users" page. Not a tracker:
            without consent the id lives in this tab only. Off when
            NEXT_PUBLIC_MOIL_GATEWAY_ORIGIN is unset. */}
        <PresenceBeacon />
        <div id="modal"></div>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          {/* Global SiteFooter — emits social rel="me" links on every page,
              the cheapest brand-identity SEO signal we have. /business has
              its own rich BusinessFooter that stacks above this one for now;
              visual consolidation is a Phase 2 polish task. */}
          <SiteFooter />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}

