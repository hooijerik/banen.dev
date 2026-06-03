import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { getFacets } from "@/lib/queries";
import { toolLabel } from "@/lib/taxonomy";
import { toolUrl, withLocale } from "@/lib/urls";
import { getDictionary, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return { title: dict.tools.title, description: dict.tools.subtitle, alternates: alternates(locale, "/tools") };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const tools = getFacets().tools;
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dict.tools.title}</h1>
      <p className="mt-1 max-w-2xl text-slate-500">{dict.tools.subtitle}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.key}
            href={withLocale(locale, toolUrl(t.key))}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand-300 hover:shadow-sm"
          >
            <span className="font-medium text-slate-800">{toolLabel(t.key)}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {t.count}
            </span>
          </Link>
        ))}
      </div>
      {tools.length === 0 && <p className="mt-8 text-slate-500">{dict.tools.empty}</p>}
    </Container>
  );
}
