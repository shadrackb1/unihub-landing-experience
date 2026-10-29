import { createFileRoute } from "@tanstack/react-router";
import { AdminAgentsPage } from "@/features/admin/pages/AdminAgentsPage";

export const Route = createFileRoute("/admin/agents")({
  component: AdminAgentsPage,
});
