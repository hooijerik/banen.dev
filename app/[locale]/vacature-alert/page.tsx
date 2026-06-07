import type { Metadata } from "next";
import { Container, Card } from "@/components/ui";
import { AlertForm } from "@/components/AlertForm";
import { CATEGORIES, SENIORITY, categoryLabel, seniorityLabel } from "@/lib/taxonomy";
import { ALERT_RADII } from "@/lib/geo";
import { getDictionary, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return { title: dict.alertPage.title, description: dict.alertPage.subtitle, alternates: alternates(locale, "/vacature-alert") };
}

const SALARIES = [
  { value: "50000", label: "€ 50k+" },
  { value: "70000", label: "€ 70k+" },
  { value: "90000", label: "€ 90k+" },
  { value: "120000", label: "€ 120k+" },
];

export default async function AlertPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const categories = CATEGORIES.map((c) => ({ slug: c.slug, label: categoryLabel(c.slug, locale) }));
  const seniorities = [...SENIORITY]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ slug: s.slug, label: seniorityLabel(s.slug, locale) }));

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-4xl">📬</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{dict.alertPage.title}</h1>
        <p className="mt-2 text-slate-600">{dict.alertPage.subtitle}</p>
      </div>

      <Card className="mx-auto mt-8 max-w-lg p-6">
        <AlertForm
          t={dict.forms.alert}
          categories={categories}
          seniorities={seniorities}
          salaries={SALARIES}
          countries={[
            { value: "nl", label: dict.common.netherlands },
            { value: "be", label: dict.common.belgium },
          ]}
          radii={[...ALERT_RADII]}
        />
        <ul className="mt-5 space-y-2 text-sm text-slate-500">
          {dict.alertPage.bullets.map((b, i) => (
            <li key={i}>✓ {b}</li>
          ))}
        </ul>
      </Card>
    </Container>
  );
}
