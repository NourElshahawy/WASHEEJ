import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import Faq from '@/components/Faq/Faq';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';

/** FAQ page: all the questions, under the same page header as the other inner pages. */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.faq' });
  return pageMetadata({ locale, path: '/faq', title: t('label'), description: t('title') });
}

export default async function FaqPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero label={t('pages.faq.label')} title={t('pages.faq.title')} />
      <Faq standalone />
      <FinalCta />
      <StructuredData
        page={{ type: 'FAQPage', path: '/faq', name: t('pages.faq.label'), description: t('pages.faq.title') }}
        faq={t.raw('faq.items')}
      />
    </>
  );
}
