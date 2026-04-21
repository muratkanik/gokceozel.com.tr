import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. next-intl middleware for locale routing
  let response = intlMiddleware(request);

  // 2. Supabase auth check
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const isApiOrNextInternal = request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/_next');

  if (!isApiOrNextInternal) {
    // Determine the path excluding locale for admin checks
    const pathWithoutLocale = request.nextUrl.pathname.replace(/^\/(tr|en|ar|ru)/, '') || '/';
    
    // Protect /admin routes
    if (pathWithoutLocale.startsWith('/admin') && !pathWithoutLocale.startsWith('/admin/login')) {
      if (!session) {
        // no user, redirect to login
        const url = request.nextUrl.clone();
        const locale = request.nextUrl.pathname.match(/^\/(tr|en|ar|ru)/)?.[1] || 'tr';
        url.pathname = `/${locale}/admin/login`;
        return NextResponse.redirect(url);
      }
    }

    // If user is logged in and tries to access /admin/login, redirect to /admin
    if (pathWithoutLocale.startsWith('/admin/login') && session) {
      const url = request.nextUrl.clone();
      const locale = request.nextUrl.pathname.match(/^\/(tr|en|ar|ru)/)?.[1] || 'tr';
      url.pathname = `/${locale}/admin`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
