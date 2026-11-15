import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { navLinks, siteConfig, whatsappUrl, emailUrl } from '@/config/site';
import FooterBackdrop from '@/components/FooterBackdrop/FooterBackdrop';
import FooterMark from '@/components/FooterMark/FooterMark';
import Icon from '@/components/Icon/Icon';
import LocaleSwitch from '@/components/LocaleSwitch/LocaleSwitch';
import styles from './Footer.module.css';

export default async function Footer() {
  const t = await getTranslations();
  const tags = t.raw('footer.tags');

  return (
    <footer className={styles.siteFooter}>
      {/* Faint large roots behind the content (the paper grain is CSS). */}
      <FooterBackdrop />
      <div className={`page-container ${styles.footerMain}`}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.footerLogoLink} aria-label={t('ui.homeLink')}>
            {/* The end of the thread: the large وشيج, with roots growing beneath it. */}
            <FooterMark />
          </Link>
          <p className={styles.footerStudio}>{t('footer.studio')}</p>
        </div>

        <nav className={styles.footerNav} aria-label={t('ui.mainNav')}>
          <ul className={styles.footerNavList}>
            {navLinks.map(({ key, hash }) => (
              <li key={key}>
                <Link href={hash === 'top' ? '/' : `/#${hash}`} className={styles.footerLink}>
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.footerContact}>
          <li>
            <a
              href={whatsappUrl}
              className={styles.footerContactLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('ui.whatsapp')}: ${siteConfig.contact.whatsappDisplay}`}
            >
              <Icon name="whatsapp" size={20} />
              <span dir="ltr">{siteConfig.contact.whatsappDisplay}</span>
            </a>
          </li>
          <li>
            <a
              href={emailUrl}
              className={styles.footerContactLink}
              aria-label={`${t('ui.email')}: ${siteConfig.contact.email}`}
            >
              <Icon name="mail" size={20} />
              <span dir="ltr">{siteConfig.contact.email}</span>
            </a>
          </li>
        </ul>
      </div>

      <div className={`page-container ${styles.footerStrip}`}>
        <ul className={styles.footerTags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.footerTag}>
              {tag}
            </li>
          ))}
        </ul>
        <span className={styles.footerRule} aria-hidden="true" />
        <LocaleSwitch />
      </div>
    </footer>
  );
}
