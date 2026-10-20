import { redirect } from '@tanstack/react-router';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';

/**
 * Route-loader safe auth guard.
 *
 * IMPORTANT: loaders run OUTSIDE React rendering, so this must never call
 * hooks like useAuth()/useContext() — that throws an "invalid hook call"
 * which surfaces as the root error page ("This page didn't load").
 * Instead we await Firebase's own auth state resolution.
 */

const AUTH_WAIT_MS = 8000;
/** Max time a guarded data fetch may take before we serve the empty fallback. */
const DATA_WAIT_MS = 6000;

function waitForUser(): Promise<User | null> {
  return new Promise((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;
    let unsubscribe: () => void;
    const finish = (user: User | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      resolve(user);
    };
    timer = setTimeout(() => finish(auth.currentUser), AUTH_WAIT_MS);
    unsubscribe = onAuthStateChanged(auth, finish, () => finish(auth.currentUser));
  });
}

export function getAdminEmails(): string[] {
  const raw = (import.meta.env['VITE_ADMIN_EMAILS'] ?? '') as string;
  return raw
    .split(',')
    .map((email: string) => email.trim().toLowerCase())
    .filter((email: string) => email.length > 0);
}

/**
 * Single source of truth for "is this account an admin?".
 * Used by both the route loaders (requireAdmin) and the admin layout guard
 * so the sidebar cannot be rendered for an account the loaders would reject.
 *
 * With no VITE_ADMIN_EMAILS configured we allow any signed-in account in
 * development (matching requireAdmin) and log a warning.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return true;
  return adminEmails.includes((email ?? '').toLowerCase());
}

export const requireAdmin = async () => {
  // Admin subtree is client-only (ssr:false); skip during any server pass.
  if (typeof window === 'undefined') return { user: null as User | null };

  const user = await waitForUser();

  if (!user) {
    throw redirect({ to: '/admin/login' });
  }

  const adminEmails = getAdminEmails();

  // For development, if no admin emails are configured, allow access (but warn in console)
  if (adminEmails.length === 0) {
    console.warn('VITE_ADMIN_EMAILS not configured - allowing all authenticated users access to admin');
    return { user };
  }

  if (!adminEmails.includes((user.email || '').toLowerCase())) {
    throw redirect({ to: '/' });
  }

  return { user };
};

/** Firestore rejects in ms; a hung promise never will. */
async function withTimeout<A>(promise: Promise<A>, ms: number, what: string): Promise<A> {
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${what} timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

/**
 * Run a route's data loader behind requireAdmin().
 *
 * requireAdmin() runs first and its redirect is thrown outside the try, so
 * auth redirects are never swallowed. If the data fetch itself fails or hangs
 * (e.g. Firestore unreachable — its "database not found" state hangs reads
 * forever), the route receives its empty fallback after DATA_WAIT_MS and the
 * screen degrades to an empty state instead of the root error page.
 */
export async function guardedLoader<T>(
  loader: (() => Promise<T>) | undefined,
  fallback: T,
): Promise<T> {
  await requireAdmin();
  if (!loader) return fallback;
  try {
    const data = await withTimeout(loader(), DATA_WAIT_MS, 'Admin route loader');
    return (data ?? fallback) as T;
  } catch (error) {
    console.error('Admin route loader failed; serving empty fallback:', error);
    return fallback;
  }
}
