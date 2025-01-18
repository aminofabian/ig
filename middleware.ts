import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const protectedRoutes = [
  '/dashboard',
  '/',
  '/analytics',
  '/profile',
];

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/profile/:path*',
    '/:path*',
  ],
};