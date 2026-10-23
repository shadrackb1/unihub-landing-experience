import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/rejected")({
  component: () => <div>Landlord Rejected</div>,
});
