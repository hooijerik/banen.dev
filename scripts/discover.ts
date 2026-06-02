// One-off discovery: probe public ATS endpoints for a list of candidate companies and
// merge the ones that actually return jobs into seed/companies.json. Reusable: drop new
// company names into CANDIDATES and re-run.
//
//   npx tsx scripts/discover.ts          # probe + merge newly-found job boards
//   npx tsx scripts/discover.ts --dry    # probe only, write nothing
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import * as greenhouse from "./scrapers/ats/greenhouse";
import * as lever from "./scrapers/ats/lever";
import * as ashby from "./scrapers/ats/ashby";
import * as recruitee from "./scrapers/ats/recruitee";
import * as workable from "./scrapers/ats/workable";
import * as smartrecruiters from "./scrapers/ats/smartrecruiters";
import * as homerun from "./scrapers/ats/homerun";
import { slugify } from "../lib/format";
import type { AtsType, RawJob, SeedCompany } from "../lib/types";

// Order matters only for which hit is reported first; probing stops at the first ATS that answers.
const PROBE: [AtsType, { fetchJobs: (c: SeedCompany) => Promise<RawJob[]> }][] = [
  ["greenhouse", greenhouse],
  ["lever", lever],
  ["ashby", ashby],
  ["recruitee", recruitee],
  ["workable", workable],
  ["smartrecruiters", smartrecruiters],
  ["homerun", homerun],
];

type Candidate = { name: string; slug?: string; website?: string };

// NL + Dutch-speaking Belgium (Flanders) startups & scale-ups. The slug defaults to the
// name lowercased without spaces/punctuation (how most ATS tenants are named); set `slug`
// explicitly when the tenant differs.
const CANDIDATES: Candidate[] = [
  // ---- Netherlands ----
  { name: "Mollie", website: "mollie.com" },
  { name: "Adyen", website: "adyen.com" },
  { name: "Mews", website: "mews.com" },
  { name: "Bird", website: "bird.com" },
  { name: "MessageBird", website: "messagebird.com" },
  { name: "Bunq", website: "bunq.com" },
  { name: "Backbase", website: "backbase.com" },
  { name: "Sendcloud", website: "sendcloud.com" },
  { name: "Channable", website: "channable.com" },
  { name: "Trengo", website: "trengo.com" },
  { name: "Picnic", website: "picnic.app" },
  { name: "Catawiki", website: "catawiki.com" },
  { name: "WeTransfer", website: "wetransfer.com" },
  { name: "Bynder", website: "bynder.com" },
  { name: "StuDocu", website: "studocu.com" },
  { name: "Otrium", website: "otrium.com" },
  { name: "Lightyear", website: "lightyear.com" },
  { name: "Framer", website: "framer.com" },
  { name: "Miro", website: "miro.com" },
  { name: "Aiven", website: "aiven.io" },
  { name: "Treatwell", website: "treatwell.com" },
  { name: "Tiqets", website: "tiqets.com" },
  { name: "Swapfiets", website: "swapfiets.com" },
  { name: "Castor", slug: "castoredc", website: "castoredc.com" },
  { name: "Sympower", website: "sympower.net" },
  { name: "Mendix", website: "mendix.com" },
  { name: "Leaseweb", website: "leaseweb.com" },
  { name: "Fourthline", website: "fourthline.com" },
  { name: "Silverflow", website: "silverflow.com" },
  { name: "Zivver", website: "zivver.com" },
  { name: "Felyx", website: "felyx.com" },
  { name: "Dott", slug: "ridedott", website: "ridedott.com" },
  { name: "Floryn", website: "floryn.com" },
  { name: "Blendle", website: "blendle.com" },
  { name: "Hubs", website: "hubs.com" },
  { name: "Vandebron", website: "vandebron.nl" },
  { name: "Coolblue", website: "coolblue.nl" },
  { name: "TomTom", website: "tomtom.com" },
  { name: "Elastic", website: "elastic.co" },
  { name: "Optiver", website: "optiver.com" },
  { name: "Exact", website: "exact.com" },
  { name: "AFAS Software", slug: "afas", website: "afas.nl" },
  { name: "Nmbrs", website: "nmbrs.com" },
  { name: "Studyportals", website: "studyportals.com" },
  { name: "Rituals", website: "rituals.com" },
  { name: "Just Eat Takeaway", slug: "justeattakeaway", website: "justeattakeaway.com" },
  { name: "Ace & Tate", slug: "aceandtate", website: "aceandtate.com" },
  { name: "Tony's Chocolonely", slug: "tonyschocolonely", website: "tonyschocolonely.com" },
  { name: "Polarsteps", website: "polarsteps.com" },
  { name: "Bitvavo", website: "bitvavo.com" },
  { name: "Lepaya", website: "lepaya.com" },
  { name: "Crisp", slug: "crispapp", website: "crisp.nl" },
  { name: "Tellow", website: "tellow.nl" },
  { name: "Recharge", slug: "rechargehq", website: "rechargehq.com" },
  // ---- Dutch-speaking Belgium (Flanders) ----
  { name: "Showpad", website: "showpad.com" },
  { name: "Teamleader", website: "teamleader.eu" },
  { name: "Collibra", website: "collibra.com" },
  { name: "Deliverect", website: "deliverect.com" },
  { name: "Intigriti", website: "intigriti.com" },
  { name: "Silverfin", website: "silverfin.com" },
  { name: "Lansweeper", website: "lansweeper.com" },
  { name: "Odoo", website: "odoo.com" },
  { name: "Aikido Security", slug: "aikido", website: "aikido.dev" },
  { name: "Henchman", website: "henchman.io" },
  { name: "Rydoo", website: "rydoo.com" },
  { name: "In The Pocket", slug: "inthepocket", website: "inthepocket.com" },
  { name: "ML6", website: "ml6.eu" },
  { name: "Sortlist", website: "sortlist.com" },
  { name: "Salesflare", website: "salesflare.com" },
  { name: "Billit", website: "billit.be" },
  { name: "Luzmo", website: "luzmo.com" },
  { name: "Robovision", website: "robovision.ai" },
  { name: "Oqton", website: "oqton.com" },
  { name: "Citymesh", website: "citymesh.com" },
  { name: "Faktion", website: "faktion.com" },
  { name: "Materialise", website: "materialise.com" },
  { name: "Guardsquare", website: "guardsquare.com" },
  { name: "THEO Technologies", slug: "theoplayer", website: "theoplayer.com" },
  { name: "Lighthouse", slug: "mylighthouse", website: "mylighthouse.com" },
];

