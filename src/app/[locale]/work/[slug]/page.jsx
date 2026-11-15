import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { findProject, workItems } from '@/data/work';
import { pageMetadata } from '@/lib/seo';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import ToFill from '@/components/ToFill/ToFill';
import FinalCta from '@/components/FinalCta/FinalCta';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/**
 * Project page — one template for all projects.
 * Copy comes only from site-content.md (the Work card text). Anything that is
 * not there yet is shown as a visible [TO FILL] placeholder.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => workItems.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: 'work' });
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: t(`items.${project.id}.title`),
    description: t(`items.${project.id}.text`),
  });
}

export default async function ProjectPage({ params }) {
  const { locale, slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const p = (key) => t(`pages.project.${key}`);
  const title = t(`work.items.${project.id}.title`);
  const text = t(`work.items.${project.id}.text`);
  const features = t.has(`work.features.${project.id}`) ? t.raw(`work.features.${project.id}`) : null;
  const serviceTitle = t.raw('services.items').find((service) => service.icon === project.service)?.title;
  const index = workItems.indexOf(project);
  const next = workItems[(index + 1) % workItems.length];
  const nextTitle = t(`work.items.${next.id}.title`);

  const tags = [
    { label: p('tags.service'), value: serviceTitle },
    { label: p('tags.sector'), value: null, what: `${slug}: sector` },
    { label: p('tags.country'), value: null, what: `${slug}: country` },
    {
      label: p('tags.languages'),
      value: project.languages?.map((code) => p(`languageNames.${code}`)).join(' · ') ?? null,
      what: `${slug}: languages`,
    },
  ];

  return (
    <>
      <article className={styles.project}>
        {/* ---- Hero ---- */}
        <header className={styles.projectHero}>
          <div className={`page-container ${styles.heroLayout}`}>
            <div className={styles.heroCopy}>
              <Link href="/work" className={styles.backLink}>
                <Icon name="arrow" size={18} className={styles.backIcon} />
                {p('back')}
              </Link>
              <p className={styles.projectNumber} aria-hidden="true">
                ({String(index + 1).padStart(2, '0')})
              </p>
              <h1 className={styles.projectTitle}>{title}</h1>

              <dl className={styles.tagList}>
                {tags.map((tag) => (
                  <div key={tag.label} className={styles.tag}>
                    <dt>{tag.label}</dt>
                    <dd>{tag.value ?? <ToFill what={tag.what} />}</dd>
                  </div>
                ))}
              </dl>

              <div className={styles.heroAction}>
                {project.url ? (
                  <Button href={project.url} variant="primary" size="large" newTab>
                    {t('work.visit')}
                  </Button>
                ) : (
                  <span className={styles.comingSoon}>
                    {t('work.demo')} — {t('work.comingSoon')}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.heroCover}>
              <Image
                src={project.image}
                alt={t('work.coverAlt', { title })}
                fill
                preload
                fetchPriority="high"
                sizes="(max-width: 860px) 92vw, 48vw"
                className={styles.coverImage}
              />
            </div>
          </div>
        </header>

        <div className={`page-container ${styles.projectBody}`}>
          {/* ---- The idea / the challenge ---- */}
          <section className={styles.block} aria-labelledby="project-idea">
            <h2 id="project-idea" className={styles.blockTitle}>
              {p('idea')}
            </h2>
            <p className={styles.blockText}>
              <ToFill what={`${slug}: the idea and the challenge`} />
            </p>
          </section>

          {/* ---- What we built ---- */}
          <section className={styles.block} aria-labelledby="project-built">
            <h2 id="project-built" className={styles.blockTitle}>
              {p('built')}
            </h2>
            {features ? (
              <ul className={styles.featureList}>
                {features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.blockText}>
                <ToFill what={`${slug}: list of features`} />
              </p>
            )}
          </section>

          {/* ---- Highlights: the card text is all we have so far ---- */}
          <section className={styles.block} aria-labelledby="project-highlights">
            <h2 id="project-highlights" className={styles.blockTitle}>
              {p('highlights')}
            </h2>
            <p className={`${styles.blockText} ${styles.highlight}`}>{text}</p>
          </section>

          {/* ---- Tech ---- */}
          <section className={styles.block} aria-labelledby="project-tech">
            <h2 id="project-tech" className={styles.blockTitle}>
              {p('tech')}
            </h2>
            <p className={styles.blockText}>
              <ToFill what={`${slug}: tech used`} />
            </p>
          </section>
        </div>

        {/* ---- Gallery: the cover for now, with room for screenshots ---- */}
        <section className={`page-container ${styles.gallery}`} aria-labelledby="project-gallery">
          <h2 id="project-gallery" className={styles.blockTitle}>
            {p('gallery')}
          </h2>
          <ul className={styles.galleryGrid}>
            <li className={`${styles.galleryItem} ${styles.galleryMain}`}>
              <Image src={project.image} alt="" fill sizes="(max-width: 860px) 92vw, 60vw" className={styles.coverImage} />
            </li>
            {[1, 2].map((slot) => (
              <li key={slot} className={`${styles.galleryItem} ${styles.gallerySlot}`}>
                <ToFill what={`${slug}: screenshot ${slot}`} />
                <span>{p('gallerySlot')}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Next project: the thread carries you into it ---- */}
        <nav className={styles.nextProject} aria-label={p('next')}>
          <Link href={`/work/${next.slug}`} className={`page-container ${styles.nextLink}`}>
            <span className={styles.nextLabel}>{p('next')}</span>
            <span className={styles.nextTitle}>{nextTitle}</span>
            <svg className={styles.nextThread} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M0,22 C160,6 320,36 500,20 S840,6 1000,22" />
              <path pathLength="1" d="M0,26 C170,12 330,38 510,24 S850,12 1000,18" />
              <path pathLength="1" d="M0,18 C150,2 310,32 490,16 S830,2 1000,26" />
            </svg>
            <Icon name="arrow" size={28} className={styles.nextArrow} />
          </Link>
        </nav>
      </article>

      <FinalCta />
      <StructuredData
        page={{ type: 'WebPage', path: `/work/${slug}`, name: title, description: text, parent: { path: '/work', name: t('pages.work.label') } }}
        creativeWork={{ name: title, description: text, image: project.image, url: project.url }}
      />
    </>
  );
}
