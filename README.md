# Agency Astro Template

Reusable starter for every new client site. Don't rebuild layouts per client —
reskin and recopy this one.

## What's reusable vs. what you edit per client

**Never edit (shared structure):**
- `src/components/*.astro` — Header, Hero, Services, Process, Testimonial, CTA, Footer
- `src/layouts/BaseLayout.astro` — page shell
- `src/styles/global.css` — base rules, buttons, section spacing

**Edit for every new client:**
- `src/styles/tokens.css` — colors, fonts, radius. This alone reskins the whole site.
- `src/layouts/BaseLayout.astro` — the `business` object (name, phone, address, service area)
- `src/pages/index.astro` — headline, service list, steps, testimonial, CTA copy
- `astro.config.mjs` — set `site:` to the client's real domain (powers sitemap + canonical URLs)
- `public/robots.txt` — update the sitemap URL to match the real domain
- `public/favicon.svg` / `favicon.ico` — swap for the client's mark

## New client setup

1. Use this repo as a GitHub template ("Use this template" button) -> creates `client-name-site`
2. `npm install`
3. Edit `tokens.css`, `BaseLayout.astro`, `index.astro` as above
4. `npm run dev` to preview at localhost
5. Push to GitHub, connect the repo to Vercel or Netlify (auto-deploys on push)
6. Point the client's domain DNS at the host

## Ongoing changes

Open the client's repo in Claude Code, describe the change in plain language,
preview with `npm run dev`, push. Deploys automatically.

## Adding a new page (e.g. a service-area page)

