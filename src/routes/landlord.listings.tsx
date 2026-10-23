import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/listings")({
  component: () => <div>Landlord Listings</div>,
});
