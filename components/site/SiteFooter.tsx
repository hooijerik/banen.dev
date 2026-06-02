import Link from "next/link";
import { Container } from "@/components/ui";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/taxonomy";
import { categoryUrl, locationUrl, remoteUrl } from "@/lib/urls";
import { Logo } from "@/components/site/Logo";

const CITIES = [
  ["Amsterdam", "amsterdam"],
  ["Rotterdam", "rotterdam"],
  ["Utrecht", "utrecht"],
  ["Den Haag", "den-haag"],
  ["Eindhoven", "eindhoven"],
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Categorieën</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {CATEGORIES.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link href={categoryUrl(c.slug)} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Locaties</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {CITIES.map(([label, slug]) => (
                <li key={slug}>
                  <Link href={locationUrl(slug)} className="hover:text-brand-700">
                    GTM-vacatures {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={remoteUrl()} className="hover:text-brand-700">
                  Remote GTM-vacatures
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Ontdek</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/vacatures" className="hover:text-brand-700">Alle vacatures</Link></li>
              <li><Link href="/bedrijven" className="hover:text-brand-700">Bedrijven</Link></li>
              <li><Link href="/tools" className="hover:text-brand-700">Tools</Link></li>
              <li><Link href="/inzichten/salarissen" className="hover:text-brand-700">Salarisrapport</Link></li>
              <li><Link href="/inzichten" className="hover:text-brand-700">Inzichten &amp; gidsen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Voor werkgevers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/werkgevers" className="hover:text-brand-700">Werkgevers</Link></li>
              <li><Link href="/plaats-vacature" className="hover:text-brand-700">Plaats een vacature</Link></li>
              <li><Link href="/vacature-alert" className="hover:text-brand-700">Vacature-alert</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2 text-slate-500">
            <Logo />
            <span>- {SITE.tagline}.</span>
          </div>
          <p className="flex flex-wrap items-center gap-1.5">
            <span>
              Een initiatief van{" "}
              <a
                href="https://gtmai.nl/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
              >
                GTM AI
              </a>
            </span>
            <span className="text-slate-300">·</span>
            <span>© {SITE.name}. Vacatures verzameld van publieke bronnen.</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
