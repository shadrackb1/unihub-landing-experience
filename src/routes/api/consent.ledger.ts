import { createFileRoute } from "@tanstack/react-router";
import { handleConsentLedgerRequest } from "@/server/consentApi";

/**
 * The consent ledger.
 *
 * GET /api/consent/ledger          every consent record, as JSON.
 * GET /api/consent/ledger?format=csv  the same records, as a CSV export for
 * the compliance file.
 *
 * Access is checked on the server against the role on the signed session, so
 * hiding the link is never what keeps the ledger private.
 */
export const Route = createFileRoute("/api/consent/ledger")({
  server: {
    handlers: {
      GET: ({ request }) => handleConsentLedgerRequest(request),
    },
  },
});
