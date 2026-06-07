# banen.dev - Dutch/Bilingual Developer Job Board

A bilingual (NL/EN) job board for **developer** roles (frontend, backend, fullstack, mobile,
DevOps & platform, data engineering, data/ML/AI, QA, security, embedded). Jobs are scraped from
public ATS feeds and Dutch aggregators, classified automatically, and served through a
programmatic-SEO site. Forked from the gtmbanen engine.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **Tailwind CSS v4** + TypeScript
- **`node:sqlite`** (built into Node) - single file `data/banendev.db`, no DB server needed
- Scrapers in TypeScript via **tsx**; HTML parsing with **cheerio**

## Quick start

```bash
npm install
npm run scrape        # populate data/banendev.db from the seed companies (ATS only)
npm run dev           # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run scrape` | Scrape all sources (ATS + best-effort aggregators) → classify → upsert |
| `npm run scrape -- --ats-only` | Skip the fragile aggregator adapters |
| `npm run scrape -- greenhouse lever` | Only the named source(s) |
| `npm run reclassify` | Re-run the classifier over stored jobs (after taxonomy changes) |
| `npm test` | Classifier unit tests |
| `npm run dev` / `npm run build` / `npm start` | Next.js dev / production build / serve |
| `npm run alerts:send` | Send job-alert digests (dry-run unless `RESEND_API_KEY` is set) |
| `npm run premium:expire` | Expire premium placements + email renewal reminders |

## How it works

1. **Scrapers** (`scripts/scrapers/`) pull jobs from ATS APIs - Greenhouse, Lever, Ashby,
   Recruitee, Homerun, Personio, Workable, SmartRecruiters - for the companies in
   `scripts/scrapers/seed/companies.json`, plus best-effort Dutch aggregators (Indeed,
   Nationale Vacaturebank, Magnet.me - see ToS caveats in each adapter).
2. **Classifier** (`lib/classify.ts`, config in `lib/taxonomy.ts`) assigns each role a developer
   category, seniority, work mode, location (NL/BE city → province), salary (annualized EUR),
   tech stack, AI flag and reports-to line. Non-developer and non-NL/BE roles are dropped.
3. **The site** (`app/`) reads the DB directly in Server Components. Data pages are dynamic so the
   site reflects the DB without a rebuild after each scrape. NL renders at the root, EN under `/en`.

## Add more companies

Edit `scripts/scrapers/seed/companies.json` - add `{ "name", "atsType", "atsSlug", "website" }`.
Find the `atsSlug` from a company's careers URL (e.g. `boards.greenhouse.io/<slug>`,
`jobs.lever.co/<slug>`, `<slug>.recruitee.com`). Then `npm run scrape`. To probe a list of
candidate companies for a working ATS, drop names into `scripts/discover.ts` and run it.

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) for the full VPS guide (systemd + Nginx + Let's Encrypt; note that
`.dev` is HSTS-preloaded so HTTPS is mandatory). In short: run the scraper on a schedule (cron),
then serve with `npm run build && npm start` (Node server - required because pages render from the
local SQLite DB). For email alerts set `RESEND_API_KEY` + `ALERTS_FROM_EMAIL` (see `.env.example`).
