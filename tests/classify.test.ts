// Lightweight test runner (no framework). Run with: npm test
import {
  classify,
  detectCategory,
  detectSeniority,
  detectWorkMode,
  detectLocation,
  detectTools,
  detectAI,
  parseSalary,
  detectTextLanguage,
} from "../lib/classify";
import type { RawJob } from "../lib/types";

let pass = 0;
const fails: string[] = [];
function check(name: string, cond: boolean) {
  if (cond) pass++;
  else fails.push(name);
}
function eq<T>(name: string, got: T, want: T) {
  check(`${name} → got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`, got === want);
}
function job(title: string, extra: Partial<RawJob> = {}): RawJob {
  return { source: "greenhouse", sourceId: "x", companyName: "Acme", title, url: "https://x", ...extra };
}

// ---- category (first matching keyword wins; specialties are ordered before the broad buckets) ----
eq("Frontend", detectCategory("Senior Frontend Developer"), "frontend");
eq("React→frontend", detectCategory("React Developer"), "frontend");
eq("Backend", detectCategory("Backend Engineer"), "backend");
eq("Python→backend", detectCategory("Python Developer"), "backend");
eq("Fullstack", detectCategory("Full Stack Developer"), "fullstack");
eq("Fullstack beats frontend/backend", detectCategory("Fullstack Engineer (React/Node)"), "fullstack");
eq("Mobile", detectCategory("iOS Developer"), "mobile");
eq("React Native→mobile (not frontend)", detectCategory("React Native Developer"), "mobile");
eq("DevOps", detectCategory("DevOps Engineer"), "devops");
eq("SRE→devops", detectCategory("Site Reliability Engineer"), "devops");
eq("Platform→devops", detectCategory("Platform Engineer"), "devops");
eq("Data Engineer", detectCategory("Data Engineer"), "data-engineering");
eq("ML→data-ml", detectCategory("Machine Learning Engineer"), "data-ml");
eq("Data Scientist→data-ml", detectCategory("Data Scientist"), "data-ml");
eq("QA", detectCategory("QA Automation Engineer"), "qa");
eq("SDET→qa", detectCategory("SDET"), "qa");
eq("Security", detectCategory("Security Engineer"), "security");
eq("Embedded", detectCategory("Embedded Software Engineer"), "embedded");
eq("Firmware→embedded", detectCategory("Firmware Engineer"), "embedded");
eq("Generic SWE returns null (→overig)", detectCategory("Software Engineer"), null);
eq("Non-dev returns null", detectCategory("Account Executive"), null);

// ---- seniority ----
eq("senior", detectSeniority("Senior Backend Developer"), "senior");
eq("manager", detectSeniority("Engineering Manager"), "manager");
eq("director via head of", detectSeniority("Head of Engineering"), "director");
eq("vp", detectSeniority("VP of Engineering"), "vp");
eq("clevel", detectSeniority("Chief Technology Officer"), "clevel");
eq("junior via stage", detectSeniority("Stagiair Software Developer"), "junior");
eq("no seniority", detectSeniority("Backend Developer"), null);
eq("senior manager is manager", detectSeniority("Senior Engineering Manager"), "manager");

// ---- relevance gate (dev kept; GTM / non-engineering dropped) ----
check("category dev role kept", classify(job("Senior Backend Developer")).relevant === true);
check("generic SWE kept via signal", classify(job("Software Engineer")).relevant === true);
eq("generic SWE lands in overig", classify(job("Software Engineer")).category, "overig");
check("Ontwikkelaar kept (NL signal)", classify(job("Software Ontwikkelaar")).relevant === true);
check("Sales Manager dropped", classify(job("Sales Manager")).relevant === false);
check("Recruiter dropped", classify(job("Technical Recruiter")).relevant === false);
check("Product Manager dropped", classify(job("Product Manager")).relevant === false);
check("Account Executive dropped", classify(job("Account Executive")).relevant === false);
// "Business Developer" contains "developer" but is a sales role → must be excluded:
check("Business Developer dropped despite 'developer'", classify(job("Business Developer")).relevant === false);
// GTM "X engineer" titles have no dev signal and no dev category → dropped:
check("Sales Engineer dropped", classify(job("Sales Engineer")).relevant === false);

// ---- work mode ----
eq("onsite from city", detectWorkMode("Amsterdam", ""), "onsite");
eq("remote", detectWorkMode("Remote (Netherlands)", ""), "remote");
eq("hybrid", detectWorkMode("Hybrid - Utrecht", ""), "hybrid");

// ---- location ----
const ams = detectLocation("Amsterdam, Netherlands", "");
eq("ams city", ams.city, "Amsterdam");
eq("ams province", ams.province, "Noord-Holland");
eq("ams country", ams.country, "NL");
check("ams nlRelevant", ams.nlRelevant === true);
const us = detectLocation("Remote, United States", "");
check("US not nlRelevant", us.nlRelevant === false);
check("EU remote nlRelevant", detectLocation("Remote - Europe", "").nlRelevant === true);

