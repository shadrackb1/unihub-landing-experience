import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/suspended")({
  component: () => <div>Landlord Suspended</div>,
});
