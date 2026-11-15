import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  // Arabic is always the default entry point; visitors switch with the toggle.
  localeDetection: false,
});

export const localeDirection = { ar: 'rtl', en: 'ltr' };
