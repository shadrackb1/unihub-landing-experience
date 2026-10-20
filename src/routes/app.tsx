import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The hash-routed prototype that used to live here is superseded by the real
 * routes. It was still reachable at /app and rendered a second, older product
 * UI (different logo, nav and layout), which is a credibility problem for
 * anyone who bookmarked it. Send those visitors to the live listings instead.
 */
export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    throw redirect({ to: "/listings" });
  },
});
