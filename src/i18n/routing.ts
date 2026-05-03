import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['tr', 'en', 'ar', 'ru', 'fr', 'de'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  // Disable auto-detection so browser Accept-Language or a stale NEXT_LOCALE cookie
  // cannot redirect the user away from their explicitly chosen locale.
  // Without this, clicking "TR" → /hizmetler is immediately redirected back to /de/hizmetler
  // if the user previously visited the German version.
  localeDetection: false,
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
