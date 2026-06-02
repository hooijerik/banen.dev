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

// ---- category ----
eq("AE", detectCategory("Senior Account Executive"), "sales");
eq("SDR", detectCategory("Sales Development Representative (SDR)"), "sales");
eq("RevOps", detectCategory("Revenue Operations Manager"), "revops");
eq("SalesOps→revops", detectCategory("Sales Operations Analyst"), "revops");
eq("MOps→revops", detectCategory("Marketing Operations Manager"), "revops");
eq("GTM Eng→revops", detectCategory("GTM Engineer"), "revops");
eq("CSM", detectCategory("Customer Success Manager"), "customer-success");
eq("CS Ops→revops", detectCategory("Customer Success Operations Lead"), "revops");
eq("Marketing", detectCategory("Head of Marketing"), "marketing");
eq("Partnerships", detectCategory("Strategic Partnerships Manager"), "partnerships");
eq("Deal Desk→revops", detectCategory("Deal Desk Analyst"), "revops");
eq("Enablement→revops", detectCategory("Sales Enablement Manager"), "revops");
eq("CRM admin→revops", detectCategory("HubSpot Administrator"), "revops");
eq("Demand gen is marketing", detectCategory("Demand Generation Lead"), "marketing");
eq("Verkoper", detectCategory("Verkoper binnendienst"), "sales");
eq("Non-GTM returns null", detectCategory("Backend Software Engineer"), null);

// ---- seniority ----
eq("senior", detectSeniority("Senior Account Executive"), "senior");
eq("manager", detectSeniority("Marketing Operations Manager"), "manager");
eq("director via head of", detectSeniority("Head of Sales"), "director");
eq("vp", detectSeniority("VP of Sales"), "vp");
eq("clevel", detectSeniority("Chief Revenue Officer"), "clevel");
eq("junior via stage", detectSeniority("Stagiair Sales"), "junior");
eq("no seniority", detectSeniority("Account Executive"), null);
eq("senior manager is manager", detectSeniority("Senior Sales Manager"), "manager");

// ---- relevance gate ----
check("SWE not GTM", classify(job("Senior Backend Software Engineer")).gtmRelevant === false);
check("Recruiter not GTM", classify(job("Technical Recruiter")).gtmRelevant === false);
check("AE is GTM", classify(job("Account Executive")).gtmRelevant === true);
check(
  "Sales Engineer kept (presales)",
  classify(job("Sales Engineer")).category === "sales",
);

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
  classify(job("Strategic Account Executive - South Africa", { locationRaw: "Remote" })).location
    .nlRelevant === false,
);
check(
  "EU territory in title kept",
  classify(job("Account Executive - Benelux", { locationRaw: "Remote" })).location.nlRelevant === true,
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
const s3 = parseSalary("$120k – $160k OTE");
eq("usd currency", s3.currency, "USD");
eq("usd min", s3.min, 120000);
eq("usd max", s3.max, 160000);
check("no salary undisclosed", parseSalary("Competitive salary").disclosed === false);
const s4 = parseSalary("Sales Development | 42k basis + 15k bonus");
eq("base+bonus min is base", s4.min, 42000);
eq("base+bonus max is OTE", s4.max, 57000);
check("lone bonus undisclosed", parseSalary("Inclusief 15k bonus").disclosed === false);

// ---- tools / AI ----
const tools = detectTools("Ervaring met Salesforce, HubSpot en Clay is een pre.");
check("tool salesforce", tools.includes("salesforce"));
check("tool hubspot", tools.includes("hubspot"));
check("tool clay", tools.includes("clay"));
check("ai in title", detectAI("AI Solutions Engineer", "") === true);
check(
  "ai via 2 strong signals",
  detectAI("Sales Manager", "We are an AI-powered company that uses generative AI and LLMs daily") ===
    true,
);
check("no ai on single incidental mention", detectAI("Sales Manager", "we sometimes use AI tools") === false);
check("no false ai in email", detectAI("Email Marketing Manager", "Manage the email program") === false);

// ---- summary ----
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) {
  console.log("\nFailures:\n - " + fails.join("\n - "));
  process.exit(1);
}
