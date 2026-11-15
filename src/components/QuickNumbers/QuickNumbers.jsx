import { getTranslations } from 'next-intl/server';
import card from '@/styles/card.module.css';
import styles from './QuickNumbers.module.css';

const FACT_KEYS = ['experience', 'clients', 'team'];

export default async function QuickNumbers() {
  const t = await getTranslations('numbers');

  return (
    <section className={styles.quickNumbers} data-thread="numbers">
      <div className="page-container">
        <ul className={styles.factList}>
          {FACT_KEYS.map((key) => (
            <li key={key} className={`${card.card} ${styles.fact}`}>
              <p className={`${card.title} ${styles.factText}`}>
                {t.rich(key, {
                  num: (chunks) => <strong className={styles.factFigure}>{chunks}</strong>,
                })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
