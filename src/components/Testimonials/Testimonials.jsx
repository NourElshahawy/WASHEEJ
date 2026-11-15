import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import TestimonialStage from '@/components/TestimonialStage/TestimonialStage';
import styles from './Testimonials.module.css';

export default async function Testimonials() {
  const t = await getTranslations('testimonials');
  const ui = await getTranslations('ui');

  return (
    <section className={styles.testimonials} aria-labelledby="testimonials-heading" data-thread="testimonials">
      <div className="page-container">
        <SectionHeading id="testimonials-heading" label={t('label')} title={t('title')} />
        {/* One testimonial at a time, written word by word. Arrows, swipe, or the knots on the thread switch it. */}
        <TestimonialStage
          items={t.raw('items')}
          label={t('label')}
          previousLabel={ui('previousTestimonial')}
          nextLabel={ui('nextTestimonial')}
        />
      </div>
    </section>
  );
}
