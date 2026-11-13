# Design components

All under `src/design/components/`. Pages are built from these; do not invent new markup for a section a component already covers. Section components set their own spacing and background; alternate `tone="bg"` and `tone="paper"` down a page.

## Page frame
- **PageHead** `crumbs, eyebrow, title (the H1), lede?, cta? = true`; slot = extra content, slot `aside` = BuildSheet. Deep header block. Every page starts with it (except 404 and thank-you).
- **ContactSection** `heading?, subheading?, tone? 'deep'|'light', id?`. The lead form section. End every page with it (id `contact`, the hero button points to it).
- **Breadcrumbs**: used by PageHead and the blog layout. Do not add by hand.

## Long-form (new)
- **ProseSection** `heading, eyebrow?, id?, tone?`. Slot: plain `<p>`, `<ul>`, `<ol>`, `<h3>`, links. The standard question-led H2 section (heading left, body right on desktop, stacked on phone). 18px/1.7, 64ch lines. Also holds DefTable, StepList and Note.
- **DefTable** `items: {label, text, href?, linkText?}[]`. Ruled "label plus one or two sentences" rows. Put inside ProseSection.
- **StepList** `steps: {title, text}[]`. Numbered vertical method steps, any length. (Process is the 4-step horizontal strip.)
- **Note** `variant? 'note'|'limits', title?`. Boxed note; `limits` is the honest "what we do not do or measure" block. Slot takes `<p>`/`<ul>`.
- **RelatedLinks** `items: {href, title, text?}[], heading? = 'Related reading', eyebrow?, tone?`. Ruled link list to posts and pages. Place before ContactSection.

## Existing, reuse first
- **FAQ** `items {question, answer}[], heading?, eyebrow?, pricingLink?, tone?`. Also emits FAQPage data. Answers 40 to 70 words. Shared answers: `faq.*` in `../content.ts`.
- **QuoteBand** `quote, name, company, tone?`. One plain testimonial, no stars. Quotes in `testimonials` in `../content.ts`.
- **BuildSheet**, **PriceSheet**, **PriceGroup** (`more` prop adds service-page links), **PriceNote**, **CardPrice**, **BundleBar**, **IncludedList**, **OtherServices**, **ServiceList**, **Process**, **TechBand**, **OwnershipBlock**, **CTA** (blog box), **Testimonial**, **ReviewCard** (only with a supplied star rating; none exist), **Header**, **Footer**, **Wordmark**, **CheckStamp**, **Hero**.

## Shared data
`../content.ts`: `nav`, `services`, `faq`, `testimonials`, `buildSteps`, lead form fields. `../pricing.ts`: every price and its card price; never retype one.

## Blog posts
Frontmatter: `title, seoTitle (37 chars max), metaDescription, publishDate, tags, faq: [{question, answer}]` (optional; renders under the post with FAQPage data). CTA box follows the first of the tags AI Search, Google Ads, Social Ads, SEO, Web Design.
