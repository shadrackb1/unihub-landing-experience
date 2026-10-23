import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/categories/new")({
  component: () => <div>New Admin Category</div>,
});
