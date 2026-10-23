/**
 * Consent service.
 *
 * Rules implemented here (Data Protection Act, 2019 s.32; Data Protection
 * (General) Regulations, 2021 reg. 4):
 *
 *  - Consent is recorded per purpose. There is no single "all purposes" row,
 *    so a tick for one purpose is never treated as a tick for another.
 *  - Every row stores the wording the person actually saw, the version of
 *    that wording, and the date and time of the grant.
 *  - Withdrawal is always available and always recorded with a date and time.
 *    Withdrawal never deletes the earlier record: the row is marked withdrawn
 *    so the trail of what was agreed and when remains auditable.
 *  - The record set is append-only for grants. Re-granting a purpose after a
 *    withdrawal creates a new row rather than rewriting history.
 */
import { prisma } from "@/server/db";
import { ConsentPurpose as PrismaConsentPurpose } from "@/generated/prisma/enums";
import {
  CONSENT_PURPOSES,
  CONSENT_WORDING_VERSION,
  isConsentPurposeId,
  purposeWording,
  type ConsentPurposeId,
} from "@/shared/consentPurposes";

export interface GrantInput {
  email: string;
  name: string;
  userId?: string | null;
  purposes: string[];
  /**
   * The ids of the consent declaration statements that were ticked. Stored on
   * the record so the file shows what the person actually agreed to, not
   * only which purpose the agreement was filed under.
   */
  declarationItems?: string[];
  source?: string;
}

export interface ConsentRow {
  id: string;
  userId: string | null;
  email: string;
  name: string;
  purpose: ConsentPurposeId;
  purposeText: string;
  wordingVersion: string;
  /** The declaration statements ticked at the time, split back into a list. */
  acknowledgedItems: string[];
  status: "GRANTED" | "WITHDRAWN";
  grantedAt: string;
  withdrawnAt: string | null;
  source: string;
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * The database enum and the shared catalogue carry the same values, so a
 * purpose that came from the catalogue can be written straight to the
 * database. The cast keeps the two definitions in one place each.
 */
function toDbPurpose(purpose: ConsentPurposeId): PrismaConsentPurpose {
  return purpose as unknown as PrismaConsentPurpose;
}

function toRow(record: {
  id: string;
  userId: string | null;
  email: string;
  name: string;
  purpose: string;
  purposeText: string;
  wordingVersion: string;
  acknowledgedItems?: string | null;
  status: string;
  grantedAt: Date;
  withdrawnAt: Date | null;
  source: string;
}): ConsentRow {
  return {
    id: record.id,
    userId: record.userId,
    email: record.email,
    name: record.name,
    purpose: record.purpose as ConsentPurposeId,
    purposeText: record.purposeText,
    wordingVersion: record.wordingVersion,
    acknowledgedItems: splitItems(record.acknowledgedItems),
    status: record.status as "GRANTED" | "WITHDRAWN",
    grantedAt: record.grantedAt.toISOString(),
    withdrawnAt: record.withdrawnAt ? record.withdrawnAt.toISOString() : null,
    source: record.source,
  };
}

/** The ticked statement ids are stored as one comma separated column. */
function splitItems(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Record a grant for each purpose the person ticked.
 * Unknown purpose ids are rejected rather than silently stored.
 */
export async function grantConsent(input: GrantInput): Promise<ConsentRow[]> {
  const email = normaliseEmail(input.email);
  if (!email || !email.includes("@")) {
    throw new Error("A valid email address is required to record consent.");
  }
  const name = input.name.trim();
  if (!name) {
    throw new Error("A name is required to record consent.");
  }

  // An unknown purpose is a client error, so it is reported before the
  // "nothing selected" check — otherwise a typo would look like an empty
  // selection and the real cause would be hidden.
  const rejected = input.purposes.filter((id) => id && !isConsentPurposeId(id));
  if (rejected.length > 0) {
    throw new Error(`Unknown consent purpose: ${rejected.join(", ")}`);
  }

  const purposes = input.purposes.filter(
    (id) => id && isConsentPurposeId(id),
  ) as ConsentPurposeId[];
  if (purposes.length === 0) {
    throw new Error("At least one purpose must be selected.");
  }

  const grantedAt = new Date();
  const created: ConsentRow[] = [];
  const acknowledgedItems = (input.declarationItems ?? []).filter(Boolean).join(",");

  for (const purpose of purposes) {
    // A fresh grant supersedes an earlier withdrawal of the same purpose, so
    // the current state of the person's consent is unambiguous.
    const open = await prisma.consentRecord.findFirst({
      where: { email, purpose: toDbPurpose(purpose), status: "GRANTED", withdrawnAt: null },
      orderBy: { grantedAt: "desc" },
    });

    if (open) {
      created.push(toRow(open));
      continue;
    }

    const record = await prisma.consentRecord.create({
      data: {
        userId: input.userId ?? null,
        email,
        name,
        purpose: toDbPurpose(purpose),
        purposeText: purposeWording(purpose),
        wordingVersion: CONSENT_WORDING_VERSION,
        acknowledgedItems: acknowledgedItems || null,
        status: "GRANTED",
        grantedAt,
        source: input.source ?? "consent-screen",
      },
    });
    created.push(toRow(record));
  }

  return created;
}

/**
 * Withdraw consent for one purpose, or for every purpose the person holds.
 * Returns the rows that were updated so the caller can show the outcome.
 */
export async function withdrawConsent(
  email: string,
  purposes?: string[],
  scope: "all" | "selected" = "selected",
): Promise<ConsentRow[]> {
  const normalised = normaliseEmail(email);
  if (!normalised) {
    throw new Error("An email address is required to withdraw consent.");
  }

  const targets = purposes
    ?.filter((id) => isConsentPurposeId(id))
    .map((id) => id as ConsentPurposeId);

  const open = await prisma.consentRecord.findMany({
    where: {
      email: normalised,
      status: "GRANTED",
      withdrawnAt: null,
      ...(scope === "selected" && targets && targets.length > 0
        ? { purpose: { in: targets.map(toDbPurpose) } }
        : {}),
    },
  });

  const withdrawnAt = new Date();
  const updated: ConsentRow[] = [];

  for (const record of open) {
    const next = await prisma.consentRecord.update({
      where: { id: record.id },
      data: { status: "WITHDRAWN", withdrawnAt },
    });
    updated.push(toRow(next));
  }

  return updated;
}

/** Every consent record held for one email, newest first. */
export async function listConsentForEmail(email: string): Promise<ConsentRow[]> {
  const records = await prisma.consentRecord.findMany({
    where: { email: normaliseEmail(email) },
    orderBy: [{ purpose: "asc" }, { grantedAt: "desc" }],
  });
  return records.map(toRow);
}

/** The full ledger — administrator only. */
export async function listConsentLedger(filters?: {
  status?: "GRANTED" | "WITHDRAWN";
  purpose?: ConsentPurposeId;
}): Promise<ConsentRow[]> {
  const records = await prisma.consentRecord.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.purpose ? { purpose: toDbPurpose(filters.purpose) } : {}),
    },
    orderBy: [{ grantedAt: "desc" }],
  });
  return records.map(toRow);
}

