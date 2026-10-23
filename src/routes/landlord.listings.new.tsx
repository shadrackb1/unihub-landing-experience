import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/listings/new")({
  component: () => <div>New Landlord Listing</div>,
});
