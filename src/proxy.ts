import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const CARI_HOSTS = new Set(['cari.gokceozel.com', 'cari.gokceozel.com.tr']);

export default async function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0] || '';
  const pathname = request.nextUrl.pathname;

  if (CARI_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.pathname = '/tr/cari';
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }

  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/tr/admin/');
  if (isAdminPath) {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const normalizedPath = pathname.replace(/^\/tr\/admin/, '/admin');

    if (pathname.startsWith('/tr/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = normalizedPath;
      return NextResponse.redirect(url);
    }

    if (normalizedPath.startsWith('/admin') && !normalizedPath.startsWith('/admin/login')) {
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }

    if (normalizedPath.startsWith('/admin/login') && session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