async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

interface Hit {
  name: string;
  atsType: AtsType;
  atsSlug: string;
  website?: string;
  jobs: number;
}

async function probe(cand: Candidate): Promise<Hit | null> {
  const slug = (cand.slug ?? slugify(cand.name).replace(/-/g, "")).trim();
  if (!slug) return null;
  for (const [atsType, adapter] of PROBE) {
    try {
      const jobs = await adapter.fetchJobs({ name: cand.name, atsType, atsSlug: slug } as SeedCompany);
      if (jobs && jobs.length > 0) {
        return { name: cand.name, atsType, atsSlug: slug, website: cand.website || undefined, jobs: jobs.length };
      }
    } catch {
      /* not on this ATS (404 / parse error) - try the next */
    }
  }
  return null;
}

async function main() {
  const dry = process.argv.includes("--dry");
  const seedPath = path.join(import.meta.dirname, "scrapers", "seed", "companies.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8")) as SeedCompany[];
  const haveSlug = new Set(seed.map((c) => `${c.atsType}:${c.atsSlug.toLowerCase()}`));
  const haveName = new Set(seed.map((c) => c.name.toLowerCase()));

  console.log(`\n🔍 Discovery: ${CANDIDATES.length} kandidaten × ${PROBE.length} ATS-platformen\n`);
  const hits: Hit[] = [];
  await mapLimit(CANDIDATES, 6, async (c) => {
    const hit = await probe(c);
    if (hit) {
      hits.push(hit);
      console.log(
        `  ✓ ${hit.name.padEnd(22)} ${("[" + hit.atsType + "]").padEnd(17)} ${hit.atsSlug.padEnd(20)} ${hit.jobs} jobs`,
      );
    }
  });

  const fresh = hits.filter(
    (h) => !haveName.has(h.name.toLowerCase()) && !haveSlug.has(`${h.atsType}:${h.atsSlug.toLowerCase()}`),
  );
  hits.sort((a, b) => b.jobs - a.jobs);
  console.log(`\n  ${hits.length} job boards gevonden, ${fresh.length} nieuw.`);

  writeFileSync(
    path.join(import.meta.dirname, "scrapers", "seed", "discovered.json"),
    JSON.stringify(hits, null, 2) + "\n",
  );

  if (!dry && fresh.length) {
    const merged = seed.concat(
      fresh.map((h) => ({
        name: h.name,
        atsType: h.atsType,
        atsSlug: h.atsSlug,
        ...(h.website ? { website: h.website } : {}),
      })),
    );
    writeFileSync(seedPath, JSON.stringify(merged, null, 2) + "\n");
    console.log(`  → ${fresh.length} toegevoegd aan companies.json (totaal ${merged.length}).`);
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
