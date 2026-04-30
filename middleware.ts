import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware — language cookie management ONLY. Does NOT redirect on `?lg=`.
 *
 * History: a previous version stripped `?lg=en|es` from every URL with a 301,
 * storing the language in a cookie. That broke Spanish indexability — Google
 * had no Spanish URL to index because every `?lg=es` request 301'd to the
 * clean URL before content rendered. Result: zero non-English search surface
 * on a fully bilingual product.
 *
 * Current behavior:
 *   - If `?lg=en|es` is present, set the cookie and continue. The URL is
 *     preserved so Google can index `/business?lg=es` as a canonical Spanish
 *     page (with hreflang alternates pointing to/from `/business`).
 *   - If no cookie is set, infer from Accept-Language and write the cookie.
 *     No redirect — Google sees clean URLs by default.
 *   - Tracking params (`?ref=`, `?utm_*`, `?fbclid=`, `?gclid=`) are NOT
 *     touched here; they're handled at the metadata layer (canonical strips
 *     them) and at the robots layer (disallow patterns).
 *
 * Architectural followup (Phase 4 — see MOIL SEO/IMPLEMENTATION_PLAN.md):
 * migrate Spanish from `?lg=es` query-string to `/es/*` path prefix. Cleaner
 * URLs, better cache keys, easier hreflang. Defer until Phases 1–3 complete.
 */
export function middleware(request: NextRequest) {
  const lgParam = request.nextUrl.searchParams.get('lg')

  // Path A — `?lg=` present: persist as cookie, continue (NO redirect).
  if (lgParam === 'en' || lgParam === 'es') {
    const response = NextResponse.next()
    response.cookies.set('lang', lgParam, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
    return response
  }

  // Path B — no cookie yet: infer from Accept-Language, set cookie, continue.
  if (!request.cookies.get('lang')) {
    const acceptLang = request.headers.get('accept-language') || ''
    const lang = acceptLang.toLowerCase().startsWith('es') ? 'es' : 'en'
    const response = NextResponse.next()
    response.cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  // Match all routes except Next.js internals and static file extensions
  matcher: ['/((?!api|_next/static|_next/image|favicon|.*\\..*).*)'],
}
