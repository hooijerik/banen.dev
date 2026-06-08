import { redirect } from "next/navigation";
import { withLocale } from "@/lib/urls";
import type { Locale } from "@/lib/i18n";

// Advertising is consolidated onto /plaats-vacature (employer form + placement
// options), matching maakjobs. Kept as a redirect so old /adverteren links resolve.
export default async function AdverterenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect(withLocale(locale, "/plaats-vacature"));
}
