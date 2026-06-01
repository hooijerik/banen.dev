import Link from "next/link";

/** The GTM Banen wordmark — used in both the header and footer so they stay in sync. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${className}`}
    >
      <span className="rounded-md bg-brand-600 px-1.5 py-0.5 text-white">GTM</span>
      <span>Banen</span>
    </Link>
  );
}
