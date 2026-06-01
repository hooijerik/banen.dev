import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CATEGORIES, SENIORITY } from "@/lib/taxonomy";
import {
  getActiveCompanySlugs,
  getAllActiveJobSlugs,
  getFacets,
  getProvinceFacets,
} from "@/lib/queries";
import { GUIDES } from "@/lib/guides";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const u = (p: string) => `${base}${p}`;
  const items: MetadataRoute.Sitemap = [];

  const staticPaths = [
    "/",
    "/vacatures",
    "/vacatures/remote",
    "/bedrijven",
    "/tools",
    "/locaties",
    "/inzichten",
    "/inzichten/salarissen",
    "/werkgevers",
    "/plaats-vacature",
    "/vacature-alert",
  ];
  for (const p of staticPaths) items.push({ url: u(p), changeFrequency: "daily" });

  for (const c of CATEGORIES) items.push({ url: u(`/vacatures/categorie/${c.slug}`) });
  for (const s of SENIORITY) items.push({ url: u(`/vacatures/niveau/${s.slug}`) });
  for (const g of GUIDES) items.push({ url: u(`/inzichten/${g.slug}`) });

  try {
    const facets = getFacets();
    for (const city of facets.cities) items.push({ url: u(`/vacatures/locatie/${city.key}`) });
    for (const p of getProvinceFacets())
      items.push({ url: u(`/vacatures/locatie/${slugify(p.province)}`) });
    for (const t of facets.tools) items.push({ url: u(`/tools/${t.key}`) });
    for (const c of getActiveCompanySlugs()) items.push({ url: u(`/bedrijven/${c}`) });
    for (const j of getAllActiveJobSlugs())
      items.push({ url: u(`/vacature/${j.slug}`), lastModified: j.last_seen_at });
  } catch {
    /* DB may be empty at build time — static paths still emitted */
  }

  return items;
}
