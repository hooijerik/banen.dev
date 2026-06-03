import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JobCard } from "@/components/JobCard";
import { countJobs, listJobs } from "@/lib/queries";
import { TOOL_BY_SLUG } from "@/lib/taxonomy";
import { getDictionary, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";
import { withLocale } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) return { title: dict.tools.notFound };
  return {
    title: dict.tools.jobsWith(tool.label),
    description: dict.tools.jobsWith(tool.label),
    alternates: alternates(locale, `/tools/${slug}`),
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) notFound();
  const dict = await getDictionary(locale);

  const jobs = listJobs({ tool: slug }, { sort: "newest", perPage: 100 });
  const total = countJobs({ tool: slug });

  return (
    <Container className="py-8">
      <Breadcrumbs
        ariaLabel={dict.breadcrumbs.aria}
        items={[
          { label: dict.breadcrumbs.home, href: withLocale(locale, "/") },
          { label: dict.footer.tools, href: withLocale(locale, "/tools") },
          { label: tool.label },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {dict.tools.jobsWith(tool.label)}
      </h1>
      <p className="mt-1 text-slate-500">{dict.tools.jobCount(total)}</p>

      <div className="mt-8 space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} locale={locale} />
        ))}
        {jobs.length === 0 && <p className="text-slate-500">{dict.browse.noResults}</p>}
      </div>
    </Container>
  );
}
