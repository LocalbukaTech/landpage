import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN_COOKIE = 'localbuka_admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /secure-admin routes (except the login page itself)
  if (pathname.startsWith('/secure-admin')) {
    if (pathname === '/secure-admin/login') {
      // If already logged in, redirect away from login to dashboard
      const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
      if (token) {
        return NextResponse.redirect(new URL('/secure-admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Require admin token for all other /secure-admin/* routes
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL('/secure-admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/secure-admin/:path*'],
};
