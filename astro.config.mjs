// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// The one place the canonical origin lives. Switching to
// punebookies.com later = change SITE_URL in Vercel env (or here).
const SITE_URL = process.env.SITE_URL || 'https://pune-bookies.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',          // everything prerendered…
  adapter: vercel(),         // …except routes that opt out (api/inquiry)
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'never',   // styles.css stays one cacheable file
  },
});
