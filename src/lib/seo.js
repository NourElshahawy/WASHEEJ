import { routing } from '@/i18n/routing';

/**
 * Metadata for an inner page: title, description, canonical URL and the
 * hreflang links to the same page in the other language.
 * `path` is the page's path without the locale, e.g. "/work".
 */
export function pageMetadata({ locale, path, title, description }) {
  const languages = Object.fromEntries(routing.locales.map((other) => [other, `/${other}${path}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, 'x-default': `/${routing.defaultLocale}${path}` },
    },
    // A page that sets its own Open Graph block must name the image again (the locale's generated image).
    openGraph: { title, description, url: `/${locale}${path}`, images: [`/${locale}/opengraph-image`] },
    twitter: { title, description, images: [`/${locale}/twitter-image`] },
  };
}
