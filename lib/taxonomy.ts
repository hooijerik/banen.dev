// Taxonomy + keyword dictionaries that drive classification and the UI.
// Keywords are lowercase. The classifier matches them with word boundaries.
// CATEGORIES are listed in CLASSIFICATION PRIORITY order (specific roles first,
// broad commercial roles last) — the first category whose keywords match wins.

import type { CategorySlug, SenioritySlug, WorkMode } from "./types";

export interface CategoryDef {
  slug: CategorySlug;
  label: string; // Dutch UI label
  group: "Commercieel" | "Operations" | "Strategie & Enablement" | "Overig";
  description: string; // Dutch, used on category landing pages
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "revops",
    label: "RevOps & Operations",
    group: "Operations",
    description:
      "Revenue Operations en het hele GTM-operations spectrum: RevOps, Sales/Marketing/CS Ops, GTM Engineering, CRM-beheer, Deal Desk, Enablement en commerciële strategie — de data, systemen en processen achter voorspelbare omzet.",
    keywords: [
      "revenue operations",
      "revops",
      "rev ops",
      "revenue operations manager",
      "head of revenue operations",
      "director revenue operations",
      "revenue operations analyst",
      "gtm engineer",
      "gtm engineering",
      "go-to-market engineer",
      "growth engineer",
      "marketing engineer",
      "outbound engineer",
      "sales operations",
      "sales ops",
      "sales operations manager",
      "sales operations analyst",
      "commercial operations",
      "commerciële operations",
      "commerciele operations",
      "marketing operations",
      "marketing ops",
      "mops",
      "marketing operations manager",
      "campaign operations",
      "marketing automation specialist",
      "marketing technologist",
      "martech",
      "customer success operations",
      "cs operations",
      "cs ops",
      "customer operations",
      "success operations",
      "salesforce administrator",
      "salesforce admin",
      "salesforce consultant",
      "salesforce developer",
      "hubspot administrator",
      "hubspot admin",
      "hubspot specialist",
      "hubspot consultant",
      "crm administrator",
      "crm administrateur",
      "crm manager",
      "crm specialist",
      "crm beheerder",
      "sales enablement",
      "revenue enablement",
      "gtm enablement",
      "commercial enablement",
      "enablement manager",
      "enablement specialist",
      "enablement",
      "deal desk",
      "dealdesk",
      "deal operations",
      "pricing manager",
      "pricing analyst",
      "pricing strategy",
      "cpq",
      "quote-to-cash",
      "quote to cash",
      "monetization",
      "gtm strategy",
      "go-to-market strategy",
      "revenue strategy",
      "commercial strategy",
      "sales strategy",
      "strategy & operations",
      "strategy and operations",
      "commercial excellence",
      "revenue planning",
    ],
  },
  {
    slug: "partnerships",
    label: "Partnerships",
    group: "Commercieel",
    description:
      "Partnerships & Alliances: het bouwen van channel-, technologie- en strategische partnerships die nieuwe omzet ontsluiten.",
    keywords: [
      "partnerships",
      "partnership manager",
      "partner manager",
      "partner success",
      "alliances",
      "strategic alliances",
      "channel manager",
      "channel sales",
      "channel partnerships",
      "strategic partnerships",
      "ecosystem manager",
    ],
  },
  {
    slug: "customer-success",
    label: "Customer Success",
    group: "Commercieel",
    description:
      "Customer Success: onboarding, adoptie, retentie en renewals — het laten slagen en groeien van klanten.",
    keywords: [
      "customer success",
      "customer success manager",
      "csm",
      "klantsucces",
      "customer experience manager",
      "onboarding manager",
      "onboarding specialist",
      "customer onboarding",
      "retention manager",
      "customer retention",
      "renewals",
      "renewal manager",
      "implementation manager",
      "implementation consultant",
      "value consultant",
      "customer experience",
      "cx",
    ],
  },
  {
    slug: "marketing",
    label: "Marketing",
    group: "Commercieel",
    description:
      "Marketing: demand generation, growth, content, product marketing en brand — de motor achter pipeline en bekendheid.",
    keywords: [
      "marketing",
      "marketing manager",
      "marketeer",
      "marketer",
      "demand generation",
      "demand gen",
      "growth marketing",
      "growth marketer",
      "growth hacker",
      "content marketing",
      "content marketeer",
      "product marketing",
      "product marketeer",
      "pmm",
      "brand manager",
      "field marketing",
      "performance marketing",
      "digital marketing",
      "online marketing",
      "seo specialist",
      "sea specialist",
      "campaign manager",
      "lifecycle marketing",
      "email marketing",
      "social media manager",
      "head of marketing",
      "marketing specialist",
      "communications manager",
      "growth manager",
      "growth lead",
      "paid social",
      "paid media",
      "paid search",
      "seo manager",
      "content manager",
    ],
  },
  {
    slug: "sales",
    label: "Sales",
    group: "Commercieel",
    description:
      "Sales: van SDR/BDR tot Account Executive en Sales Engineer — alle rollen die nieuwe en bestaande omzet binnenhalen.",
    keywords: [
      "sales",
      "account executive",
      "sales executive",
      "sales representative",
      "sales rep",
      "inside sales",
      "field sales",
      "new business",
      "business development representative",
      "bdr",
      "sales development representative",
      "sdr",
      "sales development",
      "sales manager",
      "head of sales",
      "vp sales",
      "vp of sales",
      "accountmanager",
      "account manager",
      "key account",
      "sales consultant",
      "commercieel medewerker",
      "commercieel adviseur",
      "verkoop",
      "verkoper",
      "sales engineer",
      "solutions engineer",
      "solutions consultant",
      "solution consultant",
      "pre-sales",
      "presales",
      "outbound",
      "relatiebeheerder",
      "enterprise sales",
      "business development",
      "business developer",
      "solutions architect",
      "commercial director",
      "commercial manager",
      "head of commercial",
      "sales director",
      "chief revenue officer",
    ],
  },
];

