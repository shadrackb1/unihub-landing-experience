import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/properties/new")({
  component: () => <div>New Admin Property</div>,
});
