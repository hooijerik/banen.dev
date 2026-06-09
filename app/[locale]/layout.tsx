import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CookieConsent } from "@/components/CookieConsent";
import { withLocale } from "@/lib/urls";
import { SITE } from "@/lib/site";
import { getDictionary, isLocale, ogLocale, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

// Analytics are opt-in per deploy via RUNTIME env (read server-side here, passed as props to
// the client - so plain GA_ID / CLARITY_ID work straight from .env without a build-time inline,
// unlike NEXT_PUBLIC_*). Consent-gated in CookieConsent: GA is necessary, Clarity loads only
// after "Accept all". Set GA_ID (G-XXXXXXXXXX) and/or CLARITY_ID to enable them.

export function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "nl";
  const dict = await getDictionary(loc);
  const alts = alternates(loc, "/");
  return {
    metadataBase: new URL(SITE.url),
    title: { default: `${SITE.name} - ${dict.meta.tagline}`, template: `%s · ${SITE.name}` },
    description: dict.meta.description,
    alternates: alts,
    openGraph: {
      type: "website",
      locale: ogLocale(loc),
      siteName: SITE.name,
      title: `${SITE.name} - ${dict.meta.tagline}`,
      description: dict.meta.description,
      url: alts.canonical,
    },
    twitter: { card: "summary_large_image", title: SITE.name, description: dict.meta.description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  // Read at render time so .env changes apply on restart, no rebuild needed.
  const gaId = process.env.GA_ID;
  const clarityId = process.env.CLARITY_ID;
  return (
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 antialiased">
        <SiteHeader locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
        <CookieConsent
          gaId={gaId}
          clarityId={clarityId}
          policyHref={withLocale(locale, "/cookiebeleid")}
          dict={dict.cookies}
        />
      </body>
    </html>
  );
}
