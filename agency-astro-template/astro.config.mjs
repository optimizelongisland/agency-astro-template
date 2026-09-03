// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// IMPORTANT: set `site` to the client's real production domain before deploying.
// This powers the sitemap and canonical URLs.
export default defineConfig({
	site: 'https://example-client-domain.com',
	integrations: [sitemap()],

	// ---- REDIRECTS (critical on any WordPress migration) ----
	// Every old URL that has backlinks or ranks in Google needs a redirect to its
	// new equivalent, or that page's authority is lost when the old site comes down.
	// Pull the old URL list from Google Search Console (Pages report) or a crawl of
	// the live WP site before decommissioning it, then map every one below.
	//
	// Format: 'old-path': 'new-path'
	redirects: {
		// '/blog/2021/05/spring-lawn-tips': '/blog/spring-lawn-prep-tips',
		// '/services/sprinkler-repair-huntington-ny': '/huntington-sprinkler-repair',
		// '/?p=123': '/blog/spring-lawn-prep-tips',
	},
});
