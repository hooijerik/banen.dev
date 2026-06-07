import Link from "next/link";
import { withLocale } from "@/lib/urls";
import type { Locale } from "@/lib/i18n/config";

/** The banen.dev wordmark - used in both the header and footer so they stay in sync. */
export function Logo({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <Link
      href={withLocale(locale, "/")}
      className={`inline-flex items-center gap-0.5 font-bold tracking-tight ${className}`}
    >
      <span>banen</span>
      <span className="rounded-md bg-brand-600 px-1.5 py-0.5 text-white">.dev</span>
    </Link>
  );
}