/** Hard exclusions: if NO GTM category matched and one of these is in the title, drop the job. */
export const HARD_EXCLUDE_KEYWORDS = [
  "software engineer",
  "software developer",
  "backend developer",
  "frontend developer",
  "full stack",
  "fullstack",
  "full-stack",
  "devops",
  "site reliability",
  "data engineer",
  "data scientist",
  "machine learning engineer",
  "qa engineer",
  "test engineer",
  "security engineer",
  "accountant",
  "boekhouder",
  "controller",
  "finance manager",
  "financieel",
  "recruiter",
  "recruitment consultant",
  "talent acquisition",
  "human resources",
  "people & culture",
  "office manager",
  "legal counsel",
  "legal",
  "jurist",
  "accounting",
  "accounts payable",
  "tax",
  "procurement",
  "ux designer",
  "ui designer",
  "product designer",
  "graphic designer",
  "scrum master",
  "software architect",
  "system administrator",
  "warehouse",
  "logistiek",
  "monteur",
  "verpleegkundige",
  "docent",
];

/** Broad GTM relevance signals — used to decide whether an unclassified role still belongs. */
export const GTM_SIGNAL_KEYWORDS = [
  "revenue",
  "go-to-market",
  "go to market",
  "gtm",
  "pipeline",
  "quota",
  "sales",
  "marketing",
  "customer success",
  "commercial",
  "commercieel",
  "demand",
  "growth",
  "partnerships",
  "crm",
  "account",
];

export interface SeniorityDef {
  slug: SenioritySlug;
  label: string;
  order: number;
  keywords: string[];
}

// Checked from most senior to least; first match wins.
export const SENIORITY: SeniorityDef[] = [
  {
    slug: "clevel",
    label: "C-level",
    order: 8,
    keywords: ["chief", "cro", "cmo", "cco", "ceo", "c-level", "cxo"],
  },
  {
    slug: "vp",
    label: "VP",
    order: 7,
    keywords: ["vp", "vice president", "svp"],
  },
  {
    slug: "director",
    label: "Director",
    order: 6,
    keywords: ["director", "directeur", "head of", "hoofd"],
  },
  {
    slug: "manager",
    label: "Manager",
    order: 5,
    keywords: ["manager", "teamlead", "team lead", "tech lead", "squad lead"],
  },
  {
    slug: "senior",
    label: "Senior",
    order: 4,
    keywords: ["senior", "sr"],
  },
  {
    slug: "medior",
    label: "Medior",
    order: 3,
    keywords: ["medior", "mid-level", "mid level"],
  },
  {
    slug: "junior",
    label: "Junior",
    order: 2,
    keywords: [
      "junior",
      "jr",
      "entry",
      "graduate",
      "starter",
      "trainee",
      "werkstudent",
      "intern",
      "internship",
      "stage",
      "stagiair",
      "afstudeer",
    ],
  },
];

