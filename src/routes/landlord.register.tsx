import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/register")({
  component: () => <div>Landlord Register</div>,
});
