"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Locale } from "@/lib/i18n/config";

function Switcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  const sp = useSearchParams();
  const other: Locale = locale === "nl" ? "en" : "nl";
  const parts = pathname.split("/");
  parts[1] = other; // parts[0] is "" (leading slash)
  const qs = sp.toString();
  const href = (parts.join("/") || `/${other}`) + (qs ? `?${qs}` : "");
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand-700"
    >
      {other.toUpperCase()}
    </Link>
  );
}

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  // useSearchParams must be inside Suspense for static-render safety.
  return (
    <Suspense fallback={<span className="px-2.5 py-2 text-sm font-semibold text-slate-400">{locale === "nl" ? "EN" : "NL"}</span>}>
      <Switcher locale={locale} label={label} />
    </Suspense>
  );
}
