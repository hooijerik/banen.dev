import type { Metadata } from "next";
import Link from "next/link";
import { Container, Card } from "@/components/ui";
import { withLocale } from "@/lib/urls";
import { getDictionary, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.premium.title,
    description: dict.premium.subtitle,
    alternates: alternates(locale, "/adverteren"),
  };
}

export default async function AdverterenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const p = dict.premium;
  const L = (path: string) => withLocale(locale, path);
  const packages = [
    { title: p.jobTitle, desc: p.jobDesc },
    { title: p.companyTitle, desc: p.companyDesc },
    { title: p.comboTitle, desc: p.comboDesc },
  ];

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-300">
          ★ {p.badge}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">{p.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">{p.subtitle}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
        {packages.map((pkg, i) => (
          <Card key={i} className="p-6">
            <h2 className="text-lg font-bold text-slate-900">{pkg.title}</h2>
            <p className="mt-1.5 text-sm text-slate-600">{pkg.desc}</p>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8">
        <ul className="grid gap-2 sm:grid-cols-2">
          {p.perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-amber-600">✓</span>
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={L("/plaats-vacature")}
            className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {p.cta}
          </Link>
          <p className="text-sm text-slate-500">{p.contact}</p>
        </div>
      </div>
    </Container>
  );
}
