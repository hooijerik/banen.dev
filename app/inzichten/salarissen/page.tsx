import type { Metadata } from "next";
import { Container, Card } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RangeChart, Donut } from "@/components/charts";
import { SalaryEstimator } from "@/components/SalaryEstimator";
import { buildSalaryReport } from "@/lib/report";
import { formatEURShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GTM Salarisrapport 2026 — wat verdienen go-to-market professionals?",
  description:
    "Salarisdata voor go-to-market rollen in Nederland, uitgesplitst naar functie, niveau, werkvorm en regio. Gebaseerd op echte vacatures.",
  alternates: { canonical: "/inzichten/salarissen" },
};

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mb-4 mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-4"}>{children}</div>
    </Card>
  );
}

export default async function SalaryReportPage() {
  const r = buildSalaryReport();

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Inzichten", href: "/inzichten" },
          { label: "Salarissen" },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          GTM Salarisrapport 2026
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Wat verdienen go-to-market professionals in Nederland? Gebaseerd op {r.disclosed} vacatures
          met openlijke salarisinformatie. Bijgewerkt juni 2026.
        </p>
      </div>

      {/* KPI cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-slate-500">Mediaan totale range</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {r.overall ? `${formatEURShort(r.overall.min)} – ${formatEURShort(r.overall.max)}` : "—"}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">Vermeldt salaris</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{r.disclosureRate}%</div>
          <div className="text-xs text-slate-400">{r.disclosed} van {r.totalActive} vacatures</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">AI-premie</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {r.aiPremium.pct != null ? `${r.aiPremium.pct > 0 ? "+" : ""}${r.aiPremium.pct}%` : "—"}
          </div>
          <div className="text-xs text-slate-400">rollen die AI-skills vragen</div>
        </Card>
      </div>

      {/* Estimator */}
      {r.byCategory.length > 0 && r.bySeniority.length > 0 && (
        <div className="mt-6">
          <SalaryEstimator categories={r.byCategory} seniorities={r.bySeniority} />
        </div>
      )}

      {/* Breakdowns */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Per functie" subtitle="Mediaan salarisrange per GTM-categorie (jaarbasis, EUR).">
          <RangeChart data={r.byCategory} scaleMax={r.scaleMax} />
        </Panel>
        <Panel title="Per niveau" subtitle="Van junior tot C-level.">
          <RangeChart data={r.bySeniority} scaleMax={r.scaleMax} />
        </Panel>
        <Panel title="Per werkvorm" subtitle="Remote, hybride of op kantoor.">
          <RangeChart data={r.byWorkMode} scaleMax={r.scaleMax} />
        </Panel>
        <Panel title="Per provincie" subtitle="Waar de data toereikend is.">
          <RangeChart data={r.byProvince} scaleMax={r.scaleMax} />
        </Panel>
      </div>

      {/* AI premium + comp + equity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="AI-premie" subtitle="Rollen mét vs. zonder AI-vereiste.">
          {r.aiPremium.withAI && r.aiPremium.withoutAI ? (
            <RangeChart
              data={[
                { ...r.aiPremium.withAI, label: "Met AI" },
                { ...r.aiPremium.withoutAI, label: "Zonder AI" },
              ]}
              scaleMax={r.scaleMax}
            />
          ) : (
            <p className="text-sm text-slate-400">Nog te weinig data.</p>
          )}
        </Panel>
        <Panel title="Beloningsstructuur">
          <Donut data={r.compStructure} />
        </Panel>
        <Panel title="Equity">
          {r.equity.length ? (
            <Donut data={r.equity} />
          ) : (
            <p className="text-sm text-slate-400">Weinig vacatures vermelden equity.</p>
          )}
        </Panel>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        <h2 className="font-semibold text-slate-700">Methodologie</h2>
        <p className="mt-2">
          Cijfers zijn gebaseerd op {r.disclosed} actieve GTM-vacatures in Nederland die een
          salarisindicatie vermelden ({r.disclosureRate}% van het totaal). Maandsalarissen worden
          omgerekend naar jaarbasis; niet-EUR bedragen tegen de actuele wisselkoers. Alleen
          uitsplitsingen met voldoende steekproef worden getoond — let op de aantallen tussen haakjes.
          Salarisvermelding is in Nederland lager dan in de VS, dus kleinere segmenten zijn indicatief.
        </p>
      </div>
    </Container>
  );
}
