import { getLocale, getTranslations } from 'next-intl/server';
import { getFeaturedProjects, toCard } from '@/lib/projects';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import Button from '@/components/Button/Button';
import WorkRail from '@/components/WorkRail/WorkRail';
import styles from './Work.module.css';

const twoDigits = (value) => String(value).padStart(2, '0');

/** Homepage: about six featured projects from projects.json, one per service where possible. */
export default async function Work() {
  const t = await getTranslations();
  const locale = await getLocale();
  const projects = getFeaturedProjects(6).map((project) => toCard(project, locale));

  return (
    <section id="work" className={styles.work} aria-labelledby="work-heading" data-thread="work">
      {/* WorkRail picks the layout mode (grid / swipe / rail) and drives the pinned sideways scroll. */}
      <WorkRail className={styles.workPin}>
        <div className={`page-container ${styles.workHead}`}>
          <SectionHeading id="work-heading" label={t('work.label')} title={t('work.title')} />
        </div>

        <div className={styles.workViewport} data-work-viewport>
          <div className={styles.workTrack} data-work-track>
            {/* The thread runs along the row behind the cards and moves with it (built by WorkRail). */}
            <svg className={styles.workThread} data-work-thread aria-hidden="true" focusable="false" />
            <ul className={styles.workList}>
              {projects.map((project, index) => (
                // Each card is one link to the project's page.
                <li key={project.slug} className={styles.workItem} style={{ '--card-index': index }} data-work-card>
                  <ProjectCard project={project} sizes="(max-width: 860px) 78vw, (max-width: 1400px) 34vw, 480px" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress through the row: "03 / 06" and a thin line, and the way to all projects. */}
        <div className={`page-container ${styles.workFoot}`}>
          <p className={styles.workCounter} aria-hidden="true">
            <span className={styles.workCounterCurrent} data-work-current>
              01
            </span>
            <span> / {twoDigits(projects.length)}</span>
          </p>
          <span className={styles.workProgress} aria-hidden="true">
            <span className={styles.workProgressFill} data-work-progress />
          </span>
          <Button href="/work" variant="secondary" className={styles.allWork}>
            {t('portfolio.all')}
          </Button>
        </div>
      </WorkRail>
    </section>
  );
}
