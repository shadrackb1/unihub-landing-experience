import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import { importExtractedRecordsCsv, type ImportResult } from "@/server/dataTransfer";

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
 * POST /api/data/import/extracted
 *
 * Imports hostel records from a CSV file (multipart/form-data with field "file").
 * Only ADMIN can import. The CSV must contain the required columns:
 * hostelName, campus, category, rentKsh, capacity, distanceKm, sourceFile, sourceLine
 *
 * Validation: every row is checked before storage. Invalid rows are rejected and reported.
 * Duplicate (hostelName, campus) pairs are upserted.
 */
export const Route = createFileRoute("/api/data/import")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await requireRole(request, ["ADMIN"]);
        } catch (error) {
          return jsonError(error);
        }

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
          return json({ error: "Request must be multipart/form-data with a file field named 'file'" }, 400);
        }

        const formData = await request.formData();
        const file = formData.get("file");
        if (!file || typeof file === "string") {
          return json({ error: "No file uploaded. Use a 'file' field in the multipart form." }, 400);
        }

        const csv = await file.text();
        const result: ImportResult = await importExtractedRecordsCsv(csv);

        return json({ imported: result.accepted, rejected: result.rejected, errors: result.errors });
      },
    },
  },
});