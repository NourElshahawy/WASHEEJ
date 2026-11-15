import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { workItems } from '@/data/work';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import WorkRail from '@/components/WorkRail/WorkRail';
import Icon from '@/components/Icon/Icon';
import card from '@/styles/card.module.css';
import styles from './Work.module.css';

const twoDigits = (value) => String(value).padStart(2, '0');

export default async function Work() {
  const t = await getTranslations('work');

  return (
    <section id="work" className={styles.work} aria-labelledby="work-heading" data-thread="work">
      {/* WorkRail picks the layout mode (grid / swipe / rail) and drives the pinned sideways scroll. */}
      <WorkRail className={styles.workPin}>
        <div className={`page-container ${styles.workHead}`}>
          <SectionHeading id="work-heading" label={t('label')} title={t('title')} />
        </div>

        <div className={styles.workViewport} data-work-viewport>
          <div className={styles.workTrack} data-work-track>
            {/* The thread runs along the row behind the cards and moves with it (built by WorkRail). */}
            <svg className={styles.workThread} data-work-thread aria-hidden="true" focusable="false" />
            <ul className={styles.workList}>
            {workItems.map(({ id, image, url, demo }, index) => {
              const title = t(`items.${id}.title`);

              return (
                <li key={id} className={styles.workItem} style={{ '--card-index': index }} data-work-card>
                  <article className={`${card.card} ${styles.workCard}`}>
                    <div className={styles.coverFrame}>
                      <Image
                        src={image}
                        alt={t('coverAlt', { title })}
                        fill
                        sizes="(max-width: 860px) 78vw, (max-width: 1400px) 34vw, 480px"
                        className={styles.coverImage}
                      />
                      {demo ? <span className={styles.demoBadge}>{t('demo')}</span> : null}
                    </div>

                    <div className={styles.cardBody}>
                      <span className={`${card.mark} ${styles.cardMark}`} aria-hidden="true">
                        {twoDigits(index + 1)}
                      </span>
                      <h3 className={card.title}>{title}</h3>
                      <p className={card.text}>{t(`items.${id}.text`)}</p>

                      {url ? (
                        <a href={url} className={styles.visitLink} target="_blank" rel="noopener noreferrer">
                          <span>{t('visit')}</span>
                          <span className="visually-hidden"> — {title}</span>
                          <Icon name="external" size={16} className={styles.visitIcon} />
                        </a>
                      ) : (
                        <span className={styles.comingSoon}>{t('comingSoon')}</span>
                      )}
                    </div>
                  </article>
                </li>
              );
              })}
            </ul>
          </div>
        </div>

        {/* Progress through the row: "03 / 07" and a thin line. */}
        <div className={`page-container ${styles.workFoot}`} aria-hidden="true">
          <p className={styles.workCounter}>
            <span className={styles.workCounterCurrent} data-work-current>
              01
            </span>
            <span> / {twoDigits(workItems.length)}</span>
          </p>
          <span className={styles.workProgress}>
            <span className={styles.workProgressFill} data-work-progress />
          </span>
        </div>
      </WorkRail>
    </section>
  );
}
