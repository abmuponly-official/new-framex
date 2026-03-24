import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

/**
 * Detect preferred locale from:
 * 1. Cookie NEXT_LOCALE (user's manual choice — highest priority)
 * 2. CF-IPCountry header (Cloudflare edge, injected automatically)
 * 3. Accept-Language header
 * 4. Default: 'vi'
 */
function detectLocale(request: NextRequest): 'vi' | 'en' {
  // 1. User manual cookie preference
  const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLang === 'vi' || cookieLang === 'en') return cookieLang;

  // 2. Cloudflare IP-country (only available on Cloudflare Pages / Workers)
  const cfCountry = request.headers.get('CF-IPCountry');
  if (cfCountry) {
    return cfCountry === 'VN' ? 'vi' : 'en';
  }

  // 3. Accept-Language header fallback
  const acceptLang = request.headers.get('Accept-Language') || '';
  if (acceptLang.toLowerCase().includes('vi')) return 'vi';

  // 4. Default
  return 'vi';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route protection ─────────────────────────────────────────────────
  // Note: deep auth check (getUser) is done in each admin layout Server Component.
  // Here we do a lightweight cookie presence check for fast redirect.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const cookies = request.cookies.getAll();
    const hasSession = cookies.some(
      (c) =>
        c.name.startsWith('sb-') &&
        (c.name.endsWith('-auth-token') || c.name.endsWith('-auth-token.0'))
    );
    if (!hasSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Skip i18n for admin, api, and static files ──────────────────────────────
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/BingSiteAuth.xml'
  ) {
    return NextResponse.next();
  }

  // ── Root redirect: / → /{locale} ────────────────────────────────────────────
  if (pathname === '/') {
    const locale = detectLocale(request);
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    // Set cookie so next visit remembers
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  // ── next-intl handles all other locale routing ───────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|BingSiteAuth\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|css|js|woff2?|ttf|otf|webmanifest)).*)',
  ],
};
