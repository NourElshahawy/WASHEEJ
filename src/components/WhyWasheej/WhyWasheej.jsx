import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import LinePreview from '@/components/LinePreview/LinePreview';
import WhyBloom from '@/components/WhyBloom/WhyBloom';
import card from '@/styles/card.module.css';
import styles from './WhyWasheej.module.css';

export default async function WhyWasheej() {
  const t = await getTranslations('why');
  const reasons = t.raw('items');

  return (
    <section className={styles.why} aria-labelledby="why-heading" data-thread="why">
      <div className="page-container">
        <SectionHeading id="why-heading" label={t('label')} title={t('title')} />
        <ul className={styles.reasonGrid} data-why-grid>
          {reasons.map((reason, index) => (
            // The <li> is what blooms out of its knot on the thread; the card inside lifts on hover.
            <li key={reason.icon} className={styles.reasonItem} data-why-card>
              <div className={`${card.card} ${styles.reasonCard}`} data-preview-host tabIndex={0}>
                <span className={card.mark} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={card.title}>{reason.title}</h3>
                <p className={`${card.text} ${styles.reasonText}`}>{reason.text}</p>
                <div className={`${card.art} ${styles.reasonArt}`}>
                  <LinePreview name={reason.icon} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <WhyBloom />
    </section>
  );
}
