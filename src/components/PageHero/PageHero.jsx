import styles from './PageHero.module.css';

/**
 * The top of an inner page: a pill label, the page title (h1), an optional
 * intro line, and a few strands of thread that draw in under the title —
 * the same thread as the homepage, at rest.
 */
export default function PageHero({ label, title, children }) {
  return (
    <header className={styles.pageHero}>
      <div className="page-container">
        <p className={styles.pagePill}>{label}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {children ? <div className={styles.pageIntro}>{children}</div> : null}
      </div>

      <svg className={styles.pageThread} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path pathLength="1" d="M-20,30 C200,8 380,52 620,30 S1040,8 1460,34" />
        <path pathLength="1" d="M-20,36 C220,16 400,56 640,34 S1060,14 1460,28" />
        <path pathLength="1" d="M-20,24 C180,4 360,46 600,26 S1020,2 1460,38" />
        <path pathLength="1" d="M-20,33 C210,12 390,50 630,32 S1050,10 1460,31" />
      </svg>
    </header>
  );
}
