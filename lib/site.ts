export const SITE = {
  name: "banen.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://banen.dev",
  tagline: "Dé vacaturebank voor developers",
  description:
    "Hét vacatureplatform voor developers: frontend, backend, fullstack, mobile, DevOps, data & ML en meer. Dagelijks nieuwe developer-vacatures in Nederland en Vlaanderen.",
};

export const NAV = [
  { key: "jobs", href: "/vacatures" },
  { key: "companies", href: "/bedrijven" },
  { key: "salaries", href: "/inzichten/salarissen" },
  { key: "insights", href: "/inzichten" },
  { key: "employers", href: "/werkgevers" },
] as const;
