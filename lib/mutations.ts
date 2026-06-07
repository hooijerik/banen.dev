// Server-only writes used by API route handlers (alerts + employer submissions + premium).
import { getDb } from "./db";
import { sendEmail, esc } from "./email";
import { SITE } from "./site";
import { slugify } from "./format";
import { upsertJob } from "../scripts/scrapers/store";
import type { RawJob } from "./types";

/** Where employer job submissions are forwarded. */
const SUBMISSIONS_TO = process.env.SUBMISSIONS_TO_EMAIL || "info@banen.dev";

export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export async function addSubscriber(
  email: string,
  filters?: Record<string, unknown>,
  frequency = "daily",
): Promise<{ ok: boolean; error?: string }> {
  const clean = (email || "").trim().toLowerCase();
  if (!isValidEmail(clean)) return { ok: false, error: "Ongeldig e-mailadres" };
  const freq = frequency === "weekly" ? "weekly" : "daily";
  getDb()
    .prepare(
      `INSERT INTO subscribers (email, filters_json, frequency) VALUES (?,?,?)
       ON CONFLICT(email) DO UPDATE SET filters_json=excluded.filters_json, frequency=excluded.frequency`,
    )
    .run(clean, filters && Object.keys(filters).length ? JSON.stringify(filters) : null, freq);

  // Confirmation to the subscriber (best-effort; never blocks the signup).
  await sendEmail({
    to: clean,
    subject: `Je vacature-alert op ${SITE.name} is ingesteld`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#0f172a">Je alert staat aan ✅</h2>
      <p style="color:#334155">Je ontvangt voortaan ${freq === "weekly" ? "wekelijks" : "dagelijks"} de nieuwste
      developer-vacatures in Nederland en Vlaanderen die bij je passen.</p>
      <p><a href="${SITE.url}/vacatures" style="color:#1d4ed8;font-weight:600">Bekijk nu alle vacatures →</a></p>
      <p style="color:#94a3b8;font-size:12px">${SITE.name}</p>
    </div>`,
  });
  return { ok: true };
}

export async function addEmployerSubmission(payload: {
  companyName?: string;
  contactEmail?: string;
  [k: string]: unknown;
}): Promise<{ ok: boolean; error?: string }> {
  if (!payload.contactEmail || !isValidEmail(String(payload.contactEmail))) {
    return { ok: false, error: "Geldig e-mailadres is verplicht" };
  }
  getDb()
    .prepare(
      `INSERT INTO employer_submissions (company_name, contact_email, payload_json) VALUES (?,?,?)`,
    )
    .run(payload.companyName ?? null, payload.contactEmail ?? null, JSON.stringify(payload));

  const rows = Object.entries(payload)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
    )
    .join("");

  // Notify the team so a submission never just sits in the database.
  await sendEmail({
    to: SUBMISSIONS_TO,
    subject: `Nieuwe vacature-inzending: ${payload.companyName ?? "onbekend"}`,
    replyTo: String(payload.contactEmail),
    html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#0f172a">Nieuwe vacature-inzending</h2>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    </div>`,
  });

  // Confirmation to the employer.
  await sendEmail({
    to: String(payload.contactEmail),
    subject: `We hebben je vacature ontvangen — ${SITE.name}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#0f172a">Bedankt voor je inzending 🙌</h2>
      <p style="color:#334155">We hebben je aanmelding${payload.companyName ? ` voor <strong>${esc(payload.companyName)}</strong>` : ""}
      ontvangen en nemen zo snel mogelijk contact met je op via ${esc(payload.contactEmail)}.</p>
      <p style="color:#94a3b8;font-size:12px">${SITE.name}</p>
    </div>`,
  });
  return { ok: true };
}

// ---- Premium placements (jobs + companies) ----

export interface ManualJobInput {
  companyName: string;
  companyWebsite?: string;
  title: string;
  applyUrl: string;
  url?: string;
  descriptionHtml?: string;
  descriptionText?: string;
  location?: string;
  featuredDays?: number; // premium duration; 0/undefined => not featured
}

/** Create (or update) a directly-posted paid job. Reuses the scraper's classifier + company
 *  upsert; stored with source='manual' so the scrape never expires it. */
export function createManualJob(
  input: ManualJobInput,
): { ok: boolean; jobId?: number; slug?: string; error?: string } {
  const title = (input.title || "").trim();
  const companyName = (input.companyName || "").trim();
  const applyUrl = (input.applyUrl || input.url || "").trim();
  if (!title || !companyName || !applyUrl) {
    return { ok: false, error: "Titel, bedrijf en apply-URL zijn verplicht" };
  }
  const sourceId = `${slugify(companyName)}-${slugify(title)}`.slice(0, 90);
  const raw: RawJob = {
    source: "manual",
    sourceId,
    companyName,
    companyWebsite: input.companyWebsite,
    title,
    url: input.url || applyUrl,
    applyUrl,
    descriptionHtml: input.descriptionHtml,
    descriptionText: input.descriptionText,
    locationRaw: input.location,
  };
  const res = upsertJob(raw, { force: true });
  if (res === "skipped-irrelevant" || res === "skipped-notnl") {
    return { ok: false, error: `Niet geplaatst (${res})` };
  }
  const row = getDb()
    .prepare("SELECT id, slug FROM jobs WHERE source='manual' AND source_id=?")
    .get(sourceId) as { id: number; slug: string } | undefined;
  if (!row) return { ok: false, error: "Vacature niet gevonden na aanmaken" };
  if (input.featuredDays && input.featuredDays > 0) setJobFeatured(row.id, input.featuredDays);
  return { ok: true, jobId: row.id, slug: row.slug };
}

/** Feature/unfeature a job for `days` (null/0 => remove the feature). */
export function setJobFeatured(jobId: number, days: number | null): void {
  const db = getDb();
  if (!days || days <= 0) {
    db.prepare("UPDATE jobs SET featured=0, featured_until=NULL WHERE id=?").run(jobId);
  } else {
    db.prepare("UPDATE jobs SET featured=1, featured_until=datetime('now', ?) WHERE id=?").run(
      `+${Math.floor(days)} days`,
      jobId,
    );
  }
}

/** Feature/unfeature (spotlight) a company for `days` (null/0 => remove). */
export function setCompanyFeatured(companyId: number, days: number | null): void {
  const db = getDb();
  if (!days || days <= 0) {
    db.prepare("UPDATE companies SET featured=0, featured_until=NULL WHERE id=?").run(companyId);
  } else {
    db.prepare("UPDATE companies SET featured=1, featured_until=datetime('now', ?) WHERE id=?").run(
      `+${Math.floor(days)} days`,
      companyId,
    );
  }
}

/** Set the richer company-profile fields shown on a spotlight company page. */
export function setCompanyProfile(
  companyId: number,
  p: { tagline?: string | null; description?: string | null; banner_url?: string | null },
): void {
  getDb()
    .prepare("UPDATE companies SET tagline=?, description=?, banner_url=? WHERE id=?")
    .run(p.tagline ?? null, p.description ?? null, p.banner_url ?? null, companyId);
}
