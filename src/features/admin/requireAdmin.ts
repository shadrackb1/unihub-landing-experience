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

function getAdminEmails(): string[] {
  const raw = (import.meta.env['VITE_ADMIN_EMAILS'] ?? '') as string;
  return raw
    .split(',')
    .map((email: string) => email.trim().toLowerCase())
    .filter((email: string) => email.length > 0);
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
