/**
 * Validates src/data/projects.json before every build (npm "prebuild").
 *
 *   node scripts/validate-projects.mjs          schema + files exist
 *   node scripts/validate-projects.mjs --images also checks each image's real
 *                                               format and pixel size
 *
 * Exits with code 1 on any error, so a broken catalogue never ships.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProjectsData, IMAGE_SPECS } from '../src/lib/projectSchema.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/projects.json'), 'utf8'));
const publicFile = (publicPath) => path.join(root, 'public', publicPath);

const errors = validateProjectsData(data, { fileExists: (p) => fs.existsSync(publicFile(p)) });

if (process.argv.includes('--images')) {
  const sharp = (await import('sharp')).default;
  for (const project of data.projects) {
    const media = project.media;
    const named = [
      ['cover', media.cover],
      ['hero', media.hero],
      ...media.gallery.map((p) => [path.basename(p, '.webp'), p]),
    ].filter(([, p]) => p && fs.existsSync(publicFile(p)));
    for (const [role, p] of named) {
      const meta = await sharp(publicFile(p)).metadata();
      const spec = IMAGE_SPECS[role];
      if (meta.format !== 'webp') errors.push(`${project.slug}: ${p} is ${meta.format}, not webp`);
      if (spec && (meta.width !== spec.width || meta.height !== spec.height)) {
        errors.push(`${project.slug}: ${p} is ${meta.width}x${meta.height}, expected ${spec.width}x${spec.height}`);
      }
    }
  }
}

const published = data.projects.filter((p) => p.published);
const withCovers = data.projects.filter((p) => p.media.cover);
console.log(
  `projects.json: ${data.projects.length} projects (${published.length} published), ${data.categories.length} categories, ` +
    `${withCovers.length} with images.`,
);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('OK');
