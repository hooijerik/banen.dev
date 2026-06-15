// Lightweight test runner (no framework). Run with: npx tsx tests/jsonld.test.ts
import { buildJobPostingJsonLd } from "../lib/jsonld";
import { parseStreetPostcode } from "../lib/geo";
import type { JobRow } from "../lib/types";

let pass = 0;
const fails: string[] = [];
function check(name: string, cond: boolean) {
  if (cond) pass++;
  else fails.push(name);
}
function eq<T>(name: string, got: T, want: T) {
  check(`${name} → got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`, got === want);
}

function job(o: Partial<JobRow> = {}): JobRow {
  return {
    id: 1, source: "greenhouse", source_id: "x", company_id: 1,
    company_name: "Acme", company_slug: "acme", company_logo: null, company_website: null,
    title: "Backend Engineer", title_norm: "backend engineer", slug: "acme-backend-engineer",
    url: "https://x", apply_url: null, description_html: null,
    description_text: "We are hiring a backend engineer to build APIs.", location_raw: null,
    city: null, city_slug: null, province: null, country: "NL", work_mode: null,
    category: "backend", seniority: null, employment_type: null,
    salary_min: null, salary_max: null, salary_currency: null, salary_interval: null,
    salary_min_eur: null, salary_max_eur: null, salary_disclosed: 0,
    comp_structure: null, equity_type: null, tools_json: null, reports_to: null, ai_required: 0,
    lang: "nl", featured: 0, featured_until: null,
    posted_at: "2026-06-01 09:00:00", first_seen_at: "2026-06-01 09:00:00",
    last_seen_at: "2026-06-08 09:00:00", status: "active", hash: "h",
    ...o,
  } as JobRow;
}
const build = (o: Partial<JobRow> = {}) => buildJobPostingJsonLd(job(o), { siteUrl: "https://banen.dev" });
function addr(j: Record<string, unknown> | null): Record<string, unknown> {
  return ((j?.jobLocation as Record<string, unknown>)?.address as Record<string, unknown>) ?? {};
}

// ---- employmentType always set ----
eq("default employmentType FULL_TIME", build()!.employmentType, "FULL_TIME");
eq("parttime → PART_TIME", build({ employment_type: "Parttime (24u)" })!.employmentType, "PART_TIME");
eq("stage → INTERN", build({ employment_type: "Stage" })!.employmentType, "INTERN");
eq("freelance → CONTRACTOR", build({ employment_type: "Freelance" })!.employmentType, "CONTRACTOR");

// ---- validThrough (computed, ISO) ----
const active = build()!;
check("active validThrough is ISO", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(active.validThrough as string));
eq("active validThrough = last_seen + 30d", active.validThrough, "2026-07-08T09:00:00Z");
eq("expired validThrough = last_seen", build({ status: "expired" })!.validThrough, "2026-06-08T09:00:00Z");
check("datePosted normalised to ISO", /^\d{4}-\d{2}-\d{2}T/.test(active.datePosted as string));

// ---- address country never "REMOTE" ----
eq("country REMOTE → NL", addr(build({ country: "REMOTE", work_mode: "remote" })).addressCountry, "NL");
eq("country BE kept", addr(build({ country: "BE", city: "Gent" })).addressCountry, "BE");
eq("null country → NL", addr(build({ country: null })).addressCountry, "NL");

// ---- region derived from city when province is empty ----
eq("region from city (NL)", addr(build({ city: "Amsterdam", province: null })).addressRegion, "Noord-Holland");
eq("region from city (BE)", addr(build({ city: "Gent", country: "BE", province: null })).addressRegion, "Oost-Vlaanderen");
eq("explicit province wins", addr(build({ city: "Amsterdam", province: "Flevoland" })).addressRegion, "Flevoland");

// ---- remote → TELECOMMUTE + applicantLocationRequirements ----
const remote = build({ work_mode: "remote" })!;
eq("remote jobLocationType", remote.jobLocationType, "TELECOMMUTE");
check("remote applicantLocationRequirements", !!remote.applicantLocationRequirements);
check("onsite has no jobLocationType", build({ work_mode: "onsite" })!.jobLocationType === undefined);

// ---- description never the title; null without a description ----
check("description is the description, not the title", build()!.description !== "Backend Engineer");
check("no description → builder returns null", build({ description_text: null, description_html: null }) === null);
check("html description used", typeof build({ description_html: "<p>Bouw mooie APIs.</p>", description_text: null })!.description === "string");

// ---- baseSalary only when disclosed ----
check("baseSalary present when disclosed", !!build({ salary_disclosed: 1, salary_min: 60000, salary_max: 80000, salary_interval: "year" })!.baseSalary);
check("no baseSalary when undisclosed", build({ salary_disclosed: 0, salary_min: 60000 })!.baseSalary === undefined);

// ---- identifier ----
check("identifier present", !!build()!.identifier);

// ---- parseStreetPostcode ----
const a = parseStreetPostcode("Herengracht 100, 1015 BS Amsterdam");
eq("nl postcode parsed", a.postalCode, "1015 BS");
eq("nl street parsed", a.streetAddress, "Herengracht 100");
eq("postcode without space normalised", parseStreetPostcode("1015AB Amsterdam").postalCode, "1015 AB");
eq("city only → no postcode", parseStreetPostcode("Amsterdam").postalCode, undefined);
eq("city only → no street", parseStreetPostcode("Amsterdam, Netherlands").streetAddress, undefined);
eq("be 4-digit postcode", parseStreetPostcode("Gent 9000").postalCode, "9000");
eq("empty location → no fields", parseStreetPostcode(null).postalCode, undefined);

// ---- summary ----
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) {
  console.log("\nFailures:\n - " + fails.join("\n - "));
  process.exit(1);
}
