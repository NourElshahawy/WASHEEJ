/**
 * Shared helpers for the portfolio image pipeline.
 * Uses the Microsoft Edge (or Chrome) already installed on the machine through
 * puppeteer-core — no browser is downloaded.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const STUDIO = path.join(ROOT, 'portfolio-studio');
export const CAPTURES = path.join(STUDIO, 'captures'); // raw PNG sources (not committed)
export const PUBLIC_PROJECTS = path.join(ROOT, 'public/images/projects');
export const DATA_FILE = path.join(ROOT, 'src/data/projects.json');
export const STATUS_FILE = path.join(ROOT, 'portfolio-production-status.json');

export const SIZES = {
  cover: [1600, 1000],
  hero: [1600, 900],
  detail: [1600, 900],
  mobile: [900, 1600],
};

const BROWSERS = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const fileUrl = (file) => pathToFileURL(file).href;

export async function launch() {
  const executablePath = BROWSERS.find((candidate) => fs.existsSync(candidate));
  if (!executablePath) throw new Error('No Edge/Chrome found. Set BROWSER_PATH.');
  return puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--hide-scrollbars', '--allow-file-access-from-files', '--font-render-hinting=none'],
  });
}

/** Waits until web fonts are loaded and the page signals it is ready (data-ready on <body>, if it uses it). */
export async function settle(page, extra = 600) {
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page
    .waitForFunction(() => !document.body.hasAttribute('data-wait') || document.body.dataset.ready === '1', { timeout: 20000 })
    .catch(() => {});
  await page
    .waitForFunction(() => [...document.images].every((image) => image.complete), { timeout: 20000 })
    .catch(() => {});
  await sleep(extra);
}

/** Converts a PNG to WebP at an exact size, then checks the result really is that. */
export async function toWebp(input, output, [width, height], quality = 84) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(input).resize(width, height, { fit: 'cover', position: 'top' }).webp({ quality, effort: 5 }).toFile(output);
  const meta = await sharp(output).metadata();
  if (meta.format !== 'webp' || meta.width !== width || meta.height !== height) {
    throw new Error(`${output}: got ${meta.format} ${meta.width}x${meta.height}, expected webp ${width}x${height}`);
  }
  return meta;
}

/** Renders the composition page (portfolio-studio/scenes/scene.html) to a PNG. */
export async function renderScene(browser, params, output) {
  const [width, height] = [Number(params.w), Number(params.h)];
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  await page.goto(`${fileUrl(path.join(STUDIO, 'scenes/scene.html'))}?${query}`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 30000 });
  await sleep(300);
  await page.screenshot({ path: output });
  await page.close();
}

/** A path inside portfolio-studio, relative to the scenes folder (what scene.html expects in its query). */
export const fromScenes = (file) => path.relative(path.join(STUDIO, 'scenes'), file).split(path.sep).join('/');

export const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback);
export const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
