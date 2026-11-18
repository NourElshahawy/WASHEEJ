import { headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteIcons, siteViewport } from '@/lib/seo';
import SiteDocument from '@/components/SiteDocument/SiteDocument';
import NotFound from '@/components/NotFound/NotFound';

/**
 * The 404 page for every unknown URL (unknown paths, unknown projects).
 *
 * It is the full localized document, rendered on the server with the right
 * lang/dir: the language comes from the header the next-intl middleware puts
 * on every request (/en/… → English, everything else → Arabic).
 * Next.js adds <meta name="robots" content="noindex"> and the 404 status.
 */

async function requestLocale() {
  const locale = (await headers()).get('x-next-intl-locale');
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export async function generateMetadata() {
  const locale = await requestLocale();
  const t = await getTranslations({ locale });
  return {
    title: { absolute: `${t('notFound.title')} — ${t('brand.name')}` },
    icons: siteIcons,
  };
}

export const viewport = siteViewport;

export default async function RootNotFound() {
  const locale = await requestLocale();
  setRequestLocale(locale);

  return (
    <SiteDocument locale={locale}>
      <NotFound />
    </SiteDocument>
  );
}
