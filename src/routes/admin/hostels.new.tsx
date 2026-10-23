import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/hostels/new")({
  component: () => <div>New Admin Hostel</div>,
});
