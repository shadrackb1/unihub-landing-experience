import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import {
  consentToCsv,
  exportExtractedRecordsCsv,
  exportListingsCsv,
  listConsentForEmail,
} from "@/server/dataTransfer";
import { handleConsentRequest } from "@/server/consentApi";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

/**
 * GET /api/data/export?type=listings|extracted|consent
 *
 * Returns CSV export for the requested dataset.
 * - listings: all platform listings (ADMIN only)
 * - extracted: imported hostel records from public notices (ADMIN only)
 * - consent: the caller's own consent records (any signed-in user)
 *
 * ADMIN routes check role on the server; hiding the link is never what keeps
 * the data private.
 */
export const Route = createFileRoute("/api/data/export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const type = url.searchParams.get("type");

        if (type === "consent") {
          // Delegate to the consent API for personal consent export
          return handleConsentRequest(request);
        }

        // Admin-only exports
        try {
          await requireRole(request, ["ADMIN"]);
        } catch (error) {
          return jsonError(error);
        }

        if (type === "listings") {
          const csv = await exportListingsCsv();
          return new Response(csv, {
            status: 200,
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "content-disposition": 'attachment; filename="unihub-listings.csv"',
              "cache-control": "no-store",
            },
          });
        }

        if (type === "extracted") {
          const csv = await exportExtractedRecordsCsv();
          return new Response(csv, {
            status: 200,
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "content-disposition": 'attachment; filename="unihub-extracted-hostels.csv"',
              "cache-control": "no-store",
            },
          });
        }

        return json({ error: "Unknown export type. Use type=listings|extracted|consent" }, 400);
      },
    },
  },
});