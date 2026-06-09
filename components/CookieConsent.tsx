"use client";

import { useEffect, useState } from "react";

// Consent gate for analytics. Nothing loads until the visitor accepts. The choice is
// stored in localStorage so the takeover only appears once. GA is loaded first (primary),
// Microsoft Clarity after. IDs are passed from the server layout (runtime env), not inlined.
const CONSENT_KEY = "banendev-cookie-consent"; // "granted" | "denied"

function loadAnalytics(gaId?: string, clarityId?: string) {
  // 1) Google Analytics (primary) - load first.
  if (gaId && !document.getElementById("ga-src")) {
    const tag = document.createElement("script");
    tag.id = "ga-src";
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(tag);
    const init = document.createElement("script");
    init.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
    document.head.appendChild(init);
  }
  // 2) Microsoft Clarity - after GA.
  if (clarityId && !document.getElementById("clarity-src")) {
    const c = document.createElement("script");
    c.id = "clarity-src";
    c.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
    document.head.appendChild(c);
  }
}

export function CookieConsent({
  gaId,
  clarityId,
  dict,
}: {
  gaId?: string;
  clarityId?: string;
  dict: { title: string; body: string; accept: string; reject: string };
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(CONSENT_KEY);
    } catch {
      // localStorage unavailable (private mode etc.) - just show the banner.
    }
    if (choice === "granted") loadAnalytics(gaId, clarityId);
    else if (choice !== "denied") setShow(true);
  }, [gaId, clarityId]);

  // Lock background scroll while the takeover is up.
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  // Nothing to consent to, or already decided -> render nothing.
  if ((!gaId && !clarityId) || !show) return null;

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    if (granted) loadAnalytics(gaId, clarityId);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h2 id="cookie-consent-title" className="text-xl font-bold tracking-tight text-slate-900">
          {dict.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{dict.body}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-lg bg-brand-600 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:flex-1"
          >
            {dict.accept}
          </button>
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-lg border border-slate-300 px-5 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-1"
          >
            {dict.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
