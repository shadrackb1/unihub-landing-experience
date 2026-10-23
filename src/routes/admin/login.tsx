import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  component: () => <div>Admin Login</div>,
});
