/**
 * Standalone marketing pages + shared site nav.
 */
import { dict, META, type Locale } from '../i18n';
import { href } from './paths';

export const PAGE_IDS = ['product', 'about', 'how', 'morocco', 'faq'] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const PAGE_PATHS: Record<PageId, Record<Locale, string>> = {
  product: { fr: '/produit', en: '/en/product' },
  about: { fr: '/qui-sommes-nous', en: '/en/about' },
  how: { fr: '/comment-ca-marche', en: '/en/how' },
  morocco: { fr: '/maroc', en: '/en/morocco' },
  faq: { fr: '/faq', en: '/en/faq' }
};

export const pagePath = (page: PageId, locale: Locale): string => PAGE_PATHS[page][locale];

export const pageLocaleHrefs = (page: PageId): Record<Locale, string> => ({
  fr: href(PAGE_PATHS[page].fr),
  en: href(PAGE_PATHS[page].en)
});

export type NavLink = { href: string; label: string };

export function siteNav(locale: Locale): NavLink[] {
  const t = dict(locale);
  return [
    { href: href(PAGE_PATHS.product[locale]), label: t.nav.modules },
    { href: href(PAGE_PATHS.how[locale]), label: t.nav.how },
    { href: href(PAGE_PATHS.about[locale]), label: t.nav.who },
    { href: href(PAGE_PATHS.morocco[locale]), label: t.nav.morocco },
    { href: href(PAGE_PATHS.faq[locale]), label: t.nav.faq }
  ];
}

export function siteFooterNav(locale: Locale): NavLink[] {
  const t = dict(locale);
  const home = href(META[locale].home);
  const notifyHref = home === '/' || home === '' ? '/#notify' : `${home.replace(/\/$/, '')}#notify`;
  return [
    { href: home, label: t.nav.home },
    ...siteNav(locale),
    { href: notifyHref, label: t.nav.notify }
  ];
}

export const pageNav = siteNav;
export const pageFooterNav = siteFooterNav;

export function pageTitle(page: PageId, locale: Locale): string {
  const p = dict(locale).pages[page];
  return `${p.title} · Hostay`;
}

export function pageDescription(page: PageId, locale: Locale): string {
  return dict(locale).pages[page].lead;
}

export function pathMatches(linkHref: string, currentPath: string | undefined): boolean {
  if (!currentPath) return false;
  const norm = (p: string) => {
    try {
      const u = p.startsWith('http') ? new URL(p) : new URL(p, 'https://example.local');
      return u.pathname.replace(/\/$/, '') || '/';
    } catch {
      return p.replace(/\/$/, '') || '/';
    }
  };
  return norm(linkHref) === norm(currentPath);
}
