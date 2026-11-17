// usage: node frames.mjs <url> <outPrefix> <count> — desktop frames down the page, evenly spaced, plus a contact sheet
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
const [url, out, count] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
await sleep(4000);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
const n = +count;
const tiles = [];
for (let i = 1; i <= n; i += 1) {
  const y = Math.round(((height - 900) * i) / (n + 1));
  // scroll gradually so scroll-driven scenes play
  const from = await page.evaluate(() => window.scrollY);
  for (let k = 1; k <= 10; k += 1) { await page.evaluate((v) => window.scrollTo(0, v), from + ((y - from) * k) / 10); await sleep(90); }
  await sleep(1600);
  const file = `${out}-y${y}.png`;
  await page.screenshot({ path: file });
  tiles.push({ file, y });
}
await browser.close();
const cols = 4, w = 400, h = 225;
const comp = await Promise.all(tiles.map(async (t, i) => ({ input: await sharp(t.file).resize(w, h).toBuffer(), left: (i % cols) * (w + 6), top: Math.floor(i / cols) * (h + 6) })));
await sharp({ create: { width: cols * (w + 6), height: Math.ceil(tiles.length / cols) * (h + 6), channels: 3, background: '#222' } }).composite(comp).png().toFile(`${out}-sheet.png`);
console.log(tiles.map((t, i) => `${i}:${t.y}`).join(' '));
