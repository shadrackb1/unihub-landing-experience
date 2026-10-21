/**
 * Browser-side client for the consent API.
 *
 * The request always carries the session cookie, and adds the Firebase ID
 * token when the person is signed in with Firebase instead. The email is
 * never sent from the browser: the server works it out from the credential.
 */
import type { ConsentPurposeId } from "@/shared/consentPurposes";

export interface ConsentRecordView {
  id: string;
  userId: string | null;
  email: string;
  name: string;
  purpose: ConsentPurposeId;
  purposeText: string;
  wordingVersion: string;
  acknowledgedItems: string[];
  status: "GRANTED" | "WITHDRAWN";
  grantedAt: string;
  withdrawnAt: string | null;
  source: string;
}

export interface ConsentSummaryItem {
  purpose: ConsentPurposeId;
  title: string;
  required: boolean;
  record: ConsentRecordView | null;
}

export interface ConsentState {
  identity: { email: string; name: string; method: string };
  records: ConsentRecordView[];
  summary: ConsentSummaryItem[];
  wordingVersion: string;
}

export class ConsentRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ConsentRequestError";
  }
}

function headers(token: string | null): HeadersInit {
  const base: Record<string, string> = { "content-type": "application/json" };
  if (token) base.authorization = `Bearer ${token}`;
  return base;
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function call(
  path: string,
  init: { method: string; body?: unknown; token: string | null },
): Promise<Record<string, unknown>> {
  const response = await fetch(path, {
    method: init.method,
    headers: headers(init.token),
    credentials: "include",
    ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
  });
  const payload = await readJson(response);
  if (!response.ok) {
    const message =
      typeof payload.error === "string"
        ? payload.error
        : "The request could not be completed. Please try again.";
    throw new ConsentRequestError(message, response.status);
  }
  return payload;
}

export function loadConsent(token: string | null): Promise<ConsentState> {
  return call("/api/consent", { method: "GET", token }) as Promise<ConsentState>;
}

export function grantConsentItems(
  declarationItems: string[],
  token: string | null,
): Promise<{ created: ConsentRecordView[]; records: ConsentRecordView[] }> {
  return call("/api/consent", {
    method: "POST",
    body: { action: "grant", declarationItems },
    token,
  }) as Promise<{ created: ConsentRecordView[]; records: ConsentRecordView[] }>;
}

export function withdrawConsentItems(
  purposes: ConsentPurposeId[] | "all",
  token: string | null,
): Promise<{ withdrawn: ConsentRecordView[]; records: ConsentRecordView[] }> {
  return call("/api/consent", {
    method: "POST",
    body:
      purposes === "all"
        ? { action: "withdraw", scope: "all" }
        : { action: "withdraw", purposes },
    token,
  }) as Promise<{ withdrawn: ConsentRecordView[]; records: ConsentRecordView[] }>;
}
