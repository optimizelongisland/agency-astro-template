---
name: site-design
description: Design and build a fresh, custom look for this client site from two or three reference sites the user likes plus the client's brief and brand. Use when asked to design a new client site, redesign one, or "make it look like" given example sites. Produces a written design direction, then the built site, checked against screenshots.
---

# Fresh site design from reference sites

Every client gets their own design. The locked foundation (`src/core/`, the form endpoint, the QC scripts) stays identical on every site; everything a visitor sees lives in `src/design/` and `src/pages/` and is yours to redesign completely. The design that ships in the template is a neutral scaffold, not a look to preserve.

References are for direction, not duplication. Take what makes them work (rhythm, type pairing, how color is rationed, how sections are composed) and build something that belongs to this client. Never copy a reference's layout section for section, and never take its images, logo, icons, illustrations or wording.

## What you need before starting

1. `client/brief.md`: the approved content brief. If it is missing or unapproved, stop and say so. Design without real content produces a site shaped around placeholder text.
2. Two or three reference URLs, ideally with a word on what the user likes about each.
3. The client's brand assets if they exist (logo, colors, photos), under `src/assets/`.

## Steps

Each step names who does it. Models are assigned by cost: scripts are free, the direction is a one-time judgment call worth a strong model, the build is volume work.

### 1. Capture the references (script, no model)

```
npm run shots -- --out .design-refs <url> <url> <url>
```

This saves desktop and phone screenshots plus a JSON file of measured facts per site (fonts, sizes, colors, button shape). `.design-refs/` is gitignored because it holds third-party material.

If the script reports that the network blocks a site, capture it with whatever web tool is available instead (a scrape tool that returns a screenshot and brand colors and fonts works well) and save the results into `.design-refs/`. If nothing can reach it, ask the user for screenshots. Do not design from memory of what a site probably looks like.

### 2. Write the design direction (`site-designer` agent, Opus)

Delegate to the `site-designer` agent. Give it the reference URLs, what the user said they like about each, and the path to the brief. It writes `client/design-direction.md`.

Read the result. It should name a concept specific to this client, give exact token values, and describe the home page section by section. If it reads like it could describe any business, send it back once with that feedback.

### 3. Build it (`site-builder` agent, Sonnet)

Delegate to the `site-builder` agent with the brief and the direction. It replaces the scaffold design with the new one and fills in the content.

### 4. Check it mechanically (scripts, no model)

```
npm run qc
npm test
```

`qc` covers placeholder text, titles, links, alt text, color contrast and whether the locked core was touched. Fix failures by sending them back to `site-builder`.

### 5. Look at it (you)

```
astro dev --background
npm run shots -- --out .design-refs/build http://localhost:4321/ http://localhost:4321/<one-inner-page>/
astro dev stop
```

View the desktop and phone screenshots. Compare the measured JSON with the direction's tokens: wrong fonts or colors show up there immediately. Check that the page reads as the direction describes, that nothing overlaps or overflows on the phone, and that it does not look like a copy of any one reference. Send concrete fixes back to `site-builder`. Two rounds is normally enough; if it still misses after that, tell the user what is off rather than looping.

### 6. Pre-launch review (`site-qa` agent, Opus)

Once, before the site goes live. It is read-only and independent.

## Hard limits

- Fonts must be free to use commercially (Google Fonts or another open license). If a reference uses a paid typeface, pick the closest open one and say so in the direction.
- At most two font families and four weights in total. Fonts are the most common cause of a slow first load.
- No carousels, autoplaying sound, scroll-jacking, or JavaScript UI frameworks. These sites win on speed.
- Every page keeps a visible phone number in the header, a call to action above the fold, and a route to the lead form.
- Trust signals (years in business, ratings, licenses, awards) appear only if the brief states them.
