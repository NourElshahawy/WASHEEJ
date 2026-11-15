import { getLocale, getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';

/**
 * Structured data (JSON-LD) for search engines: the Organization and the
 * WebSite, in the language of the current page.
 *
 * It is written as an HTML string on a hidden wrapper, so React never has to
 * create a <script> element on the client.
 */
export default async function StructuredData() {
  const locale = await getLocale();
  const t = await getTranslations();
  const pageUrl = `${siteConfig.url}/${locale}`;
  const organizationId = `${siteConfig.url}/#organization`;

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: t('brand.name'),
        alternateName: locale === 'ar' ? 'Washeej' : 'وشيج',
        url: pageUrl,
        logo: `${siteConfig.url}/favicon/icon-512.png`,
        description: t('hero.sub'),
        slogan: t('brand.tagline'),
      },
      {
        '@type': 'WebSite',
        '@id': `${pageUrl}#website`,
        url: pageUrl,
        name: t('brand.name'),
        description: t('brand.tagline'),
        inLanguage: locale,
        publisher: { '@id': organizationId },
      },
    ],
  };

  // "<" is escaped so the JSON can never close the script element.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <div hidden dangerouslySetInnerHTML={{ __html: `<script type="application/ld+json">${json}</script>` }} />;
}
