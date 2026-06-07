// Expire premium placements past their featured_until and remind the owner of upcoming
// expiries so renewals can be re-invoiced in time. Run daily: npm run premium:expire
// (Display already hides expired premiums via featured_until checks; this keeps the flags
//  tidy and removes direct paid jobs that are no longer paid.)
import { getDb } from "../lib/db";
import { sendEmail } from "../lib/email";
import { SITE } from "../lib/site";

const OWNER = process.env.SUBMISSIONS_TO_EMAIL || "info@banen.dev";
const PAST = `featured_until IS NOT NULL AND featured_until < datetime('now')`;
const SOON = `featured_until IS NOT NULL AND featured_until BETWEEN datetime('now') AND datetime('now','+7 days')`;

async function main() {
  const db = getDb();

  // 1. Directly-posted paid jobs (source='manual') whose window passed -> remove from the board.
  const expiredJobs = db
    .prepare(`SELECT id, title FROM jobs WHERE source='manual' AND status='active' AND ${PAST}`)
    .all() as { id: number; title: string }[];
  db.prepare(`UPDATE jobs SET status='expired' WHERE source='manual' AND status='active' AND ${PAST}`).run();

  // 2. Clear stale featured flags (boosted scraped jobs simply drop the pin and stay active).
  db.prepare(`UPDATE jobs SET featured=0 WHERE featured=1 AND ${PAST}`).run();
  db.prepare(`UPDATE companies SET featured=0 WHERE featured=1 AND ${PAST}`).run();

  // 3. Close out orders whose period has ended.
  db.prepare(
    `UPDATE premium_orders SET status='expired' WHERE status IN ('active','paid')
       AND expires_at IS NOT NULL AND expires_at < datetime('now')`,
  ).run();

  // 4. Upcoming expiries (next 7 days) -> renewal reminders.
  const soonJobs = db
    .prepare(`SELECT title, featured_until FROM jobs WHERE featured=1 AND ${SOON} ORDER BY featured_until`)
    .all() as { title: string; featured_until: string }[];
  const soonCompanies = db
    .prepare(`SELECT name, featured_until FROM companies WHERE featured=1 AND ${SOON} ORDER BY featured_until`)
    .all() as { name: string; featured_until: string }[];

  console.log(
    `Premium expiry: ${expiredJobs.length} verlopen; binnenkort ${soonJobs.length} vacature(s) + ${soonCompanies.length} bedrijf(en).`,
  );

  if (expiredJobs.length || soonJobs.length || soonCompanies.length) {
    const li = (s: string) => `<li>${s}</li>`;
    const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#0f172a">Premium-plaatsingen</h2>
      ${expiredJobs.length ? `<h3>Verlopen (van de site gehaald)</h3><ul>${expiredJobs.map((j) => li(j.title)).join("")}</ul>` : ""}
      ${soonJobs.length ? `<h3>Vacatures die binnen 7 dagen verlopen</h3><ul>${soonJobs.map((j) => li(`${j.title} — ${j.featured_until.slice(0, 10)}`)).join("")}</ul>` : ""}
      ${soonCompanies.length ? `<h3>Bedrijf-spotlights die binnen 7 dagen verlopen</h3><ul>${soonCompanies.map((c) => li(`${c.name} — ${c.featured_until.slice(0, 10)}`)).join("")}</ul>` : ""}
      <p style="color:#94a3b8;font-size:12px">${SITE.name} — automatische herinnering. Verleng en her-factureer waar nodig.</p>
    </div>`;
    const res = await sendEmail({
      to: OWNER,
      subject: `Premium: ${expiredJobs.length} verlopen, ${soonJobs.length + soonCompanies.length} binnenkort`,
      html,
    });
    console.log(`Reminder mail: ${res}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