Create a new file under `src/pages/`, e.g. `src/pages/huntington-sprinkler-repair.astro`,
wrap it in `<BaseLayout>`, and reuse whichever components fit (Hero, Services, CTA —
you don't need Process or Testimonial on every page). Astro turns the filename into
the URL automatically.

## SEO checklist per new client

- [ ] `astro.config.mjs` site URL set to real domain
- [ ] `robots.txt` sitemap URL matches
- [ ] LocalBusiness schema fields in `BaseLayout.astro` accurate (name, phone, address, service area)
- [ ] Every page has a unique `title` and `description` prop
- [ ] Google Business Profile claimed and linked
- [ ] Site submitted to Google Search Console

## Analytics & search console setup (per client)

1. Copy `.env.example` to `.env`
2. `PUBLIC_GA_MEASUREMENT_ID` — from GA4: Admin > Data Streams > your stream
3. `PUBLIC_GSC_VERIFICATION` — from Search Console: Settings > Ownership verification > HTML tag (copy just the token, not the full tag)
4. Both are conditional in `BaseLayout.astro` — if left blank, no broken/empty tracking tags ship to production

## Go High Level (GHL) lead capture

`src/components/GHLForm.astro` embeds a GHL-hosted form via iframe so leads land
directly in the client's CRM. To wire it up:

1. In GHL: Sites > Forms > build the form > Embed Code
2. Copy the `FORM_ID` out of the iframe `src` URL in that embed snippet
3. Uncomment the import in `index.astro` and use `<GHLForm formId="..." />` in place of, or alongside, the CTA section

If a client isn't on GHL, skip this component — the CTA's call/email links work standalone.

## Pre-launch QC checklist (run this on every client site before going live)

- [ ] `npm run build` completes with zero errors
- [ ] Mobile nav opens/closes correctly at <820px (tested on an actual phone, not just resized browser)
- [ ] Every page has a unique, accurate `title` and `description`
- [ ] `og-image.jpg` (1200x630) exists in `/public` and shows correctly when the URL is shared
- [ ] LocalBusiness schema in `BaseLayout.astro` has real business info, not placeholders
- [ ] FAQ schema present on homepage and any service pages with FAQs
- [ ] All images use `<Photo>` / `astro:assets`, not raw `<img src="/foo.jpg">`
- [ ] Every image has real, descriptive alt text
- [ ] `astro.config.mjs` `site:` matches the real production domain
- [ ] `robots.txt` sitemap URL matches the real domain
- [ ] GA4 and GSC verification working (check GA Realtime + GSC ownership confirmed)
- [ ] Site submitted in Google Search Console, sitemap submitted
- [ ] Google Business Profile linked and claimed
- [ ] Lighthouse score checked (aim for 90+ performance, 100 accessibility)

## Blog

Every client site includes a blog by default. This is the recurring-content
piece of the monthly SEO/AEO cadence, not a one-off feature.

**Adding a new post:**

1. Create a new `.md` file in `src/content/blog/`
2. Fill in the required frontmatter (title, metaDescription, publishDate, coverImage, coverImageAlt)
3. Write the post body in Markdown below the frontmatter
4. `npm run dev` to preview at `/blog/your-file-name/`

The filename becomes the URL slug, so name files like `spring-lawn-prep-tips.md`,
not `post-1.md`.

**What's automatic:**
- Listing page at `/blog` (newest first, drafts excluded)
- Individual post pages with `BlogPosting` schema
- RSS feed at `/rss.xml`
- Responsive, optimized cover images via `astro:assets`
- Every post's `og:image` uses its cover image automatically

**Cover images** go in the same folder as the post's `.md` file (or a subfolder),
referenced as a relative path in frontmatter, e.g. `coverImage: "./my-cover.jpg"`.
This is a good fit for Higgsfield-generated images per post.

**Draft posts:** set `draft: true` in frontmatter to keep a post out of the
listing/RSS while still being able to preview it directly by URL.

## Redirects (essential on any WordPress migration)

Every old URL with backlinks or Google rankings needs to redirect to its new
Astro equivalent, or that page's authority is lost when the old site comes down.

**Two options, use the one matching your host:**

1. **`astro.config.mjs` `redirects`** — works everywhere, generates a meta-refresh
   HTML page per redirect. Fine for most cases, but not a true server-level 301.
2. **`public/_redirects` (Netlify)** or **`vercel.json` `redirects` array (Vercel)**
   — true 301s at the host level. Prefer this for any page with real backlink equity.

Before decommissioning a client's old WordPress site: pull every indexed URL from
Google Search Console's Pages report (or crawl the live site), and map each one.

## AI crawler access (robots.txt)

`public/robots.txt` explicitly allows GPTBot, ClaudeBot, Google-Extended,
PerplexityBot, OAI-SearchBot, and Applebot-Extended — these are the crawlers
that actually power AI-answer citations, and this is the confirmed, real lever
for AEO/GEO visibility. `llms.txt` is intentionally not included: as of 2026,
adoption sits around 10% of sites and major AI labs have stated they don't
read it. Not worth the effort yet.

## Social profiles (sameAs schema)

Set `socialProfiles` in `BaseLayout.astro`'s `business` object to the client's
real Facebook, Instagram, Google Business Profile, Yelp, and LinkedIn URLs.
This populates the `LocalBusiness` schema's `sameAs` field, which is how
Google and AI engines confirm the website and those profiles are the same
business entity - directly reinforces citation/directory work.

## Full schema library

All schema is confirmed valid JSON-LD via automated build checks, not just written by hand.

| Schema | Where it lives | When to use |
|---|---|---|
| `LocalBusiness` | `SEO.astro`, every page | Automatic on every page |
| `Organization` + `WebSite` | `schema/SiteSchema.astro`, in `BaseLayout` | Automatic site-wide |
| `FAQPage` | `FAQ.astro` | Any page with an FAQ section |
| `BlogPosting` | `BlogPostLayout.astro` | Automatic on every blog post |
| `Service` | `schema/ServiceSchema.astro` | Individual service pages |
| `BreadcrumbList` | `schema/Breadcrumbs.astro` | Any page nested under the homepage |
| `AggregateRating` | Props on `SEO.astro`/`BaseLayout` (`ratingValue`, `reviewCount`) | Once a client has real reviews - never fabricate these numbers |
| `Review` | `ReviewCard.astro` | Displaying individual testimonials |
| `VideoObject` | `VideoEmbed.astro` | Any Higgsfield-generated or other video content |

See `src/pages/example-service-page.astro` for a working example combining
breadcrumbs, service schema, and reviews together - copy its structure for
real service pages.
