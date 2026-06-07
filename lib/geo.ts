// City coordinates + distance helpers for the job-alert location/distance filter.
// City-centre coordinates for the major NL + Flemish cities (covers the vast majority of
// scraped jobs). Aliases map alternative spellings/slugs to the same place.
import { slugify } from "./format";

export interface GeoCity {
  slug: string;
  label: string;
  lat: number;
  lng: number;
}

const RAW: { label: string; lat: number; lng: number; aliases?: string[] }[] = [
  // ---- Netherlands ----
  { label: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { label: "Rotterdam", lat: 51.9244, lng: 4.4777 },
  { label: "Den Haag", lat: 52.0705, lng: 4.3007, aliases: ["the-hague", "s-gravenhage", "den-haag-zh"] },
  { label: "Utrecht", lat: 52.0907, lng: 5.1214 },
  { label: "Eindhoven", lat: 51.4416, lng: 5.4697 },
  { label: "Groningen", lat: 53.2194, lng: 6.5665 },
  { label: "Tilburg", lat: 51.5555, lng: 5.0913 },
  { label: "Almere", lat: 52.3508, lng: 5.2647 },
  { label: "Breda", lat: 51.5719, lng: 4.7683 },
  { label: "Nijmegen", lat: 51.8126, lng: 5.8372 },
  { label: "Apeldoorn", lat: 52.2112, lng: 5.9699 },
  { label: "Haarlem", lat: 52.3874, lng: 4.6462 },
  { label: "Arnhem", lat: 51.9851, lng: 5.8987 },
  { label: "Enschede", lat: 52.2215, lng: 6.8937 },
  { label: "Amersfoort", lat: 52.1561, lng: 5.3878 },
  { label: "Zaanstad", lat: 52.4389, lng: 4.8295, aliases: ["zaandam"] },
  { label: "'s-Hertogenbosch", lat: 51.6978, lng: 5.3037, aliases: ["den-bosch"] },
  { label: "Zwolle", lat: 52.5168, lng: 6.083 },
  { label: "Leiden", lat: 52.1601, lng: 4.497 },
  { label: "Maastricht", lat: 50.8514, lng: 5.691 },
  { label: "Dordrecht", lat: 51.8133, lng: 4.6901 },
  { label: "Ede", lat: 52.0402, lng: 5.6649 },
  { label: "Delft", lat: 52.0116, lng: 4.3571 },
  { label: "Venlo", lat: 51.3704, lng: 6.1724 },
  { label: "Deventer", lat: 52.2552, lng: 6.1639 },
  { label: "Helmond", lat: 51.4793, lng: 5.657 },
  { label: "Oss", lat: 51.7656, lng: 5.5187 },
  { label: "Amstelveen", lat: 52.3114, lng: 4.8701 },
  { label: "Hilversum", lat: 52.2292, lng: 5.1669 },
  { label: "Hoofddorp", lat: 52.3061, lng: 4.6907 },
  { label: "Gouda", lat: 52.0115, lng: 4.7104 },
  { label: "Hengelo", lat: 52.2659, lng: 6.793 },
  { label: "Zoetermeer", lat: 52.0575, lng: 4.4931 },
  { label: "Leeuwarden", lat: 53.2012, lng: 5.7999 },
  { label: "Assen", lat: 52.9925, lng: 6.5649 },
  { label: "Lelystad", lat: 52.5185, lng: 5.4714 },
  { label: "Roermond", lat: 51.1942, lng: 5.987 },
  { label: "Sittard", lat: 51.001, lng: 5.8694 },
  { label: "Heerlen", lat: 50.8882, lng: 5.9795 },
  { label: "Middelburg", lat: 51.4988, lng: 3.6136 },
  { label: "Almelo", lat: 52.3568, lng: 6.6626 },
  { label: "Emmen", lat: 52.785, lng: 6.8972 },
  { label: "Alkmaar", lat: 52.6324, lng: 4.7534 },
  { label: "Veenendaal", lat: 52.0286, lng: 5.5586 },
  { label: "Alphen aan den Rijn", lat: 52.1297, lng: 4.655 },
  // ---- Belgium (Flanders + Brussels) ----
  { label: "Antwerpen", lat: 51.2194, lng: 4.4025, aliases: ["antwerp"] },
  { label: "Gent", lat: 51.0543, lng: 3.7174, aliases: ["ghent"] },
  { label: "Brugge", lat: 51.2093, lng: 3.2247, aliases: ["bruges"] },
  { label: "Leuven", lat: 50.8798, lng: 4.7005 },
  { label: "Mechelen", lat: 51.0259, lng: 4.4776 },
  { label: "Hasselt", lat: 50.9307, lng: 5.3378 },
  { label: "Kortrijk", lat: 50.8279, lng: 3.2649 },
  { label: "Aalst", lat: 50.9378, lng: 4.0405 },
  { label: "Sint-Niklaas", lat: 51.165, lng: 4.1437 },
  { label: "Genk", lat: 50.965, lng: 5.5006 },
  { label: "Roeselare", lat: 50.9469, lng: 3.1228 },
  { label: "Brussel", lat: 50.8503, lng: 4.3517, aliases: ["brussels", "bruxelles"] },
  { label: "Vilvoorde", lat: 50.928, lng: 4.426 },
  { label: "Turnhout", lat: 51.3226, lng: 4.9447 },
  { label: "Oostende", lat: 51.2247, lng: 2.9214, aliases: ["ostend"] },
];

export const GEO_CITIES: GeoCity[] = RAW.map((c) => ({
  slug: slugify(c.label),
  label: c.label,
  lat: c.lat,
  lng: c.lng,
}));

/** Cities offered in the alert location dropdown, sorted by label. */
export const ALERT_CITIES: { slug: string; label: string }[] = [...GEO_CITIES]
  .map((c) => ({ slug: c.slug, label: c.label }))
  .sort((a, b) => a.label.localeCompare(b.label, "nl"));

/** Radius options (km) for the distance filter. */
export const ALERT_RADII = [10, 25, 50, 100] as const;

const BY_SLUG = new Map<string, GeoCity>();
for (const c of RAW) {
  const g: GeoCity = { slug: slugify(c.label), label: c.label, lat: c.lat, lng: c.lng };
  BY_SLUG.set(g.slug, g);
  for (const a of c.aliases ?? []) BY_SLUG.set(a, g);
}

/** Look up a place by slug (or alias). */
export function geoCity(slug: string | null | undefined): GeoCity | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

/** Look up coordinates from a free-text city name (slugified). */
export function geoForCityName(city: string | null | undefined): GeoCity | undefined {
  return city ? BY_SLUG.get(slugify(city)) : undefined;
}

/** Great-circle distance in kilometres. */
export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
