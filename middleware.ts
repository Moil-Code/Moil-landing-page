import { NextRequest, NextResponse } from 'next/server'
import {
  documentLocaleFromPathname,
  langCookieValue,
} from './src/common/i18n/pathLocale'

/**
 * Middleware — the `lang` cookie and Content-Language, from the URL path.
 *
 * History: a previous version stripped `?lg=en|es` from every URL with a 301,
 * storing the language in a cookie. That broke Spanish indexability — Google
 * had no Spanish URL to index because every `?lg=es` request 301'd to the
 * clean URL before content rendered.
 *
 * A later version kept `?lg=` but inferred a missing cookie from
 * Accept-Language and never looked at `/es`. Crawlers hit `/es/business`
 * with `Accept-Language: en`, so the Spanish door got
 * `Set-Cookie: lang=en` and `<html lang="en">`.
 *
 * Current behavior:
 *   - `/es` and `/es/*` are Spanish documents: cookie `lang=es`,
 *     `Content-Language: es`. Path wins over `?lg=`, Accept-Language, and
 *     any prior cookie.
 *   - Every other path is an English document (Content-Language `en`).
 *     Cookie is `es` only when `?lg=es` is explicit; otherwise `en`.
 *     Visiting `/business` does not flip a visitor to Spanish.
 *   - `<html lang>` is NOT set here. Each language has its own root layout
 *     (app/(en)/layout.tsx, app/es/layout.tsx), so the pages never read the
 *     request and render statically. The `x-html-lang` request header this
 *     middleware used to add is gone with that.
 *   - The cookie is written only when it CHANGES. It was sent on every
 *     response, which put a Set-Cookie on every page and kept any shared
 *     cache from storing the HTML; a returning visitor whose cookie already
 *     says the right language now gets none.
 *   - No redirects. Tracking params are untouched here.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lgParam = request.nextUrl.searchParams.get('lg')
  const htmlLang = documentLocaleFromPathname(pathname)
  const cookieLang = langCookieValue(pathname, lgParam)

  const response = NextResponse.next()

  if (request.cookies.get('lang')?.value !== cookieLang) {
    response.cookies.set('lang', cookieLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      // Preference-only value; never let it ride a plain-HTTP hop. Dev runs
      // on http://localhost, so gate on production.
      secure: process.env.NODE_ENV === 'production',
    })
  }
  response.headers.set('Content-Language', htmlLang)

  return response
}

export const config = {
  // Pages only: not the API, Next.js internals, or any file with an
  // extension (public assets, robots.txt, sitemap.xml).
  matcher: ['/((?!api|_next/static|_next/image|_next/data|favicon|.*\\..*).*)'],
}
