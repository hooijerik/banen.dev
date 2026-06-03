import type { Metadata } from "next";
import { Container, Card } from "@/components/ui";
import { AlertForm } from "@/components/AlertForm";

export const metadata: Metadata = {
  title: "Vacature-alert - nieuwe GTM-vacatures in je inbox",
  description:
    "Stel een gratis vacature-alert in en ontvang nieuwe go-to-market vacatures in Nederland automatisch per e-mail.",
  alternates: { canonical: "/vacature-alert" },
};

export default function AlertPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-4xl">📬</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Vacature-alert</h1>
        <p className="mt-2 text-slate-600">
          Mis nooit meer een relevante GTM-vacature. Ontvang nieuwe rollen die bij jou passen
          rechtstreeks in je inbox.
        </p>
      </div>

      <Card className="mx-auto mt-8 max-w-lg p-6">
        <AlertForm />
        <ul className="mt-5 space-y-2 text-sm text-slate-500">
          <li>✓ Filter op categorie en frequentie</li>
          <li>✓ Alleen relevante go-to-market rollen</li>
          <li>✓ Altijd gratis, uitschrijven met één klik</li>
        </ul>
      </Card>
    </Container>
  );
}
