# Agency Astro Template

The starting point for every client site. It has two layers:

| Layer | Where | Rule |
|---|---|---|
| **Locked foundation** | `src/core/`, `src/pages/api/`, `scripts/`, `tests/` | Identical on every client site. Never edited per client. |
| **Open design layer** | `src/design/`, `src/pages/` | Fresh for every client. Restyle, replace, add or delete freely. |

The foundation is the plumbing a visitor never sees: SEO tags, structured data,
the lead form and its delivery, analytics, and the quality checks. Keeping it
identical everywhere means a fix made once can be copied to every site.

The design layer is everything a visitor does see. The look that ships here is
a neutral scaffold, not a house style. Each client gets their own design.

## Where things live

| Path | What it is |
|---|---|
| `src/site.ts` | The client's business details (name, phone, address, service area). The single source of truth; change them here and nowhere else. |
| `src/design/tokens.css` | Colors, fonts, radius. |
| `src/design/global.css` | Base rules, buttons, section spacing. |
| `src/design/components/` | Header, footer, hero and every other visual section. |
| `src/design/layouts/` | `SiteLayout` (the visible page shell) and `BlogPostLayout`. |
| `src/pages/` | The pages. The filename becomes the URL. |
| `src/content/blog/` | Blog posts in Markdown. |
| `src/core/` | Locked foundation. See `src/core/README.md`. |
| `client/` | This client's approved brief and design direction. Not published. |
| `.claude/` | The agents and the design skill that travel with every client repo. |

## New client site

1. Use this repo as a GitHub template to create `client-name-site`, then `npm install`.
2. Write the content brief: copy `client/brief.example.md` to `client/brief.md`, fill it in, and get the client's sign-off.
3. Put the client's logo and photos under `src/assets/`.
4. Design and build. In Claude Code, ask for a new design and give two or three reference sites you like. The `site-design` skill runs the steps: capture the references, write a design direction, build it, check it.
5. Icons and share image: add the client's own `public/favicon.svg`, `public/apple-touch-icon.png` (180x180) and `public/og-image.jpg` (1200x630). If the client has no logo artwork, `npm run icons` generates all of them from the business name and the site's colors.
6. `npm run qc` until it passes, then run the `site-qa` agent once.
7. Push to GitHub, connect the repo to Vercel, set the contact form environment variables (see "Contact form" below), and point the domain at Vercel.
8. Send a real test lead on the live domain.

## Design from reference sites

The `site-design` skill (`.claude/skills/site-design/SKILL.md`) is the process.
In short:

1. `npm run shots -- --out .design-refs <url> <url>` screenshots each reference at desktop and phone width and measures its fonts, sizes and colors. No AI model is used.
2. The `site-designer` agent studies those and the brief, and writes `client/design-direction.md`: concept, exact colors and type, and the home page section by section.
3. The `site-builder` agent builds it.
4. `npm run qc` and a screenshot review catch what is off.

References give direction, not a blueprint. Nothing of theirs (images, icons,
wording, logo) is used, and no page mirrors one of them section for section.

## Ongoing changes

Open the client's repo in Claude Code and describe the change. Text, phone,
hours, price and photo changes go to the `site-editor` agent; new pages or
sections go to `site-builder`. Preview, get approval, push. Vercel deploys
automatically.

## SEO checklist per new client

- [ ] `astro.config.mjs` `site` set to the real domain
- [ ] `public/robots.txt` sitemap URL matches
- [ ] `src/site.ts` accurate, including `socialProfiles`
- [ ] Every page has a unique `title` and `description`
- [ ] Google Business Profile claimed and linked
- [ ] Site and sitemap submitted to Google Search Console

## Analytics & search console setup (per client)

1. Copy `.env.example` to `.env`
2. `PUBLIC_GA_MEASUREMENT_ID` from GA4: Admin > Data Streams > your stream
3. `PUBLIC_GSC_VERIFICATION` from Search Console: Settings > Ownership verification > HTML tag (copy just the token, not the full tag)
4. Both are optional in `CoreLayout`: if left blank, no empty tracking tags ship

## Contact form (native, no iframe)

`src/core/components/LeadForm.astro` is a real form built into the site. It posts
to `src/pages/api/contact.ts`, which runs as a small Vercel function and:

