import { getLocale, getTranslations } from 'next-intl/server';
import HeroArt from '@/components/HeroArt/HeroArt';
import Button from '@/components/Button/Button';
import styles from './Hero.module.css';

export default async function Hero() {
  const t = await getTranslations();
  const locale = await getLocale();
  const tags = t.raw('footer.tags');

  return (
    <section id="top" className={styles.hero} data-thread="hero">
      <div className={styles.heroStage}>
        {/* Calligraphic وشيج on the torn paper: written on load, then roots grow from it. */}
        <HeroArt />
        {/* English only: what the Arabic word means. */}
        {locale === 'en' ? <p className={styles.heroCaption}>{t('hero.caption')}</p> : null}

        <div className={`page-container ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              {t.rich('hero.title', {
                br: () => <br />,
                accent: (chunks) => <span className={styles.gradientWord}>{chunks}</span>,
              })}
            </h1>
            <p className={styles.heroLead}>{t('hero.sub')}</p>
            <div className={styles.heroActions}>
              <Button href="#contact" variant="primary" size="large">{t('hero.primary')}</Button>
              <Button href="#services" variant="secondary" size="large">
                {t('hero.secondary')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`page-container ${styles.heroStrip}`}>
        <ul className={styles.stripTags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.stripTag}>
              {tag}
            </li>
          ))}
        </ul>
        <span className={styles.stripRule} aria-hidden="true" />
        <span className={styles.stripWordmark} aria-hidden="true">
          WASHEEJ — WEB STUDIO
        </span>
      </div>
    </section>
  );
}
