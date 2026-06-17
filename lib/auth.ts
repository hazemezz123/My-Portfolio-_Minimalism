import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_TOKEN_COOKIE = "admin_token";
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function signToken(timestamp: number): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", secret).update(String(timestamp)).digest("hex");
}

/** Call inside a POST handler after validating credentials. */
export async function setAdminCookie(): Promise<void> {
  const timestamp = Date.now();
  const token = signToken(timestamp);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_TOKEN_COOKIE, `${timestamp}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/** Call inside any API route that requires admin auth. Returns true if OK. */
export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_TOKEN_COOKIE);
  if (!cookie?.value) return false;

  const parts = cookie.value.split(".");
  if (parts.length !== 2) return false;

  const [ts, token] = parts;
  const timestamp = Number(ts);
  if (!timestamp || Date.now() - timestamp > TOKEN_MAX_AGE_MS) return false;

  const expected = signToken(timestamp);
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Call inside a DELETE / logout handler. */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
}
