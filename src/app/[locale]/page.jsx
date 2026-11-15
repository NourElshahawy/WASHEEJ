import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero/Hero';
import QuickNumbers from '@/components/QuickNumbers/QuickNumbers';
import About from '@/components/About/About';
import Services from '@/components/Services/Services';
import Work from '@/components/Work/Work';
import WhyWasheej from '@/components/WhyWasheej/WhyWasheej';
import Process from '@/components/Process/Process';
import Sectors from '@/components/Sectors/Sectors';
import Testimonials from '@/components/Testimonials/Testimonials';
import Faq from '@/components/Faq/Faq';
import FinalCta from '@/components/FinalCta/FinalCta';
import ThreadLayer from '@/components/ThreadLayer/ThreadLayer';
import StructuredData from '@/components/StructuredData/StructuredData';

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <QuickNumbers />
      <About />
      <Services />
      <Work />
      <WhyWasheej />
      <Process />
      <Sectors />
      <Testimonials />
      <Faq limit={6} showAllLink />
      <FinalCta />
      {/* The traveling thread: measured from the sections above, drawn behind them. */}
      <ThreadLayer />
      <StructuredData />
    </>
  );
}
