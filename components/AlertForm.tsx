"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/taxonomy";

export function AlertForm() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category: category || undefined, frequency }),
      });
      const d = await r.json();
      if (d.ok) setStatus("ok");
      else {
        setStatus("error");
        setMsg(d.error || "Er ging iets mis");
      }
    } catch {
      setStatus("error");
      setMsg("Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="text-2xl">✅</div>
        <h3 className="mt-2 font-bold text-emerald-900">Je bent ingeschreven!</h3>
        <p className="mt-1 text-sm text-emerald-700">
          We sturen je nieuwe GTM-vacatures zodra ze online komen.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        className={input}
      />
      <div className="grid grid-cols-2 gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
          <option value="">Alle categorieën</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={input}>
          <option value="daily">Dagelijks</option>
          <option value="weekly">Wekelijks</option>
        </select>
      </div>
      {status === "error" && <p className="text-sm text-red-600">{msg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "loading" ? "Bezig…" : "Vacature-alert instellen"}
      </button>
    </form>
  );
}
