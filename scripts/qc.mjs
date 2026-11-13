// Pre-launch quality check. Run with `npm run qc` (builds first, then runs this).
//
// Everything here is a mechanical check that needs no AI model, so it costs
// nothing to run after every edit. Model-based review (the site-qa agent) is
// reserved for judgment calls this script cannot make.
//
// Errors fail the run (exit code 1). Warnings are printed but do not fail it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyLock } from './core-lock.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist', 'client');

const errors = [];
const warnings = [];
const error = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

if (!fs.existsSync(dist)) {
  console.error('No build found at dist/client. Run `npm run qc`, which builds first.');
  process.exit(1);
}

// Text that only exists in the unfilled template. Any of it on a live site
// means a page was never finished.
const PLACEHOLDERS = [
  'Client Business Name',
  'example-client-domain.com',
  'clientdomain.com',
  '(555) 555-5555',
  '(631) 555-0148',
  '123 Main St',
  'Town One',
  'Service One',
  'Step one',
  '[REGION]',
  '[YEAR]',
  'A real or representative customer quote',
  'A headline that names the outcome',
  'lorem ipsum',
  // The sample service page and sample blog post that ship with the template.
  'Example Service Name',
  'sprinkler-watering-schedule',
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? '') : null;
};

// Visible text only: drop scripts, styles and tags.
const visibleText = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const relative = (f) => '/' + path.relative(dist, f).split(path.sep).join('/');
const pagePath = (f) => relative(f).replace(/index\.html$/, '');

