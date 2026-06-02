import type { Metadata } from "next";
import { Container, Card } from "@/components/ui";
import { EmployerForm } from "@/components/EmployerForm";

export const metadata: Metadata = {
  title: "Plaats een vacature",
  description:
    "Stuur je go-to-market vacature in en bereik gerichte GTM-professionals in Nederland via GTM Banen.",
  alternates: { canonical: "/plaats-vacature" },
};

export default function PostJobPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Plaats een vacature</h1>
        <p className="mt-2 text-slate-600">
          Vul onderstaand formulier in. Na een korte controle plaatsen we je go-to-market vacature
          op GTM Banen - gratis tijdens onze beta.
        </p>
        <Card className="mt-6 p-6">
          <EmployerForm />
        </Card>
        <p className="mt-4 text-sm text-slate-500">
          Gebruik je een ATS zoals Greenhouse, Lever, Ashby of Recruitee? Dan kunnen we je vacatures
          ook automatisch synchroniseren - vermeld dit in je bericht.
        </p>
      </div>
    </Container>
  );
}
