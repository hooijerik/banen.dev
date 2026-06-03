import type { Metadata } from "next";
import Link from "next/link";
import { Container, Card } from "@/components/ui";
import { countLongOpenJobs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Voor werkgevers - bereik GTM-talent in Nederland",
  description:
    "Plaats je go-to-market vacature op GTM Banen en bereik gerichte sales-, marketing-, customer success- en RevOps-professionals in Nederland.",
  alternates: { canonical: "/werkgevers" },
};

const STEPS = [
  { t: "Stuur je vacature in", d: "Deel de link naar je vacature of de details via het formulier." },
  { t: "Wij classificeren en plaatsen", d: "We categoriseren de rol automatisch en plaatsen hem op de juiste pagina's." },
  { t: "Bereik de juiste kandidaten", d: "Je vacature verschijnt in zoekresultaten, categorie- en locatiepagina's en alerts." },
];

export default function EmployersPage() {
  const longOpen = countLongOpenJobs(30);
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Bereik de beste <span className="text-brand-600">GTM-professionals</span> van Nederland
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          GTM Banen is dé niche-vacaturebank voor go-to-market rollen. Geen ruis - alleen
          gemotiveerde sales-, marketing-, CS- en RevOps-talenten.
        </p>
        <Link
          href="/plaats-vacature"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Plaats een vacature →
        </Link>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <Card key={i} className="p-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
              {i + 1}
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{s.t}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.d}</p>
          </Card>
        ))}
      </div>

      {/* Interim-propositie van GTM AI voor langlopende vacatures */}
      <Card className="mx-auto mt-14 max-w-4xl border-brand-700 bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white sm:p-10">
        <span className="text-sm font-medium text-brand-200">Interim via GTM AI</span>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Vacature al weken open?</h2>
        <p className="mt-3 max-w-2xl text-brand-100">
          {longOpen > 0 ? (
            <>
              Op dit moment staan{" "}
              <strong className="font-semibold text-white">{longOpen} GTM-vacatures</strong> in Nederland
              en Vlaanderen al langer dan 30 dagen open. Elke week zonder de juiste hire kost pipeline en omzet.
            </>
          ) : (
            <>
              Werving van een GTM-rol duurt vaak weken, en elke week zonder de juiste hire kost pipeline en omzet.
            </>
          )}
        </p>
        <p className="mt-3 max-w-2xl text-brand-100">
          Zet tijdelijk een ervaren{" "}
          <strong className="font-semibold text-white">interim GTM-professional</strong> in (RevOps, GTM
          Engineering, sales- of marketingleiding) en houd de groei op gang terwijl je werft.
        </p>
        <a
          href="https://gtmai.nl/interim/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
        >
          Ontdek interim via GTM AI ↗
        </a>
      </Card>
    </Container>
  );
}
