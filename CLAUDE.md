# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server (next dev --webpack)
npm run build      # Production build (next build --webpack)
npm run start      # Start production server
npm run lint       # Run ESLint (flat config via eslint-config-next)
```

Notes:
- Dev and build run with `--webpack` (Turbopack is opted out); the `webpack` override in `next.config.js` stubs Node core modules (`fs`/`net`/`tls`) and externalizes `pino-pretty`/`lokijs`/`encoding`.
- Package manager: `yarn` is used for installs (see `vercel.json`), but `npm` scripts work fine.
- No test runner is configured in this repo.

## Architecture

This is a **Next.js 16 App Router** project using TypeScript, Tailwind CSS, and React 19.

### Multi-section landing page

The site has four distinct sections, each with its own route, layout, and component tree:

| Route | Purpose |
|---|---|
| `/business` | Main landing page (default — root `/` redirects here) |
| `/candidate` | Job marketplace / candidate portal |
| `/marketing` | Content360 marketing product |
| `/legacy` | Legacy page (not actively maintained) |

Each section has a `layout.tsx` for SEO metadata and may have its own CSS file (e.g., `app/business/business.css`). The root `app/page.tsx` `redirect()`s to `/business` so the homepage has one canonical URL. Beyond these sections, `app/` also holds standalone legal/SEO pages (`privacy`, `terms`, `dmca`, `dpa`, `cookies`, `subprocessors`, `accessibility`, `contact`, etc.) plus generated `robots.ts` and `sitemap.ts`.

### SEO & middleware

SEO is a first-class concern here — much of `next.config.js` and `middleware.ts` exists to serve it, and changes to URLs, redirects, or language handling can break search indexing.

- `next.config.js`: 301 `redirects()` for dead-but-linked pages (`/home`, `/en` → `/business`), security `headers()` (X-Frame-Options, nosniff, Referrer-Policy) plus long-lived cache headers for static assets, and Cloudinary (`res.cloudinary.com`) allowed as a `next/image` remote source.
- `middleware.ts`: language-cookie management ONLY (sets a `lang` cookie from `?lg=en|es` or `Accept-Language`). It deliberately does NOT redirect on `?lg=` — a prior 301-stripping version destroyed Spanish indexability. Read the long comment at the top before touching it.

### Component organization

- `app/<section>/` — Page components, section-specific components, hooks, and utilities
- `src/common/` — Shared components, hooks, translations, and i18n config
- `src/candidate/` — Candidate-specific components (57 files)
- `src/legacy/` — Legacy components including Gemini API utilities
- `src/contexts/` — React Context providers (LanguageContext)

### Internationalization

Custom i18n system layered on top of i18next:

- Languages: `en` and `es`
- Detection priority: URL querystring `?lg=` → localStorage `tlang` → browser navigator (client side, in `LanguageContext`); `middleware.ts` independently persists a `lang` cookie for server-side awareness
- Spanish is mid-migration from the `?lg=es` querystring to an `/es/*` path prefix (see `app/es/`); both coexist — prefer matching whichever the page you're editing already uses
- Translation strings live in `src/common/translations/en.ts` and `es.ts` as nested objects
- Language state is managed via `src/contexts/LanguageContext.tsx`
- Each section has a `useTranslation.ts` hook (e.g., `app/business/useTranslation.ts`) that selects the right subtree of translations
- `src/common/components/I18nProvider.tsx` wraps the app and handles detection/persistence

### AI demo endpoints

`app/api/demo/` contains serverless routes (business-plan, market-research, financial-projections, etc.) that all call Google Gemini via `src/legacy/utils/geminiApi`. These require `NEXT_PUBLIC_GOOGLE_API_KEY_1` and `NEXT_PUBLIC_GOOGLE_API_KEY_2` env vars (see `.env.example`).

### Styling

- Tailwind CSS with custom brand colors (`moil-navy`, `moil-blue`, `moil-orange`, `moil-green`) defined in `tailwind.config.js`
- Custom breakpoints: `vsm` (320px), `xsm` (400px), `zsm` (480px), `tablet`, `ipad`, `desktop`, `xtraxl` (1440px), `xxlarge` (3200px)
- Global styles split across `app/globals.css` (2009 lines) and `styles/globals.css`
- CSS custom properties for theme variables; dark mode infrastructure exists in `useBusinessUi.ts` but is not fully implemented

### Path aliases

`~~/*` and `@/*` both resolve to the repo root (configured in `tsconfig.json`).

### Deployment

Deployed on Vercel. `vercel.json` sets install command to `yarn install`. TypeScript and ESLint build errors can be bypassed via `NEXT_PUBLIC_IGNORE_BUILD_ERROR=true` env var (see `next.config.js`).
