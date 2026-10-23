import { createFileRoute } from "@tanstack/react-router";
import { HttpError, jsonError, requireRole } from "@/server/authz";
import {
  getProperty,
  updateAgent,
  updateCategory,
  updateHostel,
  updateProperty,
  updateUniversity,
} from "@/server/adminContent";
import { prisma } from "@/server/db";

/**
 * Administrator content, one record.
 *
 * GET    /api/admin/content/:resource/:id
 * PATCH  /api/admin/content/:resource/:id
 * DELETE /api/admin/content/:resource/:id
 *
 * ADMIN only, and every write is checked against the same session lookup the
 * rest of the admin API uses.
 */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function deleteRecord(resource: string, id: string): Promise<void> {
  switch (resource) {
    case "agents":
      await prisma.agent.delete({ where: { id } });
      return;
    case "categories":
      await prisma.category.delete({ where: { id } });
      return;
    case "properties":
      await prisma.property.delete({ where: { id } });
      return;
    case "universities":
      await prisma.university.delete({ where: { id } });
      return;
    case "hostels":
      await prisma.hostel.delete({ where: { id } });
      return;
    default:
      throw new HttpError(404, `Unknown content type: ${resource}`);
  }
}

export async function handleAdminContentRecord(
  request: Request,
  resource: string,
  id: string,
): Promise<Response> {
  try {
    await requireRole(request, ["ADMIN"]);

    if (request.method === "GET") {
      if (resource === "properties") {
        const item = await getProperty(id);
        if (!item) throw new HttpError(404, "That property no longer exists.");
        return json({ item });
      }
      throw new HttpError(404, `Reading a single ${resource} record is not supported.`);
    }

    if (request.method === "DELETE") {
      await deleteRecord(resource, id);
      return json({ ok: true });
    }

    if (request.method !== "PATCH") {
      return json({ error: "Method not allowed." }, 405);
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Send the change as JSON.");

    switch (resource) {
      case "agents":
        return json({ item: await updateAgent(id, body) });
      case "categories":
        return json({ item: await updateCategory(id, body) });
      case "properties":
        return json({ item: await updateProperty(id, body) });
      case "universities":
        return json({ item: await updateUniversity(id, body) });
      case "hostels":
        return json({ item: await updateHostel(id, body) });
      default:
        throw new HttpError(404, `Unknown content type: ${resource}`);
    }
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/admin/content/$resource/$id")({
  server: {
    handlers: {
      GET: ({ request, params }) => handleAdminContentRecord(request, params.resource, params.id),
      PATCH: ({ request, params }) => handleAdminContentRecord(request, params.resource, params.id),
      DELETE: ({ request, params }) =>
        handleAdminContentRecord(request, params.resource, params.id),
    },
  },
});
