"use client";
import { useState } from "react";
import Link from "next/link";
import { NAV } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-900/20" onClick={close} aria-hidden />
          <nav className="absolute inset-x-0 top-16 z-50 border-b border-slate-200 bg-white shadow-lg">
            <div className="space-y-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <Link
                  href="/vacature-alert"
                  onClick={close}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Vacature-alert
                </Link>
                <Link
                  href="/plaats-vacature"
                  onClick={close}
                  className="rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Plaats vacature
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