/** Current state of consent per purpose for one email. */
export function summarise(records: ConsentRow[]) {
  const current = new Map<ConsentPurposeId, ConsentRow>();
  for (const record of records) {
    const existing = current.get(record.purpose);
    if (!existing) {
      current.set(record.purpose, record);
      continue;
    }
    // Prefer an open grant over a withdrawal, and a newer row over an older one.
    const existingOpen = existing.status === "GRANTED";
    const incomingOpen = record.status === "GRANTED";
    if (incomingOpen && !existingOpen) current.set(record.purpose, record);
    else if (incomingOpen === existingOpen && record.grantedAt > existing.grantedAt) {
      current.set(record.purpose, record);
    }
  }
  return CONSENT_PURPOSES.map((purpose) => ({
    purpose: purpose.id,
    title: purpose.title,
    required: purpose.required,
    record: current.get(purpose.id) ?? null,
  }));
}

const CSV_COLUMNS = [
  "id",
  "email",
  "name",
  "purpose",
  "wordingVersion",
  "acknowledgedItems",
  "status",
  "grantedAt",
  "withdrawnAt",
  "source",
  "purposeText",
] as const;

export function consentToCsv(records: ConsentRow[]): string {
  const escape = (value: unknown) => {
    const text = Array.isArray(value)
      ? value.join(" ")
      : value === null || value === undefined
        ? ""
        : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [CSV_COLUMNS.join(",")];
  for (const record of records) {
    lines.push(
      CSV_COLUMNS.map((column) =>
        escape((record as unknown as Record<string, unknown>)[column]),
      ).join(","),
    );
  }
  return lines.join("\n");
}
