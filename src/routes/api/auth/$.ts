import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

/**
 * Better Auth request handler.
 *
 * TanStack Start only mounts a route file that exports a `Route`, so the
 * handler is registered here with the server `handlers` option. The splat
 * route id (`/api/auth/$`) is what the client in `src/lib/auth-client.ts`
 * calls for every auth request.
 */
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
