import { getTranslations, setRequestLocale } from 'next-intl/server';
import { projectForService } from '@/data/work';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import LinePreview from '@/components/LinePreview/LinePreview';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import ToFill from '@/components/ToFill/ToFill';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/**
 * Services page: the eight services as full sections, each with its preview
 * drawing large. "What it is" is the service text from site-content.md;
 * "who it's for" and "what's included" are not written yet → [TO FILL].
 */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.services' });
  return pageMetadata({ locale, path: '/services', title: t('label'), description: t('title') });
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const p = (key) => t(`pages.services.${key}`);
  const services = t.raw('services.items');

  return (
    <>
      <PageHero label={p('label')} title={p('title')} />

      <div className={styles.serviceSections}>
        {services.map((service, index) => {
          const project = projectForService(service.icon);
          const number = String(index + 1).padStart(2, '0');

          return (
            <section
              key={service.icon}
              id={service.icon}
              className={styles.service}
              aria-labelledby={`service-${service.icon}`}
            >
              <div className={`page-container ${styles.serviceLayout}`}>
                {/* The live preview, large. It plays on hover or keyboard focus, so it is focusable and named. */}
                <div className={styles.serviceArt} data-preview-host tabIndex={0} role="img" aria-label={service.title}>
                  <span className={styles.serviceNumber} aria-hidden="true">
                    {number}
                  </span>
                  <LinePreview name={service.icon} />
                </div>

                <div className={styles.serviceCopy}>
                  <h2 id={`service-${service.icon}`} className={styles.serviceTitle}>
                    {service.title}
                  </h2>

                  <dl className={styles.facts}>
                    <div className={styles.fact}>
                      <dt>{p('what')}</dt>
                      <dd>{service.text}</dd>
                    </div>
                    <div className={styles.fact}>
                      <dt>{p('who')}</dt>
                      <dd>
                        <ToFill what={`service ${service.icon}: who it's for`} />
                      </dd>
                    </div>
                    <div className={styles.fact}>
                      <dt>{p('included')}</dt>
                      <dd>
                        <ToFill what={`service ${service.icon}: what's included`} />
                      </dd>
                    </div>
                  </dl>

                  <div className={styles.related}>
                    <h3 className={styles.relatedTitle}>{p('related')}</h3>
                    {project ? (
                      <div className={styles.relatedCard}>
                        <ProjectCard project={project} number={index + 1} headingLevel="h4" sizes="(max-width: 860px) 92vw, 24rem" />
                      </div>
                    ) : (
                      <ToFill what={`service ${service.icon}: related project`} />
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <FinalCta />
      <StructuredData
        page={{ type: 'WebPage', path: '/services', name: p('label'), description: p('title') }}
        services={services.map((service) => ({ name: service.title, description: service.text }))}
      />
    </>
  );
}
