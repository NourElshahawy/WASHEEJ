'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import styles from './WorkIndex.module.css';

/**
 * All projects, with filters by service (the 8 categories in projects.json).
 *
 * The chosen filter is kept in the address (?category=…), so a filtered view
 * can be shared and the back button works; the page itself stays static.
 *
 * The grid has a rhythm instead of a wall of equal cards: a wide card with
 * its cover beside the text, then a row of two, then a row of three.
 */
const RHYTHM = ['large', 'half', 'half', 'third', 'third', 'third'];

function readCategory(valid) {
  const value = new URLSearchParams(window.location.search).get('category');
  return value && valid.includes(value) ? value : 'all';
}

export default function WorkIndex({ projects, categories }) {
  const t = useTranslations('portfolio');
  const [category, setCategory] = useState('all');
  const ids = categories.map((c) => c.id);

  // Read the filter from the address after load, and follow back/forward.
  useEffect(() => {
    const sync = () => setCategory(readCategory(ids));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (id) => {
    setCategory(id);
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', id);
    window.history.pushState(null, '', url);
  };

  const visible = projects.filter((project) => category === 'all' || project.categoryId === category);
  // Only categories that have projects get a filter.
  const used = categories.filter((c) => projects.some((p) => p.categoryId === c.id));

  return (
    <section className={styles.workIndex} aria-label={t('all')}>
      <div className="page-container">
        <div className={styles.filterBar}>
          <div className={styles.filters} role="group" aria-label={t('filterLabel')}>
            {[{ id: 'all', name: t('all') }, ...used].map((option) => (
              <button
                key={option.id}
                type="button"
                className={styles.filterChip}
                aria-pressed={category === option.id}
                onClick={() => choose(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
          {/* Announced to screen readers when the filter changes. */}
          <p className={styles.resultCount} aria-live="polite">
            {t('count', { count: visible.length })}
          </p>
        </div>

        <ul className={styles.projectGrid} key={category}>
          {visible.map((project, index) => {
            // With few results the rhythm simply starts with a pair.
            const shape = visible.length < 3 ? 'half' : RHYTHM[index % RHYTHM.length];
            return (
              <li key={project.slug} className={`${styles.projectItem} ${styles[shape]}`} style={{ '--i': index }}>
                <ProjectCard
                  project={project}
                  headingLevel="h2"
                  size={shape === 'large' ? 'large' : 'regular'}
                  priority={index === 0}
                  sizes={
                    shape === 'large'
                      ? '(max-width: 900px) 92vw, 60vw'
                      : shape === 'half'
                        ? '(max-width: 640px) 92vw, 46vw'
                        : '(max-width: 640px) 92vw, (max-width: 1080px) 46vw, 30vw'
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