export interface WorkModeDef {
  slug: WorkMode;
  label: string;
  keywords: string[];
}

export const WORK_MODES: WorkModeDef[] = [
  {
    slug: "remote",
    label: "Remote",
    keywords: [
      "remote",
      "fully remote",
      "remote-first",
      "remote first",
      "work from home",
      "thuiswerken",
      "op afstand",
      "anywhere",
    ],
  },
  {
    slug: "hybrid",
    label: "Hybride",
    keywords: ["hybrid", "hybride", "flexible working", "flexibel werken"],
  },
  {
    slug: "onsite",
    label: "Op kantoor",
    keywords: ["on-site", "on site", "onsite", "op kantoor", "office-based", "kantoor"],
  },
];

// 12 Dutch provinces.
export const PROVINCES = [
  "Drenthe",
  "Flevoland",
  "Friesland",
  "Gelderland",
  "Groningen",
  "Limburg",
  "Noord-Brabant",
  "Noord-Holland",
  "Overijssel",
  "Utrecht",
  "Zeeland",
  "Zuid-Holland",
] as const;

// Major NL cities -> province. Keys are lowercase.
export const CITY_PROVINCE: Record<string, string> = {
  amsterdam: "Noord-Holland",
  haarlem: "Noord-Holland",
  hilversum: "Noord-Holland",
  alkmaar: "Noord-Holland",
  zaandam: "Noord-Holland",
  hoofddorp: "Noord-Holland",
  amstelveen: "Noord-Holland",
  rotterdam: "Zuid-Holland",
  "den haag": "Zuid-Holland",
  "the hague": "Zuid-Holland",
  "'s-gravenhage": "Zuid-Holland",
  leiden: "Zuid-Holland",
  delft: "Zuid-Holland",
  zoetermeer: "Zuid-Holland",
  dordrecht: "Zuid-Holland",
  gouda: "Zuid-Holland",
  utrecht: "Utrecht",
  amersfoort: "Utrecht",
  nieuwegein: "Utrecht",
  veenendaal: "Utrecht",
  eindhoven: "Noord-Brabant",
  tilburg: "Noord-Brabant",
  breda: "Noord-Brabant",
  "den bosch": "Noord-Brabant",
  "'s-hertogenbosch": "Noord-Brabant",
  helmond: "Noord-Brabant",
  groningen: "Groningen",
  leeuwarden: "Friesland",
  assen: "Drenthe",
  emmen: "Drenthe",
  zwolle: "Overijssel",
  enschede: "Overijssel",
  deventer: "Overijssel",
  hengelo: "Overijssel",
  arnhem: "Gelderland",
  nijmegen: "Gelderland",
  apeldoorn: "Gelderland",
  ede: "Gelderland",
  almere: "Flevoland",
  lelystad: "Flevoland",
  maastricht: "Limburg",
  venlo: "Limburg",
  heerlen: "Limburg",
  sittard: "Limburg",
  middelburg: "Zeeland",
};

export interface ToolDef {
  slug: string;
  label: string;
  aliases: string[]; // lowercase match strings (label included implicitly)
}

