import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const CARI_HOSTS = new Set(['cari.gokceozel.com', 'cari.gokceozel.com.tr']);

// Localized "services" path segments → internal /hizmetler rewrite
// TR uses its own segment; all others listed here
const SERVICES_SEGMENTS: Record<string, string> = {
  services: 'en',  // EN and AR/RU use "services"
  leistungen: 'de',
  soins: 'fr',
};

function rewriteServicesPath(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  // Match /<locale>/<segment> or /<locale>/<segment>/<rest>
  const m = pathname.match(/^\/([a-z]{2})\/(services|leistungen|soins)(\/.*)?$/);
  if (!m) return null;
  const [, locale, , rest] = m;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/hizmetler${rest ?? ''}`;
  return NextResponse.rewrite(url);
}

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
    const response = NextResponse.next();

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

  // --- Inspection Mode Check ---
  // Using native fetch to the Supabase REST API (Edge compatible) with 60s cache
  let inspectionModeActive = false;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Setting?key=eq.inspection_mode_active&select=value`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0 && data[0].value === 'true') {
        inspectionModeActive = true;
      }
    }
  } catch (error) {
    // Silently fail and fallback to false if DB fetch fails
    console.error("Inspection mode fetch error:", error);
  }

  // If inspection mode is active, handle redirects
  if (inspectionModeActive) {
    // 1. Redirect root to /en instead of default /tr
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/en';
      return NextResponse.redirect(url);
    }
    
    // 2. Intercept /tr routes and redirect to /en
    if (pathname === '/tr' || pathname.startsWith('/tr/')) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/tr/, '/en');
      return NextResponse.redirect(url);
    }
  }

  const servicesRewrite = rewriteServicesPath(request);
  if (servicesRewrite) return servicesRewrite;

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
