import type { Locale } from "./i18n/config";

export interface GuideSection {
  h?: string;
  p: string;
}
export interface Guide {
  slug: string;
  title: string;
  dek: string;
  updated: string;
  sections: GuideSection[];
}

export const GUIDES: Record<Locale, Guide[]> = {
  nl: [
    {
      slug: "wat-is-een-gtm-engineer",
      title: "Wat is een GTM Engineer?",
      dek: "De snelst groeiende rol in go-to-market: wat doet een GTM Engineer, welke skills heb je nodig en wat verdien je?",
      updated: "juni 2026",
      sections: [
        {
          p: "Een GTM Engineer (Go-to-Market Engineer) bouwt de geautomatiseerde, data-gedreven infrastructuur achter moderne sales- en marketingteams. Waar een SDR handmatig prospects benadert, bouwt een GTM Engineer systemen die dat op schaal doen - met enrichment, signalen en AI.",
        },
        {
          h: "Wat doet een GTM Engineer?",
          p: "Denk aan: enrichment-waterfalls bouwen in Clay, intent- en koopsignalen detecteren, leadscoring automatiseren, data tussen CRM en outbound-tools synchroniseren, en AI inzetten voor personalisatie. Het is een hybride rol tussen RevOps, data engineering en growth.",
        },
        {
          h: "Welke tools moet je kennen?",
          p: "De kerntools zijn Clay, n8n of Zapier, een CRM (HubSpot of Salesforce), outbound-platforms zoals Outreach of Smartlead, en enrichmentbronnen zoals Apollo en Cognism. Kennis van SQL, API's en steeds vaker LLM's/prompt-engineering is een groot pluspunt.",
        },
        {
          h: "Wat verdient een GTM Engineer in Nederland?",
          p: "Salarissen lopen uiteen op basis van ervaring en bedrijfsgrootte. Bekijk het actuele GTM Salarisrapport voor mediane ranges per niveau, en filter op vacatures die Clay of n8n vragen om een gevoel te krijgen voor de markt.",
        },
      ],
    },
    {
      slug: "revops-carrierepad",
      title: "Het RevOps-carrièrepad: van Analist tot CRO",
      dek: "Hoe ziet een carrière in Revenue Operations eruit, en welke stappen zet je richting leiderschap?",
      updated: "juni 2026",
      sections: [
        {
          p: "Revenue Operations (RevOps) verbindt sales, marketing en customer success met data, processen en systemen. Het is een van de meest strategische - en best betaalde - carrièrepaden binnen go-to-market.",
        },
        {
          h: "Junior → Medior: Analyst & Specialist",
          p: "Je start vaak als RevOps Analyst of CRM/Marketing Ops Specialist: rapportages bouwen, data opschonen, workflows in HubSpot of Salesforce beheren en het team ondersteunen met inzichten.",
        },
        {
          h: "Senior → Manager: proces-eigenaarschap",
          p: "Als Senior of Manager word je eigenaar van het end-to-end revenue-proces: forecasting, leadrouting, territory- en compensatieplanning, en de tech-stack. Je stuurt projecten en soms een klein team aan.",
        },
        {
          h: "Director → VP → CRO",
          p: "Op leiderschapsniveau bepaal je de revenue-strategie en -architectuur voor de hele organisatie. De ultieme stap is Chief Revenue Officer (CRO), eindverantwoordelijk voor alle commerciële omzet.",
        },
        {
          h: "Wat verdien je per stap?",
          p: "Het GTM Salarisrapport toont mediane salarisranges per niveau in Nederland - handig om je volgende stap te benchmarken.",
        },
      ],
    },
  ],
  en: [
    {
      slug: "wat-is-een-gtm-engineer",
      title: "What is a GTM Engineer?",
      dek: "The fastest-growing role in go-to-market: what does a GTM Engineer do, what skills do you need and what do you earn?",
      updated: "June 2026",
      sections: [
        {
          p: "A GTM Engineer (Go-to-Market Engineer) builds the automated, data-driven infrastructure behind modern sales and marketing teams. Where an SDR reaches out to prospects by hand, a GTM Engineer builds systems that do it at scale - with enrichment, signals and AI.",
        },
        {
          h: "What does a GTM Engineer do?",
          p: "Think: building enrichment waterfalls in Clay, detecting intent and buying signals, automating lead scoring, syncing data between CRM and outbound tools, and using AI for personalisation. It's a hybrid role between RevOps, data engineering and growth.",
        },
        {
          h: "Which tools should you know?",
          p: "The core tools are Clay, n8n or Zapier, a CRM (HubSpot or Salesforce), outbound platforms like Outreach or Smartlead, and enrichment sources like Apollo and Cognism. Knowledge of SQL, APIs and increasingly LLMs/prompt engineering is a big plus.",
        },
        {
          h: "What does a GTM Engineer earn?",
          p: "Salaries vary by experience and company size. Check the latest GTM Salary Report for median ranges per level, and filter on jobs that ask for Clay or n8n to get a feel for the market.",
        },
      ],
    },
    {
      slug: "revops-carrierepad",
      title: "The RevOps career path: from Analyst to CRO",
      dek: "What does a career in Revenue Operations look like, and what steps lead toward leadership?",
      updated: "June 2026",
      sections: [
        {
          p: "Revenue Operations (RevOps) connects sales, marketing and customer success through data, processes and systems. It's one of the most strategic - and best-paid - career paths in go-to-market.",
        },
        {
          h: "Junior → Mid-level: Analyst & Specialist",
          p: "You often start as a RevOps Analyst or CRM/Marketing Ops Specialist: building reports, cleaning data, managing workflows in HubSpot or Salesforce and supporting the team with insights.",
        },
        {
          h: "Senior → Manager: process ownership",
          p: "As a Senior or Manager you own the end-to-end revenue process: forecasting, lead routing, territory and compensation planning, and the tech stack. You drive projects and sometimes a small team.",
        },
        {
          h: "Director → VP → CRO",
          p: "At leadership level you define the revenue strategy and architecture for the whole organisation. The ultimate step is Chief Revenue Officer (CRO), accountable for all commercial revenue.",
        },
        {
          h: "What do you earn per step?",
          p: "The GTM Salary Report shows median salary ranges per level - handy for benchmarking your next move.",
        },
      ],
    },
  ],
};

