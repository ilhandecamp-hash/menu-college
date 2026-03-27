import { cookies } from "next/headers";
import { createHash } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "menu-college-secret-default";

export function verifyPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored) return false;
  return input === stored;
}

export function createSessionToken(): string {
  const payload = Date.now().toString();
  const signature = createHash("sha256")
    .update(payload + SESSION_SECRET)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = createHash("sha256")
    .update(payload + SESSION_SECRET)
    .digest("hex");
  return signature === expected;
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session) return false;
  return verifySessionToken(session.value);
}
