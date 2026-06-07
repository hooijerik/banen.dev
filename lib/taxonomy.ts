// Taxonomy + keyword dictionaries that drive classification and the UI.
// Keywords are lowercase. The classifier matches them with word boundaries.
// CATEGORIES are listed in CLASSIFICATION PRIORITY order (specific roles first,
// broad commercial roles last) - the first category whose keywords match wins.

import type { CategorySlug, SenioritySlug, WorkMode } from "./types";
import type { Locale } from "./i18n/config";

export interface CategoryDef {
  slug: CategorySlug;
  label: string; // Dutch UI label
  labelEn?: string; // English label (falls back to `label`)
  group: "Software" | "Platform & Data" | "Kwaliteit & Security" | "Embedded" | "Overig";
  description: string; // Dutch, used on category landing pages
  descriptionEn?: string; // English description (falls back to `description`)
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "embedded",
    label: "Embedded & Firmware",
    group: "Embedded",
    description:
      "Embedded software, firmware en low-level development voor hardware, IoT en devices - C/C++, RTOS, microcontrollers en de code dichtbij de chip.",
    descriptionEn:
      "Embedded software, firmware and low-level development for hardware, IoT and devices - C/C++, RTOS, microcontrollers and the code close to the metal.",
    keywords: [
      "embedded",
      "embedded software",
      "embedded engineer",
      "embedded developer",
      "embedded software engineer",
      "firmware",
      "firmware engineer",
      "firmware developer",
      "embedded c",
      "rtos",
      "microcontroller",
      "iot developer",
      "iot engineer",
      "fpga engineer",
      "fpga developer",
    ],
  },
  {
    slug: "security",
    label: "Security",
    group: "Kwaliteit & Security",
    description:
      "Security engineering: application security, DevSecOps, penetration testing en cloud security - veilige software en infrastructuur bouwen en bewaken.",
    descriptionEn:
      "Security engineering: application security, DevSecOps, penetration testing and cloud security - building and guarding secure software and infrastructure.",
    keywords: [
      "security engineer",
      "security software engineer",
      "application security",
      "appsec",
      "devsecops",
      "product security",
      "cloud security engineer",
      "penetration tester",
      "pentester",
      "ethical hacker",
      "offensive security",
      "security developer",
    ],
  },
  {
    slug: "qa",
    label: "QA & Test",
    group: "Kwaliteit & Security",
    description:
      "Quality assurance en testautomatisering: van SDET tot test automation engineer - betrouwbare software via geautomatiseerde tests en CI-checks.",
    descriptionEn:
      "Quality assurance and test automation: from SDET to test automation engineer - reliable software through automated tests and CI checks.",
    keywords: [
      "qa engineer",
      "qa automation",
      "qa developer",
      "quality engineer",
      "test engineer",
      "test automation",
      "test automation engineer",
      "automation tester",
      "sdet",
      "software development engineer in test",
      "testautomatisering",
      "test automation specialist",
    ],
  },
  {
    slug: "data-ml",
    label: "Data & ML/AI",
    group: "Platform & Data",
    description:
      "Data science, machine learning en AI engineering: modellen bouwen, trainen en in productie brengen - MLOps, LLM's, NLP en data-gedreven features.",
    descriptionEn:
      "Data science, machine learning and AI engineering: building, training and shipping models - MLOps, LLMs, NLP and data-driven features.",
    keywords: [
      "machine learning engineer",
      "ml engineer",
      "ml ops",
      "mlops",
      "machine learning",
      "deep learning",
      "data scientist",
      "data science",
      "ai engineer",
      "ai developer",
      "applied scientist",
      "research engineer",
      "nlp engineer",
      "computer vision engineer",
      "llm engineer",
    ],
  },
  {
    slug: "data-engineering",
    label: "Data Engineering",
    group: "Platform & Data",
    description:
      "Data engineering: data pipelines, warehouses en platforms - ETL/ELT, streaming en de infrastructuur achter analytics en machine learning.",
    descriptionEn:
      "Data engineering: data pipelines, warehouses and platforms - ETL/ELT, streaming and the infrastructure behind analytics and machine learning.",
    keywords: [
      "data engineer",
      "data engineering",
      "analytics engineer",
      "big data engineer",
      "data platform engineer",
      "data warehouse engineer",
      "etl developer",
      "etl",
      "elt",
      "data pipeline",
      "data infrastructure",
      "bi developer",
    ],
  },
  {
    slug: "devops",
    label: "DevOps & Platform",
    group: "Platform & Data",
    description:
      "DevOps, SRE en platform engineering: CI/CD, cloud-infrastructuur, Kubernetes en betrouwbaarheid - de basis waarop software draait en schaalt.",
    descriptionEn:
      "DevOps, SRE and platform engineering: CI/CD, cloud infrastructure, Kubernetes and reliability - the foundation software runs and scales on.",
    keywords: [
      "devops",
      "devops engineer",
      "site reliability",
      "site reliability engineer",
      "sre",
      "platform engineer",
      "platform engineering",
      "infrastructure engineer",
      "infra engineer",
      "cloud engineer",
      "cloud architect",
      "kubernetes engineer",
      "systems engineer",
      "ci/cd engineer",
      "release engineer",
      "build engineer",
    ],
  },
  {
    slug: "mobile",
    label: "Mobile",
    group: "Software",
    description:
      "Mobile development: native iOS/Android en cross-platform apps - Swift, Kotlin, React Native en Flutter, van prototype tot store.",
    descriptionEn:
      "Mobile development: native iOS/Android and cross-platform apps - Swift, Kotlin, React Native and Flutter, from prototype to store.",
    keywords: [
      "ios developer",
      "ios engineer",
      "android developer",
      "android engineer",
      "mobile developer",
      "mobile engineer",
      "mobile app developer",
      "app developer",
      "react native",
      "flutter developer",
      "swift developer",
      "kotlin developer",
    ],
  },
  {
    slug: "fullstack",
    label: "Fullstack",
    group: "Software",
    description:
      "Fullstack development: end-to-end webapplicaties bouwen, van database en API tot UI - één engineer over de hele stack.",
    descriptionEn:
      "Fullstack development: building end-to-end web applications, from database and API to UI - one engineer across the whole stack.",
    keywords: [
      "fullstack",
      "full stack",
      "full-stack",
      "fullstack developer",
      "full stack developer",
      "full-stack developer",
      "fullstack engineer",
      "full stack engineer",
      "full-stack engineer",
    ],
  },
  {
    slug: "frontend",
    label: "Frontend",
    group: "Software",
    description:
      "Frontend development: gebruikersinterfaces en web-apps in React, Vue, Angular of Svelte - performance, toegankelijkheid en UX in code.",
    descriptionEn:
      "Frontend development: user interfaces and web apps in React, Vue, Angular or Svelte - performance, accessibility and UX in code.",
    keywords: [
      "frontend",
      "front-end",
      "front end",
      "frontend developer",
      "front-end developer",
      "frontend engineer",
      "front-end engineer",
      "react developer",
      "vue developer",
      "angular developer",
      "javascript developer",
      "typescript developer",
      "ui engineer",
      "ui developer",
      "web developer",
    ],
  },
  {
    slug: "backend",
    label: "Backend",
    group: "Software",
    description:
      "Backend development: API's, services en server-side logica - Node, Python, Java, Go, .NET en de databases erachter.",
    descriptionEn:
      "Backend development: APIs, services and server-side logic - Node, Python, Java, Go, .NET and the databases behind them.",
    keywords: [
      "backend",
      "back-end",
      "back end",
      "backend developer",
      "back-end developer",
      "backend engineer",
      "back-end engineer",
      "node.js developer",
      "java developer",
      "python developer",
      "golang developer",
      "go developer",
      "php developer",
      "ruby developer",
      ".net developer",
      "c# developer",
      "rust developer",
      "scala developer",
      "api developer",
      "server-side",
    ],
  },
  {
    // Catch-all for developer roles that don't match a specific category.
    // Empty keywords on purpose: classify() assigns "overig" as a fallback, it is
    // never matched by detectCategory. Kept out of the featured pill rows (home/footer).
    slug: "overig",
    label: "Overig dev",
    labelEn: "Other dev",
    group: "Overig",
    description:
      "Overige developer-rollen: software-functies die niet in een van de hoofdcategorieën vallen, van generalisten en tech leads tot nieuwe en hybride rollen.",
    descriptionEn:
      "Other developer roles: software jobs that don't fit one of the main categories, from generalists and tech leads to new and hybrid roles.",
    keywords: [],
  },
];

