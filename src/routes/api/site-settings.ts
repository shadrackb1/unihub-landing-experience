import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireRole } from "@/server/authz";
import { getSiteSettings, saveSiteSettings } from "@/server/siteSettings";

/**
 * Site content.
 *
 * GET  /api/site-settings   public: what the marketing pages render.
 * PUT  /api/site-settings   administrator only: save the site builder.
 *
 * The public read is cacheable for a short window; the write is always
 * no-store and identifies the person who saved it.
 */
function json(body: unknown, status = 200, cache = "no-store"): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": cache },
  });
}

export async function handleSiteSettings(request: Request): Promise<Response> {
  if (request.method === "GET" || request.method === "HEAD") {
    try {
      const settings = await getSiteSettings();
      return json({ settings }, 200, "public, max-age=60, stale-while-revalidate=300");
    } catch (error) {
      return jsonError(error);
    }
  }

  if (request.method !== "PUT") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const user = await requireRole(request, ["ADMIN"]);
    const body: unknown = await request.json().catch(() => null);
    if (!body) return json({ error: "Send the site settings as JSON." }, 400);
    const settings = await saveSiteSettings(body, user.email);
    return json({ settings });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/site-settings")({
  server: {
    handlers: {
      GET: ({ request }) => handleSiteSettings(request),
      PUT: ({ request }) => handleSiteSettings(request),
    },
  },
});
