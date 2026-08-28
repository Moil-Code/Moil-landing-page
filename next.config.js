// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // 301 to the actual apps on their subdomains
      {
        source: '/business/login',
        destination: 'https://business.moilapp.com/login',
        permanent: true,
      },
      {
        source: '/business/register',
        destination: 'https://business.moilapp.com/register',
        permanent: true,
      },
      {
        source: '/candidate/login',
        destination: 'https://candidate.moilapp.com/login',
        permanent: true,
      },
      {
        source: '/candidate/register',
        destination: 'https://candidate.moilapp.com/register',
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // HSTS. The Aug 2026 Site Audit reported subdomains with no HSTS.
            // `includeSubDomains` is what makes the policy cover
            // blog/business/candidate.moilapp.com, and it is also why this must
            // not ship until every subdomain genuinely serves HTTPS — the
            // browser will refuse plain HTTP to all of them for `max-age`.
            // They do (all are HTTPS-only behind the same certs), so this is
            // safe; `preload` is deliberately omitted, because submitting to
            // the preload list is effectively irreversible and should be a
            // separate, deliberate decision.
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
    // Same-origin fallback for the magnet. Client still prefers
    // NEXT_PUBLIC_PLAN_API_ORIGIN; this only fires when that (or the
    // server-only PLAN_API_ORIGIN) is set. No model call lives here.
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
