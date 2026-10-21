import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old hostel detail links now resolve to the listings index. */
export const Route = createFileRoute("/hostels/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/listings" });
  },
});
