import { Readex_Pro, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { localeDirection } from '@/i18n/routing';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import InkFilter from '@/components/InkFilter/InkFilter';
import PageTransition from '@/components/PageTransition/PageTransition';
import Loader from '@/components/Loader/Loader';
import { LOADER_SCRIPT_HTML } from '@/components/Loader/loaderScript';
import '@/app/globals.css';

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

/**
 * The whole HTML document in one language: <html lang dir>, fonts, the
 * loader, header, main and footer. Used by [locale]/layout.jsx for every page
 * and by app/not-found.jsx, so a 404 is the same localized document,
 * rendered on the server.
 */
export default async function SiteDocument({ locale, children }) {
  const t = await getTranslations({ locale, namespace: 'ui' });

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
        <NextIntlClientProvider locale={locale}>
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
