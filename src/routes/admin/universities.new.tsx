import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/universities/new")({
  component: () => <div>New Admin University</div>,
});
