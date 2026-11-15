import { getTranslations, setRequestLocale } from 'next-intl/server';
import Faq from '@/components/Faq/Faq';
import FinalCta from '@/components/FinalCta/FinalCta';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return {
    title: t('label'),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { ar: '/ar/faq', en: '/en/faq', 'x-default': '/ar/faq' },
    },
  };
}

export default async function FaqPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Faq headingLevel="h1" standalone />
      <FinalCta />
    </>
  );
}
