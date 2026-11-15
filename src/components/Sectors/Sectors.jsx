import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import SectorsMarquee from '@/components/SectorsMarquee/SectorsMarquee';
import styles from './Sectors.module.css';

export default async function Sectors() {
  const t = await getTranslations('sectors');
  const sectors = t.raw('items');
  // Two rows that drift in opposite directions.
  const half = Math.ceil(sectors.length / 2);
  const rows = [sectors.slice(0, half), sectors.slice(half)];

  return (
    <section className={styles.sectors} aria-labelledby="sectors-heading" data-thread="sectors">
      <div className="page-container">
        <SectionHeading id="sectors-heading" label={t('label')} title={t('title')} />
      </div>

      {/* Full-width rows: the chips hang from a thread and drift slowly (SectorsMarquee drives them). */}
      <SectorsMarquee className={styles.sectorRows}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.sectorRow} data-sector-row>
            <ul className={styles.sectorTrack} data-sector-track>
              {row.map((sector) => (
                <li key={sector} className={styles.sectorHanger} data-sector-chip>
                  <span className={styles.sectorChip}>{sector}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SectorsMarquee>
    </section>
  );
}
