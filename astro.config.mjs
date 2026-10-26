// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = (process.env.PUBLIC_SITE_URL || 'https://hostayapp.com').replace(/\/$/, '');

// On GitHub Pages the site lives under the repository name, e.g. ASTRO_BASE=/hostay-site
const base = process.env.ASTRO_BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore', // GitHub Pages serves /faq/ while links use /faq: accept both
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [sitemap()],
  vite: { build: { assetsInlineLimit: 0 } }
});
