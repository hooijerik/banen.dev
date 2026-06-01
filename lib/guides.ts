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

export const GUIDES: Guide[] = [
  {
    slug: "wat-is-een-gtm-engineer",
    title: "Wat is een GTM Engineer?",
    dek: "De snelst groeiende rol in go-to-market: wat doet een GTM Engineer, welke skills heb je nodig en wat verdien je?",
    updated: "juni 2026",
    sections: [
      {
        p: "Een GTM Engineer (Go-to-Market Engineer) bouwt de geautomatiseerde, data-gedreven infrastructuur achter moderne sales- en marketingteams. Waar een SDR handmatig prospects benadert, bouwt een GTM Engineer systemen die dat op schaal doen — met enrichment, signalen en AI.",
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
        p: "Revenue Operations (RevOps) verbindt sales, marketing en customer success met data, processen en systemen. Het is een van de meest strategische — en best betaalde — carrièrepaden binnen go-to-market.",
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
        p: "Het GTM Salarisrapport toont mediane salarisranges per niveau in Nederland — handig om je volgende stap te benchmarken.",
      },
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

export const GTMAI_BLOG_URL = "https://gtmai.nl/blog";

export interface ExternalPost {
  title: string;
  href: string;
  dek: string;
}

/** Curated, role/discipline-focused articles from the GTM AI blog (gtmai.nl). */
export const GTMAI_POSTS: ExternalPost[] = [
  {
    title: "Wat is GTM Engineering?",
    href: "https://gtmai.nl/blog/wat-is-gtm-engineering",
    dek: "De rol die B2B-groei opnieuw definieert.",
  },
  {
    title: "De stand van GTM Engineering in de Benelux (2026)",
    href: "https://gtmai.nl/blog/stand-van-gtm-engineering-benelux",
    dek: "Hoe ver is de Nederlandse en Belgische markt?",
  },
  {
    title: "Je eerste GTM Engineer aannemen",
    href: "https://gtmai.nl/blog/eerste-gtm-engineer-aannemen",
    dek: "Waar let je op bij de eerste hire.",
  },
  {
    title: "GTM Engineering en RevOps: samen meer dan apart",
    href: "https://gtmai.nl/blog/gtm-engineering-en-revops-samen",
    dek: "Hoe de twee disciplines elkaar versterken.",
  },
  {
    title: "RevOps: marketing, sales en service als één team",
    href: "https://gtmai.nl/blog/revops-marketing-sales-service",
    dek: "Waarom RevOps het verschil maakt in groei.",
  },
  {
    title: "KPI's voor je GTM Engineering team",
    href: "https://gtmai.nl/blog/kpis-gtm-engineering-team",
    dek: "Waarop stuur je een GTM-team echt?",
  },
  {
    title: "De moderne GTM-stack ontleed",
    href: "https://gtmai.nl/blog/moderne-gtm-stack-ontleed",
    dek: "De tools achter moderne go-to-market.",
  },
  {
    title: "GTM Engineering voor scale-ups in Nederland",
    href: "https://gtmai.nl/blog/gtm-engineering-scaleups-nederland",
    dek: "Wat werkt voor Nederlandse scale-ups.",
  },
];
