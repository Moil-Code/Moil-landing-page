// @ts-check

const { getLoginUrl, getRegisterUrl } = require("./app/business/preview/previewClient");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework in every response.
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    // Testimonial headshots are served from Cloudinary — allow next/image
    // to optimize them (AVIF/WebP, responsive sizing, lazy loading).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Retired comparison pages (Aug 2026). `bilingual-local-shop` baked the
      // "shop" wording into a URL; `moil-vs-claude` was a near-duplicate of the
      // ChatGPT page, which is the scaled-content pattern we are moving away from.
      {
        source: '/compare/bilingual-local-shop',
        destination: '/compare/moil-vs-buffer',
        permanent: true,
      },
      {
        source: '/compare/moil-vs-claude',
        destination: '/compare/moil-vs-chatgpt',
        permanent: true,
      },
      // Fix 2.6: 301 redirects for dead pages that are actively linked internally
      // and appear in GSC as 404 crawl errors
      {
        source: '/home',
        destination: '/business',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/business',
        permanent: true,
      },
      {
        source: '/en/',
        destination: '/business',
        permanent: true,
      },
      {
        source: '/es',
        destination: '/es/business',
        permanent: true,
      },
      {
        source: '/es/',
        destination: '/es/business',
        permanent: true,
      },
      {
        source: '/compare/moil-vs-chatgp',
        destination: '/compare/moil-vs-chatgpt',
        permanent: true,
      },
      // SEO: crawlable login/register paths on the landing domain that
      // 301 to the app origin. NEXT_PUBLIC_REGISTER_ORIGIN overrides;
      // unset stays production so www is unchanged if the env is missing.
      {
        source: '/business/login',
        destination: getLoginUrl(),
        permanent: true,
      },
      {
        source: '/business/register',
        destination: getRegisterUrl(),
        permanent: true,
      },
      {
        source: '/candidate/login',
        destination: 'https://employee-beta.moilapp.com/login',
        permanent: true,
      },
      {
        source: '/candidate/register',
        destination: 'https://employee-beta.moilapp.com/register',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Framework fingerprint removed below via poweredByHeader:false;
            // this policy set is the enforced minimum that cannot break the
            // page: it only constrains framing, plugins and <base>. Script
            // sources are measured first (see the Report-Only header) because
            // the site loads inline JSON-LD, the theme restore, and — after
            // consent — GA4, Clarity, the FB pixel, Apollo, Google Translate
            // and Maps; enforcing script-src blind would take one of them down
            // silently.
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://connect.facebook.net https://assets.apollo.io https://*.apollo.io https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.moilapp.com https://www.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://www.facebook.com https://*.apollo.io https://translate.googleapis.com https://maps.googleapis.com",
              "frame-src 'self' https://www.facebook.com https://www.googletagmanager.com",
              "form-action 'self' https://*.moilapp.com",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // HSTS, in response to the Aug 2026 Site Audit's "subdomains don't
            // support HSTS" notice.
            //
            // Read the scope carefully before relying on this. Per RFC 6797,
            // `includeSubDomains` covers subdomains OF THE HOST THAT SENT THE
            // HEADER. This app serves www.moilapp.com, so it covers
            // www.moilapp.com and *.www.moilapp.com — and nothing else.
            // blog / business / candidate.moilapp.com are SIBLINGS of www, not
            // subdomains of it, so this header does not reach them. An earlier
            // version of this comment claimed it did; it was wrong.
            //
            // Covering all of *.moilapp.com requires the header on the apex
            // `moilapp.com`, and the apex is a hosting-level redirect to www
            // (see src/common/constants/baseUrl.tsx), not a route in this app —
            // so that has to be added in nginx/hosting config, not here.
            // blog.moilapp.com sends its own via the Blog repo's vercel.json.
            // business and candidate still have none.
            //
            // `preload` is deliberately omitted: submitting to the browser
            // preload list is effectively irreversible and deserves its own
            // decision.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
        ],
      },
      {
        source: '/es',
        headers: [{ key: 'Content-Language', value: 'es' }],
      },
      {
        source: '/es/:path*',
        headers: [{ key: 'Content-Language', value: 'es' }],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async rewrites() {
    // Same-origin /plan/preview → $PLAN_API_ORIGIN/plan/preview.
    // The magnet client always fetches relative /plan/preview. This
    // rewrite is the CORS-safe path. Fires when PLAN_API_ORIGIN (or
    // NEXT_PUBLIC_PLAN_API_ORIGIN as a leftover fallback) is set.
    // No model call lives here.
    const planOrigin = String(
      process.env.PLAN_API_ORIGIN || process.env.NEXT_PUBLIC_PLAN_API_ORIGIN || "",
    ).replace(/\/+$/, "");
    if (!planOrigin) return [];
    return [
      {
        source: "/plan/preview",
        destination: `${planOrigin}/plan/preview`,
      },
      {
        source: "/plan/preview/:slug",
        destination: `${planOrigin}/plan/preview/:slug`,
      },
    ];
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
