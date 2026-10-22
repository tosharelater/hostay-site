# Hostay — site

Marketing site for Hostay (FR at `/`, EN at `/en`, plain-text versions at `/texte` and `/en/text`, `/llms.txt` for AI agents). Astro, static output.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

Environment (see `.env.example`): `PUBLIC_SITE_URL`, `PUBLIC_APP_URL`, `PUBLIC_NOTIFY_ENDPOINT`. `ASTRO_BASE` sets the base path when the site is served from a sub-path (GitHub Pages sets it to `/<repo>` in `.github/workflows/deploy.yml`).
