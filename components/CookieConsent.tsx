"use client";

import { useEffect, useState } from "react";

// Consent model (in sync with /cookiebeleid):
//  - Google Analytics is necessary + privacy-friendly (anonymised IP, ad signals off) and
//    loads on every visit without consent.
//  - Microsoft Clarity is optional and loads only after "Accept all".
// The choice is stored in the banendev_consent cookie ("all" | "necessary"), 12 months.
const CONSENT_COOKIE = "banendev_consent";
const MAX_AGE = 60 * 60 * 24 * 365;

function readConsent(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)banendev_consent=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function writeConsent(v: "all" | "necessary") {
  document.cookie = `${CONSENT_COOKIE}=${v}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

function loadGA(gaId: string) {
  if (document.getElementById("ga-src")) return;
  const tag = document.createElement("script");
  tag.id = "ga-src";
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(tag);
  const init = document.createElement("script");
  init.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`;
  document.head.appendChild(init);
}
function loadClarity(clarityId: string) {
  if (document.getElementById("clarity-src")) return;
  const c = document.createElement("script");
  c.id = "clarity-src";
  c.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
  document.head.appendChild(c);
}

export function CookieConsent({
  gaId,
  clarityId,
  policyHref,
  dict,
}: {
  gaId?: string;
  clarityId?: string;
  policyHref: string;
  dict: { title: string; body: string; acceptAll: string; necessaryOnly: string; more: string };
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (gaId) loadGA(gaId); // necessary - always on
    const choice = readConsent();
    if (choice === "all") {
      if (clarityId) loadClarity(clarityId);
    } else if (!choice && clarityId) {
      setShow(true); // only ask when there's an optional tracker to opt into
    }
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

  if (!show) return null;

  const choose = (all: boolean) => {
    writeConsent(all ? "all" : "necessary");
    if (all && clarityId) loadClarity(clarityId);
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
            onClick={() => choose(true)}
            className="rounded-lg bg-brand-600 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:flex-1"
          >
            {dict.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-lg border border-slate-300 px-5 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-1"
          >
            {dict.necessaryOnly}
          </button>
        </div>
        <a
          href={policyHref}
          className="mt-4 inline-block text-xs text-slate-400 underline hover:text-slate-600"
        >
          {dict.more}
        </a>
      </div>
    </div>
  );
}
