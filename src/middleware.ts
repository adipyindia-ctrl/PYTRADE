import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = [
  '/dashboard',
  '/kyc',
  '/bank-accounts',
  '/orders',
  '/portfolio',
  '/funds',
  '/transactions',
  '/profile',
  '/ipo',
  '/watchlist',
  '/markets',
  '/stocks',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // getToken reads the JWT cookie — fully Edge-compatible, no Node.js APIs
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
