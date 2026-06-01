import Link from "next/link";
import { Container } from "@/components/ui";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
          <span className="rounded-md bg-brand-600 px-1.5 py-0.5 text-white">GTM</span>
          <span>Banen</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/vacature-alert"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 sm:inline-block"
          >
            Vacature-alert
          </Link>
          <Link
            href="/plaats-vacature"
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Plaats vacature
          </Link>
        </div>
      </Container>
    </header>
  );
}
