import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => <div>Admin Dashboard</div>,
});
