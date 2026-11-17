import data from '@/data/projects.json';

/**
 * Read access to the portfolio (src/data/projects.json).
 *
 * Every page and component gets project data through these helpers — no
 * project content is written in JSX. Keeping the access in one place means the
 * JSON can later be swapped for a database or an admin dashboard by changing
 * this file only.
 */

export const projectSettings = data.settings;

/** The localized value of a { ar, en } field (falls back to the default locale). */
export const loc = (field, locale) => (field ? field[locale] ?? field[data.settings.defaultLocale] ?? '' : '');

// ---- Categories ----
export const getCategories = () => data.categories;
export const getCategory = (id) => data.categories.find((category) => category.id === id) ?? null;

// ---- Projects ----
const byOrder = (a, b) => a.order - b.order;

/** All published projects, in their set order. */
export const getPublishedProjects = () => data.projects.filter((project) => project.published).sort(byOrder);

export const getProject = (slug) => getPublishedProjects().find((project) => project.slug === slug) ?? null;

export const getProjectsByCategory = (categoryId) =>
  getPublishedProjects().filter((project) => project.categoryId === categoryId);

/**
 * Featured projects for the homepage. Takes featured projects in order, but
 * picks one per category first so the selection shows range; any remaining
 * slots are filled in order. Projects with images come first.
 */
export function getFeaturedProjects(limit = 6) {
  const featured = getPublishedProjects()
    .filter((project) => project.featured)
    .sort((a, b) => Number(Boolean(b.media.cover)) - Number(Boolean(a.media.cover)) || byOrder(a, b));
  const picked = [];
  const categories = new Set();
  for (const project of featured) {
    if (picked.length === limit) break;
    if (!categories.has(project.categoryId)) {
      picked.push(project);
      categories.add(project.categoryId);
    }
  }
  for (const project of featured) {
    if (picked.length === limit) break;
    if (!picked.includes(project)) picked.push(project);
  }
  return picked.sort(byOrder);
}

/** The projects before and after this one (wrapping around). */
export function getAdjacentProjects(slug) {
  const projects = getPublishedProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}

/** Other projects to look at: the same category first, then neighbours in order. */
export function getRelatedProjects(slug, limit = 3) {
  const project = getProject(slug);
  if (!project) return [];
  const others = getPublishedProjects().filter((other) => other.slug !== slug);
  const sameCategory = others.filter((other) => other.categoryId === project.categoryId);
  const rest = others.filter((other) => other.categoryId !== project.categoryId);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** The project shown as an example of a service (the first in its category, featured first). */
export function getExampleProject(categoryId) {
  const inCategory = getProjectsByCategory(categoryId);
  return inCategory.find((project) => project.featured && project.media.cover) ?? inCategory.find((p) => p.media.cover) ?? inCategory[0] ?? null;
}

// ---- Calls to action ----

/** A wa.me link with the message filled in, or null when no number is configured. */
export function buildWhatsappUrl(message) {
  const number = data.settings.whatsappNumber;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** The message a visitor sends about a project (Arabic template from the JSON; English from the messages file). */
export function projectMessage(project, locale, englishTemplate) {
  const template = locale === 'ar' || !englishTemplate ? data.settings.whatsappMessageAr : englishTemplate;
  return template.replace('{project}', loc(project.brand, locale));
}

/**
 * What the project's main button does:
 *  - external: opens the live site or the redesign demo
 *  - whatsapp: opens WhatsApp with a message about the project
 *  - contact:  WhatsApp is not configured yet → the contact page, prefilled
 */
export function getProjectCta(project, locale, englishTemplate) {
  const label = loc(project.cta.label, locale);
  if (project.cta.type === 'external' && project.externalUrl) {
    return { kind: 'external', href: project.externalUrl, label, newTab: true };
  }
  const whatsapp = buildWhatsappUrl(projectMessage(project, locale, englishTemplate));
  if (whatsapp) return { kind: 'whatsapp', href: whatsapp, label, newTab: true };
  return { kind: 'contact', href: `/contact?project=${encodeURIComponent(project.slug)}`, label, newTab: false };
}

/** Gallery images, without repeating the hero right under it. */
export function getGallery(project) {
  const gallery = project.media.gallery ?? [];
  const withoutHero = gallery.filter((image) => image !== project.media.hero);
  return withoutHero.length >= 2 ? withoutHero : gallery;
}
