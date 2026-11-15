import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { workItems } from '@/data/work';

/** sitemap.xml: every page in both languages, each pointing at its translation (hreflang). */
const PAGES = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
  ...workItems.map(({ slug }) => ({ path: `/work/${slug}`, priority: 0.7, changeFrequency: 'monthly' })),
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
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
