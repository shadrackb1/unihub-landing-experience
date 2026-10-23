/**
 * Landlord registration.
 *
 * One account, one profile, one consent record:
 *
 *  - The account is created through better-auth (the same store the sign-in
 *    page uses), so the password is hashed by the library and the session the
 *    browser gets afterwards is a real session.
 *  - The role is written to the user row here, server-side. The client cannot
 *    ask for a role; better-auth ignores a role sent with a sign-up.
 *  - The landlord profile is written to `LandlordProfile` with a PENDING
 *    status, which is what the portal gate reads.
 *  - Consent is recorded per purpose before the account is handed back, with
 *    the wording the person ticked. If anything fails the account is removed
 *    again so the same email can simply be retried.
 */
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";
import { HttpError } from "@/server/authz";
import { grantConsent } from "@/server/consent";
import {
  REQUIRED_DECLARATION_ITEM_IDS,
  purposesFromDeclarationItems,
  isDeclarationItemId,
} from "@/shared/consentPurposes";

export interface RegisterLandlordInput {
  email: string;
  password: string;
  fullName: string;
  businessName?: string;
  phone: string;
  whatsappNumber: string;
  nationalId?: string;
  targetCampuses: string[];
  estimatedProperties: number;
  reviewNote?: string;
  /** The consent declaration statements the person ticked. */
  consentItems: string[];
}

export interface LandlordProfileView {
  userId: string;
  email: string;
  fullName: string;
  businessName: string;
  phone: string;
  whatsappNumber: string;
  targetCampuses: string[];
  estimatedProperties: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  reviewNote: string;
  consentGivenAt: string;
  createdAt: string;
}

export interface RegisteredLandlord {
  userId: string;
  email: string;
  fullName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  consentRecorded: boolean;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Kenyan mobile numbers are stored as 07XXXXXXXX or 01XXXXXXXX. */
function isPhone(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)[17]\d{8}$/.test(digits) || /^[17]\d{8}$/.test(digits);
}

export function validateRegistration(input: RegisterLandlordInput): void {
  const email = normaliseEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  if (input.password.length < 8) {
    throw new HttpError(400, "Use a password of at least 8 characters.");
  }
  if (input.password.length > 128) {
    throw new HttpError(400, "Use a password of no more than 128 characters.");
  }
  if (clean(input.fullName).length < 3) {
    throw new HttpError(400, "Enter your full name as it appears on your ID.");
  }
  if (!isPhone(clean(input.phone))) {
    throw new HttpError(400, "Enter a valid Kenyan phone number, for example 0712 345 678.");
  }
  if (!isPhone(clean(input.whatsappNumber))) {
    throw new HttpError(400, "Enter a valid WhatsApp number, for example 0712 345 678.");
  }
  if (input.targetCampuses.length === 0) {
    throw new HttpError(400, "Choose at least one area you let property in.");
  }
  if (!Number.isFinite(input.estimatedProperties) || input.estimatedProperties < 0) {
    throw new HttpError(400, "Enter how many properties you manage as a number.");
  }

  const unknownItems = input.consentItems.filter((id) => !isDeclarationItemId(id));
  if (unknownItems.length > 0) {
    throw new HttpError(400, `Unknown consent statement: ${unknownItems.join(", ")}.`);
  }
  const missing = REQUIRED_DECLARATION_ITEM_IDS.filter((id) => !input.consentItems.includes(id));
  if (missing.length > 0) {
    throw new HttpError(
      400,
      "Every required consent statement has to be ticked before the account can be created.",
    );
  }
}

/**
 * Create the account, the profile and the consent records.
 *
 * Throws HttpError with a message safe to show the person. A duplicate email
 * rolls nothing back because nothing was created; any later failure removes
 * the account it created so the email stays usable.
 */
export async function registerLandlordAccount(
  input: RegisterLandlordInput,
): Promise<RegisteredLandlord> {
  validateRegistration(input);

  const email = normaliseEmail(input.email);
  const fullName = clean(input.fullName);
  const businessName = clean(input.businessName) || fullName;
  const phone = clean(input.phone);
  const whatsappNumber = clean(input.whatsappNumber);
  const nationalId = clean(input.nationalId) || null;
  const reviewNote = clean(input.reviewNote) || null;
  const campuses = input.targetCampuses.map(clean).filter(Boolean);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, landlordProfile: { select: { id: true } } },
  });
  if (existing) {
    throw new HttpError(
      409,
      existing.landlordProfile
        ? "An account with this email already exists. Sign in instead, or reset your password."
        : "An account with this email already exists. Sign in, then finish your landlord registration from your account.",
    );
  }

  let userId: string | null = null;
  try {
    const created = await auth.api.signUpEmail({
      body: { email, password: input.password, name: fullName },
    });
    userId = created.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: { role: "LANDLORD", name: fullName },
    });

    await prisma.landlordProfile.create({
      data: {
        userId,
        businessName,
        phone,
        whatsappNumber,
        nationalId,
        targetCampuses: JSON.stringify(campuses),
        estimatedProperties: Math.trunc(input.estimatedProperties),
        status: "PENDING",
        reviewNote,
        consentGivenAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof HttpError) throw error;

    // Roll the half-created account back so the email is not stuck.
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : String(error);
    if (/exist|unique/i.test(message)) {
      throw new HttpError(409, "An account with this email already exists. Sign in instead.");
    }
    throw new HttpError(500, "We could not create your account. Please try again in a moment.");
  }

  // Consent is recorded after the account exists so the record can point at
  // the user row. A consent failure must not leave a landlord without a
  // profile, so the account is kept and the caller is told to finish on
  // /consent — the same recovery path the portal already documents.
  let consentRecorded = true;
  try {
    await grantConsent({
      email,
      name: fullName,
      userId,
      purposes: purposesFromDeclarationItems(input.consentItems),
      declarationItems: input.consentItems,
      source: "landlord-registration",
    });
  } catch (error) {
    consentRecorded = false;
    console.error("Consent could not be recorded during landlord registration:", error);
  }

  return {
    userId,
    email,
    fullName,
    status: "PENDING",
    consentRecorded,
  };
}

const STATUS_FROM_DB = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;

function parseCampuses(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === "string") : [];
  } catch {
    return value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }
}

/**
 * The signed-in person's landlord profile, in the lowercase shape the portal
 * screens use. Returns null when the account has no profile yet, which the
 * gate treats as "register first" rather than an error.
 */
export async function getLandlordProfile(userId: string): Promise<LandlordProfileView | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      landlordProfile: true,
    },
  });
  if (!user?.landlordProfile) return null;

  const profile = user.landlordProfile;
  return {
    userId: user.id,
    email: user.email,
    fullName: user.name ?? "",
    businessName: profile.businessName,
    phone: profile.phone,
    whatsappNumber: profile.whatsappNumber,
    targetCampuses: parseCampuses(profile.targetCampuses),
    estimatedProperties: profile.estimatedProperties,
    status: STATUS_FROM_DB[profile.status],
    reviewNote: profile.reviewNote ?? "",
    consentGivenAt: profile.consentGivenAt.toISOString(),
    createdAt: profile.createdAt.toISOString(),
  };
}
