import { createFileRoute } from "@tanstack/react-router";
import { jsonError } from "@/server/authz";
import { registerLandlordAccount, type RegisterLandlordInput } from "@/server/landlord";

/**
 * Landlord registration.
 *
 * POST /api/landlord/register
 *   { email, password, fullName, businessName, phone, whatsappNumber,
 *     nationalId, targetCampuses, estimatedProperties, reviewNote,
 *     consentItems }
 *
 * Creates the better-auth account, the PENDING landlord profile and one
 * consent record per purpose. The browser signs in afterwards with the same
 * credentials; no session cookie is handed out by this endpoint.
 */
function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function handleLandlordRegister(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await request.json();
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Send the registration as JSON." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const input: RegisterLandlordInput = {
    email: asString(body["email"]),
    password: asString(body["password"]),
    fullName: asString(body["fullName"]),
    businessName: asString(body["businessName"]),
    phone: asString(body["phone"]),
    whatsappNumber: asString(body["whatsappNumber"]),
    nationalId: asString(body["nationalId"]),
    targetCampuses: asStringArray(body["targetCampuses"]),
    estimatedProperties: Number(body["estimatedProperties"] ?? 0),
    reviewNote: asString(body["reviewNote"]),
    consentItems: asStringArray(body["consentItems"]),
  };

  try {
    const created = await registerLandlordAccount(input);
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/landlord/register")({
  server: {
    handlers: {
      POST: ({ request }) => handleLandlordRegister(request),
    },
  },
});
