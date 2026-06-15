// Pure builder for the JobPosting structured data (schema.org / Google Jobs).
// Hardens the recommended fields Google Search Console flags: employmentType is always
// set, validThrough is computed, addressCountry is a valid ISO code (never "REMOTE"),
// description never falls back to the title (returns null instead -> no JobPosting).
import { sanitizeHtml } from "./format";
import { CITY_PROVINCE, BE_CITY_PROVINCE } from "./taxonomy";
import { parseStreetPostcode } from "./geo";
import { SITE } from "./site";
import type { JobRow } from "./types";

const COUNTRY_NAME: Record<string, string> = { NL: "Netherlands", BE: "Belgium", DE: "Germany" };

function provinceForCity(city: string | null): string | null {
  if (!city) return null;
  const k = city.trim().toLowerCase();
  return CITY_PROVINCE[k] ?? BE_CITY_PROVINCE[k] ?? null;
}

function employmentType(raw: string | null): string {
  const t = (raw || "").toLowerCase();
  if (/part|deeltijd/.test(t)) return "PART_TIME";
  if (/intern|stage/.test(t)) return "INTERN";
  if (/contract|tijdelijk|freelance/.test(t)) return "CONTRACTOR";
  if (/full|fulltime|vast|permanent/.test(t)) return "FULL_TIME";
  return "FULL_TIME"; // default: most dev roles are full-time; clears the recommended-field warning
}

/** SQLite stores datetimes as "YYYY-MM-DD HH:MM:SS" (UTC). Normalise to ISO 8601. */
export function toIso(dt: string | null): string | undefined {
  const s = (dt || "").trim();
  if (!s) return undefined;
  if (s.includes("T")) return s; // already ISO-ish
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  if (m) return `${m[1]}T${m[2]}Z`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00Z`;
  return undefined;
}

/** validThrough: active -> last_seen + 30 days (stays in the future while the scraper keeps
 *  seeing it); expired -> last_seen (in the past -> Google drops it). Computed, no migration. */
export function validThrough(job: Pick<JobRow, "status" | "last_seen_at">): string | undefined {
  const iso = toIso(job.last_seen_at);
  if (!iso) return undefined;
  if (job.status === "expired") return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setUTCDate(d.getUTCDate() + 30);
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function buildJobPostingJsonLd(
  job: JobRow,
  opts: { siteUrl: string },
): Record<string, unknown> | null {
  const description =
    (job.description_html ? sanitizeHtml(job.description_html) : "") || job.description_text || "";
  if (!description.trim()) return null; // no real description -> no JobPosting (avoids thin/duplicate)

  // addressCountry must be a valid ISO code, never "REMOTE".
  const addrCountry =
    job.country && job.country !== "REMOTE" && COUNTRY_NAME[job.country] ? job.country : "NL";
  const region = job.province || provinceForCity(job.city);
  const { streetAddress, postalCode } = parseStreetPostcode(job.location_raw);
  const remote = job.work_mode === "remote";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: toIso(job.posted_at || job.first_seen_at),
    ...(validThrough(job) ? { validThrough: validThrough(job) } : {}),
    employmentType: employmentType(job.employment_type),
    identifier: { "@type": "PropertyValue", name: SITE.name, value: String(job.id) },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      ...(job.company_logo ? { logo: job.company_logo } : {}),
      ...(job.company_website ? { sameAs: job.company_website } : {}),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.city ? { addressLocality: job.city } : {}),
        ...(region ? { addressRegion: region } : {}),
        ...(streetAddress ? { streetAddress } : {}),
        ...(postalCode ? { postalCode } : {}),
        addressCountry: addrCountry,
      },
    },
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: COUNTRY_NAME[addrCountry] || "Netherlands",
          },
        }
      : {}),
    directApply: false,
    url: `${opts.siteUrl}/vacature/${job.slug}`,
    ...(job.salary_disclosed && job.salary_min
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency || "EUR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary_min,
              maxValue: job.salary_max || job.salary_min,
              unitText:
                job.salary_interval === "month"
                  ? "MONTH"
                  : job.salary_interval === "hour"
                    ? "HOUR"
                    : "YEAR",
            },
          },
        }
      : {}),
  };
}
