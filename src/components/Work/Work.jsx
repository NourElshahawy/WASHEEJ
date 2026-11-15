import { getTranslations } from 'next-intl/server';
import { workItems } from '@/data/work';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import WorkRail from '@/components/WorkRail/WorkRail';
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
              {workItems.map((project, index) => (
                // Each card is one link to the project's page (the live-site link lives there).
                <li key={project.id} className={styles.workItem} style={{ '--card-index': index }} data-work-card>
                  <ProjectCard
                    project={project}
                    number={index + 1}
                    sizes="(max-width: 860px) 78vw, (max-width: 1400px) 34vw, 480px"
                  />
                </li>
              ))}
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
