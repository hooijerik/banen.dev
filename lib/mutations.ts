// Server-only writes used by API route handlers (alerts + employer submissions).
import { getDb } from "./db";

export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function addSubscriber(
  email: string,
  filters?: Record<string, string>,
  frequency = "daily",
): { ok: boolean; error?: string } {
  const clean = (email || "").trim().toLowerCase();
  if (!isValidEmail(clean)) return { ok: false, error: "Ongeldig e-mailadres" };
  const freq = frequency === "weekly" ? "weekly" : "daily";
  getDb()
    .prepare(
      `INSERT INTO subscribers (email, filters_json, frequency) VALUES (?,?,?)
       ON CONFLICT(email) DO UPDATE SET filters_json=excluded.filters_json, frequency=excluded.frequency`,
    )
    .run(clean, filters && Object.keys(filters).length ? JSON.stringify(filters) : null, freq);
  return { ok: true };
}

export function addEmployerSubmission(payload: {
  companyName?: string;
  contactEmail?: string;
  [k: string]: unknown;
}): { ok: boolean; error?: string } {
  if (!payload.contactEmail || !isValidEmail(String(payload.contactEmail))) {
    return { ok: false, error: "Geldig e-mailadres is verplicht" };
  }
  getDb()
    .prepare(
      `INSERT INTO employer_submissions (company_name, contact_email, payload_json) VALUES (?,?,?)`,
    )
    .run(payload.companyName ?? null, payload.contactEmail ?? null, JSON.stringify(payload));
  return { ok: true };
}
