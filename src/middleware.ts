import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_COOKIE = 'admin_access_token';
const REFRESH_COOKIE = 'admin_refresh_token';

const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || '';
  if (!secret) return null;
  return new TextEncoder().encode(secret);
};

const isValidAccessToken = async (token?: string) => {
  const secret = getJwtSecret();
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
};

/**
 * 관리자 경로 보호
 * @param request NextRequest
 * @returns NextResponse
 */
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const accessValid = await isValidAccessToken(accessToken);

  if (!accessValid && refreshToken) {
    const refreshUrl = request.nextUrl.clone();
    refreshUrl.pathname = '/api/admin/refresh';
    refreshUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(refreshUrl);
  }

  if (!accessValid && !refreshToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*'],
};