/** Hard exclusions: if NO dev category matched and one of these is in the title, drop the job.
 *  This is a developer board, so the excludes are the GTM / business / non-engineering roles
 *  (including ones that contain a DEV_SIGNAL word, e.g. "business developer"). */
export const HARD_EXCLUDE_KEYWORDS = [
  // GTM / commercial
  "business developer",
  "business development",
  "account executive",
  "account manager",
  "accountmanager",
  "sales manager",
  "sales representative",
  "sales engineer",
  "solutions engineer",
  "solutions consultant",
  "customer success",
  "marketing manager",
  "marketeer",
  "growth marketer",
  "partnerships",
  "partner manager",
  "recruiter",
  "talent acquisition",
  "commercieel",
  "verkoper",
  // Product / design / delivery (not a developer role)
  "product manager",
  "product owner",
  "ux designer",
  "ui designer",
  "product designer",
  "graphic designer",
  "scrum master",
  "agile coach",
  "project manager",
  "data analyst",
  "business analyst",
  // Finance / legal / HR / ops
  "accountant",
  "boekhouder",
  "controller",
  "finance manager",
  "financieel",
  "human resources",
  "office manager",
  "legal counsel",
  "legal",
  "jurist",
  "accounting",
  "tax",
  "procurement",
  // IT-support / non-software-engineering
  "system administrator",
  "systeembeheerder",
  "helpdesk",
  "it support",
  "service desk",
  "network engineer",
  // Other
  "warehouse",
  "logistiek",
  "monteur",
  "verpleegkundige",
  "docent",
];

