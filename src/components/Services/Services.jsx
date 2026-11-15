import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import LinePreview from '@/components/LinePreview/LinePreview';
import ServicesMotion from '@/components/ServicesMotion/ServicesMotion';
import card from '@/styles/card.module.css';
import styles from './Services.module.css';

export default async function Services() {
  const t = await getTranslations('services');
  const services = t.raw('items');

  return (
    <section id="services" className={styles.services} aria-labelledby="services-heading" data-thread="services">
      {/* This wrapper is what pins while the cards are dealt; it also holds the section's own thread. */}
      <div className={styles.servicesPin}>
        <ServicesMotion />
        <div className="page-container">
          <SectionHeading id="services-heading" label={t('label')} title={t('title')} />
          <ul className={styles.serviceGrid} data-service-grid>
            {services.map((service, index) => (
              // The <li> is what the "dealt cards" motion moves; the card inside it lifts on hover.
              <li key={service.icon} className={styles.serviceItem} style={{ '--card-index': index }} data-service-card>
                {/* Threads that wrap around the card on hover. */}
                <svg className={styles.wrapThread} aria-hidden="true" focusable="false">
                  <rect pathLength="1" />
                  <rect pathLength="1" />
                  <rect pathLength="1" />
                </svg>

                {/* Focusable so the preview also plays for keyboard users. */}
                <div className={`${card.card} ${styles.serviceCard}`} data-preview-host tabIndex={0}>
                  <span className={styles.cursorGlow} data-cursor-glow aria-hidden="true" />
                  <span className={card.mark} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={card.title}>{service.title}</h3>
                  <p className={card.text}>{service.text}</p>
                  <div className={card.art}>
                    <LinePreview name={service.icon} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
