import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['tr', 'en', 'ar', 'ru', 'fr', 'de'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed' // Default locale has no prefix
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
