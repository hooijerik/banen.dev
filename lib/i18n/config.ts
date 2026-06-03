// Locale configuration shared across server + client. Dutch is the default.
export const LOCALES = ["nl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "nl";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(x: string | undefined | null): x is Locale {
  return x === "nl" || x === "en";
}

/** OpenGraph locale tag for a given UI locale. */
export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "nl_NL";
}
