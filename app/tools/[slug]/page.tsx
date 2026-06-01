import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JobCard } from "@/components/JobCard";
import { countJobs, listJobs } from "@/lib/queries";
import { TOOL_BY_SLUG } from "@/lib/taxonomy";
import { pluralNL } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) return { title: "Tool niet gevonden" };
  return {
    title: `GTM-vacatures met ${tool.label}`,
    description: `Alle go-to-market vacatures in Nederland waarin ervaring met ${tool.label} wordt gevraagd.`,
    alternates: { canonical: `/tools/${slug}` },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) notFound();

  const jobs = listJobs({ tool: slug }, { sort: "newest", perPage: 100 });
  const total = countJobs({ tool: slug });

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        GTM-vacatures met {tool.label}
      </h1>
      <p className="mt-1 text-slate-500">{pluralNL(total, "vacature", "vacatures")}</p>

      <div className="mt-8 space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && <p className="text-slate-500">Geen vacatures gevonden voor {tool.label}.</p>}
      </div>
    </Container>
  );
}
