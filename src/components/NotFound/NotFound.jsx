import { useTranslations } from 'next-intl';
import BrokenThread from '@/components/BrokenThread/BrokenThread';
import Button from '@/components/Button/Button';
import styles from './NotFound.module.css';

/** The 404 page: "the thread broke". */
export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className={styles.notFound} aria-labelledby="not-found-title">
      <div className={`page-container ${styles.notFoundInner}`}>
        <p className={styles.notFoundCode} aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title" className={styles.notFoundTitle}>
          {t('title')}
        </h1>
        <p className={styles.notFoundText}>{t('text')}</p>

        {/* The broken thread; hovering the button ties its two ends into a knot. */}
        <BrokenThread>
          <Button href="/" variant="primary" size="large">
            {t('button')}
          </Button>
        </BrokenThread>
      </div>
    </section>
  );
}
