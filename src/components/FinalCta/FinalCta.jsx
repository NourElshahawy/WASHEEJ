import { getTranslations } from 'next-intl/server';
import { whatsappUrl } from '@/config/site';
import Button from '@/components/Button/Button';
import CtaKnot from '@/components/CtaKnot/CtaKnot';
import TornEdge from '@/components/TornEdge/TornEdge';
import styles from './FinalCta.module.css';

export default async function FinalCta() {
  const t = await getTranslations('cta');

  return (
    <section id="contact" className={styles.finalCta} aria-labelledby="cta-heading">
      {/* The threads arrive from above and tie into a knot in the empty side of the section. */}
      <CtaKnot />

      <div className={`page-container ${styles.ctaLayout}`}>
        <div className={styles.ctaCopy}>
          <h2 id="cta-heading" className={styles.ctaTitle}>
            {t('title')}
          </h2>
          <div className={styles.ctaActions}>
            <Button href={whatsappUrl} variant="primary" tone="dark" brand="whatsapp" size="large" newTab>
              {t('whatsapp')}
            </Button>
            <Button href="/contact" variant="secondary" tone="dark" size="large">
              {t('request')}
            </Button>
          </div>
        </div>
        {/* Where the knot is tied (CtaKnot measures this box). */}
        <div className={styles.knotStage} aria-hidden="true" data-knot-stage />
      </div>

      {/* The footer's paper is torn across the bottom of the burgundy. */}
      <TornEdge />
    </section>
  );
}
