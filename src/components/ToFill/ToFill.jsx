import styles from './ToFill.module.css';

/**
 * A visible placeholder for content that is not in site-content.md yet.
 * Search the code for "<ToFill" to find every one of them.
 */
export default function ToFill({ what }) {
  return (
    <span className={styles.toFill} data-to-fill={what}>
      [TO FILL]
    </span>
  );
}
