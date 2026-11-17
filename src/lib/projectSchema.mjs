/**
 * Schema check for src/data/projects.json — the single source of truth for
 * the portfolio. Pure JavaScript (no Next.js), so the same rules run in the
 * build guard (scripts/validate-projects.mjs) and anywhere else.
 *
 * `fileExists(publicPath)` is optional; when given, every media path must
 * point at a real file (a path is only added once its image exists).
 */

export const PROJECT_TYPES = ['live', 'independent_redesign', 'concept'];
export const CTA_TYPES = ['external', 'whatsapp'];
export const IMAGE_SPECS = {
  cover: { width: 1600, height: 1000 },
  hero: { width: 1600, height: 900 },
  detail: { width: 1600, height: 900 },
  mobile: { width: 900, height: 1600 },
};

const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isLocalized = (value, locales) => value && typeof value === 'object' && locales.every((locale) => isText(value[locale]));

export function validateProjectsData(data, { fileExists } = {}) {
  const errors = [];
  const fail = (where, message) => errors.push(`${where}: ${message}`);

  if (!data || typeof data !== 'object') return ['root: not an object'];
  if (data.schemaVersion !== 1) fail('root', 'schemaVersion must be 1');

  const settings = data.settings ?? {};
  const locales = settings.supportedLocales;
  if (!Array.isArray(locales) || !locales.length) fail('settings', 'supportedLocales is required');
  const langs = Array.isArray(locales) ? locales : ['ar', 'en'];
  if (!langs.includes(settings.defaultLocale)) fail('settings', 'defaultLocale must be one of supportedLocales');
  if (settings.whatsappNumber !== null && !/^\d{8,15}$/.test(String(settings.whatsappNumber))) {
    fail('settings', 'whatsappNumber must be null or international digits only (no +, spaces or dashes)');
  }
  if (!isText(settings.whatsappMessageAr) || !settings.whatsappMessageAr.includes('{project}')) {
    fail('settings', 'whatsappMessageAr must contain {project}');
  }

  // Categories
  const categoryIds = new Set();
  (data.categories ?? []).forEach((category, index) => {
    const where = `categories[${index}]`;
    if (!isText(category.id)) fail(where, 'id is required');
    if (categoryIds.has(category.id)) fail(where, `duplicate id "${category.id}"`);
    categoryIds.add(category.id);
    if (!isLocalized(category.name, langs)) fail(where, 'name must be localized');
    if (!isLocalized(category.description, langs)) fail(where, 'description must be localized');
  });
  if (categoryIds.size !== 8) fail('categories', `expected 8 categories, found ${categoryIds.size}`);

  // Projects
  const projects = data.projects ?? [];
  const ids = new Set();
  const slugs = new Set();
  const orders = new Set();
  projects.forEach((project, index) => {
    const where = `projects[${index}] (${project.slug ?? '?'})`;
    if (!isText(project.id)) fail(where, 'id is required');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(project.slug ?? '')) fail(where, 'slug must be kebab-case');
    if (ids.has(project.id)) fail(where, 'duplicate id');
    if (slugs.has(project.slug)) fail(where, 'duplicate slug');
    ids.add(project.id);
    slugs.add(project.slug);
    if (!categoryIds.has(project.categoryId)) fail(where, `unknown categoryId "${project.categoryId}"`);
    if (!PROJECT_TYPES.includes(project.type)) fail(where, `type must be one of ${PROJECT_TYPES.join(', ')}`);
    if (typeof project.featured !== 'boolean') fail(where, 'featured must be boolean');
    if (typeof project.published !== 'boolean') fail(where, 'published must be boolean');
    if (!Number.isInteger(project.order)) fail(where, 'order must be an integer');
    if (orders.has(project.order)) fail(where, `duplicate order ${project.order}`);
    orders.add(project.order);

    for (const field of ['brand', 'title', 'sector', 'summary', 'challenge', 'solution']) {
      if (!isLocalized(project[field], langs)) fail(where, `${field} must be localized`);
    }
    if (!Array.isArray(project.features)) fail(where, 'features must be an array');
    else project.features.forEach((feature, i) => isLocalized(feature, langs) || fail(where, `features[${i}] must be localized`));
    if (!Array.isArray(project.languages) || project.languages.some((code) => !langs.includes(code))) {
      fail(where, 'languages must list supported locales');
    }
    if (!Array.isArray(project.technologies)) fail(where, 'technologies must be an array');

    // Call to action: a real link for live sites and redesigns, WhatsApp for concepts.
    const cta = project.cta ?? {};
    if (!CTA_TYPES.includes(cta.type)) fail(where, `cta.type must be one of ${CTA_TYPES.join(', ')}`);
    if (!isLocalized(cta.label, langs)) fail(where, 'cta.label must be localized');
    if (cta.type === 'external' && !/^https:\/\//.test(project.externalUrl ?? '')) fail(where, 'external CTA needs an https externalUrl');
    if (project.type === 'concept' && project.externalUrl) fail(where, 'concepts must not link to an external site');

    // Media: every path must sit in the project's own folder and exist.
    const media = project.media ?? {};
    if (!isLocalized(media.alt, langs)) fail(where, 'media.alt must be localized');
    const base = `${settings.assetsBasePath}/${project.slug}/`;
    const paths = [media.cover, media.hero, ...(media.gallery ?? [])].filter((path) => path !== null && path !== undefined);
    if (!Array.isArray(media.gallery)) fail(where, 'media.gallery must be an array');
    paths.forEach((path) => {
      if (!isText(path) || !path.startsWith(base)) fail(where, `media path "${path}" must start with ${base}`);
      else if (!/\.webp$/.test(path)) fail(where, `media path "${path}" must be .webp`);
      else if (fileExists && !fileExists(path)) fail(where, `media file missing: ${path}`);
    });
  });

  return errors;
}
