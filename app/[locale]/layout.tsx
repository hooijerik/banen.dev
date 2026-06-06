import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SITE } from "@/lib/site";
import { getDictionary, isLocale, ogLocale, type Locale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n/meta";

const CLARITY =
  '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "x13ltajl65");';

// Google Analytics 4 (gtag.js)
const GA_ID = "G-CD81G41B5Q";
const GA_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`;

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
  return (
    <html lang={locale}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: GA_INIT }} />
        {/* Microsoft Clarity */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: CLARITY }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 antialiased">
        <SiteHeader locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
