import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ads")({
  component: () => <div>Admin Ads</div>,
});
