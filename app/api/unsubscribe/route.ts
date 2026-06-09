import { unsubscribeByToken } from "@/lib/mutations";

// One-click unsubscribe target for the List-Unsubscribe header (RFC 8058 sends a POST);
// also tolerant of GET. The human-facing confirmation lives at /uitschrijven.
function handle(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  unsubscribeByToken(token);
  return new Response("Uitgeschreven / Unsubscribed.", {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const POST = handle;
export const GET = handle;
