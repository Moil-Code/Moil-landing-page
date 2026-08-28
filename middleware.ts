import { NextRequest, NextResponse } from 'next/server'
import {
  HTML_LANG_HEADER,
  documentLocaleFromPathname,
  langCookieValue,
} from './src/common/i18n/pathLocale'

/**
 * Middleware — locale from the URL path, then cookie + Content-Language.
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
 *   - `/es` and `/es/*` are Spanish documents. Cookie `lang=es`,
 *     `Content-Language: es`, and `x-html-lang: es` for the root layout.
 *     Path wins over `?lg=`, Accept-Language, and any prior cookie.
 *   - Every other path is an English document (`html lang` + Content-Language
 *     `en`). Cookie is `es` only when `?lg=es` is explicit; otherwise `en`.
 *     Visiting `/business` does not flip a visitor to Spanish.
 *   - No redirects. Tracking params are untouched here.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lgParam = request.nextUrl.searchParams.get('lg')
  const htmlLang = documentLocaleFromPathname(pathname)
  const cookieLang = langCookieValue(pathname, lgParam)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(HTML_LANG_HEADER, htmlLang)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.cookies.set('lang', cookieLang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })
  response.headers.set('Content-Language', htmlLang)

  return response
}

export const config = {
  // Match all routes except Next.js internals and static file extensions
  matcher: ['/((?!api|_next/static|_next/image|favicon|.*\\..*).*)'],
}
