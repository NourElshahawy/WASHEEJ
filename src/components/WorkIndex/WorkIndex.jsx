'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { workItems, workTypes } from '@/data/work';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import styles from './WorkIndex.module.css';

/** All projects in a grid, with simple filters by type. */
export default function WorkIndex() {
  const t = useTranslations();
  const [type, setType] = useState('all');
  const visible = workItems.filter((project) => type === 'all' || project.type === type);

  return (
    <section className={styles.workIndex} aria-label={t('pages.work.label')}>
      <div className="page-container">
        <div className={styles.filterBar}>
          <div className={styles.filters} role="group" aria-label={t('pages.work.filter')}>
            {['all', ...workTypes].map((option) => (
              <button
                key={option}
                type="button"
                className={styles.filterChip}
                aria-pressed={type === option}
                onClick={() => setType(option)}
              >
                {t(`work.types.${option}`)}
              </button>
            ))}
          </div>
          {/* Announced to screen readers when the filter changes. */}
          <p className={styles.resultCount} aria-live="polite">
            {t('pages.work.count', { count: visible.length })}
          </p>
        </div>

        <ul className={styles.projectGrid}>
          {visible.map((project) => (
            <li key={project.id} className={styles.projectItem}>
              <ProjectCard
                project={project}
                number={workItems.indexOf(project) + 1}
                headingLevel="h2"
                sizes="(max-width: 640px) 92vw, (max-width: 1080px) 46vw, 30vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
