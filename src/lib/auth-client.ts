import { createAuthClient } from "better-auth/react";

/**
 * Where the auth API lives.
 *
 * In development the app is served from whichever port the dev server picked,
 * so the browser talks to its own origin. In production the deployed origin
 * is used. Either way the cookie is sent with the request, so the session
 * works on the same host that serves the page.
 */
const baseURL =
  import.meta.env.DEV && typeof window !== "undefined"
    ? window.location.origin
    : (import.meta.env["VITE_APP_URL"] as string) || "http://localhost:8080";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
