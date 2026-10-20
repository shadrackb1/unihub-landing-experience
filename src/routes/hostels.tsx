import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Hostels are browsed on the listings page now. The old redirect into the
 * hash-routed legacy app could land on a blank screen, so stale links and
 * bookmarks land somewhere useful instead.
 */
export const Route = createFileRoute("/hostels")({
  beforeLoad: () => {
    throw redirect({ to: "/listings" });
  },
});

