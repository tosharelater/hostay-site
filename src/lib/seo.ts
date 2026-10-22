/**
 * Structured data (schema.org JSON-LD) shared by the home page and its text version:
 * the organisation, the website, and the FAQ.
 */
import { dict, META, type Locale } from '../i18n';
import { abs } from './paths';

export function jsonLd(locale: Locale): string {
  const t = dict(locale);
  const url = abs;
  const graph = [
    {
      '@type': 'Organization',
      '@id': url('/#org'),
      name: 'Hostay',
      url: url('/'),
      logo: url('/favicon.svg'),
      description: t.meta.description,
      areaServed: { '@type': 'Country', name: 'Morocco' }
    },
    {
      '@type': 'WebSite',
      '@id': url('/#site'),
      name: 'Hostay',
      url: url('/'),
      inLanguage: META[locale].lang,
      publisher: { '@id': url('/#org') }
    },
    {
      '@type': 'FAQPage',
      inLanguage: META[locale].lang,
      mainEntity: t.faq.items.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a }
      }))
    }
  ];
  // "<" is escaped so the JSON can never close the script tag it sits in.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
