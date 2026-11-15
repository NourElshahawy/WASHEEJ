import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import WhyWasheej from '@/components/WhyWasheej/WhyWasheej';
import Process from '@/components/Process/Process';
import Sectors from '@/components/Sectors/Sectors';
import Testimonials from '@/components/Testimonials/Testimonials';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';

/**
 * About page: the About text, then the same Why / Process / Sectors /
 * Testimonials sections as the homepage, ending with the CTA knot.
 */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({ locale, path: '/about', title: t('pages.about.label'), description: t('about.text') });
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero label={t('pages.about.label')} title={t('pages.about.title')}>
        <p>{t('about.text')}</p>
      </PageHero>
      <WhyWasheej />
      <Process />
      <Sectors />
      <Testimonials />
      <FinalCta />
      <StructuredData page={{ type: 'AboutPage', path: '/about', name: t('pages.about.label'), description: t('about.text') }} />
    </>
  );
}
