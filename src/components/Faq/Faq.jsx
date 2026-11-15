import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import Button from '@/components/Button/Button';
import styles from './Faq.module.css';

/**
 * FAQ accordion built on native <details> (one open at a time via the shared `name`).
 * limit: show only the first N questions · showAllLink: add the «كل الأسئلة» link.
 */
export default async function Faq({ limit, showAllLink = false, headingLevel = 'h2', standalone = false }) {
  const t = await getTranslations('faq');
  const allQuestions = t.raw('items');
  const questions = limit ? allQuestions.slice(0, limit) : allQuestions;

  // Two balanced columns on desktop, numbered in reading order down each column.
  const half = Math.ceil(questions.length / 2);
  const columns = [questions.slice(0, half), questions.slice(half)];

  return (
    <section
      className={`${styles.faq} ${standalone ? styles.faqStandalone : ''}`}
      aria-labelledby={standalone ? undefined : 'faq-heading'}
      aria-label={standalone ? t('label') : undefined}
      data-thread="faq"
    >
      <div className="page-container">
        {/* On its own page the page header carries the title. */}
        {standalone ? null : <SectionHeading as={headingLevel} id="faq-heading" label={t('label')} title={t('title')} />}

        <div className={styles.faqColumns}>
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={styles.faqColumn} data-faq-column>
              {column.map((item, rowIndex) => {
                const number = columnIndex * half + rowIndex + 1;
                return (
                  <details key={item.q} name="faq" className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      <span className={styles.faqNumber} aria-hidden="true">
                        {String(number).padStart(2, '0')}
                      </span>
                      <span className={styles.faqQuestionText}>{item.q}</span>
                      {/* A small knot: tied while closed, it comes undone when the question opens. */}
                      <svg className={styles.faqKnot} viewBox="0 0 30 30" aria-hidden="true" focusable="false">
                        <path
                          className={styles.knotTied}
                          pathLength="1"
                          d="M3,15 C8,15 11,9 16,9 C21.5,9 22.5,16.5 17,18 C11.5,19.5 10,11.5 15.5,10.5 C20,9.7 23,15 27,15"
                        />
                        <path className={styles.knotLoose} pathLength="1" d="M3,15 C8,15 10,13 13,15 S17,22 20,22 S24,18 27,21" />
                      </svg>
                    </summary>
                    {/* A thread draws down beside the answer as it opens. */}
                    <div className={styles.faqAnswerWrap}>
                      <p className={styles.faqAnswer}>{item.a}</p>
                    </div>
                  </details>
                );
              })}
            </div>
          ))}
        </div>

        {showAllLink ? (
          <div className={styles.faqFooter}>
            <Button href="/faq" variant="secondary">
              {t('all')}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
