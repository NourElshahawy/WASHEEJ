import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCategories, getPublishedProjects, loc, toCard } from '@/lib/projects';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import WorkIndex from '@/components/WorkIndex/WorkIndex';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.work' });
  return pageMetadata({ locale, path: '/work', title: t('title'), description: t('description') });
}

export default async function WorkPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.work');
  const projects = getPublishedProjects().map((project) => toCard(project, locale));
  const categories = getCategories().map((category) => ({ id: category.id, name: loc(category.name, locale) }));

  return (
    <>
      <PageHero label={t('label')} title={t('title')} />
      <WorkIndex projects={projects} categories={categories} />
      <FinalCta />
      <StructuredData page={{ type: 'CollectionPage', path: '/work', name: t('label'), description: t('title') }} />
    </>
  );
}
