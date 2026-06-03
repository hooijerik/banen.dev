import { SITE } from "../site";
import { type Locale } from "./config";

/** Prefix an app path with the locale segment. "/" -> "/nl". */
export function localePath(locale: Locale, path: string): string {
  return path === "/" || path === "" ? `/${locale}` : `/${locale}${path}`;
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
