import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import TestimonialStage from '@/components/TestimonialStage/TestimonialStage';
import { getProject } from '@/lib/projects';
import styles from './Testimonials.module.css';

// A value still in [brackets] is a placeholder waiting to be filled in: not shown.
const filled = (value) => (value && !/^\[.*\]$/.test(value.trim()) ? value.trim() : null);

export default async function Testimonials() {
  const t = await getTranslations('testimonials');
  const ui = await getTranslations('ui');

  return (
    <section className={styles.testimonials} aria-labelledby="testimonials-heading" data-thread="testimonials">
      <div className="page-container">
        <SectionHeading id="testimonials-heading" label={t('label')} title={t('title')} />
        {/* One testimonial at a time, written word by word. Arrows, swipe, or the knots on the thread switch it. */}
        <TestimonialStage
          items={t.raw('items').map((item) => ({
            quote: item.quote,
            role: item.role,
            org: item.org,
            name: filled(item.name),
            business: filled(item.business),
            // Optional link to the project's page; only if that project exists.
            projectHref: item.project && getProject(item.project) ? `/work/${item.project}` : null,
          }))}
          viewProjectLabel={t('viewProject')}
          label={t('label')}
          previousLabel={ui('previousTestimonial')}
          nextLabel={ui('nextTestimonial')}
        />
      </div>
    </section>
  );
}
