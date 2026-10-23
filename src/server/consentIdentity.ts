/**
 * Who is making a consent request.
 *
 * A consent record is only worth keeping if it can be tied to a person the
 * server can check. The email address is therefore never read from the
 * request body: it is taken either from a signed session cookie or from a
 * Firebase ID token that the server verifies with Google before it trusts
 * it. A request that carries neither is refused.
 */
import fs from "node:fs";
import path from "node:path";

import { getSessionUser } from "@/server/authz";

export type IdentityMethod = "session" | "firebase";

export interface ConsentIdentity {
  email: string;
  name: string;
  /** The account id when the platform's own session is used. */
  userId: string | null;
  method: IdentityMethod;
}

/**
 * The Firebase Web API key. It is a public identifier, not a secret — it is
 * already shipped in the browser bundle — and it is only used here to ask
 * Google to verify an ID token that the browser presents.
 */
function readApiKeyFromConfigFile(): string | null {
  const candidates = [
    path.join(process.cwd(), "firebase-applet-config.json"),
    path.resolve(process.cwd(), "..", "firebase-applet-config.json"),
  ];
  for (const candidate of candidates) {
    try {
      if (!fs.existsSync(candidate)) continue;
      const parsed = JSON.parse(fs.readFileSync(candidate, "utf8")) as {
        apiKey?: string;
      };
      if (parsed.apiKey) return parsed.apiKey;
    } catch {
      // Try the next candidate; a missing or unreadable file is not fatal
      // here, the caller reports a clear error if no key can be found.
    }
  }
  return null;
}

export function firebaseApiKey(): string | null {
  const fromEnv = process.env["FIREBASE_API_KEY"] ?? process.env["VITE_FIREBASE_API_KEY"];
  if (fromEnv) return fromEnv;
  const fromBuild = import.meta.env?.["VITE_FIREBASE_API_KEY"] as string | undefined;
  if (fromBuild) return fromBuild;
  return readApiKeyFromConfigFile();
}

interface FirebaseAccount {
  email?: string | undefined;
  displayName?: string | undefined;
}

/**
 * Ask Google to verify a Firebase ID token and return the account it
 * belongs to. Returns null when the token is missing, expired, or not a
 * Firebase token at all.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseAccount | null> {
  const apiKey = firebaseApiKey();
  if (!apiKey) {
    console.error("No Firebase API key is configured, so a Firebase token cannot be verified.");
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!response.ok) {
      console.error(`Firebase token verification failed: ${response.status}`);
      return null;
    }
    const payload = (await response.json()) as { users?: FirebaseAccount[] };
    const account = payload.users?.[0];
    if (!account?.email) return null;
    return { email: account.email, displayName: account.displayName };
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return null;
  }
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!token || !scheme || scheme.toLowerCase() !== "bearer") return null;
  const trimmed = token.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Resolve the caller.
 *
 * The platform session is tried first, then a Firebase ID token. The email
 * that is stored is always one the server has verified.
 */
export async function resolveConsentIdentity(request: Request): Promise<ConsentIdentity | null> {
  const sessionUser = await getSessionUser(request);
  if (sessionUser) {
    return {
      email: sessionUser.email,
      name: sessionUser.name || sessionUser.email,
      userId: sessionUser.id,
      method: "session",
    };
  }

  const token = bearerToken(request);
  if (!token) return null;

  const account = await verifyFirebaseIdToken(token);
  if (!account?.email) return null;

  return {
    email: account.email,
    name: account.displayName || account.email,
    userId: null,
    method: "firebase",
  };
}
