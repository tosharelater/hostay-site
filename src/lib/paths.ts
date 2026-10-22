/**
 * Paths under the site's base. On its own domain the base is "/"; on GitHub Pages it is the
 * repository name ("/hostay-site/"), set at build time with ASTRO_BASE.
 */
import { SITE } from '../data/site';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A root-relative path ("/en", "/favicon.svg") as a link under the base. */
export const href = (path: string): string => `${BASE}${path === '/' ? '/' : path}`;

/** The same path as an absolute URL, for canonical links, sitemaps and structured data. */
export const abs = (path: string): string => new URL(href(path), SITE.url).href;
