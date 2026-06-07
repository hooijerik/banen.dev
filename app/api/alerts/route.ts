import { addSubscriber } from "@/lib/mutations";
import { SENIORITY } from "@/lib/taxonomy";
import { geoCity, ALERT_RADII } from "@/lib/geo";

const SENIORITY_SLUGS = new Set<string>(SENIORITY.map((s) => s.slug));

const SALARY_PRESETS = new Set([50000, 70000, 90000, 120000]);
const RADII = new Set<number>(ALERT_RADII);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // All filters are optional; invalid values are silently ignored.
    const filters: Record<string, unknown> = {};

    if (body.category) filters.category = String(body.category);

    if (body.seniority && SENIORITY_SLUGS.has(String(body.seniority))) {
      filters.seniority = String(body.seniority);
    }

    const salaryMin = Number(body.salaryMin);
    if (SALARY_PRESETS.has(salaryMin)) filters.salaryMin = salaryMin;

    // Location + distance: matched by coordinates (see scripts/send-alerts.ts).
    const loc = body.location ? String(body.location) : "";
    if (loc && geoCity(loc)) {
      const radiusKm = Number(body.radiusKm);
      filters.near = loc;
      filters.radiusKm = RADII.has(radiusKm) ? radiusKm : 25;
    }

    const res = await addSubscriber(String(body.email ?? ""), filters, String(body.frequency ?? "daily"));
    return Response.json(res, { status: res.ok ? 200 : 400 });
  } catch {
    return Response.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }
}
