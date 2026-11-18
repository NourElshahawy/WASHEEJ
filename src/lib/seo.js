import { routing } from '@/i18n/routing';

/**
 * Shared metadata helpers.
 *
 * Next.js replaces a parent's `openGraph` block entirely when a page sets its
 * own, so every page builds its Open Graph block from the same base
 * (type, site name, locale, the locale's image) and only adds what differs.
 */

const SITE_NAME = { ar: 'وشيج', en: 'Washeej' };

/** Favicons (the .ico for old clients is public/favicon.ico). */
export const siteIcons = {
  icon: [
    { url: '/favicon/icon-32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
    { url: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
  apple: '/favicon/icon-192.png',
};

export const siteViewport = {
  themeColor: '#faf6f2',
  colorScheme: 'light',
};
const OG_LOCALE = { ar: 'ar_AR', en: 'en_US' };

/** The share image for a language (rendered by scripts/og/render-og.mjs). */
export const ogImage = (locale) => ({
  url: `/og/og-${locale}.jpg`,
  width: 1200,
  height: 630,
  alt: locale === 'ar' ? 'وشيج — نصنع الرابط بين علامتك وعملائها' : 'Washeej — We build the bond between your brand and its people.',
});

/** The Open Graph fields every page shares. */
export function openGraphBase(locale) {
  return {
    type: 'website',
    siteName: SITE_NAME[locale],
    locale: OG_LOCALE[locale],
    alternateLocale: routing.locales.filter((other) => other !== locale).map((other) => OG_LOCALE[other]),
    images: [ogImage(locale)],
  };
}

/** Canonical + hreflang links for a path (without the locale, e.g. "/work"). */
export function alternatesFor(locale, path) {
  const languages = Object.fromEntries(routing.locales.map((other) => [other, `/${other}${path}`]));
  return {
    canonical: `/${locale}${path}`,
    languages: { ...languages, 'x-default': `/${routing.defaultLocale}${path}` },
  };
}

/**
 * Metadata for a page: title, description, canonical URL, the hreflang links
 * to the same page in the other language, and Open Graph / Twitter built on
 * the shared base.
 * `title` is a string (the layout adds " — وشيج") or { absolute } for a full title.
 */
export function pageMetadata({ locale, path, title, description }) {
  const plainTitle = typeof title === 'string' ? title : title.absolute;
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: { ...openGraphBase(locale), title: plainTitle, description, url: `/${locale}${path}` },
    twitter: { card: 'summary_large_image', title: plainTitle, description, images: [ogImage(locale).url] },
  };
}
