import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { CompanyLogo } from "@/components/CompanyLogo";
import { listCompanies } from "@/lib/queries";
import { pluralNL } from "@/lib/format";
import { companyUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bedrijven die GTM-talent zoeken",
  description:
    "Ontdek de bedrijven die in Nederland actief go-to-market professionals aannemen: sales, marketing, customer success, RevOps en meer.",
  alternates: { canonical: "/bedrijven" },
};

export default async function CompaniesPage() {
  const companies = listCompanies();
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bedrijven die nu aannemen</h1>
      <p className="mt-1 text-slate-500">
        {pluralNL(companies.length, "bedrijf", "bedrijven")} met openstaande GTM-vacatures.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <Link
            key={c.id}
            href={companyUrl(c.slug)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
          >
            <CompanyLogo src={c.logo_url} name={c.name} size={44} />
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-900">{c.name}</div>
              <div className="text-sm text-slate-500">
                {pluralNL(c.open_count, "open vacature", "open vacatures")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
