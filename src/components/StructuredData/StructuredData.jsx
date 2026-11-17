import { getLocale, getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';

/**
 * Structured data (JSON-LD) for search engines, in the language of the page:
 * the Organization and the WebSite on every page, plus — for inner pages —
 * the page itself with its breadcrumb, and what the page is about
 * (a project, the list of services, or the FAQ).
 *
 * It is written as an HTML string on a hidden wrapper, so React never has to
 * create a <script> element on the client.
 */
export default async function StructuredData({ page, creativeWork, services, faq }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const home = `${siteConfig.url}/${locale}`;
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${home}#website`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: t('brand.name'),
      alternateName: locale === 'ar' ? 'Washeej' : 'وشيج',
      url: home,
      logo: `${siteConfig.url}/favicon/icon-512.png`,
      description: t('hero.sub'),
      slogan: t('brand.tagline'),
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: home,
      name: t('brand.name'),
      description: t('brand.tagline'),
      inLanguage: locale,
      publisher: { '@id': organizationId },
    },
  ];

  if (page) {
    const url = `${home}${page.path}`;
    const crumbs = [{ name: t('nav.home'), url: home }];
    if (page.parent) crumbs.push({ name: page.parent.name, url: `${home}${page.parent.path}` });
    crumbs.push({ name: page.name, url });

    const pageNode = {
      '@type': page.type,
      '@id': `${url}#page`,
      url,
      name: page.name,
      description: page.description,
      inLanguage: locale,
      isPartOf: { '@id': websiteId },
      breadcrumb: { '@id': `${url}#breadcrumb` },
    };
    if (faq) {
      pageNode.mainEntity = faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }));
    }
    if (creativeWork) {
      pageNode.mainEntity = {
        '@type': 'CreativeWork',
        name: creativeWork.name,
        description: creativeWork.description,
        ...(creativeWork.image ? { image: `${siteConfig.url}${creativeWork.image}` } : {}),
        ...(creativeWork.url ? { url: creativeWork.url } : {}),
        creator: { '@id': organizationId },
      };
    }
    graph.push(pageNode, {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url })),
    });
    if (services) {
      services.forEach((service) =>
        graph.push({ '@type': 'Service', name: service.name, description: service.description, provider: { '@id': organizationId } }),
      );
    }
  }

  // "<" is escaped so the JSON can never close the script element.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return <div hidden dangerouslySetInnerHTML={{ __html: `<script type="application/ld+json">${json}</script>` }} />;
}
