import Link from "next/link";
import { buildVacaturesUrl, PARAMS } from "@/lib/urls";
import { categoryLabel, seniorityLabel, toolLabel } from "@/lib/taxonomy";
import type { Facets } from "@/lib/queries";

export type ActiveParams = Partial<Record<keyof typeof PARAMS, string>>;

const SALARY_PRESETS: [string, string][] = [
  ["50000", "€ 50k+"],
  ["70000", "€ 70k+"],
  ["90000", "€ 90k+"],
  ["120000", "€ 120k+"],
];
const WORKMODES: [string, string][] = [
  ["remote", "Remote"],
  ["hybrid", "Hybride"],
  ["onsite", "Op kantoor"],
];
const DATE_PRESETS: [string, string][] = [
  ["1", "Afgelopen 24 uur"],
  ["3", "Afgelopen 3 dagen"],
  ["7", "Afgelopen 7 dagen"],
  ["14", "Afgelopen 14 dagen"],
  ["30", "Afgelopen 30 dagen"],
];

function toggleUrl(active: ActiveParams, dim: keyof typeof PARAMS, value: string): string {
  const next: ActiveParams = { ...active };
  if (active[dim] === value) delete next[dim];
  else next[dim] = value;
  delete next.page;
  return buildVacaturesUrl(next);
}

export function FilterSidebar({ facets, active }: { facets: Facets; active: ActiveParams }) {
  const Opt = ({
    dim,
    value,
    label,
    count,
  }: {
    dim: keyof typeof PARAMS;
    value: string;
    label: string;
    count?: number;
  }) => {
    const selected = active[dim] === value;
    return (
      <li>
        <Link
          href={toggleUrl(active, dim, value)}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${
            selected ? "bg-brand-600 font-medium text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>{label}</span>
          {count != null && (
            <span className={selected ? "text-brand-100" : "text-slate-400"}>{count}</span>
          )}
        </Link>
      </li>
    );
  };

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      <ul className="space-y-0.5 text-sm">{children}</ul>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900">Filters</span>
        <Link href="/vacatures" className="text-xs font-medium text-brand-700 hover:underline">
          Wissen
        </Link>
      </div>

      <Group title="Categorie">
        {facets.categories.map((f) => (
          <Opt key={f.key} dim="category" value={f.key} label={categoryLabel(f.key)} count={f.count} />
        ))}
      </Group>

      <Group title="Niveau">
        {facets.seniority.map((f) => (
          <Opt key={f.key} dim="seniority" value={f.key} label={seniorityLabel(f.key)} count={f.count} />
        ))}
      </Group>

      <Group title="Werkvorm">
        {WORKMODES.map(([v, l]) => (
          <Opt
            key={v}
            dim="workMode"
            value={v}
            label={l}
            count={facets.workMode.find((x) => x.key === v)?.count}
          />
        ))}
      </Group>

      <Group title="Geplaatst">
        {DATE_PRESETS.map(([v, l]) => (
          <Opt key={v} dim="datePosted" value={v} label={l} />
        ))}
      </Group>

      <Group title="Salaris (min.)">
        {SALARY_PRESETS.map(([v, l]) => (
          <Opt key={v} dim="salary" value={v} label={l} />
        ))}
      </Group>

      {facets.cities.length > 0 && (
        <Group title="Locatie">
          {facets.cities.slice(0, 10).map((f) => (
            <Opt key={f.key} dim="city" value={f.key} label={f.label || f.key} count={f.count} />
          ))}
        </Group>
      )}

      {facets.tools.length > 0 && (
        <Group title="Tools">
          {facets.tools.slice(0, 12).map((f) => (
            <Opt key={f.key} dim="tool" value={f.key} label={toolLabel(f.key)} count={f.count} />
          ))}
        </Group>
      )}

      <Group title="Overig">
        <Opt dim="ai" value="1" label="AI-rollen" />
      </Group>
    </div>
  );
}
