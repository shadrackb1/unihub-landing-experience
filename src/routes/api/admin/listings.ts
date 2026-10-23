import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import { listAllListings } from "@/server/marketplace";

/**
 * Every listing, for the admin moderation queue.
 *
 * GET /api/admin/listings
 *
 * ADMIN only. The role is read from the database against the session, so a
 * landlord or viewer cannot reach moderation data by calling the URL.
 */
export async function handleAdminListings(request: Request): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);
    const listings = await listAllListings();
    return new Response(JSON.stringify({ listings }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/listings")({
  server: {
    handlers: {
      GET: ({ request }) => handleAdminListings(request),
    },
  },
});
