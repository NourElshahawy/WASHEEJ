/**
 * Renders the Open Graph images to public/og/og-ar.jpg and public/og/og-en.jpg.
 *
 *   node scripts/og/render-og.mjs
 *
 * They are rendered in a real browser (not next/og) because Arabic needs
 * proper text shaping. Re-run after changing og.html, the background or the
 * tagline. Needs network access for the Google Fonts.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { launch, settle } from '../portfolio/lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const page = `file:///${path.join(here, 'og.html').replace(/\\/g, '/')}`;

const browser = await launch();
try {
  for (const lang of ['ar', 'en']) {
    const tab = await browser.newPage();
    await tab.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await tab.goto(`${page}?lang=${lang}`, { waitUntil: 'load' });
    await settle(tab, 300);
    const out = path.join(root, 'public', 'og', `og-${lang}.jpg`);
    const shot = await tab.screenshot({ type: 'png' });
    await sharp(shot).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
    const meta = await sharp(out).metadata();
    if (meta.width !== 1200 || meta.height !== 630) throw new Error(`${out}: ${meta.width}x${meta.height}`);
    console.log(`✓ ${path.relative(root, out)} 1200×630`);
    await tab.close();
  }
} finally {
  await browser.close();
}
