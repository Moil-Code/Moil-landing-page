import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Fix 1.1: Strip ?lg= parameter — 301 redirect to clean URL, store preference in cookie.
  // Root cause of duplicate content: browser language detection was appending ?lg=en or ?lg=es
  // to every URL, creating hundreds of duplicate 'homepage' variants in Google's index.
  if (searchParams.has('lg')) {
    const lang = searchParams.get('lg') || 'en'
    const cleanUrl = new URL(pathname, request.url)
    // Preserve any other query params (except 'lg')
    searchParams.forEach((value, key) => {
      if (key !== 'lg') cleanUrl.searchParams.set(key, value)
    })
    const response = NextResponse.redirect(cleanUrl, { status: 301 })
    response.cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  // If no lang cookie yet, detect from Accept-Language header — set cookie only, no redirect.
  // Google sees clean canonical URLs; human visitors still get the right language via cookie.
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
  matcher: ['/((?!api|_next/static|_next/image|favicon|.*\..*).*)'],
}
