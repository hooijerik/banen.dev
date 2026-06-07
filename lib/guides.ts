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
      slug: "frontend-backend-fullstack",
      title: "Frontend, backend of fullstack — welk pad kies je?",
      dek: "De drie hoofdrichtingen in development vergeleken: wat doe je, welke stack hoort erbij en wat past bij jou?",
      updated: "juni 2026",
      sections: [
        {
          p: "Bijna elke developer-carrière begint met dezelfde vraag: ga je voor de kant die gebruikers zien (frontend), de logica en data daarachter (backend), of allebei (fullstack)? Geen enkele keuze is definitief, maar ze sturen wel je eerste jaren en je tech-stack.",
        },
        {
          h: "Frontend",
          p: "Frontend-developers bouwen de interface: alles wat in de browser draait. Je werkt met HTML, CSS en JavaScript/TypeScript, en een framework als React, Vue, Angular of Svelte. De focus ligt op performance, toegankelijkheid en UX. Ben je visueel en detailgericht ingesteld? Dan voelt frontend snel als thuis.",
        },
        {
          h: "Backend",
          p: "Backend-developers bouwen de API's, services en datalaag: de logica die gebruikers niet zien. Talen als Node.js, Python, Java, Go, C# of PHP, met databases (PostgreSQL, MongoDB, Redis) en steeds vaker cloud en microservices. Houd je van datamodellen, schaalbaarheid en systemen die kloppen? Dan past backend.",
        },
        {
          h: "Fullstack",
          p: "Fullstack-developers werken over de hele stack — van database tot UI. Populair bij start-ups en scale-ups waar één engineer een feature end-to-end oppakt. Je hoeft geen expert in alles te zijn; de kracht zit in breedte en het kunnen schakelen tussen lagen.",
        },
        {
          h: "Welk pad past bij jou?",
          p: "Kijk naar wat je energie geeft én naar de vacatures: filter op de categorieën frontend, backend en fullstack en zie welke stacks en bedrijven je aanspreken. Het Developer Salarisrapport toont de mediane salarisranges per richting in Nederland en Vlaanderen.",
        },
      ],
    },
    {
      slug: "moderne-dev-stack",
      title: "De moderne dev-stack in Nederland & Vlaanderen",
      dek: "Welke talen, frameworks en tools vragen werkgevers in 2026? Een overzicht van de meest gevraagde technologieën.",
      updated: "juni 2026",
      sections: [
        {
          p: "De tech-stack die bedrijven vragen verschuift continu. Op basis van duizenden vacatures tekenen zich duidelijke favorieten af per laag van de stack — handig om te bepalen waar je je op richt.",
        },
        {
          h: "Talen",
          p: "TypeScript en JavaScript domineren de frontend en veel backends; Python is groot in data, ML en scripting; Java en C# blijven sterk in enterprise; Go en Rust groeien in platform- en infrastructuurrollen. Kotlin en Swift zijn de standaard voor mobile.",
        },
        {
          h: "Frameworks",
          p: "Aan de frontend: React (vaak met Next.js), met Vue, Angular en Svelte als sterke alternatieven. Aan de backend: Node.js, Spring, Django, FastAPI, Laravel en .NET. Filter op /tools/react, /tools/python of een andere technologie om te zien wie ermee werkt.",
        },
        {
          h: "Platform & data",
          p: "Containers en cloud zijn de standaard: Docker en Kubernetes, op AWS, GCP of Azure, met Terraform voor infra-as-code. In data: dbt, Airflow, Snowflake, Spark en Kafka. ML-teams draaien op PyTorch en TensorFlow.",
        },
        {
          h: "Hoe gebruik je dit?",
          p: "Gebruik de tech-stackpagina's als kompas: elke technologie heeft een eigen pagina met openstaande vacatures. Zo zie je in één oogopslag welke skills de markt nu vraagt.",
        },
      ],
    },
  ],
  en: [
    {
      slug: "frontend-backend-fullstack",
      title: "Frontend, backend or fullstack — which path?",
      dek: "The three main directions in development compared: what you do, the stack involved and which fits you.",
      updated: "June 2026",
      sections: [
        {
          p: "Almost every developer career starts with the same question: do you build the side users see (frontend), the logic and data behind it (backend), or both (fullstack)? No choice is final, but it shapes your first years and your tech stack.",
        },
        {
          h: "Frontend",
          p: "Frontend developers build the interface: everything that runs in the browser. You work with HTML, CSS and JavaScript/TypeScript, plus a framework like React, Vue, Angular or Svelte. The focus is on performance, accessibility and UX. Visual and detail-oriented? Frontend will feel like home.",
        },
        {
          h: "Backend",
          p: "Backend developers build the APIs, services and data layer: the logic users don't see. Languages like Node.js, Python, Java, Go, C# or PHP, with databases (PostgreSQL, MongoDB, Redis) and increasingly cloud and microservices. Love data models, scalability and systems that hold together? Backend fits.",
        },
        {
          h: "Fullstack",
          p: "Fullstack developers work across the whole stack — from database to UI. Popular at start-ups and scale-ups where one engineer ships a feature end to end. You don't need to be an expert in everything; the strength is breadth and switching between layers.",
        },
        {
          h: "Which path fits you?",
          p: "Look at what energises you and at the jobs: filter by the frontend, backend and fullstack categories and see which stacks and companies appeal. The Developer Salary Report shows median ranges per direction in the Netherlands and Flanders.",
        },
      ],
    },
    {
      slug: "moderne-dev-stack",
      title: "The modern dev stack in the Netherlands & Flanders",
      dek: "Which languages, frameworks and tools are employers asking for in 2026? An overview of the most-requested technologies.",
      updated: "June 2026",
      sections: [
        {
          p: "The stack companies ask for shifts constantly. Across thousands of jobs, clear favourites emerge per layer of the stack — useful for deciding where to focus.",
        },
        {
          h: "Languages",
          p: "TypeScript and JavaScript dominate the frontend and many backends; Python is big in data, ML and scripting; Java and C# stay strong in enterprise; Go and Rust are growing in platform and infrastructure roles. Kotlin and Swift are the standard for mobile.",
        },
        {
          h: "Frameworks",
          p: "On the frontend: React (often with Next.js), with Vue, Angular and Svelte as strong alternatives. On the backend: Node.js, Spring, Django, FastAPI, Laravel and .NET. Filter on /tools/react, /tools/python or any other technology to see who works with it.",
        },
        {
          h: "Platform & data",
          p: "Containers and cloud are standard: Docker and Kubernetes, on AWS, GCP or Azure, with Terraform for infrastructure as code. In data: dbt, Airflow, Snowflake, Spark and Kafka. ML teams run on PyTorch and TensorFlow.",
        },
        {
          h: "How to use this",
          p: "Use the tech-stack pages as a compass: every technology has its own page with open jobs. You can see at a glance which skills the market wants right now.",
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

/** External blog feed (optional). Empty for now — the "from our blog" section on the
 *  insights page hides itself when there are no posts. Populate when banen.dev has a blog. */
export const GTMAI_BLOG_URL: Record<Locale, string> = {
  nl: "/inzichten",
  en: "/inzichten",
};

export interface ExternalPost {
  title: string;
  href: string;
  dek: string;
}

export const GTMAI_POSTS: Record<Locale, ExternalPost[]> = {
  nl: [],
  en: [],
};
