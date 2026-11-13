## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Quality checks and model routing

Keep AI cost down by using the cheapest thing that does the job:

1. `npm run qc` first, always. It builds the site and runs mechanical checks with no model. Run it after every change, and never spend model effort re-checking what it covers.
2. Delegate routine content edits (text, phone, hours, prices, photo swaps, testimonials, FAQs) to the `site-editor` agent (Haiku).
3. Delegate site builds, new pages and new sections to the `site-builder` agent (Sonnet).
4. Run the `site-qa` agent (Opus, read-only) once before a new site launches or a large change ships. Not for routine edits.

Do not edit files under `src/components/`, `src/lib/` or `src/pages/api/` for a single client. They are shared across every client site.
