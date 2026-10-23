/**
 * The consent API.
 *
 * Three things live here:
 *   GET  /api/consent          what the caller has agreed to, and when
 *   POST /api/consent          record a grant, or withdraw consent
 *   GET  /api/consent/ledger   the whole ledger, for the administrator
 *
 * Rules the handler enforces:
 *   - The person is identified from a session cookie or a verified Firebase
 *     ID token. An email in the request body is never trusted.
 *   - Consent is granted per purpose. A tick for one purpose never grants
 *     another, and the wording and version shown to the person are stored
 *     with the record.
 *   - Withdrawal is always available and is recorded with a date and time.
 */
import { jsonError, requireRole } from "@/server/authz";
import {
  consentToCsv,
  grantConsent,
  listConsentForEmail,
  listConsentLedger,
  summarise,
  withdrawConsent,
} from "@/server/consent";
import { resolveConsentIdentity } from "@/server/consentIdentity";
import {
  DECLARATION_ITEMS,
  CONSENT_PURPOSES,
  CONSENT_WORDING_VERSION,
  REQUIRED_DECLARATION_ITEM_IDS,
  isConsentPurposeId,
  purposesFromDeclarationItems,
  type ConsentPurposeId,
} from "@/shared/consentPurposes";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (body && typeof body === "object") return body as Record<string, unknown>;
  } catch {
    // An empty or malformed body is handled by the caller.
  }
  return {};
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

/**
 * Turn the ticked declaration statements into the purposes they grant.
 * Every statement the form marks as required has to be present.
 */
export function resolveGrantPurposes(declarationItems: string[]): {
  purposes: ConsentPurposeId[];
  /** The statements that were not ticked. */
  missingItems: string[];
  /** The purposes that are required but were not granted. */
  missingPurposes: ConsentPurposeId[];
} {
  const known = new Set(DECLARATION_ITEMS.map((item) => item.id));
  const ticked = declarationItems.filter((id) => known.has(id));
  const missingItems = REQUIRED_DECLARATION_ITEM_IDS.filter((id) => !ticked.includes(id));
  const purposes = purposesFromDeclarationItems(ticked);
  const missingPurposes = CONSENT_PURPOSES.filter(
    (purpose) => purpose.required && !purposes.includes(purpose.id),
  ).map((purpose) => purpose.id);
  return { purposes, missingItems, missingPurposes };
}

/** GET and POST on /api/consent. */
export async function handleConsentRequest(request: Request): Promise<Response> {
  const identity = await resolveConsentIdentity(request);
  if (!identity) {
    return json(
      {
        error:
          "Sign in, or open this page from the account you registered, so that your consent can be recorded against you.",
      },
      401,
    );
  }

  if (request.method === "GET") {
    const records = await listConsentForEmail(identity.email);
    return json({
      identity: { email: identity.email, name: identity.name, method: identity.method },
      records,
      summary: summarise(records),
      wordingVersion: CONSENT_WORDING_VERSION,
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const body = await readBody(request);
  const action = typeof body["action"] === "string" ? body["action"] : "grant";

  if (action === "withdraw") {
    const requested = asStringArray(body["purposes"]);
    const unknown = requested.filter((id) => !isConsentPurposeId(id));
    if (unknown.length > 0) {
      return json({ error: `Unknown consent purpose: ${unknown.join(", ")}` }, 400);
    }
    const scope = body["scope"] === "all" || requested.length === 0 ? "all" : "selected";
    const withdrawn = await withdrawConsent(identity.email, requested, scope);
    const records = await listConsentForEmail(identity.email);
    return json({
      withdrawn,
      records,
      summary: summarise(records),
    });
  }

  // Grant.
  const ticked = asStringArray(body["declarationItems"]);
  const purposes = asStringArray(body["purposes"]).filter((id) => isConsentPurposeId(id));
  const unknownPurposes = asStringArray(body["purposes"]).filter((id) => !isConsentPurposeId(id));
  if (unknownPurposes.length > 0) {
    return json({ error: `Unknown consent purpose: ${unknownPurposes.join(", ")}` }, 400);
  }

  let grantedPurposes = purposes;
  if (ticked.length > 0) {
    const resolved = resolveGrantPurposes(ticked);
    if (resolved.missingItems.length > 0 || resolved.missingPurposes.length > 0) {
      const missingLabels = [
        ...resolved.missingItems.map(
          (id) => DECLARATION_ITEMS.find((item) => item.id === id)?.title ?? id,
        ),
        ...resolved.missingPurposes.map(
          (id) => CONSENT_PURPOSES.find((purpose) => purpose.id === id)?.title ?? id,
        ),
      ];
      return json(
        {
          error: `Please tick every required statement before you continue: ${missingLabels.join(
            ", ",
          )}.`,
        },
        400,
      );
    }
    grantedPurposes = resolved.purposes;
  }

  if (grantedPurposes.length === 0) {
    return json({ error: "No consent was selected." }, 400);
  }

  try {
    const created = await grantConsent({
      email: identity.email,
      name: identity.name,
      userId: identity.userId,
      purposes: grantedPurposes,
      ...(ticked.length > 0 ? { declarationItems: ticked } : {}),
      source: typeof body["source"] === "string" ? body["source"] : "consent-screen",
    });
    const records = await listConsentForEmail(identity.email);
    return json({ created, records, summary: summarise(records) });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "The consent could not be recorded." },
      400,
    );
  }
}

/**
 * GET /api/consent/ledger — the administrator's view of every consent
 * record, with a CSV export for the compliance file.
 */
export async function handleConsentLedgerRequest(request: Request): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN", "VIEWER"]);
  } catch (error) {
    return jsonError(error);
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");
  const purposeFilter = url.searchParams.get("purpose");
  const filters: { status?: "GRANTED" | "WITHDRAWN"; purpose?: ConsentPurposeId } = {};
  if (statusFilter === "GRANTED" || statusFilter === "WITHDRAWN") {
    filters.status = statusFilter;
  }
  if (purposeFilter && isConsentPurposeId(purposeFilter)) {
    filters.purpose = purposeFilter;
  }
  const records = await listConsentLedger(filters);

  if (url.searchParams.get("format") === "csv") {
    return new Response(consentToCsv(records), {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="unihub-consent-ledger.csv"',
        "cache-control": "no-store",
      },
    });
  }

  return json({ records, count: records.length });
}
