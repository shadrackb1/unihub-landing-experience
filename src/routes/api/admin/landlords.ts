import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import { listLandlords } from "@/server/marketplace";

/**
 * Landlord applications, for the admin vetting queue.
 *
 * GET /api/admin/landlords
 *
 * ADMIN only. Includes the national ID because the reviewer needs it to match
 * the documents; it is never exposed on a public route.
 */
export async function handleAdminLandlords(request: Request): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);
    const landlords = await listLandlords();
    return new Response(JSON.stringify({ landlords }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/landlords")({
  server: {
    handlers: {
      GET: ({ request }) => handleAdminLandlords(request),
    },
  },
});
