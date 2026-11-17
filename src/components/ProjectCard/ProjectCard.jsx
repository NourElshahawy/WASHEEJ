import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import card from '@/styles/card.module.css';
import styles from './ProjectCard.module.css';

/**
 * A project card. The whole card is one link to the project's page.
 * `project` is a card view-model from toCard() in lib/projects.js.
 *
 * If a project's images are not ready yet, a branded cover (its name on
 * paper, with fine roots) stands in — never an empty frame.
 */
export default function ProjectCard({ project, headingLevel: Heading = 'h3', sizes, size = 'regular', priority = false }) {
  const t = useTranslations('portfolio');

  return (
    <Link href={`/work/${project.slug}`} className={`${card.card} ${styles.projectCard} ${styles[size] ?? ''}`}>
      <span className={styles.coverFrame}>
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.alt}
            fill
            sizes={sizes}
            className={styles.coverImage}
            {...(priority ? { preload: true } : {})}
          />
        ) : (
          <span className={styles.fallbackCover} aria-hidden="true">
            <svg className={styles.fallbackRoots} viewBox="0 0 400 250" preserveAspectRatio="none" focusable="false">
              <path d="M-10,190 C80,170 120,210 200,180 S330,140 410,160" />
              <path d="M200,180 C190,210 170,232 150,262" />
              <path d="M260,165 C280,200 300,220 330,262" />
              <path d="M110,186 C100,150 80,120 60,95" />
            </svg>
            <span className={styles.fallbackName}>{project.brand}</span>
          </span>
        )}
        {project.type !== 'live' ? <span className={styles.typeBadge}>{t(`types.${project.type}`)}</span> : null}
      </span>

      <span className={styles.cardBody}>
        <span className={`${card.mark} ${styles.cardMark}`} aria-hidden="true">
          {String(project.number).padStart(2, '0')}
        </span>
        <Heading className={`${card.title} ${styles.cardTitle}`}>{project.brand}</Heading>
        <span className={styles.cardLine}>{project.title}</span>
        <span className={styles.cardCategory}>{project.category}</span>
      </span>
    </Link>
  );
}
