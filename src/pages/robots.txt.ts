import type { APIRoute } from 'astro';
import { abs as url } from '../lib/paths';


export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\n# Plain-text overview for AI agents: ${url('/llms.txt')}\nSitemap: ${url('/sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
