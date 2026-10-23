import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord")({
  component: () => <div>Landlord Portal</div>,
});
