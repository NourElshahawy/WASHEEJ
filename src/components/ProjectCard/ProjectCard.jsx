import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import card from '@/styles/card.module.css';
import styles from './ProjectCard.module.css';

/**
 * A project card: cover, number, title and one short category line.
 * The whole card is one link to the project's page.
 * Used in the homepage Work row and in the grid on /work.
 */
export default function ProjectCard({ project, number, headingLevel: Heading = 'h3', sizes }) {
  const t = useTranslations('work');
  const title = t(`items.${project.id}.title`);

  return (
    <Link href={`/work/${project.slug}`} className={`${card.card} ${styles.projectCard}`}>
      <span className={styles.coverFrame}>
        <Image src={project.image} alt={t('coverAlt', { title })} fill sizes={sizes} className={styles.coverImage} />
        {project.demo ? <span className={styles.demoBadge}>{t('demo')}</span> : null}
      </span>

      <span className={styles.cardBody}>
        <span className={`${card.mark} ${styles.cardMark}`} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <Heading className={`${card.title} ${styles.cardTitle}`}>{title}</Heading>
        <span className={styles.cardCategory}>{t(`category.${project.type}`)}</span>
      </span>
    </Link>
  );
}