export function guidesFor(locale: Locale): Guide[] {
  return GUIDES[locale];
}
export function guideBySlug(locale: Locale, slug: string): Guide | undefined {
  return GUIDES[locale].find((g) => g.slug === slug);
}
export function guideSlugs(): string[] {
  return GUIDES.nl.map((g) => g.slug);
}

export const GTMAI_BLOG_URL: Record<Locale, string> = {
  nl: "https://gtmai.nl/blog",
  en: "https://gtmai.nl/en/blog",
};

export interface ExternalPost {
  title: string;
  href: string;
  dek: string;
}

/** Curated, role/discipline-focused articles from the GTM AI blog (gtmai.nl). */
export const GTMAI_POSTS: Record<Locale, ExternalPost[]> = {
  nl: [
    { title: "Wat is GTM Engineering?", href: "https://gtmai.nl/blog/wat-is-gtm-engineering", dek: "De rol die B2B-groei opnieuw definieert." },
    { title: "De stand van GTM Engineering in de Benelux (2026)", href: "https://gtmai.nl/blog/stand-van-gtm-engineering-benelux", dek: "Hoe ver is de Nederlandse en Belgische markt?" },
    { title: "Je eerste GTM Engineer aannemen", href: "https://gtmai.nl/blog/eerste-gtm-engineer-aannemen", dek: "Waar let je op bij de eerste hire." },
    { title: "GTM Engineering en RevOps: samen meer dan apart", href: "https://gtmai.nl/blog/gtm-engineering-en-revops-samen", dek: "Hoe de twee disciplines elkaar versterken." },
    { title: "RevOps: marketing, sales en service als één team", href: "https://gtmai.nl/blog/revops-marketing-sales-service", dek: "Waarom RevOps het verschil maakt in groei." },
    { title: "KPI's voor je GTM Engineering team", href: "https://gtmai.nl/blog/kpis-gtm-engineering-team", dek: "Waarop stuur je een GTM-team echt?" },
    { title: "De moderne GTM-stack ontleed", href: "https://gtmai.nl/blog/moderne-gtm-stack-ontleed", dek: "De tools achter moderne go-to-market." },
    { title: "GTM Engineering voor scale-ups in Nederland", href: "https://gtmai.nl/blog/gtm-engineering-scaleups-nederland", dek: "Wat werkt voor Nederlandse scale-ups." },
  ],
  en: [
    { title: "What is GTM Engineering?", href: "https://gtmai.nl/en/blog/what-is-gtm-engineering", dek: "The role redefining B2B growth." },
    { title: "The state of GTM Engineering in the Benelux (2026)", href: "https://gtmai.nl/en/blog/state-of-gtm-engineering-benelux", dek: "How far along are the Dutch and Belgian markets?" },
    { title: "Hiring your first GTM Engineer", href: "https://gtmai.nl/en/blog/hiring-your-first-gtm-engineer", dek: "What to look for in the first hire." },
    { title: "GTM Engineering and RevOps: better together", href: "https://gtmai.nl/en/blog/gtm-engineering-and-revops-together", dek: "How the two disciplines reinforce each other." },
    { title: "RevOps: marketing, sales and service as one team", href: "https://gtmai.nl/en/blog/revenue-operations-gtm-alignment", dek: "Why RevOps makes the difference in growth." },
    { title: "KPIs for your GTM Engineering team", href: "https://gtmai.nl/en/blog/kpis-for-gtm-engineering-team", dek: "What should you really steer a GTM team on?" },
    { title: "The modern GTM stack, dissected", href: "https://gtmai.nl/en/blog/modern-gtm-stack-explained", dek: "The tools behind modern go-to-market." },
    { title: "GTM Engineering for scale-ups", href: "https://gtmai.nl/en/blog/gtm-engineering-scaleups-netherlands", dek: "What works for fast-growing companies." },
  ],
};
