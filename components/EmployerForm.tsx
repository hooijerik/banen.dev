"use client";
import { useState } from "react";

export function EmployerForm() {
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    jobUrl: "",
    jobTitle: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <h3 className="mt-2 font-bold text-emerald-900">Bedankt!</h3>
        <p className="mt-1 text-sm text-emerald-700">
          We nemen je vacature in behandeling en plaatsen hem na controle op GTM Banen.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={form.companyName} onChange={set("companyName")} placeholder="Bedrijfsnaam" className={input} />
        <input
          type="email"
          required
          value={form.contactEmail}
          onChange={set("contactEmail")}
          placeholder="Contact e-mail *"
          className={input}
        />
      </div>
      <input value={form.jobTitle} onChange={set("jobTitle")} placeholder="Functietitel" className={input} />
      <input
        type="url"
        value={form.jobUrl}
        onChange={set("jobUrl")}
        placeholder="Link naar de vacature (https://…)"
        className={input}
      />
      <textarea
        value={form.message}
        onChange={set("message")}
        placeholder="Bericht (optioneel)"
        rows={3}
        className={input}
      />
      {status === "error" && <p className="text-sm text-red-600">{msg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "loading" ? "Bezig…" : "Vacature insturen"}
      </button>
    </form>
  );
}
