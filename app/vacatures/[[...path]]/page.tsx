import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JobCard } from "@/components/JobCard";
import { FilterSidebar, type ActiveParams } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import {
  countJobs,
  getFacets,
  listJobs,
  provinceFromSlug,
  salaryBand,
  type Facets,
  type JobFilters,
  type SortKey,
} from "@/lib/queries";
import { CATEGORY_BY_SLUG, SENIORITY_BY_SLUG } from "@/lib/taxonomy";
import { formatSalaryRange, titleCase, pluralNL } from "@/lib/format";
import { buildVacaturesUrl, PARAMS } from "@/lib/urls";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;
const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Nieuwste" },
  { key: "salary", label: "Salaris" },
  { key: "company", label: "Bedrijf" },
];

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

type Resolved = {
  filter: JobFilters;
  heading: string;
  intro?: string;
  crumbs: Crumb[];
  canonical: string;
};

function resolvePath(path: string[] | undefined, facets: Facets): Resolved {
  const home: Crumb = { label: "Home", href: "/" };
  const vac: Crumb = { label: "Vacatures", href: "/vacatures" };

  if (!path || path.length === 0) {
    return {
      filter: {},
      heading: "Alle GTM-vacatures",
      intro: "Bekijk alle go-to-market vacatures in Nederland.",
      crumbs: [home, { label: "Vacatures" }],
      canonical: "/vacatures",
    };
  }
  const [seg, val] = path;

  if (seg === "remote" && path.length === 1) {
    return {
      filter: { workMode: "remote" },
      heading: "Remote GTM-vacatures",
      intro: "Go-to-market rollen die je volledig op afstand kunt doen.",
      crumbs: [home, vac, { label: "Remote" }],
      canonical: "/vacatures/remote",
    };
  }
  if (seg === "categorie" && val) {
    const c = CATEGORY_BY_SLUG.get(val as never);
    if (!c) notFound();
    return {
      filter: { category: val },
      heading: `${c.label}-vacatures`,
      intro: c.description,
      crumbs: [home, vac, { label: c.label }],
      canonical: `/vacatures/categorie/${val}`,
    };
  }
  if (seg === "niveau" && val) {
    const s = SENIORITY_BY_SLUG.get(val as never);
    if (!s) notFound();
    return {
      filter: { seniority: val },
      heading: `${s.label} GTM-vacatures`,
      crumbs: [home, vac, { label: s.label }],
      canonical: `/vacatures/niveau/${val}`,
    };
  }
  if (seg === "locatie" && val) {
    const province = provinceFromSlug(val);
    if (province) {
      return {
        filter: { province },
        heading: `GTM-vacatures in ${province}`,
        crumbs: [home, vac, { label: province }],
        canonical: `/vacatures/locatie/${val}`,
      };
    }
    const cityLabel = facets.cities.find((c) => c.key === val)?.label || titleCase(val.replace(/-/g, " "));
    return {
      filter: { city: val },
      heading: `GTM-vacatures in ${cityLabel}`,
      crumbs: [home, vac, { label: cityLabel }],
      canonical: `/vacatures/locatie/${val}`,
    };
  }
  notFound();
}

function filtersFromQuery(sp: Record<string, string | string[] | undefined>): JobFilters {
  const f: JobFilters = {};
  const cat = str(sp[PARAMS.category]);
  if (cat) f.category = cat;
  const sen = str(sp[PARAMS.seniority]);
  if (sen) f.seniority = sen;
  const wm = str(sp[PARAMS.workMode]);
  if (wm) f.workMode = wm;
  const city = str(sp[PARAMS.city]);
  if (city) f.city = city;
  const tool = str(sp[PARAMS.tool]);
  if (tool) f.tool = tool;
  const sal = Number(str(sp[PARAMS.salary]));
  if (sal > 0) f.salaryMin = sal;
  const ai = str(sp[PARAMS.ai]);
  if (ai === "1" || ai === "true") f.ai = true;
  const days = Number(str(sp[PARAMS.datePosted]));
  if ([1, 3, 7, 14, 30].includes(days)) f.datePosted = days;
  const q = str(sp[PARAMS.q]);
  if (q) f.q = q;
  return f;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const r = resolvePath(path, { categories: [], seniority: [], workMode: [], country: [], cities: [], tools: [] });
  return {
    title: r.heading,
    description: r.intro || `${r.heading} - vind en vergelijk go-to-market vacatures op GTM Banen.`,
    alternates: { canonical: r.canonical },
  };
}

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { path } = await params;
  const sp = await searchParams;
  const facets = getFacets();
  const r = resolvePath(path, facets);

  const filters: JobFilters = { ...r.filter, ...filtersFromQuery(sp) };
  const sort = (str(sp[PARAMS.sort]) as SortKey) || "newest";
  const page = Math.max(1, Number(str(sp[PARAMS.page])) || 1);

  const total = countJobs(filters);
  const jobs = listJobs(filters, { sort, page, perPage: PER_PAGE });
  const band = salaryBand(filters);

  const active: ActiveParams = {
    category: filters.category,
    seniority: filters.seniority,
    workMode: filters.workMode,
    city: filters.city,
    tool: filters.tool,
    salary: filters.salaryMin ? String(filters.salaryMin) : undefined,
    ai: filters.ai ? "1" : undefined,
    datePosted: filters.datePosted ? String(filters.datePosted) : undefined,
    q: filters.q,
  };

  return (
    <Container className="py-8">
      <Breadcrumbs items={r.crumbs} />
      <div className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{r.heading}</h1>
        <p className="mt-1 text-slate-500">
          {pluralNL(total, "vacature", "vacatures")}
          {band && (
            <>
              {" · "}
              <span className="text-slate-600">
                mediaan {formatSalaryRange(band.min, band.max, "EUR", "year")}
              </span>{" "}
              <span className="text-slate-400">(o.b.v. {band.count})</span>
            </>
          )}
        </p>
        {r.intro && <p className="mt-2 max-w-2xl text-sm text-slate-500">{r.intro}</p>}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <details className="rounded-xl border border-slate-200 bg-white p-4 lg:hidden">
            <summary className="cursor-pointer font-semibold text-slate-900">Filters</summary>
            <div className="mt-4">
              <FilterSidebar facets={facets} active={active} />
            </div>
          </details>
          <aside className="sticky top-20 hidden rounded-xl border border-slate-200 bg-white p-4 lg:block">
            <FilterSidebar facets={facets} active={active} />
          </aside>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              {pluralNL(total, "resultaat", "resultaten")}
            </span>
            <div className="flex items-center gap-1 text-sm">
              <span className="hidden text-slate-400 sm:inline">Sorteer:</span>
              {SORTS.map((s) => (
                <Link
                  key={s.key}
                  href={buildVacaturesUrl({ ...active, sort: s.key === "newest" ? undefined : s.key })}
                  className={`rounded-lg px-2.5 py-1 ${
                    sort === s.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-slate-700">Geen vacatures gevonden</p>
              <p className="mt-1 text-sm text-slate-500">Pas je filters aan of bekijk alle vacatures.</p>
              <Link href="/vacatures" className="mt-4 inline-block text-sm font-semibold text-brand-700">
                Wis alle filters →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <Pagination total={total} perPage={PER_PAGE} page={page} active={active} sort={sort} />
        </div>
      </div>
    </Container>
  );
}
