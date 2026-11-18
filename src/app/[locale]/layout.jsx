import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { alternatesFor, ogImage, openGraphBase, siteIcons, siteViewport } from '@/lib/seo';
import SiteDocument from '@/components/SiteDocument/SiteDocument';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Only /ar and /en exist; anything else is a 404 (app/not-found.jsx).
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${t('brand.name')} — ${t('brand.tagline')}`,
      template: `%s — ${t('brand.name')}`,
    },
    description: t('hero.sub'),
    applicationName: t('brand.name'),
    openGraph: {
      ...openGraphBase(locale),
      title: `${t('brand.name')} — ${t('brand.tagline')}`,
      description: t('hero.sub'),
      url: `/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('brand.name')} — ${t('brand.tagline')}`,
      description: t('hero.sub'),
      images: [ogImage(locale).url],
    },
    alternates: alternatesFor(locale, ''),
    icons: siteIcons,
  };
}

export const viewport = siteViewport;

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
