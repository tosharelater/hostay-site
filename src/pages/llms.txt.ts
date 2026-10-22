/**
 * /llms.txt: a short, plain description of Hostay for AI agents, pointing to the text versions
 * of the site (https://llmstxt.org). Built from the same copy as the pages.
 */
import type { APIRoute } from 'astro';
import { abs } from '../lib/paths';
import { dict, META } from '../i18n';
import { SITE } from '../data/site';

export const GET: APIRoute = () => {
  const fr = dict('fr');
  const en = dict('en');
  const url = abs;
  const body = `# Hostay

> ${en.meta.description}

${en.faq.items[0]?.a ?? ''}

Hostay is built in Morocco, for Moroccan short-stay rentals, from Tangier to Agadir. It is coming soon.

## Content

- [Text version (English)](${url(META.en.text)}): the whole home page as plain text, including features and FAQ.
- [Version texte (français)](${url(META.fr.text)}): ${fr.text.intro}

## Features

${en.modules.items.map((m) => `- ${m.title}: ${m.body}`).join('\n')}

## Optional

- [Home page (English)](${url(META.en.home)})
- [Page d'accueil (français)](${url(META.fr.home)})
- [Sign in](${SITE.appUrl})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
