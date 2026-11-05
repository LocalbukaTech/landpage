import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidJwtToken } from '@/lib/jwt';

const ADMIN_TOKEN_COOKIE = 'localbuka_admin_token';
const ADMIN_USER_COOKIE = 'localbuka_admin_user';

export function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;

  // Safely decode URI components to prevent %73ecure-admin bypasses
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // If decoding fails, keep raw pathname
  }

  // Normalize duplicate slashes (e.g., //secure-admin -> /secure-admin)
  const normalizedSlashes = pathname.replace(/\/+/g, '/');
  const lowerPath = normalizedSlashes.toLowerCase();

  // If path targets the secure admin area
  if (lowerPath.startsWith('/secure-admin')) {
    // 1. Force lowercase & canonical URL normalization if casing or slashes differ
    if (pathname !== lowerPath || request.nextUrl.pathname !== normalizedSlashes) {
      const canonicalUrl = new URL(lowerPath, request.url);
      canonicalUrl.search = request.nextUrl.search;
      return NextResponse.redirect(canonicalUrl, 308);
    }

    const rawToken = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    const hasValidToken = isValidJwtToken(rawToken);

    // 2. Direct root route /secure-admin or /secure-admin/ -> redirect to dashboard or login
    if (lowerPath === '/secure-admin' || lowerPath === '/secure-admin/') {
      const destination = hasValidToken ? '/secure-admin/dashboard' : '/secure-admin/login';
      const redirectUrl = new URL(destination, request.url);
      const response = NextResponse.redirect(redirectUrl);
      if (!hasValidToken && rawToken) {
        response.cookies.delete(ADMIN_TOKEN_COOKIE);
        response.cookies.delete(ADMIN_USER_COOKIE);
      }
      return response;
    }

    // 3. Login page route handling
    if (lowerPath === '/secure-admin/login') {
      if (hasValidToken) {
        // If already authenticated with a valid, unexpired token, redirect to dashboard
        return NextResponse.redirect(new URL('/secure-admin/dashboard', request.url));
      }
      // If an invalid or expired token is present, purge the bad cookies while showing login
      const response = NextResponse.next();
      if (rawToken && !hasValidToken) {
        response.cookies.delete(ADMIN_TOKEN_COOKIE);
        response.cookies.delete(ADMIN_USER_COOKIE);
      }
      return response;
    }

    // 4. Require valid, non-expired JWT for ALL other /secure-admin/* routes
    if (!hasValidToken) {
      const loginUrl = new URL('/secure-admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      // Evict corrupt or invalid tokens immediately
      response.cookies.delete(ADMIN_TOKEN_COOKIE);
      response.cookies.delete(ADMIN_USER_COOKIE);
      return response;
    }

    // 5. Authenticated admin request: proceed with no-index & no-cache security headers
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/secure-admin',
    '/secure-admin/:path*',
    '/Secure-admin',
    '/Secure-admin/:path*',
    '/SECURE-ADMIN',
    '/SECURE-ADMIN/:path*',
    '/Secure-Admin',
    '/Secure-Admin/:path*',
  ],
};
