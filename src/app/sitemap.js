import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

/** sitemap.xml: every page in both languages, each pointing at its translation (hreflang). */
const PAGES = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
];

export default function sitemap() {
  const url = (locale, path) => `${siteConfig.url}/${locale}${path}`;

  return PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((other) => [other, url(other, path)])),
          'x-default': url(routing.defaultLocale, path),
        },
      },
    })),
  );
}
