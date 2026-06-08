// Paid-placement packages. Single source of truth for the buyer-facing pricing copy
// shown on /plaats-vacature. Prices are display strings - set real amounts here when
// pricing is finalised (the MVP sells via quote/invoice, so the default is "Op aanvraag").
import type { Locale } from "./i18n/config";

export type PackageId = "standaard" | "premium" | "uitgelicht-bedrijf" | "combinatie";

export interface PremiumPackage {
  id: PackageId;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
}

const PACKAGES_NL: PremiumPackage[] = [
  {
    id: "standaard",
    name: "Standaard",
    price: "Gratis",
    blurb: "Je vacature op banen.dev.",
    features: [
      "Plaatsing na controle",
      "Vindbaar in zoekresultaten, categorie- en locatiepagina's",
      "Mee in de vacature-alerts",
    ],
  },
  {
    id: "premium",
    name: "Premium vacature",
    price: "Op aanvraag",
    highlight: true,
    blurb: "Maximale zichtbaarheid voor één vacature.",
    features: [
      "Bovenaan de zoekresultaten met 'Uitgelicht'-badge",
      "Uitgelicht op de homepage",
      "Voorrang in de vacature-alerts",
      "30 dagen looptijd",
    ],
  },
  {
    id: "uitgelicht-bedrijf",
    name: "Uitgelicht bedrijf",
    price: "Op aanvraag",
    blurb: "Zet je bedrijf als werkgever op de kaart.",
    features: [
      "Logo bovenaan de bedrijvenpagina",
      "Uitgelicht op de homepage",
      "Employer-branding bij je vacatures",
    ],
  },
  {
    id: "combinatie",
    name: "Combinatie",
    price: "Op aanvraag",
    blurb: "Premium vacature én uitgelicht bedrijf, met voordeel.",
    features: ["Alles uit Premium vacature", "Alles uit Uitgelicht bedrijf", "Voordeeltarief"],
  },
];

const PACKAGES_EN: PremiumPackage[] = [
  {
    id: "standaard",
    name: "Standard",
    price: "Free",
    blurb: "Your job on banen.dev.",
    features: [
      "Published after review",
      "Findable in search, category and location pages",
      "Included in the job alerts",
    ],
  },
  {
    id: "premium",
    name: "Premium job",
    price: "On request",
    highlight: true,
    blurb: "Maximum visibility for a single job.",
    features: [
      "Top of the search results with a 'Featured' badge",
      "Featured on the homepage",
      "Priority in the job alerts",
      "30-day runtime",
    ],
  },
  {
    id: "uitgelicht-bedrijf",
    name: "Featured company",
    price: "On request",
    blurb: "Put your company on the map as an employer.",
    features: [
      "Logo at the top of the companies page",
      "Featured on the homepage",
      "Employer branding on your jobs",
    ],
  },
  {
    id: "combinatie",
    name: "Combination",
    price: "On request",
    blurb: "Premium job plus featured company, at a discount.",
    features: ["Everything from Premium job", "Everything from Featured company", "Bundle rate"],
  },
];

export function getPackages(locale: Locale): PremiumPackage[] {
  return locale === "en" ? PACKAGES_EN : PACKAGES_NL;
}
