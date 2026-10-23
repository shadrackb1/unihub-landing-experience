import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/agents/new")({
  component: () => <div>New Admin Agent</div>,
});
