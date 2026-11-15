import { useLocale } from 'next-intl';
import Logo from '@/components/Logo/Logo';
import styles from './Brand.module.css';

/**
 * The brand lock-up.
 *  - Arabic: the calligraphic وشيج mark, with a small WASHEEJ under it.
 *  - English: the Latin wordmark WASHEEJ as the main logo, with the small
 *    Arabic mark beside it.
 * size: "regular" (top bar) | "small" (floating nav).
 */
export default function Brand({ size = 'regular' }) {
  const isEnglish = useLocale() === 'en';
  const sizeClass = size === 'small' ? styles.small : '';

  if (isEnglish) {
    return (
      <span className={`${styles.brand} ${styles.latinFirst} ${sizeClass}`}>
        <span className={styles.wordmark}>WASHEEJ</span>
        <Logo className={styles.sideMark} />
      </span>
    );
  }

  return (
    <span className={`${styles.brand} ${styles.arabicFirst} ${sizeClass}`}>
      <Logo className={styles.mark} />
      <span className={styles.caption} aria-hidden="true">
        WASHEEJ
      </span>
    </span>
  );
}