// Every URL path the built site can serve, for the internal link check.
const servable = new Set(files.map(relative));
for (const f of htmlFiles) {
  const p = pagePath(f);
  servable.add(p);
  servable.add(p.replace(/\/$/, ''));
  servable.add(relative(f).replace(/\.html$/, ''));
}
const SERVER_ROUTES = [/^\/api\//, /^\/_image/, /^\/_server-islands\//];

const titles = new Map();
let pagesWithForm = 0;
const descriptions = new Map();

for (const file of htmlFiles) {
  const page = pagePath(file);
  // HTML comments are not content; ignore anything inside them.
  const html = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const text = visibleText(html);
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? '';
  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head);
  const isErrorPage = page === '/404.html';
  // Redirect stubs generated from astro.config.mjs `redirects` have no content to check.
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(head)) continue;

  // 1. Leftover template text (checked in the whole file so meta tags and schema count too).
  for (const placeholder of PLACEHOLDERS) {
    if (html.toLowerCase().includes(placeholder.toLowerCase())) {
      error(page, `template placeholder still present: "${placeholder}"`);
    }
  }

  // 2. Title and meta description.
  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  const descTag = head.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] ?? '';
  const description = (attr(descTag, 'content') ?? '').trim();

  if (!title) error(page, 'missing <title>');
  if (!description) error(page, 'missing meta description');

  if (!noindex && !isErrorPage) {
    if (title) {
      if (titles.has(title)) error(page, `duplicate title, same as ${titles.get(title)}: "${title}"`);
      else titles.set(title, page);
      if (title.length > 65) warn(page, `title is ${title.length} characters (aim for 65 or fewer)`);
    }
    if (description) {
      if (descriptions.has(description)) error(page, `duplicate meta description, same as ${descriptions.get(description)}`);
      else descriptions.set(description, page);
      if (description.length < 70 || description.length > 160)
        warn(page, `meta description is ${description.length} characters (aim for 70 to 160)`);
    }
    if (!/<link[^>]+rel=["']canonical["']/i.test(head)) error(page, 'missing canonical link');
  }

  // 3. Exactly one H1.
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count !== 1) error(page, `expected exactly one <h1>, found ${h1Count}`);

  // 4. Every image has alt text.
  for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = attr(img, 'alt');
    if (alt === null || alt.trim() === '') error(page, `image without alt text: ${attr(img, 'src') ?? img.slice(0, 80)}`);
  }

  // 5. Internal links and assets resolve.
  const refs = [...html.matchAll(/<(?:a|link|img|script|source)\b[^>]*?\s(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(
    (m) => decode(m[1]),
  );
  for (const ref of new Set(refs)) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    const target = decodeURI(ref.split('#')[0].split('?')[0]);
    if (target === '' || SERVER_ROUTES.some((r) => r.test(target))) continue;
    if (!servable.has(target)) error(page, `broken internal link: ${ref}`);
  }

  // 6. Same-page anchors point at something.
  const anchors = new Set([...html.matchAll(/href=["']#([^"']+)["']/gi)].map((m) => m[1]));
  for (const anchor of anchors) {
    const m = [null, anchor];
    if (!new RegExp(`\\sid=["']${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(html))
      error(page, `anchor link #${m[1]} has no matching id on the page`);
  }

  // 7. The skip link in the core layout needs its target.
  if (!/\sid=["']main-content["']/.test(html)) error(page, 'missing <main id="main-content"> (the skip link targets it)');
  if (/data-lead-form/.test(html)) pagesWithForm++;

  // 8. House style: no em dashes in visible copy.
  if (text.includes('—')) warn(page, 'em dash found in visible text (house style: none)');
}

// 9. The locked foundation is untouched.
for (const problem of verifyLock()) {
  error('core', `${problem}. Core files are shared by every client site and must not be edited per client; put the change in src/design/ instead.`);
}

// 10. Design tokens: the names the core relies on exist, and text is readable.
const REQUIRED_TOKENS = ['--bg', '--paper', '--ink', '--muted', '--deep', '--on-deep', '--line', '--error', '--font-body', '--radius'];
const tokensPath = path.join(root, 'src', 'design', 'tokens.css');
if (!fs.existsSync(tokensPath)) error('src/design/tokens.css', 'missing');
else {
  const css = fs.readFileSync(tokensPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  for (const name of REQUIRED_TOKENS) {
    if (!(name in tokens)) error('src/design/tokens.css', `required token ${name} is not defined`);
  }

  const hexToRgb = (value) => {
    let hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value ?? '')?.[1];
    if (!hex) return null;
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  };
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  // [text token, background token]. 4.5:1 is the WCAG AA minimum for body text.
  const PAIRS = [
    ['--ink', '--bg'],
    ['--ink', '--paper'],
    ['--muted', '--bg'],
    ['--muted', '--paper'],
    ['--on-deep', '--deep'],
    ['--error', '--paper'],
  ];
  for (const [fg, bg] of PAIRS) {
    const a = hexToRgb(tokens[fg]);
    const b = hexToRgb(tokens[bg]);
    if (!a || !b) {
      if (fg in tokens && bg in tokens) warn('src/design/tokens.css', `cannot check contrast of ${fg} on ${bg}: use hex colors for these tokens`);
      continue;
    }
    const ratio = contrast(a, b);
    if (ratio < 4.5) error('src/design/tokens.css', `${fg} on ${bg} has contrast ${ratio.toFixed(2)}:1 (needs 4.5:1 to be readable)`);
  }
  // Headlines and buttons use --deep on the page background; large text needs 3:1.
  const deep = hexToRgb(tokens['--deep']);
  const bg = hexToRgb(tokens['--bg']);
  if (deep && bg && contrast(deep, bg) < 3) error('src/design/tokens.css', `--deep on --bg has contrast ${contrast(deep, bg).toFixed(2)}:1 (needs 3:1)`);
}

if (pagesWithForm === 0) warn('site', 'no page contains the lead form (LeadForm). Visitors have no way to send an enquiry.');

// 11. Site-level settings.
const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
const site = config.match(/site:\s*['"]([^'"]+)['"]/)?.[1];
if (!site) error('astro.config.mjs', '`site` is not set');
else {
  const robotsPath = path.join(dist, 'robots.txt');
  if (!fs.existsSync(robotsPath)) error('robots.txt', 'missing');
  else {
    const sitemapLine = fs.readFileSync(robotsPath, 'utf8').match(/^Sitemap:\s*(\S+)/im)?.[1];
    if (!sitemapLine) error('robots.txt', 'no Sitemap line');
    else if (new URL(sitemapLine).host !== new URL(site).host)
      error('robots.txt', `Sitemap host (${new URL(sitemapLine).host}) does not match site (${new URL(site).host})`);
  }
}
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) error('sitemap', 'sitemap-index.xml was not generated');
if (!fs.existsSync(path.join(dist, 'og-image.jpg')))
  error('public/og-image.jpg', 'missing (1200x630 share image used by every page without its own)');

// Report.
const line = '-'.repeat(60);
console.log(`\nQC checked ${htmlFiles.length} pages`);
if (warnings.length) {
  console.log(`\n${line}\nWARNINGS (${warnings.length})\n${line}`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}
if (errors.length) {
  console.log(`\n${line}\nERRORS (${errors.length})\n${line}`);
  errors.forEach((e) => console.log(`  x ${e}`));
  console.log(`\nQC FAILED: ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  process.exit(1);
}
console.log(`\nQC PASSED: 0 errors, ${warnings.length} warning(s)\n`);
