import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Chip, Card } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { JsonLd } from "@/components/JsonLd";
import { getJobBySlug, getRelatedJobs } from "@/lib/queries";
import { categoryLabel, seniorityLabel, workModeLabel, toolLabel } from "@/lib/taxonomy";
import { formatSalaryRange, formatDateNL, timeAgo, sanitizeHtml } from "@/lib/format";
import { categoryUrl, companyUrl, locationUrl, seniorityUrl, toolUrl } from "@/lib/urls";
import { SITE } from "@/lib/site";
import type { JobRow } from "@/lib/types";

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  recruitee: "Recruitee",
  homerun: "Homerun",
  personio: "Personio",
  workable: "Workable",
  smartrecruiters: "SmartRecruiters",
  indeed: "Indeed",
  linkedin: "LinkedIn",
  nationalevacaturebank: "Nationale Vacaturebank",
  magnet: "Magnet.me",
};

function employmentType(raw: string | null): string | undefined {
  const t = (raw || "").toLowerCase();
  if (/part|deeltijd/.test(t)) return "PART_TIME";
  if (/intern|stage/.test(t)) return "INTERN";
  if (/contract|tijdelijk|freelance/.test(t)) return "CONTRACTOR";
  if (/full|fulltime|vast|permanent/.test(t)) return "FULL_TIME";
  return undefined;
}

function locationLine(job: JobRow): string {
  const base = job.city || job.province || (job.country === "NL" ? "Nederland" : null) || job.location_raw;
  if (job.work_mode === "remote") return base ? `Remote · ${base}` : "Remote";
  if (job.work_mode === "hybrid") return base ? `Hybride · ${base}` : "Hybride";
  return base || "-";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Vacature niet gevonden" };
  const loc = job.city || (job.country === "NL" ? "Nederland" : "Remote");
  const desc = (job.description_text || "").replace(/\s+/g, " ").slice(0, 155);
  return {
    title: `${job.title} bij ${job.company_name} - ${loc}`,
    description: desc || `${job.title} bij ${job.company_name}. Bekijk deze GTM-vacature op ${SITE.name}.`,
    alternates: { canonical: `/vacature/${job.slug}` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const related = getRelatedJobs(job, 4);
  const salary = formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency, job.salary_interval);
  let tools: string[] = [];
  try {
    tools = job.tools_json ? (JSON.parse(job.tools_json) as string[]) : [];
  } catch {
    tools = [];
  }
  const applyHref = job.apply_url || job.url;
  const descHtml = job.description_html ? sanitizeHtml(job.description_html) : null;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descHtml || job.description_text || job.title,
    datePosted: job.posted_at || job.first_seen_at,
    employmentType: employmentType(job.employment_type),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      logo: job.company_logo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city || undefined,
        addressRegion: job.province || undefined,
        addressCountry: job.country || "NL",
      },
    },
    jobLocationType: job.work_mode === "remote" ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements:
      job.work_mode === "remote" ? { "@type": "Country", name: "Netherlands" } : undefined,
    directApply: false,
    url: `${SITE.url}/vacature/${job.slug}`,
    ...(job.salary_disclosed && job.salary_min
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency || "EUR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary_min,
              maxValue: job.salary_max || job.salary_min,
              unitText:
                job.salary_interval === "month" ? "MONTH" : job.salary_interval === "hour" ? "HOUR" : "YEAR",
            },
          },
        }
      : {}),
  };

  return (
    <Container className="py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vacatures", href: "/vacatures" },
          { label: categoryLabel(job.category), href: categoryUrl(job.category) },
          { label: job.title },
        ]}
      />

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex gap-4">
              <CompanyLogo src={job.company_logo} name={job.company_name} size={56} />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
                <div className="mt-1 text-slate-600">
                  <Link href={companyUrl(job.company_slug)} className="font-medium hover:text-brand-700">
                    {job.company_name}
                  </Link>
                  <span className="mx-1.5 text-slate-300">·</span>
                  {locationLine(job)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Chip tone="brand" href={categoryUrl(job.category)}>
                {categoryLabel(job.category)}
              </Chip>
              {job.seniority && <Chip href={seniorityUrl(job.seniority)}>{seniorityLabel(job.seniority)}</Chip>}
              {job.work_mode && <Chip>{workModeLabel(job.work_mode)}</Chip>}
              {salary && <Chip tone="green">{salary}</Chip>}
              {job.ai_required ? <Chip tone="amber">AI-rol</Chip> : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={applyHref}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Solliciteer bij {job.company_name} →
              </a>
              <span className="text-sm text-slate-400">
                Geplaatst {timeAgo(job.posted_at || job.first_seen_at)}
              </span>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-bold text-slate-900">Functieomschrijving</h2>
            {descHtml ? (
              <div
                className="prose-job mt-3 text-[15px] text-slate-700"
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />
            ) : job.description_text ? (
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
                {job.description_text}
              </p>
            ) : (
              <p className="mt-3 text-slate-500">
                Geen omschrijving beschikbaar. Bekijk de volledige vacature bij de werkgever.
              </p>
            )}

            {tools.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">Tools &amp; stack</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <Chip key={t} href={toolUrl(t)}>
                      {toolLabel(t)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              Deze vacature is verzameld via {SOURCE_LABELS[job.source] || job.source}. Solliciteren
              gebeurt rechtstreeks bij de werkgever.
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900">Over deze functie</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Fact label="Bedrijf">
                <Link href={companyUrl(job.company_slug)} className="text-brand-700 hover:underline">
                  {job.company_name}
                </Link>
              </Fact>
              <Fact label="Locatie">
                {job.city_slug ? (
                  <Link href={locationUrl(job.city_slug)} className="text-brand-700 hover:underline">
                    {locationLine(job)}
                  </Link>
                ) : (
                  locationLine(job)
                )}
              </Fact>
              <Fact label="Categorie">{categoryLabel(job.category)}</Fact>
              {job.seniority && <Fact label="Niveau">{seniorityLabel(job.seniority)}</Fact>}
              {job.work_mode && <Fact label="Werkvorm">{workModeLabel(job.work_mode)}</Fact>}
              {salary && <Fact label="Salaris">{salary}</Fact>}
              {job.reports_to && <Fact label="Rapporteert aan">{job.reports_to}</Fact>}
              <Fact label="Geplaatst">{formatDateNL(job.posted_at || job.first_seen_at)}</Fact>
            </dl>
            <a
              href={applyHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="mt-4 block rounded-lg bg-brand-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-brand-700"
            >
              Bekijk &amp; solliciteer
            </a>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Vergelijkbare vacatures</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{children}</dd>
    </div>
  );
}
