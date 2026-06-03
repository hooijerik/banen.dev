import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { getCompanyBySlug, listJobs } from "@/lib/queries";
import { pluralNL } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompanyBySlug(slug);
  if (!c) return { title: "Bedrijf niet gevonden" };
  return {
    title: `GTM-vacatures bij ${c.name}`,
    description: `Bekijk ${c.open_count} openstaande go-to-market vacatures bij ${c.name}.`,
    alternates: { canonical: `/bedrijven/${c.slug}` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const jobs = listJobs({ company: slug }, { sort: "newest", perPage: 100 });
  const website = company.website
    ? company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`
    : null;

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bedrijven", href: "/bedrijven" },
          { label: company.name },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <CompanyLogo src={company.logo_url} name={company.name} size={64} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{company.name}</h1>
          <p className="mt-0.5 text-slate-500">
            {pluralNL(jobs.length, "openstaande GTM-vacature", "openstaande GTM-vacatures")}
            {website && (
              <>
                {" · "}
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  Website
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </Container>
  );
}
