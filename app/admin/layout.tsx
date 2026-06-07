import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · banen.dev",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-dvh bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
