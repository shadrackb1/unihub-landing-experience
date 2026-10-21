import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy property URLs used to forward into the hash-routed legacy app, which
 * rendered a blank page when its data could not load. Property details now
 * live at /listings/$id, so send old links to the listings index instead of a
 * dead end.
 */
export const Route = createFileRoute("/properties/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/listings" });
  },
});
