import { createFileRoute } from "@tanstack/react-router";
import { HttpError, jsonError, requireRole } from "@/server/authz";
import { reviewLandlord, type LandlordStatusValue } from "@/server/marketplace";

/**
 * PATCH /api/admin/landlords/$id
 *   { status: "pending" | "approved" | "rejected" | "suspended", note?: string }
 *
 * The decision is a human one and is recorded with the review note on the
 * profile, which is what the landlord's own status screen reads.
 */
const STATUSES: LandlordStatusValue[] = ["pending", "approved", "rejected", "suspended"];

export async function handleAdminLandlord(request: Request, id: string): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);

    if (request.method !== "PATCH") {
      return new Response(JSON.stringify({ error: "Method not allowed." }), {
        status: 405,
        headers: { "content-type": "application/json" },
      });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Send the decision as JSON.");

    const status = body["status"];
    if (typeof status !== "string" || !STATUSES.includes(status as LandlordStatusValue)) {
      throw new HttpError(400, "Status has to be pending, approved, rejected or suspended.");
    }
    const note = typeof body["note"] === "string" ? body["note"] : undefined;
    await reviewLandlord(id, status as LandlordStatusValue, note);

    return new Response(JSON.stringify({ ok: true, status }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/landlords/$id")({
  server: {
    handlers: {
      PATCH: ({ request, params }) => handleAdminLandlord(request, params.id),
    },
  },
});
