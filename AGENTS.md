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

## How this repository is organized

Two layers. Read `README.md` for the full map.

- **Locked foundation**: `src/core/`, `src/pages/api/`, `scripts/`, `tests/`. Identical on every client site. Never edit these on a client site; `npm run qc` fails if they change. If the core cannot do something, build it in the design layer and report the gap.
- **Open design layer**: `src/design/` and `src/pages/`. Fresh for every client.

Business details live only in `src/site.ts`. The client's approved brief and design direction are in `client/`; the brief is the only source of facts for site content.

## Quality checks and model routing

Keep AI cost down by using the cheapest thing that does the job:

1. `npm run qc` first, always. It builds the site and runs mechanical checks with no model. Run it after every change, and never spend model effort re-checking what it covers.
2. Routine content edits (text, phone, hours, prices, photo swaps, testimonials, FAQs): the `site-editor` agent (Haiku).
3. Site builds, new pages and new sections: the `site-builder` agent (Sonnet).
4. A new design or redesign: follow the `site-design` skill. It uses the `site-designer` agent (Opus) once for the direction, then `site-builder`.
5. The `site-qa` agent (Opus, read-only) once before a new site launches or a large change ships. Not for routine edits.

Content rules that apply to everyone: use only facts from `client/brief.md`, never invent ratings, licenses, awards or testimonials, and no em dashes in site copy.
