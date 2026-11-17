import fs from 'node:fs';
import path from 'node:path';
import { STUDIO } from './lib.mjs';

/**
 * How each project's images are made.
 *
 * source:
 *   supplied — approved images provided by the client; only verified
 *   capture  — real screenshots of the live site / redesign (capture-sites.mjs)
 *   concept  — a code-built concept interface (portfolio-studio/concepts/<slug>.html),
 *              rendered in the browser. No image generator is involved.
 *
 * cover / mobile: parameters for portfolio-studio/scenes/scene.html. Each project
 * uses its OWN palette for the backdrop, not Washeej's.
 */

const capture = (note, extra = {}) => ({ source: 'capture', sourceType: 'screenshot', note, ...extra });
const concept = (extra) => ({
  source: 'concept',
  sourceType: 'code-rendered concept',
  note: 'Original concept interface built in HTML/CSS/SVG and rendered in the browser; fictional brand, no live site.',
  ...extra,
});

export const RECIPES = {
  'gd-tableware': {
    source: 'supplied',
    sourceType: 'generated (supplied, approved)',
    note: 'Four approved render references supplied by the client. Generative compositions, not literal screenshots of gd-tableware.com.',
    issues: ['Replace with composites of real captured screenshots when available (see prompt.md brief).'],
  },

  'dudu-kids': capture('Screenshots of https://dudu-kids.vercel.app/ (desktop first view, the week-set scene, phone first view).', {
    cover: { variant: 'browser', desk: '{hero}', mob: '{mob}', bg: 'linear-gradient(160deg,#dfe8fb 0%,#efe2f4 55%,#fbe7d8 100%)', shapeAt: '1300,180,520', shape: 'rgba(255,255,255,.55)', light: '.5' },
    mobile: { bg: 'linear-gradient(170deg,#dfe8fb,#f5e3ef)', shapeAt: '450,520,640', shape: 'rgba(255,255,255,.6)' },
  }),
  lovan: capture('Screenshots of https://lovan.vercel.app/ (desktop first view, the priced shelf, phone first view).', {
    cover: { variant: 'laptop', desk: '{hero}', mob: '{mob}', side: 'start', pw: 210, px: 70, py: 470, size: 1120, dx: 40, top: 140, bg: 'linear-gradient(165deg,#f6ead7 0%,#ead3b5 100%)', shapeAt: '800,1180,1500', shape: 'rgba(110,52,30,.12)', light: '.45' },
    mobile: { bg: 'linear-gradient(170deg,#f6ead7,#e2c49f)', shapeAt: '450,1500,1400', shape: 'rgba(110,52,30,.14)' },
  }),
  'papajohns-redesign': capture('Screenshots of the independent redesign at https://papajohns-rebrand.vercel.app/ (first view, the pizza builder in use, phone first view). Not an official brand commission.', {
    cover: { variant: 'bleed', desk: '{detail}', bg: 'linear-gradient(160deg,#c8102e 0%,#8a0b1e 100%)', light: '.18', size: 1380 },
    mobile: { bg: 'linear-gradient(170deg,#c8102e,#7c0a1b)', light: '.15' },
  }),
  'ahmed-tea-redesign': capture('Screenshots of the independent redesign at https://ahmed-tea.vercel.app/ar (first view, a scroll chapter, phone first view). Not an official brand commission.', {
    cover: { variant: 'browser', dark: '1', desk: '{hero}', mob: '{mob}', side: 'start', bg: 'linear-gradient(160deg,#16452f 0%,#0b2a1c 100%)', light: '.12', shapeAt: '1250,820,900', shape: 'rgba(120,170,90,.18)', 'shape-blur': '30px' },
    mobile: { bg: 'linear-gradient(170deg,#1b5137,#0b2a1c)', light: '.12', shapeAt: '450,400,700', shape: 'rgba(120,170,90,.2)', 'shape-blur': '40px' },
  }),
};

export const conceptRecipe = concept;

// Concepts keep their composition next to their page:
// portfolio-studio/concepts/<slug>.recipe.json → { "cover": {…}, "mobile": {…} }
const conceptDir = path.join(STUDIO, 'concepts');
if (fs.existsSync(conceptDir)) {
  for (const file of fs.readdirSync(conceptDir)) {
    if (!file.endsWith('.recipe.json')) continue;
    const slug = file.replace('.recipe.json', '');
    RECIPES[slug] = concept(JSON.parse(fs.readFileSync(path.join(conceptDir, file), 'utf8')));
  }
}
