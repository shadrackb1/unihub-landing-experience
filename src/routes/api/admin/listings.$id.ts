import { createFileRoute } from "@tanstack/react-router";
import { HttpError, jsonError, requireRole } from "@/server/authz";
import {
  moderateListing,
  reviewAd,
  setFeatured,
  type ListingStatusValue,
} from "@/server/marketplace";

/**
 * One listing, from the administrator's side.
 *
 * PATCH { action: "moderate", status, note? }  publish / reject / hide
 * PATCH { action: "feature", featured }        show in the featured rail
 * PATCH { action: "reviewAd", approved }       approve or decline a boost
 */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

const STATUSES: ListingStatusValue[] = ["pending", "published", "rejected", "hidden"];

export async function handleAdminListing(request: Request, id: string): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);

    if (request.method !== "PATCH") {
      return json({ error: "Method not allowed." }, 405);
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return json({ error: "Send the change as JSON." }, 400);

    const action = body["action"];

    if (action === "moderate") {
      const status = body["status"];
      if (typeof status !== "string" || !STATUSES.includes(status as ListingStatusValue)) {
        throw new HttpError(400, "Status has to be pending, published, rejected or hidden.");
      }
      const note = typeof body["note"] === "string" ? body["note"] : undefined;
      await moderateListing(id, status as ListingStatusValue, note);
      return json({ ok: true, status });
    }

    if (action === "feature") {
      if (typeof body["featured"] !== "boolean") {
        throw new HttpError(400, "featured has to be true or false.");
      }
      await setFeatured(id, body["featured"]);
      return json({ ok: true, featured: body["featured"] });
    }

    if (action === "reviewAd") {
      if (typeof body["approved"] !== "boolean") {
        throw new HttpError(400, "approved has to be true or false.");
      }
      await reviewAd(id, body["approved"]);
      return json({ ok: true, adStatus: body["approved"] ? "live" : "inactive" });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/listings/$id")({
  server: {
    handlers: {
      PATCH: ({ request, params }) => handleAdminListing(request, params.id),
    },
  },
});