export const TOOLS: ToolDef[] = [
  { slug: "salesforce", label: "Salesforce", aliases: ["salesforce", "sfdc", "sales cloud"] },
  { slug: "hubspot", label: "HubSpot", aliases: ["hubspot", "hub spot"] },
  { slug: "marketo", label: "Marketo", aliases: ["marketo"] },
  { slug: "pardot", label: "Pardot", aliases: ["pardot", "account engagement"] },
  { slug: "gainsight", label: "Gainsight", aliases: ["gainsight"] },
  { slug: "clay", label: "Clay", aliases: ["clay.com", "clay"] },
  { slug: "outreach", label: "Outreach", aliases: ["outreach.io"] },
  { slug: "salesloft", label: "Salesloft", aliases: ["salesloft", "sales loft"] },
  { slug: "apollo", label: "Apollo", aliases: ["apollo.io"] },
  { slug: "gong", label: "Gong", aliases: ["gong.io", "gong"] },
  { slug: "chorus", label: "Chorus", aliases: ["chorus.ai"] },
  { slug: "zoominfo", label: "ZoomInfo", aliases: ["zoominfo", "zoom info"] },
  { slug: "cognism", label: "Cognism", aliases: ["cognism"] },
  { slug: "lemlist", label: "lemlist", aliases: ["lemlist"] },
  { slug: "instantly", label: "Instantly", aliases: ["instantly.ai"] },
  { slug: "sales-navigator", label: "LinkedIn Sales Navigator", aliases: ["sales navigator"] },
  { slug: "n8n", label: "n8n", aliases: ["n8n"] },
  { slug: "zapier", label: "Zapier", aliases: ["zapier"] },
  { slug: "make", label: "Make", aliases: ["make.com", "integromat"] },
  { slug: "census", label: "Census", aliases: ["getcensus", "census.com"] },
  { slug: "hightouch", label: "Hightouch", aliases: ["hightouch"] },
  { slug: "segment", label: "Segment", aliases: ["segment.com", "twilio segment"] },
  { slug: "snowflake", label: "Snowflake", aliases: ["snowflake"] },
  { slug: "bigquery", label: "BigQuery", aliases: ["bigquery", "big query"] },
  { slug: "dbt", label: "dbt", aliases: ["dbt"] },
  { slug: "looker", label: "Looker", aliases: ["looker"] },
  { slug: "tableau", label: "Tableau", aliases: ["tableau"] },
  { slug: "power-bi", label: "Power BI", aliases: ["power bi", "powerbi", "power-bi"] },
  { slug: "mixpanel", label: "Mixpanel", aliases: ["mixpanel"] },
  { slug: "amplitude", label: "Amplitude", aliases: ["amplitude"] },
  { slug: "ga4", label: "Google Analytics", aliases: ["google analytics", "ga4"] },
  { slug: "intercom", label: "Intercom", aliases: ["intercom"] },
  { slug: "zendesk", label: "Zendesk", aliases: ["zendesk"] },
  { slug: "planhat", label: "Planhat", aliases: ["planhat"] },
  { slug: "vitally", label: "Vitally", aliases: ["vitally.io"] },
  { slug: "totango", label: "Totango", aliases: ["totango"] },
  { slug: "churnzero", label: "ChurnZero", aliases: ["churnzero"] },
  { slug: "aircall", label: "Aircall", aliases: ["aircall"] },
  { slug: "braze", label: "Braze", aliases: ["braze"] },
  { slug: "customer-io", label: "Customer.io", aliases: ["customer.io"] },
  { slug: "klaviyo", label: "Klaviyo", aliases: ["klaviyo"] },
  { slug: "pandadoc", label: "PandaDoc", aliases: ["pandadoc"] },
  { slug: "dealhub", label: "DealHub", aliases: ["dealhub"] },
  { slug: "excel", label: "Excel", aliases: ["microsoft excel", "ms excel"] },
];

export const COMPANY_SIZES = ["Startup", "Scale-up", "Mid-Market", "Enterprise"] as const;

// Lookups
export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));
export const SENIORITY_BY_SLUG = new Map(SENIORITY.map((s) => [s.slug, s]));
export const WORKMODE_BY_SLUG = new Map(WORK_MODES.map((w) => [w.slug, w]));
export const TOOL_BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

export function categoryLabel(slug: string): string {
  return CATEGORY_BY_SLUG.get(slug as CategorySlug)?.label ?? "Overig GTM";
}
export function seniorityLabel(slug: string | null): string {
  if (!slug) return "—";
  return SENIORITY_BY_SLUG.get(slug as SenioritySlug)?.label ?? "—";
}
export function workModeLabel(slug: string | null): string {
  if (!slug) return "—";
  return WORKMODE_BY_SLUG.get(slug as WorkMode)?.label ?? "—";
}
export function toolLabel(slug: string): string {
  return TOOL_BY_SLUG.get(slug)?.label ?? slug;
}
