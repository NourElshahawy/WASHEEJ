import styles from './SectionHeading.module.css';

/** Section header: a small pill label with the section headline underneath. */
export default function SectionHeading({ as: Tag = 'h2', id, label, title }) {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.sectionPill}>{label}</p>
      <Tag id={id} className={styles.sectionTitle}>
        {title}
      </Tag>
    </header>
  );
}
