# Design direction: Optimize Long Island

For the builder. Facts and copy come from `client/brief.md`; this file decides how the site looks and is laid out. Where a line of copy is suggested here it is a suggestion in the brief's tone, not a new fact. Never add a claim, number or name that is not in the brief.

What I looked at: `.design-refs/current-site-home-desktop.png` (the current site, desktop, above the fold only) and `.design-refs/current-site.json`. Nothing below the fold of the current site was visible, and the logo was not legible in the capture (the header shows only "MENU" and a "GET STARTED" button), so nothing is taken from the logo artwork itself. Brand colors come from the JSON and the brief. No other reference sites were supplied, and none were captured.

---

## 1. Concept

A calm, exact, navy and cyan site that reads like a well-made spec sheet, not an agency brochure: big plain type, prices in plain sight, and nothing decorative that a practical Long Island business owner has to look past. It is for an owner who has been quoted $8,000 and three months, and who must believe within five seconds: "a custom site, $1,000, live in about a week, and a real person checks it."

**The one distinctive element is the Build Sheet**: a white spec card set in monospace, with label and value rows joined by dotted leaders, that always ends in a cyan check stamp reading "Checked by a person." It appears in the home hero, as every price card, in the technology section and at the top of each service page. It is the positioning made visible: the work is itemized like a machine output, and a person signs it off. Everything else on the site stays quiet around it.

## 2. From the current brand (in place of references)

**Carried over**
- The bright cyan `#00AFEF` as the brand color, and the very dark navy (`#002338`, `#000D15`). Cyan stays recognizable because it is used generously as a fill and as text on navy.
- The cyan button with dark navy text, and its fully rounded pill shape. It is the one shape a returning visitor will recognize.
- A navy top of the page, and the phone number always visible in the header.
- The offer wording "free analysis" (brief: every plan starts with a free consultation / free analysis).

**Deliberately left behind**
- The stock photo of people in an office, and any photography of people at all.
- The Google "5.0 Business Rating" badge and stars: no rating is supplied in the brief.
- The decorative gauges and bar charts ("85 Phone Calls", "40 Form Leads"): these are unsupplied numbers. No counters, gauges or stat graphics anywhere.
- All-caps Montserrat headlines, centered text over a photo, the hidden "MENU" navigation, the pipe-separated "SEO | WEB DESIGN | PPC" line, and the greyish purple body text `#4B4B69`.
- "We guarantee results" in any form.

## 3. Tokens

