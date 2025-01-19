import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Define public routes that don't need auth or subscription
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth',
  '/pricing'
];

// Auth-specific routes that should bypass middleware completely
const authRoutes = ['/api/auth', '/auth/callback', '/auth/signout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass middleware for auth-specific routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await auth();
  
  // Check authentication
  if (!session?.user?.email) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};