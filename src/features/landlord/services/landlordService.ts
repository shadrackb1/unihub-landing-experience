/**
 * Landlord service layer: registration, sign-in and profile reads.
 *
 * Everything goes through the platform session (better-auth) and the
 * Prisma-backed API, so a landlord account created here is the same account
 * the portal, the consent screen and the admin console see:
 *
 *  - `registerLandlord` creates the account, the PENDING profile and the
 *    consent records in one server call, then the browser signs in with the
 *    same credentials.
 *  - `signInLandlord` signs in and resolves the profile in one step.
 *  - `fetchLandlordProfile` distinguishes "no profile" from "backend
 *    unreachable" so the portal gate can show the right message.
 */
import { authClient } from "@/lib/auth-client";
import { withTimeout } from "@/shared/lib/withTimeout";

export type LandlordStatus = "pending" | "approved" | "rejected" | "suspended";

export interface LandlordProfile {
  userId: string;
  email: string;
  fullName: string;
  businessName: string;
  phone: string;
  whatsappNumber: string;
  targetCampuses: string[];
  estimatedProperties: number;
  status: LandlordStatus;
  reviewNote: string;
  consentGivenAt: string;
  createdAt: string;
}

export type ProfileResult =
  | { state: "ok"; profile: LandlordProfile }
  | { state: "missing" }
  | { state: "unavailable"; message: string };

export type RegisterLandlordInput = {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  phone: string;
  whatsappNumber: string;
  nationalId: string;
  targetCampuses: string[];
  estimatedProperties: number;
  reviewNote: string;
  /** The consent declaration statements the person ticked. */
  consentItems: string[];
};

export interface RegisteredLandlord {
  userId: string;
  email: string;
  fullName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  consentRecorded: boolean;
}

export const CONSENT_VERSION = "1.0";

/** Where to send a landlord once their profile status is known. */
export function homeForStatus(
  status: LandlordStatus,
): "/landlord" | "/landlord/pending" | "/landlord/rejected" | "/landlord/suspended" {
  switch (status) {
    case "pending":
      return "/landlord/pending";
    case "rejected":
      return "/landlord/rejected";
    case "suspended":
      return "/landlord/suspended";
    default:
      return "/landlord";
  }
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === "object") {
      const message = (payload as { error?: unknown }).error;
      if (typeof message === "string" && message.trim()) return message;
    }
  } catch {
    // Non-JSON error body; use the fallback.
  }
  return fallback;
}

/** The signed-in person's landlord profile. */
export async function fetchLandlordProfile(): Promise<ProfileResult> {
  try {
    const response = await withTimeout(
      fetch("/api/landlord/profile", { credentials: "include" }),
      10000,
      "Checking your profile",
    );

    if (response.status === 401) return { state: "missing" };
    if (!response.ok) {
      return {
        state: "unavailable",
        message: await readError(
          response,
          "We could not reach the server to check your landlord profile. Please try again.",
        ),
      };
    }

    const payload = (await response.json()) as { profile?: LandlordProfile | null };
    if (!payload.profile) return { state: "missing" };
    return { state: "ok", profile: payload.profile };
  } catch (error) {
    console.error("Landlord profile read failed:", error);
    return {
      state: "unavailable",
      message:
        "We could not reach the server to check your landlord profile. Check your connection and try again.",
    };
  }
}

/** Register, then sign in so the portal screens have a live session. */
export async function registerLandlord(input: RegisterLandlordInput): Promise<RegisteredLandlord> {
  const response = await fetch("/api/landlord/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(
      await readError(response, "We could not create your account. Please try again."),
    );
  }

  const created = (await response.json()) as RegisteredLandlord;

  const { error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });
  if (error) {
    // The account exists, so the person can sign in manually rather than
    // losing what they just filled in.
    throw new Error(
      "Your account was created, but we could not sign you in automatically. Sign in with the email and password you just chose.",
    );
  }

  return created;
}

/** Sign in and resolve the caller's landlord profile in one step. */
export async function signInLandlord(
  email: string,
  password: string,
): Promise<{ profile: ProfileResult }> {
  const { error } = await authClient.signIn.email({ email, password });
  if (error) {
    throw new Error(
      /invalid|credential|password/i.test(error.message ?? "")
        ? "That email and password did not match. Try again."
        : (error.message ?? "Sign in failed. Try again."),
    );
  }
  const profile = await fetchLandlordProfile();
  return { profile };
}

export async function signOutLandlord(): Promise<void> {
  await authClient.signOut();
}
