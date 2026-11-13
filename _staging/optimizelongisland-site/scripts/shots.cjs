// Screenshots plus measured design facts for any page. No AI model involved.
//
//   node scripts/shots.cjs --out <folder> <url> [<url> ...]
//
// For each URL it saves a desktop and a phone screenshot and a small JSON file
// of what the page actually uses: fonts, type sizes, colors, button shape,
// content width. Two uses:
//   1. Reference sites: gives the designer facts instead of impressions.
//   2. Our own build (http://localhost:4321/...): lets the build be checked
//      against the design direction, and catches phone-width overflow.
//
// Needs Playwright. It is pre-installed in Claude Code cloud sessions. On your
// own computer: `npm install --no-save playwright && npx playwright install chromium`.
// If the network blocks a reference site, the script says so; capture that
// site with a web screenshot tool instead.
const fs = require('node:fs');
const path = require('node:path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright is not installed. See the note at the top of scripts/shots.cjs.');
  process.exit(2);
}

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
if (outIndex === -1 || !args[outIndex + 1]) {
  console.error('Usage: node scripts/shots.cjs --out <folder> <url> [<url> ...]');
  process.exit(2);
}
const outDir = path.resolve(args[outIndex + 1]);
const urls = args.filter((_, i) => i !== outIndex && i !== outIndex + 1);
if (urls.length === 0) {
  console.error('Give at least one URL.');
  process.exit(2);
}
fs.mkdirSync(outDir, { recursive: true });

const slug = (url) => {
  const u = new URL(url);
  return (u.hostname + u.pathname).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'page';
};

// Runs inside the page. Measures what is rendered rather than reading stylesheets.
function measure() {
  const rgbToHex = (value) => {
    const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
    return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
  };
  const style = (el) => (el ? getComputedStyle(el) : null);
  // The visible match with the most text, so body copy is measured rather than a label.
  const type = (selector) => {
    const el = [...document.querySelectorAll(selector)]
      .filter((e) => e.offsetParent !== null && e.textContent.trim() && e.getBoundingClientRect().left >= 0)
      .sort((x, y) => y.textContent.trim().length - x.textContent.trim().length)[0];
    const s = style(el);
    if (!s) return null;
    return {
      font: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      size: s.fontSize,
      weight: s.fontWeight,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      transform: s.textTransform,
      color: rgbToHex(s.color),
    };
  };

  // Colors weighted by the screen area they cover, so a tiny icon does not outrank the page background.
  const backgrounds = {};
  const texts = {};
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    const s = getComputedStyle(el);
    const area = rect.width * rect.height;
    const bg = rgbToHex(s.backgroundColor);
    if (bg) backgrounds[bg] = (backgrounds[bg] ?? 0) + area;
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      const fg = rgbToHex(s.color);
      if (fg) texts[fg] = (texts[fg] ?? 0) + area;
    }
  }
  const top = (map, n) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([hex]) => hex);

  const button = [...document.querySelectorAll('a, button')].find((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return r.left >= 0 && r.top >= 0 && r.width > 60 && r.height > 28 && rgbToHex(s.backgroundColor) && s.display !== 'inline' && el.textContent.trim().length < 40;
  });
  const b = style(button);

  const widest = Math.max(
    0,
    ...[...document.querySelectorAll('main p, main h1, main h2, p, h1')].slice(0, 200).map((el) => el.getBoundingClientRect().right),
  );

  return {
    title: document.title,
    bodyBackground: rgbToHex(getComputedStyle(document.body).backgroundColor),
    body: type('p'),
    h1: type('h1'),
    h2: type('h2'),
    nav: type('nav a'),
    backgroundColors: top(backgrounds, 6),
    textColors: top(texts, 5),
    button: b
      ? {
          text: button.textContent.trim().slice(0, 40),
          background: rgbToHex(b.backgroundColor),
          color: rgbToHex(b.color),
          radius: b.borderRadius,
          padding: b.padding,
          font: b.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
          weight: b.fontWeight,
          transform: b.textTransform,
        }
      : null,
    contentRightEdge: Math.round(widest),
    pageHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  };
}

(async () => {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  let failures = 0;
  const browser = await chromium.launch();
  for (const url of urls) {
    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(url);
    const name = slug(url);
    const facts = { url };
    for (const [label, viewport] of [
      ['desktop', { width: 1440, height: 900 }],
      ['phone', { width: 390, height: 844 }],
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        ...(proxy && !isLocal ? { proxy: { server: proxy } } : {}),
      });
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        // Hide the Astro dev toolbar so it does not sit on top of the capture.
        await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' }).catch(() => {});
        await page.waitForTimeout(800);
        // Cap very long pages so the image stays viewable.
        const height = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), 12000);
        const file = path.join(outDir, `${name}-${label}.png`);
        await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width: viewport.width, height } });
        facts[label] = await page.evaluate(measure);
        console.log(`saved ${file}`);
      } catch (error) {
        failures++;
        const message = String(error.message ?? error).split('\n')[0];
        console.error(`FAILED ${label} ${url}: ${message}`);
        if (/TUNNEL|PROXY|ERR_CONNECTION|ERR_NAME/.test(message) && !isLocal)
          console.error('  The network here blocks this site. Capture it with a web screenshot tool instead.');
      }
      await context.close();
    }
    const factsFile = path.join(outDir, `${name}.json`);
    fs.writeFileSync(factsFile, JSON.stringify(facts, null, 2));
    console.log(`saved ${factsFile}`);
  }
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
