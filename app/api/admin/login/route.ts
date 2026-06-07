import { NextResponse } from "next/server";
import { adminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  const expected = adminToken();
  const ok = !!expected && token === expected;
  const res = NextResponse.redirect(new URL(ok ? "/admin" : "/admin?error=1", req.url), 303);
  if (ok) {
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
