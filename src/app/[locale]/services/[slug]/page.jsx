import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { categoryForService, getExampleProject, getPublishedProjects } from '@/lib/projects';
import { SERVICE_PAGES, getServicePage } from '@/content/servicePages';
import LandingContent from '@/components/LandingContent/LandingContent';

/** One page per service (copy in content/servicePages.js), each aimed at one search phrase. */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => SERVICE_PAGES.map(({ slug }) => ({ locale, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  const copy = page[locale];
  return pageMetadata({ locale, path: `/services/${slug}`, title: { absolute: copy.title }, description: copy.description });
}

/** Real example projects for a page: its service's example, or the independent redesigns. */
function examplesFor(page) {
  if (page.slug === 'redesign') return getPublishedProjects().filter((project) => project.type === 'independent_redesign');
  if (!page.serviceKey) return [];
  const example = getExampleProject(categoryForService(page.serviceKey));
  return example ? [example] : [];
}

export default async function ServicePage({ params }) {
  const { locale, slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <LandingContent
      locale={locale}
      path={`/services/${slug}`}
      copy={page[locale]}
      projects={examplesFor(page)}
      currentSlug={slug}
      parent={{ name: t('pages.services.label'), path: '/services' }}
    />
  );
}