Paste this as the whole of `src/design/tokens.css` (keep the file's header comment if you like). All checked pairs were computed with the same formula `npm run qc` uses:

| Pair | Ratio | Needs |
|---|---|---|
| `--ink` on `--bg` / `--paper` | 16.3 / 17.7 | 4.5 |
| `--muted` on `--bg` / `--paper` | 6.3 / 6.8 | 4.5 |
| `--on-deep` on `--deep` | 16.2 | 4.5 |
| `--error` on `--paper` | 6.6 | 4.5 |
| `--deep` on `--bg` | 14.9 | 3 |
| `--accent-2` on `--paper` / `--bg` | 5.6 / 5.2 | (links) |
| `--accent` on `--deep` / `--deep-2` / `--night` | 6.5 / 5.2 / 7.8 | (cyan text on navy) |
| `--deep` on `--accent` (button text) | 6.5 | |
| `--on-deep-muted` on `--deep` / `--deep-2` / `--night` | 8.9 / 7.2 / 10.8 | |
| `--field-border` on `--paper` | 3.4 | 3 (non-text) |

```css
:root {
  /* --- Color --- */
  --bg: #F3F6F8;          /* page background, a cool off-white */
  --paper: #FFFFFF;       /* [core] cards, alternate sections, form card */
  --ink: #0A1A26;         /* [core] body text and headings on light */
  --muted: #4B5D6B;       /* [core] secondary text on light */
  --deep: #002338;        /* [core] brand navy: header, hero, dark bands, button text on cyan */
  --on-deep: #FFFFFF;     /* [core] text on navy */
  --accent: #00AFEF;      /* brand cyan: button fills, stamps, rules, cyan text ON NAVY ONLY */
  --accent-2: #006F99;    /* cyan-ink: links and focus ring on light backgrounds */
  --line: #D4DEE5;        /* borders and dividers on light */
  --error: #B42318;       /* [core] form errors */

  /* --- Extra color tokens --- */
  --night: #000D15;       /* footer, the darkest brand navy */
  --deep-2: #0B3350;      /* raised surfaces on navy (stack sheet, mobile menu) */
  --on-deep-muted: #A8C4D6; /* secondary text on navy */
  --line-deep: rgba(255, 255, 255, 0.14); /* dividers on navy */
  --accent-hover: #4CC6F3;  /* cyan button hover (navy text on it is 8.2:1) */
  --accent-soft: #E3F6FD;   /* pale cyan tint for highlighted rows on light */
  --field-border: #7A8D9B;  /* form field borders on white */

  /* --- Type --- */
  --font-display: 'Instrument Sans', -apple-system, 'Segoe UI', sans-serif;
  --font-body: 'Instrument Sans', -apple-system, 'Segoe UI', sans-serif; /* [core] */
  --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;

  /* --- Layout --- */
  --max-width: 1200px;
  --radius: 10px;         /* [core] cards and form fields */
  --radius-pill: 999px;   /* buttons, chips, the phone pill */
  --gutter: 32px;         /* page side padding, 20px at phone width (set in global.css) */
  --section-y: 120px;     /* section padding, 72px at phone width (set in global.css) */
  --header-h: 72px;       /* 64px at phone width */
}
```

**Color rules the builder must keep:**
- Cyan `--accent` is never text on a light background (2.5:1). On light it is only a fill (buttons, stamps, a 3px rule). Links on light are `--accent-2`.
- Text on a cyan fill is always `--deep`, never white (white on cyan is 2.5:1).
- Focus ring: `2px solid var(--accent-2)` with `outline-offset: 3px` on light; inside navy areas set `outline-color: var(--accent)`.
- The page uses exactly these hues: navy family, cyan family, the neutral greys above, and `--error` only for errors. No third brand color, no gradients except the hero grid fade described below.

## 4. Type

Two open-licensed families from Google Fonts, four weights in total:
- **Instrument Sans** 400, 500, 600 (all headings, body, buttons, prices)
- **JetBrains Mono** 500 (eyebrows, Build Sheet rows, step numbers, small labels, the phone number)

Replace the font link in `src/design/layouts/SiteLayout.astro` with:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
```

Keep the two preconnect tags. Do not load italics; there is no italic in the design.

| Role | Desktop | Phone (≤ 640px) | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| h1 (home) | 68px | 40px | 600 | 1.02 | -0.03em |
| h1 (inner page head) | 52px | 34px | 600 | 1.06 | -0.025em |
| h2 | 44px | 30px | 600 | 1.08 | -0.02em |
| h3 | 22px | 20px | 600 | 1.25 | -0.01em |
| Lede (first paragraph under h1) | 20px | 18px | 400 | 1.5 | 0 |
| Body | 17px | 16px | 400 | 1.6 | 0 |
| Small text (captions, notes) | 14px | 14px | 400 | 1.5 | 0 |
| Eyebrow / label (mono, uppercase) | 13px | 12px | 500 | 1.4 | 0.08em |
| Build Sheet rows (mono, sentence case) | 14px | 13px | 500 | 1.5 | 0 |
| Price numeral | 48px | 40px | 600 | 1 | -0.02em |
| Button | 16px | 16px | 600 | 1 | 0 |
| Nav links | 15px | 20px (in menu) | 500 | 1 | 0 |

Use `clamp()` between the desktop and phone values, for example h1 `clamp(40px, 6vw, 68px)`, h2 `clamp(30px, 4vw, 44px)`. Set `font-variant-numeric: tabular-nums` on prices and Build Sheet values. Headings are `--ink` on light and `--on-deep` on navy (do not color headings `--deep` on light; `--ink` is crisper). Measure: body copy max 64ch, ledes max 46ch.

The jump from body (17px) to h1 (68px) is 4x on purpose. The page should have one very large idea per screen and everything else at reading size.

## 5. Layout system

- **Content width**: `--max-width` 1200px, side padding 32px desktop, 20px at ≤ 640px. Text-only pages (privacy, blog posts) use a 720px column.
- **Grid**: 12 columns, 24px gap desktop; 16px gap phone. Breakpoints: 1080px (nav collapses), 900px (two-column layouts stack), 640px (phone type and spacing).
- **Section spacing**: 120px top and bottom desktop, 72px at ≤ 640px. Section head to content: 56px desktop, 32px phone.
- **Section head pattern** (`.section-head` in global.css): mono eyebrow, then h2, on the left (max 7 columns); an optional one-line link ("Full price list →") aligned to the baseline on the right. On phone the link drops below the h2, left-aligned.
- **Corners**: `--radius` 10px on cards, sheets and fields. Buttons, chips and the header phone are pills (`--radius-pill`). Nothing else is rounded.
- **Borders, not shadows**: 1px `--line` on light, 1px `--line-deep` on navy. No box shadows anywhere.
- **Rhythm**: three background levels, used so no two neighboring sections share a background:
  - navy `--deep` (hero, technology band, contact band; carries cyan),
  - off-white `--bg` (default),
  - white `--paper` (alternating sections and all cards).
  The footer is `--night`, one step darker than the contact band above it, so the page ends with a visible step.
  Vary the internal shape too: a full-width list (services), a four-step line (process), a two-column split (technology, FAQ), a single large statement (ownership), an asymmetric grid (testimonials). Never two card grids in a row.
- **Motion**: only two things move. Buttons and service rows change color over 150ms on hover. The hero Build Sheet rows fade in once on load (see section 6). All of it is off under `prefers-reduced-motion`.

**Buttons** (in global.css; keep the `.btn` and `.btn-solid` class names, the core LeadForm uses them):
- `.btn`: inline-flex, min-height 48px, padding 14px 24px, pill radius, 16px 600, gap 8px, `border: 1.5px solid transparent`.
- `.btn-solid`: background `--accent`, color `--deep`, border `--accent`. Hover: background `--accent-hover`. This is the main call to action everywhere, on light and on navy, and it is the lead form's submit button.
- `.btn-line`: transparent, color `--deep`, border `--deep`. Hover: background `--deep`, color `--on-deep`. For secondary actions on light.
- `.btn-line-light` (new): transparent, color `--on-deep`, border `rgba(255,255,255,0.45)`. Hover: border `--accent`, color `--accent`. For secondary actions on navy.
- Text links in body copy: `--accent-2`, underline 1px, offset 3px. On navy: `--accent`.

## 6. Home page, section by section

### 6.0 Header (every page)
- Sticky, height 72px (64px phone), background `--deep`, 1px `--line-deep` bottom border. It sits directly on the navy hero, so header and hero read as one block.
- Left: `Wordmark` ("Optimize" in `--on-deep`, "Long Island" in `--accent`, Instrument Sans 600 19px, -0.01em). Below 480px the wordmark sets on two lines at 15px ("Optimize" / "Long Island") so the phone number fits.
- Center/right (≥ 1080px): Web Design, SEO, Google Ads, Social Ads, Pricing, About; 15px 500 `--on-deep`, 28px apart; current page gets a 2px `--accent` underline 6px below the text. Links: `/services/long-island-web-design-company/`, `/services/seo/`, `/services/ppc/`, `/services/social-media/`, `/pricing/`, `/about/`.
- Far right: the phone `(631) 517-0607` as a `tel:` link in JetBrains Mono 500 15px `--accent`, then a small `.btn .btn-solid` "Contact" (padding 10px 18px, min-height 40px) to `/contact/`.
- 640 to 1079px: nav links move into the menu; phone and Contact stay visible, then the menu button.
- Below 640px: wordmark (two lines below 480px), phone as a pill (1.5px `--accent` border, mono 14px `--accent`, padding 8px 12px), and the menu button (40px, three 2px `--on-deep` bars). The Contact button moves into the menu. At 390px this fits: about 95px wordmark, 140px phone pill, 40px button.
- Menu panel: full width below the header, background `--deep-2`, links 20px 500 with 1px `--line-deep` dividers, then a full-width `.btn-solid` "Get my free analysis" to `/contact/`.
- Blog is not in the main nav (the brief's navigation does not list it); it is linked in the footer.

### 6.1 Hero (navy, the first five seconds)
Purpose: say the price, the speed and the human check before anything else, and offer the form and the phone.

- Background `--deep` with one quiet texture: a 56px square grid of 1px lines at `rgba(255,255,255,0.05)`, faded out toward the bottom with `mask-image: linear-gradient(to bottom, #000 40%, transparent)`. Pure CSS, no image. This is the drafting table the Build Sheet sits on. Use it in the home hero only.
- Padding: 96px top, 0 bottom (the facts strip closes the hero). Phone: 40px top.
- Desktop grid: text in columns 1 to 7, Build Sheet in columns 8 to 12, vertically centered.
- Left column, in order:
  1. Eyebrow (mono, `--on-deep-muted`): "Long Island web design and SEO"
  2. h1 (68px, `--on-deep`), with the price in `--accent`. Suggested: "Custom websites for **$1,000**. Built with AI, checked by people." (three lines at desktop, four at 390px).
  3. Lede (20px, `--on-deep-muted`, max 46ch). Suggested: "AI does the heavy lifting on a modern stack. An experienced person directs it and checks every page before it goes live. Typically live within 7 business days of receiving your content. You own all of it."
  4. Actions, 16px gap: `.btn-solid` "Get my free analysis" (to `#contact`), `.btn-line-light` "See pricing" (to `/pricing/`).
  5. Under the buttons, 14px `--on-deep-muted`: "Or call " + phone link in `--accent`.
- Right column: the **Build Sheet** for the Launch Website (component spec in section 8), on `--paper`. Contents, label then value:
  - header row: "BUILD SHEET" left, "LAUNCH WEBSITE" right (mono 12px `--muted`, uppercase)
  - Pages: up to 5
  - Design: custom, made for your business
  - Built with: Claude and Astro
  - Every change: saved on GitHub
  - Hosting: Vercel global network
  - Typical time to live: 7 business days
  - You own it: site, content, domain
  - final row, highlighted with `--accent-soft` background: the check stamp + "Checked by a person"
  - footer: price "$1,000" (48px) + "one time" (mono 13px `--muted`), and a link "What's included →" to `/pricing/#websites` in `--accent-2`.
- Load motion (CSS only): each sheet row goes from `opacity: 0; translateY(4px)` to visible, 240ms each, staggered 70ms, starting at 200ms; the stamp row last, with the stamp scaling from 0.85 to 1. The h1 and buttons never animate (they are the LCP and must paint at once). Under reduced motion everything is simply visible.
- Facts strip, at the bottom of the hero inside the wrap: a 4-column row separated by 1px `--line-deep` lines, top border `--line-deep`, 28px padding. Each item: a 16px check stamp + mono 13px `--on-deep-muted`: "Fixed public prices", "Checked by a person", "You own everything", "No WordPress, no plugins". These are all stated in the brief; add nothing else here.
- Phone (≤ 900px): one column. Eyebrow, h1, lede, buttons (full width, stacked, solid first), call line, then the Build Sheet full width with 40px above it, then the facts strip as a 2 by 2 grid (12px mono, items may wrap to two lines). At 390px the h1 and the first button are above the fold on an 844px-tall screen.

### 6.2 Services with starting prices (`--bg`)
Purpose: four services, a price on each, one tap to the right page.
- Section head: eyebrow "Services", h2 "Four services. Prices up front." Right link: "Full price list →" to `/pricing/`.
- Not cards: a ruled list of four full-width rows (`ServiceList`). Each row is one link. 1px `--line` top border on each row, bottom border on the last. Row padding 32px 0.
- Desktop row grid: mono step number "01" to "04" (1 col, `--muted`) | service name as h3 at 28px (4 cols) | one-sentence description 16px `--muted` (4 cols) | price block, right-aligned (2 cols) | arrow "→" 20px (1 col).
- Price block: a mono 12px uppercase `--muted` prefix ("From" where the brief has more than one tier), the price at 28px 600 `--ink`, the unit in mono 13px `--muted` below:
  - Web design: From $1,000, "one time"
  - SEO: From $750, "a month"
  - Google Ads: $500, "a month + $500 setup"
  - Social media ads: $500, "a month + $500 setup"
- Descriptions from the brief's service list (for example SEO: "Local search optimization, including Google Maps and AI search visibility.").
- Hover: row background `--paper`, a 3px `--accent` bar on the row's left edge, arrow moves 4px right.
- Phone: each row stacks. Line 1: number and name (22px). Line 2: description. Line 3: price block left-aligned, arrow pushed right. Row padding 24px 0.

### 6.3 How a site gets built (`--paper`)
Purpose: make "AI plus a person" concrete in four steps.
- Section head: eyebrow "How it works", h2 "From questionnaire to live site in four steps."
- Steps, from the brief: 1 Questionnaire (you answer a short questionnaire and send your logo and photos), 2 AI design and build, 3 Human review (a person checks every page before it goes live), 4 Launch (typically within 7 business days of receiving your content).
- Desktop: four columns joined by a 1px `--line` horizontal line running through the centers of the step markers. Marker: 44px circle, 1px `--line` border, `--paper` fill, mono 14px "01" to "04". Step 3's marker is the cyan check stamp at the same 44px size instead of a number, so the human check is the one marked step. Below each marker: h3 (20px) and 15px `--muted` text, max 28ch.
- Phone: a vertical list. Markers in a 44px left column joined by a 1px vertical line; title and text to the right. 28px between steps.
- Link under the steps: "More about how we build websites →" to the web design page.

### 6.4 The technology, as proof (`--deep`)
Purpose: state plainly what the site is built with and why that matters to the owner.
- Two columns at desktop (5 and 7).
- Left: eyebrow "How it is built" (`--on-deep-muted`), h2 "No WordPress. No plugins. Nothing to break." (`--on-deep`), then three short paragraphs at 17px `--on-deep-muted`, each starting with a bold `--on-deep` word: **Fast.** Astro ships lightweight pages. **Secure.** No plugins to break or get hacked. **Reversible.** Every change is saved on GitHub and can be rolled back.
- Right: the **Stack Sheet**, a Build Sheet in its dark variant (`--deep-2` surface, 1px `--line-deep` border, labels `--on-deep-muted`, values `--on-deep`, leaders `--line-deep`):
  - Design and build: Claude, an AI model made by Anthropic
  - Framework: Astro
  - Code: stored and versioned on GitHub
  - Hosting: Vercel global network
  - WordPress: none
  - Plugins: none
  - Page builder: none
  - final row: check stamp + "Checked by a person before launch"
- Under the sheet, 13px `--on-deep-muted`: "Optimize Long Island is not affiliated with or endorsed by these companies." Names in text only. No logos.
- Phone: left column first, sheet below, full width. Long values wrap under their label (see the Build Sheet rules in section 8).

### 6.5 You own everything (`--bg`)
Purpose: remove the lock-in fear in one look.
- One large statement, left-aligned, columns 1 to 9: h2 set at 56px desktop / 34px phone: "Your site. Your content. Your domain." Below it, 20px `--muted`: "If you leave, you take everything with you."
- Then a row of three ruled items (top border 1px `--line`, 24px padding top), each a mono 13px label "THE SITE", "THE CONTENT", "THE DOMAIN" with a 20px check stamp and the word "Yours" at 22px 600. Phone: the three items stack, each a single line (label left, "Yours" + stamp right).
- No illustration. This section is deliberately type only and the most spacious on the page.

### 6.6 Testimonials (`--paper`)
Purpose: real words from real clients. Plain quotes, no stars (section 9).
- Section head: eyebrow "Clients", h2 "What clients say."
- Desktop asymmetric grid: quote 1 (Solar Solutions) in columns 1 to 7 at 26px 500 `--ink`, line height 1.4; quotes 2 (A&R Party Tent Rentals) and 3 (Stephen Bono, Above All) stacked in columns 8 to 12 at 18px 400. Each quote has a 3px `--accent` left rule and 24px left padding. No quotation mark graphics. Attribution under each: name or role at 15px 600 `--ink` ("Owner" / "Stephen Bono, Owner"), company at 15px `--muted`.
- Phone: one column, quote 1 at 21px, others at 17px, 40px between.

### 6.7 FAQ (`--bg`)
- Two columns at desktop: left (4 cols, sticky at `top: calc(var(--header-h) + 32px)`): eyebrow "Questions", h2 "Straight answers.", a line "More on the pricing page →" and the phone link. Right (8 cols): the accordion.
- Home items (5): How can a custom website cost $1,000? / Is it a template? / How long does it take? / Do I own my website? / What if I need changes later? Answers from the brief, each under 50 words, direct answer first.
- Phone: one column, head above the list.

### 6.8 Lead form (`--deep`)
Described in section 8 under ContactSection. Heading suggestion: "Get a free analysis." Sub: "Every plan starts with one. Tell us about your business and what you need." Button label "Get my free analysis" (from the brief).

### 6.9 Footer (`--night`)
- Top row, 4 columns at desktop: (1) Wordmark, one line "Websites, SEO and ads for Long Island businesses.", "West Islip, NY 11795", phone (mono, `--accent`), email; (2) Services: Web Design, SEO, Google Ads, Social Ads, All services (`/services/`), Pricing; (3) Company: About, Blog, Contact, SEO in West Islip (`/west-islip-ny-seo-company/`), Privacy; (4) Follow: Facebook, Instagram, Google Business Profile as text links (no icons of those companies).
- Bottom row, 13px `--on-deep-muted`, 1px `--line-deep` top border: "© {year} Optimize Long Island" left; right: "This site was designed and built with Claude on Astro and checked by a person, the same way we build yours." (This is true of this build; keep it.)
- 900px: 2 by 2 columns. 640px: one column, 32px between groups.

## 7. Inner pages

### 7.1 Inner page head (all inner pages): `PageHead`
- Background `--deep`, flush under the header, padding 56px top / 72px bottom (phone 32 / 48). No grid texture.
- Breadcrumbs first (13px, `--on-deep-muted`, current page `--on-deep`), then mono eyebrow, h1 (52px), lede (20px `--on-deep-muted`, max 46ch), then actions: `.btn-solid` "Get my free analysis" to `#contact` and the call link.
- Optional right column (columns 8 to 12) for a compact Build Sheet. Without it, text spans columns 1 to 8.
- Phone: one column; the compact sheet goes below the actions.

### 7.2 Service page pattern (web design, SEO, Google Ads, Social Ads)
Same skeleton for all four, in this order. Sections marked "web design only" are skipped on the others; do not invent content to fill them.

1. **PageHead** with the service's price summary in the compact Build Sheet on the right:
   - Web design: Launch Website sheet as in the hero, ending in the stamp and "$1,000 one time".
   - SEO: Local SEO: Google Business Profile: optimized, weekly posts / Listings: cleaned up, kept consistent / Content: 2 pieces a month / Report: monthly; footer "From $750 a month".
   - Google Ads: Setup: $500 one time / Management: $500 a month / Covers ad budgets: up to $3,000 a month / Above that: 15% of ad spend / Ad spend: paid directly to Google; footer "$500 a month + $500 setup".
   - Social ads: the same rows with "paid directly to Meta" and "New ad creative: every month".
   Eyebrow carries the search phrase (for example "Google Ads management, Long Island"); h1 is the plain service name plus the benefit.
2. **Packages and prices** (`--bg`): the PriceGroup for that service (same component as the pricing page, section 7.3). Web design shows Launch, Growth and Custom; SEO shows its three plans; each ads page shows its fee sheet plus the bundle note "Google Ads and social ads together: $850 a month".
3. **What you provide / what is included** (`--paper`, web design only for "what you provide"): two columns. Left "What you provide" (questionnaire, logo, photos). Right "Not included in Launch" (copywriting from scratch, logo design, photography, e-commerce) in `--muted`, as a plain list. Phone: stacked.
4. **Process** (`--paper` or `--bg`, whichever differs from its neighbor): web design uses the four steps from 6.3, each with one more sentence. SEO and ads pages have no process in the brief: use a "What is included" ruled list made from that service's inclusions instead, same visual as 6.5's ruled items.
5. **Technology band** (`--deep`, web design only): reuse 6.4, with the "why it matters" paragraphs expanded (speed, security, no plugins).
6. **Care plans** (web design only): the Care PriceGroup (section 7.3).
7. **Ownership** (web design only): the 6.5 statement, smaller (h2 44px).
8. **One testimonial** (`--paper`): a single plain quote at 26px, as quote 1 in 6.6. SEO page: Solar Solutions (it is about SEO). Other pages: A&R Party Tent Rentals or Stephen Bono. Never repeat the same quote twice on one page.
9. **FAQ** (`--bg`): the brief's questions relevant to that service (web design: $1,000, template, timing, ownership, $50 a month, WordPress move, content, changes later, AI search; SEO: AI search, plus any of the general ones; ads: how much to spend on ads). Pass the same items to FAQ so the schema matches.
10. **Other services**: the ServiceList from 6.2 minus the current service, with heading "Other services".
11. **Lead form** (`--deep`), with `service` pre-described in the heading ("Get a free SEO analysis.").

### 7.3 Pricing page (`/pricing/`) and the price cards
This is the most important inner page after the home page. Every price in the brief appears here, readable at 390px without sideways scrolling.

**Page structure**
1. **PageHead**: eyebrow "Pricing", h1 suggested "Every price, up front.", lede "Fixed prices for websites. Monthly prices for care, SEO and ads. Every plan starts with a free analysis." No right-column sheet.
   Under the lede, a jump-link row of pill chips (mono 13px, 1px `rgba(255,255,255,0.45)` border, `--on-deep`, padding 8px 14px; hover border `--accent`): Websites, Care plans, SEO, Google Ads, Social ads. They wrap onto two lines at 390px; do not make them scroll sideways.
2. **Websites** (`#websites`, `--bg`): PriceGroup with three PriceSheets (Launch, Growth, Custom build). Below the cards, a two-column notes row (top border 1px `--line`, 32px padding): left "Extra pages: $150 each." and "What you provide for Launch: answers to a short questionnaire, your logo and your photos."; right "Not included in Launch: copywriting from scratch, logo design, photography, e-commerce." 15px, labels in 600 `--ink`, text `--muted`.
3. **Care plans** (`#care`, `--paper`): two PriceSheets (Care, Care Plus), centered as a pair (each 4 columns wide, columns 3 to 10). Above them, one line: "A care plan is required to host with us." Below: "Pay yearly and get two months free: $500 a year for Care."
4. **SEO** (`#seo`, `--bg`): three PriceSheets (Local SEO, Growth SEO, Multi-location or competitive markets).
5. **Ads management** (`#google-ads` and `#social-ads`, `--paper`): two fee sheets side by side (Google Ads, Social media ads), each 6 columns. Below them, a full-width bundle bar: `--accent-soft` background, 1px `--line` border, radius 10px, padding 20px 24px, text 17px `--ink`: "Google Ads and social ads together: **$850 a month**." Then 14px `--muted`: "Ad spend is paid directly to Google or Meta and is separate from the management fee."
6. **Pricing FAQ** (`--bg`): How can a custom website cost $1,000? / What does the $50 a month cover? / What if I need changes later? / How much should I spend on ads? / Can you move my WordPress site?
7. **Lead form** (`--deep`).

Contract terms (minimum term, cancellation) are an open question in the brief: leave them off the page entirely, do not write placeholder terms.

**PriceSheet (the price card), exact spec**
- Container: `--paper`, 1px `--line` border, radius 10px, padding 32px (phone 24px 20px), `display: flex; flex-direction: column; height: 100%`.
- The featured sheet in each group (Launch for websites, Care for care plans, Local SEO for SEO; i.e. the entry plan, which carries the headline price) gets a 4px `--accent` bar along its top edge (inner, clipped by the radius). No badge text such as "Most popular": the brief gives no data for that.
- Order inside the card:
  1. Mono 12px uppercase `--muted` kicker: the group name ("WEBSITE", "CARE PLAN", "SEO PLAN", "ADS MANAGEMENT").
  2. Plan name, h3 24px 600 `--ink`.
  3. Price row, 20px below: optional "From" in 15px `--muted` before the numeral; the numeral at 48px 600 `--ink`, tabular; the unit in mono 13px `--muted` on the same baseline ("one time", "a month", "quoted"). For "Custom build" and "Multi-location", the numeral is "$5,000" / "$2,500" after "From", and the unit is "quoted" / "a month, quoted after a free audit".
  4. 1px `--line` rule, 24px margin top and bottom.
  5. Spec rows (the Build Sheet row style, 2 to 4 rows max, only the countable facts): for example Launch: Pages: up to 5 / Revisions: 2 rounds / You own it: yes. Growth: Pages: up to 12 / Starter blog posts: 3 / Copywriting: included. Care: Edits: unlimited, within 1 business day / Report: monthly. Local SEO: Content: 2 pieces a month / Report: monthly. Leave out spec rows for Custom build.
  6. Inclusion list: 15px `--ink`, line height 1.5, 10px between items, each item led by an 18px check stamp. Where the brief says "Everything in X, plus:", show that as a mono 12px uppercase `--muted` line above the list ("EVERYTHING IN LAUNCH, PLUS") and list only the additions.
  7. CTA pinned to the bottom (`margin-top: auto`, 28px above it): full-width button. Featured sheet: `.btn-solid` "Get my free analysis". Others: `.btn-line`, same label; Custom build and Multi-location: `.btn-line` "Ask for a quote". All go to `#contact` on the same page.
- Fee sheets (ads) use the same container but replace the price row with two price lines stacked (Setup $500 one time / Management $500 a month), then spec rows (Covers ad budgets up to $3,000 a month; Above that: 15% of ad spend; Ad spend: paid directly to Google / Meta), then inclusions (Google Ads setup: account structure, conversion and call tracking, a landing page. Social: pixel and conversion tracking, audiences, first set of ads; new ad creative every month).

**How the price grids collapse**
- 3-card groups: 3 columns ≥ 1024px. 640 to 1023px: 2 columns, and the third card spans both columns, with its inclusion list set in 2 columns. Below 640px: 1 column, full width, in brief order (entry plan first), 16px gap.
- 2-card groups (care, ads): 2 columns ≥ 720px; 1 column below.
- At 390px: card inner width is 390 - 40 (page padding) - 40 (card padding) - 2 = 308px. The 40px numeral "$1,000" plus "one time" fits on one line; if a unit does not fit, it wraps below the numeral (flex-wrap). Spec rows follow the Build Sheet wrap rule. No table, no horizontal scroll, no hidden columns, and no "tap to see price".

### 7.4 Services overview (`/services/`)
PageHead (eyebrow "Services", h1 "What we do, and what it costs."), then the 6.2 ServiceList at a larger size, with the price block showing every tier in one line of mono 13px under the main price (for example web design: "Launch $1,000 · Growth $2,500 · Custom from $5,000"; use a middle dot, not a dash), then a short care plans row ("Care plans from $50 a month" with link to `/pricing/#care`), FAQ (3 general items), lead form.

### 7.5 About (`/about/`)
PageHead (eyebrow "About", h1 suggested "A Long Island agency that builds the new way."). Then: a two-column "Who does what" block on `--paper`: left column titled "AI does the heavy lifting" (design and build work), right column titled "People direct and check it" (direction, review before launch, ongoing care). Only phrasing drawn from the brief's positioning. Then facts as ruled rows (6.5 style): "Based in: West Islip, NY", "Serving: Long Island (Suffolk and Nassau) and clients across the United States", "Experience: more than 10 years in internet marketing and web design". Then the technology band (6.4), testimonials (6.6, all three), lead form. No team photos, no invented names or bios.

### 7.6 Contact (`/contact/`)
PageHead (eyebrow "Contact", h1 "Get a free analysis.", no buttons in the head since the form is right below). Then on `--bg`: two columns at desktop: left (5 cols) the direct routes, large: phone at 32px 600 as a `tel:` link, email at 20px `--accent-2`, "West Islip, NY 11795", "Serving Long Island and clients across the United States", and the social links as text. Right (7 cols) the form card. On phone the direct routes come first (they are short), then the form. This page uses the form card on `--bg`, not the navy band.

### 7.7 West Islip page (`/west-islip-ny-seo-company/`)
PageHead (eyebrow "West Islip, NY", h1 "SEO company in West Islip, NY."), a short 720px text column on `--bg`, the Local SEO PriceSheet alone (max 420px wide) with a link "All SEO plans →" to `/services/seo/`, one testimonial (Solar Solutions), lead form.

### 7.8 Blog index and posts
- Index: PageHead (eyebrow "Blog", h1 "Notes on websites and local search."). Posts as a text-only list, newest first, no images: each item is a full-width ruled row (like 6.2) with the date in mono 13px `--muted` ("September 20, 2022"), the title as h3 26px, the meta description in 16px `--muted`, and "Read →" in `--accent-2`. Phone: same, stacked. With only two posts this reads as a short, deliberate list, not an empty grid.
- If there are ever zero posts: keep the page head, and a single line "No posts yet." with a link to `/services/`; and the footer Blog link is removed.
- Post layout: no cover image. Make `coverImage` and `coverImageAlt` optional in `src/content.config.ts` and drop the image block from `BlogPostLayout`; `ogImage` falls back to the site default. Post head on `--bg` (not navy, so long reading starts calm): breadcrumbs, mono date and "Optimize Long Island", h1 at 44px / 30px phone, max 20ch. Body: 720px column, 18px / 17px phone, line height 1.7, h2 28px with 48px above, links `--accent-2` underlined. At the end, a CTA box on `--paper` with 1px `--line` and 10px radius: a sentence linking to the relevant service page and a `.btn-solid` "Get my free analysis" to `/contact/`. Then the footer. The full lead form is not required on posts; the CTA box is the route.

### 7.9 Privacy, thank-you, 404
Short PageHead, then the 720px text column on `--bg`. Privacy is `noindex`. Thank-you: h1 "Thanks. We got your message.", phone and links to `/pricing/` and the blog. 404: h1 "That page is not here.", links to Home, Services, Pricing, Contact.

## 8. Components

**Restyle (keep the file, change the look)**
- `Header.astro`: as in 6.0. Use `Wordmark`. Phone visible at every width.
- `Footer.astro`: as in 6.9. Read phone, email and profiles from `src/site.ts`.
- `Breadcrumbs.astro`: add a `tone` prop (`dark` for PageHead, `light` for blog posts). Separator "/" in `--muted` or `--on-deep-muted`.
- `FAQ.astro`: two-column layout from 6.7 with optional `eyebrow` and an aside slot. Question 18px 600 `--ink`, answer 16px `--muted`; the "+" becomes a 20px mono "+" in `--accent-2` rotating 45 degrees when open. Keep `<details>` and the FaqSchema call.
- `ContactSection.astro`: the form band. `tone` prop: `deep` (default; navy band with white form card) or `light` (contact page). Layout: intro in columns 1 to 5 (eyebrow "Free analysis", h2, sub, then phone at 28px mono `--accent` on navy and email), form card in columns 7 to 12. Card: `--paper`, 1px `--line`, radius 10px, padding 40px (phone 24px 20px). Set on the card: `--field-bg: #FFFFFF; --field-border: var(--field-border); --field-radius: 8px; --field-padding: 13px 14px; --label-size: 14px; --label-weight: 600; --form-gap: 18px;` and make the submit button full width (`.contact-card .btn { width: 100%; justify-content: center; }`). Pass the brief's extra fields: `service` (select, required: Web Design, SEO, Google Ads, Social Media Ads, Not sure yet) and `website` (text, optional, label "Your current website, if you have one"), `buttonLabel="Get my free analysis"`. Keep `id="contact"` and `scroll-margin-top: calc(var(--header-h) + 16px)`. Phone: intro above the card.
- `Process.astro`: as in 6.3, with a `checkStep` prop (index of the step that gets the stamp marker).
- `CTA.astro`: becomes the blog post CTA box (7.8): light, bordered, one sentence, one button and the phone.
- `Testimonial.astro`: becomes a plain quote figure with props `quote`, `name`, `company`, `size` (`large` or `regular`). `<figure>` with `<blockquote>` and `<figcaption>`. No stars, no schema.

**Replace**
- `Hero.astro`: replace with the home hero in 6.1 (eyebrow, h1 with a highlighted span, lede, two buttons, call line, Build Sheet slot, facts strip).
- `Services.astro`: replace with `ServiceList.astro` (the ruled price rows in 6.2), props: items with `number`, `name`, `description`, `pricePrefix`, `price`, `unit`, `href`, optional `tiers` line. Delete `Services.astro` once nothing imports it.

**Create**
- `Wordmark.astro`: the typed wordmark, props `tone` (`dark` bg or `light` bg) and `stack` (two lines). The one place the logo image goes later.
- `CheckStamp.astro`: the cyan check stamp, prop `size` (default 20). Inline SVG, `aria-hidden="true"` (the text beside it carries the meaning):
  `<svg viewBox="0 0 20 20" width={size} height={size}><circle cx="10" cy="10" r="10" fill="var(--accent)"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="var(--deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
- `BuildSheet.astro`: the distinctive element. Props: `title` and `subtitle` (header row), `rows` (array of `{ label, value }`), `checkLabel` (final stamped row), optional `price`, `unit`, `pricePrefix`, `link`; `tone` (`light`: `--paper` card on navy or light; `dark`: `--deep-2` card); `animate` (home hero only).
  - Card: radius 10px, 1px border (`--line` or `--line-deep`), padding 28px (phone 20px). Header row: mono 12px uppercase, title left, subtitle right, 1px rule below, 16px padding.
  - Rows: mono 14px (phone 13px), a flex row: label, a flexible dotted leader (`flex: 1; border-bottom: 1.5px dotted var(--line); margin: 0 8px; transform: translateY(-4px)`), value right-aligned in `--ink` (`--on-deep` in dark). Labels `--muted` (`--on-deep-muted`). 10px vertical padding per row.
  - **Wrap rule**: when label plus value do not fit, the row wraps (`flex-wrap: wrap`), the leader is hidden, and the value sits under the label, left-aligned. Test at 390px with "Design and build: Claude, an AI model made by Anthropic".
  - Check row: 12px padding, `--accent-soft` background in light tone (`rgba(0,175,239,0.12)` in dark tone), radius 6px, 20px stamp, text 14px mono `--ink` / `--on-deep`.
  - Price footer: 1px rule, then the price as in PriceSheet, and the optional link.
- `PriceSheet.astro`: the price card (7.3), built from the same row and stamp styles as BuildSheet so the two read as one family. Props: `kicker`, `name`, `pricePrefix`, `price`, `unit`, optional `fees` (for ads: two price lines), `specs` (rows), `plusLabel`, `items`, `featured`, `ctaLabel`, `ctaHref`.
- `PriceGroup.astro`: section wrapper for a group of PriceSheets: `id`, eyebrow, h2, optional intro line, the grid (collapse rules in 7.3), and a slot for notes below.
- `PageHead.astro`: 7.1.
- `OwnershipBlock.astro`: 6.5, with a `size` prop.
- `TechBand.astro`: 6.4, with an optional expanded copy slot for the web design page.

**Leave alone**
- `ReviewCard.astro`: keep the file but do not use it anywhere on this site (section 9).
- Everything in `src/core/`.

**global.css**: rewrite. Keep `.btn` and `.btn-solid`; add `.btn-line-light`, `.eyebrow` (mono label), `.section` (uses `--section-y`), `.section--deep`, `.section--paper`, `.section-head`, `.wrap` (uses `--gutter`), the phone overrides of `--gutter` (20px), `--section-y` (72px) and `--header-h` (64px) at ≤ 640px, link styles, focus ring rules (with the navy override inside `.section--deep`, header, PageHead and footer), and the reduced motion rule.

## 9. Reviews and testimonials

The brief gives three testimonials and no star ratings. All three are plain testimonials: the `Testimonial` component, no stars, no rating text, no review structured data, no Google badge. Do not use `ReviewCard` and do not pass `ratingValue` or `reviewCount` to `SiteLayout`. Attribution exactly as the brief: "Owner, Solar Solutions"; "Owner, A&R Party Tent Rentals"; "Stephen Bono, Owner, Above All". Quote text exactly as the brief (it contains no dashes).

## 10. Imagery

There are no photos, and none should be added: no stock, no generated people, no fake screenshots of client sites, no device mockups of invented work. The design carries itself with:
- type at large sizes,
- the Build Sheet and the check stamp,
- the hero's faint CSS grid,
- cyan rules and fills.

That is the full graphic vocabulary. No icon set: the only icons are the check stamp, the "→" arrow character, the menu bars and the FAQ "+".

Open Graph image: one site default, 1200 by 630 PNG made from type only: `--deep` background, the wordmark top left, and "Custom websites for $1,000." in white Instrument Sans 600 with "$1,000" in cyan. Put it in `public/` and use it for every page and both blog posts.

When the logo file arrives, it replaces the typed wordmark inside `Wordmark.astro` only. The header and footer are navy, so ask for a version of the logo that reads on dark.

## 11. Do not

1. **Do not reach for "AI" visuals.** No purple or violet gradients, glowing orbs, sparkle icons, robots, brains, circuit or particle backgrounds, glass blur cards or fake chat typing animations. The site shows AI-built work by being exact and fast, not by illustrating AI.
2. **Do not put cyan text on light backgrounds or white text on cyan.** Both are 2.5:1. Cyan text only on navy; navy text on cyan buttons; `--accent-2` for links on light.
3. **Do not invent or import proof.** No star rating, review count, counters, gauges, "results" numbers, speed scores, client logos, portfolio, badges, or logos of Anthropic, Astro, GitHub, Vercel, Google or Meta. Tech names appear as plain text with the non-affiliation line. No "guarantee".
4. **Do not let prices hide or break on a phone.** No "contact us for pricing", no comparison table that scrolls sideways, no price inside an accordion. Every PriceSheet must be fully readable at 390px; check the Build Sheet wrap rule on the longest rows.
