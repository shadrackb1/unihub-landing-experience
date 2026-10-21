/**
 * Landlord service layer: registration, sign-in and profile reads.
 *
 * - Registration rolls the Firebase Auth account back if the Firestore
 *   profile write fails, so a failed attempt never leaves an orphaned
 *   account that blocks a retry with EMAIL_EXISTS.
 * - Registration records an explicit consent stamp on the profile.
 * - Profile reads distinguish "no profile" from "backend unreachable", so
 *   the portal gate can show the right message instead of flashing
 *   "profile not found" while Firestore is down.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
  type User,
} from "firebase/auth";
import { auth, db } from "@/shared/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { withTimeout } from "@/shared/lib/withTimeout";

export type LandlordStatus = "pending" | "approved" | "rejected" | "suspended";

export interface LandlordProfile {
  uid: string;
  email: string;
  fullName: string;
  businessName?: string;
  phone: string;
  whatsappNumber: string;
  nationalId?: string;
  targetCampuses: string[];
  estimatedProperties: number;
  status: LandlordStatus;
  reviewNote?: string;
  consent?: {
    givenAt: string;
    version: string;
    /** The consent declaration statements that were ticked. */
    items?: string[];
    /** The purposes the consent was recorded under. */
    purposes?: string[];
  };
  createdAt?: unknown;
  updatedAt?: unknown;
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
  /** The purposes those statements granted. */
  consentPurposes: string[];
};

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

export async function fetchLandlordProfile(uid: string): Promise<ProfileResult> {
  try {
    const snap = await withTimeout(
      getDoc(doc(db, "landlords", uid)),
      8000,
      "Checking your profile",
    );
    if (!snap.exists()) return { state: "missing" };
    return { state: "ok", profile: snap.data() as LandlordProfile };
  } catch (error) {
    console.error("Landlord profile read failed:", error);
    return {
      state: "unavailable",
      message: "We could not reach the server to check your landlord profile. Please try again.",
    };
  }
}

/** Sign in and resolve the caller's landlord profile in one step. */
export async function signInLandlord(
  email: string,
  password: string,
): Promise<{ user: User; profile: ProfileResult }> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await fetchLandlordProfile(credential.user.uid);
  return { user: credential.user, profile };
}

/**
 * Create the auth account and the landlord profile document.
 * If the profile write fails the auth account is deleted again so the
 * same email can simply be retried.
 */
export async function registerLandlord(input: RegisterLandlordInput): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);

  try {
    await updateProfile(credential.user, { displayName: input.fullName });
    await withTimeout(
      setDoc(doc(db, "landlords", credential.user.uid), {
        uid: credential.user.uid,
        email: input.email,
        fullName: input.fullName,
        businessName: input.businessName,
        phone: input.phone,
        whatsappNumber: input.whatsappNumber,
        nationalId: input.nationalId,
        targetCampuses: input.targetCampuses,
        estimatedProperties: input.estimatedProperties,
        status: "pending",
        reviewNote: input.reviewNote,
        consent: {
          givenAt: new Date().toISOString(),
          version: CONSENT_VERSION,
          items: input.consentItems,
          purposes: input.consentPurposes,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      8000,
      "Saving your profile",
    );
  } catch (error) {
    console.error("Landlord profile write failed, rolling back auth account:", error);
    try {
      await deleteUser(credential.user);
    } catch (rollbackError) {
      console.error("Auth rollback failed:", rollbackError);
    }
    throw new Error(
      "We could not save your landlord profile, so no account was kept. Please try again.",
    );
  }

  return credential.user;
}
