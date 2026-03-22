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
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie =
      request.cookies.get('sb-access-token') ||
      request.cookies.get('supabase-auth-token');

    if (!sessionCookie) {
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
    pathname === '/favicon.ico'
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)',
  ],
};
