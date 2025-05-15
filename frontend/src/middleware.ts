import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from '@/app/lib/api';

export async function middleware(request: NextRequest) {
  const publicPaths = new Set<string>(['/login', '/signup']);
  const protectedPath = !publicPaths.has(request.nextUrl.pathname);

  const access_token = request.cookies.get('sb_access');
  const refresh_token = request.cookies.get('sb_refresh')
  if (!access_token || !refresh_token) {
    if (protectedPath) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  let status = await getUser(cookieHeader);

  if (status !== 200) {
    let response;
    if (protectedPath) response = NextResponse.redirect(new URL('/login', request.url));
    else response = NextResponse.next();
    
    response.cookies.delete('sb_access');
    response.cookies.delete('sb_refresh');

    return response;
  }

  if (!protectedPath) return NextResponse.redirect(new URL('/', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup']
};