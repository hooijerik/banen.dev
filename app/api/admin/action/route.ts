import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import {
  createManualJob,
  setJobFeatured,
  setCompanyFeatured,
  setCompanyProfile,
} from "@/lib/mutations";

function jobIdBySlug(slug: string): number | undefined {
  const r = getDb().prepare("SELECT id FROM jobs WHERE slug=?").get(slug) as { id: number } | undefined;
  return r?.id;
}
function companyIdBySlug(slug: string): number | undefined {
  const r = getDb().prepare("SELECT id FROM companies WHERE slug=?").get(slug) as { id: number } | undefined;
  return r?.id;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const f = await req.formData();
  const action = String(f.get("action") ?? "");
  const str = (k: string) => {
    const v = f.get(k);
    const s = v == null ? "" : String(v).trim();
    return s || undefined;
  };
  const num = (k: string) => {
    const n = Number(f.get(k));
    return Number.isFinite(n) ? n : 0;
  };
  let msg = "ok";

  try {
    switch (action) {
      case "create-job": {
        const r = createManualJob({
          companyName: str("companyName") ?? "",
          companyWebsite: str("companyWebsite"),
          title: str("title") ?? "",
          applyUrl: str("applyUrl") ?? "",
          location: str("location"),
          descriptionHtml: str("descriptionHtml"),
          descriptionText: str("descriptionText"),
          featuredDays: num("featuredDays") || 30,
        });
        msg = r.ok ? `job-${r.slug}` : `err-${r.error}`;
        break;
      }
      case "feature-job": {
        const id = jobIdBySlug(str("slug") ?? "");
        if (!id) { msg = "err-job-niet-gevonden"; break; }
        setJobFeatured(id, num("days") || null);
        break;
      }
      case "feature-company": {
        const id = companyIdBySlug(str("slug") ?? "");
        if (!id) { msg = "err-bedrijf-niet-gevonden"; break; }
        setCompanyFeatured(id, num("days") || null);
        break;
      }
      case "company-profile": {
        const id = companyIdBySlug(str("slug") ?? "");
        if (!id) { msg = "err-bedrijf-niet-gevonden"; break; }
        setCompanyProfile(id, {
          tagline: str("tagline") ?? null,
          description: str("description") ?? null,
          banner_url: str("banner_url") ?? null,
        });
        break;
      }
      case "order": {
        getDb()
          .prepare(
            `INSERT INTO premium_orders (kind, company_name, buyer_email, package, amount_eur, status, invoice_ref, notes)
             VALUES (?,?,?,?,?,?,?,?)`,
          )
          .run(
            str("kind") ?? "job",
            str("company_name") ?? null,
            str("buyer_email") ?? null,
            str("package") ?? null,
            num("amount_eur") || null,
            str("status") ?? "invoiced",
            str("invoice_ref") ?? null,
            str("notes") ?? null,
          );
        break;
      }
      default:
        msg = "err-onbekende-actie";
    }
  } catch (e) {
    msg = `err-${(e as Error).message}`.slice(0, 80);
  }

  return NextResponse.redirect(new URL(`/admin?msg=${encodeURIComponent(msg)}`, req.url), 303);
}
