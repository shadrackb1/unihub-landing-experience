import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/login")({
  component: () => <div>Landlord Login</div>,
});
