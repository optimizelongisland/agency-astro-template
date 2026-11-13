# Agency Astro Template

Reusable starter for every new client site. Don't rebuild layouts per client —
reskin and recopy this one.

## What's reusable vs. what you edit per client

**Never edit (shared structure):**
- `src/components/*.astro` — Header, Hero, Services, Process, Testimonial, ContactForm, CTA, Footer
- `src/lib/leads.ts` and `src/pages/api/contact.ts` — contact form handling
- `src/layouts/BaseLayout.astro` — page shell
- `src/styles/global.css` — base rules, buttons, section spacing

**Edit for every new client:**
- `src/styles/tokens.css` — colors, fonts, radius. This alone reskins the whole site.
- `src/layouts/BaseLayout.astro` — the `business` object (name, phone, address, service area)
- `src/pages/index.astro` — headline, service list, steps, testimonial, contact form copy
- `astro.config.mjs` — set `site:` to the client's real domain (powers sitemap + canonical URLs)
- `public/robots.txt` — update the sitemap URL to match the real domain
- `public/favicon.svg` / `favicon.ico` — swap for the client's mark
- `public/apple-touch-icon.png` (180x180) and `public/og-image.jpg` (1200x630) — add for every client; `npm run qc` fails until both exist

## New client setup

1. Use this repo as a GitHub template ("Use this template" button) -> creates `client-name-site`
2. `npm install`
3. Edit `tokens.css`, `BaseLayout.astro`, `index.astro` as above
4. `npm run dev` to preview at localhost
5. Push to GitHub, connect the repo to Vercel (auto-deploys on push)
6. Set the contact form environment variables in Vercel (see "Contact form" below)
7. Point the client's domain DNS at the host

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

## Contact form (native, no iframe)

`src/components/ContactForm.astro` is a real form built into the site. It posts
to `src/pages/api/contact.ts`, which runs as a small Vercel function and:

1. Emails the lead to the client through [Resend](https://resend.com), with
   reply-to set to the visitor so the client can just hit reply.
2. Optionally copies the lead as JSON to any webhook URLs (Go High Level
   inbound webhook, a Google Sheet log, Zapier).
3. Sends the visitor to `/thank-you/`, a clean URL to count as a conversion in
   GA4 and Google Ads.

Every page is still static. The form endpoint is the only server code.

**Per-client setup** (set these in Vercel > Project > Settings > Environment
Variables; descriptions are in `.env.example`):

| Variable | Required | What it is |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key |
| `LEAD_FROM_EMAIL` | Yes | Sender, on a domain verified in Resend, e.g. `Website Leads <leads@send.youragency.com>` |
| `LEAD_TO_EMAIL` | Yes | The client's inbox. Comma-separate for several. |
| `LEAD_WEBHOOK_URLS` | No | Extra copies of each lead. Comma-separate for several. |
| `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Recommended | Cloudflare Turnstile spam check. The widget appears on its own once the site key is set. |

**Go High Level upsell:** in the client's GHL sub-account create a workflow with
an "Inbound Webhook" trigger, copy its URL into `LEAD_WEBHOOK_URLS`, and redeploy.
Nothing on the site changes; leads start landing in the CRM as well as email.

**Always set a backup copy.** Email delivery occasionally fails. Put at least
one webhook (a Google Sheet log is enough) in `LEAD_WEBHOOK_URLS` so a lead is
never lost. If email fails but a webhook succeeds, the visitor still sees
success and the failure is written to the Vercel function logs.

**Spam protection:** a hidden honeypot field is always on. Turnstile is the
real defense and should be on for every live site. Cross-site form posts are
rejected by Astro automatically.

**Testing locally:** with no variables set, `npm run dev` prints each submitted
lead in the terminal instead of sending it. `npm test` runs the unit tests for
validation, spam checks and delivery.

**If nothing is configured in production**, the visitor is told to call instead
and `NO DELIVERY CONFIGURED` is written to the Vercel logs. Always send a real
test lead before launch.

**On handover**, the form leaves with the site. The client only needs their own
Resend key and (if wanted) Turnstile keys.

**Hosting note:** the form endpoint uses the Vercel adapter (`astro.config.mjs`).
To host elsewhere, swap in that host's Astro adapter.

## Automated QC and agents

**`npm run qc`** builds the site and runs `scripts/qc.mjs`. It uses no AI model,
so it costs nothing and should run after every edit. It fails on: leftover
template placeholder text, missing or duplicate titles and meta descriptions,
pages without exactly one H1, images without alt text, broken internal links
and anchors, a sitemap URL that does not match the site, and a missing share
image. On the unfilled template it fails by design.

**Agents** live in `.claude/agents/` and travel with every client repo created
from this template. Each is pinned to the cheapest model that does its job well:

| Agent | Model | Use for |
|---|---|---|
| `site-editor` | Haiku | Routine content edits. The highest-volume job, so the cheapest model. Hands anything structural back. |
| `site-builder` | Sonnet | Building a site from an approved brief; new pages and sections. |
| `site-qa` | Opus | Independent pre-launch review, once per site. Read-only: it reports, it never fixes. |

Rule of thumb: script first, then the cheapest agent that fits, and the
expensive review only at launch.

## Pre-launch QC checklist (run this on every client site before going live)

- [ ] `npm run qc` passes with zero errors
- [ ] `npm test` passes
- [ ] `site-qa` agent review returns PASS
- [ ] Contact form: a real test lead submitted on the live domain arrives in the client's inbox AND in the backup webhook
- [ ] Contact form: Turnstile keys set and the widget shows on the live site
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
