import { SITE } from "../site";
import { type Locale } from "./config";

/** Localize an app path: Dutch at the root (no prefix), English under /en. */
export function localePath(locale: Locale, path: string): string {
  const p = path === "" ? "/" : path;
  if (locale === "en") return p === "/" ? "/en" : `/en${p}`;
  return p;
}

/**
 * Canonical + hreflang alternates for a page, given the un-prefixed app path
 * (e.g. "/vacatures/categorie/sales"). Use in `generateMetadata`.
 */
export function alternates(locale: Locale, path: string) {
  const url = (l: Locale) => `${SITE.url}${localePath(l, path)}`;
  return {
    canonical: url(locale),
    languages: {
      "nl-NL": url("nl"),
      "en-US": url("en"),
      "x-default": url("nl"),
    },
  };
}
