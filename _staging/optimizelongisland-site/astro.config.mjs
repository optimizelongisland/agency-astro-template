// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// IMPORTANT: set `site` to the client's real production domain before deploying.
// This powers the sitemap and canonical URLs.
export default defineConfig({
	site: 'https://optimizelongisland.com',
	// Utility pages stay out of the sitemap (they are also marked noindex).
	integrations: [sitemap({ filter: (page) => !page.includes('/thank-you') })],

	// Every page is still pre-built static HTML. The adapter exists only so the
	// contact form endpoint (src/pages/api/contact.ts) can run as a Vercel function.
	adapter: vercel(),

	// Contact form settings. All optional so the site builds before keys exist;
	// set the real values in Vercel > Project > Settings > Environment Variables.
	// See .env.example for what each one is.
	env: {
		schema: {
			RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
			LEAD_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
			LEAD_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
			LEAD_WEBHOOK_URLS: envField.string({ context: 'server', access: 'secret', optional: true }),
			TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
		},
	},

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