/** Broad developer-relevance signals - used to decide whether an unclassified role still belongs
 *  (lands it in "overig" rather than being dropped). Kept narrow so GTM "X engineer" titles
 *  (sales/solutions engineer) are NOT pulled in - those have no dev signal and are dropped. */
export const DEV_SIGNAL_KEYWORDS = [
  "software engineer",
  "software developer",
  "software engineering",
  "software development",
  "developer",
  "ontwikkelaar",
  "programmeur",
  "programmer",
  "engineering manager",
  "tech lead",
  "swe",
];

export interface SeniorityDef {
  slug: SenioritySlug;
  label: string;
  labelEn?: string;
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
    labelEn: "Mid-level",
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
  labelEn?: string;
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
    labelEn: "Hybrid",
    keywords: ["hybrid", "hybride", "flexible working", "flexibel werken"],
  },
  {
    slug: "onsite",
    label: "Op kantoor",
    labelEn: "On-site",
    keywords: ["on-site", "on site", "onsite", "op kantoor", "office-based", "kantoor"],
  },
];

// 12 Dutch provinces + the 5 Flemish provinces and Brussels (Dutch-speaking Belgium).
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
  "Antwerpen",
  "Oost-Vlaanderen",
  "West-Vlaanderen",
  "Vlaams-Brabant",
  "Limburg (België)",
  "Brussel",
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

// Flemish + Brussels cities -> region (Dutch-speaking Belgium). Keys lowercase, NL + EN spellings.
export const BE_CITY_PROVINCE: Record<string, string> = {
  antwerpen: "Antwerpen",
  antwerp: "Antwerpen",
  mechelen: "Antwerpen",
  turnhout: "Antwerpen",
  gent: "Oost-Vlaanderen",
  ghent: "Oost-Vlaanderen",
  aalst: "Oost-Vlaanderen",
  "sint-niklaas": "Oost-Vlaanderen",
  brugge: "West-Vlaanderen",
  bruges: "West-Vlaanderen",
  kortrijk: "West-Vlaanderen",
  roeselare: "West-Vlaanderen",
  oostende: "West-Vlaanderen",
  ostend: "West-Vlaanderen",
  leuven: "Vlaams-Brabant",
  louvain: "Vlaams-Brabant",
  vilvoorde: "Vlaams-Brabant",
  zaventem: "Vlaams-Brabant",
  hasselt: "Limburg (België)",
  genk: "Limburg (België)",
  brussel: "Brussel",
  brussels: "Brussel",
  bruxelles: "Brussel",
};

export interface ToolDef {
  slug: string;
  label: string;
  aliases: string[]; // lowercase match strings (label included implicitly)
}