1. Emails the lead to the client through [Resend](https://resend.com), with
   reply-to set to the visitor so the client can just hit reply.
2. Optionally copies the lead as JSON to any webhook URLs (Go High Level
   inbound webhook, a Google Sheet log, Zapier).
3. Sends the visitor to `/thank-you/`, a clean URL to count as a conversion in
   GA4 and Google Ads.

Every page is still static. The form endpoint is the only server code.

Need to ask something extra, such as which service the visitor wants? Pass
`extraFields` to `LeadForm` (see the comment at the top of the file). The
answers arrive in the email and in the webhook copy.

`LeadForm` renders only the form. The section around it is design: see
`src/design/components/ContactSection.astro`. To restyle the fields, set the
CSS variables listed at the top of `LeadForm.astro`; do not edit the file.

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
so it costs nothing and should run after every edit. It fails on:

- leftover template placeholder text
- missing or duplicate titles and meta descriptions, or a page without exactly one H1
- images without alt text
- broken internal links and anchors
- body text, muted text or button text that does not meet 4.5:1 color contrast
- a required design token missing from `tokens.css`
- any change to the locked foundation (compared against `core.lock.json`)
- a sitemap URL that does not match the site, a missing share image, or the default Astro icon still in place

On the unfilled template it fails by design.

**`npm run icons`** generates the favicon, home-screen icon and share image from
the business name and the site's colors, for clients with no logo artwork. It
never overwrites artwork that is already there.

**`npm run shots -- --out <folder> <url>...`** saves desktop and phone
screenshots and measured design facts for any page, including the local build.

**Agents** live in `.claude/agents/` and travel with every client repo. Each is
pinned to the cheapest model that does its job well:

| Agent | Model | Use for |
|---|---|---|
| `site-editor` | Haiku | Routine content edits. The highest-volume job, so the cheapest model. Hands anything structural back. |
| `site-builder` | Sonnet | Building a site from the brief and design direction; new pages and sections. |
| `site-designer` | Opus | Writing the design direction, once per site. |
| `site-qa` | Opus | Independent pre-launch review, once per site. Read-only: it reports, it never fixes. |

Rule of thumb: script first, then the cheapest agent that fits, and the
expensive models only for the two once-per-site judgment calls.

## Updating the locked foundation

Only in this template repo, never on a client site. Change the core with tests,
bump `CORE_VERSION` in `scripts/core-lock.mjs`, run `npm run core:lock`, then
copy the locked folders and `core.lock.json` to each client repo.

## Pre-launch QC checklist (run this on every client site before going live)

- [ ] `npm run qc` passes with zero errors
- [ ] `npm test` passes
- [ ] `site-qa` agent review returns PASS
- [ ] Contact form: a real test lead submitted on the live domain arrives in the client's inbox AND in the backup webhook
- [ ] Contact form: Turnstile keys set and the widget shows on the live site
- [ ] Mobile navigation works on an actual phone, not just a resized browser
- [ ] Every page has a unique, accurate `title` and `description`
- [ ] `og-image.jpg` (1200x630) exists in `/public` and shows correctly when the URL is shared
- [ ] `src/site.ts` has the real business info
- [ ] Every page that shows FAQs also emits `FaqSchema` with the same items
- [ ] All images use `Photo` / `astro:assets`, not raw `<img src="/foo.jpg">`
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
2. Fill in the required frontmatter (title, metaDescription, publishDate). A cover image is optional; if you add one, `coverImageAlt` is required. The author defaults to the business; name a person only if a real person wrote or reviewed the post.
3. Write the post body in Markdown below the frontmatter
4. `npm run dev` to preview at `/blog/your-file-name/`

The filename becomes the URL slug, so name files like `spring-lawn-prep-tips.md`,
not `post-1.md`.

**What's automatic:**
- Listing page at `/blog` (newest first, drafts excluded)
- Individual post pages with `BlogPosting` schema
- RSS feed at `/rss.xml`
- Responsive, optimized cover images via `astro:assets`
- Every post's share image (`og:image`) is its cover image

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

`public/robots.txt` allows every crawler, and names the AI crawlers in two groups
so the choice is visible:

- **Search and answer crawlers** (OAI-SearchBot, ChatGPT-User, PerplexityBot,
  Perplexity-User, Claude-SearchBot, Claude-User). These fetch pages to answer a
  question and can cite the site. Keep them allowed.
- **Training crawlers** (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended).
  These collect text to train models. Allowing or blocking them is the client's
  choice and does not affect Google results or Google's AI Overviews, which use
  Googlebot.

`llms.txt` is intentionally not included.

## Social profiles (sameAs schema)

Set `socialProfiles` in `src/site.ts` to the client's
real Facebook, Instagram, Google Business Profile, Yelp, and LinkedIn URLs.
This populates the `LocalBusiness` schema's `sameAs` field, which is how
Google and AI engines confirm the website and those profiles are the same
business entity - directly reinforces citation/directory work.

## Full schema library

All structured data comes from the locked core, so it is the same on every site.
A design component shows the content; the matching core component emits the schema.

| Schema | Core component | When to use |
|---|---|---|
| `LocalBusiness` | `core/components/SEO.astro` | Automatic on every page |
| `Organization` + `WebSite` | `core/components/schema/SiteSchema.astro` | Automatic site-wide |
| `FAQPage` | `schema/FaqSchema.astro` | Any page with an FAQ section |
| `BlogPosting` | `schema/BlogPostSchema.astro` | Automatic on every blog post |
| `Person` | `schema/PersonSchema.astro` | A bio page for a real, named owner or author who has agreed to be named |
| `Service` | `schema/ServiceSchema.astro` | Individual service pages |
| `BreadcrumbList` | `schema/BreadcrumbSchema.astro` | Any page nested under the homepage |
| `AggregateRating` | `ratingValue` and `reviewCount` props on `SiteLayout` | Once a client has real reviews. Never estimate these numbers. |
| `Review` | `schema/ReviewSchema.astro` | Displaying individual real reviews |
| `VideoObject` | `core/components/VideoEmbed.astro` | Any video content |

`src/pages/example-service-page.astro` is a working example combining
breadcrumbs, service schema and reviews.
