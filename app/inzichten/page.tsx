import type { Metadata } from "next";
import Link from "next/link";
import { Container, Card } from "@/components/ui";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Inzichten & gidsen voor GTM-professionals",
  description:
    "Salarisdata, carrièregidsen en trends voor go-to-market professionals in Nederland: sales, marketing, customer success en RevOps.",
  alternates: { canonical: "/inzichten" },
};

export default function InsightsPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inzichten &amp; gidsen</h1>
      <p className="mt-1 max-w-2xl text-slate-600">
        Data en achtergrond om je go-to-market carrière vooruit te helpen.
      </p>

      <Link
        href="/inzichten/salarissen"
        className="mt-8 block rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white transition hover:shadow-lg"
      >
        <span className="text-sm font-medium text-brand-200">Uitgelicht</span>
        <h2 className="mt-1 text-2xl font-bold">GTM Salarisrapport 2026</h2>
        <p className="mt-1 max-w-xl text-brand-100">
          Wat verdienen GTM-professionals in Nederland? Uitgesplitst naar functie, niveau, werkvorm
          en regio — gebaseerd op echte vacatures.
        </p>
        <span className="mt-4 inline-block font-semibold">Bekijk het rapport →</span>
      </Link>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Card key={g.slug} className="p-6 transition hover:border-brand-300 hover:shadow-sm">
            <Link href={`/inzichten/${g.slug}`}>
              <h3 className="text-lg font-bold text-slate-900">{g.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{g.dek}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700">Lees verder →</span>
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  );
}
