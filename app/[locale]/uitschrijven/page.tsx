import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, Card } from "@/components/ui";
import { withLocale } from "@/lib/urls";
import { unsubscribeByToken } from "@/lib/mutations";
import { getDictionary, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale)).unsubscribe;
  return { title: t.title, robots: { index: false, follow: false } };
}

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const { locale } = await params;
  const { token, done } = await searchParams;
  const t = (await getDictionary(locale)).unsubscribe;

  // Server action: only unsubscribes on an explicit click (avoids email-prefetch deletes).
  async function confirm() {
    "use server";
    if (token) unsubscribeByToken(token);
    redirect(withLocale(locale, "/uitschrijven?done=1"));
  }

  return (
    <Container className="py-20">
      <Card className="mx-auto max-w-md p-8 text-center">
        {done === "1" ? (
          <>
            <div className="text-3xl">👋</div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{t.doneTitle}</h1>
            <p className="mt-2 text-slate-600">{t.doneBody}</p>
          </>
        ) : token ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.title}</h1>
            <p className="mt-2 text-slate-600">{t.body}</p>
            <form action={confirm} className="mt-6">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                {t.confirm}
              </button>
            </form>
          </>
        ) : (
          <p className="text-slate-600">{t.invalid}</p>
        )}
      </Card>
    </Container>
  );
}
