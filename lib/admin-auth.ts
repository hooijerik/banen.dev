// Minimal token-cookie auth for the /admin area. Set ADMIN_TOKEN (>=8 chars) in the env.
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gtmb_admin";

/** The configured admin token, or undefined when admin is effectively disabled. */
export function adminToken(): string | undefined {
  const t = process.env.ADMIN_TOKEN?.trim();
  return t && t.length >= 8 ? t : undefined;
}

/** True when the request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const expected = adminToken();
  if (!expected) return false;
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === expected;
}
