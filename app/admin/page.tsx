import { isAdmin, adminToken } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { getFeaturedJobs, getFeaturedCompanies } from "@/lib/queries";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
const btn = "rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700";
const card = "rounded-xl border border-slate-200 bg-white p-5";
const label = "mb-0.5 block text-xs font-medium text-slate-500";

function Field({ name, ph, type = "text" }: { name: string; ph?: string; type?: string }) {
  return (
    <label className="block">
      <span className={label}>{ph || name}</span>
      <input name={name} type={type} placeholder={ph} className={input} />
    </label>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const msg = typeof sp.msg === "string" ? sp.msg : undefined;
  const error = sp.error === "1";

  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-4 py-24">
        <h1 className="text-xl font-bold">GTM Banen · Admin</h1>
        {!adminToken() && (
          <p className="mt-2 rounded-md bg-amber-50 p-2 text-sm text-amber-800">
            ADMIN_TOKEN is niet ingesteld in de omgeving — admin is uitgeschakeld.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">Onjuist token.</p>}
        <form method="post" action="/api/admin/login" className="mt-4 space-y-2">
          <input name="token" type="password" placeholder="Admin token" className={input} autoFocus />
          <button className={`${btn} w-full`}>Inloggen</button>
        </form>
      </main>
    );
  }

  const db = getDb();
  const leads = db
    .prepare(
      "SELECT id, company_name, contact_email, payload_json, status, created_at FROM employer_submissions ORDER BY created_at DESC LIMIT 40",
    )
    .all() as { id: number; company_name: string | null; contact_email: string | null; payload_json: string | null; status: string; created_at: string }[];
  const orders = db
    .prepare("SELECT * FROM premium_orders ORDER BY created_at DESC LIMIT 40")
    .all() as Record<string, unknown>[];
  const featJobs = getFeaturedJobs(50);
  const featCompanies = getFeaturedCompanies(50);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">GTM Banen · Admin</h1>
        <form method="post" action="/api/admin/logout">
          <button className="text-sm text-slate-500 hover:text-slate-800">Uitloggen</button>
        </form>
      </div>
      {msg && (
        <p className={`rounded-md p-2 text-sm ${msg.startsWith("err") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {msg}
        </p>
      )}

      {/* Leads */}
      <section className={card}>
        <h2 className="mb-3 font-bold">Leads ({leads.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr><th className="py-1 pr-3">Datum</th><th className="pr-3">Bedrijf</th><th className="pr-3">E-mail</th><th>Details</th></tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 align-top">
                  <td className="py-1 pr-3 whitespace-nowrap text-slate-500">{l.created_at?.slice(0, 10)}</td>
                  <td className="pr-3">{l.company_name || "-"}</td>
                  <td className="pr-3">{l.contact_email || "-"}</td>
                  <td className="text-slate-500">{(l.payload_json || "").replace(/[{}"]/g, " ").slice(0, 120)}</td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan={4} className="py-2 text-slate-400">Nog geen leads.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create paid job */}
        <section className={card}>
          <h2 className="mb-3 font-bold">Nieuwe betaalde vacature</h2>
          <form method="post" action="/api/admin/action" className="space-y-2">
            <input type="hidden" name="action" value="create-job" />
            <Field name="companyName" ph="Bedrijf *" />
            <Field name="companyWebsite" ph="Website (voor logo)" />
            <Field name="title" ph="Functietitel *" />
            <Field name="applyUrl" ph="Sollicitatie-URL *" />
            <Field name="location" ph="Locatie (bv. Amsterdam)" />
            <label className="block">
              <span className={label}>Omschrijving</span>
              <textarea name="descriptionText" rows={3} className={input} />
            </label>
            <Field name="featuredDays" ph="Uitgelicht dagen (bv. 30)" type="number" />
            <button className={btn}>Plaatsen + uitlichten</button>
          </form>
        </section>

        {/* Feature / boost */}
        <section className={`${card} space-y-4`}>
          <div>
            <h2 className="mb-2 font-bold">Vacature uitlichten / boosten</h2>
            <form method="post" action="/api/admin/action" className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="action" value="feature-job" />
              <div className="grow"><Field name="slug" ph="Vacature-slug" /></div>
              <div className="w-28"><Field name="days" ph="Dagen (0=uit)" type="number" /></div>
              <button className={btn}>Toepassen</button>
            </form>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Bedrijf uitlichten (spotlight)</h2>
            <form method="post" action="/api/admin/action" className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="action" value="feature-company" />
              <div className="grow"><Field name="slug" ph="Bedrijf-slug" /></div>
              <div className="w-28"><Field name="days" ph="Dagen (0=uit)" type="number" /></div>
              <button className={btn}>Toepassen</button>
            </form>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Bedrijfsprofiel</h2>
            <form method="post" action="/api/admin/action" className="space-y-2">
              <input type="hidden" name="action" value="company-profile" />
              <Field name="slug" ph="Bedrijf-slug" />
              <Field name="tagline" ph="Tagline" />
              <label className="block"><span className={label}>Omschrijving</span><textarea name="description" rows={2} className={input} /></label>
              <Field name="banner_url" ph="Banner-URL" />
              <button className={btn}>Opslaan</button>
            </form>
          </div>
        </section>
      </div>

      {/* Currently featured */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <h2 className="mb-2 font-bold">Uitgelichte vacatures ({featJobs.length})</h2>
          <ul className="space-y-1 text-sm">
            {featJobs.map((j) => (
              <li key={j.id} className="flex justify-between gap-2 border-t border-slate-100 py-1">
                <span className="truncate">{j.title} — {j.company_name}</span>
                <span className="shrink-0 text-slate-400">{j.featured_until?.slice(0, 10)}</span>
              </li>
            ))}
            {featJobs.length === 0 && <li className="text-slate-400">Geen.</li>}
          </ul>
        </section>
        <section className={card}>
          <h2 className="mb-2 font-bold">Uitgelichte bedrijven ({featCompanies.length})</h2>
          <ul className="space-y-1 text-sm">
            {featCompanies.map((c) => (
              <li key={c.id} className="flex justify-between gap-2 border-t border-slate-100 py-1">
                <span className="truncate">{c.name} ({c.open_count})</span>
                <span className="shrink-0 text-slate-400">{c.featured_until?.slice(0, 10)}</span>
              </li>
            ))}
            {featCompanies.length === 0 && <li className="text-slate-400">Geen.</li>}
          </ul>
        </section>
      </div>

      {/* Orders */}
      <section className={card}>
        <h2 className="mb-3 font-bold">Orders / facturen</h2>
        <form method="post" action="/api/admin/action" className="mb-4 grid gap-2 sm:grid-cols-4">
          <input type="hidden" name="action" value="order" />
          <Field name="company_name" ph="Bedrijf" />
          <Field name="buyer_email" ph="E-mail" />
          <Field name="package" ph="Pakket" />
          <Field name="amount_eur" ph="Bedrag €" type="number" />
          <Field name="invoice_ref" ph="Factuurnr." />
          <select name="kind" className={input} defaultValue="job"><option value="job">job</option><option value="company">company</option><option value="combo">combo</option></select>
          <select name="status" className={input} defaultValue="invoiced"><option>invoiced</option><option>paid</option><option>cancelled</option></select>
          <button className={btn}>Order vastleggen</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-1 pr-3">Datum</th><th className="pr-3">Bedrijf</th><th className="pr-3">Pakket</th><th className="pr-3">€</th><th className="pr-3">Status</th><th>Factuur</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id as number} className="border-t border-slate-100">
                  <td className="py-1 pr-3 whitespace-nowrap text-slate-500">{String(o.created_at ?? "").slice(0, 10)}</td>
                  <td className="pr-3">{(o.company_name as string) || "-"}</td>
                  <td className="pr-3">{(o.package as string) || "-"}</td>
                  <td className="pr-3">{(o.amount_eur as number) ?? "-"}</td>
                  <td className="pr-3">{o.status as string}</td>
                  <td className="text-slate-500">{(o.invoice_ref as string) || "-"}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="py-2 text-slate-400">Nog geen orders.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
