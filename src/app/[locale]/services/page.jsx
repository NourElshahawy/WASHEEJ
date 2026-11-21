import { getTranslations, setRequestLocale } from 'next-intl/server';
import { categoryForService, getExampleProject, toCard } from '@/lib/projects';
import { pageMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { SERVICE_PAGES, SERVICE_PAGE_FOR_KEY } from '@/content/servicePages';
import PageHero from '@/components/PageHero/PageHero';
import LinePreview from '@/components/LinePreview/LinePreview';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/**
 * Services page: the eight services as full sections, each with its preview
 * drawing large, the service text, and an example project from
 * projects.json (the category the service maps to).
 */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.services' });
  return pageMetadata({ locale, path: '/services', title: t('title'), description: t('description') });
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const p = (key) => t(`pages.services.${key}`);
  const services = t.raw('services.items');

  return (
    <>
      <PageHero label={p('label')} title={p('title')}>
        <p>{p('intro')}</p>
      </PageHero>

      <div className={styles.serviceSections}>
        {services.map((service, index) => {
          const example = getExampleProject(categoryForService(service.icon));
          const project = example ? toCard(example, locale) : null;
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
                  </dl>

                  {SERVICE_PAGE_FOR_KEY[service.icon] ? (
                    <p className={styles.more}>
                      <Link href={`/services/${SERVICE_PAGE_FOR_KEY[service.icon]}`}>{t('pages.landing.more')}</Link>
                    </p>
                  ) : null}

                  {project ? (
                  <div className={styles.related}>
                    <h3 className={styles.relatedTitle}>{p('related')}</h3>
                    <div className={styles.relatedCard}>
                      <ProjectCard project={project} headingLevel="h4" sizes="(max-width: 860px) 92vw, 24rem" />
                    </div>
                  </div>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Every service page, including the ones without a section above (bilingual sites, apps, redesign). */}
      <nav className={`page-container ${styles.allPages}`} aria-labelledby="all-service-pages">
        <h2 id="all-service-pages" className={styles.serviceTitle}>
          {t('pages.landing.allServices')}
        </h2>
        <ul className={styles.allPagesList}>
          {SERVICE_PAGES.map((page) => (
            <li key={page.slug}>
              <Link href={`/services/${page.slug}`}>{page[locale].label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <FinalCta />
      <StructuredData
        page={{ type: 'WebPage', path: '/services', name: p('label'), description: p('title') }}
        services={services.map((service) => ({ name: service.title, description: service.text }))}
      />
    </>
  );
}
