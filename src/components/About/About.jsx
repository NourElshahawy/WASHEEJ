import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './About.module.css';

export default async function About() {
  const t = await getTranslations('about');

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading" data-thread="about">
      <div className={`page-container ${styles.aboutLayout}`}>
        <div className={styles.aboutCopy}>
          <SectionHeading id="about-heading" label={t('label')} title={t('title')} />
          <p className={styles.aboutStatement}>{t('text')}</p>
        </div>
        {/* Open half: the thread loops into a soft open knot here (drawn by ThreadLayer). */}
        <div className={styles.threadSpace} data-thread-space aria-hidden="true" />
      </div>
    </section>
  );
}