// ---- remote eligibility from the Netherlands ----
check("plain remote kept", detectLocation("Remote", "").nlRelevant === true);
check("EMEA remote kept", detectLocation("Remote (EMEA)", "").nlRelevant === true);
check("Remote - US loc blocked", detectLocation("Remote - US", "").nlRelevant === false);
check(
  "US work-auth in desc blocked",
  detectLocation("Remote", "You must be authorized to work in the United States.").nlRelevant === false,
);
check(
  "US-based abbr in desc blocked",
  detectLocation("Remote", "This is a US-based role.").nlRelevant === false,
);
check(
  "Canada-only blocked",
  detectLocation("Remote", "Open to candidates based in Canada only.").nlRelevant === false,
);
check(
  "Europe+US kept (EU wins)",
  detectLocation("Remote", "Open to candidates in Europe and the United States.").nlRelevant === true,
);
check(
  "join-us pronoun not blocked",
  detectLocation("Remote", "About us. Join us! Contact us. We must be based here.").nlRelevant === true,
);
check(
  "non-EU territory in title blocked",
  classify(job("Backend Developer - South Africa", { locationRaw: "Remote" })).location.nlRelevant === false,
);
check(
  "EU territory in title kept",
  classify(job("Backend Developer - Benelux", { locationRaw: "Remote" })).location.nlRelevant === true,
);

// ---- Dutch-speaking Belgium (Flanders) ----
const gent = detectLocation("Gent, Belgium", "");
eq("gent city", gent.city, "Gent");
eq("gent province", gent.province, "Oost-Vlaanderen");
eq("gent country", gent.country, "BE");
check("gent nlRelevant", gent.nlRelevant === true);
check("Antwerpen kept", detectLocation("Antwerpen", "").nlRelevant === true);
check("Brussels kept", detectLocation("Brussels", "").nlRelevant === true);
check("Leuven province", detectLocation("Leuven", "").province === "Vlaams-Brabant");
check("Remote Belgium kept", detectLocation("Remote, Belgium", "").nlRelevant === true);
check("Vlaanderen remote kept", detectLocation("Remote - Vlaanderen", "").nlRelevant === true);

// ---- salary ----
const s1 = parseSalary("Salaris € 4.000 - € 5.500 per maand");
eq("month min", s1.min, 4000);
eq("month max", s1.max, 5500);
eq("month interval", s1.interval, "month");
check("month disclosed", s1.disclosed === true);
const s2 = parseSalary("Salary range: €60.000 - €80.000 per year");
eq("year min", s2.min, 60000);
eq("year max", s2.max, 80000);
const s3 = parseSalary("$120k – $160k");
eq("usd currency", s3.currency, "USD");
eq("usd min", s3.min, 120000);
eq("usd max", s3.max, 160000);
check("no salary undisclosed", parseSalary("Competitive salary").disclosed === false);
const s7 = parseSalary("US Remote Range $108,000 - $145,000 USD. 401k plan with matching. Team of 2,500 engineers.");
eq("range min skips 401k/headcount", s7.min, 108000);
eq("range max skips 401k/headcount", s7.max, 145000);
check("company count is not salary", parseSalary("More than 500,000 companies use our product.").disclosed === false);
check("user/device counts are not salary", parseSalary("Supporting 30,000 users and 100,000 devices globally.").disclosed === false);

// ---- tools / tech stack ----
const t1 = detectTools("Ervaring met React, TypeScript, Node.js, Docker en Kubernetes is een pre.");
check("tool react", t1.includes("react"));
check("tool typescript", t1.includes("typescript"));
check("tool nodejs", t1.includes("nodejs"));
check("tool docker", t1.includes("docker"));
check("tool kubernetes", t1.includes("kubernetes"));
const t2 = detectTools("We work with Python, Django and PostgreSQL on AWS.");
check("tool python", t2.includes("python"));
check("tool django", t2.includes("django"));
check("tool postgresql", t2.includes("postgresql"));
check("tool aws", t2.includes("aws"));
// word boundary: "java" must NOT match inside "javascript"
const t3 = detectTools("Strong JavaScript and TypeScript skills required.");
check("javascript detected", t3.includes("javascript"));
check("java NOT matched in javascript", t3.includes("java") === false);
// short/ambiguous names are written out: Golang yes, ordinary 'go' no
check("golang detected", detectTools("Experience with Golang microservices").includes("go"));
check("ordinary 'go' not matched", detectTools("a great place to go and grow").includes("go") === false);

// ---- AI flag ----
check("ai in title", detectAI("AI Engineer", "") === true);
check("ml in title flags", detectAI("Machine Learning Engineer", "") === true);
check(
  "company AI boilerplate does not flag a non-AI title",
  detectAI("Backend Developer", "We are an AI-powered company that uses generative AI and LLMs daily") === false,
);
check("no ai on single incidental mention", detectAI("Backend Developer", "we sometimes use AI tools") === false);

// ---- text language ----
eq(
  "lang: dutch posting",
  detectTextLanguage("Wij zoeken een ervaren Backend Developer voor ons team. Je werkt met onze systemen."),
  "nl",
);
eq(
  "lang: english posting",
  detectTextLanguage(
    "We are looking for an experienced Backend Developer to join our team. You will work with our systems in a full-time role.",
  ),
  "en",
);
eq("lang: empty defaults to nl", detectTextLanguage(""), "nl");
eq("lang: tie defaults to nl", detectTextLanguage("de the"), "nl");
// classify(): no description -> Dutch, even with an English-looking title
eq(
  "classify lang: no description defaults to nl",
  classify(job("Senior Backend Developer for the Benelux team")).lang,
  "nl",
);
eq(
  "classify lang: english description -> en",
  classify(
    job("Backend Developer", {
      descriptionText:
        "We are looking for an experienced engineer to join our team. You will work with our systems in a full-time role.",
    }),
  ).lang,
  "en",
);
eq(
  "classify lang: dutch description -> nl",
  classify(
    job("Backend Developer", {
      descriptionText: "Wij zoeken een ervaren ontwikkelaar voor ons team. Je werkt met onze systemen.",
    }),
  ).lang,
  "nl",
);

// ---- summary ----
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) {
  console.log("\nFailures:\n - " + fails.join("\n - "));
  process.exit(1);
}
