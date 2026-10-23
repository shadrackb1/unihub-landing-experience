import { createAuthClient } from "better-auth/react";

/**
 * Where the auth API lives.
 *
 * The auth API is served by this same app (`/api/auth/*`), so in the browser
 * the client always talks to the origin the page was loaded from. That works
 * on localhost, on the production domain and on Vercel preview URLs without
 * any build-time configuration. (Reading a build-time env var here used to
 * fall back to http://localhost:8080 on Vercel, so every sign-in from the
 * deployed site failed with "Failed to fetch".)
 *
 * During SSR there is no window, so the configured app URL is used; no auth
 * request is issued from the server through this client.
 */
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (import.meta.env["VITE_APP_URL"] as string | undefined) || "http://localhost:8080";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

/** True when an auth error means the server could not be reached at all. */
export function isNetworkErrorMessage(message: string | undefined | null): boolean {
  return /failed to fetch|networkerror|load failed|network request failed/i.test(message ?? "");
}

export const SERVER_UNREACHABLE_MESSAGE =
  "We could not reach the UniHub server. Check your connection and try again.";
