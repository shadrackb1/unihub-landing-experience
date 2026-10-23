import { redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { withTimeout } from "@/shared/lib/withTimeout";

/**
 * Route-loader safe admin guard.
 *
 * Loaders run OUTSIDE React rendering, so this must never call hooks like
 * useAuth()/useContext() — that throws an "invalid hook call" which surfaces
 * as the root error page ("This page didn't load"). It asks the better-auth
 * client for the session instead, which is a plain async call.
 *
 * The role comes from the user row the session was issued for, not from
 * anything the browser can set, and it is the same check the API routes apply
 * with requireRole().
 */

const AUTH_WAIT_MS = 8000;
/** Max time a guarded data fetch may take before we serve the empty fallback. */
const DATA_WAIT_MS = 6000;

export type AdminRole = "TENANT" | "LANDLORD" | "ADMIN" | "UNIVERSITY_ADMIN" | "VIEWER";

export function isAdminRole(role: string | null | undefined): boolean {
  return (role ?? "").toUpperCase() === "ADMIN";
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

async function readSessionUser(): Promise<AdminSessionUser | null> {
  const { data } = await authClient.getSession();
  if (!data?.user) return null;
  const user = data.user as { id: string; email: string; name?: string | null; role?: string };
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role ?? "TENANT",
  };
}

export const requireAdmin = async (): Promise<{ user: AdminSessionUser | null }> => {
  // Admin subtree is client-only (ssr:false); skip during any server pass.
  if (typeof window === "undefined") return { user: null };

  let user: AdminSessionUser | null = null;
  try {
    user = await withTimeout(readSessionUser(), AUTH_WAIT_MS, "Checking your admin session");
  } catch {
    user = null;
  }

  if (!user) {
    throw redirect({ to: "/admin/login" });
  }

  if (!isAdminRole(user.role)) {
    throw redirect({ to: "/" });
  }

  return { user };
};

/**
 * Run a route's data loader behind requireAdmin().
 *
 * requireAdmin() runs first and its redirect is thrown outside the try, so
 * auth redirects are never swallowed. If the data fetch itself fails or hangs,
 * the route receives its empty fallback after DATA_WAIT_MS and the screen
 * degrades to an empty state instead of the root error page.
 */
export async function guardedLoader<T>(
  loader: (() => Promise<T>) | undefined,
  fallback: T,
): Promise<T> {
  await requireAdmin();
  if (!loader) return fallback;
  try {
    const data = await withTimeout(loader(), DATA_WAIT_MS, "Admin route loader");
    return (data ?? fallback) as T;
  } catch (error) {
    console.error("Admin route loader failed; serving empty fallback:", error);
    return fallback;
  }
}
