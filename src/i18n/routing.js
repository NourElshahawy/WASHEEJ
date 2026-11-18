import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  // Arabic is always the default entry point; visitors switch with the toggle.
  localeDetection: false,
  // hreflang lives in the HTML <head> and in sitemap.xml (x-default → /ar/…).
  // next-intl's own Link header pointed x-default at "/" instead, so it is off.
  alternateLinks: false,
});

export const localeDirection = { ar: 'rtl', en: 'ltr' };
