/**
 * Real screenshots of the published sites and the independent redesigns.
 *
 *   node scripts/portfolio/capture-sites.mjs [slug ...]
 *
 * For each site it saves, in portfolio-studio/captures/<slug>/:
 *   desk-hero.png   1600×900 first view (desktop)
 *   desk-detail.png 1600×900 a meaningful feature (scrolled to, or opened)
 *   mob-hero.png    390×844 @2x first view on a phone
 * These are the untouched sources; produce.mjs builds the portfolio images from them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CAPTURES, launch, sleep } from './lib.mjs';

/** Scrolls gradually (so scroll-driven scenes play) to a fraction of the page or a pixel offset. */
async function scrollTo(page, target) {
  const y = await page.evaluate((t) => (t <= 1 ? Math.round((document.documentElement.scrollHeight - innerHeight) * t) : t), target);
  const from = await page.evaluate(() => window.scrollY);
  for (let step = 1; step <= 14; step += 1) {
    await page.evaluate((v) => window.scrollTo(0, v), from + ((y - from) * step) / 14);
    await sleep(110);
  }
  await sleep(1800);
}

const clickText = (page, pattern) =>
  page.evaluate((source) => {
    const re = new RegExp(source);
    const element = [...document.querySelectorAll('a,button,[role=button],[role=tab]')].find((el) => el.offsetParent && re.test(el.textContent.trim()));
    if (element) element.click();
    return Boolean(element);
  }, pattern);

export const SITES = {
  'dudu-kids': {
    url: 'https://dudu-kids.vercel.app/',
    detail: async (page) => scrollTo(page, 16122), // the "week set" scene: products with prices and add-to-cart
  },
  lovan: {
    url: 'https://lovan.vercel.app/',
    detail: async (page) => scrollTo(page, 5990), // priced shelf with "add to bag"
  },
  'papajohns-redesign': {
    url: 'https://papajohns-rebrand.vercel.app/',
    detail: async (page) => {
      // Open the pizza builder and build a pizza, so the receipt fills in.
      await clickText(page, '^ابدأ طلبك$');
      await sleep(2200);
      await clickText(page, '^بيتزا صوص$');
      await sleep(900);
      for (const [tab, item] of [['^الجبنة$', null], ['^اللحوم$', null], ['^الخضار$', null]]) {
        await clickText(page, tab);
        await sleep(700);
        // the first two choices in the open tab
        await page.evaluate(() => {
          const panel = [...document.querySelectorAll('button')].filter((b) => b.offsetParent && b.querySelector('img'));
          panel.slice(0, 2).forEach((b) => b.click());
        });
        await sleep(800);
        void item;
      }
      await sleep(1500);
    },
  },
  'ahmed-tea-redesign': {
    url: 'https://ahmed-tea.vercel.app/ar',
    detail: async (page) => scrollTo(page, 4650), // a scroll-driven chapter of the tea's journey
  },
};

async function capture(browser, slug) {
  const site = SITES[slug];
  const dir = path.join(CAPTURES, slug);
  fs.mkdirSync(dir, { recursive: true });

  const desk = await browser.newPage();
  await desk.setViewport({ width: 1600, height: 900 });
  await desk.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
  await sleep(4500);
  await desk.screenshot({ path: path.join(dir, 'desk-hero.png') });
  await site.detail(desk);
  await desk.screenshot({ path: path.join(dir, 'desk-detail.png') });
  await desk.close();

  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mob.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
  await sleep(4500);
  await mob.screenshot({ path: path.join(dir, 'mob-hero.png') });
  await mob.close();

  console.log(`captured ${slug} from ${site.url}`);
}

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES);
const browser = await launch();
for (const slug of wanted) {
  try {
    await capture(browser, slug);
  } catch (error) {
    console.error(`FAILED ${slug}: ${error.message}`);
  }
}
await browser.close();
