// Generates the site's icon and share image from the business name and the
// design tokens, for clients who have no logo artwork. No AI model involved.
//
//   npm run icons            create whatever is missing (or still the template default)
//   npm run icons -- --force  regenerate all of them
//
// Writes into public/:
//   favicon.svg, favicon.ico     browser tab icon (initials on the brand color)
//   apple-touch-icon.png         180x180 home-screen icon
//   og-image.jpg                 1200x630 image shown when the site is shared
//
// These are plain typographic marks, not a logo. When the client supplies real
// artwork, replace the files and this script will leave them alone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const force = process.argv.includes('--force');

const site = fs.readFileSync(path.join(root, 'src', 'site.ts'), 'utf8');
const field = (name) => site.match(new RegExp(`${name}:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`))?.[2]?.replace(/\\(.)/g, '$1') ?? '';
const businessName = field('businessName');
const city = field('city');
const region = field('region');
if (!businessName || businessName === 'Client Business Name') {
  console.error('Set businessName in src/site.ts before generating icons.');
  process.exit(1);
}

const css = fs.readFileSync(path.join(root, 'src', 'design', 'tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const token = (name, fallback) => {
  const value = css.match(new RegExp(`${name}\\s*:\\s*([^;]+);`))?.[1]?.trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value ?? '') ? value : fallback;
};
const deep = token('--deep', '#1a1a1a');
const onDeep = token('--on-deep', '#ffffff');
const accent = token('--accent', onDeep);

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const words = businessName.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
const initials = (words.length > 1 ? words[0][0] + words[1][0] : businessName.slice(0, 1)).toUpperCase();
const FONT = "Helvetica, Arial, 'Liberation Sans', 'DejaVu Sans', sans-serif";

const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${deep}"/>
  <text x="50" y="50" dy="0.35em" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${initials.length > 1 ? 44 : 60}" fill="${onDeep}">${xml(initials)}</text>
</svg>
`;

// Wrap the name onto at most three lines so long names still fit.
function wrap(text, maxChars) {
  const lines = [''];
  for (const word of text.split(/\s+/)) {
    const current = lines[lines.length - 1];
    if (current && (current + ' ' + word).length > maxChars) lines.push(word);
    else lines[lines.length - 1] = current ? current + ' ' + word : word;
  }
  return lines.slice(0, 3);
}
const nameLines = wrap(businessName, 18);
const nameSize = nameLines.length === 1 ? 104 : nameLines.length === 2 ? 92 : 76;
const blockHeight = nameLines.length * nameSize * 1.1;
const firstBaseline = 315 - blockHeight / 2 + nameSize * 0.8;
const place = [city, region].filter(Boolean).join(', ');
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${deep}"/>
  <rect x="0" y="606" width="1200" height="24" fill="${accent}"/>
  ${nameLines.map((line, i) => `<text x="90" y="${Math.round(firstBaseline + i * nameSize * 1.1)}" font-family="${FONT}" font-weight="700" font-size="${nameSize}" fill="${onDeep}">${xml(line)}</text>`).join('\n  ')}
  ${place ? `<text x="92" y="${Math.round(firstBaseline + (nameLines.length - 1) * nameSize * 1.1 + 70)}" font-family="${FONT}" font-weight="400" font-size="38" fill="${onDeep}" fill-opacity="0.8">${xml(place)}</text>` : ''}
</svg>
`;

// A .ico file is a small header followed by a PNG.
function icoFromPng(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // offset of the PNG data
  return Buffer.concat([header, png]);
}

const ASTRO_DEFAULT = 'M50.4 78.5a75.1'; // the favicon that ships with a new Astro project
const faviconPath = path.join(pub, 'favicon.svg');
const faviconIsDefault = !fs.existsSync(faviconPath) || fs.readFileSync(faviconPath, 'utf8').includes(ASTRO_DEFAULT);

const jobs = [
  {
    file: 'favicon.svg',
    needed: force || faviconIsDefault,
    make: async (out) => fs.writeFileSync(out, iconSvg(100)),
  },
  {
    file: 'favicon.ico',
    needed: force || faviconIsDefault || !fs.existsSync(path.join(pub, 'favicon.ico')),
    make: async (out) => fs.writeFileSync(out, icoFromPng(await sharp(Buffer.from(iconSvg(48))).png().toBuffer(), 48)),
  },
  {
    file: 'apple-touch-icon.png',
    needed: force || !fs.existsSync(path.join(pub, 'apple-touch-icon.png')),
    make: async (out) => sharp(Buffer.from(iconSvg(180))).png().toFile(out),
  },
  {
    file: 'og-image.jpg',
    needed: force || !fs.existsSync(path.join(pub, 'og-image.jpg')),
    make: async (out) => sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toFile(out),
  },
];

for (const job of jobs) {
  if (!job.needed) {
    console.log(`kept     public/${job.file} (already present)`);
    continue;
  }
  await job.make(path.join(pub, job.file));
  console.log(`created  public/${job.file}`);
}
