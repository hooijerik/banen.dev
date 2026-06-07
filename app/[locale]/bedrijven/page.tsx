import type { Metadata } from "next";
import Link from "next/link";
import { Container, Chip } from "@/components/ui";
import { CompanyLogo } from "@/components/CompanyLogo";
import { listCompanies } from "@/lib/queries";
import { companyUrl, withLocale } from "@/lib/urls";
import { getDictionary, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return { title: dict.companies.title, description: dict.companies.title, alternates: alternates(locale, "/bedrijven") };
}

export default async function CompaniesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const companies = listCompanies(undefined, locale === "en" ? "en" : undefined);
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dict.companies.title}</h1>
      <p className="mt-1 text-slate-500">{dict.companies.subtitle(companies.length)}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <Link
            key={c.id}
            href={withLocale(locale, companyUrl(c.slug))}
            className={`flex items-center gap-3 rounded-xl border p-4 transition hover:shadow-sm ${
              c.featured_live
                ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200"
                : "border-slate-200 bg-white hover:border-brand-300"
            }`}
          >
            <CompanyLogo src={c.logo_url} name={c.name} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-slate-900">{c.name}</span>
                {c.featured_live ? <Chip tone="premium">{dict.premium.badge}</Chip> : null}
              </div>
              <div className="text-sm text-slate-500">{dict.companies.openRoles(c.open_count)}</div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
