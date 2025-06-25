import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = request.cookies.get('isLogin')?.value;
  const { pathname } = request.nextUrl;

  const authPages = ['/login', '/signup', '/verify-email'];

  if (isLogin && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/verify-email'],
};
