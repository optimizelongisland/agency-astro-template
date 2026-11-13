# Core: the locked foundation

Everything in this folder, plus `src/pages/api/`, `scripts/` and `tests/`, is
**identical on every client site**. It is the plumbing a visitor never sees:

| Part | What it does |
|---|---|
| `layouts/CoreLayout.astro` | Document head: SEO tags, structured data, analytics, skip link |
| `components/SEO.astro` | Title, description, canonical, Open Graph, LocalBusiness schema |
| `components/schema/*` | Structured data: site, service, FAQ, review, breadcrumb, blog post |
| `components/LeadForm.astro` | The lead form: fields, spam protection, sending |
| `components/Photo.astro`, `VideoEmbed.astro` | Optimized images; video with schema |
| `lib/leads.ts`, `src/pages/api/contact.ts` | Lead validation and delivery |

## Do not edit these files on a client site

They are locked so that a bug fix or improvement made once in the agency
template can be copied to every client site without conflicts. `npm run qc`
compares each file with `core.lock.json` and fails if any has been changed.

Everything visual belongs in `src/design/`, which is free to change completely.
Core components take their look from the design tokens in
`src/design/tokens.css` and expose props and CSS variables for the rest (see
the comment at the top of each component).

If the core cannot do something a client needs, do not patch it here. Build the
feature in `src/design/` or `src/pages/`, and raise the gap so the core can be
improved in the template for everyone.

## Updating the core (agency template repo only)

1. Change the core in the template repo, with tests.
2. `npm run core:lock` to re-record `core.lock.json` and bump `CORE_VERSION` in
   `scripts/core-lock.mjs`.
3. Copy the locked folders and `core.lock.json` to each client repo.
