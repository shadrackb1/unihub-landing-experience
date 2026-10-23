import { createFileRoute } from "@tanstack/react-router";
import { HttpError, jsonError, requireRole } from "@/server/authz";
import {
  createAgent,
  createCategory,
  createHostel,
  createProperty,
  createUniversity,
  listAgents,
  listCategories,
  listHostels,
  listProperties,
  listUniversities,
} from "@/server/adminContent";

/**
 * Administrator content, list and create.
 *
 * GET  /api/admin/content/:resource
 * POST /api/admin/content/:resource
 *
 * ADMIN only. One endpoint serves the whole console so every screen reads the
 * same SQLite tables the public site uses.
 */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function handleAdminContent(request: Request, resource: string): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);

    if (request.method === "GET") {
      switch (resource) {
        case "agents":
          return json({ items: await listAgents() });
        case "categories":
          return json({ items: await listCategories() });
        case "properties":
          return json({ items: await listProperties() });
        case "universities":
          return json({ items: await listUniversities() });
        case "hostels": {
          const universityId = new URL(request.url).searchParams.get("universityId") ?? undefined;
          return json({ items: await listHostels(universityId) });
        }
        default:
          throw new HttpError(404, `Unknown content type: ${resource}`);
      }
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Send the record as JSON.");

    switch (resource) {
      case "agents":
        return json({ item: await createAgent(body) }, 201);
      case "categories":
        return json({ item: await createCategory(body) }, 201);
      case "properties":
        return json({ item: await createProperty(body) }, 201);
      case "universities":
        return json({ item: await createUniversity(body) }, 201);
      case "hostels":
        return json({ item: await createHostel(body) }, 201);
      default:
        throw new HttpError(404, `Unknown content type: ${resource}`);
    }
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/content/$resource")({
  server: {
    handlers: {
      GET: ({ request, params }) => handleAdminContent(request, params.resource),
      POST: ({ request, params }) => handleAdminContent(request, params.resource),
    },
  },
});
