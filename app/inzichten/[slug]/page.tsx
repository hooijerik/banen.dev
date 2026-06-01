import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GUIDE_BY_SLUG, GUIDES } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG.get(slug);
  if (!g) return { title: "Gids niet gevonden" };
  return { title: g.title, description: g.dek, alternates: { canonical: `/inzichten/${g.slug}` } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG.get(slug);
  if (!guide) notFound();

  return (
    <Container className="py-10">
      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Inzichten", href: "/inzichten" },
            { label: guide.title },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{guide.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{guide.dek}</p>
        <p className="mt-1 text-sm text-slate-400">Bijgewerkt {guide.updated}</p>

        <div className="mt-8 space-y-5">
          {guide.sections.map((s, i) => (
            <div key={i}>
              {s.h && <h2 className="mb-1.5 text-xl font-bold text-slate-900">{s.h}</h2>}
              <p className="leading-relaxed text-slate-700">{s.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-brand-50 p-5">
          <p className="font-medium text-brand-900">Klaar voor je volgende stap?</p>
          <Link href="/vacatures" className="mt-1 inline-block text-sm font-semibold text-brand-700">
            Bekijk alle GTM-vacatures →
          </Link>
        </div>
      </article>
    </Container>
  );
}
