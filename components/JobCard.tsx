import Link from "next/link";
import { CompanyLogo } from "./CompanyLogo";
import { Chip } from "./ui";
import { formatSalaryRange, timeAgo } from "@/lib/format";
import { categoryLabel, seniorityLabel, toolLabel, workModeLabel } from "@/lib/taxonomy";
import { categoryUrl, companyUrl, jobUrl, seniorityUrl, toolUrl } from "@/lib/urls";
import type { JobRow } from "@/lib/types";

function locationText(job: JobRow): string {
  const base =
    job.city || job.province || (job.country === "NL" ? "Nederland" : null) || job.location_raw || null;
  if (job.work_mode === "remote") return base ? `Remote · ${base}` : "Remote";
  if (job.work_mode === "hybrid") return base ? `Hybride · ${base}` : "Hybride";
  return base || "—";
}

export function JobCard({ job }: { job: JobRow }) {
  const salary = formatSalaryRange(
    job.salary_min,
    job.salary_max,
    job.salary_currency,
    job.salary_interval,
  );
  let tools: string[] = [];
  try {
    tools = job.tools_json ? (JSON.parse(job.tools_json) as string[]) : [];
  } catch {
    tools = [];
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm sm:p-5">
      <div className="flex gap-4">
        <CompanyLogo src={job.company_logo} name={job.company_name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-snug text-slate-900">
                <Link href={jobUrl(job.slug)} className="hover:text-brand-700">
                  {job.title}
                </Link>
              </h3>
              <div className="mt-0.5 truncate text-sm text-slate-500">
                <Link
                  href={companyUrl(job.company_slug)}
                  className="font-medium text-slate-700 hover:text-brand-700"
                >
                  {job.company_name}
                </Link>
                <span className="mx-1.5 text-slate-300">·</span>
                {locationText(job)}
              </div>
            </div>
            <time className="shrink-0 whitespace-nowrap text-xs text-slate-400">
              {timeAgo(job.posted_at || job.first_seen_at)}
            </time>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Chip tone="brand" href={categoryUrl(job.category)}>
              {categoryLabel(job.category)}
            </Chip>
            {job.seniority && <Chip href={seniorityUrl(job.seniority)}>{seniorityLabel(job.seniority)}</Chip>}
            {job.work_mode && <Chip>{workModeLabel(job.work_mode)}</Chip>}
            {salary && <Chip tone="green">{salary}</Chip>}
            {job.ai_required ? <Chip tone="amber">AI</Chip> : null}
            {tools.slice(0, 3).map((t) => (
              <Chip key={t} href={toolUrl(t)}>
                {toolLabel(t)}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
