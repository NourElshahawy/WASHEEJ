import { notFound } from 'next/navigation';
import { Readex_Pro, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, localeDirection } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import InkFilter from '@/components/InkFilter/InkFilter';
import PageTransition from '@/components/PageTransition/PageTransition';
import Loader from '@/components/Loader/Loader';
import { LOADER_SCRIPT_HTML } from '@/components/Loader/loaderScript';
import '../globals.css';

// UI + body: one family that covers Arabic and Latin with matching proportions.
const fontSans = Readex_Pro({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Latin accent face for the wordmark and the (01)–(04) index numerals.
const fontSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  // An accent face (numerals, wordmark): not worth competing with the hero image for early bytes.
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
      type: 'website',
      siteName: t('brand.name'),
      title: `${t('brand.name')} — ${t('brand.tagline')}`,
      description: t('hero.sub'),
      url: `/${locale}`,
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_AR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('brand.name')} — ${t('brand.tagline')}`,
      description: t('hero.sub'),
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: '/ar', en: '/en', 'x-default': '/ar' },
    },
    icons: {
      icon: [
        { url: '/favicon/icon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/favicon/icon-192.png',
    },
  };
}

export const viewport = {
  themeColor: '#faf6f2',
  colorScheme: 'light',
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('ui');

  return (
    // suppressHydrationWarning: the loader script sets data-loader on <html> before React starts.
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${fontSans.variable} ${fontSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Decides, before the first paint, whether to show the loading screen (first visit of the session). */}
        <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT_HTML }} />
        <NextIntlClientProvider>
          <Loader />
          <a className="skip-link" href="#main">
            {t('skipToContent')}
          </a>
          <InkFilter />
          <SmoothScroll />
          <PageTransition />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
