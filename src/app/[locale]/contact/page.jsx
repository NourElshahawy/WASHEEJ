import { getTranslations, setRequestLocale } from 'next-intl/server';
import { siteConfig, whatsappUrl, whatsappDisplay, emailUrl } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { getContactPrefills } from '@/lib/projects';
import PageHero from '@/components/PageHero/PageHero';
import ContactForm from '@/components/ContactForm/ContactForm';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/** Contact page: the project request form, plus WhatsApp and email. */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });
  return pageMetadata({ locale, path: '/contact', title: t('label'), description: t('title') });
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefills = getContactPrefills(locale, t('portfolio.whatsappMessageEn'));
  const services = t.raw('services.items').map((service) => ({ key: service.icon, title: service.title }));

  return (
    <>
      <PageHero label={t('pages.contact.label')} title={t('pages.contact.title')} />

      <section className={styles.contact}>
        <div className={`page-container ${styles.contactLayout}`}>
          <div className={styles.formColumn}>
            <ContactForm services={services} prefills={prefills} />
          </div>

          <aside className={styles.direct} aria-labelledby="contact-direct">
            <h2 id="contact-direct" className={styles.directTitle}>
              {t('pages.contact.or')}
            </h2>
            {whatsappUrl ? (
              <Button href={whatsappUrl} variant="primary" brand="whatsapp" newTab>
                {t('cta.whatsapp')}
              </Button>
            ) : null}
            <ul className={styles.directList}>
              {whatsappUrl ? (
                <li>
                  <a href={whatsappUrl} className={styles.directLink} target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" size={20} />
                    <span dir="ltr">{whatsappDisplay}</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a href={emailUrl} className={styles.directLink}>
                  <Icon name="mail" size={20} />
                  <span dir="ltr">{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <StructuredData page={{ type: 'ContactPage', path: '/contact', name: t('pages.contact.label'), description: t('pages.contact.title') }} />
    </>
  );
}
