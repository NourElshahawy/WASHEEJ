import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { toCard } from '@/lib/projects';
import { SERVICE_PAGES } from '@/content/servicePages';
import PageHero from '@/components/PageHero/PageHero';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import Faq from '@/components/Faq/Faq';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './LandingContent.module.css';

/**
 * The body of a service page or a city page: the page header, the copy
 * sections, example projects, the page's own questions, links to the other
 * services, and the CTA. `copy` is one locale's block from content/servicePages.js.
 */
export default async function LandingContent({ locale, path, copy, projects = [], currentSlug, parent }) {
  const t = await getTranslations();
  const ui = (key) => t(`pages.landing.${key}`);
  const others = SERVICE_PAGES.filter((page) => page.slug !== currentSlug);

  return (
    <>
      <PageHero label={copy.label} title={copy.h1}>
        <p>{copy.intro}</p>
      </PageHero>

      <div className={`page-container ${styles.body}`}>
        {copy.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.heading}>{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className={styles.list}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {projects.length ? (
          <section className={styles.section}>
            <h2 className={styles.heading}>{ui('examples')}</h2>
            <div className={styles.cards}>
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={toCard(project, locale)} headingLevel="h3" sizes="(max-width: 860px) 92vw, 24rem" />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {copy.faq?.length ? <Faq items={copy.faq} title={ui('faqTitle')} /> : null}

      <nav className={`page-container ${styles.others}`} aria-labelledby="other-services">
        <h2 id="other-services" className={styles.heading}>
          {ui('otherServices')}
        </h2>
        <ul className={styles.otherList}>
          {others.map((page) => (
            <li key={page.slug}>
              <Link href={`/services/${page.slug}`} className={styles.otherLink}>
                {page[locale].label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/services" className={styles.otherLink}>
              {ui('allServices')}
            </Link>
          </li>
        </ul>
      </nav>

      <FinalCta />
      <StructuredData
        page={{ type: 'WebPage', path, name: copy.h1, description: copy.description, parent }}
        services={[{ name: copy.label, description: copy.description }]}
        faq={copy.faq}
      />
    </>
  );
}
