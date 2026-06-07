"use client";
import { useState } from "react";
import type { Dict } from "@/lib/i18n/types";

export function AlertForm({
  t,
  categories,
  seniorities,
  salaries,
  countries,
  radii,
}: {
  t: Dict["forms"]["alert"];
  categories: { slug: string; label: string }[];
  seniorities: { slug: string; label: string }[];
  salaries: { value: string; label: string }[];
  countries: { value: string; label: string }[];
  radii: number[];
}) {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [seniority, setSeniority] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState(countries[0]?.value ?? "nl");
  const [radiusKm, setRadiusKm] = useState(String(radii[1] ?? radii[0] ?? 25));
  const [frequency, setFrequency] = useState("daily");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const hasPostcode = postcode.trim().length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category: category || undefined,
          seniority: seniority || undefined,
          salaryMin: salaryMin || undefined,
          postcode: hasPostcode ? postcode.trim() : undefined,
          country: hasPostcode ? country : undefined,
          radiusKm: hasPostcode ? radiusKm : undefined,
          frequency,
        }),
      });
      const d = await r.json();
      setStatus(d.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="text-2xl">✅</div>
        <h3 className="mt-2 font-bold text-emerald-900">{t.success}</h3>
        <p className="mt-1 text-sm text-emerald-700">{t.successBody}</p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
  const muted = "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.emailPlaceholder}
        className={input}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.category}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
            <option value="">{t.allCategories}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.level}</span>
          <select value={seniority} onChange={(e) => setSeniority(e.target.value)} className={input}>
            <option value="">{t.anyLevel}</option>
            {seniorities.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.salaryMin}</span>
          <select value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} className={input}>
            <option value="">{t.anySalary}</option>
            {salaries.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.frequency}</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={input}>
            <option value="daily">{t.daily}</option>
            <option value="weekly">{t.weekly}</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500">{t.postcode}</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder={t.postcodePlaceholder}
          className={input}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.country}</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={!hasPostcode}
            className={`${input} ${muted}`}
          >
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.distance}</span>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            disabled={!hasPostcode}
            className={`${input} ${muted}`}
          >
            {radii.map((r) => (
              <option key={r} value={r}>
                +{r} km
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs text-slate-400">{t.optionalNote}</p>
      {status === "error" && <p className="text-sm text-red-600">{t.error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "loading" ? t.submitting : t.submit}
      </button>
    </form>
  );
}
