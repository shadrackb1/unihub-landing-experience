import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import { createListing, listLandlordListings } from "@/server/marketplace";

/**
 * A landlord's own listings.
 *
 * GET  /api/landlord/listings   list only the caller's listings
 * POST /api/landlord/listings   create a listing awaiting admin review
 *
 * The owner is taken from the session, never from the body, so one landlord
 * cannot create or read another landlord's listings.
 */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function handleLandlordListings(request: Request): Promise<Response> {
  try {
    const user = await requireRole(request, ["LANDLORD", "ADMIN"]);

    if (request.method === "GET") {
      return json({ listings: await listLandlordListings(user.id) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return json({ error: "Send the listing as JSON." }, 400);

    const id = await createListing(user.id, {
      title: typeof body["title"] === "string" ? body["title"] : "",
      campus: typeof body["campus"] === "string" ? body["campus"] : "",
      location: typeof body["location"] === "string" ? body["location"] : "",
      type: typeof body["type"] === "string" ? body["type"] : "",
      price: Number(body["price"] ?? 0),
      deposit: Number(body["deposit"] ?? 0),
      description: typeof body["description"] === "string" ? body["description"] : "",
      amenities: strings(body["amenities"]),
      images: strings(body["images"]),
      landlordName: typeof body["landlordName"] === "string" ? body["landlordName"] : undefined,
    });

    return json({ id, status: "pending" }, 201);
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/landlord/listings")({
  server: {
    handlers: {
      GET: ({ request }) => handleLandlordListings(request),
      POST: ({ request }) => handleLandlordListings(request),
    },
  },
});
