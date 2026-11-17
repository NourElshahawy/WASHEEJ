/**
 * Builds the four portfolio images for each project and registers them.
 *
 *   node scripts/portfolio/produce.mjs <slug ...>   (or --all)
 *
 * For each project (see recipes.mjs):
 *   1. sources — real captures (capture-sites.mjs), a rendered concept page
 *      (portfolio-studio/concepts/<slug>.html), or supplied approved images;
 *   2. compose — cover and mobile are composed with portfolio-studio/scenes/scene.html;
 *      hero and detail are the screens themselves;
 *   3. convert — WebP at the exact sizes, then re-read to verify format and size;
 *   4. register — only after all four files pass, their paths are written to
 *      src/data/projects.json and the progress manifest is updated.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  CAPTURES, DATA_FILE, PUBLIC_PROJECTS, SIZES, STATUS_FILE, STUDIO,
  fileUrl, fromScenes, launch, readJson, renderScene, settle, toWebp, writeJson,
} from './lib.mjs';
import { RECIPES } from './recipes.mjs';

const today = new Date().toISOString().slice(0, 10);

/** Renders a code-built concept page into its three screens. */
async function renderConcept(browser, slug) {
  const source = path.join(STUDIO, 'concepts', `${slug}.html`);
  if (!fs.existsSync(source)) throw new Error(`missing concept page ${source}`);
  const dir = path.join(CAPTURES, slug);
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
  await page.goto(fileUrl(source), { waitUntil: 'load' });
  await settle(page, 900);
  const shoot = async (selector, file) => {
    const box = await page.$eval(selector, (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
    });
    await page.screenshot({ path: path.join(dir, file), clip: box, captureBeyondViewport: true });
  };
  await shoot('#hero', 'desk-hero.png');
  await shoot('#detail', 'desk-detail.png');
  await shoot('#mobile', 'mob-hero.png');
  // Optional second phone screen, for covers that show two phones.
  if (await page.$('#mobile2')) await shoot('#mobile2', 'mob-2.png');
  await page.close();
}

async function produce(browser, slug) {
  const recipe = RECIPES[slug];
  if (!recipe) throw new Error(`no recipe for ${slug}`);
  const dir = path.join(CAPTURES, slug);
  const out = path.join(PUBLIC_PROJECTS, slug);

  if (recipe.source === 'supplied') {
    // Approved images already in place: only verify them.
    for (const [role, size] of Object.entries(SIZES)) await toWebpCheck(path.join(out, `${role}.webp`), size);
  } else {
    if (recipe.source === 'concept') await renderConcept(browser, slug);
    const src = (name) => path.join(dir, name);
    for (const name of ['desk-hero.png', 'desk-detail.png', 'mob-hero.png']) {
      if (!fs.existsSync(src(name))) throw new Error(`missing source ${src(name)} — run capture-sites.mjs first`);
    }
    const images = {
      hero: fromScenes(src('desk-hero.png')),
      detail: fromScenes(src('desk-detail.png')),
      mob: fromScenes(src('mob-hero.png')),
      mob2: fromScenes(src(fs.existsSync(src('mob-2.png')) ? 'mob-2.png' : 'mob-hero.png')),
    };
    // Scene params may refer to {hero} {detail} {mob}.
    const fill = (params) =>
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\{(hero|detail|mob2|mob)\}/g, (_, key) => images[key]) : v]));

    await renderScene(browser, fill({ w: 1600, h: 1000, ...recipe.cover }), src('cover.png'));
    await renderScene(browser, fill({ w: 900, h: 1600, variant: 'phone', mob: '{mob}', ...recipe.mobile }), src('mobile.png'));

    if (DRY) {
      await contactSheet(dir);
      console.log(`◻ ${slug}: preview at ${path.join(dir, 'sheet.png')} (not registered)`);
      return;
    }
    await toWebp(src('cover.png'), path.join(out, 'cover.webp'), SIZES.cover);
    await toWebp(src(recipe.heroFrom ?? 'desk-hero.png'), path.join(out, 'hero.webp'), SIZES.hero);
    await toWebp(src(recipe.detailFrom ?? 'desk-detail.png'), path.join(out, 'detail.webp'), SIZES.detail);
    await toWebp(src('mobile.png'), path.join(out, 'mobile.webp'), SIZES.mobile);
  }

  // Register: paths go into the JSON only now that all four files exist and passed.
  const data = readJson(DATA_FILE);
  const project = data.projects.find((p) => p.slug === slug);
  const base = `${data.settings.assetsBasePath}/${slug}`;
  project.media.cover = `${base}/cover.webp`;
  project.media.hero = `${base}/hero.webp`;
  project.media.gallery = [`${base}/hero.webp`, `${base}/detail.webp`, `${base}/mobile.webp`];
  writeJson(DATA_FILE, data);

  const status = readJson(STATUS_FILE, { updated: today, projects: {} });
  status.updated = today;
  status.projects[slug] = {
    ...(status.projects[slug] ?? {}),
    images: Object.fromEntries(Object.keys(SIZES).map((role) => [role, 'done'])),
    validation: 'passed',
    sourceType: recipe.sourceType,
    sourceNote: recipe.note,
    lastStep: 'registered in projects.json',
    issues: recipe.issues ?? [],
    updated: today,
  };
  writeJson(STATUS_FILE, status);
  console.log(`✓ ${slug} (${recipe.sourceType})`);
}

/** One image with the cover, mobile, hero and detail side by side, for review. */
async function contactSheet(dir) {
  const sharp = (await import('sharp')).default;
  const part = (name, width, height) => sharp(path.join(dir, name)).resize(width, height, { fit: 'fill' }).png().toBuffer();
  const [cover, hero, detail, mobile] = await Promise.all([
    part('cover.png', 1120, 700),
    part('desk-hero.png', 1120, 630),
    part('desk-detail.png', 1120, 630),
    part('mobile.png', 554, 985),
  ]);
  await sharp({ create: { width: 2304, height: 2040, channels: 3, background: '#888888' } })
    .composite([
      { input: cover, left: 20, top: 20 },
      { input: mobile, left: 1160, top: 20 },
      { input: hero, left: 20, top: 740 },
      { input: detail, left: 20, top: 1390 },
    ])
    .png()
    .toFile(path.join(dir, 'sheet.png'));
}

async function toWebpCheck(file, [width, height]) {
  const sharp = (await import('sharp')).default;
  const meta = await sharp(file).metadata();
  if (meta.format !== 'webp' || meta.width !== width || meta.height !== height) {
    throw new Error(`${file}: ${meta.format} ${meta.width}x${meta.height}, expected webp ${width}x${height}`);
  }
}

const DRY = process.argv.includes('--dry');
const args = process.argv.slice(2).filter((arg) => arg !== '--dry');
const slugs = args.includes('--all') ? Object.keys(RECIPES) : args;
if (!slugs.length) {
  console.log('usage: node scripts/portfolio/produce.mjs <slug ...> | --all');
  process.exit(1);
}
const browser = await launch();
let failed = 0;
for (const slug of slugs) {
  try {
    await produce(browser, slug);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${slug}: ${error.message}`);
    const status = readJson(STATUS_FILE, { updated: today, projects: {} });
    status.projects[slug] = { ...(status.projects[slug] ?? {}), validation: 'failed', lastStep: 'produce failed', issues: [error.message], updated: today };
    writeJson(STATUS_FILE, status);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