// Tech stack detected from the posting text. Aliases are matched with a word boundary
// (?<![a-z0-9])…(?![a-z0-9]); the bare display label is NOT auto-matched, so every match
// string lives in `aliases`. Short/ambiguous names (go, node, rest, c, spring, js, ts) are
// written out (golang, node.js, …) to avoid matching ordinary prose.
export const TOOLS: ToolDef[] = [
  // --- languages ---
  { slug: "typescript", label: "TypeScript", aliases: ["typescript"] },
  { slug: "javascript", label: "JavaScript", aliases: ["javascript"] },
  { slug: "python", label: "Python", aliases: ["python"] },
  { slug: "java", label: "Java", aliases: ["java"] },
  { slug: "go", label: "Go", aliases: ["golang", "go lang"] },
  { slug: "csharp", label: "C#", aliases: ["c#", "csharp"] },
  { slug: "dotnet", label: ".NET", aliases: [".net", "dotnet", "asp.net", ".net core"] },
  { slug: "cpp", label: "C++", aliases: ["c++", "cpp"] },
  { slug: "php", label: "PHP", aliases: ["php"] },
  { slug: "ruby", label: "Ruby", aliases: ["ruby"] },
  { slug: "rust", label: "Rust", aliases: ["rust"] },
  { slug: "kotlin", label: "Kotlin", aliases: ["kotlin"] },
  { slug: "swift", label: "Swift", aliases: ["swift"] },
  { slug: "scala", label: "Scala", aliases: ["scala"] },
  { slug: "elixir", label: "Elixir", aliases: ["elixir"] },
  { slug: "dart", label: "Dart", aliases: ["dart"] },
  { slug: "objective-c", label: "Objective-C", aliases: ["objective-c", "objective c"] },
  // --- frontend ---
  { slug: "react", label: "React", aliases: ["react", "react.js", "reactjs"] },
  { slug: "vue", label: "Vue", aliases: ["vue", "vue.js", "vuejs"] },
  { slug: "angular", label: "Angular", aliases: ["angular", "angularjs"] },
  { slug: "svelte", label: "Svelte", aliases: ["svelte", "sveltekit"] },
  { slug: "nextjs", label: "Next.js", aliases: ["next.js", "nextjs"] },
  { slug: "nuxt", label: "Nuxt", aliases: ["nuxt", "nuxt.js"] },
  { slug: "remix", label: "Remix", aliases: ["remix.run", "remix"] },
  { slug: "astro", label: "Astro", aliases: ["astro"] },
  { slug: "tailwind", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss"] },
  { slug: "redux", label: "Redux", aliases: ["redux"] },
  { slug: "webpack", label: "Webpack", aliases: ["webpack"] },
  { slug: "vite", label: "Vite", aliases: ["vite"] },
  // --- backend / API ---
  { slug: "nodejs", label: "Node.js", aliases: ["node.js", "nodejs", "node js"] },
  { slug: "express", label: "Express", aliases: ["express.js", "expressjs"] },
  { slug: "nestjs", label: "NestJS", aliases: ["nestjs", "nest.js"] },
  { slug: "django", label: "Django", aliases: ["django"] },
  { slug: "flask", label: "Flask", aliases: ["flask"] },
  { slug: "fastapi", label: "FastAPI", aliases: ["fastapi", "fast api"] },
  { slug: "spring", label: "Spring", aliases: ["spring boot", "springboot", "spring framework"] },
  { slug: "rails", label: "Ruby on Rails", aliases: ["ruby on rails", "rails"] },
  { slug: "laravel", label: "Laravel", aliases: ["laravel"] },
  { slug: "symfony", label: "Symfony", aliases: ["symfony"] },
  { slug: "graphql", label: "GraphQL", aliases: ["graphql"] },
  { slug: "grpc", label: "gRPC", aliases: ["grpc"] },
  // --- mobile ---
  { slug: "react-native", label: "React Native", aliases: ["react native", "react-native"] },
  { slug: "flutter", label: "Flutter", aliases: ["flutter"] },
  { slug: "swiftui", label: "SwiftUI", aliases: ["swiftui", "swift ui"] },
  // --- databases ---
  { slug: "postgresql", label: "PostgreSQL", aliases: ["postgresql", "postgres", "postgre"] },
  { slug: "mysql", label: "MySQL", aliases: ["mysql"] },
  { slug: "mongodb", label: "MongoDB", aliases: ["mongodb", "mongo"] },
  { slug: "redis", label: "Redis", aliases: ["redis"] },
  { slug: "elasticsearch", label: "Elasticsearch", aliases: ["elasticsearch", "elastic search", "elastic"] },
  { slug: "cassandra", label: "Cassandra", aliases: ["cassandra"] },
  { slug: "dynamodb", label: "DynamoDB", aliases: ["dynamodb", "dynamo db"] },
  { slug: "neo4j", label: "Neo4j", aliases: ["neo4j"] },
  { slug: "sql-server", label: "SQL Server", aliases: ["sql server", "mssql"] },
  // --- cloud ---
  { slug: "aws", label: "AWS", aliases: ["aws", "amazon web services"] },
  { slug: "gcp", label: "Google Cloud", aliases: ["gcp", "google cloud"] },
  { slug: "azure", label: "Azure", aliases: ["azure", "microsoft azure"] },
  // --- devops / CI / observability ---
  { slug: "docker", label: "Docker", aliases: ["docker"] },
  { slug: "kubernetes", label: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { slug: "terraform", label: "Terraform", aliases: ["terraform"] },
  { slug: "ansible", label: "Ansible", aliases: ["ansible"] },
  { slug: "pulumi", label: "Pulumi", aliases: ["pulumi"] },
  { slug: "jenkins", label: "Jenkins", aliases: ["jenkins"] },
  { slug: "github-actions", label: "GitHub Actions", aliases: ["github actions"] },
  { slug: "gitlab-ci", label: "GitLab CI", aliases: ["gitlab ci", "gitlab-ci"] },
  { slug: "circleci", label: "CircleCI", aliases: ["circleci", "circle ci"] },
  { slug: "argocd", label: "Argo CD", aliases: ["argocd", "argo cd"] },
  { slug: "helm", label: "Helm", aliases: ["helm"] },
  { slug: "prometheus", label: "Prometheus", aliases: ["prometheus"] },
  { slug: "grafana", label: "Grafana", aliases: ["grafana"] },
  { slug: "datadog", label: "Datadog", aliases: ["datadog"] },
  // --- testing ---
  { slug: "jest", label: "Jest", aliases: ["jest"] },
  { slug: "vitest", label: "Vitest", aliases: ["vitest"] },
  { slug: "cypress", label: "Cypress", aliases: ["cypress"] },
  { slug: "playwright", label: "Playwright", aliases: ["playwright"] },
  { slug: "selenium", label: "Selenium", aliases: ["selenium"] },
  { slug: "pytest", label: "pytest", aliases: ["pytest"] },
  { slug: "junit", label: "JUnit", aliases: ["junit"] },
  // --- data / ML ---
  { slug: "spark", label: "Apache Spark", aliases: ["apache spark", "spark"] },
  { slug: "airflow", label: "Airflow", aliases: ["airflow"] },
  { slug: "dbt", label: "dbt", aliases: ["dbt"] },
  { slug: "kafka", label: "Kafka", aliases: ["kafka"] },
  { slug: "snowflake", label: "Snowflake", aliases: ["snowflake"] },
  { slug: "bigquery", label: "BigQuery", aliases: ["bigquery", "big query"] },
  { slug: "databricks", label: "Databricks", aliases: ["databricks"] },
  { slug: "hadoop", label: "Hadoop", aliases: ["hadoop"] },
  { slug: "tensorflow", label: "TensorFlow", aliases: ["tensorflow"] },
  { slug: "pytorch", label: "PyTorch", aliases: ["pytorch"] },
  { slug: "scikit-learn", label: "scikit-learn", aliases: ["scikit-learn", "scikit learn", "sklearn"] },
  { slug: "pandas", label: "pandas", aliases: ["pandas"] },
  { slug: "numpy", label: "NumPy", aliases: ["numpy"] },
  // --- version control ---
  { slug: "git", label: "Git", aliases: ["git"] },
  { slug: "github", label: "GitHub", aliases: ["github"] },
  { slug: "gitlab", label: "GitLab", aliases: ["gitlab"] },
  { slug: "bitbucket", label: "Bitbucket", aliases: ["bitbucket"] },
];

export const COMPANY_SIZES = ["Startup", "Scale-up", "Mid-Market", "Enterprise"] as const;

// Lookups
export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));
export const SENIORITY_BY_SLUG = new Map(SENIORITY.map((s) => [s.slug, s]));
export const WORKMODE_BY_SLUG = new Map(WORK_MODES.map((w) => [w.slug, w]));
export const TOOL_BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

