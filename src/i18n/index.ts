import fr from './fr.json';
import en from './en.json';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const META: Record<Locale, { lang: string; og: string; home: string; text: string; label: string }> = {
  fr: { lang: 'fr', og: 'fr_FR', home: '/', text: '/texte', label: 'FR' },
  en: { lang: 'en', og: 'en_US', home: '/en', text: '/en/text', label: 'EN' }
};

export type Dict = typeof fr;
// en.json must have exactly fr.json's shape: a missing key fails `astro check` (and the build).
const enDict: Dict = en;
const DICTS: Record<Locale, Dict> = { fr, en: enDict };

/** The whole dictionary for a locale. */
export const dict = (locale: Locale): Dict => DICTS[locale];

/** Replace {name} placeholders. */
export const fill = (s: string, vars: Record<string, string | number>): string => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
