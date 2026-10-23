import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/pending")({
  component: () => <div>Landlord Pending</div>,
});
