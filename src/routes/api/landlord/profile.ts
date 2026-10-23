import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser, jsonError } from "@/server/authz";
import { getLandlordProfile } from "@/server/landlord";

/**
 * The signed-in person's landlord profile.
 *
 * GET /api/landlord/profile
 *   200 { profile: {...} }   the profile, in the portal's lowercase shape
 *   200 { profile: null }    signed in, but no landlord profile yet
 *   401                      not signed in
 *
 * The profile is looked up by the session's user id, never by an id sent from
 * the browser, so one landlord cannot read another's details.
 */
export async function handleLandlordProfile(request: Request): Promise<Response> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Sign in to view your landlord profile." }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    const profile = await getLandlordProfile(user.id);
    return new Response(JSON.stringify({ profile }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export const Route = createFileRoute("/api/landlord/profile")({
  server: {
    handlers: {
      GET: ({ request }) => handleLandlordProfile(request),
    },
  },
});
