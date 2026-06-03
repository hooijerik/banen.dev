export const SITE = {
  name: "GTM Banen",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gtmbanen.nl",
  tagline: "Dé vacaturebank voor go-to-market professionals",
  description:
    "Hét vacatureplatform voor go-to-market professionals: Sales, Marketing, Customer Success, RevOps, GTM Engineering en meer. Dagelijks nieuwe GTM-vacatures.",
};

export const NAV = [
  { key: "jobs", href: "/vacatures" },
  { key: "companies", href: "/bedrijven" },
  { key: "salaries", href: "/inzichten/salarissen" },
  { key: "insights", href: "/inzichten" },
  { key: "employers", href: "/werkgevers" },
] as const;
