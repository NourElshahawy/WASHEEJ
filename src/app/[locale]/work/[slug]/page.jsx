import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import {
  getAdjacentProjects,
  getCategory,
  getGallery,
  getProject,
  getProjectCta,
  getPublishedProjects,
  getRelatedProjects,
  loc,
  toCard,
} from '@/lib/projects';
import { pageMetadata } from '@/lib/seo';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/**
 * Project page — one template, filled from projects.json.
 * Anything the JSON leaves empty (country, languages, technologies, images)
 * is simply left out; nothing is shown as a placeholder.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getPublishedProjects().map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const brand = loc(project.brand, locale);
  const metadata = pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${brand} — ${loc(project.title, locale)}`,
    description: loc(project.summary, locale),
  });
  // The project's own cover is the better preview when it is shared.
  if (project.media.cover) {
    metadata.openGraph.images = [{ url: project.media.cover, width: 1600, height: 1000, alt: loc(project.media.alt, locale) }];
    metadata.twitter.images = [project.media.cover];
  }
  return metadata;
}

/** The image's role, from its file name (hero / detail / mobile). */
const roleOf = (src) => src.split('/').pop().replace(/\.\w+$/, '');

export default async function ProjectPage({ params }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('portfolio');
  const tw = await getTranslations('pages.work');
  const brand = loc(project.brand, locale);
  const title = loc(project.title, locale);
  const summary = loc(project.summary, locale);
  const cta = getProjectCta(project, locale, t('whatsappMessageEn'));
  const { previous, next } = getAdjacentProjects(slug);
  const related = getRelatedProjects(slug, 3).map((other) => toCard(other, locale));
  const gallery = getGallery(project);
  const technologies = project.technologies ?? [];

  const galleryFigure = (src) => {
    const role = roleOf(src);
    const known = ['hero', 'detail', 'mobile'].includes(role);
    return (
      <figure key={src} className={`${styles.galleryItem} ${role === 'mobile' ? styles.galleryPhone : styles.galleryWide}`}>
        <Image
          src={src}
          alt={known ? t(`galleryAlt.${role}`, { brand }) : loc(project.media.alt, locale)}
          fill
          sizes={role === 'mobile' ? '(max-width: 760px) 72vw, 36vw' : '(max-width: 760px) 94vw, 60vw'}
          className={styles.coverImage}
        />
      </figure>
    );
  };

  // Only facts the JSON actually has.
  const facts = [
    { label: t('category'), value: loc(getCategory(project.categoryId)?.name, locale) },
    { label: t('sector'), value: loc(project.sector, locale) },
    { label: t('languages'), value: project.languages.map((code) => t(`languageNames.${code}`)).join(' · ') },
    { label: t('country'), value: project.country ? loc(project.country, locale) : '' },
  ].filter((fact) => fact.value);

  const typeNote = project.type === 'independent_redesign' ? t('redesignNote') : project.type === 'concept' ? t('conceptNote') : null;

  return (
    <>
      <article className={styles.project} data-type={project.type}>
        {/* ---- Hero ---- */}
        <header className={styles.projectHero}>
          <div className="page-container">
            <Link href="/work" className={styles.backLink}>
              <Icon name="arrow" size={18} className={styles.backIcon} />
              {t('back')}
            </Link>

            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <p className={styles.projectKicker}>
                  <span className={styles.projectNumber} aria-hidden="true">
                    {String(project.order).padStart(2, '0')}
                  </span>
                  {project.type !== 'live' ? <span className={styles.typeBadge}>{t(`types.${project.type}`)}</span> : null}
                </p>
                <h1 className={styles.projectTitle}>
                  <span className={styles.projectBrand}>{brand}</span>
                  <span className={styles.projectLine}>{title}</span>
                </h1>
                <p className={styles.projectSummary}>{summary}</p>

                <div className={styles.heroAction}>
                  <Button
                    href={cta.href}
                    variant="primary"
                    size="large"
                    newTab={cta.newTab}
                    {...(cta.kind === 'whatsapp' ? { brand: 'whatsapp' } : {})}
                  >
                    {cta.label}
                  </Button>
                </div>
                {typeNote ? <p className={styles.typeNote}>{typeNote}</p> : null}
              </div>

              <dl className={styles.factList}>
                {facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className={`page-container ${styles.heroMedia}`}>
            <div className={styles.heroCover}>
              {project.media.cover ? (
                <Image
                  src={project.media.cover}
                  alt={loc(project.media.alt, locale)}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(max-width: 1400px) 94vw, 1320px"
                  className={styles.coverImage}
                />
              ) : (
                // Images not produced yet: the brand name on paper, never an empty frame.
                <span className={styles.fallbackCover} aria-hidden="true">
                  <span className={styles.fallbackName}>{brand}</span>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ---- The brief ---- */}
        <div className={`page-container ${styles.projectBody}`}>
          <section className={styles.block} aria-labelledby="project-challenge">
            <h2 id="project-challenge" className={styles.blockTitle}>
              {t('challenge')}
            </h2>
            <p className={styles.blockText}>{loc(project.challenge, locale)}</p>
          </section>

          <section className={styles.block} aria-labelledby="project-solution">
            <h2 id="project-solution" className={styles.blockTitle}>
              {t('solution')}
            </h2>
            <p className={styles.blockText}>{loc(project.solution, locale)}</p>
          </section>

          {project.features.length ? (
            <section className={styles.block} aria-labelledby="project-features">
              <h2 id="project-features" className={styles.blockTitle}>
                {t('features')}
              </h2>
              <ul className={styles.featureList}>
                {project.features.map((feature) => (
                  <li key={feature.en} className={styles.feature}>
                    {loc(feature, locale)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {technologies.length ? (
            <section className={styles.block} aria-labelledby="project-tech">
              <h2 id="project-tech" className={styles.blockTitle}>
                {t('technologies')}
              </h2>
              <ul className={styles.featureList}>
                {technologies.map((tech) => (
                  <li key={typeof tech === 'string' ? tech : tech.en} className={styles.feature} dir="ltr">
                    {typeof tech === 'string' ? tech : loc(tech, locale)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* ---- Gallery: the main screen, a detail, and the phone ---- */}
        {gallery.length ? (
          <section className={`page-container ${styles.gallery}`} aria-labelledby="project-gallery">
            <h2 id="project-gallery" className={styles.blockTitle}>
              {t('gallery')}
            </h2>
            <div className={styles.galleryGrid}>
              {/* Wide screens stacked in one column; the phone stands beside them. */}
              <div className={styles.galleryStack}>{gallery.filter((src) => roleOf(src) !== 'mobile').map(galleryFigure)}</div>
              {gallery.filter((src) => roleOf(src) === 'mobile').map(galleryFigure)}
            </div>
          </section>
        ) : null}

        {/* ---- Related projects ---- */}
        {related.length ? (
          <section className={`page-container ${styles.related}`} aria-labelledby="project-related">
            <h2 id="project-related" className={styles.blockTitle}>
              {t('related')}
            </h2>
            <ul className={styles.relatedList}>
              {related.map((card) => (
                <li key={card.slug} className={styles.relatedItem}>
                  <ProjectCard project={card} sizes="(max-width: 640px) 92vw, (max-width: 1080px) 46vw, 30vw" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- Previous / next: the thread carries you into the next one ---- */}
        <nav className={styles.nextProject} aria-label={t('next')}>
          {next ? (
            <Link href={`/work/${next.slug}`} className={`page-container ${styles.nextLink}`}>
              <span className={styles.nextLabel}>{t('next')}</span>
              <span className={styles.nextTitle}>{loc(next.brand, locale)}</span>
              <span className={styles.nextLine}>{loc(next.title, locale)}</span>
              <svg className={styles.nextThread} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path pathLength="1" d="M0,22 C160,6 320,36 500,20 S840,6 1000,22" />
                <path pathLength="1" d="M0,26 C170,12 330,38 510,24 S850,12 1000,18" />
                <path pathLength="1" d="M0,18 C150,2 310,32 490,16 S830,2 1000,26" />
              </svg>
              <Icon name="arrow" size={28} className={styles.nextArrow} />
            </Link>
          ) : null}
          {previous && previous.slug !== next?.slug ? (
            <div className={`page-container ${styles.previousRow}`}>
              <Link href={`/work/${previous.slug}`} className={styles.previousLink}>
                <Icon name="arrow" size={16} className={styles.backIcon} />
                {t('previous')}: {loc(previous.brand, locale)}
              </Link>
            </div>
          ) : null}
        </nav>
      </article>

      <FinalCta />
      <StructuredData
        page={{
          type: 'WebPage',
          path: `/work/${slug}`,
          name: `${brand} — ${title}`,
          description: summary,
          parent: { path: '/work', name: tw('label') },
        }}
        creativeWork={{
          name: brand,
          description: summary,
          image: project.media.cover,
          url: project.type === 'live' ? project.externalUrl : null,
        }}
      />
    </>
  );
}