function pickLabel(
  def: { label: string; labelEn?: string } | undefined,
  locale: Locale,
): string | undefined {
  if (!def) return undefined;
  return locale === "en" ? (def.labelEn ?? def.label) : def.label;
}
export function categoryLabel(slug: string, locale: Locale = "nl"): string {
  return (
    pickLabel(CATEGORY_BY_SLUG.get(slug as CategorySlug), locale) ??
    (locale === "en" ? "Other dev" : "Overig dev")
  );
}
export function categoryDescription(slug: string, locale: Locale = "nl"): string {
  const def = CATEGORY_BY_SLUG.get(slug as CategorySlug);
  if (!def) return "";
  return locale === "en" ? (def.descriptionEn ?? def.description) : def.description;
}
export function seniorityLabel(slug: string | null, locale: Locale = "nl"): string {
  if (!slug) return "-";
  return pickLabel(SENIORITY_BY_SLUG.get(slug as SenioritySlug), locale) ?? "-";
}
export function workModeLabel(slug: string | null, locale: Locale = "nl"): string {
  if (!slug) return "-";
  return pickLabel(WORKMODE_BY_SLUG.get(slug as WorkMode), locale) ?? "-";
}
export function toolLabel(slug: string): string {
  return TOOL_BY_SLUG.get(slug)?.label ?? slug;
}
