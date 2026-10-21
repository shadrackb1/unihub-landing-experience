import { createFileRoute } from "@tanstack/react-router";
import { handleConsentRequest } from "@/server/consentApi";

/**
 * Consent endpoint.
 *
 * GET  /api/consent  - what the signed-in person has agreed to, and when.
 * POST /api/consent  - record a grant, or withdraw consent.
 *
 * The handler lives in `src/server/consentApi.ts` so it can be exercised
 * directly by the tests without going through the router.
 */
export const Route = createFileRoute("/api/consent")({
  server: {
    handlers: {
      GET: ({ request }) => handleConsentRequest(request),
      POST: ({ request }) => handleConsentRequest(request),
    },
  },
});
