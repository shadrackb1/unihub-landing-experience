import { createFileRoute } from "@tanstack/react-router";
import { HttpError, jsonError, requireRole } from "@/server/authz";
import { deleteListing, requestAd, updateListingStatus } from "@/server/marketplace";

/**
 * One landlord listing.
 *
 * PATCH  { action: "status", status: "published" | "hidden" }
 * PATCH  { action: "requestAd", plan: "week" | "fortnight" | "month" | ... }
 * DELETE remove the listing from the caller's account
 *
 * Every action is scoped to a listing the caller owns; a request for somebody
 * else's listing answers 404 rather than revealing that it exists.
 */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function handleLandlordListing(request: Request, id: string): Promise<Response> {
  try {
    const user = await requireRole(request, ["LANDLORD", "ADMIN"]);

    if (request.method === "DELETE") {
      await deleteListing(user.id, id);
      return json({ ok: true });
    }

    if (request.method !== "PATCH") {
      return json({ error: "Method not allowed." }, 405);
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return json({ error: "Send the change as JSON." }, 400);

    const action = body["action"];
    if (action === "status") {
      const status = body["status"];
      if (status !== "published" && status !== "hidden") {
        throw new HttpError(400, "Status has to be published or hidden.");
      }
      await updateListingStatus(user.id, id, status);
      return json({ ok: true, status });
    }

    if (action === "requestAd") {
      const plan = typeof body["plan"] === "string" ? body["plan"] : "";
      await requestAd(user.id, id, plan);
      return json({ ok: true, adStatus: "requested" });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/landlord/listings/$id")({
  server: {
    handlers: {
      PATCH: ({ request, params }) => handleLandlordListing(request, params.id),
      DELETE: ({ request, params }) => handleLandlordListing(request, params.id),
    },
  },
});
