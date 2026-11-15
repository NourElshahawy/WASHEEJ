import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import WorkIndex from '@/components/WorkIndex/WorkIndex';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.work' });
  return pageMetadata({ locale, path: '/work', title: t('label'), description: t('title') });
}

export default async function WorkPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.work');

  return (
    <>
      <PageHero label={t('label')} title={t('title')} />
      <WorkIndex />
      <FinalCta />
      <StructuredData page={{ type: 'CollectionPage', path: '/work', name: t('label'), description: t('title') }} />
    </>
  );
}
